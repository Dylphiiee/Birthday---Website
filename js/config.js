/* =============================================
   KONFIGURASI WEBSITE ULANG TAHUN
   File 5 dari 12 file
   ============================================= */

// Konfigurasi Utama Website
const CONFIG = {
    // Informasi Website
    site: {
        name: 'Birthday Website',
        version: '2.0.0',
        author: 'Birthday Creator',
        year: new Date().getFullYear()
    },

    // Default Settings
    defaults: {
        name: 'Sayang',
        language: 'id',
        theme: 'dark-pink',
        animationSpeed: 1,
        soundEnabled: true,
        musicVolume: 0.7,
        sfxVolume: 0.5
    },

    // Nama untuk ditampilkan (bisa diganti)
    names: {
        primary: 'Sayang',
        secondary: 'Cantik',
        alternative: 'Bebeb'
    },

    // Konfigurasi Animasi
    animations: {
        enabled: true,
        speed: 1, // 0.5 = lambat, 1 = normal, 1.5 = cepat
        reducedMotion: false,
        
        // Durasi animasi (dalam detik)
        durations: {
            fadeIn: 1,
            slideIn: 1.2,
            scaleIn: 0.8,
            rotateIn: 1.5,
            typewriter: 3,
            loading: 3,
            candleFlicker: 0.5,
            giftOpen: 2,
            bookOpen: 10, // Sesuai durasi lagu
            letterReveal: 2
        },

        // Delay antar animasi
        delays: {
            preloader: 0.5,
            title: 0.3,
            typewriter: 0.5,
            button: 0.8,
            scene1: 1,
            scene2: 2,
            scene3: 3
        }
    },

    // Konfigurasi Audio
    audio: {
        enabled: true,
        defaultVolume: 0.7,
        fadeTime: 2, // detik
        
        files: {
            song1: 'media/lagu1.mp3',
            song2: 'media/lagu2.mp3',
            click: 'media/sfx/click.mp3',
            pop: 'media/sfx/pop.mp3',
            flame: 'media/sfx/flame.mp3',
            gift: 'media/sfx/gift.mp3',
            page: 'media/sfx/page.mp3',
            letter: 'media/sfx/letter.mp3',
            confetti: 'media/sfx/confetti.mp3'
        },

        // Durasi lagu (dalam detik) - sesuaikan dengan file MP3 asli
        durations: {
            song1: 30, // Ganti dengan durasi lagu1.mp3
            song2: 45  // Ganti dengan durasi lagu2.mp3
        }
    },

    // Konfigurasi PDF
    pdf: {
        enabled: true,
        file: 'media/buku.pdf',
        
        settings: {
            scale: 1.5,
            autoRender: true,
            showControls: true,
            loopPages: false
        },

        // Jumlah halaman (akan dideteksi otomatis, tapi bisa diisi manual)
        pages: {
            total: 10, // Default jika tidak terdeteksi
            startPage: 1
        }
    },

    // Konfigurasi Scene / Adegan
    scenes: {
        cake: {
            enabled: true,
            autoLight: false,
            flameParticles: true,
            flameCount: 20,
            
            // Posisi lilin (koordinat relatif)
            candlePosition: {
                x: 0.5,  // tengah
                y: 0.3   // 30% dari atas
            }
        },

        gift: {
            enabled: true,
            autoOpen: false,
            ribbonColor: '#ffffff',
            giftColor: '#ff69b4',
            
            // Animasi pita
            ribbonAnimation: {
                duration: 1,
                delay: 0.3
            }
        },

        book: {
            enabled: true,
            autoOpen: true,
            pageFlipDuration: 0.5, // detik per halaman
            
            // Ukuran buku (proporsional)
            size: {
                width: 400,
                height: 300,
                thickness: 50
            }
        }
    },

    // Konfigurasi Efek Visual
    effects: {
        particles: {
            enabled: true,
            count: 100,
            speed: 1,
            
            colors: ['#ff1493', '#ff69b4', '#ffb6c1', '#ffffff']
        },

        confetti: {
            enabled: true,
            count: 200,
            spread: 70,
            
            colors: ['#ff1493', '#ff69b4', '#ffb6c1', '#ffd700', '#ffffff']
        },

        petals: {
            enabled: true,
            count: 30,
            speed: 10,
            
            colors: ['#ffb6c1', '#ff69b4']
        },

        glow: {
            enabled: true,
            intensity: 0.5,
            colors: ['#ff1493', '#ff69b4']
        }
    },

    // Konfigurasi Teks Ucapan
    messages: {
        loading: 'Sesuatu Untukmu',
        title: 'Selamat Ulang Tahun',
        
        // Ucapan di surat (array untuk random)
        wishes: [
            'Semoga panjang umur, sehat selalu, dan bahagia setiap hari.',
            'Terima kasih telah menjadi bagian indah dalam hidup ini.',
            'Semoga semua impian dan harapanmu menjadi kenyataan.',
            'Selalu bersinar dan tetap menjadi dirimu yang terbaik.',
            'Dikelilingi oleh orang-orang yang menyayangimu.',
            'Sukses selalu dalam setiap langkah yang kau ambil.',
            'Semoga tahun ini membawa kebahagiaan yang tak terhingga.',
            'Doa terbaik selalu menyertaimu di mana pun berada.',
            'Semoga selalu diberikan kesehatan dan kebahagiaan.',
            'Teruslah bermimpi dan gapai semua cita-citamu.',
            'Kamu adalah hadiah terindah dalam hidup ini.',
            'Semoga hari-harimu selalu dipenuhi senyuman.',
            'Jadilah dirimu sendiri, karena itu sudah cukup sempurna.',
            'Semoga selalu dikelilingi cinta dan kebaikan.',
            'Setiap hari adalah kesempatan baru untuk bersinar.'
        ],

        // Tanda tangan
        signature: 'Dari semua yang menyayangimu'
    },

    // Konfigurasi Tampilan
    ui: {
        theme: 'dark-pink',
        fontSize: {
            base: 16,
            title: 64,
            subtitle: 32,
            body: 16
        },
        
        colors: {
            primary: '#ff1493',
            secondary: '#ff69b4',
            accent: '#ffb6c1',
            background: '#1a0b1a',
            text: '#ffffff'
        },

        // Border radius
        borderRadius: {
            small: 5,
            medium: 10,
            large: 20,
            circle: 50
        }
    },

    // Konfigurasi Timer & Waktu
    timing: {
        // Waktu tunggu antar scene (detik)
        waitTimes: {
            afterCandle: 2,
            afterGift: 1,
            afterBook: 1,
            afterLetter: 0.5
        },

        // Batas waktu (detik)
        timeouts: {
            loading: 10,
            apiCall: 5,
            animation: 30
        }
    },

    // Konfigurasi API (jika perlu)
    api: {
        enabled: false,
        baseUrl: '',
        endpoints: {},
        timeout: 5000
    },

    // Konfigurasi Debug
    debug: {
        enabled: false, // Ubah ke true untuk mode development
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        showFPS: false,
        showPerformance: false
    },

    // Konfigurasi Keyboard Shortcuts
    shortcuts: {
        enabled: true,
        
        keys: {
            next: ['ArrowRight', 'Space'],
            prev: ['ArrowLeft'],
            close: ['Escape'],
            mute: ['M', 'm'],
            fullscreen: ['F', 'f']
        }
    },

    // Konfigurasi Touch / Mobile
    touch: {
        enabled: true,
        swipeThreshold: 50,
        doubleTapDelay: 300
    },

    // Konfigurasi Cache
    cache: {
        enabled: true,
        duration: 3600, // detik (1 jam)
        
        assets: [
            'media/lagu1.mp3',
            'media/lagu2.mp3',
            'media/buku.pdf'
        ]
    },

    // Konfigurasi Social Media Share
    share: {
        enabled: true,
        
        platforms: ['whatsapp', 'facebook', 'twitter', 'telegram'],
        
        message: 'Lihat website ulang tahun spesial ini! 🎂'
    },

    // Konfigurasi Language / Bahasa
    language: {
        default: 'id',
        available: ['id', 'en'],
        
        translations: {
            id: {
                loading: 'Sesuatu Untukmu',
                title: 'Selamat Ulang Tahun',
                start: 'Mulai',
                clickCake: 'klik kuenya',
                clickGift: 'klik hadiahnya',
                clickBook: 'klik bukunya',
                openLetter: 'buka suratnya'
            },
            en: {
                loading: 'Something For You',
                title: 'Happy Birthday',
                start: 'Start',
                clickCake: 'click the cake',
                clickGift: 'click the gift',
                clickBook: 'click the book',
                openLetter: 'open the letter'
            }
        }
    }
};

