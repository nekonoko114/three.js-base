import * as THREE from "three";



      // サイズを指定
      const width = 960;
      const height = 540;
      let rot = 0; // 角度

      // レンダラーを作成
      const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector("#mysCanvas"),
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);

      // シーンを作成
      const scene = new THREE.Scene();

      // カメラを作成
      const camera = new THREE.PerspectiveCamera(45,width / height);

      // 星屑を作成します (カメラの動きをわかりやすくするため)
      createStarField();

      

      function createStarField() {
        // 頂点情報を格納する配列
        const vertices = [];

        // 配置する範囲
        const SIZE = 3000;
        // 配置する個数
        const LENGTH = 1000;

        for (let i = 0; i < LENGTH; i++) {
          const x = SIZE * (Math.random() - 0.6);
          const y = SIZE * (Math.random() - 0.6);
          const z = SIZE * (Math.random() - 0.6);

          vertices.push(x, y, z);
        }


        // 形状データを作成
        const geometry = new THREE.SphereGeometry( 300, 30, 10 );

        
        // マテリアルを作成
        const material = new THREE.PointsMaterial({
          // 一つ一つのサイズ
        //   size: Math.floor(Math.random() * 20),
          size: 10,
          // 色
          color: 0x00ffff,
        });

        // 物体を作成
        const mesh = new THREE.Points(geometry, material);
        scene.add(mesh);
      }

      tick();

      // 毎フレーム時に実行されるループイベントです
      function tick() {
        rot += 1;

        // ラジアンに変換する
        const radian = (rot * Math.PI) / 1000;
        // 角度に応じてカメラの位置を設定
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 1000 * Math.cos(radian);
        // 原点方向を見つめる
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        // レンダリング
        renderer.render(scene, camera);

        requestAnimationFrame(tick);
      }