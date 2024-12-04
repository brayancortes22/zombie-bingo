function cerrarSesion() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de que quieres cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.clear();
            window.location.href = '../php/cerrar_sesion.php';
        }
    });
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
