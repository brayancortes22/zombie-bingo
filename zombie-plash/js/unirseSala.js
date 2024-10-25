document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('unirseSalaForm');
    if (!form) {
        console.error('El formulario no se encontró en el DOM');
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        var formData = new FormData(this);

        fetch('../php/unirseSala.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            let mensaje = '';
            if (data.success) {
                localStorage.setItem('datosSala', JSON.stringify({
                    id_sala: data.id_sala,
                    contraseña_sala: data.contraseña_sala,
                    jugadores_conectados: data.jugadores_conectados,
                    max_jugadores: data.max_jugadores
                }));
                mensaje = '¡Te has unido a la sala con éxito!';
                // Redirigir a la página de jugadores en sala
                window.location.href = 'jugadoresSala.html';
            } else {
                if (data.error === 'foreign_key_constraint') {
                    mensaje = 'Error: El jugador no está registrado correctamente. Por favor, asegúrate de estar registrado antes de unirte a una sala.';
                } else {
                    mensaje = 'Error al unirse a la sala: ' + data.message;
                }
            }
            
            mostrarMensaje(mensaje);
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al conectar con el servidor');
        });
    });
});

function mostrarMensaje(mensaje) {
    console.log(mensaje); // Siempre mostramos el mensaje en la consola

    // Intentamos actualizar el elemento HTML si existe
    const mensajeElement = document.getElementById('mensajeUnirse');
    if (mensajeElement) {
        mensajeElement.textContent = mensaje;
    }

    // Mostramos una alerta
    alert(mensaje);
}
