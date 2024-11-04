$(document).ready(function() {
    console.log('Script cargado correctamente');

    $('#formulario').on('submit', function(e) {
        e.preventDefault();
        console.log('Formulario enviado');
        
        const apodo = $('#apodo').val().trim();
        console.log('Apodo a enviar:', apodo);
        
        // Validación básica
        if (apodo.length < 3) {
            $('#apodoError').text('El apodo debe tener al menos 3 caracteres');
            return;
        }
        
        // Mostrar que se está procesando
        $('#apodoError').text('Procesando...');
        
        // Enviar datos mediante AJAX
        $.ajax({
            url: '../php/registrar_invitado.php',
            type: 'POST',
            data: { apodo: apodo },
            dataType: 'json',
            success: function(response) {
                console.log('Respuesta completa del servidor:', response);
                if (response.success) {
                    alert('Registro exitoso');
                    window.location.href = './inicio.php';
                } else {
                    $('#apodoError').text(response.message || 'Error al registrar');
                }
            },
            error: function(xhr, status, error) {
                console.error('Error detallado:', {
                    error: error,
                    status: status,
                    responseText: xhr.responseText
                });
                
                // Intentar parsear la respuesta por si es JSON
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    $('#apodoError').text(errorResponse.message || 'Error en el servidor');
                } catch(e) {
                    $('#apodoError').text('Error en el servidor: ' + xhr.responseText);
                }
            }
        });
    });
});
