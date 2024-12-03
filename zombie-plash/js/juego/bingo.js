import Efectos from './efectos.js';
import CuentaRegresiva from './cuentaregresiva.js';

class BingoGame {
    constructor() {
        // Obtener datos de la sala desde localStorage
        const datosSala = JSON.parse(localStorage.getItem('datosSala'));
        this.idSala = datosSala?.id_sala;
        this.idJugador = localStorage.getItem('id_jugador');
        this.rolJugador = null;
        
        if (!this.idSala) {
            throw new Error('No se encontró el ID de la sala');
        }
        
        this.obtenerRolJugador();
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
            
            // Iniciar cuenta regresiva
            this.cuentaRegresiva.iniciarCuentaRegresiva(() => {
                // Después de la cuenta regresiva, obtener el rol y comenzar según corresponda
                this.obtenerRolJugador();
            });
        } catch (error) {
            console.error('Error al inicializar el juego:', error);
        }
    }

    async obtenerRolJugador() {
        try {
            const response = await fetch('../../zombie-plash/php/juego/obtenerRolJugador.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.idSala,
                    id_jugador: this.idJugador
                })
            });
            
            const data = await response.json();
            if (data.success) {
                this.rolJugador = data.rol;
                this.inicializarSegunRol();
            }
        } catch (error) {
            console.error('Error al obtener rol:', error);
        }
    }

    async inicializarSegunRol() {
        if (this.rolJugador === 'creador') {
            // Solo el creador genera balotas
            await this.generarBalotas();
            this.iniciarJuego();
        } else {
            // Los participantes solo escuchan actualizaciones
            this.escucharActualizaciones();
        }
    }

    async generarBalotas() {
        try {
            const response = await fetch('../php/juego/generarBalotas.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.idSala,
                    id_jugador: this.idJugador
                })
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

    escucharActualizaciones() {
        // Reducir la frecuencia de las actualizaciones para evitar sobrecarga
        setInterval(async () => {
            await this.obtenerActualizaciones();
        }, 2000); // Cambiar a 2 segundos
    }

    async obtenerActualizaciones() {
        if (this._actualizando) return; // Evitar actualizaciones simultáneas
        
        try {
            this._actualizando = true;
            const response = await fetch('../../zombie-plash/php/juego/obtenerActualizaciones.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.idSala
                })
            });
            
            const data = await response.json();
            if (data.success && data.numerosSacados) {
                this.actualizarInterfaz(data.numerosSacados);
            }
        } catch (error) {
            console.error('Error al obtener actualizaciones:', error);
        } finally {
            this._actualizando = false;
        }
    }

    async iniciarJuego() {
        this.intervaloBalotas = setInterval(async () => {
            await this.sacarNuevoNumero();
        }, 5000); // Sacar número cada 5 segundos
    }

    async sacarNuevoNumero() {
        try {
            console.log('Intentando sacar nuevo número para sala:', this.idSala);
            const response = await fetch('/zombie-bingo/zombie-plash/php/juego/sacarNumero.php', {
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
            console.log('Respuesta sacarNumero:', data);
            
            if (data.success) {
                // Guardar el número en el array de números sacados
                this.numerosSacados.push({
                    numero: data.numero,
                    letra: data.letra
                });
                
                // Actualizar panel principal (las 5 últimas balotas)
                const panelNumeros = document.getElementById('numerosSacados');
                const balota = document.createElement('div');
                balota.className = 'balota nueva-balota';
                balota.innerHTML = `
                    <span class="letra">${data.letra}</span>
                    <span class="numero">${data.numero}</span>
                `;
                
                panelNumeros.appendChild(balota);
                
                // Mantener solo las últimas 5 balotas
                const balotas = panelNumeros.getElementsByClassName('balota');
                if (balotas.length > 5) {
                    balotas[0].classList.add('balota-saliente');
                    setTimeout(() => {
                        if (balotas[0]) {
                            balotas[0].remove();
                        }
                    }, 500);
                }
                
                // Remover clase nueva-balota después de la animación
                setTimeout(() => {
                    balota.classList.remove('nueva-balota');
                }, 500);

                // Actualizar el historial en el panel izquierdo
                const panelIzquierdo = document.querySelector('.izquierda');
                const historialContainer = document.createElement('div');
                historialContainer.id = 'panel-historial';
                
                // Agrupar números por letra
                const numerosPorLetra = {
                    'B': [], 'I': [], 'N': [], 'G': [], 'O': []
                };
                
                this.numerosSacados.forEach(balota => {
                    numerosPorLetra[balota.letra].push(balota.numero);
                });
                
                // Crear columnas para cada letra
                Object.entries(numerosPorLetra).forEach(([letra, numeros]) => {
                    if (numeros.length > 0) { // Solo mostrar letras que tengan números
                        const columna = document.createElement('div');
                        columna.className = `columna-${letra}`;
                        columna.innerHTML = `
                            <h3>${letra}</h3>
                            <div class="numeros">
                                ${numeros.sort((a, b) => a - b).join(', ')}
                            </div>
                        `;
                        historialContainer.appendChild(columna);
                    }
                });
                
                // Limpiar y actualizar el panel izquierdo
                panelIzquierdo.innerHTML = '';
                panelIzquierdo.appendChild(historialContainer);

                // Verificar el número en el cartón
                this.verificarNumeroEnCarton(data.numero);
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
        if (!this.efectos) {
            console.error('Efectos no inicializados');
            return;
        }
        
        const btnNumeros = document.querySelector('.colu2 button:nth-child(2)');
        if (btnNumeros.disabled) return;
        
        this.efectos.toggleEfectoNumeros();
        
        // Deshabilitar el botón temporalmente
        btnNumeros.disabled = true;
        setTimeout(() => {
            btnNumeros.disabled = false;
        }, 10000); // 10 segundos
    }

    toggleEfectoEligeNumero() {
        if (!this.efectos) {
            console.error('Efectos no inicializados');
            return;
        }
        
        const numerosDisponibles = Array.from({ length: 60 }, (_, i) => i + 1)
            .filter(num => !this.numerosSacados.some(balota => balota.numero === num));
        
        const modal = document.getElementById('modalEligeNumero');
        const contenedor = document.getElementById('numerosDisponibles');
        contenedor.innerHTML = '';
        
        numerosDisponibles.forEach(numero => {
            const boton = document.createElement('button');
            boton.textContent = numero;
            boton.onclick = () => this.seleccionarNumeroManual(numero);
            contenedor.appendChild(boton);
        });
        
        modal.style.display = 'block';
    }

    async seleccionarNumeroManual(numero) {
        try {
            const response = await fetch('../php/juego/seleccionarNumero.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.idSala,
                    numero: numero
                })
            });
            
            const data = await response.json();
            if (data.success) {
                document.getElementById('modalEligeNumero').style.display = 'none';
                this.numerosSacados.push({
                    numero: data.numero,
                    letra: data.letra
                });
                this.actualizarPanelNumeros(data.numero, data.letra);
                this.actualizarPanelHistorial();
            }
        } catch (error) {
            console.error('Error al seleccionar número:', error);
        }
    }

    inicializarEventos() {
        // Aquí puedes agregar los event listeners necesarios
    }

    async nuevoCarton() {
        try {
            const rangos = {
                'B': { min: 1, max: 12 },
                'I': { min: 13, max: 23 },
                'N': { min: 24, max: 34 },
                'G': { min: 35, max: 45 },
                'O': { min: 46, max: 60 }
            };

            const carton = {};
            const cartonElement = document.getElementById('cartonBingo');
            const filas = cartonElement.getElementsByClassName('fila5');

            // Generar números aleatorios para cada columna
            Object.keys(rangos).forEach((letra, columnIndex) => {
                const { min, max } = rangos[letra];
                const numerosDisponibles = Array.from(
                    { length: max - min + 1 }, 
                    (_, i) => min + i
                );
                
                // Mezclar números
                for (let i = numerosDisponibles.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [numerosDisponibles[i], numerosDisponibles[j]] = 
                    [numerosDisponibles[j], numerosDisponibles[i]];
                }
                
                // Seleccionar 5 números para la columna
                carton[letra] = numerosDisponibles.slice(0, 5);
                
                // Llenar el cartón visual
                for (let fila = 0; fila < 5; fila++) {
                    const celda = filas[fila].children[columnIndex];
                    celda.textContent = carton[letra][fila];
                    celda.dataset.numero = carton[letra][fila];
                    celda.dataset.letra = letra;
                }
            });

            this.cartonActual = carton;
            return true;
        } catch (error) {
            console.error('Error al generar nuevo cartón:', error);
            return false;
        }
    }

    actualizarPanelHistorial(numerosSacados) {
        const panelIzquierdo = document.querySelector('.izquierda');
        if (!panelIzquierdo) return;

        // Crear contenedor para el historial
        const historialContainer = document.createElement('div');
        historialContainer.id = 'panel-historial';
        
        // Agrupar números por letra
        const numerosPorLetra = {
            'B': [], 'I': [], 'N': [], 'G': [], 'O': []
        };
        
        numerosSacados.forEach(balota => {
            numerosPorLetra[balota.letra].push(balota.numero);
        });
        
        // Crear columnas para cada letra en orden
        ['B', 'I', 'N', 'G', 'O'].forEach(letra => {
            const numeros = numerosPorLetra[letra];
            if (numeros.length > 0) {
                const columna = document.createElement('div');
                columna.className = `columna-${letra}`;
                columna.innerHTML = `
                    <h3>${letra}</h3>
                    <div class="numeros">
                        ${numeros.sort((a, b) => a - b).join(', ')}
                    </div>
                `;
                historialContainer.appendChild(columna);
            }
        });
        
        // Limpiar y actualizar el panel izquierdo
        panelIzquierdo.innerHTML = '';
        panelIzquierdo.appendChild(historialContainer);
    }

    verificarNumeroEnCarton(numero) {
        try {
            // Buscar la celda que contiene el número
            const celdas = document.querySelectorAll('.columna1');
            celdas.forEach(celda => {
                if (celda.dataset.numero === numero.toString()) {
                    celda.classList.add('marcado');
                }
            });

            // Verificar si hay línea o bingo
            this.verificarPatrones();
        } catch (error) {
            console.error('Error al verificar número en cartón:', error);
        }
    }

    verificarPatrones() {
        const filas = document.getElementById('cartonBingo').getElementsByClassName('fila5');
        let numerosCompletados = 0;

        // Verificar filas
        for (let i = 0; i < filas.length; i++) {
            const celdas = filas[i].getElementsByClassName('columna1');
            let celdasMarcadas = 0;
            
            for (let j = 0; j < celdas.length; j++) {
                if (celdas[j].classList.contains('marcado')) {
                    celdasMarcadas++;
                    numerosCompletados++;
                }
            }
            
            if (celdasMarcadas === 5) {
                console.log('¡Línea completada!');
            }
        }

        // Verificar columnas
        for (let i = 0; i < 5; i++) {
            let celdasMarcadas = 0;
            for (let j = 0; j < filas.length; j++) {
                const celda = filas[j].getElementsByClassName('columna1')[i];
                if (celda.classList.contains('marcado')) {
                    celdasMarcadas++;
                }
            }
            if (celdasMarcadas === 5) {
                console.log('¡Columna completada!');
            }
        }

        // Verificar diagonales
        let diagonalPrincipal = 0;
        let diagonalSecundaria = 0;
        
        for (let i = 0; i < 5; i++) {
            if (filas[i].getElementsByClassName('columna1')[i].classList.contains('marcado')) {
                diagonalPrincipal++;
            }
            if (filas[i].getElementsByClassName('columna1')[4-i].classList.contains('marcado')) {
                diagonalSecundaria++;
            }
        }

        if (diagonalPrincipal === 5 || diagonalSecundaria === 5) {
            console.log('¡Diagonal completada!');
        }

        // Verificar bingo (todos los números marcados)
        if (numerosCompletados === 25) {
            console.log('¡BINGO!');
            this.verificarBingo();
        }
    }

    actualizarInterfaz(numerosSacados) {
        const panelNumeros = document.getElementById('numerosSacados');
        if (!panelNumeros) return;

        // Si no hay números sacados, no hacer nada
        if (!numerosSacados || numerosSacados.length === 0) return;

        // Verificar si hay un nuevo número comparando longitudes
        if (numerosSacados.length > this.numerosSacados.length) {
            // Mantener solo las últimas 5 balotas
            const ultimasBalotas = numerosSacados.slice(-5);
            
            // Limpiar el panel
            panelNumeros.innerHTML = '';
            
            // Agregar las balotas
            ultimasBalotas.forEach((balota, index) => {
                const balotaElement = document.createElement('div');
                balotaElement.className = 'balota';
                
                // Solo aplicar animación a la última balota
                if (index === ultimasBalotas.length - 1) {
                    balotaElement.classList.add('nueva-balota');
                    
                    // Reproducir sonido si está disponible
                    const audio = new Audio('../../zombie-plash/sonidos/balota.mp3');
                    audio.play().catch(e => console.log('Error al reproducir sonido:', e));
                }
                
                balotaElement.innerHTML = `
                    <span class="letra">${balota.letra}</span>
                    <span class="numero">${balota.numero}</span>
                `;
                panelNumeros.appendChild(balotaElement);
            });

            // Actualizar el historial
            this.actualizarPanelHistorial(numerosSacados);
            
            // Verificar el nuevo número en el cartón
            const nuevoNumero = numerosSacados[numerosSacados.length - 1];
            this.verificarNumeroEnCarton(nuevoNumero.numero);

            // Actualizar array local
            this.numerosSacados = [...numerosSacados];
        }
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
