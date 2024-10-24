document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    // Limpiar mensajes de error previos
    document.querySelectorAll('.error').forEach(function(el) {
        el.textContent = '';
    });

    // Verificar que las contraseñas coincidan
    var password = document.getElementById('contraseña').value;
    var confirmPassword = document.getElementById('confirmar_contraseña').value;

    if (password !== confirmPassword) {
        document.getElementById('confirmar_ContraseñaError').textContent = 'Las contraseñas no coinciden';
        return; // Detener el envío del formulario
    }

    // Realizar la validación mediante AJAX
    var formData = new FormData(this);

    fetch('../php/registro.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            alert('Registro exitoso');
            window.location.href = '../html/login.php';
        } else {
            // Mostrar errores específicos
            if (data.errors.nombre) {
                document.getElementById('nombreError').textContent = data.errors.nombre;
            }
            if (data.errors.correo) {
                document.getElementById('correoError').textContent = data.errors.correo;
            }
            if (data.errors.contraseña) {
                document.getElementById('contraseñaError').textContent = data.errors.contraseña;
            }
            if (data.errors.confirmar_contraseña) {
                document.getElementById('confirmar_ContraseñaError').textContent = data.errors.confirmar_contraseña;
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
