document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de perfil
    if (!document.getElementById('avatarActual')) {
        // No estamos en la página de perfil, no hacer nada
        return;
    }

    // Verificar que los elementos existan antes de usarlos
    const avatarActual = document.getElementById('avatarActual');
    const nombreCompleto = document.getElementById('nombreCompleto');
    const userId = document.getElementById('userId');
    const guardarPerfil = document.getElementById('guardarPerfil');
    const fileInput = document.getElementById('fileInput');

    // Verificar que todos los elementos necesarios existan
    if (!avatarActual || !nombreCompleto || !userId || !guardarPerfil || !fileInput) {
        console.error('No se encontraron todos los elementos necesarios');
        return;
    }

    let selectedAvatar = null;
    let originalNombre = '';

    // Obtener datos del perfil
    fetch('../php/PerfilJugador.php?action=obtener')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                nombreCompleto.textContent = data.data.nombre;
                originalNombre = data.data.nombre; // Guardar el nombre original
                userId.textContent = data.data.id;
                avatarActual.src = `../uploads/avatars/${data.data.avatar}`;
            } else {
                console.error('Error al obtener datos del perfil:', data.message);
            }
        });

    // Seleccionar avatar
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedAvatar = this.getAttribute('data-avatar');
            avatarActual.src = `../img/${selectedAvatar}`;
        });
    });

    // Previsualizar imagen subida
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarActual.src = e.target.result;
                selectedAvatar = null; // Reset selected avatar
            };
            reader.readAsDataURL(file);
        }
    });

    // Editar nombre
    nombreCompleto.contentEditable = true;

    // Guardar cambios
    guardarPerfil.addEventListener('click', function() {
        const nombre = nombreCompleto.textContent.trim();
        const formData = new FormData();
        formData.append('nombre', nombre);

        // Solo añadir avatar si hay uno seleccionado o subido
        if (fileInput.files[0]) {
            formData.append('avatar', fileInput.files[0]);
        } else if (selectedAvatar) {
            formData.append('avatarPredefinido', selectedAvatar);
        }

        fetch('../php/PerfilJugador.php?action=actualizar', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: 'Perfil actualizado',
                    text: 'cambios de foto de perfil aplicados correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });

                localStorage.setItem('nombre_usuario', nombre);

                // Verificar si el nombre ha cambiado
                if (nombre !== originalNombre) {
                    Swal.fire({
                        title: 'Nombre cambiado',
                        text: 'cambios de nombre aplicados correctamente, debes de cerrar sesión y volver a iniciar sesión para que se apliquen los cambios correctamente',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, cerrar sesión',
                        cancelButtonText: 'No, continuar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // Lógica para cerrar sesión
                            fetch('../php/cerrar_sesion.php', { method: 'POST' })
                                .then(() => {
                                    window.location.href = '../html/login.php'; // Redirigir a la página de inicio de sesión
                                });
                        } else {
                            Swal.fire('Puedes continuar sin cerrar sesión.');
                        }
                    });
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al actualizar el perfil: ' + data.message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error al actualizar el perfil:', error);
        });
    });
});