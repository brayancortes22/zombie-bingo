
// Función que se ejecuta cuando el formulario es enviado
 function redirectAfterLogin(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma normal

    // Redirige a la página de cargando con el redirect a la página de inicio
    window.location.href = './cargando.html?redirect=./inicio.php';
}

// Función que se ejecuta cuando el formulario es enviado
function redirectAfterLogin(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma normal

    // Redirige a la página de cargando con el redirect a la página de inicio
    window.location.href = './cargando.html?redirect=./inicio.php';
}