class BingoGame {
    constructor() {
        this.carton = null;
        this.numerosSacados = [];
        this.init();
// efectos visales
        // this.efectoOscuridadActivo = false;
        // this.efectoNumerosActivo = false;
        // this.efectoBloqueoActivo = false;
        // this.intervalOscuridad = null;
        // this.intervalNumeros = null;
        // this.inicializarEfectos();
    }

    async init() {
        await this.obtenerCarton();
        this.mostrarNumerosSacados();
        this.inicializarEventos();
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
        const numerosConLetras = this.numerosSacados.map(numero => {
            let letra;
            if (numero >= 1 && numero <= 12) letra = 'B';
            else if (numero >= 13 && numero <= 23) letra = 'I';
            else if (numero >= 24 && numero <= 34) letra = 'N';
            else if (numero >= 35 && numero <= 45) letra = 'G';
            else if (numero >= 46 && numero <= 60) letra = 'O';
            
            return `${letra}${numero}`;
        });

        resultados.textContent = `${numerosConLetras.join(', ')}`;
    }

    iniciarJuego() {
        // Inicia el intervalo para sacar un número cada 5 segundos
        this.intervalId = setInterval(() => {
            this.sacarNumero();
        }, 3000);
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
        
        // Agregar botones para los efectos
        // const btnEfectos = document.createElement('button');
        // btnEfectos.textContent = 'Activar Efectos';
        // btnEfectos.onclick = () => this.toggleEfectos();
        // document.querySelector('.bingo').appendChild(btnEfectos);
    }

    marcarNumero(celda) {
        // Alterna la clase 'marcado' en la celda
        celda.classList.toggle('marcado');
    }

    toggleEfectos() {
        this.efectoOscuridadActivo = !this.efectoOscuridadActivo;
        this.efectoNumerosActivo = !this.efectoNumerosActivo;
        this.efectoBloqueoActivo = !this.efectoBloqueoActivo;
        if (this.efectoOscuridadActivo) {
            this.iniciarEfectoOscuridad();
        } else {
            this.detenerEfectoOscuridad();
        }
        if (this.efectoNumerosActivo) {
            this.iniciarEfectoNumeros();
        } else {
            this.detenerEfectoNumeros();
        }
        if (this.efectoBloqueoActivo) {
            this.iniciarEfectoBloqueo();
        } else {
            this.detenerEfectoBloqueo();
        }
    }

    // inicializarEfectos() {
    //     const contenedorBotones = document.createElement('div');
    //     contenedorBotones.className = 'bingo';

    //     // Botón efecto oscuridad
    //     const btnOscuridad = document.createElement('button');
    //     btnOscuridad.className = 'bh';
    //     btnOscuridad.textContent = 'Efecto Oscuridad';
    //     btnOscuridad.onclick = () => this.toggleEfectoOscuridad();

    //     // Botón efecto números aleatorios
    //     const btnNumeros = document.createElement('button');
    //     btnNumeros.className = 'bh';
    //     btnNumeros.textContent = 'Efecto Números';
    //     btnNumeros.onclick = () => this.toggleEfectoNumeros();

    //     // Botón efecto bloqueo
    //     const btnBloqueo = document.createElement('button');
    //     btnBloqueo.className = 'bh';
    //     btnBloqueo.textContent = 'Bloquear Bingo';
    //     btnBloqueo.onclick = () => this.toggleEfectoBloqueo();

    //     contenedorBotones.appendChild(btnOscuridad);
    //     contenedorBotones.appendChild(btnNumeros);
    //     contenedorBotones.appendChild(btnBloqueo);
    //     document.querySelector('.derecha').appendChild(contenedorBotones);
    // }

    toggleEfectoOscuridad() {
        this.efectoOscuridadActivo = !this.efectoOscuridadActivo;
        const btnOscuridad = document.querySelector('.colu2 button:nth-child(1)');
        
        if (this.efectoOscuridadActivo) {
            this.iniciarEfectoOscuridad();
            if (btnOscuridad) {
                btnOscuridad.textContent = 'Oscuridad Activa';
                btnOscuridad.classList.add('activo');
                btnOscuridad.disabled = true;
                setTimeout(() => {
                    btnOscuridad.disabled = false;
                    btnOscuridad.textContent = 'Oscuridad';
                    btnOscuridad.classList.remove('activo');
                }, 10000);
            }
        } else {
            this.detenerEfectoOscuridad();
            if (btnOscuridad) {
                btnOscuridad.textContent = 'Oscuridad';
                btnOscuridad.classList.remove('activo');
            }
        }
    }

