class Efectos {
    constructor() {
        this.efectoOscuridadActivo = false;
        this.efectoNumerosActivo = false;
        this.efectoBloqueoActivo = false;
        this.efectoEligeNumeroActivo = false;
        this.idJugador = localStorage.getItem('id_jugador');
        this.idSala = JSON.parse(localStorage.getItem('datosSala'))?.id_sala;
    }

    async aplicarEfectoAJugadores(tipoEfecto) {
        try {
            const response = await fetch('../../zombie-plash/php/juego/aplicarEfecto.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.idSala,
                    jugador_origen: this.idJugador,
                    tipo_efecto: tipoEfecto
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.success) {
                console.log(`Efecto ${tipoEfecto} aplicado a ${data.jugadores_afectados} jugadores`);
                return true;
            } else {
                console.error('Error al aplicar efecto:', data.error);
                return false;
            }
        } catch (error) {
            console.error('Error al aplicar efecto:', error);
            return false;
        }
    }

    toggleEfectos() {
        this.efectoOscuridadActivo = !this.efectoOscuridadActivo;
        this.efectoNumerosActivo = !this.efectoNumerosActivo;
        this.efectoBloqueoActivo = !this.efectoBloqueoActivo;
        if (this.efectoOscuridadActivo) {
            this.aplicarEfectoAJugadores('oscuridad');
            this.iniciarEfectoOscuridad();
        } else {
            this.detenerEfectoOscuridad();
        }
        if (this.efectoNumerosActivo) {
            this.aplicarEfectoAJugadores('numeros');
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

    async toggleEfectoOscuridad() {
        if (!this.efectoOscuridadActivo) {
            const aplicado = await this.aplicarEfectoAJugadores('oscuridad');
            if (aplicado) {
                this.efectoOscuridadActivo = true;
                const btnOscuridad = document.querySelector('.colu2 button:nth-child(1)');
                if (btnOscuridad) {
                    btnOscuridad.textContent = 'Oscuridad Activa';
                    btnOscuridad.classList.add('activo');
                    btnOscuridad.disabled = true;
                    setTimeout(() => {
                        btnOscuridad.disabled = false;
                        btnOscuridad.textContent = 'Oscuridad';
                        btnOscuridad.classList.remove('activo');
                        this.efectoOscuridadActivo = false;
                    }, 10000);
                }
            }
        }
    }

    toggleEfectoNumeros() {
        this.efectoNumerosActivo = !this.efectoNumerosActivo;
        if (this.efectoNumerosActivo) {
            this.aplicarEfectoAJugadores('numeros');
        }
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

    toggleEfectoEligeNumero() {
        if (this.efectoEligeNumeroActivo) {
            this.aplicarEfectoAJugadores('elige_numero');
        }
        this.efectoEligeNumeroActivo = !this.efectoEligeNumeroActivo;
        const btnEligeNumero = document.querySelector('.colu2 button:nth-child(4)');
        
        if (this.efectoEligeNumeroActivo) {
            this.iniciarEfectoEligeNumero();
            if (btnEligeNumero) {
                btnEligeNumero.textContent = 'Elige Número Activo';
                btnEligeNumero.classList.add('activo');
                btnEligeNumero.disabled = true;
                setTimeout(() => {
                    btnEligeNumero.disabled = false;
                    btnEligeNumero.textContent = 'Elige Número';
                    btnEligeNumero.classList.remove('activo');
                }, 10000);
            }
        } else {
            this.detenerEfectoEligeNumero();
            if (btnEligeNumero) {
                btnEligeNumero.textContent = 'Elige Número';
                btnEligeNumero.classList.remove('activo');
            }
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
            overlay.style.backgroundColor = 'rgba(0, 0, 0)';
            overlay.style.zIndex = '9999';
            overlay.style.transition = 'opacity 0.3s';
            overlay.style.pointerEvents = 'none';
            document.body.appendChild(overlay);
        }

        let videoElement = document.getElementById('zombie-video');
        if (!videoElement) {
            videoElement = document.createElement('video');
            videoElement.id = 'zombie-video';
            videoElement.style.position = 'fixed';
            videoElement.style.top = '0';
            videoElement.style.left = '0';
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            videoElement.style.zIndex = '10000';
            videoElement.style.opacity = '0';
            videoElement.style.transition = 'opacity 0.3s';
            
            const sourceMP4 = document.createElement('source');
            sourceMP4.src = '../videos/efecto1.mp4';
            sourceMP4.type = 'video/mp4';
            
            const sourceWebM = document.createElement('source');
            sourceWebM.src = '../videos/efecto1.webm';
            sourceWebM.type = 'video/webm';
            
            videoElement.appendChild(sourceMP4);
            videoElement.appendChild(sourceWebM);
            
            videoElement.muted = true;
            videoElement.preload = 'auto';
            
            videoElement.onerror = (e) => {
                console.error('Error en el video:', videoElement.error);
            };

            document.body.appendChild(videoElement);
        }

        videoElement.load();
        videoElement.oncanplaythrough = () => {
            videoElement.style.opacity = '1';
            videoElement.play().catch(e => console.error('Error al reproducir el video:', e));
        };

        this.intervalOscuridad = setInterval(() => {
            if (Math.random() < 0.10) {
                overlay.style.opacity = '0.7';
                videoElement.style.opacity = '1';
                videoElement.currentTime = 0;
                videoElement.play()
                    .catch(e => console.log('Error al reproducir el video:', e));
                
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    videoElement.style.opacity = '0';
                    videoElement.pause();
                }, 500);
            }
        }, 3000);

        setTimeout(() => {
            this.detenerEfectoOscuridad();
            videoElement.style.opacity = '0';
            videoElement.pause();
            const btnOscuridad = document.querySelector('button[onclick="bingoGame.toggleEfectoOscuridad()"]');
            if (btnOscuridad) {
                btnOscuridad.textContent = 'Efecto Oscuridad';
            }
            this.efectoOscuridadActivo = false;
        }, 11000);
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
        }, 1000);

