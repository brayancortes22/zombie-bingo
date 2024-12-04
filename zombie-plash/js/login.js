// Función que se ejecuta cuando el formulario es enviado
function redirectAfterLogin(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma normal

    // Mostrar una alerta de confirmación antes de redirigir
    Swal.fire({
        title: 'Iniciando sesión',
        text: 'Serás redirigido a la página de inicio.',
        icon: 'info',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        // Redirige a la página de cargando con el redirect a la página de inicio
        window.location.href = './cargando.html?redirect=./inicio.php';
    });
}