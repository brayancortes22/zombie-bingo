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
            alert('Inicio de sesión exitoso. Redirigiendo...');
            localStorage.setItem('id_jugador', data.session_info["id_usuario"]);
            window.location.href = '../html/inicio.php'; // Asegúrate de que esta ruta sea correcta
        } else {
            // Mostrar error general
            if (data.errors && data.errors.general) {
                document.getElementById('generalError').textContent = data.errors.general;
            } else {
                document.getElementById('generalError').textContent = 'Ocurrió un error desconocido';
            }
        }
        if (data.debug) {
            console.log('Información de depuración:', data.debug);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('generalError').textContent = 'Error de conexión con el servidor';
    });
});
