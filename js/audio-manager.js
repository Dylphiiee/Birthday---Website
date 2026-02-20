/* =============================================
   AUDIO MANAGER - File 11 dari 12 file
   Mengelola semua audio dan efek suara dengan Howler.js
   ============================================= */

class AudioManager {
    constructor() {
        this.sounds = {};
        this.currentSong = null;
        this.isMuted = false;
        self.volume = CONFIG.audio.defaultVolume || 0.7;
        self.sfxVolume = CONFIG.audio.sfxVolume || 0.5;
        self.isPlaying = false;
        self.visualizerBars = [];
        
        self.init();
    }
    
    init() {
        // Inisialisasi semua suara
        self.loadSounds();
        
        // Setup visualizer
        self.setupVisualizer();
        
        // Setup event listeners
        self.setupEventListeners();
        
        console.log('✅ Audio Manager initialized');
    }
    
    loadSounds() {
        // Load lagu utama
        self.sounds.song1 = new Howl({
            src: [CONFIG.audio.files.song1],
            volume: self.volume,
            html5: true,
            onplay: () => self.onSongPlay(1),
            onend: () => self.onSongEnd(1),
            onload: () => console.log('✅ Song 1 loaded'),
            onloaderror: (id, error) => console.error('❌ Error loading song 1:', error)
        });
        
        self.sounds.song2 = new Howl({
            src: [CONFIG.audio.files.song2],
            volume: self.volume,
            html5: true,
            onplay: () => self.onSongPlay(2),
            onend: () => self.onSongEnd(2),
            onload: () => console.log('✅ Song 2 loaded'),
            onloaderror: (id, error) => console.error('❌ Error loading song 2:', error)
        });
        
        // Load efek suara (jika ada)
        self.loadSFX();
    }
    
    loadSFX() {
        const sfxFiles = {
            click: 'media/sfx/click.mp3',
            pop: 'media/sfx/pop.mp3',
            flame: 'media/sfx/flame.mp3',
            gift: 'media/sfx/gift.mp3',
            page: 'media/sfx/page.mp3',
            letter: 'media/sfx/letter.mp3',
            confetti: 'media/sfx/confetti.mp3'
        };
        
        Object.entries(sfxFiles).forEach(([key, path]) => {
            self.sounds[key] = new Howl({
                src: [path],
                volume: self.sfxVolume,
                html5: true,
                onloaderror: () => console.log(`⚠️ SFX ${key} not found (optional)`)
            });
        });
    }
    
    setupVisualizer() {
        self.visualizerBars = document.querySelectorAll('.visualizer-bars .bar');
        
        // Jika tidak ada visualizer di DOM, buat sendiri
        if (self.visualizerBars.length === 0) {
            self.createVisualizer();
        }
    }
    
    createVisualizer() {
        const visualizer = document.createElement('div');
        visualizer.className = 'audio-visualizer';
        visualizer.innerHTML = `
            <div class="visualizer-bars">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
        `;
        document.body.appendChild(visualizer);
        
        self.visualizerBars = document.querySelectorAll('.visualizer-bars .bar');
    }
    
    setupEventListeners() {
        // Mute button
        const muteBtn = document.getElementById('muteBtn');
        if (muteBtn) {
            muteBtn.addEventListener('click', () => self.toggleMute());
        }
        
        // Event dari game
        document.addEventListener('candlesLit', () => {
            self.playSong(1);
        });
        
        document.addEventListener('giftOpened', () => {
            // Trigger untuk menampilkan buku
            setTimeout(() => {
                const event = new CustomEvent('showBook');
                document.dispatchEvent(event);
            }, 1000);
        });
        
        document.addEventListener('bookClicked', () => {
            self.playSong(2);
            
            // Sinkronisasi buku dengan lagu
            setTimeout(() => {
                const duration = self.getSongDuration(2);
                const event = new CustomEvent('syncBookWithSong', { 
                    detail: { duration: duration } 
                });
                document.dispatchEvent(event);
            }, 500);
        });
        
        document.addEventListener('goToClosing', () => {
            self.stopAll();
            if (window.confettiSystem) {
                window.confettiSystem.start();
            }
            
            // Pindah ke closing page
            if (window.app) {
                window.app.switchPage('closingPage');
            }
        });
    }
    
    playSong(songNumber) {
        const songKey = `song${songNumber}`;
        
        if (!self.sounds[songKey]) {
            console.error(`❌ Song ${songNumber} not found`);
            return;
        }
        
        // Stop current song
        if (self.currentSong) {
            self.stopCurrentSong();
        }
        
        // Play new song
        self.sounds[songKey].play();
        self.currentSong = songKey;
        self.isPlaying = true;
        
        // Start visualizer
        self.startVisualizer();
        
        console.log(`🎵 Playing song ${songNumber}`);
    }
    
    stopCurrentSong() {
        if (self.currentSong && self.sounds[self.currentSong]) {
            self.sounds[self.currentSong].stop();
            self.currentSong = null;
            self.isPlaying = false;
            self.stopVisualizer();
        }
    }
    
