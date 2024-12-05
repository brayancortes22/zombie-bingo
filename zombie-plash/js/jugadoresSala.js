class SalaManager {
    constructor() {
        this.inicializarSala();
        this.configurarBotones();
        this.iniciarActualizacionPeriodica();
    }

    iniciarActualizacionPeriodica() {
        setInterval(() => {
            this.mostrarJugadoresConectados();
            this.verificarEstadoSala();
        }, 3000);
    }

    async inicializarSala() {
        try {
            const datosSalaRaw = localStorage.getItem('datosSala');
            console.log('Contenido raw de datosSala:', datosSalaRaw);
            
            this.datosSala = JSON.parse(datosSalaRaw);
            console.log('Datos de la sala parseados:', this.datosSala);

            // Obtener el id_jugador del participante
            const response = await fetch(`../php/sala/obtenerJugadoresSala.php?id_sala=${this.datosSala.id_sala}`);
            const data = await response.json();
            
            if (data.success && data.jugadores) {
                // Encontrar los datos del jugador actual
                const jugadorActual = data.jugadores.find(j => j.nombre_jugador === this.datosSala.nombre_jugador);
                if (jugadorActual) {
                    this.datosSala.id_jugador = jugadorActual.id_jugador;
                    this.datosSala.rol = jugadorActual.rol;
                }
            }

            if (!this.datosSala) {
                throw new Error('No se encontraron datos de la sala');
            }

            // Actualizar la UI con los datos básicos de la sala
            this.actualizarUI();
            
            // Mostrar jugadores conectados
            await this.mostrarJugadoresConectados();
            
            // Iniciar verificación del estado de la sala
            this.verificarEstadoSala();
            setInterval(() => this.verificarEstadoSala(), 5000);

        } catch (error) {
            console.error('Error al inicializar sala:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los datos de la sala. Redirigiendo al inicio...',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                window.location.href = 'inicio.php';
            });
        }
    }

    actualizarUI() {
        // Actualizar elementos de la UI con los datos de la sala
        const idSalaElement = document.getElementById('idSala');
        const jugadoresConectadosElement = document.getElementById('jugadoresConectados');
        const contraseñaSalaElement = document.getElementById('contraseñaSala');
        const maxJugadoresElement = document.getElementById('maxJugadores');

        if (idSalaElement) {
            idSalaElement.textContent = this.datosSala.id_sala;
        }
        if (jugadoresConectadosElement && maxJugadoresElement) {
            jugadoresConectadosElement.textContent = `${this.datosSala.jugadores_conectados}/${this.datosSala.max_jugadores}`;
        }
        if (contraseñaSalaElement) {
            contraseñaSalaElement.textContent = this.datosSala.contraseña_sala;
        }
    }

    configurarBotones() {
        const btnCancelarSala = document.getElementById('btnCancelarSala');
        const btnSalirSala = document.getElementById('btnSalirDeLaSala');
        const btnIniciarJuego = document.getElementById('btnIniciarJuego');

        console.log('Configurando botones, rol:', this.datosSala.rol);

        // Ocultar todos los botones primero
        if (btnCancelarSala) btnCancelarSala.style.display = 'none';
        if (btnSalirSala) btnSalirSala.style.display = 'none';
        if (btnIniciarJuego) btnIniciarJuego.style.display = 'none';

        if (this.datosSala.rol === 'creador') {
            // Para el creador: solo mostrar Iniciar Juego y Cancelar Sala
            if (btnIniciarJuego) {
                btnIniciarJuego.style.display = 'block';
                btnIniciarJuego.addEventListener('click', () => this.iniciarJuego());
            }
            if (btnCancelarSala) {
                btnCancelarSala.style.display = 'block';
                btnCancelarSala.addEventListener('click', () => this.cancelarSala());
            }
        } else {
            // Para el participante: solo mostrar Salir de la Sala
            if (btnSalirSala) {
                btnSalirSala.style.display = 'block';
                btnSalirSala.addEventListener('click', () => this.salirDeSala());
            }
        }
    }

    async mostrarJugadoresConectados() {
        try {
            const response = await fetch(`../php/sala/obtenerJugadoresSala.php?id_sala=${this.datosSala.id_sala}`);
            const data = await response.json();

            if (data.success) {
                const contenedorJugadores = document.getElementById('contenedorJugadores');
                contenedorJugadores.innerHTML = '';

                data.jugadores.forEach(jugador => {
                    const jugadorElement = document.createElement('div');
                    jugadorElement.className = 'jugador-row';
                    
                    const esCreador = jugador.rol === 'creador';
                    const rolTexto = esCreador ? 'CREADOR' : 'PARTICIPANTE';
                    
                    jugadorElement.innerHTML = `
                        <img src="../uploads/avatars/${jugador.avatar}" alt="Avatar" class="avatar-jugador">
                        <span class="nombre-jugador">${jugador.nombre_jugador} <br> ${rolTexto}</span>
                    `;
                    contenedorJugadores.appendChild(jugadorElement);
                });

                // Actualizar contador de jugadores con el máximo
                const jugadoresConectadosElement = document.getElementById('jugadoresConectados');
                if (jugadoresConectadosElement) {
                    jugadoresConectadosElement.textContent = 
                        `${data.jugadores.length}/${data.info_sala.max_jugadores}`;
                }

                // Actualizar datos locales
                this.datosSala.jugadores_conectados = data.jugadores.length;
                this.datosSala.max_jugadores = data.info_sala.max_jugadores;
            }
        } catch (error) {
            console.error('Error al mostrar jugadores:', error);
        }
    }

    async salirDeSala() {
        try {
            const confirmacion = await Swal.fire({
                title: '¿Estás seguro?',
                text: "¿Deseas salir de la sala?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar'
            });

            if (!confirmacion.isConfirmed) {
                return;
            }

            if (!this.datosSala.id_sala || !this.datosSala.id_jugador) {
                throw new Error('Datos incompletos: id_sala o id_jugador faltantes');
            }

            const response = await fetch('../php/sala/salirDeSala.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.datosSala.id_sala,
                    id_jugador: this.datosSala.id_jugador
                })
            });

            const data = await response.json();

            if (data.success) {
                await Swal.fire({
                    title: 'Éxito',
                    text: 'Has salido de la sala correctamente',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                localStorage.removeItem('datosSala');
                window.location.href = 'inicio.php';
            } else {
                throw new Error(data.message || 'Error al salir de la sala');
            }
        } catch (error) {
            console.error('Error al salir de la sala:', error);
            await Swal.fire({
                title: 'Error',
                text: error.message || 'No se pudo salir de la sala',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }

    async cancelarSala() {
        try {
            console.log('Intentando cancelar sala:', {
                id_sala: this.datosSala.id_sala,
                id_jugador: this.datosSala.id_jugador,
                rol: this.datosSala.rol
            });

            // Verificar si es el creador
            if (this.datosSala.rol !== 'creador') {
                throw new Error('No tienes permisos para cancelar la sala');
            }

            const response = await fetch('../php/sala/cancelarSala.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.datosSala.id_sala,
                    id_jugador: this.datosSala.id_jugador
                })
            });

            console.log('Respuesta del servidor:', await response.clone().text());

            const data = await response.json();
            if (data.success) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Sala cancelada correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    localStorage.removeItem('datosSala');
                    window.location.href = 'inicio.php';
                });
            } else {
                throw new Error(data.message || 'Error al cancelar la sala');
            }
        } catch (error) {
            console.error('Error al cancelar la sala:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'No se pudo cancelar la sala',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }

    async iniciarJuego() {
        if (this.datosSala.rol !== 'creador') return;

        try {
            const response = await fetch('../php/sala/iniciarJuego.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.datosSala.id_sala
                })
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = 'juego.html';
            }
        } catch (error) {
            console.error('Error al iniciar el juego:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo iniciar el juego',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }

    async verificarEstadoSala() {
        try {
            const response = await fetch(`../php/sala/obtenerEstadoSala.php?id_sala=${this.datosSala.id_sala}`);
            const data = await response.json();

            if (data.success) {
                if (!data.estado || data.estado === 'cerrada') {
                    Swal.fire({
                        title: 'Sala cerrada',
                        text: 'La sala ha sido cerrada por el creador',
                        icon: 'info',
                        confirmButtonText: 'Aceptar',
                        allowOutsideClick: false
                    }).then(() => {
                        localStorage.removeItem('datosSala');
                        window.location.href = 'inicio.php';
                    });
                } else if (data.estado === 'en_juego') {
                    window.location.href = 'juego.html';
                }
            }
        } catch (error) {
            console.error('Error al verificar estado de sala:', error);
        }
    }
}
// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    new SalaManager();
});

