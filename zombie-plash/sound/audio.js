// Primero definimos una variable global para el audio
const globalAudio = new Audio();
globalAudio.loop = true;
globalAudio.src = '/zombie-bingo/zombie-plash/sound/sonido_juego3.mp3';

class AudioManager {
    constructor() {
        if (window.audioManagerInstance) {
            return window.audioManagerInstance;
        }

        console.log('Creando nueva instancia de AudioManager');
        
        this.audio = globalAudio;
        this.isMuted = localStorage.getItem('audioMuted') === 'true';
        this.previousVolume = parseFloat(localStorage.getItem('audioVolume')) || 0.5;
        this.audio.volume = this.isMuted ? 0 : this.previousVolume;

        // Restaurar la posición del audio si existe
        const savedTime = sessionStorage.getItem('audioCurrentTime');
        if (savedTime) {
            this.audio.currentTime = parseFloat(savedTime);
        }

        // Guardar la instancia en el objeto window
        window.audioManagerInstance = this;
        
        // Guardar la posición del audio periódicamente
        setInterval(() => {
            if (!this.audio.paused) {
                sessionStorage.setItem('audioCurrentTime', this.audio.currentTime.toString());
            }
        }, 1000);

        // Guardar posición antes de cambiar de página
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('audioCurrentTime', this.audio.currentTime.toString());
        });

        // Iniciar la reproducción si es necesario
        if (this.audio.paused) {
            this.playBackgroundMusic();
        }
    }

    async playBackgroundMusic() {
        try {
            if (this.audio.paused) {
                await this.audio.play();
                console.log('Música de fondo iniciada');
            }
            
            if (this.isMuted) {
                this.audio.volume = 0;
            }
        } catch (error) {
            console.log('Error al reproducir música:', error);
        }
    }

    mute() {
        this.previousVolume = this.audio.volume;
        this.audio.volume = 0;
        this.isMuted = true;
        localStorage.setItem('audioMuted', 'true');
        localStorage.setItem('audioVolume', this.previousVolume.toString());
    }

    unmute() {
        this.audio.volume = this.previousVolume;
        this.isMuted = false;
        localStorage.setItem('audioMuted', 'false');
        localStorage.setItem('audioVolume', this.previousVolume.toString());
    }
}

// Crear y asignar la instancia inmediatamente
window.audioManager = new AudioManager();

// Asegurarnos de que el audioManager esté disponible globalmente
document.addEventListener('DOMContentLoaded', () => {
    if (!window.audioManager) {
        window.audioManager = new AudioManager();
    }
});

// Exportar para uso en módulos si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
} 