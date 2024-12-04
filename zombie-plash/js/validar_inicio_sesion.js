document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    // Limpiar mensajes de error previos
    document.querySelectorAll('.error').forEach(function(el) {
        el.textContent = '';
    });

    var formData = new FormData(this);

    fetch('../php/inicio_sesion.php', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Asegura que las cookies de sesión se envíen
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta completa del servidor:', data);
        if (data.success) {
            console.log('Inicio de sesión exitoso:', data.session_info);
            Swal.fire({
                title: 'Éxito',
                text: 'Inicio de sesión exitoso. Redirigiendo...',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                localStorage.setItem('id_jugador', data.session_info["id_usuario"]);
                window.location.href = '../html/inicio.php'; // Asegúrate de que esta ruta sea correcta
            });
        } else {
            // Mostrar error general
            const errorMessage = data.errors && data.errors.general ? data.errors.general : 'Ocurrió un error desconocido';
            Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
        if (data.debug) {
            console.log('Información de depuración:', data.debug);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error de conexión con el servidor',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
});
