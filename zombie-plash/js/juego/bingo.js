import Efectos from './efectos.js';
import CuentaRegresiva from './cuentaregresiva.js';

class BingoGame {
    constructor() {
        // Obtener datos de la sala desde localStorage
        try {
            this.datosSala = JSON.parse(localStorage.getItem('datosSala'));
            if (!this.datosSala) {
                throw new Error('No se encontraron datos de la sala');
            }

            // Asignar propiedades desde datosSala
            this.idSala = this.datosSala.id_sala;
            this.idJugador = this.datosSala.id_jugador;
            this.rolJugador = this.datosSala.rol;
            this.nombreJugador = this.datosSala.nombre_jugador;

            console.log('Datos de la sala cargados:', {
                idSala: this.idSala,
                idJugador: this.idJugador,
                rolJugador: this.rolJugador,
                nombreJugador: this.nombreJugador
            });
            
            this.numerosSacados = [];
            this.cartonActual = [];
            this.efectos = new Efectos(this);
            this.cuentaRegresiva = new CuentaRegresiva();
            this.intervaloBalotas = null;
            this.inicializarEventos();
            this.verificarEfectosActivos();
            this.iniciarConsultaEfectos();
            this.tiempoGenerarCarton = 15; // 15 segundos
            this.timerGenerarCarton = null;
            this.intervalEstadoSala = null;
            this.iniciarConsultaEstado();

        } catch (error) {
            console.error('Error al inicializar BingoGame:', error);
            alert('Error al cargar los datos del juego. Serás redirigido al inicio.');
            window.location.href = 'inicio.php';
        }
    }

    async inicializarJuego() {
        try {
            if (!this.idSala || !this.idJugador) {
                throw new Error('ID de sala o jugador no disponible');
            }
            
            console.log('Iniciando juego para sala:', this.idSala);
            
            // Generar cartón inicial automáticamente
            await this.nuevoCarton();
            
            // Iniciar temporizador para el botón de generar cartón
            // y comenzar el juego cuando termine
            await this.iniciarTemporizadorGenerarCarton();
            
            // Ya no iniciamos la cuenta regresiva aquí
        } catch (error) {
            console.error('Error al inicializar el juego:', error);
        }
    }

    async inicializarSegunRol() {
        console.log('Inicializando según rol:', this.rolJugador);
        
        if (this.rolJugador === 'creador') {
            console.log('Iniciando como creador');
            await this.generarBalotas();
            this.iniciarJuego();
        } else {
            console.log('Iniciando como participante');
            this.escucharActualizaciones();
        }
    }

