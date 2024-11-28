// Importar las clases
import  CuentaRegresiva  from './cuentaregresiva.js';
import  Efectos  from './efectos.js';

class BingoGame{
    constructor() {
        this.carton = null;
        this.numerosSacados = [];
        this.cuentaRegresiva = new CuentaRegresiva();
        this.efectos = new Efectos();
        this.init();
        this.actualizarPanelNumeros();
    }

      async init() {
        await this.obtenerCarton();
        this.mostrarNumerosSacados();
        this.inicializarEventos();
        this.cuentaRegresiva.iniciarCuentaRegresiva(() => {
            this.iniciarJuego();
        });
    }

    // Métodos para los efectos
    toggleEfectoOscuridad() {
        this.efectos.toggleEfectoOscuridad();
    }

    toggleEfectoNumeros() {
        this.efectos.toggleEfectoNumeros();
    }

    toggleEfectoBloqueo() {
        this.efectos.toggleEfectoBloqueo();
    }

    toggleEfectoEligeNumero() {
        this.efectos.iniciarEfectoEligeNumero();
    }

    async obtenerCarton() {
        try {
            const response = await fetch('../php/obtenerCarton.php');
            const data = await response.json();
            this.carton = data.carton;
            this.numerosSacados = data.numerosSacados;
            this.mostrarCarton();
        } catch (error) {
            console.error('Error al obtener el cartón:', error);
        }
    }


    mostrarCarton() {
        const letras = ['B', 'I', 'N', 'G', 'O'];
        letras.forEach((letra, columnaIndex) => {
            const numeros = this.carton[letra];
            numeros.forEach((numero, filaIndex) => {
                const celda = document.querySelector(
                    `#cartonBingo .fila5:nth-child(${filaIndex + 1}) .columna1:nth-child(${columnaIndex + 1})`
                );
                if (celda) {
                    // Asigna solo el número a la celda
                    celda.textContent = numero;
                    if (this.numerosSacados.includes(numero)) {
                        celda.classList.add('marcado');
                    } else {
                        celda.classList.remove('marcado');
                    }
                }
            });
        });
    }

    mostrarNumerosSacados() {
        const resultados = document.getElementById('numerosSacados');
        if (!resultados) return;
    
        // Obtener el último número sacado
        const ultimoNumero = this.numerosSacados[this.numerosSacados.length - 1];
        
        if (ultimoNumero) {
            let letra;
            if (ultimoNumero >= 1 && ultimoNumero <= 12) letra = 'B';
            else if (ultimoNumero >= 13 && ultimoNumero <= 23) letra = 'I';
            else if (ultimoNumero >= 24 && ultimoNumero <= 34) letra = 'N';
            else if (ultimoNumero >= 35 && ultimoNumero <= 45) letra = 'G';
            else if (ultimoNumero >= 46 && ultimoNumero <= 60) letra = 'O';
    
            // Crear elemento para la nueva balota
            const nuevaBalota = document.createElement('div');
            nuevaBalota.className = 'balota nueva-balota';
            nuevaBalota.textContent = `${letra}${ultimoNumero}`;
    
            // Insertar la nueva balota a la derecha
            resultados.appendChild(nuevaBalota);
    
            // Mover las balotas y eliminar la primera si hay más de 4
            setTimeout(() => {
                nuevaBalota.classList.remove('nueva-balota');
                const balotas = resultados.getElementsByClassName('balota');
                if (balotas.length > 5) {
                    const primeraBalota = balotas[0];
                    primeraBalota.classList.add('balota-saliente');
                    setTimeout(() => {
                        resultados.removeChild(primeraBalota);
                    }, 100);
                }
            }, 500);
        }
    }

    iniciarJuego() {
        console.log('Iniciando juego...');
        // Inicia el intervalo para sacar un número cada 5 segundos
        this.intervalId = setInterval(() => {
            this.sacarNumero();
        }, 5000);
    }

