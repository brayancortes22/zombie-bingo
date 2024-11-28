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

            // Crear fila de avatares y nombres
            const filaAvatares = document.createElement('div');
            filaAvatares.className = 'row1';
            
            const filaNombres = document.createElement('div');
            filaNombres.className = 'row2';

            for (let j = 0; j < 5; j++) {
                const index = i * 5 + j;
                const jugador = jugadores[index];

                // Agregar avatar
                const colAvatar = document.createElement('div');
                colAvatar.className = 'col2';
                
                if (jugador) {
                    const avatar = document.createElement('img');
                    avatar.src = `../uploads/avatars/${jugador.avatar}`;
                    avatar.alt = 'Avatar de ' + jugador.nombre_jugador;
                    avatar.className = 'avatar-jugador';
                    colAvatar.appendChild(avatar);
                } else {
                    const avatarVacio = document.createElement('div');
                    avatarVacio.className = 'avatar-vacio';
                    colAvatar.appendChild(avatarVacio);
                }
                
                filaAvatares.appendChild(colAvatar);

                // Agregar nombre
                const colNombre = document.createElement('div');
                colNombre.className = 'col2';
                colNombre.textContent = jugador ? jugador.nombre_jugador : 'Esperando jugador...';
                filaNombres.appendChild(colNombre);
            }

            filaJugadores.appendChild(filaAvatares);
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
document.getElementById('btnSalirSala').addEventListener('click', async function() {
    try {
        const id_sala = JSON.parse(localStorage.getItem('datosSala')).id_sala;
        const id_jugador = localStorage.getItem('id_jugador');

        const response = await fetch('../php/salirDeSala.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_sala: id_sala,
                id_jugador: id_jugador
            })
        });

        const data = await response.json();
        
        if (data.success) {
            // Limpiar datos de la sala del localStorage
            localStorage.removeItem('datosSala');
            // Redireccionar a la página principal
            window.location.href = '';
        } else {
            console.error('Error:', data.message);
            alert('Error al salir de la sala: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar la solicitud');
    }
});