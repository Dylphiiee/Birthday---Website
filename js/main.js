/* =============================================
   MAIN APPLICATION - File 12 dari 12 file
   Menggabungkan semua komponen dan logika utama
   ============================================= */

class BirthdayApp {
    constructor() {
        self.currentPage = 'loadingPage';
        self.userName = getUserName();
        self.pages = document.querySelectorAll('.page');
        self.pageFrames = document.querySelectorAll('.page-frame');
        
        self.init();
    }
    
    init() {
        // Setup event listeners
        self.setupEventListeners();
        
        // Setup keyboard shortcuts
        self.setupKeyboardShortcuts();
        
        // Setup fullscreen button
        self.setupFullscreen();
        
        // Setup settings
        self.setupSettings();
        
        // Setup replay button
        self.setupReplayButton();
        
        // Setup share button
        self.setupShareButton();
        
        // Setup new chat button (dari home page)
        self.setupStartButton();
        
        console.log('🎂 Birthday App initialized for:', self.userName);
    }
    
    setupEventListeners() {
        // Listen for messages from iframes
        window.addEventListener('message', (e) => {
            self.handleIframeMessage(e.data);
        });
        
        // Page change events
        document.addEventListener('pageChanged', (e) => {
            self.onPageChange(e.detail.page);
        });
        
        // Navigation events
        document.addEventListener('goToClosing', () => {
            self.switchPage('closingPage');
        });
        
        document.addEventListener('goToPresent', () => {
            self.switchPage('presentPage');
        });
        
        document.addEventListener('goToHome', () => {
            self.switchPage('homePage');
        });
        
        // Song events
        document.addEventListener('songStarted', (e) => {
            console.log(`🎵 Song ${e.detail.song} started`);
            self.updateProgress(e.detail.song);
        });
        
        document.addEventListener('songEnded', (e) => {
            console.log(`🎵 Song ${e.detail.song} ended`);
        });
        
        // Scene events
        document.addEventListener('candlesLit', () => {
            self.updateProgress(1);
        });
        
        document.addEventListener('giftOpened', () => {
            self.updateProgress(2);
        });
        
        document.addEventListener('bookOpened', () => {
            self.updateProgress(3);
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape to close modals
            if (e.key === 'Escape') {
                self.closeAllModals();
            }
            
            // Space to play/pause music
            if (e.key === ' ' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                if (window.audioManager) {
                    if (window.audioManager.isPlaying) {
                        window.audioManager.stopAll();
                    } else {
                        // Play appropriate song based on current scene
                        self.playCurrentSceneSong();
                    }
                }
            }
            
            // Arrow keys for navigation
            if (e.key === 'ArrowRight' && self.currentPage === 'presentPage') {
                self.nextScene();
            }
            
            if (e.key === 'ArrowLeft' && self.currentPage === 'presentPage') {
                self.prevScene();
            }
        });
    }
    