    detenerJuego() {
        // Detiene el intervalo
        clearInterval(this.intervalId);
        // limpia el registro de los numeros sacados
        this.numerosSacados = [];
        this.mostrarNumerosSacados();

    }
    inicializarEventos() {
        document.querySelectorAll('.columna1').forEach(celda => {
            celda.addEventListener('click', () => this.marcarNumero(celda));
        });
    }

    marcarNumero(celda) {
        // Alterna la clase 'marcado' en la celda
        celda.classList.toggle('marcado');
    }


    async sacarNumero() {
        try {
            console.log('Sacando número...');
            const response = await fetch('../php/sacarNumero.php');
            const data = await response.json();
            if (data.success) {
                this.numerosSacados.push(data.numero);
                this.mostrarNumerosSacados();
                this.verificarNumeroEnCarton(data.numero);
                this.actualizarNumerosEnPanel();
            }
        } catch (error) {
            console.error('Error al sacar número:', error);
        }
    }
    async nuevoCarton() {
        try {
            const response = await fetch('../php/nuevoCarton.php');
            const data = await response.json();
            if (data.success) {
                this.carton = data.carton;
                this.numerosSacados = [];
                this.mostrarCarton();
                this.mostrarNumerosSacados();
            }
        } catch (error) {
            console.error('Error al generar nuevo cartón:', error);
        }
    }

    verificarNumeroEnCarton(numero) {
        document.querySelectorAll('.columna1').forEach(celda => {
            if (parseInt(celda.textContent.slice(1)) === numero) {
                celda.classList.add('numero-sacado');
            }
        });
    }
// verificcion del grito bingo!!
    verificarBingo() {
        const mensajeValidacion = document.createElement('div');
        mensajeValidacion.className = 'mensaje-validacion';
        
        // Primero verificar que todas las celdas marcadas correspondan a números sacados
        const celdasMarcadas = document.querySelectorAll('.columna1.marcado');
        let esValido = true;
        
        // Verificar que los números marcados hayan sido sacados
        celdasMarcadas.forEach(celda => {
            const numero = parseInt(celda.textContent);
            if (!this.numerosSacados.includes(numero)) {
                esValido = false;
                mensajeValidacion.textContent = `El número ${numero} está marcado pero no ha sido sacado`;
                mensajeValidacion.classList.add('mensaje-error');
                return;
            }
        });

        // Si los números marcados son válidos, verificar si hay bingo
        if (esValido) {
            let bingoEncontrado = this.verificarFilas() || 
                                 this.verificarColumnas() || 
                                 this.verificarDiagonales();

            if (bingoEncontrado) {
                mensajeValidacion.textContent = '¡BINGO! ¡Has ganado!';
                mensajeValidacion.classList.add('mensaje-exito');
                this.detenerJuego();
            } else {
                mensajeValidacion.textContent = 'No hay bingo válido. Sigue jugando.';
                mensajeValidacion.classList.add('mensaje-error');
            }
        }

        // Mostrar el mensaje
        const mensajeAnterior = document.querySelector('.mensaje-validacion');
        if (mensajeAnterior) {
            mensajeAnterior.remove();
        }
        document.querySelector('.bingo').appendChild(mensajeValidacion);

        // Eliminar el mensaje después de 3 segundos
        setTimeout(() => {
            mensajeValidacion.remove();
        }, 3000);
    }

    verificarFilas() {
        for (let i = 0; i < 5; i++) {
            const fila = document.querySelectorAll(`.fila5:nth-child(${i + 1}) .columna1`);
            if (this.verificarLineaConNumerosSacados(Array.from(fila))) {
                return true;
            }
        }
        return false;
    }

    verificarColumnas() {
        for (let i = 0; i < 5; i++) {
            const columna = Array.from(document.querySelectorAll('.fila5')).map(
                fila => fila.children[i]
            );
            if (this.verificarLineaConNumerosSacados(columna)) {
                return true;
            }
        }
        return false;
    }

