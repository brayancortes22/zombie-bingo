document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    // Limpiar mensajes de error previos
    document.querySelectorAll('.error').forEach(function(el) {
        el.textContent = '';
    });

    var formData = new FormData(this);

    fetch('../php/inicio_sesion.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('Inicio de sesión exitoso, redirigiendo...');
            window.location.href = './inicio.php'; // Asegúrate de que esta ruta sea correcta
        } else {
            // Mostrar error general
            if (data.errors && data.errors.general) {
                document.getElementById('generalError').textContent = data.errors.general;
            } else {
                document.getElementById('generalError').textContent = 'Ocurrió un error desconocido';
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('generalError').textContent = 'Error de conexión con el servidor';
    });
});
