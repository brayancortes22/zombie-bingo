class SalaManager {
    constructor() {
        console.log('Contenido raw de datosSala:', localStorage.getItem('datosSala'));
        
        try {
            this.datosSala = JSON.parse(localStorage.getItem('datosSala'));
            console.log('Datos de la sala parseados:', this.datosSala);
        } catch (error) {
            console.error('Error al parsear datosSala:', error);
            alert('Error al cargar los datos de la sala. Redirigiendo al inicio...');
            window.location.href = 'inicio.php';
            return;
        }

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
            contenedorJugadores: document.getElementById('contenedorJugadores'),
            btnSalirSala: document.getElementById('btnSalirSala')
        };

        this.btnIniciarJuego = document.getElementById('btnIniciarJuego');
        
        this.iniciarJuego = this.iniciarJuego.bind(this);
        this.salirDeSala = this.salirDeSala.bind(this);

        if (this.btnIniciarJuego) {
            this.btnIniciarJuego.addEventListener('click', this.iniciarJuego);
        }
        if (this.elementos.btnSalirSala) {
            this.elementos.btnSalirSala.addEventListener('click', this.salirDeSala);
        }
        
        this.intervalId = null;
        this.verificarEstadoSalaInterval = null;
        this.verificarCreadorInterval = null;
        
        // Llamar a verificarCreadorSala después de un pequeño retraso
        // para asegurar que los datos estén cargados
        setTimeout(() => {
            this.verificarCreadorSala();
        }, 100);
        
        this.init();

        // Agregar el evento para el botón de cancelar sala
        document.querySelector('.botonrojo').addEventListener('click', () => this.cerrarSala());
    }

    async init() {
        await this.verificarEstadoSala();
        this.mostrarDatosSala();
        this.actualizarJugadores();
        this.iniciarActualizacionAutomatica();
        this.iniciarVerificacionEstadoSala();
        this.iniciarVerificacionCreador();
        this.verificarExistenciaSala();
        
        // Iniciar verificación periódica de existencia de sala
        setInterval(() => this.verificarExistenciaSala(), 3000);
    }

    async verificarEstadoSala() {
        try {
            const response = await fetch(`../php/obtenerEstadoSala.php?id_sala=${this.datosSala.id_sala}`);
            const data = await response.json();

            if (data.success && data.estado === 'en_juego') {
                // Redireccionar a la página del juego
                window.location.href = 'juego.html';
            }
        } catch (error) {
            console.error('Error al verificar estado de la sala:', error);
        }
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
            
            // console.log('Datos recibidos del servidor:', data);

            if (!data.success) {
                throw new Error(data.error || 'Error al obtener jugadores');
            }

            const jugadores = data.jugadores;
            const infoSala = data.info_sala;
            
            // Actualizar información de la sala
            this.datosSala.max_jugadores = infoSala.max_jugadores;
            this.datosSala.jugadores_conectados = infoSala.jugadores_unidos;
            this.datosSala.jugadores = jugadores;
            localStorage.setItem('datosSala', JSON.stringify(this.datosSala));

            this.actualizarInterfazJugadores(jugadores);
            this.verificarCreadorSala();
            
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
                    // Agregar clase especial para el creador
                    if (jugador.rol === 'creador') {
                        colAvatar.classList.add('creador-sala');
                    }
                    
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

    async salirDeSala() {
        try {
            // Obtener los datos almacenados
            const datosSala = JSON.parse(localStorage.getItem('datosSala'));
            const id_sala = datosSala?.id_sala || localStorage.getItem('id_sala');
            const id_jugador = localStorage.getItem('id_jugador');

            console.log('Datos para salir:', { id_sala, id_jugador }); // Debug

            if (!id_sala || !id_jugador) {
                console.error('Datos faltantes:', { id_sala, id_jugador }); // Debug
                throw new Error('Datos incompletos para salir de la sala');
            }

            const response = await fetch('../php/salirDeSala.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: id_sala,
                    id_jugador: id_jugador
                })
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data); // Debug
            
            if (data.success) {
                // Limpiar datos de localStorage
                localStorage.removeItem('id_sala');
                localStorage.removeItem('datosSala');
                window.location.href = 'inicio.php';
            } else {
                throw new Error(data.message || 'Error al salir de la sala');
            }
        } catch (error) {
            console.error('Error al salir de la sala:', error);
            alert('Error al salir de la sala: ' + error.message);
        }
    }
    
    async verificarEstadoJuego() {
        try {
            const datosSala = JSON.parse(localStorage.getItem('datosSala'));
            const response = await fetch(`../php/verificarEstadoJuego.php?id_sala=${datosSala.id_sala}`);
            const data = await response.json();

            if (data.success && data.estado === 'en_juego') {
                // Redireccionar a la página del juego
                window.location.href = 'juego.html';
            }
        } catch (error) {
            console.error('Error al verificar estado del juego:', error);
        }
    }

    iniciarVerificacionEstadoSala() {
        this.verificarEstadoSalaInterval = setInterval(() => this.verificarEstadoSala(), 1000);
    }

    detenerVerificacionEstadoSala() {
        if (this.verificarEstadoSalaInterval) {
            clearInterval(this.verificarEstadoSalaInterval);
            this.verificarEstadoSalaInterval = null;
        }
    }

    async verificarCreadorSala() {
        try {
            if (!this.btnIniciarJuego) return;

            const response = await fetch(`../php/verificarCreadorSala.php?id_sala=${this.datosSala.id_sala}`);
            const data = await response.json();

            if (data.success) {
                if (data.esCreador) {
                    // console.log('Usuario es creador, mostrando botón');
                    this.btnIniciarJuego.style.display = 'inline-block';
                    this.btnIniciarJuego.setAttribute('data-creador', 'true');
                } else {
                    console.log('Usuario no es creador, ocultando botón');
                    this.btnIniciarJuego.style.display = 'none';
                    this.btnIniciarJuego.removeAttribute('data-creador');
                }
            } else {
                console.error('Error al verificar creador:', data.message);
                this.btnIniciarJuego.style.display = 'none';
            }
        } catch (error) {
            console.error('Error al verificar creador:', error);
            this.btnIniciarJuego.style.display = 'none';
        }
    }

    iniciarVerificacionCreador() {
        // Verificar inmediatamente
        this.verificarCreadorSala();
        // Verificar cada 3 segundos
        this.verificarCreadorInterval = setInterval(() => this.verificarCreadorSala(), 3000);
    }

    detenerVerificacionCreador() {
        if (this.verificarCreadorInterval) {
            clearInterval(this.verificarCreadorInterval);
            this.verificarCreadorInterval = null;
        }
    }

    async iniciarJuego() {
        try {
            if (!this.btnIniciarJuego.hasAttribute('data-creador')) {
                console.log('No eres el creador de la sala');
                return;
            }

            console.log('Iniciando juego...');
            const response = await fetch('../php/iniciarJuego.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    id_sala: this.datosSala.id_sala 
                })
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data);

            if (data.success) {
                console.log('Juego iniciado exitosamente');
                window.location.href = 'juego.html';
            } else {
                alert(data.message || 'No se puede iniciar el juego');
            }
        } catch (error) {
            console.error('Error al iniciar el juego:', error);
            alert('Error al procesar la solicitud');
        }
    }

    async cerrarSala() {
        try {
            const datosSala = JSON.parse(localStorage.getItem('datosSala'));
            const id_sala = datosSala?.id_sala;
            const id_jugador = localStorage.getItem('id_jugador');

            if (!id_sala || !id_jugador) {
                throw new Error('Datos incompletos para cerrar la sala');
            }

            // Confirmar con el usuario
            if (!confirm('¿Estás seguro de que deseas cerrar la sala? Todos los jugadores serán expulsados.')) {
                return;
            }

            const response = await fetch('../php/cancelarSala.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: id_sala,
                    id_jugador: id_jugador
                })
            });

            const data = await response.json();

            if (data.success) {
                // Limpiar datos de localStorage
                localStorage.removeItem('id_sala');
                localStorage.removeItem('datosSala');
                
                // Redireccionar al inicio
                window.location.href = 'inicio.php';
            } else {
                throw new Error(data.message || 'Error al cerrar la sala');
            }
        } catch (error) {
            console.error('Error al cerrar la sala:', error);
            alert('Error al cerrar la sala: ' + error.message);
        }
    }

    async verificarExistenciaSala() {
        try {
            const response = await fetch(`../php/verificarSalaExiste.php?id_sala=${this.datosSala.id_sala}`);
            const data = await response.json();

            if (!data.existe) {
                alert('La sala ya no existe. Serás redirigido al inicio.');
                localStorage.removeItem('id_sala');
                localStorage.removeItem('datosSala');
                window.location.href = 'inicio.php';
            }
        } catch (error) {
            console.error('Error al verificar existencia de sala:', error);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SalaManager();
});

// Función para verificar si la sala ha sido cerrada (para los participantes)
async function verificarEstadoSala() {
    try {
        const id_sala = localStorage.getItem('id_sala');
        if (!id_sala) return;

        const response = await fetch(`../php/obtenerEstadoSala.php?id_sala=${id_sala}`);
        const data = await response.json();

        if (data.success) {
            // Si la sala ya no existe o está cerrada
            if (!data.estado || data.estado === 'cerrada') {
                alert('La sala ha sido cerrada por el creador');
                localStorage.removeItem('id_sala');
                localStorage.removeItem('datosSala');
                window.location.href = 'inicio.php';
            }
        }
    } catch (error) {
        console.error('Error al verificar estado de sala:', error);
    }
}

// Iniciar verificación periódica para los participantes
document.addEventListener('DOMContentLoaded', function() {
    // Verificar cada 5 segundos si la sala sigue activa
    setInterval(verificarEstadoSala, 5000);
});