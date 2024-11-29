document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los elementos
    const elementos = {
        avatarActual: document.getElementById('avatarActual'),
        nombreCompleto: document.getElementById('nombreCompleto'),
        userId: document.getElementById('userId'),
        guardarPerfil: document.getElementById('guardarPerfil'),
        fileInput: document.getElementById('fileInput')
    };

    // Verificar si estamos en la página correcta
    if (!elementos.nombreCompleto || !elementos.userId) {
        // Si no estamos en la página de perfil, salimos silenciosamente
        return;
    }

    let selectedAvatar = null;

    // Obtener datos del perfil
    fetch('../php/PerfilJugador.php?action=obtener')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Verificar que los elementos existan antes de modificarlos
                elementos.nombreCompleto && (elementos.nombreCompleto.textContent = data.data.nombre);
                elementos.userId && (elementos.userId.textContent = data.data.id);
                elementos.avatarActual && (elementos.avatarActual.src = `../uploads/avatars/${data.data.avatar}`);
                
                // Guardar el nombre en localStorage para uso en otras páginas
                localStorage.setItem('nombre_usuario', data.data.nombre);
            } else {
                console.error('Error al obtener datos del perfil:', data.message);
            }
        })
        .catch(error => {
            console.error('Error al obtener datos del perfil:', error);
        });

    // Seleccionar avatar
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedAvatar = this.getAttribute('data-avatar');
            elementos.avatarActual && (elementos.avatarActual.src = `../img/${selectedAvatar}`);
        });
    });

    // Previsualizar imagen subida
    elementos.fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                elementos.avatarActual && (elementos.avatarActual.src = e.target.result);
                selectedAvatar = null; // Reset selected avatar
            };
            reader.readAsDataURL(file);
        }
    });

    // Editar nombre
    elementos.nombreCompleto.contentEditable = true;

    // Guardar cambios
    elementos.guardarPerfil.addEventListener('click', function() {
        const nombre = elementos.nombreCompleto.textContent.trim();
        const avatar = selectedAvatar || elementos.avatarActual.src.split('/').pop();

        fetch('../php/PerfilJugador.php?action=actualizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, avatar })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Perfil actualizado correctamente. El nombre de usuario para iniciar sesión también se actualizará al cerrar sesión.');
                localStorage.setItem('nombre_usuario', nombre); // Guardar en localStorage
        
            } else {
                alert('Error al actualizar el perfil: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al actualizar el perfil:', error);
        });
    });
});