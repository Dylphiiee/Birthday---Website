/* =============================================
   BOOK 3D - File 10 dari 12 file
   Membuat buku board book 3D dengan halaman bisa dibuka
   ============================================= */

class Book3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.book = null;
        this.pages = [];
        this.currentPage = 0;
        this.totalPages = 10; // Default, akan diganti dari PDF
        this.isOpen = false;
        self.animationId = null;
        self.letterAttachment = null;
        self.letterVisible = false;
        
        // Warna-warna buku
        self.colors = {
            cover: 0x8b4513,      // Coklat tua
            coverLight: 0xa0522d,  // Coklat muda
            spine: 0x654321,       // Coklat gelap
            pages: 0xfff8e7,       // Krem
            text: 0x000000,        // Hitam
            letter: 0xfff0e0,      // Krem untuk surat
            letterBorder: 0xff69b4 // Pink untuk border surat
        };
        
        self.init();
    }
    
    init() {
        // Setup Three.js untuk book canvas
        const setup = ThreeSetup.init('bookCanvas', 0x1a0b1a);
        if (!setup) return;
        
        self.scene = setup.scene;
        self.camera = setup.camera;
        self.renderer = setup.renderer;
        
        // Setup lighting spesifik untuk buku
        self.setupBookLights();
        
        // Posisi kamera
        self.camera.position.set(5, 3, 10);
        self.camera.lookAt(0, 1.5, 0);
        
        // Buat buku
        self.createBook();
        
        // Buat surat di belakang (awalnya tersembunyi)
        self.createLetterAttachment();
        
        // Load PDF dan setup halaman
        self.loadPDF();
        
        // Mulai animasi
        self.animate();
    }
    
    setupBookLights() {
        // Light utama dari depan
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(2, 5, 8);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 1024;
        mainLight.shadow.mapSize.height = 1024;
        self.scene.add(mainLight);
        
        // Light dari samping untuk efek volume
        const sideLight = new THREE.DirectionalLight(0xffe6e6, 0.8);
        sideLight.position.set(-4, 3, 4);
        self.scene.add(sideLight);
        
        // Light dari belakang untuk efek glow
        const backLight = new THREE.PointLight(0xff69b4, 0.3);
        backLight.position.set(0, 2, -5);
        self.scene.add(backLight);
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404060);
        self.scene.add(ambientLight);
    }
    
    createBook() {
        const bookGroup = new THREE.Group();
        
        // Cover kiri
        const coverLeftGeo = new THREE.BoxGeometry(2.5, 0.2, 4);
        const coverLeftMat = ThreeSetup.material(self.colors.cover, 0x221100, 0.5, 0.2);
        const coverLeft = new THREE.Mesh(coverLeftGeo, coverLeftMat);
        coverLeft.castShadow = true;
        coverLeft.receiveShadow = true;
        coverLeft.position.set(-1.25, 1.5, 0);
        bookGroup.add(coverLeft);
        
        // Cover kanan
        const coverRightGeo = new THREE.BoxGeometry(2.5, 0.2, 4);
        const coverRightMat = ThreeSetup.material(self.colors.coverLight, 0x332211, 0.5, 0.2);
        const coverRight = new THREE.Mesh(coverRightGeo, coverRightMat);
        coverRight.castShadow = true;
        coverRight.receiveShadow = true;
        coverRight.position.set(1.25, 1.5, 0);
        bookGroup.add(coverRight);
        
        // Spine (punggung buku)
        const spineGeo = new THREE.BoxGeometry(0.5, 0.2, 4);
        const spineMat = ThreeSetup.material(self.colors.spine, 0x221100, 0.6, 0.2);
        const spine = new THREE.Mesh(spineGeo, spineMat);
        spine.castShadow = true;
        spine.receiveShadow = true;
        spine.position.set(0, 1.5, 0);
        bookGroup.add(spine);
        
        // Halaman-halaman (background)
        const pagesGeo = new THREE.BoxGeometry(4.8, 0.1, 3.8);
        const pagesMat = ThreeSetup.material(self.colors.pages, 0x111111, 0.3, 0);
        const pages = new THREE.Mesh(pagesGeo, pagesMat);
        pages.castShadow = true;
        pages.receiveShadow = true;
        pages.position.set(0, 1.55, 0);
        bookGroup.add(pages);
        
        // Detail cover (judul)
        self.addCoverDetails(bookGroup);
        
        self.book = bookGroup;
        self.scene.add(bookGroup);
    }
    
    addCoverDetails(bookGroup) {
        // Buat teks 3D untuk judul
        ThreeSetup.text3D('Buku Spesial', 0xffd700, 0.3, 0.05).then(textMesh => {
            textMesh.position.set(-0.5, 1.8, 1.5);
            textMesh.rotation.y = 0.1;
            textMesh.castShadow = true;
            bookGroup.add(textMesh);
        });
        
        // Dekorasi di cover
        const decorMat = new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0x442200 });
        
        // Bintang di cover
        for (let i = 0; i < 5; i++) {
            const starGeo = new THREE.OctahedronGeometry(0.1);
            const star = new THREE.Mesh(starGeo, decorMat);
            star.position.set(-1 + i * 0.5, 1.8, 1.8);
            star.castShadow = true;
            bookGroup.add(star);
        }
    }
    
    createPages() {
        // Buat halaman-halaman individual
        for (let i = 0; i < self.totalPages; i++) {
            const pageGeo = new THREE.BoxGeometry(2.4, 0.01, 3.6);
            const pageMat = new THREE.MeshStandardMaterial({
                color: 0xfff8e7,
                emissive: 0x111111,
                transparent: true,
                opacity: 0.9
            });
            
            const page = new THREE.Mesh(pageGeo, pageMat);
            page.castShadow = true;
            page.receiveShadow = true;
            
            // Posisi awal (semua di tengah)
            page.position.set(0, 1.56 + i * 0.005, 0);
            page.rotation.y = 0;
            
            // Simpan referensi
            self.pages.push(page);
            self.scene.add(page);
        }
    }
    
    loadPDF() {
        // Inisialisasi PDF.js
        const pdfUrl = CONFIG.pdf.file || 'media/buku.pdf';
        
        pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
            self.totalPages = pdf.numPages;
            self.createPages();
            
            console.log(`📖 PDF loaded: ${self.totalPages} pages`);
            
            // Update total pages di UI
            const pageCount = document.getElementById('pdfPageCount');
            if (pageCount) {
                pageCount.textContent = self.totalPages;
            }
        }).catch(error => {
            console.error('Error loading PDF:', error);
            // Fallback: buat pages default
            self.totalPages = 10;
            self.createPages();
        });
    }
    
    createLetterAttachment() {
        const letterGroup = new THREE.Group();
        
        // Amplop surat kecil
        const envelopeGeo = new THREE.BoxGeometry(0.8, 0.1, 0.6);
        const envelopeMat = ThreeSetup.material(self.colors.letter, 0x332211, 0.4, 0.1);
        const envelope = new THREE.Mesh(envelopeGeo, envelopeMat);
        envelope.castShadow = true;
        envelope.receiveShadow = true;
        envelope.position.set(2.8, 2.0, 1.5);
        letterGroup.add(envelope);
        
        // Pita kecil di amplop
        const ribbonGeo = new THREE.BoxGeometry(0.1, 0.05, 0.4);
        const ribbonMat = ThreeSetup.material(self.colors.letterBorder, 0x442233, 0.6, 0.2);
        const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
        ribbon.position.set(2.8, 2.05, 1.5);
        letterGroup.add(ribbon);
        
        // Hati kecil sebagai penanda
        const heartGeo = new THREE.TetrahedronGeometry(0.08);
        const heartMat = ThreeSetup.material(0xff1493, 0x442233, 0.5, 0.1);
        const heart = new THREE.Mesh(heartGeo, heartMat);
        heart.position.set(2.8, 2.1, 1.5);
        letterGroup.add(heart);
        
        letterGroup.visible = false; // Mulai tersembunyi
        self.letterAttachment = letterGroup;
        self.scene.add(letterGroup);
    }
    
    // Method untuk membuka buku
    openBook() {
        if (self.isOpen) return;
        
        self.isOpen = true;
        self.currentPage = 0;
        
        // Animasi membuka cover
        const openAnimation = () => {
            if (self.currentPage < self.totalPages) {
                // Putar halaman
                if (self.pages[self.currentPage]) {
                    self.pages[self.currentPage].rotation.y -= 0.1;
                }
                
                self.currentPage++;
                
                if (self.currentPage < self.totalPages) {
                    requestAnimationFrame(openAnimation);
                } else {
                    // Setelah semua halaman terbuka, tampilkan surat
                    setTimeout(() => {
                        self.showLetter();
                    }, 1000);
                }
            }
        };
        
        // Putar cover
        if (self.book) {
            self.book.children[0].rotation.y -= 0.02; // Cover kiri
            self.book.children[1].rotation.y += 0.02; // Cover kanan
        }
        
        setTimeout(openAnimation, 500);
    }
    
    // Method untuk membuka 1 halaman (dipanggil per page)
    turnPage(pageNum) {
        if (pageNum >= 0 && pageNum < self.pages.length) {
            const page = self.pages[pageNum];
            
            // Animasi membalik halaman
            const turnAnimation = () => {
                page.rotation.y -= 0.05;
                page.position.x += 0.02;
                
                if (page.rotation.y > -Math.PI) {
                    requestAnimationFrame(turnAnimation);
                }
            };
            
            turnAnimation();
            
            // Efek suara
            if (window.audioManager) {
                window.audioManager.playSfx('page');
            }
        }
    }
    
    // Method untuk menutup buku
    closeBook() {
        const closeAnimation = () => {
            if (self.currentPage > 0) {
                self.currentPage--;
                
                if (self.pages[self.currentPage]) {
                    self.pages[self.currentPage].rotation.y = 0;
                    self.pages[self.currentPage].position.x = 0;
                }
                
                if (self.currentPage > 0) {
                    requestAnimationFrame(closeAnimation);
                } else {
                    // Tutup cover
                    if (self.book) {
                        self.book.children[0].rotation.y = 0;
                        self.book.children[1].rotation.y = 0;
                    }
                    
                    self.isOpen = false;
                    
                    // Tampilkan surat
                    self.showLetter();
                }
            }
        };
        
        closeAnimation();
    }
    
    // Method untuk menampilkan surat di belakang
    showLetter() {
        if (self.letterAttachment) {
            self.letterAttachment.visible = true;
            self.letterVisible = true;
            
            // Animasi surat muncul
            const appearAnimation = () => {
                self.letterAttachment.position.y += 0.01;
                self.letterAttachment.rotation.y += 0.01;
                
                if (self.letterAttachment.position.y < 2.5) {
                    requestAnimationFrame(appearAnimation);
                }
            };
            
            appearAnimation();
            
            // Event untuk klik surat
            const letterElement = document.getElementById('letterAttachment');
            if (letterElement) {
                letterElement.style.display = 'flex';
                letterElement.addEventListener('click', () => {
                    self.goToClosing();
                });
            }
        }
    }
    
    // Method untuk pindah ke closing page
    goToClosing() {
        const event = new CustomEvent('goToClosing');
        document.dispatchEvent(event);
    }
    
    // Method untuk sinkronisasi dengan lagu
    syncWithSong(duration) {
        const pageInterval = duration / self.totalPages * 1000; // ms per page
        
        for (let i = 0; i < self.totalPages; i++) {
            setTimeout(() => {
                self.turnPage(i);
            }, i * pageInterval);
        }
        
        setTimeout(() => {
            self.closeBook();
        }, duration * 1000);
    }
    
    animate() {
        if (!self.renderer || !self.scene || !self.camera) return;
        
        requestAnimationFrame(() => self.animate());
        
        const time = Date.now() * 0.001;
        
        // Animasi buku mengambang
        if (self.book && !self.isOpen) {
            self.book.position.y = 1.5 + Math.sin(time * 0.5) * 0.1;
            self.book.rotation.y = Math.sin(time * 0.2) * 0.1;
        }
        
        // Animasi surat (jika visible)
        if (self.letterAttachment && self.letterVisible) {
            self.letterAttachment.rotation.y += 0.005;
            self.letterAttachment.position.y = 2.0 + Math.sin(time * 1.5) * 0.1;
        }
        
        ThreeSetup.resize(self.camera, self.renderer);
        self.renderer.render(self.scene, self.camera);
    }
    
    // Cleanup
    dispose() {
        if (self.animationId) {
            cancelAnimationFrame(self.animationId);
        }
        
        while(self.scene.children.length > 0) {
            self.scene.remove(self.scene.children[0]);
        }
        
        if (self.renderer) {
            self.renderer.dispose();
            self.renderer = null;
        }
    }
}

