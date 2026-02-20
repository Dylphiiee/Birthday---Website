/* =============================================
   SISTEM PARTIKEL CANVAS - File 6 dari 12 file
   Background animations dengan partikel
   ============================================= */

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = CONFIG.effects.particles.count || 100;
        this.animationFrame = null;
        this.isRunning = false;
        
        // Warna partikel dari config
        this.colors = CONFIG.effects.particles.colors || ['#ff1493', '#ff69b4', '#ffb6c1'];
        
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.start();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.2,
                angle: Math.random() * Math.PI * 2,
                rotateSpeed: (Math.random() - 0.5) * 0.02
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
    }

    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Gerakan dasar
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Rotasi (untuk efek lebih hidup)
            p.angle += p.rotateSpeed;
            
            // Wrap around screen
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
            
            // Efek floating lembut
            p.x += Math.sin(Date.now() * 0.001 + i) * 0.1;
            p.y += Math.cos(Date.now() * 0.001 + i) * 0.1;
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const p of this.particles) {
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.angle);
            
            // Gambar partikel dengan efek glow
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 10;
            
            this.ctx.beginPath();
            
            // Variasi bentuk partikel
            if (p.size > 2.5) {
                // Bentuk bintang untuk partikel besar
                this.drawStar(this.ctx, 0, 0, 3, p.size, p.size/2);
            } else {
                // Lingkaran untuk partikel kecil
                this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            }
            
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }

    drawStar(ctx, cx, cy, spikes, outerR, innerR) {
        let rot = Math.PI / 2 * 3;
        const step = Math.PI / spikes;
        
        ctx.beginPath();
        for (let i = 0; i < spikes; i++) {
            const x1 = cx + Math.cos(rot) * outerR;
            const y1 = cy + Math.sin(rot) * outerR;
            ctx.lineTo(x1, y1);
            rot += step;
            
            const x2 = cx + Math.cos(rot) * innerR;
            const y2 = cy + Math.sin(rot) * innerR;
            ctx.lineTo(x2, y2);
            rot += step;
        }
        ctx.closePath();
    }

    animate() {
        if (!this.isRunning) return;
        
        this.updateParticles();
        this.drawParticles();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    // Tambah partikel baru (misal saat event)
    addParticles(count = 5, x, y) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x || Math.random() * this.canvas.width,
                y: y || Math.random() * this.canvas.height,
                size: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.7 + 0.3,
                angle: Math.random() * Math.PI * 2,
                rotateSpeed: (Math.random() - 0.5) * 0.05
            });
        }
    }

    // Hapus partikel yang sudah terlalu banyak
    cleanup() {
        if (this.particles.length > this.particleCount * 1.5) {
            this.particles = this.particles.slice(0, this.particleCount);
        }
    }
}

// ===== SISTEM BACKGROUND FLOATING ELEMENTS =====
class FloatingElements {
    constructor() {
        this.container = document.getElementById('floatingElements');
        this.elements = [];
        this.count = 15; // Jumlah elemen floating
        
        this.init();
    }

    init() {
        this.createElements();
        this.animate();
    }

    createElements() {
        const icons = ['fa-heart', 'fa-star', 'fa-cake-candles', 'fa-gift', 'fa-crown', 'fa-sparkles'];
        
        for (let i = 0; i < this.count; i++) {
            const element = document.createElement('i');
            element.className = `fas ${icons[Math.floor(Math.random() * icons.length)]} floating-element`;
            
            // Random position and animation
            const size = Math.random() * 20 + 10;
            const left = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            const rotation = Math.random() * 360;
            
            element.style.cssText = `
                font-size: ${size}px;
                left: ${left}%;
                animation: floatElement ${duration}s linear infinite;
                animation-delay: ${delay}s;
                transform: rotate(${rotation}deg);
                color: ${this.getRandomColor()};
                opacity: ${Math.random() * 0.3 + 0.1};
            `;
            
            this.container.appendChild(element);
            this.elements.push(element);
        }
    }

    getRandomColor() {
        const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#ffd700', '#ffffff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        // Tidak perlu animasi manual karena pakai CSS
        // Method ini untuk maintenance jika diperlukan
    }

    // Tambah elemen baru saat event
    addElement(icon, x, y) {
        const element = document.createElement('i');
        element.className = `fas ${icon} floating-element`;
        
        element.style.cssText = `
            font-size: 25px;
            left: ${x}%;
            top: ${y}%;
            animation: floatElement 10s linear forwards;
            color: #ff1493;
            opacity: 0.8;
        `;
        
        this.container.appendChild(element);
        
        // Hapus setelah animasi selesai
        setTimeout(() => {
            element.remove();
        }, 10000);
    }
}