    async generarBalotas() {
        try {
            console.log('Iniciando generación de balotas para sala:', this.idSala);
            
            const formData = new FormData();
            formData.append('sala_id', this.idSala);
            
            const response = await fetch('../php/juego/generarBalotas.php', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            
            if (!data.success) {
                throw new Error(data.error || 'Error al generar balotas');
            }
            
            console.log('Balotas generadas exitosamente');
            return true;
            
        } catch (error) {
            console.error('Error al generar balotas:', error);
            alert('Error al generar balotas: ' + error.message);
            throw error;
        }
    }

    escucharActualizaciones() {
        this.intervalActualizaciones = setInterval(async () => {
            try {
                const response = await fetch('../php/juego/obtenerBalotas.php', {
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
                    // Actualizar el array local de números sacados
                    this.numerosSacados = data.historial;
                    
                    // Actualizar la interfaz
                    this.actualizarPanelBalotas(data.balotas_recientes);
                    this.actualizarHistorialBalotas(data.historial);
                    
                    // Resaltar el último número si es nuevo
                    if (data.balotas_recientes.length > 0) {
                        const ultimaBalota = data.balotas_recientes[data.balotas_recientes.length - 1];
                        this.verificarNumeroEnCarton(ultimaBalota.numero);
                    }
                }
            } catch (error) {
                console.error('Error al obtener actualizaciones:', error);
            }
        }, 2000);
    }

    actualizarPanelBalotas(balotas) {
        const panelNumeros = document.getElementById('numerosSacados');
        if (!panelNumeros) return;

        // Limpiar panel actual
        panelNumeros.innerHTML = '';

        // Agregar las balotas más recientes
        balotas.forEach((balota, index) => {
            const balotaElement = document.createElement('div');
            balotaElement.className = 'balota';
            if (index === balotas.length - 1) {
                balotaElement.classList.add('nueva-balota');
            }
            
            balotaElement.innerHTML = `
                <span class="letra">${balota.letra}</span>
                <span class="numero">${balota.numero}</span>
            `;
            
            balotaElement.style.animation = 'balotaEntrada 0.5s ease-out';
            
            panelNumeros.appendChild(balotaElement);
        });
    }

    actualizarHistorialBalotas(historial) {
        const panelIzquierdo = document.querySelector('.izquierda');
        if (!panelIzquierdo) return;

        // Agrupar números por letra
        const numerosPorLetra = {
            'B': [], 'I': [], 'N': [], 'G': [], 'O': []
        };

        historial.forEach(balota => {
            numerosPorLetra[balota.letra].push(balota.numero);
        });

        // Crear el contenedor del historial
        const historialContainer = document.createElement('div');
        historialContainer.id = 'panel-historial';

        // Crear columnas para cada letra
        Object.entries(numerosPorLetra).forEach(([letra, numeros]) => {
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

        // Actualizar el panel izquierdo
        panelIzquierdo.innerHTML = '';
        panelIzquierdo.appendChild(historialContainer);
    }

    async iniciarJuego() {
        this.intervaloBalotas = setInterval(async () => {
            await this.sacarNuevoNumero();
        }, 5000); // Sacar número cada 5 segundos
    }

    async sacarNuevoNumero() {
        try {
            // console.log('Intentando sacar nuevo número para sala:', this.idSala);
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
            // console.log('Respuesta sacarNumero:', data);
            
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

    obtenerNumerosMarcados() {
        const numerosMarcados = [];
        const celdas = document.querySelectorAll('.columna1');
        
        celdas.forEach(celda => {
            if (celda.classList.contains('marcado')) {
                const numero = parseInt(celda.textContent);
                if (!isNaN(numero)) {
                    numerosMarcados.push(numero);
                }
            }
        });
        
        return numerosMarcados;
    }

    async verificarBingo() {
        try {
            const numerosMarcados = this.obtenerNumerosMarcados();
            
            // Verificar que hay números marcados
            if (numerosMarcados.length === 0) {
                await Swal.fire({
                    title: 'Error',
                    text: 'Debes marcar al menos un número para verificar el bingo',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;
            }

            // Verificar que tenemos todos los datos necesarios
            if (!this.idSala || !this.idJugador) {
                throw new Error('Faltan datos de la sala o jugador');
            }

            console.log('Enviando datos:', {
                id_sala: this.idSala,
                id_jugador: this.idJugador,
                numeros_marcados: numerosMarcados
            });

            const response = await fetch('../php/juego/verificarBingo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.idSala,
                    id_jugador: this.idJugador,
                    numeros_marcados: numerosMarcados
                })
            });

            // Depuración
            const responseText = await response.text();
            console.log('Respuesta cruda del servidor:', responseText);
            try {
                const data = JSON.parse(responseText);
                
                if (data.success) {
                    await Swal.fire({
                        title: '¡BINGO!',
                        text: '¡Felicitaciones! Has ganado la partida',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    
                    if (data.ranking) {
                        await this.finalizarJuego(data);
                    }
                } else {
                    await Swal.fire({
                        title: 'Error',
                        text: data.error || 'Los números marcados no son correctos',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            } catch (error) {
                console.error('Error al parsear JSON:', error);
                console.log('Texto recibido:', responseText);
                throw error;
            }
        } catch (error) {
            console.error('Error al verificar bingo:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Hubo un error al verificar el bingo. Por favor, inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    async finalizarJuego(data) {
        try {
            // Preparar el mensaje del ranking
            let mensajeRanking = '';
            data.ranking.forEach((jugador, index) => {
                let posicion = '';
                switch(index) {
                    case 0:
                        posicion = '🥇 Primer lugar';
                        break;
                    case 1:
                        posicion = '🥈 Segundo lugar';
                        break;
                    case 2:
                        posicion = '🥉 Tercer lugar';
                        break;
                    default:
                        posicion = `${index + 1}º lugar`;
                }
                mensajeRanking += `${posicion}: ${jugador.nombre_jugador} (${jugador.aciertos} aciertos)\n`;
            });

            // Mostrar el mensaje con el ranking
            await Swal.fire({
                title: '¡Fin del juego!',
                html: `<div class="ranking-mensaje">
                        <h3>🏆 Ranking Final 🏆</h3>
                        <pre style="text-align: left; margin: 20px auto; font-family: Arial;">${mensajeRanking}</pre>
                      </div>`,
                icon: 'success',
                confirmButtonText: 'Volver al inicio',
                allowOutsideClick: false,
                customClass: {
                    popup: 'ranking-popup',
                    content: 'ranking-content'
                }
            });

            // Detener todas las actualizaciones y redirigir
            await this.detenerJuego();
            window.location.href = 'inicio.php';
                
        } catch (error) {
            console.error('Error al finalizar el juego:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Hubo un error al finalizar el juego. Serás redirigido al inicio.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            window.location.href = 'inicio.php';
        }
    }

    async detenerJuego() {
        try {
            if (this.intervalEfectos) {
                clearInterval(this.intervalEfectos);
            }
            if (this.intervalActualizaciones) {
                clearInterval(this.intervalActualizaciones);
            }
            if (this.intervaloBalotas) {
                clearInterval(this.intervaloBalotas);
            }
            if (this.intervalEstadoSala) {
                clearInterval(this.intervalEstadoSala);
            }

            const response = await fetch('../php/juego/salirSala.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.idSala
                })
            });

            // Depuración
            const responseText = await response.text();
            console.log('Respuesta del servidor:', responseText);

            try {
                const data = JSON.parse(responseText);
                if (data.success) {
                    window.location.href = 'inicio.php';
                } else {
                    throw new Error(data.error || 'Error al salir de la sala');
                }
            } catch (parseError) {
                console.error('Error al parsear respuesta:', parseError);
                console.log('Texto recibido:', responseText);
                throw parseError;
            }
        } catch (error) {
            console.error('Error al salir de la sala:', error);
            await Swal.fire({
                title: 'Error',
                text: 'Hubo un error al salir de la sala. Serás redirigido al inicio.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            window.location.href = 'inicio.php';
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

    async nuevoCarton() {
        try {
            // Verificar si el botón está deshabilitado
            const btnGenerarCarton = document.getElementById('btnGenerarCarton');
            if (btnGenerarCarton && btnGenerarCarton.disabled) {
                alert('El tiempo para generar un nuevo cartón ha expirado');
                return false;
            }

            // Limpiar las marcas del cartón anterior si existe
            const celdasMarcadas = document.querySelectorAll('.columna1.marcado');
            celdasMarcadas.forEach(celda => {
                celda.classList.remove('marcado');
            });

            // Definir los rangos correctos para cada letra del BINGO
            const rangos = {
                'B': { min: 1, max: 15 },     // B: 1-15
                'I': { min: 16, max: 30 },    // I: 16-30
                'N': { min: 31, max: 45 },    // N: 31-45
                'G': { min: 46, max: 60 },    // G: 46-60
                'O': { min: 61, max: 75 }     // O: 61-75
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
                
                // Mezclar números usando el algoritmo Fisher-Yates
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
                    celda.classList.add('celda-clickeable');
                    celda.addEventListener('click', () => this.toggleCasilla(celda));
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
            // En lugar de marcar automáticamente, solo verificamos si el número existe en el cartón
            const celdas = document.querySelectorAll('.columna1');
            celdas.forEach(celda => {
                if (celda.dataset.numero === numero.toString()) {
                    // Ya no marcamos automáticamente
                    // celda.classList.add('marcado');
                    
                    // Opcionalmente podemos resaltar temporalmente el número
                    celda.classList.add('numero-disponible');
                    setTimeout(() => {
                        celda.classList.remove('numero-disponible');
                    }, 2000);
                }
            });

            // Verificar si hay línea o bingo solo cuando el jugador marca manualmente
            // this.verificarPatrones();
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
                }
                
                balotaElement.innerHTML = `
                    <span class="letra">${balota.letra}</span>
                    <span class="numero">${balota.numero}</span>
                `;
                panelNumeros.appendChild(balotaElement);
            });

            // Actualizar el historial
            this.actualizarPanelHistorial(numerosSacados);
            
            // Permitir a los jugadores marcar manualmente
            this.permitirMarcaManual();

            // Actualizar array local
            this.numerosSacados = [...numerosSacados];
        }
    }

    permitirMarcaManual() {
        const celdas = document.querySelectorAll('#cartonBingo .celda');
        celdas.forEach(celda => {
            celda.onclick = () => {
                if (celda.classList.contains('marcado')) {
                    celda.classList.remove('marcado');
                } else {
                    celda.classList.add('marcado');
                }
            };
        });
    }


    async verificarEfectosActivos() {
        try {
            if (!this.idSala || !this.idJugador) {
                console.error('ID de sala o jugador no disponible');
                return;
            }

            const response = await fetch('../../zombie-plash/php/juego/obtenerEfectosActivos.php', {
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

            const text = await response.text(); // Primero obtener el texto
            console.log('Respuesta del servidor:', text); // Para depuración

            try {
                const data = JSON.parse(text);
                if (data.success && data.efectos) {
                    data.efectos.forEach(efecto => {
                        switch (efecto.tipo_efecto) {
                            case 'oscuridad':
                                this.efectos.iniciarEfectoOscuridad();
                                break;
                            case 'numeros':
                                this.efectos.iniciarEfectoNumeros();
                                break;
                            case 'elige_numero':
                                this.efectos.iniciarEfectoEligeNumero();
                                break;
                        }
                    });
                }
            } catch (parseError) {
                console.error('Error al parsear JSON:', parseError);
                console.log('Texto recibido:', text);
            }
        } catch (error) {
            console.error('Error al verificar efectos:', error);
        }
    }

    async marcarCasilla(casilla) {
        if (!casilla.dataset.numero || !casilla.dataset.letra) return;
        
        const numero = parseInt(casilla.dataset.numero);
        const letra = casilla.dataset.letra;

        // Verificar si el número ha salido
        const numeroHaSalido = this.numerosSacados.some(balota => 
            balota.numero === numero && balota.letra === letra
        );

        if (!numeroHaSalido) {
            alert('Este número aún no ha salido');
            return;
        }
        
        try {
            const response = await fetch('../php/juego/marcarCasilla.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.idSala,
                    id_jugador: this.idJugador,
                    numero: numero,
                    letra: letra
                })
            });

            const data = await response.json();
            
            if (data.success) {
                casilla.classList.toggle('marcado');
                this.verificarPatronesGanadores();
            } else {
                console.error('Error al marcar casilla:', data.error);
                alert(data.error);
            }
        } catch (error) {
            console.error('Error al marcar casilla:', error);
        }
    }

    inicializarCarton() {
        const celdas = document.querySelectorAll('.columna1');
        celdas.forEach(celda => {
            celda.addEventListener('click', () => this.marcarCasilla(celda));
        });
    }

    // Método para marcar/desmarcar casillas
    toggleCasilla(celda) {
        const numero = parseInt(celda.dataset.numero);
        const letra = celda.dataset.letra;

        // Verificar si el número ha salido
        const numeroHaSalido = this.numerosSacados.some(balota => 
            balota.numero === numero && balota.letra === letra
        );

        if (!numeroHaSalido) {
            alert('Este número aún no ha salido');
            return;
        }

        celda.classList.toggle('marcado');
        this.verificarPatronesGanadores();
    }

    // Modificar el método verificarPatronesGanadores
    verificarPatronesGanadores() {
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
        }

        // Si todas las casillas están marcadas, habilitar el botón de BINGO
        const btnBingo = document.querySelector('.bingo button[onclick="bingoGame.verificarBingo()"]');
        if (btnBingo) {
            btnBingo.disabled = numerosCompletados !== 25;
        }
    }

    iniciarConsultaEfectos() {
        this.intervalEfectos = setInterval(async () => {
            try {
                if (!this.idSala || !this.idJugador) return;
                
                const response = await fetch('../php/juego/consultarEfectos.php', {
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
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.success && data.efectos && data.efectos.length > 0) {
                    data.efectos.forEach(efecto => {
                        this.aplicarEfectoRecibido(efecto);
                    });
                }
            } catch (error) {
                console.error('Error al consultar efectos:', error);
            }
        }, 2000);
    }

    aplicarEfectoRecibido(efecto) {
        switch (efecto.tipo_efecto) {
            case 'oscuridad':
                this.efectos.iniciarEfectoOscuridad();
                break;
            case 'numeros':
                this.efectos.iniciarEfectoNumeros();
                break;
            case 'elige_numero':
                this.efectos.iniciarEfectoEligeNumero();
                break;
        }

        // Mostrar notificación
        this.mostrarNotificacionEfecto(efecto);
    }

    mostrarNotificacionEfecto(efecto) {
        const mensaje = `${efecto.origen_nombre} te ha aplicado el efecto: ${efecto.tipo_efecto}`;
        // Aquí puedes usar tu sistema de notificaciones preferido
        alert(mensaje);
    }

    iniciarTemporizadorGenerarCarton() {
        return new Promise((resolve) => {
        const btnGenerarCarton = document.getElementById('btnGenerarCarton');
            if (!btnGenerarCarton) return resolve();

        let tiempoRestante = this.tiempoGenerarCarton;
        btnGenerarCarton.disabled = false;
        
        // Actualizar el texto del botón con el tiempo restante
        const actualizarTextoBoton = () => {
            btnGenerarCarton.textContent = `Generar Cartón (${tiempoRestante}s)`;
        };
        
        actualizarTextoBoton();

        this.timerGenerarCarton = setInterval(() => {
            tiempoRestante--;
            actualizarTextoBoton();
            
            if (tiempoRestante <= 0) {
                clearInterval(this.timerGenerarCarton);
                btnGenerarCarton.disabled = true;
                btnGenerarCarton.textContent = 'Tiempo agotado';
                    
                    // Usar window.Swal en lugar de Swal directamente
                    window.Swal.fire({
                        title: '¡Comienza el juego!',
                        text: 'Tu cartón ha sido fijado. ¡Buena suerte!',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        // Iniciar la cuenta regresiva y el juego
                        this.cuentaRegresiva.iniciarCuentaRegresiva(() => {
                            this.inicializarSegunRol();
                        });
                        resolve();
                    });
            }
        }, 1000);
        });
    }

    iniciarConsultaEstado() {
        this.intervalEstadoSala = setInterval(async () => {
            try {
                const response = await fetch('../php/juego/consultarEstadoSala.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_sala: this.idSala
                    })
                });

                const data = await response.json();
                
                if (data.success && data.estado === 'finalizado' && data.ranking) {
                    // Detener todas las consultas
                    this.detenerIntervalos();
                    
                    // Mostrar el ranking final
                    await this.mostrarRankingFinal(data);
                }
            } catch (error) {
                console.error('Error al consultar estado de la sala:', error);
            }
        }, 2000); // Consultar cada 2 segundos
    }

    detenerIntervalos() {
        if (this.intervalEfectos) clearInterval(this.intervalEfectos);
        if (this.intervalActualizaciones) clearInterval(this.intervalActualizaciones);
        if (this.intervaloBalotas) clearInterval(this.intervaloBalotas);
        if (this.intervalEstadoSala) clearInterval(this.intervalEstadoSala);
    }

    async mostrarRankingFinal(data) {
        try {
            // Preparar el mensaje del ranking
            let mensajeRanking = '';
            data.ranking.forEach((jugador, index) => {
                let posicion = '';
                let esGanador = jugador.nombre_jugador === data.ganador_nombre;
                
                switch(index) {
                    case 0:
                        posicion = '🥇 Primer lugar';
                        break;
                    case 1:
                        posicion = '🥈 Segundo lugar';
                        break;
                    case 2:
                        posicion = '🥉 Tercer lugar';
                        break;
                    default:
                        posicion = `${index + 1}º lugar`;
                }
                
                mensajeRanking += `${posicion}: ${jugador.nombre_jugador} ${esGanador ? '👑' : ''} (${jugador.aciertos} aciertos)\n`;
            });

            // Mostrar el mensaje con el ranking
            await Swal.fire({
                title: '¡Fin del juego!',
                html: `<div class="ranking-mensaje">
                        <h3>🏆 Ranking Final 🏆</h3>
                        <h4>${data.ganador_nombre} ha ganado la partida!</h4>
                        <pre style="text-align: left; margin: 20px auto; font-family: Arial;">${mensajeRanking}</pre>
                      </div>`,
                icon: 'success',
                confirmButtonText: 'Volver al inicio',
                allowOutsideClick: false,
                customClass: {
                    popup: 'ranking-popup',
                    content: 'ranking-content'
                }
            });

            // Redirigir al inicio
            window.location.href = 'inicio.php';
        } catch (error) {
            console.error('Error al mostrar ranking final:', error);
            window.location.href = 'inicio.php';
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
