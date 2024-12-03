document.getElementById('crearSalaForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    fetch('../php/crear_sala/crearSala.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Guardar el ID del jugador
            localStorage.setItem('id_jugador', data.id_jugador);
            localStorage.setItem('id_sala', data.id_sala);
            
            // Guardar todos los datos relevantes en localStorage
            localStorage.setItem('datosSala', JSON.stringify({
                id_sala: data.id_sala,
                nombre_jugador: data.nombre_jugador,
                contraseña_sala: data.contraseña_sala,
                max_jugadores: data.max_jugadores,
                jugadores_conectados: data.jugadores_conectados
            }));
            // Guardar ID de sala específicamente
            localStorage.setItem('id_sala', data.id_sala);
            window.location.href = 'jugadoresSala.html';
        } else {
            document.getElementById('mensaje').textContent = 'Error: ' + data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('mensaje').textContent = 'Ocurrió un error al crear la sala.';
    });
});

function crearSala() {
    // ... (código existente para crear la sala)

    fetch('../php/crear_sala/crearSala.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // La sala se creó exitosamente
            document.getElementById('mensajeUnirse').innerHTML = '¡Sala creada con éxito!';
            mostrarAlerta('¡Sala creada con éxito!');

             // Guardar todos los datos relevantes en localStorage
            localStorage.setItem('datosSala', JSON.stringify({
                id_sala: data.id_sala,
                nombre_jugador: data.nombre_jugador,
                contraseña_sala: data.contraseña_sala,
                max_jugadores: data.max_jugadores,
                jugadores_conectados: data.jugadores_conectados
            }));
        } else {
            // Hubo un error al crear la sala
            document.getElementById('mensajeUnirse').innerHTML = 'Error al crear la sala: ' + data.message;
            mostrarAlerta('Error al crear la sala: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('mensajeUnirse').innerHTML = 'Error al conectar con el servidor';
        mostrarAlerta('Error al conectar con el servidor');
    });
}

function mostrarAlerta(mensaje) {
    alert(mensaje);
}