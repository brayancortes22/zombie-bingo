document.addEventListener('DOMContentLoaded', function() {
    const nombreUsuario = localStorage.getItem('nombre_usuario');
    if (nombreUsuario) {
        document.getElementById('nombreUsuario').textContent = nombreUsuario;
    }
});

                function cerrarSesion() {
                    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    window.location.href = '../php/cerrar_sesion.php';
}
}
function cambiarIcono() {
    const icono = document.getElementById('iconoSonido');
    
    // Cambiar el icono según el estado actual
    if (icono.classList.contains('bi-volume-up')) {
        icono.classList.remove('bi-volume-up');
        icono.classList.add('bi-volume-down');
    } else if (icono.classList.contains('bi-volume-down')) {
        icono.classList.remove('bi-volume-down');
        icono.classList.add('bi-volume-mute');
    } else {
        icono.classList.remove('bi-volume-mute');
        icono.classList.add('bi-volume-up');
    }
}

function redireccion(){
    window.location.href='cargando.html'
  }