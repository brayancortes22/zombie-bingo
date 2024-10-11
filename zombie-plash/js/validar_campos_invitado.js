document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    // Limpiar mensajes de error previos
    document.querySelectorAll('.error').forEach(function(el) {
        el.textContent = '';
    });
 
    // Realizar la validación mediante AJAX
    var formData = new FormData(document.querySelector('form'));

    fetch('../php/invitado.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  
        if (data.success) {
            alert('Registro exitoso');
            window.location.href = '../html/inicio.html';
        } else {
            // Mostrar errores específicos
            if (data.errors.apodo) {
                document.getElementById('apodoError').textContent = data.errors.apodo;
            
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
