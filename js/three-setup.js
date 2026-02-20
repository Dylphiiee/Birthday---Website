/* =============================================
   THREE.JS SETUP - File 7 dari 12 file
   Setup dasar Three.js untuk semua objek 3D
   ============================================= */

// Inisialisasi Three.js
let scene, camera, renderer;
let clock = new THREE.Clock();

// Warna tema
const themeColors = {
    pink: 0xff1493,
    pinkLight: 0xff69b4,
    pinkSoft: 0xffb6c1,
    white: 0xffffff,
    gold: 0xffd700
};

// Setup dasar untuk setiap scene
function initThreeJS(containerId, backgroundColor = 0x1a0b1a) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, 10);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    return { scene, camera, renderer };
}

// Setup lighting untuk semua scene
function setupLights(scene) {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    
    // Main directional light (untuk bayangan)
    const mainLight = new THREE.DirectionalLight(0xfff5e6, 1);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.receiveShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    
    const d = 10;
    mainLight.shadow.camera.left = -d;
    mainLight.shadow.camera.right = d;
    mainLight.shadow.camera.top = d;
    mainLight.shadow.camera.bottom = -d;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 25;
    
    scene.add(mainLight);
    
    // Fill light dari kanan
    const fillLight = new THREE.DirectionalLight(0xffb6c1, 0.5);
    fillLight.position.set(-5, 3, 5);
    scene.add(fillLight);
    
    // Back light
    const backLight = new THREE.DirectionalLight(0xff69b4, 0.3);
    backLight.position.set(0, 2, -5);
    scene.add(backLight);
    
    // Point lights untuk efek glow
    const pointLight1 = new THREE.PointLight(0xff1493, 0.5, 10);
    pointLight1.position.set(2, 3, 2);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff69b4, 0.5, 10);
    pointLight2.position.set(-2, 1, 2);
    scene.add(pointLight2);
    
    // Hemisphere light untuk ambient natural
    const hemiLight = new THREE.HemisphereLight(0xffb6c1, 0x1a0b1a, 0.6);
    scene.add(hemiLight);
    
    return { ambientLight, mainLight, fillLight, backLight, pointLight1, pointLight2, hemiLight };
}

// Setup helper (untuk debugging)
function setupHelpers(scene) {
    if (CONFIG.debug.enabled) {
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        
        const gridHelper = new THREE.GridHelper(20, 20, 0xff1493, 0xff69b4);
        scene.add(gridHelper);
    }
}

// Material creator dengan efek glow
function createGlowMaterial(color, emissive = 0x330000, roughness = 0.3, metalness = 0.1) {
    return new THREE.MeshStandardMaterial({
        color: color,
        emissive: emissive,
        roughness: roughness,
        metalness: metalness,
        emissiveIntensity: 0.5
    });
}

// Fungsi untuk membuat teks 3D
function createText3D(text, color = 0xff1493, size = 0.5, height = 0.1) {
    return new Promise((resolve) => {
        const loader = new THREE.FontLoader();
        
        // Gunakan font default atau load dari CDN
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const geometry = new THREE.TextGeometry(text, {
                font: font,
                size: size,
                height: height,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            });
            
            const material = createGlowMaterial(color, 0x330000);
            const textMesh = new THREE.Mesh(geometry, material);
            
            textMesh.castShadow = true;
            textMesh.receiveShadow = true;
            
            // Center the text
            geometry.computeBoundingBox();
            const box = geometry.boundingBox;
            if (box) {
                const centerX = (box.max.x + box.min.x) / 2;
                const centerY = (box.max.y + box.min.y) / 2;
                const centerZ = (box.max.z + box.min.z) / 2;
                textMesh.position.set(-centerX, -centerY, -centerZ);
            }
            
            resolve(textMesh);
        });
    });
}

// Fungsi untuk membuat particle system
function createParticleSystem(count = 100, color = 0xff1493, size = 0.1) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
        // Posisi random dalam sphere
        const r = 5 + Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // Warna random variasi
        const rColor = ((color >> 16) & 0xff) / 255;
        const gColor = ((color >> 8) & 0xff) / 255;
        const bColor = (color & 0xff) / 255;
        
        colors[i * 3] = rColor + (Math.random() - 0.5) * 0.2;
        colors[i * 3 + 1] = gColor + (Math.random() - 0.5) * 0.2;
        colors[i * 3 + 2] = bColor + (Math.random() - 0.5) * 0.2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const particles = new THREE.Points(geometry, material);
    return particles;
}

// Fungsi untuk membuat glow effect
function createGlowSphere(radius = 1, color = 0xff1493, intensity = 0.5) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    return sphere;
}

// Fungsi untuk membuat floating animation
function createFloatAnimation(mesh, speed = 1, amplitude = 0.2) {
    const originalY = mesh.position.y;
    const time = Math.random() * Math.PI * 2;
    
    return () => {
        mesh.position.y = originalY + Math.sin(Date.now() * 0.001 * speed + time) * amplitude;
        mesh.rotation.y += 0.005;
    };
}

// Fungsi untuk membuat rotate animation
function createRotateAnimation(mesh, speed = 0.01) {
    return () => {
        mesh.rotation.y += speed;
    };
}

// Resize handler untuk semua renderer
function handleResize(camera, renderer) {
    const container = renderer.domElement.parentElement;
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// Export semua fungsi
window.ThreeSetup = {
    init: initThreeJS,
    lights: setupLights,
    helpers: setupHelpers,
    material: createGlowMaterial,
    text3D: createText3D,
    particles: createParticleSystem,
    glowSphere: createGlowSphere,
    floatAnim: createFloatAnimation,
    rotateAnim: createRotateAnimation,
    resize: handleResize,
    colors: themeColors,
    clock: clock
};

// Contoh penggunaan:
// const { scene, camera, renderer } = ThreeSetup.init('cakeCanvas');
// ThreeSetup.lights(scene);
// const cake = createCake(); // nanti di file cake-3d.js
// scene.add(cake);
