import { useEffect } from 'react';

import * as THREE from 'three';
import { GUI } from 'dat.gui';

import SceneInit from './lib/SceneInit';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    const aspect = window.innerWidth / window.innerHeight;

    const insetWidth = window.innerWidth / 4;
    const insetHeight = window.innerHeight / 4;

    // tvCamera
    const tvCamera = new THREE.PerspectiveCamera(
      45,
      aspect,
      1,
      1000
    );

    tvCamera.position.z = 5;
    tvCamera.position.y = 5;

    tvCamera.lookAt(0, 0, 2);

    // initialize gui
    const gui = new GUI();

    // main group
    const mainGroup = new THREE.Group();
    mainGroup.position.y = 0.5;
    test.scene.add(mainGroup);

    // const
    const wallHeight = 25;
    const wallWidth = 50;
    const wallDepth = 50;

    const positionY = 10;
    const positionX = wallWidth / 2;
    const positionZ = wallDepth / 2;

    let wallMesh;

    // create wall function
    const createCustomWall = (image) => {
      const wallGeometry = new THREE.BoxGeometry(wallDepth, wallHeight, 0.5);
      const wallTexture = new THREE.TextureLoader().load(image);

      const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture });
      const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

      // console.log(`createWall: ${image}`);
      mainGroup.add(wallMesh);

      return wallMesh;
    };

    // create box
    const createBox = () => {
      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

      const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

      return boxMesh;
    }

    // create websocket connection
    try {
      const ws = new WebSocket('ws://localhost:9999');

      ws.onopen = () => {
        console.log('ws connected');
      };

      ws.onmessage = (message) => {
        console.log(message.data);
        const data = JSON.parse(message.data);
        console.log(data.method);
        // {"method":"createWall", "params":{"image":"./src/assets/walls_news_anchor.jpeg"}}

        if (data.method === 'createWall') {
          const image = data.params.image;
          const wallMesh = createCustomWall(image);
        }

        // {"method":"switchTvScreen"}

        else if (data.method === 'switchTvScreen') {
          // const camera = data.params.camera;

          console.log('renderer.domElement: ', renderer.domElement);

          // const switchTvScreen = switchTvScreen();
        }
      };
    } catch (error) { console.log(error); };

    //  switch camera to tv camera screen 

    const switchTvScreen = () => {
      console.log('renderer.domElement: ', renderer.domElement);

      const sideCamera = renderer.domElement;
      console.log('sideCamera: ', sideCamera);
      tvVideoMaterial.map = new THREE.Texture(sideCamera);

    }

    // create wall function
    const createWall = (image) => {
      const wallGeometry = new THREE.BoxGeometry(wallDepth, wallHeight, 0.5);
      const wallTexture = new THREE.TextureLoader().load(image);

      const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture });
      const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

      // console.log(`createWall: ${image}`);
      return wallMesh;
    };

    // left wall
    wallMesh = createWall('/src/assets/walls_news_anchor.jpeg');
    wallMesh.rotation.y = Math.PI / 2;
    wallMesh.position.x = -positionX;
    wallMesh.position.y = positionY;

    mainGroup.add(wallMesh);

    // right wall
    wallMesh = createWall('/src/assets/walls_news_anchor.jpeg');
    wallMesh.rotation.y = Math.PI / 2;
    wallMesh.position.x = positionX;
    wallMesh.position.y = positionY;

    mainGroup.add(wallMesh);

    // backwall
    wallMesh = createWall('/src/assets/walls_news_anchor.jpeg');
    wallMesh.position.z = positionZ;
    wallMesh.position.y = positionY;

    mainGroup.add(wallMesh);

    // set up ground
    const groundGeometry = new THREE.BoxGeometry(wallWidth, 0.5, wallDepth);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.position.y = -2;
    mainGroup.add(groundMesh);

    // set up background
    const bgGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, 0.5);
    const bgTexture = new THREE.TextureLoader().load('/src/assets/news_anchor.jpeg');
    const bgMaterial = new THREE.MeshPhongMaterial({ map: bgTexture, });

    // side: THREE.DoubleSide
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);

    // bgMesh.rotation.x = -Math.PI / 2;
    bgMesh.position.z = -positionZ;
    bgMesh.position.y = positionY;
    mainGroup.add(bgMesh);

    // set up walls
    const wallGeometry = new THREE.BoxGeometry(wallDepth, wallHeight, 0.5);
    const wallTetxture = new THREE.TextureLoader().load('/src/assets/walls_news_anchor.jpeg');
    const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTetxture });

    // left wall
    const leftWallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

    leftWallMesh.rotation.y = Math.PI / 2;
    leftWallMesh.position.x = -positionX;
    leftWallMesh.position.y = positionY;

    // right wall
    const rightWallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

    rightWallMesh.rotation.y = Math.PI / 2;
    rightWallMesh.position.x = positionX;
    rightWallMesh.position.y = positionY;

    // back wall
    // const backwallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, 0.5);
    const backWallMesh = new THREE.Mesh(bgGeometry, wallMaterial);

    backWallMesh.position.z = positionZ;
    backWallMesh.position.y = positionY;

    // mainGroup.add(leftWallMesh);
    // mainGroup.add(rightWallMesh);
    // mainGroup.add(backWallMesh);

    // set up ceiling
    const ceilingGeometry = new THREE.BoxGeometry(wallWidth, 0.5, wallDepth);

    const ceilingMesh = new THREE.Mesh(ceilingGeometry, wallMaterial);

    // ceilingMesh.rotation.x = Math.PI / 2;

    ceilingMesh.position.y = 22;

    mainGroup.add(ceilingMesh);

    // set up video geometry

    const box_test = new THREE.BoxGeometry(1, 1, 1);

    const video = document.getElementById('video_test');
    const texture = new THREE.VideoTexture(video);

    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // const TextureLoader = new THREE.TextureLoader();
    // const texture = TextureLoader.load('/src/assets/in.mp4');

    const videoMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide,
      toneMapped: false
    });

    const videoMesh = new THREE.Mesh(box_test, videoMaterial);
    videoMesh.position.z = 2;
    videoMesh.castShadow = true;

    mainGroup.add(videoMesh);

    // set up red box mesh
    const bg1 = new THREE.BoxGeometry(1, 1, 1);
    const bm1 = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const boxMesh1 = new THREE.Mesh(bg1, bm1);
    boxMesh1.castShadow = true;
    boxMesh1.position.x = -2;
    mainGroup.add(boxMesh1);

    // set up green box mesh
    const bg2 = new THREE.BoxGeometry(1, 1, 1);
    const bm2 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const boxMesh2 = new THREE.Mesh(bg2, bm2);
    boxMesh2.castShadow = true;
    boxMesh2.position.x = 0;
    mainGroup.add(boxMesh2);

    // set up blue box mesh
    const bg3 = new THREE.BoxGeometry(1, 1, 1);
    const bm3 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    const boxMesh3 = new THREE.Mesh(bg3, bm3);
    boxMesh3.castShadow = true;
    boxMesh3.position.x = 2;
    mainGroup.add(boxMesh3);


    // create tv screen
    const tvGeometry = new THREE.BoxGeometry(20, 9, 0.5);

    // const video2 = document.getElementById('video_test2');

    // if (video2.muted) {
    //   console.log('play');
    //   video2.play();
    // }

    // const videoMaterial2 = new THREE.MeshPhongMaterial({ map: texture2, side: THREE.DoubleSide, toneMapped: false });
    const tvVideoMaterial = new THREE.MeshBasicMaterial();

    const videoMesh2 = new THREE.Mesh(tvGeometry, tvVideoMaterial);

    videoMesh2.position.set(9.2, positionY + 1.9, -positionZ + 0.1)

    mainGroup.add(videoMesh2);


    const mainCamera = test.renderer.domElement;
    tvVideoMaterial.map = new THREE.Texture(mainCamera);

    // set up ambient light
    const al = new THREE.AmbientLight(0xffffff, 0.5);
    mainGroup.add(al);

    // set up ambient light gui
    const alFolder = gui.addFolder('ambient light');
    const alSettings = { color: al.color.getHex() };
    alFolder.add(al, 'visible');
    alFolder.add(al, 'intensity', 0, 1, 0.1);
    alFolder
      .addColor(alSettings, 'color')
      .onChange((value) => al.color.set(value));
    alFolder.open();

    // setup directional light + helper
    const dl = new THREE.DirectionalLight(0xffffff, 0.5);
    // use this for YouTube thumbnail
    dl.position.set(0, 2, 2);
    // dl.position.set(0, 2, 0);
    dl.castShadow = true;
    const dlHelper = new THREE.DirectionalLightHelper(dl, 3);
    mainGroup.add(dl);
    // mainGroup.add(dlHelper);

    // set up directional light gui
    const dlSettings = {
      visible: true,
      color: dl.color.getHex(),
    };
    const dlFolder = gui.addFolder('directional light');
    dlFolder.add(dlSettings, 'visible').onChange((value) => {
      dl.visible = value;
      dlHelper.visible = value;
    });
    dlFolder.add(dl, 'intensity', 0, 1, 0.25);
    dlFolder.add(dl.position, 'y', 1, 4, 0.5);
    dlFolder.add(dl, 'castShadow');
    dlFolder
      .addColor(dlSettings, 'color')
      .onChange((value) => dl.color.set(value));
    dlFolder.open();

    // set up spot light + helper
    const sl = new THREE.SpotLight(0x00ff00, 1, 8, Math.PI / 8, 0);
    sl.position.set(0, 2, 2);
    const slHelper = new THREE.SpotLightHelper(sl);
    mainGroup.add(sl, slHelper);

    // set up spot light gui
    const slSettings = {
      visible: true,
    };
    const slFolder = gui.addFolder('spot light');
    slFolder.add(slSettings, 'visible').onChange((value) => {
      sl.visible = value;
      slHelper.visible = value;
    });
    slFolder.add(sl, 'intensity', 0, 4, 0.5);
    slFolder.add(sl, 'angle', Math.PI / 16, Math.PI / 2, Math.PI / 16);
    slFolder.add(sl, 'castShadow');
    slFolder.open();

    // resize window function
    const onWindowResize = () => {
      test.camera.aspect = window.innerWidth / window.innerHeight;
      test.camera.updateProjectionMatrix();

      test.renderer.setSize(window.innerWidth, window.innerHeight);

      tvCamera.aspect = insetWidth / insetHeight;

      tvCamera.updateProjectionMatrix();

    };

    var move = 0.05

    //  animate function
    const animate2 = () => {

      test.camera.updateProjectionMatrix();

      // camera 1
      test.renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
      test.renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
      test.renderer.setScissorTest(true);
      test.renderer.render(test.scene, test.camera);

      // camera 2

      test.renderer.setViewport(
        window.innerWidth - insetWidth - 50,
        window.innerHeight - insetHeight - 50,
        insetWidth,
        insetHeight
      );

      test.renderer.setScissor(
        window.innerWidth - insetWidth - 50,
        window.innerHeight - insetHeight - 50,
        insetWidth,
        insetHeight
      );

      test.renderer.setScissorTest(true);
      test.renderer.render(test.scene, tvCamera);

      tvVideoMaterial.map.needsUpdate = true;

      test.stats.update();

      videoMesh.rotation.y -= 1;

      // // camera movement

      // camera.position.x += move;
      // camera.position.z -= move;

      // // console.log(`${camera.position.x}`)

      // if (camera.position.x <= 0 || camera.position.x >= 10) {
      //   move = -move;
      // }

      test.camera.lookAt(mainGroup.position);

      window.requestAnimationFrame(animate2);
    }

    const updateVideoTexture = () => {

      // // define the camera limits
      // const minCameraPosition = new THREE.Vector3(-100, 0, -100);
      // const maxCameraPosition = new THREE.Vector3(100, 100, 100);

      // // position limits
      // camera.position.clamp(minCameraPosition, maxCameraPosition);

      test.controls.update();
      texture.needsUpdate = true;

    }

    animate2();
    onWindowResize();
    updateVideoTexture();

    // Destroy the GUI on reload to prevent multiple stale UI from being displayed on screen.
    return () => {
      gui.destroy();
    };
  }, []);

  return (
    <div>
      <canvas id="myThreeJsCanvas" />
    </div>
  );
}

export default App;