    stopAll() {
        Object.values(self.sounds).forEach(sound => {
            if (sound.playing()) {
                sound.stop();
            }
        });
        self.currentSong = null;
        self.isPlaying = false;
        self.stopVisualizer();
    }
    
    playSfx(sfxName) {
        if (self.sounds[sfxName] && !self.isMuted) {
            self.sounds[sfxName].play();
        }
    }
    
    toggleMute() {
        self.isMuted = !self.isMuted;
        
        // Update semua sound
        Object.values(self.sounds).forEach(sound => {
            sound.mute(self.isMuted);
        });
        
        // Update icon
        const muteBtn = document.getElementById('muteBtn');
        if (muteBtn) {
            muteBtn.innerHTML = self.isMuted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        }
    }
    
    setVolume(volume) {
        self.volume = Math.max(0, Math.min(1, volume));
        
        Object.values(self.sounds).forEach(sound => {
            sound.volume(self.volume);
        });
    }
    
    setSFXVolume(volume) {
        self.sfxVolume = Math.max(0, Math.min(1, volume));
        
        // Update volume untuk semua SFX
        const sfxList = ['click', 'pop', 'flame', 'gift', 'page', 'letter', 'confetti'];
        sfxList.forEach(key => {
            if (self.sounds[key]) {
                self.sounds[key].volume(self.sfxVolume);
            }
        });
    }
    
    getSongDuration(songNumber) {
        const songKey = `song${songNumber}`;
        if (self.sounds[songKey]) {
            return self.sounds[songKey].duration();
        }
        return CONFIG.audio.durations[`song${songNumber}`] || 30;
    }
    
    onSongPlay(songNumber) {
        console.log(`🎵 Song ${songNumber} started`);
        
        // Trigger event
        const event = new CustomEvent('songStarted', { 
            detail: { song: songNumber } 
        });
        document.dispatchEvent(event);
    }
    
    onSongEnd(songNumber) {
        console.log(`🎵 Song ${songNumber} ended`);
        
        // Trigger event
        const event = new CustomEvent('songEnded', { 
            detail: { song: songNumber } 
        });
        document.dispatchEvent(event);
        
        // Handle next action based on song
        if (songNumber === 1) {
            // Setelah lagu 1 selesai, tampilkan hadiah
            const giftEvent = new CustomEvent('showGift');
            document.dispatchEvent(giftEvent);
        } else if (songNumber === 2) {
            // Setelah lagu 2 selesai, buku akan otomatis ditutup
            // (di-handle di book-3d.js)
        }
    }
    
    startVisualizer() {
        if (self.visualizerBars.length === 0) return;
        
        // Animasi visualizer berdasarkan audio
        const animate = () => {
            if (!self.isPlaying) return;
            
            self.visualizerBars.forEach((bar, index) => {
                // Simulasi frekuensi audio
                const height = 5 + Math.random() * 25;
                bar.style.height = `${height}px`;
                
                // Warna berdasarkan intensitas
                const hue = 320 + (height * 2); // Pink range
                bar.style.backgroundColor = `hsl(${hue}, 100%, 65%)`;
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    stopVisualizer() {
        self.visualizerBars.forEach(bar => {
            bar.style.height = '5px';
            bar.style.backgroundColor = '#ff69b4';
        });
    }
    
    // Method untuk fade in/out
    fadeIn(songNumber, duration = 2000) {
        const songKey = `song${songNumber}`;
        if (!self.sounds[songKey]) return;
        
        self.sounds[songKey].play();
        self.sounds[songKey].fade(0, self.volume, duration);
    }
    
    fadeOut(songNumber, duration = 2000) {
        const songKey = `song${songNumber}`;
        if (!self.sounds[songKey]) return;
        
        self.sounds[songKey].fade(self.volume, 0, duration);
        setTimeout(() => {
            self.sounds[songKey].stop();
        }, duration);
    }
    
    // Method untuk crossfade antar lagu
    crossFade(fromSong, toSong, duration = 3000) {
        self.fadeOut(fromSong, duration);
        setTimeout(() => {
            self.fadeIn(toSong, duration);
        }, duration / 2);
    }
}

// Initialize saat DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    window.audioManager = new AudioManager();
});

// Export untuk digunakan di file lain
window.AudioManager = {
    playSong: (songNumber) => {
        if (window.audioManager) {
            window.audioManager.playSong(songNumber);
        }
    },
    
    stopAll: () => {
        if (window.audioManager) {
            window.audioManager.stopAll();
        }
    },
    
    playSfx: (sfxName) => {
        if (window.audioManager) {
            window.audioManager.playSfx(sfxName);
        }
    },
    
    toggleMute: () => {
        if (window.audioManager) {
            window.audioManager.toggleMute();
        }
    },
    
    setVolume: (volume) => {
        if (window.audioManager) {
            window.audioManager.setVolume(volume);
        }
    },
    
    getSongDuration: (songNumber) => {
        if (window.audioManager) {
            return window.audioManager.getSongDuration(songNumber);
        }
        return 30;
    }
};
