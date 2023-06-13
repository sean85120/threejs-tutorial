import { useEffect } from 'react';

import * as THREE from 'three';
import { GUI } from 'dat.gui';

import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import SceneInit from './lib/SceneInit';
import createWall from './lib/createWall';
import createSphere from './lib/createSphere';
import saveScene from './lib/saveScene';
import switchTvScreen from './lib/switchTvScreen';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    const aspect = window.innerWidth / window.innerHeight;

    const insetWidth = window.innerWidth / 4;
    const insetHeight = window.innerHeight / 4;

    // subCamera
    const subCamera = new THREE.PerspectiveCamera(
      45,
      aspect,
      1,
      500
    );

    subCamera.position.z = 20;
    subCamera.position.y = 5;

    // const
    const wallHeight = 25;
    const wallWidth = 50;
    const wallDepth = 50;

    const positionY = 10;
    const positionX = wallWidth / 2;
    const positionZ = wallDepth / 2;

    let wallMesh;

    // initialize cannon
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(new CANNON.Vec3(wallWidth, wallDepth)),
    });
    groundBody.position.set(0, -1.5, 0);

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);

    // add spherebody
    const radius = 1;
    const sphereBody = new CANNON.Body({
      mass: 5,
      shape: new CANNON.Sphere(radius),
    })

    sphereBody.position.set(0, 10, 0);
    world.addBody(sphereBody);

    // add sphere mesh
    const sphereGeometry = new THREE.SphereGeometry(radius);
    const sphereMaterial = new THREE.MeshBasicMaterial({});

    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.castShadow = true;
    test.scene.add(sphereMesh);

    const cannonDebugger = new CannonDebugger(test.scene, world, {});

    // add boxbody
    const boxBody = new CANNON.Body({
      mass: 5,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    });

    boxBody.position.set(1, 12, 0);
    world.addBody(boxBody);

    // add box mesh
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshBasicMaterial({});
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.castShadow = true;
    test.scene.add(boxMesh);

    // initialize gui
    const gui = new GUI();

    // main group
    const mainGroup = new THREE.Group();
    mainGroup.position.y = 0.5;
    test.scene.add(mainGroup);

    // create wall function
    const createCustomWall = (image) => {
      const wallGeometry = new THREE.BoxGeometry(wallDepth, wallHeight, 0.5);
      const wallTexture = new THREE.TextureLoader().load(image);

      const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture });
      const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

      mainGroup.add(wallMesh);

      return wallMesh;
    };

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

          console.log('renderer.domElement: ', renderer.domElement);

          // const switchTvScreen = switchTvScreen();
        }

        // {"method":"listAllObjects"}

        else if (data.method === 'listAllObjects') {
          test.scene.traverse(object => {
            if (object.isMesh) {
              console.log(object);
              localStorage.setItem('object_list', JSON.stringify(object));
            }
          });
        }

        // {"method":"createSphere"}

        else if (data.method === 'createSphere') {

          for (let i = 0; i < 10; i++) {
            const randomSphereMesh = createSphere({ world: world, scene: test.scene });

            subCamera.lookAt(randomSphereMesh.position);
          }
        }

        // {"method":"saveScene"}
        else if (data.method === 'saveScene') {
          const sceneScene = saveScene({ scene: test.scene });
        }

      };
    } catch (error) { console.log(error); };


    // walls img
    const wall_news_anchor_img = '/src/assets/walls_news_anchor.jpeg';

    // left wall
    const wallBody1 = createWall(wall_news_anchor_img, { world: world }, { group: mainGroup });
    wallBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    wallBody1.position.x = -positionX;
    wallBody1.position.y = positionY;

    wallBody1.name = 'leftWall';

    // mainGroup.add(wallBody);

    // right wall
    const wallBody2 = createWall(wall_news_anchor_img, { world: world }, { group: mainGroup });
    wallBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
    wallBody2.position.x = positionX;
    wallBody2.position.y = positionY;

    wallBody2.name = 'rightWall';

    // mainGroup.add(wallBody);

    // backwall
    const wallBody3 = createWall(wall_news_anchor_img, { world: world }, { group: mainGroup });
    wallBody3.position.y = positionY;
    wallBody3.position.z = positionZ;
    wallBody3.name = 'backWall';
    // mainGroup.add(wallBody3);

    // set up ground
    const groundGeometry = new THREE.PlaneGeometry(wallWidth, wallDepth);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.position.y = -2;

    groundMesh.name = 'ground';
    mainGroup.add(groundMesh);

    // set up background
    const bgBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Box(new CANNON.Vec3(wallWidth / 2, wallHeight / 2, 0.5)),
    });

    bgBody.position.set(0, positionY, -positionZ);
    world.addBody(bgBody);

    const bgGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, 0.5);
    const bgTexture = new THREE.TextureLoader().load('/src/assets/news_anchor.jpeg');
    const bgMaterial = new THREE.MeshPhongMaterial({ map: bgTexture, });

    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);

    // bgMesh.rotation.x = -Math.PI / 2;

    // bgGeometry.position.set(0, positionY, -positionZ)
    bgMesh.name = 'background';
    mainGroup.add(bgMesh);

    // set up walls
    const wallGeometry = new THREE.BoxGeometry(wallDepth, wallHeight, 0.5);
    const wallTetxture = new THREE.TextureLoader().load(wall_news_anchor_img);
    const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTetxture });

    // set up ceiling
    const ceilingBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Box(new CANNON.Vec3(wallWidth / 2, 1, wallDepth / 2)),
    })

    // ceilingBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    ceilingBody.position.set(0, 22, 0);

    world.addBody(ceilingBody);

    const ceilingGeometry = new THREE.BoxGeometry(wallWidth, 0.5, wallDepth);

    const ceilingMesh = new THREE.Mesh(ceilingGeometry, wallMaterial);

    // ceilingMesh.rotation.x = Math.PI / 2;

    // ceilingMesh.position.y = 22;
    ceilingMesh.name = 'ceiling';

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
    videoMesh.name = 'videoMesh';

    mainGroup.add(videoMesh);

    // create tv screen
    const tvGeometry = new THREE.BoxGeometry(20, 9, 0.5);
    // const video2 = document.getElementById('video_test2');

    // if (video2.muted) {
    //   console.log('play');
    //   video2.play();
    // }

    // const videoMaterial2 = new THREE.MeshPhongMaterial({ map: texture2, side: THREE.DoubleSide, toneMapped: false });
    const tvVideoMaterial = new THREE.MeshBasicMaterial();
    const tvVideoMesh = new THREE.Mesh(tvGeometry, tvVideoMaterial);

    tvVideoMesh.position.set(9.2, positionY + 1.9, -positionZ + 0.1)

    tvVideoMesh.name = 'tvVideoMesh';

    mainGroup.add(tvVideoMesh);


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
    // alFolder.open();

    // setup directional light + helper
    const dl = new THREE.DirectionalLight(0xffffff, 0.5);
    // use this for YouTube thumbnail
    dl.position.set(0, 40, 40);
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
    // dlFolder.open();

    // set up spot light + helper
    const sl = new THREE.SpotLight(0x00ff00, 1, 8, Math.PI / 8, 0);
    sl.position.set(0, 2, 2);
    const slHelper = new THREE.SpotLightHelper(sl);
    mainGroup.add(sl);

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
    // slFolder.open();

    // resize window function
    const onWindowResize = () => {
      test.camera.aspect = window.innerWidth / window.innerHeight;
      test.camera.updateProjectionMatrix();

      test.renderer.setSize(window.innerWidth, window.innerHeight);

      subCamera.aspect = insetWidth / insetHeight;

      subCamera.updateProjectionMatrix();

    };

    var move = 0.05

    //  animate function
    const animate2 = () => {

      world.fixedStep();

      cannonDebugger.update();
      boxMesh.position.copy(boxBody.position);
      boxMesh.quaternion.copy(boxBody.quaternion);

      sphereMesh.position.copy(sphereBody.position);
      sphereMesh.quaternion.copy(sphereBody.quaternion);
      // groundMesh.position.copy(groundBody.position);
      groundMesh.quaternion.copy(groundBody.quaternion);
      ceilingMesh.position.copy(ceilingBody.position);
      ceilingMesh.quaternion.copy(ceilingBody.quaternion);

      bgMesh.position.copy(bgBody.position);
      bgMesh.quaternion.copy(bgBody.quaternion);

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
      test.renderer.render(test.scene, subCamera);

      tvVideoMaterial.map.needsUpdate = true;

      test.stats.update();

      // // camera movement

      // camera.position.x += move;
      // camera.position.z -= move;

      // if (camera.position.x <= 0 || camera.position.x >= 10) {
      //   move = -move;
      // }

      // camera look at
      test.camera.lookAt(mainGroup.position);
      subCamera.lookAt(boxMesh.position);

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



    return () => {
      // Destroy the GUI
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