// ===== SISTEM KONFETI =====
class ConfettiSystem {
    constructor() {
        this.canvas = document.getElementById('confettiCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.confetti = [];
        this.isRunning = false;
        
        this.init();
    }

    init() {
        this.resize();
        this.addEventListeners();
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
    }

    createConfetti(count = CONFIG.effects.confetti.count || 100) {
        for (let i = 0; i < count; i++) {
            this.confetti.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                size: Math.random() * 10 + 5,
                speedY: Math.random() * 5 + 2,
                speedX: Math.random() * 2 - 1,
                color: this.getRandomColor(),
                angle: Math.random() * Math.PI * 2,
                spin: Math.random() * 0.1 - 0.05,
                opacity: Math.random() * 0.8 + 0.2
            });
        }
    }

    getRandomColor() {
        const colors = CONFIG.effects.confetti.colors || ['#ff1493', '#ff69b4', '#ffb6c1', '#ffd700'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateConfetti() {
        for (let i = 0; i < this.confetti.length; i++) {
            const c = this.confetti[i];
            
            c.y += c.speedY;
            c.x += c.speedX;
            c.angle += c.spin;
            
            // Reset jika sudah keluar layar
            if (c.y > this.canvas.height) {
                c.y = -c.size;
                c.x = Math.random() * this.canvas.width;
                c.speedY = Math.random() * 5 + 2;
                c.speedX = Math.random() * 2 - 1;
                c.color = this.getRandomColor();
            }
        }
    }

    drawConfetti() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (const c of this.confetti) {
            this.ctx.save();
            this.ctx.translate(c.x, c.y);
            this.ctx.rotate(c.angle);
            
            // Gambar konfeti (bisa bentuk kotak, lingkaran, atau bintang)
            this.ctx.fillStyle = c.color;
            this.ctx.globalAlpha = c.opacity;
            this.ctx.shadowColor = c.color;
            this.ctx.shadowBlur = 10;
            
            if (Math.random() > 0.5) {
                // Kotak
                this.ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size);
            } else {
                // Lingkaran
                this.ctx.beginPath();
                this.ctx.arc(0, 0, c.size/2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        }
    }

    start() {
        this.isRunning = true;
        this.createConfetti();
        this.animate();
    }

    stop() {
        this.isRunning = false;
        this.confetti = [];
    }

    animate() {
        if (!this.isRunning) return;
        
        this.updateConfetti();
        this.drawConfetti();
        
        requestAnimationFrame(() => this.animate());
    }

    // Ledakan konfeti di titik tertentu
    burst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const speed = Math.random() * 5 + 3;
            
            this.confetti.push({
                x: x || this.canvas.width / 2,
                y: y || this.canvas.height / 2,
                size: Math.random() * 8 + 4,
                speedY: Math.sin(angle) * speed,
                speedX: Math.cos(angle) * speed,
                color: this.getRandomColor(),
                angle: Math.random() * Math.PI * 2,
                spin: Math.random() * 0.1 - 0.05,
                opacity: 1
            });
        }
    }
}

// ===== SISTEM PETAL / BUNGA BERGUGURAN =====
class PetalSystem {
    constructor() {
        this.container = document.getElementById('fallingPetals');
        this.petals = [];
        this.count = CONFIG.effects.petals.count || 30;
        
        this.init();
    }

    init() {
        this.createPetals();
    }

    createPetals() {
        for (let i = 0; i < this.count; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            
            const size = Math.random() * 20 + 15;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 5;
            const rotation = Math.random() * 360;
            
            petal.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                top: -${size}px;
                animation: fall ${duration}s linear infinite;
                animation-delay: ${delay}s;
                transform: rotate(${rotation}deg);
                background: radial-gradient(circle, 
                    ${this.getRandomColor()} 0%, 
                    ${this.getRandomColor()} 100%);
                opacity: ${Math.random() * 0.6 + 0.2};
            `;
            
            this.container.appendChild(petal);
            this.petals.push(petal);
        }
    }

    getRandomColor() {
        const colors = CONFIG.effects.petals.colors || ['#ffb6c1', '#ff69b4', '#ffc0cb'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi sistem partikel
    window.particleSystem = new ParticleSystem();
    
    // Inisialisasi floating elements
    window.floatingElements = new FloatingElements();
    
    // Inisialisasi petal system (untuk closing page)
    window.petalSystem = new PetalSystem();
    
    // Inisialisasi confetti system (akan diaktifkan saat closing)
    window.confettiSystem = new ConfettiSystem();
    
    console.log('✅ Particle systems initialized');
});

// ===== EXPORT FUNCTIONS =====
// Untuk digunakan di file lain
window.ParticleEffects = {
    // Aktifkan konfeti di closing page
    startConfetti: () => {
        if (window.confettiSystem) {
            window.confettiSystem.start();
        }
    },
    
    stopConfetti: () => {
        if (window.confettiSystem) {
            window.confettiSystem.stop();
        }
    },
    
    // Ledakan konfeti di titik tertentu
    confettiBurst: (x, y) => {
        if (window.confettiSystem) {
            window.confettiSystem.burst(x, y);
        }
    },
    
    // Tambah partikel di posisi tertentu
    addParticles: (count, x, y) => {
        if (window.particleSystem) {
            window.particleSystem.addParticles(count, x, y);
        }
    },
    
    // Tambah floating element
    addFloatingElement: (icon, x, y) => {
        if (window.floatingElements) {
            window.floatingElements.addElement(icon, x, y);
        }
    }
};
