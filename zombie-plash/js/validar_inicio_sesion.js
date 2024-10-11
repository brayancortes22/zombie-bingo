document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    // Limpiar mensajes de error previos
    document.querySelectorAll('.error').forEach(function(el) {
        el.textContent = '';
    });

    // Ya no necesitamos verificar que las contraseñas coincidan para el inicio de sesión

    // Realizar la validación mediante AJAX
    var formData = new FormData(this);

    fetch('../php/inicio_sesion.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  
        if (data.success) {
            alert('Inicio de sesión exitoso');
            window.location.href = '../html/inicio.html';
        } else {
            // Mostrar error general
            if (data.errors.general) {
                document.getElementById('generalError').textContent = data.errors.general;
            }
            // Ya no necesitamos errores específicos para nombre, correo, etc.
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});