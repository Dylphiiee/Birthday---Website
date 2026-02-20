/* =============================================
   GIFT 3D - File 9 dari 12 file
   Membuat kotak hadiah 3D dengan Three.js
   ============================================= */

class Gift3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.gift = null;
        this.lid = null;
        this.ribbons = [];
        this.isOpened = false;
        this.animationId = null;
        
        // Warna-warna hadiah
        this.colors = {
            box: 0xff69b4,      // Hot pink
            lid: 0xff1493,       // Deep pink
            ribbon: 0xffffff,    // White
            ribbonAccent: 0xfff0f5, // Light pink for accent
            bow: 0xffb6c1        // Light pink for bow
        };
        
        this.init();
    }
    
    init() {
        // Setup Three.js untuk gift canvas
        const setup = ThreeSetup.init('giftCanvas', 0x1a0b1a);
        if (!setup) return;
        
        this.scene = setup.scene;
        this.camera = setup.camera;
        this.renderer = setup.renderer;
        
        // Setup lighting spesifik untuk gift
        this.setupGiftLights();
        
        // Posisi kamera
        this.camera.position.set(4, 3, 8);
        this.camera.lookAt(0, 1, 0);
        
        // Buat hadiah
        this.createGift();
        
        // Tambah efek kilauan
        this.createSparkles();
        
        // Mulai animasi
        this.animate();
    }
    
    setupGiftLights() {
        // Light utama
        const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
        mainLight.position.set(5, 8, 7);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        this.scene.add(mainLight);
        
        // Fill light pink
        const fillLight = new THREE.PointLight(0xff69b4, 0.8);
        fillLight.position.set(-3, 4, 5);
        this.scene.add(fillLight);
        
        // Back light
        const backLight = new THREE.PointLight(0xff1493, 0.5);
        backLight.position.set(0, 3, -5);
        this.scene.add(backLight);
        
        // Spot light untuk sorotan
        const spotLight = new THREE.SpotLight(0xffb6c1, 0.5);
        spotLight.position.set(2, 6, 4);
        spotLight.castShadow = true;
        spotLight.angle = 0.3;
        spotLight.penumbra = 0.5;
        spotLight.decay = 1;
        spotLight.distance = 20;
        this.scene.add(spotLight);
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);
    }
    
    createGift() {
        const giftGroup = new THREE.Group();
        
        // Kotak utama
        const boxGeo = new THREE.BoxGeometry(2.5, 1.8, 2.5);
        const boxMat = ThreeSetup.material(this.colors.box, 0x331122, 0.4, 0.1);
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.castShadow = true;
        box.receiveShadow = true;
        box.position.y = 0.9;
        giftGroup.add(box);
        
        // Efek tekstur kotak (garis-garis halus)
        this.addBoxTexture(giftGroup);
        
        // Tutup kotak (akan dipisah untuk animasi)
        const lidGeo = new THREE.BoxGeometry(2.7, 0.3, 2.7);
        const lidMat = ThreeSetup.material(this.colors.lid, 0x442233, 0.5, 0.1);
        this.lid = new THREE.Mesh(lidGeo, lidMat);
        this.lid.castShadow = true;
        this.lid.receiveShadow = true;
        this.lid.position.y = 1.95;
        giftGroup.add(this.lid);
        
        // Efek border pada tutup
        this.addLidBorder();
        
        // Pita horizontal
        this.createHorizontalRibbon(giftGroup);
        
        // Pita vertikal
        this.createVerticalRibbon(giftGroup);
        
        // Pita atas (bow)
        this.createBow(giftGroup);
        
        this.gift = giftGroup;
        this.scene.add(giftGroup);
    }
    
    addBoxTexture(giftGroup) {
        // Garis-garis halus di permukaan kotak
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.1, transparent: true });
        
        // Garis horizontal
        for (let i = -0.8; i <= 0.8; i += 0.4) {
            const points = [];
            points.push(new THREE.Vector3(-1.2, 0.9 + i, 1.2));
            points.push(new THREE.Vector3(1.2, 0.9 + i, 1.2));
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            giftGroup.add(line);
        }
    }
    
    addLidBorder() {
        // Border emas di pinggir tutup
        const borderMaterial = ThreeSetup.material(0xffd700, 0x442200, 0.6, 0.3);
        
        // Keempat sisi border
        const positions = [
            { w: 2.8, h: 0.1, d: 0.2, x: 0, y: 1.95, z: 1.3 },
            { w: 2.8, h: 0.1, d: 0.2, x: 0, y: 1.95, z: -1.3 },
            { w: 0.2, h: 0.1, d: 2.8, x: 1.3, y: 1.95, z: 0 },
            { w: 0.2, h: 0.1, d: 2.8, x: -1.3, y: 1.95, z: 0 }
        ];
        
        positions.forEach(pos => {
            const borderGeo = new THREE.BoxGeometry(pos.w, pos.h, pos.d);
            const border = new THREE.Mesh(borderGeo, borderMaterial);
            border.position.set(pos.x, pos.y, pos.z);
            border.castShadow = true;
            this.gift.add(border);
        });
    }
    
    createHorizontalRibbon(giftGroup) {
        const ribbonMat = ThreeSetup.material(this.colors.ribbon, 0x333333, 0.7, 0);
        
        // Pita horizontal depan-belakang
        const ribbon1Geo = new THREE.BoxGeometry(2.8, 0.2, 0.5);
        const ribbon1 = new THREE.Mesh(ribbon1Geo, ribbonMat);
        ribbon1.castShadow = true;
        ribbon1.position.set(0, 1.2, 0);
        giftGroup.add(ribbon1);
        
        // Pita horizontal kiri-kanan
        const ribbon2Geo = new THREE.BoxGeometry(0.5, 0.2, 2.8);
        const ribbon2 = new THREE.Mesh(ribbon2Geo, ribbonMat);
        ribbon2.castShadow = true;
        ribbon2.position.set(0, 1.2, 0);
        giftGroup.add(ribbon2);
    }
    
    createVerticalRibbon(giftGroup) {
        const ribbonMat = ThreeSetup.material(this.colors.ribbon, 0x333333, 0.7, 0);
        
        // Pita vertikal depan-belakang
        const ribbon3Geo = new THREE.BoxGeometry(0.3, 2.2, 2.8);
        const ribbon3 = new THREE.Mesh(ribbon3Geo, ribbonMat);
        ribbon3.castShadow = true;
        ribbon3.position.set(0, 1.1, 0);
        giftGroup.add(ribbon3);
        
        // Pita vertikal kiri-kanan
        const ribbon4Geo = new THREE.BoxGeometry(2.8, 2.2, 0.3);
        const ribbon4 = new THREE.Mesh(ribbon4Geo, ribbonMat);
        ribbon4.castShadow = true;
        ribbon4.position.set(0, 1.1, 0);
        giftGroup.add(ribbon4);
    }
    
    createBow(giftGroup) {
        const bowGroup = new THREE.Group();
        
        // Material untuk bow
        const bowMat = ThreeSetup.material(this.colors.bow, 0x442233, 0.6, 0.1);
        const ribbonMat = ThreeSetup.material(this.colors.ribbon, 0x333333, 0.7, 0);
        
        // Loop kiri
        const loop1Geo = new THREE.TorusGeometry(0.4, 0.1, 16, 32, Math.PI / 2);
        const loop1 = new THREE.Mesh(loop1Geo, bowMat);
        loop1.rotation.z = Math.PI / 4;
        loop1.rotation.x = Math.PI / 2;
        loop1.position.set(-0.6, 2.3, 0);
        loop1.castShadow = true;
        bowGroup.add(loop1);
        
        // Loop kanan
        const loop2Geo = new THREE.TorusGeometry(0.4, 0.1, 16, 32, Math.PI / 2);
        const loop2 = new THREE.Mesh(loop2Geo, bowMat);
        loop2.rotation.z = -Math.PI / 4;
        loop2.rotation.x = Math.PI / 2;
        loop2.position.set(0.6, 2.3, 0);
        loop2.castShadow = true;
        bowGroup.add(loop2);
        
        // Loop depan
        const loop3Geo = new THREE.TorusGeometry(0.4, 0.1, 16, 32, Math.PI / 2);
        const loop3 = new THREE.Mesh(loop3Geo, bowMat);
        loop3.rotation.x = Math.PI / 2;
        loop3.rotation.z = Math.PI / 2;
        loop3.position.set(0, 2.3, 0.6);
        loop3.castShadow = true;
        bowGroup.add(loop3);
        
        // Loop belakang
        const loop4Geo = new THREE.TorusGeometry(0.4, 0.1, 16, 32, Math.PI / 2);
        const loop4 = new THREE.Mesh(loop4Geo, bowMat);
        loop4.rotation.x = Math.PI / 2;
        loop4.rotation.z = -Math.PI / 2;
        loop4.position.set(0, 2.3, -0.6);
        loop4.castShadow = true;
        bowGroup.add(loop4);
        
        // Pusat bow
        const centerGeo = new THREE.SphereGeometry(0.2, 16);
        const centerMat = ThreeSetup.material(0xffd700, 0x442200, 0.5, 0.3);
        const center = new THREE.Mesh(centerGeo, centerMat);
        center.position.set(0, 2.3, 0);
        center.castShadow = true;
        bowGroup.add(center);
        
        // Pita menjuntai
        const tail1Geo = new THREE.CylinderGeometry(0.05, 0.1, 1.2, 8);
        const tail1 = new THREE.Mesh(tail1Geo, ribbonMat);
        tail1.position.set(-0.6, 1.7, 0);
        tail1.rotation.z = 0.2;
        tail1.castShadow = true;
        bowGroup.add(tail1);
        
        const tail2Geo = new THREE.CylinderGeometry(0.05, 0.1, 1.2, 8);
        const tail2 = new THREE.Mesh(tail2Geo, ribbonMat);
        tail2.position.set(0.6, 1.7, 0);
        tail2.rotation.z = -0.2;
        tail2.castShadow = true;
        bowGroup.add(tail2);
        
        giftGroup.add(bowGroup);
        this.bow = bowGroup;
    }
    
    createSparkles() {
        // Partikel kilauan di sekitar hadiah
        const particleCount = 30;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 2.5 + Math.random() * 1.5;
            const height = Math.random() * 3;
            
            positions[i * 3] = Math.cos(angle) * radius;
            positions[i * 3 + 1] = height;
            positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
        
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMat = new THREE.PointsMaterial({
            color: 0xffd700,
            size: 0.05,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeo, particleMat);
        this.scene.add(particles);
        this.sparkles = particles;
    }
    
    // Method untuk membuka hadiah
    openGift() {
        if (this.isOpened) return;
        
        this.isOpened = true;
        
        // Animasi membuka tutup
        const openAnimation = () => {
            if (!this.lid) return;
            
            // Tutup naik
            this.lid.position.y += 0.02;
            
            // Tutup miring sedikit
            this.lid.rotation.x += 0.01;
            this.lid.rotation.z += 0.005;
            
            // Pita lepas
            if (this.bow) {
                this.bow.children.forEach(child => {
                    child.position.y += 0.01;
                    child.rotation.x += 0.02;
                    child.rotation.z += 0.02;
                });
            }
            
            if (this.lid.position.y < 3.0) {
                requestAnimationFrame(openAnimation);
            } else {
                // Tampilkan buku setelah animasi selesai
                setTimeout(() => {
                    const event = new CustomEvent('giftOpened');
                    document.dispatchEvent(event);
                }, 500);
            }
        };
        
        openAnimation();
        
        // Efek suara (akan di-handle audio manager)
        if (window.audioManager) {
            window.audioManager.playSfx('gift');
        }
        
        // Efek partikel
        if (window.ParticleEffects) {
            window.ParticleEffects.addParticles(20, 50, 50);
            window.ParticleEffects.addFloatingElement('fa-gift', 50, 50);
        }
    }
    
    animate() {
        if (!this.renderer || !this.scene || !this.camera) return;
        
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Animasi hadiah mengambang
        if (this.gift && !this.isOpened) {
            this.gift.position.y = Math.sin(time * 0.8) * 0.1;
            this.gift.rotation.y += 0.003;
        }
        
        // Animasi kilauan
        if (this.sparkles) {
            this.sparkles.rotation.y += 0.001;
            this.sparkles.children.forEach(child => {
                if (child.material) {
                    child.material.opacity = 0.3 + Math.sin(time * 5) * 0.2;
                }
            });
        }
        
        // Animasi pita jika belum dibuka
        if (this.bow && !this.isOpened) {
            this.bow.rotation.y += 0.005;
            this.bow.position.y = Math.sin(time * 2) * 0.05;
        }
        
        ThreeSetup.resize(this.camera, this.renderer);
        this.renderer.render(this.scene, this.camera);
    }
    
    // Cleanup
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        while(this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
    }
}

// Initialize saat halaman present dimuat
document.addEventListener('DOMContentLoaded', () => {
    const presentPage = document.getElementById('presentPage');
    if (presentPage && presentPage.classList.contains('active')) {
        // Gift akan diinisialisasi setelah kue selesai
    }
});

// Event listener untuk menampilkan gift
document.addEventListener('showGift', () => {
    if (!window.gift3D) {
        window.gift3D = new Gift3D();
    }
});

// Event listener untuk membuka gift
document.addEventListener('openGift', () => {
    if (window.gift3D) {
        window.gift3D.openGift();
    }
});

// Export untuk digunakan di file lain
window.Gift3D = {
    init: () => {
        if (!window.gift3D) {
            window.gift3D = new Gift3D();
        }
        return window.gift3D;
    },
    
    open: () => {
        if (window.gift3D) {
            window.gift3D.openGift();
        }
    }
};
