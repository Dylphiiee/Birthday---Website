/* =============================================
   CAKE 3D - File 8 dari 12 file
   Membuat kue ulang tahun 3D dengan Three.js
   ============================================= */

class BirthdayCake3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cake = null;
        this.candles = [];
        this.flames = [];
        this.isLit = false;
        this.animationId = null;
        
        // Warna-warna kue
        this.colors = {
            layer1: 0xff1493,  // Deep pink
            layer2: 0xff69b4,  // Hot pink
            layer3: 0xffb6c1,  // Light pink
            icing: 0xfff0f5,   // Lavender blush
            candle: 0xffd700,  // Gold
            flame: 0xff4500,   // Orange red
            flameInner: 0xff8c00 // Dark orange
        };
        
        this.init();
    }
    
    init() {
        // Setup Three.js untuk cake canvas
        const setup = ThreeSetup.init('cakeCanvas', 0x1a0b1a);
        if (!setup) return;
        
        this.scene = setup.scene;
        this.camera = setup.camera;
        this.renderer = setup.renderer;
        
        // Setup lighting
        ThreeSetup.lights(this.scene);
        
        // Posisi kamera lebih dekat untuk cake
        this.camera.position.set(3, 2, 8);
        this.camera.lookAt(0, 1, 0);
        
        // Buat kue
        this.createCake();
        
        // Buat lilin
        this.createCandles();
        
        // Tambah efek partikel di sekitar
        this.createSurroundingParticles();
        
        // Mulai animasi
        this.animate();
    }
    
    createCake() {
        const cakeGroup = new THREE.Group();
        
        // Layer bawah (terbesar)
        const layer1 = this.createCakeLayer(2.5, 0.8, this.colors.layer1, 0);
        layer1.position.y = 0.4;
        cakeGroup.add(layer1);
        
        // Layer tengah
        const layer2 = this.createCakeLayer(2.0, 0.7, this.colors.layer2, 1);
        layer2.position.y = 1.2;
        cakeGroup.add(layer2);
        
        // Layer atas
        const layer3 = this.createCakeLayer(1.5, 0.6, this.colors.layer3, 2);
        layer3.position.y = 1.9;
        cakeGroup.add(layer3);
        
        // Hiasan icing (butiran)
        this.addIcingDecorations(cakeGroup);
        
        // Tambah efek glazed
        this.addGlazeEffect(cakeGroup);
        
        this.cake = cakeGroup;
        this.scene.add(cakeGroup);
    }
    
    createCakeLayer(radius, height, color, layerIndex) {
        const group = new THREE.Group();
        
        // Geometry utama
        const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
        const material = ThreeSetup.material(color, 0x220011, 0.4, 0.1);
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        cylinder.position.y = height / 2;
        group.add(cylinder);
        
        // Icing di atas (efek cream)
        const icingGeo = new THREE.CylinderGeometry(radius + 0.1, radius + 0.1, 0.1, 32);
        const icingMat = ThreeSetup.material(0xfff0f5, 0x331122, 0.6, 0);
        const icing = new THREE.Mesh(icingGeo, icingMat);
        icing.castShadow = true;
        icing.receiveShadow = true;
        icing.position.y = height;
        group.add(icing);
        
        // Icing drip effect (hanya untuk layer tertentu)
        if (layerIndex < 2) {
            this.addIcingDrips(group, radius, height, layerIndex);
        }
        
        return group;
    }
    
    addIcingDrips(group, radius, height, layerIndex) {
        const dripCount = 8;
        const dripHeight = 0.3;
        
        for (let i = 0; i < dripCount; i++) {
            const angle = (i / dripCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            // Drip geometry (bentuk tetesan)
            const dripGeo = new THREE.SphereGeometry(0.15, 8);
            const dripMat = ThreeSetup.material(0xfff0f5, 0x331122, 0.6, 0);
            const drip = new THREE.Mesh(dripGeo, dripMat);
            
            drip.position.set(x, height + 0.1, z);
            drip.scale.set(1, 1.5, 1);
            drip.castShadow = true;
            drip.receiveShadow = true;
            
            group.add(drip);
            
            // Tetesan lebih panjang untuk beberapa
            if (i % 2 === 0) {
                const drip2Geo = new THREE.CylinderGeometry(0.1, 0.15, 0.3, 6);
                const drip2 = new THREE.Mesh(drip2Geo, dripMat);
                drip2.position.set(x * 1.1, height - 0.1, z * 1.1);
                drip2.rotation.z = 0.2;
                drip2.rotation.x = 0.1;
                drip2.castShadow = true;
                drip2.receiveShadow = true;
                group.add(drip2);
            }
        }
    }
    
    addIcingDecorations(cakeGroup) {
        // Butiran sprinkles di setiap layer
        const sprinkleCount = 30;
        const sprinkleColors = [0xff1493, 0xff69b4, 0xffb6c1, 0xffd700, 0xffffff];
        
        for (let layer = 0; layer < 3; layer++) {
            const yPos = layer === 0 ? 0.8 : layer === 1 ? 1.6 : 2.3;
            const radius = layer === 0 ? 2.5 : layer === 1 ? 2.0 : 1.5;
            
            for (let i = 0; i < sprinkleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * radius * 0.8;
                const x = Math.cos(angle) * r;
                const z = Math.sin(angle) * r;
                
                // Sprinkle bisa berbentuk bola atau silinder kecil
                if (Math.random() > 0.5) {
                    const sprinkleGeo = new THREE.SphereGeometry(0.05, 4);
                    const sprinkleMat = ThreeSetup.material(
                        sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)],
                        0x220011,
                        0.3,
                        0
                    );
                    const sprinkle = new THREE.Mesh(sprinkleGeo, sprinkleMat);
                    sprinkle.position.set(x, yPos + 0.05, z);
                    sprinkle.castShadow = true;
                    cakeGroup.add(sprinkle);
                } else {
                    const sprinkleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 4);
                    const sprinkleMat = ThreeSetup.material(
                        sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)],
                        0x220011,
                        0.3,
                        0
                    );
                    const sprinkle = new THREE.Mesh(sprinkleGeo, sprinkleMat);
                    sprinkle.position.set(x, yPos + 0.05, z);
                    sprinkle.rotation.x = Math.random() * Math.PI;
                    sprinkle.rotation.z = Math.random() * Math.PI;
                    sprinkle.castShadow = true;
                    cakeGroup.add(sprinkle);
                }
            }
        }
    }
    
    addGlazeEffect(cakeGroup) {
        // Efek glaze transparan di atas kue
        const glazeGeo = new THREE.SphereGeometry(1.6, 32, 16);
        const glazeMat = new THREE.MeshPhongMaterial({
            color: 0xfff0f5,
            transparent: true,
            opacity: 0.2,
            emissive: 0x331122,
            shininess: 100,
            wireframe: true
        });
        
        const glaze = new THREE.Mesh(glazeGeo, glazeMat);
        glaze.position.y = 2.2;
        glaze.scale.set(1, 0.3, 1);
        cakeGroup.add(glaze);
    }
    
    createCandles() {
        const candleCount = 5; // 5 lilin untuk efek meriah
        const positions = [
            { x: -0.8, z: 0.8 },
            { x: 0.8, z: -0.8 },
            { x: -0.8, z: -0.8 },
            { x: 0.8, z: 0.8 },
            { x: 0, z: 0 }
        ];
        
        positions.forEach((pos, index) => {
            this.createCandle(pos.x, pos.z, index);
        });
    }
    
    createCandle(x, z, index) {
        const candleGroup = new THREE.Group();
        
        // Batang lilin
        const candleGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.6, 8);
        const candleMat = ThreeSetup.material(0xffd700, 0x442200, 0.4, 0.2);
        const candle = new THREE.Mesh(candleGeo, candleMat);
        candle.castShadow = true;
        candle.receiveShadow = true;
        candle.position.y = 2.3 + 0.3;
        candleGroup.add(candle);
        
        // Sumbu
        const wickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 4);
        const wickMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const wick = new THREE.Mesh(wickGeo, wickMat);
        wick.castShadow = true;
        wick.position.y = 2.3 + 0.6;
        candleGroup.add(wick);
        
        // Api (awalnya mati)
        const flameGroup = new THREE.Group();
        
        // Api utama
        const flame1Geo = new THREE.SphereGeometry(0.08, 8);
        const flame1Mat = ThreeSetup.material(0xffaa00, 0x442200, 0.2, 0);
        const flame1 = new THREE.Mesh(flame1Geo, flame1Mat);
        flame1.position.y = 2.3 + 0.7;
        flame1.scale.set(1, 1.5, 1);
        flame1.castShadow = true;
        flameGroup.add(flame1);
        
        // Api dalam (lebih terang)
        const flame2Geo = new THREE.SphereGeometry(0.04, 6);
        const flame2Mat = ThreeSetup.material(0xffdd00, 0x331100, 0.1, 0);
        const flame2 = new THREE.Mesh(flame2Geo, flame2Mat);
        flame2.position.y = 2.3 + 0.75;
        flame2.scale.set(1, 1.3, 1);
        flame2.castShadow = true;
        flameGroup.add(flame2);
        
        // Glow effect
        const flameGlowGeo = new THREE.SphereGeometry(0.15, 16);
        const flameGlowMat = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const flameGlow = new THREE.Mesh(flameGlowGeo, flameGlowMat);
        flameGlow.position.y = 2.3 + 0.7;
        flameGlow.scale.set(1.5, 1, 1.5);
        flameGroup.add(flameGlow);
        
        flameGroup.visible = false; // Mulai mati
        this.flames.push({
            group: flameGroup,
            speed: 0.1 + Math.random() * 0.1,
            phase: Math.random() * Math.PI * 2
        });
        
        candleGroup.add(flameGroup);
        candleGroup.position.set(x, 0, z);
        
        // Tambah lilin ke scene
        this.scene.add(candleGroup);
        this.candles.push(candleGroup);
    }
    
    createSurroundingParticles() {
        // Partikel di sekitar kue (efek magis)
        const particleCount = 50;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 3 + Math.random() * 2;
            const height = Math.random() * 3;
            
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMat = new THREE.PointsMaterial({
            color: 0xff69b4,
            size: 0.05,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeo, particleMat);
        this.scene.add(particles);
        this.particles = particles;
    }
    
    // Method untuk menyalakan lilin
    lightCandles() {
        if (this.isLit) return;
        
        this.isLit = true;
        
        // Tampilkan semua api
        this.flames.forEach((flame, index) => {
            setTimeout(() => {
                flame.group.visible = true;
                
                // Efek suara (akan di-handle oleh audio manager)
                if (window.audioManager) {
                    window.audioManager.playSfx('flame');
                }
                
                // Tambah partikel kecil saat nyala
                if (window.ParticleEffects) {
                    const x = this.candles[index].position.x;
                    const z = this.candles[index].position.z;
                    // Konversi koordinat 3D ke layar (approximasi)
                    window.ParticleEffects.addParticles(5, 50 + x * 10, 50 + z * 10);
                }
            }, index * 100); // Nyala bergantian
        });
        
        // Trigger event untuk lagu
        const event = new CustomEvent('candlesLit');
        document.dispatchEvent(event);
    }
    
    animate() {
        if (!this.renderer || !this.scene || !this.camera) return;
        
        requestAnimationFrame(() => this.animate());
        
        const delta = ThreeSetup.clock.getDelta();
        const time = Date.now() * 0.001;
        
        // Animasi kue (float sedikit)
        if (this.cake) {
            this.cake.position.y = Math.sin(time * 0.5) * 0.05;
            this.cake.rotation.y += 0.002;
        }
        
        // Animasi api (jika menyala)
        if (this.isLit) {
            this.flames.forEach(flame => {
                if (flame.group.visible) {
                    // Efek flicker
                    flame.group.children.forEach((child, index) => {
                        if (index === 0) { // Api utama
                            child.scale.set(
                                1 + Math.sin(time * flame.speed * 20 + flame.phase) * 0.2,
                                1.5 + Math.cos(time * flame.speed * 15) * 0.3,
                                1 + Math.sin(time * flame.speed * 25) * 0.2
                            );
                        } else if (index === 2) { // Glow
                            child.material.opacity = 0.3 + Math.sin(time * 10) * 0.1;
                            child.scale.set(
                                1.5 + Math.sin(time * 5) * 0.2,
                                1,
                                1.5 + Math.cos(time * 5) * 0.2
                            );
                        }
                    });
                }
            });
        }
        
        // Animasi partikel
        if (this.particles) {
            this.particles.rotation.y += 0.001;
        }
        
        ThreeSetup.resize(this.camera, this.renderer);
        this.renderer.render(this.scene, this.camera);
    }
    
    // Cleanup
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Hapus semua objek dari scene
        while(this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        
        // Hapus renderer
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
    }
}

// Initialize saat halaman present dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Cek apakah kita di halaman present
    const presentPage = document.getElementById('presentPage');
    if (presentPage && presentPage.classList.contains('active')) {
        window.cake3D = new BirthdayCake3D();
    }
});

// Event listener untuk page change
document.addEventListener('pageChanged', (e) => {
    if (e.detail.page === 'presentPage') {
        // Inisialisasi cake jika belum ada
        if (!window.cake3D) {
            setTimeout(() => {
                window.cake3D = new BirthdayCake3D();
            }, 500);
        }
    } else {
        // Cleanup jika pindah halaman
        if (window.cake3D) {
            window.cake3D.dispose();
            window.cake3D = null;
        }
    }
});

// Export untuk digunakan di file lain
window.Cake3D = {
    init: () => {
        if (!window.cake3D) {
            window.cake3D = new BirthdayCake3D();
        }
        return window.cake3D;
    },
    
    lightCandles: () => {
        if (window.cake3D) {
            window.cake3D.lightCandles();
        }
    }
};
