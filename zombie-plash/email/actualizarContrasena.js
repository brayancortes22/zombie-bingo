document.addEventListener('DOMContentLoaded', function() {
    const formContrasena = document.getElementById('formContrasena');
    
    formContrasena.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nuevaContrasena = document.getElementById('nuevaContrasena').value;
        const confirmarContrasena = document.getElementById('confirmarContrasena').value;

        // Validaciones del lado del cliente
        if (nuevaContrasena.length < 6) {
            Swal.fire({
                title: 'Error',
                text: 'La contraseña debe tener al menos 6 caracteres',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        if (nuevaContrasena !== confirmarContrasena) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
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
                Swal.fire({
                    title: 'Éxito',
                    text: 'Contraseña actualizada correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    window.location.href = '../html/login.php';
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error: ' + data.message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al actualizar la contraseña',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        });
    });
}); 