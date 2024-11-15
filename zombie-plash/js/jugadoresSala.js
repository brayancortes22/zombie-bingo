class SalaManager {
    constructor() {
        this.datosSala = JSON.parse(localStorage.getItem('datosSala'));
        console.log('Datos de la sala:', this.datosSala);
        
        if (!this.datosSala) {
            console.error('No se encontraron datos de la sala');
            alert('Error: No se encontraron datos de la sala');
            window.location.href = 'inicio.php';
            return;
        }

        this.elementos = {
            idSala: document.getElementById('idSala'),
            jugadoresConectados: document.getElementById('jugadoresConectados'),
            contraseñaSala: document.getElementById('contraseñaSala'),
            contenedorJugadores: document.getElementById('contenedorJugadores')
        };

        this.intervalId = null;
        this.init();
    }

    init() {
        this.mostrarDatosSala();
        this.actualizarJugadores();
        this.iniciarActualizacionAutomatica();
    }

    mostrarDatosSala() {
        this.elementos.idSala.textContent = this.datosSala.id_sala;
        this.elementos.jugadoresConectados.textContent = 
            `${this.datosSala.jugadores_conectados}/${this.datosSala.max_jugadores}`;
        this.elementos.contraseñaSala.textContent = this.datosSala.contraseña_sala;
    }

    async actualizarJugadores() {
        try {
            const response = await fetch(`../php/obtenerJugadoresSala.php?id_sala=${this.datosSala.id_sala}`);
            const data = await response.json();
            
            console.log('Datos recibidos del servidor:', data);

            if (!data.success) {
                throw new Error(data.error || 'Error al obtener jugadores');
            }

            const jugadores = data.jugadores;
            const infoSala = data.info_sala;
            
            // Actualizar información de la sala
            this.datosSala.max_jugadores = infoSala.max_jugadores;
            this.datosSala.jugadores_conectados = infoSala.jugadores_unidos;
            localStorage.setItem('datosSala', JSON.stringify(this.datosSala));

            this.actualizarInterfazJugadores(jugadores);
            
        } catch (error) {
            console.error('Error al obtener jugadores:', error);
        }
    }

    actualizarInterfazJugadores(jugadores) {
        const contenedor = this.elementos.contenedorJugadores;
        contenedor.innerHTML = '';

        const maxJugadores = parseInt(this.datosSala.max_jugadores);
        const totalFilas = Math.ceil(maxJugadores / 5);

        for (let i = 0; i < totalFilas; i++) {
            const filaJugadores = document.createElement('div');
            filaJugadores.className = 'fila-jugadores';

            // Crear fila de círculos y nombres
            const filaCirculos = document.createElement('div');
            filaCirculos.className = 'row1';
            
            const filaNombres = document.createElement('div');
            filaNombres.className = 'row2';

            for (let j = 0; j < 5; j++) {
                const index = i * 5 + j;
                const jugador = jugadores[index];

                // Agregar círculo
                const colCirculo = document.createElement('div');
                colCirculo.className = 'col2';
                const circulo = document.createElement('div');
                circulo.className = 'circulo';
                circulo.style.backgroundColor = jugador ? '#00ff00' : '#ff0000';
                colCirculo.appendChild(circulo);
                filaCirculos.appendChild(colCirculo);

                // Agregar nombre
                const colNombre = document.createElement('div');
                colNombre.className = 'col2';
                colNombre.textContent = jugador ? jugador.nombre_jugador : 'Esperando jugador...';
                filaNombres.appendChild(colNombre);
            }

            filaJugadores.appendChild(filaCirculos);
            filaJugadores.appendChild(filaNombres);
            contenedor.appendChild(filaJugadores);
        }

        // Actualizar contador de jugadores
        this.elementos.jugadoresConectados.textContent = 
            `${this.datosSala.jugadores_conectados}/${this.datosSala.max_jugadores}`;
    }

    iniciarActualizacionAutomatica() {
        this.intervalId = setInterval(() => this.actualizarJugadores(), 3000);
    }

    detenerActualizacionAutomatica() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SalaManager();
});

// Función para cancelar la sala
async function cancelarSala() {
    const datosSala = JSON.parse(localStorage.getItem('datosSala'));
    
    if (!datosSala?.id_sala) {
        alert('No se encontraron datos de la sala.');
        return;
    }

    if (!confirm('¿Estás seguro de que quieres cancelar la sala?')) {
        return;
    }

    try {
        const response = await fetch('../php/cancelarSala.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_sala: datosSala.id_sala })
        });

        const data = await response.json();

        if (data.success) {
            alert('La sala ha sido cancelada exitosamente.');
            localStorage.removeItem('datosSala');
            window.location.href = 'inicio.php';
        } else {
            alert('Error al cancelar la sala: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al intentar cancelar la sala.');
    }
}
