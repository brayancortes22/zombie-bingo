import Efectos from './efectos.js';
import CuentaRegresiva from './cuentaregresiva.js';

class BingoGame {
    constructor() {
        // Obtener datos de la sala desde localStorage
        const datosSala = JSON.parse(localStorage.getItem('datosSala'));
        this.idSala = datosSala?.id_sala;
        if (!this.idSala) {
            throw new Error('No se encontró el ID de la sala');
        }
        
        this.numerosSacados = [];
        this.cartonActual = [];
        this.efectos = new Efectos();
        this.cuentaRegresiva = new CuentaRegresiva();
        this.intervaloBalotas = null;
        this.inicializarEventos();
    }

    async inicializarJuego() {
        try {
            if (!this.idSala) {
                throw new Error('ID de sala no disponible');
            }
            
            console.log('Iniciando juego para sala:', this.idSala);
            
            // Generar balotas para la sala
            await this.generarBalotas();
            
            // Iniciar cuenta regresiva
            this.cuentaRegresiva.iniciarCuentaRegresiva(() => {
                this.comenzarJuego();
            });
        } catch (error) {
            console.error('Error al inicializar el juego:', error);
        }
    }

    async generarBalotas() {
        try {
            console.log('Generando balotas para sala:', this.idSala);
            
            const response = await fetch('../php/juego/generarBalotas.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_sala: this.idSala })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Respuesta generarBalotas:', data);
            
            if (!data.success) {
                throw new Error(data.message || 'Error al generar balotas');
            }
        } catch (error) {
            console.error('Error al generar balotas:', error);
            throw error;
        }
    }

    async comenzarJuego() {
        this.intervaloBalotas = setInterval(async () => {
            await this.sacarNuevoNumero();
        }, 5000); // Sacar número cada 5 segundos
    }

    async sacarNuevoNumero() {
        try {
            const response = await fetch('../php/juego/sacarNumero.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_sala: this.idSala })
            });
            const data = await response.json();
            
            if (data.success) {
                this.numerosSacados.push(data.numero);
                this.actualizarPanelNumeros(data.numero, data.letra);
                this.verificarNumeroEnCarton(data.numero);
            } else {
                // Si no hay más números, detener el intervalo
                clearInterval(this.intervaloBalotas);
            }
        } catch (error) {
            console.error('Error al sacar número:', error);
        }
    }

    actualizarPanelNumeros(numero, letra) {
        // Actualizar panel principal
        const panelNumeros = document.getElementById('numerosSacados');
        const nuevoNumero = document.createElement('div');
        nuevoNumero.className = 'numero-sacado';
        nuevoNumero.textContent = `${letra}-${numero}`;
        panelNumeros.appendChild(nuevoNumero);

        // Actualizar panel izquierdo
        const panelIzquierdo = document.querySelector('.izquierda');
        const numeroHistorial = document.createElement('div');
        numeroHistorial.className = 'numero-historial';
        numeroHistorial.textContent = `${letra}-${numero}`;
        panelIzquierdo.appendChild(numeroHistorial);
    }

    async verificarBingo() {
        try {
            const response = await fetch('../php/juego/verificarBingo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.idSala,
                    carton: this.cartonActual,
                    numeros_sacados: this.numerosSacados
                })
            });
            const data = await response.json();
            
            if (data.success) {
                this.mostrarGanador(data);
            } else {
                alert('¡Los números no coinciden! Sigue jugando.');
            }
        } catch (error) {
            console.error('Error al verificar bingo:', error);
        }
    }

    async mostrarGanador(data) {
        // Mostrar modal con ranking
        const modal = document.createElement('div');
        modal.className = 'modal-ranking';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>¡BINGO! Ganador: ${data.ganador}</h2>
                <h3>Ranking de jugadores:</h3>
                <ul>
                    ${data.ranking.map(jugador => 
                        `<li>${jugador.nombre} - ${jugador.aciertos} aciertos</li>`
                    ).join('')}
                </ul>
                <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    async detenerJuego() {
        try {
            const response = await fetch('../php/juego/salirSala.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.idSala
                })
            });
            const data = await response.json();
            
            if (data.success) {
                clearInterval(this.intervaloBalotas);
                window.location.href = 'inicio.php';
            }
        } catch (error) {
            console.error('Error al salir de la sala:', error);
        }
    }

    // Métodos para los efectos
    toggleEfectoOscuridad() {
        this.efectos.toggleEfectoOscuridad();
    }

    toggleEfectoNumeros() {
        this.efectos.toggleEfectoNumeros();
    }

    toggleEfectoEligeNumero() {
        this.efectos.toggleEfectoEligeNumero();
    }

    inicializarEventos() {
        // Aquí puedes agregar los event listeners necesarios
    }
}

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    try {
        const bingoGame = new BingoGame();
        window.bingoGame = bingoGame; // Hacer accesible globalmente
        bingoGame.inicializarJuego();
    } catch (error) {
        console.error('Error al crear instancia de BingoGame:', error);
    }
});
