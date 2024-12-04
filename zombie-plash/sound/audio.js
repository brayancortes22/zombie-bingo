class AudioManager {
    constructor() {
        console.log('AudioManager initialized');
        this.audio = new Audio();
        this.audio.loop = true;
        
        this.tracks = {
            menu: '/zombie-bingo/zombie-plash/sound/sonido_juego.mp3',
            game: '/zombie-bingo/zombie-plash/sound/sonido_juego.mp3'
        };

        this.isMuted = localStorage.getItem('audioMuted') === 'true';
        this.previousVolume = parseFloat(localStorage.getItem('audioVolume')) || 0.5;
        this.audio.volume = this.isMuted ? 0 : this.previousVolume;
        this.isToggling = false;

        this.playBackgroundMusic();
    }

    async playBackgroundMusic() {
        try {
            this.audio.src = this.tracks.menu;
            await this.audio.play();
            if (this.isMuted) {
                this.audio.volume = 0;
            }
        } catch (error) {
            console.log('Error al reproducir música:', error);
        }
    }

    async mute() {
        if (this.isToggling) return;
        this.isToggling = true;
        
        this.previousVolume = this.audio.volume;
        this.audio.volume = 0;
        this.isMuted = true;
        
        localStorage.setItem('audioMuted', 'true');
        localStorage.setItem('audioVolume', this.previousVolume.toString());
        
        setTimeout(() => {
            this.isToggling = false;
        }, 200);
    }

    async unmute() {
        if (this.isToggling) return;
        this.isToggling = true;
        
        this.audio.volume = this.previousVolume;
        this.isMuted = false;
        
        localStorage.setItem('audioMuted', 'false');
        localStorage.setItem('audioVolume', this.previousVolume.toString());
        
        setTimeout(() => {
            this.isToggling = false;
        }, 200);
    }
}

if (typeof window.audioManager === 'undefined') {
    window.audioManager = new AudioManager();
} 