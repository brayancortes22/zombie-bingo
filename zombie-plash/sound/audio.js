class AudioManager {
    constructor() {
        console.log('AudioManager initialized');
        this.audio = new Audio();
        this.audio.loop = true;
        
        this.tracks = {
            menu: '/zombie-bingo/zombie-plash/sound/sonido_juego.mp3',
            game: '/zombie-bingo/zombie-plash/sound/sonido_juego.mp3'
        };

        this.isMuted = false;
        this.currentTrack = null;
        this.audio.volume = 0.5;
        
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API no soportada');
        }
    }

    async play(trackName) {
        if (!this.tracks[trackName]) return;

        try {
            if (this.audioContext) {
                await this.audioContext.resume();
            }
            
            this.audio.src = this.tracks[trackName];
            await this.audio.play();
            console.log('Audio reproduciendo exitosamente');
            
        } catch (error) {
            console.error('Error al reproducir audio:', error);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audio.volume = this.isMuted ? 0 : 0.5;
        return this.isMuted;
    }
}

const audioManager = new AudioManager(); 