    toggleEfectoNumeros() {
        this.efectoNumerosActivo = !this.efectoNumerosActivo;
        const btnNumeros = document.querySelector('.colu2 button:nth-child(2)');
        
        if (this.efectoNumerosActivo) {
            this.iniciarEfectoNumeros();
            if (btnNumeros) {
                btnNumeros.textContent = 'Números Activos';
                btnNumeros.classList.add('activo');
                btnNumeros.disabled = true;
                setTimeout(() => {
                    btnNumeros.disabled = false;
                    btnNumeros.textContent = 'Números';
                    btnNumeros.classList.remove('activo');
                }, 10000);
            }
        } else {
            this.detenerEfectoNumeros();
            if (btnNumeros) {
                btnNumeros.textContent = 'Números';
                btnNumeros.classList.remove('activo');
            }
        }
    }

    toggleEfectoBloqueo() {
        this.efectoBloqueoActivo = !this.efectoBloqueoActivo;
        const btnBloqueo = document.querySelector('.colu2 button:nth-child(3)');
        
        if (this.efectoBloqueoActivo) {
            this.iniciarEfectoBloqueo();
            btnBloqueo.textContent = 'Bloqueo Activo';
            btnBloqueo.classList.add('none');
        } else {
            this.detenerEfectoBloqueo();
            btnBloqueo.textContent = 'Bloqueo';
            btnBloqueo.classList.remove('none');
        }
    }

    iniciarEfectoOscuridad() {
        let overlay = document.getElementById('zombie-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'zombie-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            overlay.style.zIndex = '9999';
            overlay.style.transition = 'opacity 0.3s';
            overlay.style.pointerEvents = 'none';
            document.body.appendChild(overlay);
        }

        this.intervalOscuridad = setInterval(() => {
            if (Math.random() < 0.10) {
                overlay.style.backgroundColor = 'black';
                setTimeout(() => {
                    overlay.style.backgroundColor = '';
                }, 500);
            }
        }, 3000);

        // Detener después de 10 segundos
        setTimeout(() => {
            this.detenerEfectoOscuridad();
            const btnOscuridad = document.querySelector('button[onclick="bingoGame.toggleEfectoOscuridad()"]');
            if (btnOscuridad) {
                btnOscuridad.textContent = 'Efecto Oscuridad';
            }
            this.efectoOscuridadActivo = false;
        }, 10000);
    }

    iniciarEfectoNumeros() {
        this.intervalNumeros = setInterval(() => {
            const celdas = document.querySelectorAll('.columna1');
            const celdasArray = Array.from(celdas);
            for (let i = 0; i < 5; i++) {
                const celdaAleatoria = celdasArray[Math.floor(Math.random() * celdasArray.length)];
                celdaAleatoria.classList.toggle('marcado');
                setTimeout(() => {
                    celdaAleatoria.classList.toggle('marcado');
                }, 1000);
            }
        }, 3000);

        // Detener después de 10 segundos
        setTimeout(() => {
            this.detenerEfectoNumeros();
            const btnNumeros = document.querySelector('button[onclick="bingoGame.toggleEfectoNumeros()"]');
            if (btnNumeros) {
                btnNumeros.textContent = 'Efecto Números';
            }
            this.efectoNumerosActivo = false;
        }, 10000);
    }

    iniciarEfectoBloqueo() {
        const btnBingo = document.querySelector('#btnBingo');
        if (btnBingo) {
            btnBingo.disabled = true;
            btnBingo.style.opacity = '0.5';
        }
    }

    detenerEfectoOscuridad() {
        clearInterval(this.intervalOscuridad);
        const overlay = document.getElementById('zombie-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    detenerEfectoNumeros() {
        clearInterval(this.intervalNumeros);
    }

    detenerEfectoBloqueo() {
        const btnBingo = document.querySelector('#btnBingo');
        if (btnBingo) {
            btnBingo.disabled = false;
            btnBingo.style.opacity = '1';
        }
    }

    async sacarNumero() {
        try {
            const response = await fetch('../php/sacarNumero.php');
            const data = await response.json();
            if (data.success) {
                this.numerosSacados.push(data.numero);
                this.mostrarNumerosSacados();
                this.verificarNumeroEnCarton(data.numero);
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
}   


const bingoGame = new BingoGame();
// Para iniciar el juego automáticamente
bingoGame.iniciarJuego();