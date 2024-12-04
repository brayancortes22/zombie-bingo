document.addEventListener('DOMContentLoaded', function() {
    // Manejar el envío del formulario de verificación
    const formVerificacion = document.querySelector('form');
    
    formVerificacion.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const digit1 = document.getElementById('digit1').value;
        const digit2 = document.getElementById('digit2').value;
        const digit3 = document.getElementById('digit3').value;
        const digit4 = document.getElementById('digit4').value;

        const codigoCompleto = digit1 + digit2 + digit3 + digit4;
        document.getElementById('codigo').value = codigoCompleto;

        const formData = new FormData();
        formData.append('codigo', codigoCompleto);

        fetch('../email/codigo1.php', {
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
                window.location.href = './restablecimientoContra2.html';
            } else {
                Swal.fire({
                    title: 'Código incorrecto',
                    text: data.message || 'El código ingresado es incorrecto.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al verificar el código',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        });
    });

    // Manejar la entrada de dígitos
    const inputs = document.querySelectorAll('.cua');
    inputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value.length === 1) {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
}); 