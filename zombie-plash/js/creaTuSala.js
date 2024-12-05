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
            // Guardar todos los datos relevantes en localStorage
            localStorage.setItem('datosSala', JSON.stringify({
                id_sala: data.id_sala,
                id_jugador: data.id_jugador,
                nombre_jugador: data.nombre_jugador,
                contraseña_sala: data.contraseña_sala,
                max_jugadores: data.max_jugadores,
                jugadores_conectados: data.jugadores_conectados,
                rol: 'creador'
            }));
            
            window.location.href = 'jugadoresSala.html';
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
            text: 'Ocurrió un error al crear la sala.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
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
            Swal.fire({
                title: 'Error',
                text: 'Error al crear la sala: ' + data.message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error al conectar con el servidor',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
}

function mostrarAlerta(mensaje) {
    Swal.fire({
        title: 'Información',
        text: mensaje,
        icon: 'info',
        confirmButtonText: 'Aceptar'
    });
}