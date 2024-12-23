import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';

let camera, scene, renderer;
let meshes = [];
let rotationSpeeds = [];

init();

function init() {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    scene = new THREE.Scene();

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    light.castShadow = true;
    scene.add(light);

    for (let i = 0; i < 2000; i++) {
        // ランダムな半径を生成
        const radius = Math.random() * 0.01; // 0.01 から 0.05 の間
        const widthSegments = 8; // 分割数（8以上を推奨）
        const heightSegments = 6;
    
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, widthSegments, heightSegments), // 修正
            new THREE.MeshNormalMaterial()
        );
        mesh.position.set(
            (Math.random() - 0.5) * 2, // 位置を調整
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
    
        const rotationSpeed = {
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2,
            z: (Math.random() - 0.5) * 0.2,
        };
    
        mesh.castShadow = true; // 影を落とす設定
        scene.add(mesh);
        meshes.push(mesh); // 配列に保存
        rotationSpeeds.push(rotationSpeed); // 回転速度を保存
    }

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // 影を有効化
    renderer.setAnimationLoop(animation);
    document.body.appendChild(renderer.domElement);

    renderer.setClearColor(0xffffff, 1); 
}

function animation() {
    camera.position.z += -0.01; // カメラを奥に移動

    meshes.forEach((mesh, index) => {
        mesh.rotation.x += rotationSpeeds[index].x;
        mesh.rotation.y += rotationSpeeds[index].y;
        mesh.rotation.z += rotationSpeeds[index].z;
    });

    renderer.render(scene, camera);
}