        setTimeout(() => {
            this.detenerEfectoNumeros();
            const btnNumeros = document.querySelector('button[onclick="bingoGame.toggleEfectoNumeros()"]');
            if (btnNumeros) {
                btnNumeros.textContent = 'Efecto Números';
            }
            this.efectoNumerosActivo = false;
        }, 10000);
    }

    iniciarEfectoEligeNumero() {
        const numerosDisponibles = Array.from({ length: 60 }, (_, i) => i + 1).filter(
            numero => !bingoGame.numerosSacados.includes(numero)
        );

        const contenedor = document.getElementById('numerosDisponibles');
        contenedor.innerHTML = '';

        numerosDisponibles.forEach(numero => {
            const botonNumero = document.createElement('button');
            botonNumero.textContent = numero;
            botonNumero.onclick = () => this.seleccionarNumero(numero);
            contenedor.appendChild(botonNumero);
        });

        document.getElementById('modalEligeNumero').style.display = 'block';
    }

    seleccionarNumero(numero) {
        if (!bingoGame.numerosSacados.includes(numero)) {
            bingoGame.numerosSacados.push(numero);
            bingoGame.mostrarNumerosSacados();
            bingoGame.verificarNumeroEnCarton(numero);
            bingoGame.actualizarNumerosEnPanel();
        }
        this.cerrarModal();
    }

    cerrarModal() {
        document.getElementById('modalEligeNumero').style.display = 'none';
    }

    detenerEfectoOscuridad() {
        // Limpiar el intervalo
        if (this.intervalOscuridad) {
            clearInterval(this.intervalOscuridad);
            this.intervalOscuridad = null;
        }
        
        // Limpiar el overlay de manera inmediata
        const overlay = document.getElementById('zombie-overlay');
        if (overlay) {
            document.body.removeChild(overlay);
        }

        // Limpiar el video de manera inmediata
        const videoElement = document.getElementById('zombie-video');
        if (videoElement) {
            videoElement.pause();
            videoElement.srcObject = null;
            document.body.removeChild(videoElement);
        }

        // Asegurarnos de que se pueda interactuar con la página
        document.body.style.pointerEvents = 'auto';
        this.efectoOscuridadActivo = false;
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
}

export default Efectos;  // Exportación por defecto
