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
                // Guardar el ID del jugador si no existe
                if (!localStorage.getItem('id_jugador')) {
                    localStorage.setItem('id_jugador', data.id_jugador);
                }
                
                // Guardar datos de la sala
                localStorage.setItem('datosSala', JSON.stringify({
                    id_sala: data.id_sala,
                    contraseña_sala: data.contraseña_sala,
                    jugadores_conectados: data.jugadores_conectados,
                    max_jugadores: data.max_jugadores
                }));
                
                // Guardar ID de sala específicamente
                localStorage.setItem('id_sala', data.id_sala);
                
                console.log('Datos guardados:', { // Debug
                    datosSala: localStorage.getItem('datosSala'),
                    id_sala: localStorage.getItem('id_sala'),
                    id_jugador: localStorage.getItem('id_jugador')
                });
                
                window.location.href = 'jugadoresSala.html';
            } else {
                mostrarMensaje(data.message || 'Error al unirse a la sala');
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
    alert(mensaje);
}