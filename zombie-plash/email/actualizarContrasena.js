document.addEventListener('DOMContentLoaded', function() {
    const formContrasena = document.getElementById('formContrasena');
    
    formContrasena.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nuevaContrasena = document.getElementById('nuevaContrasena').value;
        const confirmarContrasena = document.getElementById('confirmarContrasena').value;

        // Validaciones del lado del cliente
        if (nuevaContrasena.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (nuevaContrasena !== confirmarContrasena) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Enviar datos al servidor
        fetch('../email/actualizarContrasena.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nuevaContrasena: nuevaContrasena,
                confirmarContrasena: confirmarContrasena
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Contraseña actualizada correctamente');
                window.location.href = '../html/login.php';
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar la contraseña');
        });
    });
}); 