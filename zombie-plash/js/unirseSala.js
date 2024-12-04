document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('unirseSalaForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        var formData = new FormData(this);

        fetch('../php/unirse_sala/unirseSala.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta del servidor:', data); // Debug
            
            if (data.success) {
                // Guardar datos completos en localStorage
                localStorage.setItem('datosSala', JSON.stringify({
                    id_sala: data.id_sala,
                    id_jugador: data.id_jugador,
                    nombre_jugador: data.nombre_jugador,
                    contraseña_sala: data.contraseña_sala,
                    max_jugadores: data.max_jugadores,
                    jugadores_conectados: data.jugadores_conectados,
                    rol: 'participante' // Importante: añadir el rol
                }));
                
                window.location.href = 'jugadoresSala.html';
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al conectar con el servidor');
        });
    });
});

function mostrarMensaje(mensaje) {
    console.log(mensaje); // Debug
    const mensajeElement = document.getElementById('mensajeUnirse');
    if (mensajeElement) {
        mensajeElement.textContent = mensaje;
    }
    Swal.fire({
        title: 'Información',
        text: mensaje,
        icon: 'info',
        confirmButtonText: 'Aceptar'
    });
}