    verificarDiagonales() {
        // Diagonal principal
        const diagonal1 = Array.from(document.querySelectorAll('.fila5')).map(
            (fila, i) => fila.children[i]
        );
        
        // Diagonal secundaria
        const diagonal2 = Array.from(document.querySelectorAll('.fila5')).map(
            (fila, i) => fila.children[4 - i]
        );

        return this.verificarLineaConNumerosSacados(diagonal1) || 
               this.verificarLineaConNumerosSacados(diagonal2);
    }

    verificarLineaConNumerosSacados(celdas) {
        return celdas.every(celda => {
            const numero = parseInt(celda.textContent);
            return celda.classList.contains('marcado') && this.numerosSacados.includes(numero);
        });
        }

    actualizarPanelNumeros(numero) {
        const panelIzquierdo = document.querySelector('.izquierda');
        if (!panelIzquierdo) return;

        // Crear el panel si no existe
        if (!document.getElementById('panel-historial')) {
            const panel = document.createElement('div');
            panel.id = 'panel-historial';
            panel.style.height = '100%';
            panel.style.padding = '8px';
            panel.style.display = 'flex';
            panel.style.flexDirection = 'column';
            panel.style.color = 'black';
            panel.style.fontSize = '20px';

            // Crear contenedores para cada letra
            ['B', 'I', 'N', 'G', 'O'].forEach(letra => {
                const columna = document.createElement('div');
                columna.className = `columna-${letra}`;
                columna.style.marginBottom = '10px';
                
                const titulo = document.createElement('div');
                titulo.textContent = letra;
                titulo.style.fontWeight = 'bold';
                titulo.style.marginBottom = '5px';
                
                const numeros = document.createElement('div');
                numeros.id = `numeros-${letra}`;
                numeros.style.display = 'flex';
                numeros.style.flexWrap = 'wrap';
                numeros.style.gap = '5px';
                
                columna.appendChild(titulo);
                columna.appendChild(numeros);
                panel.appendChild(columna);
            });

            panelIzquierdo.appendChild(panel);
        }

        // Actualizar el método mostrarNumerosSacados para incluir la actualización del panel
        this.actualizarNumerosEnPanel();
    }

    actualizarNumerosEnPanel() {
        // Limpiar todos los contenedores de números
        ['B', 'I', 'N', 'G', 'O'].forEach(letra => {
            const contenedor = document.getElementById(`numeros-${letra}`);
            if (contenedor) {
                contenedor.innerHTML = '';
            }
        });

        // Organizar y mostrar los números por columna
        this.numerosSacados.forEach(numero => {
            let letra;
            if (numero <= 12) letra = 'B';
            else if (numero <= 23) letra = 'I';
            else if (numero <= 34) letra = 'N';
            else if (numero <= 45) letra = 'G';
            else if (numero <= 60) letra = 'O';

            const contenedor = document.getElementById(`numeros-${letra}`);
            if (contenedor) {
                const numeroElement = document.createElement('span');
                numeroElement.textContent = numero;
                // numeroElement.style.backgroundColor = '#ff6b6b';
                numeroElement.style.padding = '2px 5px';
                numeroElement.style.borderRadius = '3px';
                numeroElement.style.marginRight = '3px';
                contenedor.appendChild(numeroElement);
            }
        });
    }

    iniciarEfectoEligeNumero() {
        // Filtrar números que no han sido sacados
        const numerosDisponibles = Array.from({ length: 60 }, (_, i) => i + 1).filter(
            numero => !bingoGame.numerosSacados.includes(numero)
        );

        const contenedor = document.getElementById('numerosDisponibles');
        contenedor.innerHTML = ''; // Limpiar contenido previo

        // Crear botones para cada número disponible
        numerosDisponibles.forEach(numero => {
            const botonNumero = document.createElement('button');
            botonNumero.textContent = numero;
            botonNumero.onclick = () => this.seleccionarNumero(numero);
            contenedor.appendChild(botonNumero);
        });

        document.getElementById('modalEligeNumero').style.display = 'block';
    }

}   


// Exportar la instancia del juego
window.bingoGame = new BingoGame();

