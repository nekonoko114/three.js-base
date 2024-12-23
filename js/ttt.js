import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.167.0/build/three.module.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.167.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.167.0/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.167.0/examples/jsm/controls/OrbitControls.js';

// シーンとカメラ、レンダラーのセットアップ
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);

const canvas = document.getElementById('mymyCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // 解像度を適切に設定

// CSSでCanvasのスタイルを設定
canvas.style.display = 'block';
canvas.style.width = '100%';
canvas.style.height = '100%';

// 照明
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// フォントのロード
const fontLoader = new FontLoader();
fontLoader.load(
  './helvetiker_regular.typeface.json',
  (font) => {
    console.log('フォントがロードされました:', font);

    const textGeometry = new TextGeometry('Genesis. LLC', {
      font: font,
      size: 1,
      depth: 0.2,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 5,
    });

    textGeometry.computeBoundingBox();
    const centerOffsetX = (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) / 2;
    const centerOffsetY = (textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) / 2;
    textGeometry.translate(-centerOffsetX, -centerOffsetY, 0);

    const textMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000, // 塗りつぶしの色（透明にするので見えない）
        transparent: true,
        opacity: 0.5, // 不透明度を設定
        });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    scene.add(textMesh);

     // アウトラインを作成
     const edges = new THREE.EdgesGeometry(textGeometry);
     const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 }); // アウトラインの色
     const outlineMesh = new THREE.LineSegments(edges, outlineMaterial);
     scene.add(outlineMesh);
  },
  undefined,
  (err) => {
    console.error('フォントのロード中にエラーが発生しました:', err);
  }
);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio); // 解像度を再調整
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
