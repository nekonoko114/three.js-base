import * as THREE from "three";

// ページの読み込みを待ってから実行
window.addEventListener("DOMContentLoaded", init);

function init() {

  // 描画サイズ
  const width = window.innerWidth;
  const height = window.innerHeight;

  // 背景色
  const bgColor = 0x251D3A;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#canvas"),
    antialias: true,
    devicePixelRatio: window.devicePixelRatio,
  });
  renderer.setSize(width, height);
  renderer.setClearColor(bgColor);

  // シーンを作成
  const scene = new THREE.Scene();

  // 光源
  scene.add(new THREE.DirectionalLight(0xffffff, 3)); // 平行光源
  scene.add(new THREE.AmbientLight(0xeeeeee, 1)); // 環境光源  

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height); // 視野角, アスペクト比
  camera.position.set(0, 0, +500); // カメラ位置のX座標, Y座標, Z座標



  // // 生成するオブジェクトの設定
  // const geometry = new THREE.SphereGeometry(100, 32, 32);
  // const material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
  
  // // オブジェクトをシーンに追加
  // const sphere = new THREE.Mesh(geometry, material);
  // scene.add(sphere);



  // グループを作成
  const group = new THREE.Group();
  scene.add(group);

  

  function getRandomPastelColor() {
    // ランダムなRGB値を生成（パステル系のために値を明るめに設定）
    const r = Math.random() * 0.5 + 0.5; // 0.5〜1.0の範囲
    const g = Math.random() * 0.5 + 0.5; // 0.5〜1.0の範囲
    const b = Math.random() * 0.5 + 0.5; // 0.5〜1.0の範囲

    return new THREE.Color(r, g, b);
}

  // パーティクル用のオブジェクトの設定
  const geometry = new THREE.SphereGeometry(3, 32, 32);
  const material = new THREE.MeshLambertMaterial({ color: getRandomPastelColor() });

  // Box型のジオメトリの頂点座標を取得する（最初の形）
  const firstGeometry = new THREE.BoxGeometry(200, 200, 200, 10, 10, 10);
  const firstMesh = new THREE.Mesh(firstGeometry, material);
  const firstPos = firstMesh.geometry.attributes.position;

  // パーティクルの数
  const meshCount = 726;

  // パーティクルを生成
  for (let i = 0; i < meshCount; i++) {
    const mesh = new THREE.Mesh(geometry, material);

    // 最初の形になるように配置
    mesh.position.x = firstPos.getX(i);
    mesh.position.y = firstPos.getY(i);
    mesh.position.z = firstPos.getZ(i);

    // グループに格納する
    group.add(mesh);
  }


  // フォグを設定
  scene.fog = new THREE.Fog(bgColor, 400, 1500); // 色, 開始距離, 終点距離;



  // ランダムな頂点座標を入れるための配列
  const randomPos = [];

  // ランダムな頂点座標を配列に格納
  for (let i = 0; i < meshCount; i++) {
    const x = (Math.random() - 0.5) * 800;
    const y = (Math.random() - 0.5) * 800;
    const z = (Math.random() - 0.5) * 800;

    const randomPosObj = { x: x, y: y, z: z };

    randomPos.push(randomPosObj);
  }

  // 球型の頂点座標を取得する（２番目の形）
  const secondGeometry = new THREE.SphereGeometry(160, 32, 21);
  const secondMesh = new THREE.Mesh(secondGeometry, material);
  const secondPos = secondMesh.geometry.attributes.position;



  // アニメーション用のパラメータを用意
  const animationParam1 = { value: 0, }; //　最初の形 → ランダム
  const animationParam2 = { value: 0, }; //　ランダム → ２番目の形

  // gsapの設定
  gsap.to(animationParam1, {
    value: 1.0,
    scrollTrigger: {
      trigger: ".scrollAnime1",
      start: "top center",    // trigger要素のどの部分、画面のどの部分
      end: "bottom top",
      scrub: 0.7,
    },
  });

  gsap.to(animationParam2, {
    value: 1.0,
    scrollTrigger: {
      trigger: ".scrollAnime2",
      start: "top center",    // trigger要素のどの部分、画面のどの部分
      end: "bottom top",
      scrub: 0.7,
    },
  });



  // 毎フレーム時に実行されるループイベント
  animate();

  function animate() {
    // アニメーションパラメータの変動に合わせて、パーティクルの位置を変化させる
    if (animationParam1.value <= 1 && animationParam2.value == 0) {
      // 最初の形 → ランダム
      for (let i = 0; i < meshCount; i++) {
        // バラバラに
        group.children[i].position.x = firstPos.getX(i) + randomPos[i].x * animationParam1.value;
        group.children[i].position.y = firstPos.getY(i) + randomPos[i].y * animationParam1.value;
        group.children[i].position.z = firstPos.getZ(i) + randomPos[i].z * animationParam1.value;
      }

    } else if (animationParam2.value <= 1) {
      // ランダム → ２番目の形
      for (let i = 0; i < meshCount; i++) {
        // ↑の変化の最終地点
        const x = firstPos.getX(i) + randomPos[i].x;
        const y = firstPos.getY(i) + randomPos[i].y;
        const z = firstPos.getZ(i) + randomPos[i].z;

        // ２番目の形 との差分
        const dX = secondPos.getX(i) - x;
        const dY = secondPos.getY(i) - y;
        const dZ = secondPos.getZ(i) - z;

        // ２番目の形 に変形
        group.children[i].position.x = x + dX * animationParam2.value;
        group.children[i].position.y = y + dY * animationParam2.value;
        group.children[i].position.z = z + dZ * animationParam2.value;
      }
    }


    // グループを回転させる
    group.rotation.x += -0.001; 
    group.rotation.y += -0.001; 
    group.rotation.z += -0.001; 

    renderer.render(scene, camera); // レンダリング
    requestAnimationFrame(animate);
  }

}