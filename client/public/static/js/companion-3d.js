// static/js/companion-3d.js (Final Version with Half-Body Camera)

let scene, camera, renderer, model, mixer, clock;
let actions = {};
let activeAction;
let userActivityTimeout;

function resetUserActivityTimeout() {
    clearTimeout(userActivityTimeout);
    userActivityTimeout = setTimeout(() => {
        playAnimation('Idle');
    }, 5000);
}

document.addEventListener('mousemove', resetUserActivityTimeout);
document.addEventListener('keydown', resetUserActivityTimeout);
document.addEventListener('click', resetUserActivityTimeout);
const avatarCanvas = document.getElementById('avatar-canvas');

const avatarModels = {
    female: {
        idle: '/static/models/female_idle.fbx',
        talking: '/static/models/female_talking.fbx'
    },
    male: {
        idle: '/static/models/male_idle.fbx',
        talking: '/static/models/male_talking.fbx'
    }
};
let currentModelSet = avatarModels.female;
function init3D() {
    // 1. Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // 2. Animation updates ke liye clock
    clock = new THREE.Clock();

    // 3. Camera setup
    camera = new THREE.PerspectiveCamera(50, avatarCanvas.clientWidth / avatarCanvas.clientHeight, 0.1, 1000);
    
    // --- UPDATED: Aur zyada zoom ke liye camera position ---
    camera.position.set(0, 0.6, 2); 
    camera.lookAt(0, 0.6, 0);     
    // camera.position.set(0, 0.3, 1.4); 
    // camera.lookAt(0, 0.3, 0.3);   

    // 4. Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas: avatarCanvas, antialias: true, alpha: true });
    renderer.setSize(avatarCanvas.clientWidth, avatarCanvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    
    // 5. Lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    scene.add(hemisphereLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // 3D Model ko load karein
    loadModel(currentModelSet);
    
    window.addEventListener('resize', onWindowResize, false);
    animate();
}

function loadModel(modelSet) {
    if (model) {
        scene.remove(model);
        actions = {};
    }
    
    const loader = new THREE.FBXLoader();
    console.log(`Attempting to load idle model from: ${modelSet.idle}`);
    loader.load(modelSet.idle, (fbx) => {
        model = fbx;
        
        // --- UPDATED: Half-body view ke liye model ki position aur scale ---
        model.scale.set(0.02, 0.02, 0.02); 
        model.position.y = -2.2;
        scene.add(model);

        // NOTE: Aapke dwara add kiya gaya material replacement code yahan tha.
        // Agar aapko original material/texture nahi dikh rahe, to is line ko uncomment karein.
        window.applyMaterialToModel(window.materials.default);

        mixer = new THREE.AnimationMixer(model);
        
        console.log("Idle FBX animations:", fbx.animations);
        if (fbx.animations[0]) {
            const idleAction = mixer.clipAction(fbx.animations[0]);
            actions['Idle'] = idleAction;
        }
        
        const talkLoader = new THREE.FBXLoader();
        console.log(`Attempting to load talking model from: ${modelSet.talking}`);
        talkLoader.load(modelSet.talking, (talkFbx) => {
            console.log("Talking FBX animations:", talkFbx.animations);
            if (talkFbx.animations[0]) {
                const talkAction = mixer.clipAction(talkFbx.animations[0]);
                actions['Talking'] = talkAction;
                console.log("'Talking' animation added to actions:", actions['Talking']);
            }
            
            console.log("Loaded animations:", Object.keys(actions));
            playAnimation('Idle');
        }, undefined, (error) => {
            console.error(`Talking model load karne mein error aayi:`, error);
        });

    }, undefined, (error) => {
        console.error(`Idle model load karne mein error aayi:`, error);
        alert("3D idle model load nahi ho paya. Console mein error dekhein.");
    });
}

function playAnimation(name) {
    resetUserActivityTimeout();
    console.log(`Attempting to play animation: ${name}`);
    const newAction = actions[name];

    if (!newAction) {
        console.warn(`Animation "${name}" not found in actions.`);
        return;
    }
    if (activeAction === newAction) {
        console.log(`Animation "${name}" is already active.`);
        return;
    }

    if (activeAction) {
        activeAction.fadeOut(0.5);
        console.log(`Fading out previous animation:`, activeAction);
    }
    
    newAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.5).play();
    if (name === 'Talking') {
        newAction.loop = THREE.LoopRepeat;
    } else {
        newAction.loop = THREE.LoopOnce;
    }
    activeAction = newAction;
    console.log(`Successfully started animation: ${name}. Active action:`, activeAction);
}

function isAnimationLoaded(name) {
    return !!actions[name];
}

// Model par material apply karne ke liye function
window.applyMaterialToModel = function(material) {
    if (model) {
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = material;
            }
        });
    }
}

// Example materials
window.materials = {
    default: new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.8, metalness: 0.2 }),
    redSkin: new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.7, metalness: 0.1 }),
    blueOutfit: new THREE.MeshStandardMaterial({ color: 0x0000ff, roughness: 0.6, metalness: 0.3 })
};

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (mixer) {
        mixer.update(delta);
    }
    renderer.render(scene, camera);
}

function onWindowResize() {
    if (camera && renderer && avatarCanvas) {
        camera.aspect = avatarCanvas.clientWidth / avatarCanvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(avatarCanvas.clientWidth, avatarCanvas.clientHeight);
    }
}

function setAvatarModel(gender) {
    if (avatarModels[gender]) {
        currentModelSet = avatarModels[gender];
        if (scene) {
            loadModel(currentModelSet);
        }
    }
}

function startAvatar() {
    if (!scene) init3D();
    avatarCanvas.style.display = 'block';
    onWindowResize();
}

function stopAvatar() {
    if (avatarCanvas) avatarCanvas.style.display = 'none';
}

// Function to load custom GLB models
function loadCustomModel(file) {
    if (model) {
        scene.remove(model);
        model = null;
        mixer = null;
        actions = {};
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const contents = event.target.result;
        const loader = new THREE.GLTFLoader();
        loader.parse(contents, '', (gltf) => {
            model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed for GLB models
            model.position.y = -1.2; // Adjust position as needed
            scene.add(model);

            mixer = new THREE.AnimationMixer(model);
            resetUserActivityTimeout();
            if (gltf.animations && gltf.animations.length > 0) {
                gltf.animations.forEach((clip) => {
                    const action = mixer.clipAction(clip);
                    actions[clip.name] = action;
                });
                // Attempt to play the first animation found, or a specific one if named 'Idle'
                if (actions['Idle']) {
                    playAnimation('Idle');
                } else if (gltf.animations[0]) {
                    playAnimation(gltf.animations[0].name);
                }
            } else {
                console.warn("Custom model has no animations.");
            }
            console.log("Custom GLB model loaded successfully:", model);
        }, (error) => {
            console.error("Error parsing GLB model:", error);
            alert("Custom GLB model parse nahi ho paya. Console mein error dekhein.");
        });
    };
    reader.readAsArrayBuffer(file);
}

// Expose functions to the global scope if needed by companion-ui.js
window.setAvatarModel = setAvatarModel;
window.startAvatar = startAvatar;
window.stopAvatar = stopAvatar;
window.loadCustomModel = loadCustomModel;
window.isAnimationLoaded = isAnimationLoaded;

function resetToDefaultModel(gender) {
    if (avatarModels[gender]) {
        currentModelSet = avatarModels[gender];
        if (scene) {
            loadModel(currentModelSet);
        }
    } else {
        console.error(`Default model set not found for gender: ${gender}`);
    }
}

window.resetToDefaultModel = resetToDefaultModel;