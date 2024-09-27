
$(document).ready(function() {
    $('#formulario').on('submit', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente

        var password = $('#contraseña').val();
        var confirmPassword = $('#confirmar_contraseña').val();

        // Validación de contraseñas
        if (password !== confirmPassword) {
            $('#mensaje').text(alert("Las contraseñas no coinciden.")).css('color', 'red');
            return; // No continuar
        }

        // Enviar la solicitud AJAX
        $.ajax({
            url: '../php/registro.php', // Cambia a la ruta de tu archivo PHP
            type: 'POST',
            data: $(this).serialize(), // Serializa los datos del formulario
            success: function(response) {
                $('#mensaje').html(response); // Muestra la respuesta del servidor
                $('#formulario')[0].reset(); // Reinicia el formulario
            },
            error: function() {
                $('#mensaje').text("Ocurrió un error en la solicitud.").css('color', 'red');
            }
        });
    });
});