    setupFullscreen() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                    }
                }
            });
        }
    }
    
    setupSettings() {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettings = document.getElementById('closeSettings');
        
        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', () => {
                settingsModal.classList.add('active');
            });
            
            closeSettings.addEventListener('click', () => {
                settingsModal.classList.remove('active');
            });
            
            // Save settings
            const nameInput = document.getElementById('nameInput');
            const speedSelect = document.getElementById('speedSelect');
            const sfxToggle = document.getElementById('sfxToggle');
            
            nameInput.value = self.userName;
            
            nameInput.addEventListener('change', (e) => {
                self.userName = e.target.value;
                localStorage.setItem('birthdayName', self.userName);
                self.updateNames();
            });
            
            speedSelect.addEventListener('change', (e) => {
                const speed = parseFloat(e.target.value);
                document.documentElement.style.setProperty('--animation-speed', speed);
            });
            
            sfxToggle.addEventListener('change', (e) => {
                if (window.audioManager) {
                    window.audioManager.setSFXVolume(e.target.checked ? 0.5 : 0);
                }
            });
        }
    }
    
    setupReplayButton() {
        const replayBtn = document.getElementById('replayBtn');
        if (replayBtn) {
            replayBtn.addEventListener('click', () => {
                // Reset semua state
                self.resetAll();
                
                // Kembali ke home
                self.switchPage('homePage');
                
                // Reset typewriter
                const typewriter = document.getElementById('typewriterText');
                if (typewriter) {
                    typewriter.textContent = '';
                    self.startTypewriter();
                }
            });
        }
    }
    
    setupShareButton() {
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: 'Selamat Ulang Tahun!',
                        text: `Website ulang tahun spesial untuk ${self.userName}`,
                        url: window.location.href
                    }).catch(() => {
                        // Fallback copy link
                        self.copyToClipboard();
                    });
                } else {
                    self.copyToClipboard();
                }
            });
        }
    }
    
    setupStartButton() {
        const startBtn = document.getElementById('startBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                self.switchPage('presentPage');
                
                // Trigger event untuk memulai scene
                setTimeout(() => {
                    // Cake akan otomatis tampil
                }, 1000);
            });
        }
    }
    
    handleIframeMessage(message) {
        if (message === 'loadingComplete') {
            setTimeout(() => {
                self.switchPage('homePage');
                self.startTypewriter();
            }, 500);
        }
    }
    
    switchPage(pageId) {
        // Hide all pages
        self.pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            self.currentPage = pageId;
            
            // Trigger page change event
            const event = new CustomEvent('pageChanged', { 
                detail: { page: pageId } 
            });
            document.dispatchEvent(event);
            
            // Update progress based on page
            self.updateProgressForPage(pageId);
            
            console.log(`📄 Switched to page: ${pageId}`);
        }
    }
    
    startTypewriter() {
        const element = document.getElementById('typewriterText');
        if (!element) return;
        
        const text = self.userName;
        let index = 0;
        
        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 150);
            }
        }
        
        type();
    }
    
    updateNames() {
        // Update semua elemen yang menampilkan nama
        const nameElements = document.querySelectorAll('[data-name]');
        nameElements.forEach(el => {
            el.textContent = self.userName;
        });
        
        // Update letter name di closing page
        const letterName = document.getElementById('letterName');
        if (letterName) {
            letterName.textContent = self.userName;
        }
    }
    
    updateProgressForPage(pageId) {
        const progressFill = document.getElementById('progressFill');
        if (!progressFill) return;
        
        switch(pageId) {
            case 'homePage':
                progressFill.style.width = '0%';
                break;
            case 'presentPage':
                progressFill.style.width = '25%';
                break;
            case 'closingPage':
                progressFill.style.width = '100%';
                break;
        }
    }
    
    updateProgress(step) {
        const progressFill = document.getElementById('progressFill');
        if (!progressFill) return;
        
        const widths = {
            1: '25%',  // Cake
            2: '50%',  // Gift
            3: '75%',  // Book
            4: '100%'  // Letter
        };
        
        if (widths[step]) {
            progressFill.style.width = widths[step];
        }
    }
    
    nextScene() {
        // Logic untuk next scene di present page
        const currentStep = self.getCurrentStep();
        if (currentStep < 4) {
            self.updateProgress(currentStep + 1);
        }
    }
    
    prevScene() {
        const currentStep = self.getCurrentStep();
        if (currentStep > 1) {
            self.updateProgress(currentStep - 1);
        }
    }
    
    getCurrentStep() {
        const progressFill = document.getElementById('progressFill');
        if (!progressFill) return 1;
        
        const width = progressFill.style.width;
        if (width === '25%') return 1;
        if (width === '50%') return 2;
        if (width === '75%') return 3;
        if (width === '100%') return 4;
        return 1;
    }
    
    playCurrentSceneSong() {
        if (self.currentPage === 'presentPage') {
            const step = self.getCurrentStep();
            if (step === 1 && window.audioManager) {
                window.audioManager.playSong(1);
            } else if (step === 3 && window.audioManager) {
                window.audioManager.playSong(2);
            }
        }
    }
    
    resetAll() {
        // Reset semua state
        self.updateProgress(0);
        
        // Reset audio
        if (window.audioManager) {
            window.audioManager.stopAll();
        }
        
        // Reset 3D objects
        if (window.cake3D) {
            window.cake3D.dispose();
            window.cake3D = null;
        }
        
        if (window.gift3D) {
            window.gift3D.dispose();
            window.gift3D = null;
        }
        
        if (window.book3D) {
            window.book3D.dispose();
            window.book3D = null;
        }
        
        // Reset confetti
        if (window.confettiSystem) {
            window.confettiSystem.stop();
        }
        
        // Reset petal
        if (window.petalSystem) {
            // Recreate petals
        }
        
        console.log('🔄 All systems reset');
    }
    
    closeAllModals() {
        const modals = document.querySelectorAll('.modal, .modal-overlay');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    copyToClipboard() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Link berhasil disalin!');
        }).catch(() => {
            alert('Gagal menyalin link');
        });
    }
    
    // Utility untuk mendapatkan parameter URL
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    
    // Utility untuk menyimpan state ke localStorage
    saveState() {
        const state = {
            userName: self.userName,
            currentPage: self.currentPage,
            progress: self.getCurrentStep()
        };
        localStorage.setItem('birthdayState', JSON.stringify(state));
    }
    
    // Utility untuk load state dari localStorage
    loadState() {
        const saved = localStorage.getItem('birthdayState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                self.userName = state.userName || self.userName;
                self.updateNames();
                
                if (state.currentPage) {
                    self.switchPage(state.currentPage);
                }
                
                if (state.progress) {
                    self.updateProgress(state.progress);
                }
            } catch (e) {
                console.error('Error loading state:', e);
            }
        }
    }
    
    // Cleanup saat unload
    cleanup() {
        self.saveState();
        
        if (window.audioManager) {
            window.audioManager.stopAll();
        }
    }
}

// Helper function untuk ambil nama dari URL/localStorage
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
    return CONFIG?.defaults?.name || 'Sayang';
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create floating particles
    for (let i = 0; i < 50; i++) {
        createFloatingParticle();
    }
    
    // Initialize main app
    window.app = new BirthdayApp();
    
    // Preload audio
    if (window.audioManager) {
        // Audio sudah diinit di file sendiri
    }
    
    // Set animation speed dari CSS variable
    document.documentElement.style.setProperty('--animation-speed', '1');
    
    console.log('🎉 Birthday Website fully loaded!');
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.cleanup();
    }
});

// Handle visibility change (pause audio when tab not active)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (window.audioManager && window.audioManager.isPlaying) {
            window.audioManager.paused = true;
            // Optionally pause audio
        }
    } else {
        if (window.audioManager && window.audioManager.paused) {
            // Optionally resume
            window.audioManager.paused = false;
        }
    }
});

// Helper untuk membuat partikel floating
function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    
    const size = Math.random() * 10 + 5;
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.3 + 0.1;
    
    particle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, #ff69b4, #ff1493);
        border-radius: 50%;
        left: ${left}%;
        top: -50px;
        opacity: ${opacity};
        animation: floatParticle ${duration}s linear infinite;
        animation-delay: ${delay}s;
        pointer-events: none;
        z-index: -1;
    `;
    
    document.body.appendChild(particle);
}

// Add CSS for floating particles
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export untuk debugging
window.BirthdayApp = BirthdayApp;
