document.addEventListener('DOMContentLoaded', function() {
    const avatarActual = document.getElementById('avatarActual');
    const nombreCompleto = document.getElementById('nombreCompleto');
    const userId = document.getElementById('userId');
    const guardarPerfil = document.getElementById('guardarPerfil');
    const fileInput = document.getElementById('fileInput');
    let selectedAvatar = null;

    // Obtener datos del perfil
    fetch('../php/PerfilJugador.php?action=obtener')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                nombreCompleto.textContent = data.data.nombre;
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
                alert('Perfil actualizado correctamente');
                localStorage.setItem('nombre_usuario', nombre);
            } else {
                alert('Error al actualizar el perfil: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al actualizar el perfil:', error);
        });
    });
});