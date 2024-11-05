document.addEventListener('DOMContentLoaded', function() {
    const datosSala = JSON.parse(localStorage.getItem('datosSala'));
    console.log('Datos de la sala:', datosSala); // Para depuración

    if (datosSala) {
        document.getElementById('idSala').textContent = datosSala.id_sala;
        document.getElementById('jugadoresConectados').textContent = datosSala.jugadores_conectados + '/' + datosSala.max_jugadores;
        document.getElementById('contraseñaSala').textContent = datosSala.contraseña_sala;

        function actualizarJugadores() {
            fetch('../php/obtenerJugadoresSala.php?id_sala=' + datosSala.id_sala)
                .then(response => response.json())
                .then(jugadores => {
                    console.log("Jugadores recibidos:", jugadores);
                    const contenedorJugadores = document.getElementById('contenedorJugadores');
                    contenedorJugadores.innerHTML = ''; // Limpiar el contenedor

                    const totalFilas = Math.ceil(datosSala.max_jugadores / 5);

                    for (let i = 0; i < totalFilas; i++) {
                        const filaJugadores = document.createElement('div');
                        filaJugadores.className = 'fila-jugadores';

                        const filaCirculos = document.createElement('div');
                        filaCirculos.className = 'row1';
                        filaCirculos.style.backgroundImage = "url('../img/huellas2.jpg')";
                        filaCirculos.style.backgroundSize = "cover";
                        filaCirculos.style.backgroundPosition = "center";
                        
                        const filaNombres = document.createElement('div');
                        filaNombres.className = 'row2';
                        filaNombres.style.backgroundImage = "url('../img/huellas2.jpg')";
                        filaNombres.style.backgroundSize = "cover";
                        filaNombres.style.backgroundPosition = "center";

                        for (let j = 0; j < 5; j++) {
                            const index = i * 5 + j;
                            const colCirculo = document.createElement('div');
                            colCirculo.className = 'col2';
                            const circulo = document.createElement('div');
                            circulo.className = 'circulo';
                            colCirculo.appendChild(circulo);
                            filaCirculos.appendChild(colCirculo);

                            const colNombre = document.createElement('div');
                            colNombre.className = 'col2';
                            
                            if (index < jugadores.length) {
                                circulo.style.backgroundColor = '#00ff00';
                                colNombre.textContent = jugadores[index].nombre_jugador;
                            } else {
                                circulo.style.backgroundColor = '#ff0000';
                                colNombre.textContent = 'Esperando jugador...';
                            }
                            
                            filaNombres.appendChild(colNombre);
                        }

                        filaJugadores.appendChild(filaCirculos);
                        filaJugadores.appendChild(filaNombres);
                        contenedorJugadores.appendChild(filaJugadores);
                    }

                    document.getElementById('jugadoresConectados').textContent = jugadores.length + '/' + datosSala.max_jugadores;
                })
                .catch(error => {
                    console.error('Error al obtener jugadores:', error);
                });
        }

        actualizarJugadores();
        setInterval(actualizarJugadores, 5000);
    } else {
        console.error('No se encontraron datos de la sala en localStorage');
    }
});

function cancelarSala() {
    const datosSala = JSON.parse(localStorage.getItem('datosSala'));
    console.log('Datos de la sala:', datosSala); // Añade este log
    if (datosSala && datosSala.id_sala) {
        if (confirm('¿Estás seguro de que quieres cancelar la sala?')) {
            fetch('../php/cancelarSala.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_sala: datosSala.id_sala })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('La sala ha sido cancelada exitosamente.');
                    localStorage.removeItem('datosSala');
                    window.location.href = 'inicio.php'; // Redirige al usuario a la página de inicio
                } else {
                    alert('Error al cancelar la sala: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al intentar cancelar la sala.');
            });
        }
    } else {
        alert('No se encontraron datos de la sala.');
    }
}