// Initialize saat halaman present dimuat
document.addEventListener('DOMContentLoaded', () => {
    const presentPage = document.getElementById('presentPage');
    if (presentPage && presentPage.classList.contains('active')) {
        // Book akan diinisialisasi setelah hadiah dibuka
    }
});

// Event listener untuk menampilkan buku
document.addEventListener('showBook', () => {
    if (!window.book3D) {
        window.book3D = new Book3D();
    }
});

// Event listener untuk membuka buku
document.addEventListener('openBook', () => {
    if (window.book3D) {
        window.book3D.openBook();
    }
});

// Event listener untuk sinkronisasi dengan lagu
document.addEventListener('syncBookWithSong', (e) => {
    if (window.book3D) {
        window.book3D.syncWithSong(e.detail.duration);
    }
});

// Export untuk digunakan di file lain
window.Book3D = {
    init: () => {
        if (!window.book3D) {
            window.book3D = new Book3D();
        }
        return window.book3D;
    },
    
    open: () => {
        if (window.book3D) {
            window.book3D.openBook();
        }
    },
    
    turnPage: (pageNum) => {
        if (window.book3D) {
            window.book3D.turnPage(pageNum);
        }
    },
    
    close: () => {
        if (window.book3D) {
            window.book3D.closeBook();
        }
    },
    
    syncWithSong: (duration) => {
        if (window.book3D) {
            window.book3D.syncWithSong(duration);
        }
    }
};
