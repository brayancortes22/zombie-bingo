class Efectos {
    constructor(bingoGame) {
        this.bingoGame = bingoGame;
        this.efectoOscuridadActivo = false;
        this.efectoNumerosActivo = false;
        this.efectoEligeNumeroActivo = false;
        this.duracionEfecto = 10000; // 10 segundos
        this.cooldownPoder = 120000; // 2 minutos
        this.cooldownEfectoRecibido = 5000; // 5 segundos
        this.poderEnUso = false;
    }

    async verificarPuedeUsarPoder() {
        try {
            const response = await fetch('../php/juego/verificarPoder.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.bingoGame.idSala,
                    id_jugador: this.bingoGame.idJugador
                })
            });

            const data = await response.json();
            return data.puede_usar;
        } catch (error) {
            console.error('Error al verificar poder:', error);
            return false;
        }
    }

    async aplicarEfectoAJugadores(tipoEfecto) {
        if (this.poderEnUso) {
            alert('Ya hay un poder en uso');
            return false;
        }

        const puedeUsar = await this.verificarPuedeUsarPoder();
        if (!puedeUsar) {
            alert('Debes esperar para usar otro poder');
            return false;
        }

        try {
            const response = await fetch('../php/juego/aplicarEfecto.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.bingoGame.idSala,
                    jugador_origen: this.bingoGame.idJugador,
                    tipo_efecto: tipoEfecto
                })
            });

            const data = await response.json();
            if (data.success) {
                this.poderEnUso = true;
                this.deshabilitarTodosPoderes();
                
                // Restablecer después del cooldown
                setTimeout(() => {
                    this.poderEnUso = false;
                    this.habilitarTodosPoderes();
                }, this.cooldownPoder);
                
                return true;
            } else {
                alert(data.error || 'Error al aplicar el efecto');
                return false;
            }
        } catch (error) {
            console.error('Error al aplicar efecto:', error);
            return false;
        }
    }

    deshabilitarTodosPoderes() {
        const botones = document.querySelectorAll('.bu[onclick*="toggleEfecto"]');
        botones.forEach(boton => {
            boton.disabled = true;
        });
    }

    habilitarTodosPoderes() {
        const botones = document.querySelectorAll('.bu[onclick*="toggleEfecto"]');
        botones.forEach(boton => {
            boton.disabled = false;
        });
    }

    async toggleEfectoOscuridad() {
        if (!this.efectoOscuridadActivo) {
            const aplicado = await this.aplicarEfectoAJugadores('oscuridad');
            if (aplicado) {
                this.efectoOscuridadActivo = true;
                this.iniciarEfectoOscuridad();
            }
        }
    }

    async toggleEfectoNumeros() {
        if (!this.efectoNumerosActivo) {
            const aplicado = await this.aplicarEfectoAJugadores('numeros');
            if (aplicado) {
                this.efectoNumerosActivo = true;
                this.iniciarEfectoNumeros();
            }
        }
    }

    async toggleEfectoEligeNumero() {
        if (!this.efectoEligeNumeroActivo) {
            const aplicado = await this.aplicarEfectoAJugadores('elige_numero');
            if (aplicado) {
                this.efectoEligeNumeroActivo = true;
                this.iniciarEfectoEligeNumero();
            }
        }
    }

    iniciarEfectoOscuridad() {
        if (this.efectoOscuridadActivo) return;
        
        // Crear overlay oscuro
        const overlay = document.createElement('div');
        overlay.id = 'zombie-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            pointer-events: none;
        `;

        // Agregar video de zombie
        const video = document.createElement('video');
        video.id = 'zombie-video';
        video.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1001;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.5;
        `;
        video.src = '../assets/videos/zombie_effect.mp4';
        video.autoplay = true;
        video.loop = true;
        video.muted = true;

        document.body.appendChild(overlay);
        document.body.appendChild(video);

        this.efectoOscuridadActivo = true;

        // Reproducir sonido de zombie
        const audio = new Audio('../assets/sounds/zombie.mp3');
        audio.play();

        setTimeout(() => {
            overlay.remove();
            video.remove();
            this.efectoOscuridadActivo = false;
        }, this.duracionEfecto);
    }

    iniciarEfectoNumeros() {
        if (this.efectoNumerosActivo) return;

        const numeros = document.querySelectorAll('.columna1');
        numeros.forEach(numero => {
            numero.style.transform = 'rotate(180deg)';
            numero.style.transition = 'transform 0.5s';
        });

        this.efectoNumerosActivo = true;

        setTimeout(() => {
            numeros.forEach(numero => {
                numero.style.transform = 'rotate(0deg)';
            });
            this.efectoNumerosActivo = false;
        }, this.duracionEfecto);
    }

    iniciarEfectoEligeNumero() {
        if (this.efectoEligeNumeroActivo) return;

        const modal = document.getElementById('modalEligeNumero');
        const numerosDisponibles = document.getElementById('numerosDisponibles');
        
        // Limpiar números anteriores
        numerosDisponibles.innerHTML = '';

        // Obtener números disponibles (no sacados)
        const numerosSacados = this.bingoGame.numerosSacados.map(b => b.numero);
        const todosNumeros = Array.from({length: 75}, (_, i) => i + 1);
        const disponibles = todosNumeros.filter(n => !numerosSacados.includes(n));

        // Crear botones para cada número disponible
        disponibles.forEach(numero => {
            const boton = document.createElement('button');
            boton.textContent = numero;
            boton.onclick = () => this.seleccionarNumero(numero);
            numerosDisponibles.appendChild(boton);
        });

        modal.style.display = 'block';
        this.efectoEligeNumeroActivo = true;

        setTimeout(() => {
            modal.style.display = 'none';
            this.efectoEligeNumeroActivo = false;
        }, this.duracionEfecto);
    }

    async seleccionarNumero(numero) {
        try {
            const response = await fetch('../php/juego/seleccionarNumero.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_sala: this.bingoGame.idSala,
                    numero: numero
                })
            });

            const data = await response.json();
            if (data.success) {
                document.getElementById('modalEligeNumero').style.display = 'none';
                // Actualizar el juego con el nuevo número
                this.bingoGame.actualizarNumeroSeleccionado(data);
            }
        } catch (error) {
            console.error('Error al seleccionar número:', error);
        }
    }

    cerrarModal() {
        const modal = document.getElementById('modalEligeNumero');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

export default Efectos;