// ===== FUNGSI UTILITY =====

/**
 * Mendapatkan nama dari URL parameter atau localStorage
 * @returns {string} Nama pengguna
 */
function getUserName() {
    // Cek URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const nameParam = urlParams.get('name');
    
    if (nameParam) {
        localStorage.setItem('birthdayName', nameParam);
        return nameParam;
    }
    
    // Cek localStorage
    const savedName = localStorage.getItem('birthdayName');
    if (savedName) {
        return savedName;
    }
    
    // Default dari config
    return CONFIG.defaults.name;
}

/**
 * Mendapatkan durasi lagu yang benar
 * @param {number} songNumber - 1 atau 2
 * @returns {number} Durasi dalam detik
 */
function getSongDuration(songNumber) {
    if (songNumber === 1) {
        return CONFIG.audio.durations.song1;
    } else if (songNumber === 2) {
        return CONFIG.audio.durations.song2;
    }
    return 30; // default
}

/**
 * Mendapatkan ucapan random atau semua ucapan
 * @param {boolean} random - True untuk random, false untuk semua
 * @returns {string|Array} Ucapan
 */
function getWishes(random = true) {
    const wishes = CONFIG.messages.wishes;
    
    if (random) {
        const randomIndex = Math.floor(Math.random() * wishes.length);
        return wishes[randomIndex];
    }
    
    return wishes;
}

/**
 * Mendapatkan warna random dari array
 * @param {Array} colors - Array warna
 * @returns {string} Warna random
 */
function getRandomColor(colors = CONFIG.effects.particles.colors) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

/**
 * Cek apakah mode development aktif
 * @returns {boolean}
 */
function isDevMode() {
    return CONFIG.debug.enabled;
}

/**
 * Cek apakah reduced motion diaktifkan user
 * @returns {boolean}
 */
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ===== EXPORT =====
// Untuk digunakan di file JS lainnya
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        getUserName,
        getSongDuration,
        getWishes,
        getRandomColor,
        isDevMode,
        prefersReducedMotion
    };
}
