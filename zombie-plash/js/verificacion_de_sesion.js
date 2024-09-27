$(document).ready(function() {
    // Seleccionar el formulario y agregar el evento de envío
    $('#formulario').on('submit', function(event) {
        event.preventDefault(); // Prevenir el envío predeterminado del formulario

        // Obtener los valores de los campos del formulario
        var nombre = $('#nombre').val();
        var contraseña = $('#contraseña').val();

        // Enviar la solicitud AJAX al servidor para verificar el inicio de sesión
        $.ajax({
            url: '../php/solicitud_sesion.php', // Asegúrate de que la ruta esté correcta
            type: 'POST',
            data: {
                nombre: nombre,
                contraseña: contraseña
            },
            success: function(response) {
                // Mostrar el mensaje de respuesta en el div #mensaje
                $('#mensaje').html(response);
                
                // Puedes manejar las redirecciones según la respuesta recibida
                if (response.includes("exito")) {
                    window.location.href = './html/inicio_juego.html'; // Redirigir si la autenticación fue exitosa
                }
            },
            error: function(xhr, status, error) {
                // Manejar errores y mostrar el mensaje en el div #mensaje
                $('#mensaje').html("<span style='color: red;'>Ocurrió un error: " + error + "</span>");
            }
        });
    });
});
