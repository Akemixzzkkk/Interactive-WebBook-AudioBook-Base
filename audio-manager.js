/**
 * Gerenciador de Áudio Persistente
 * Controla a música de fundo entre as páginas usando localStorage para o estado de mudo e tempo.
 */

class AudioManager {
    constructor() {
        this.audio = null;
        this.muteBtn = null;
        this.volume = 0.02; // 2% de volume conforme solicitado
        this.audioSrc = 'others/music.mp3';

        // Recuperar estado inicial
        this.isMuted = localStorage.getItem('audioMuted') === 'true';
        this.savedTime = localStorage.getItem('audioTime');

        this.init();
    }

    init() {
        // Criar elemento de áudio se não existir
        if (!this.audio) {
            this.audio = document.createElement('audio');
            this.audio.id = 'persistent-bg-music';
            this.audio.src = this.audioSrc;
            this.audio.loop = true;
            this.audio.volume = this.volume;
            this.audio.muted = this.isMuted;

            // Configurar início aleatório ou persistente
            this.audio.addEventListener('loadedmetadata', () => {
                if (this.savedTime) {
                    this.audio.currentTime = parseFloat(this.savedTime);
                } else {
                    // Início aleatório se for a primeira vez
                    const randomTime = Math.random() * this.audio.duration;
                    this.audio.currentTime = randomTime;
                }
            });

            // Salvar tempo periodicamente
            this.audio.addEventListener('timeupdate', () => {
                if (!this.audio.paused) {
                    localStorage.setItem('audioTime', this.audio.currentTime);
                }
            });

            document.body.appendChild(this.audio);
        }

        this.createMuteButton();
        this.handleAutoPlay();
    }

    createMuteButton() {
        // Estilos do botão de mudo no canto superior direito
        const style = document.createElement('style');
        style.textContent = `
            #audio-mute-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                padding: 8px;
                cursor: pointer;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                backdrop-filter: blur(5px);
                opacity: 0.6;
            }
            #audio-mute-btn:hover {
                opacity: 1;
                background: rgba(255, 255, 255, 0.1);
                transform: scale(1.1);
            }
            #audio-mute-btn svg {
                width: 20px;
                height: 20px;
                fill: currentColor;
            }
        `;
        document.head.appendChild(style);

        this.muteBtn = document.createElement('button');
        this.muteBtn.id = 'audio-mute-btn';
        this.muteBtn.title = 'Alternar Som';
        this.updateButtonIcon();

        this.muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMute();
        });

        document.body.appendChild(this.muteBtn);
    }

    updateButtonIcon() {
        const volumeOnIcon = `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
        const volumeOffIcon = `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;

        this.muteBtn.innerHTML = this.audio.muted ? volumeOffIcon : volumeOnIcon;
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        localStorage.setItem('audioMuted', this.isMuted);
        this.updateButtonIcon();
    }

    startAudio() {
        this.audio.play().catch(err => console.log("Audio play blocked:", err));
    }

    playHoverSound() {
        if (this.isMuted) return;

        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + 0.1);
    }

    handleAutoPlay() {
        // Tentar tocar automaticamente se já tiver permissão
        this.startAudio();

        // Em algumas páginas, pode precisar de um clique extra se o browser bloquear
        window.addEventListener('click', () => {
            if (this.audio.paused) {
                this.startAudio();
            }
        }, { once: true });
    }
}

// Inicializar o gerenciador globalmente
window.persistentAudio = new AudioManager();
