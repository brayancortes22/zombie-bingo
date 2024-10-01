$(document).ready(function() {
    $('#formulario').on('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data
        var nombre = $('#nombre_usu').val();
        var contraseña = $('#contraseña_usu').val();

        // Send AJAX request to PHP script
        $.ajax({
            url: '../php/solicitud_sesion.php',
            type: 'POST',
            data: {
                nombre: nombre,
                contraseña: contraseña
            },
            success: function(response) {
                // Display response message
                $('#mensaje').html(response);

                // Redirect to game page if login is successful
                if (response.includes("exito")) {
                    // alert('holaaaaaaaaaa');
                    // window.location.href = '../html/inicio_juego.html';
                }
            },
            error: function(xhr, status, error) {
                // Display error message
                $('#mensaje').html("<span style='color: red;'>Ocurrió un error: " + error + "</span>",
                    window.location.href = '../html/login.html'
                );
            }
        });
    });
});