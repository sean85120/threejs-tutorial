import { useEffect } from 'react';

import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import SceneInit from './lib/SceneInit';
import createWall from './lib/createWall';
import createSphere from './lib/createSphere';
import saveScene from './lib/saveScene';
import loadScene from './lib/loadScene';
import createTvMesh from './lib/createTvMesh';
import switchTvScreen from './lib/switchTvScreen';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate_init();

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

    // initialize cannon
    const world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    // test.scene.add(world)

    const cannonDebugger = new CannonDebugger(test.scene, world, {});

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(new CANNON.Vec3(wallWidth, wallDepth)),
    });
    groundBody.position.set(0, -2, 0);
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    groundBody.name = 'groundBody';
    world.addBody(groundBody);

    // initialize gui
    const gui = new GUI();

    // main group
    // const mainGroup = new THREE.Group();
    // mainGroup.position.y = 0.5;
    // mainGroup.name = 'mainGroup';
    // test.scene.add(mainGroup);


    // create wall function
    // const createCustomWall = (image) => {
    //   const wallGeometry = new THREE.BoxGeometry(wallDepth, wallHeight, 0.5);
    //   const wallTexture = new THREE.TextureLoader().load(image);

    //   const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture });
    //   const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

    //   mainGroup.add(wallMesh);

    //   return wallMesh;
    // };

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


        // {"method":"switchTvScreen"}
        if (data.method === 'switchTvScreen') {

          console.log('renderer.domElement: ', renderer.domElement);

          // const switchTvScreen = switchTvScreen();
        }

        // {"method":"listAllObjects"}

        else if (data.method === 'listAllObjects') {

          let count = 0;
          test.scene.traverse(object => {
            if (object.isMesh) {
              console.log(object);
              // localStorage.setItem('object_list', JSON.stringify(object));
              count++;
            }
          });
          console.log('count: ', count);
        }

        // {"method":"createSphere"}

        else if (data.method === 'createSphere') {

          const randomSphereMesh = createSphere({ world: world, scene: test.scene });
          subCamera.lookAt(randomSphereMesh.position);

        }

        // {"method":"saveScene"}
        else if (data.method === 'saveScene') {

          saveScene({ scene: test.scene, world: world });
        }

        // {"method":"loadScene"}
        else if (data.method === 'loadScene') {
          loadScene({ scene: test.scene, world: world });
          const tvVideoMaterial = createTvMesh({ scene: test });

        }

        // else if (data.method === 'createTvMesh') {
        //   createTvMesh({ scene: test });

        // }
      };
    } catch (error) { console.log(error); };


    // walls img
    const wall_news_anchor_img = '/src/assets/walls_news_anchor.jpeg';

    // left wall
    const wallBody1 = createWall(wall_news_anchor_img, { world: world, scene: test.scene });
    wallBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
    wallBody1.position.set(-positionX, positionY, 0)
    wallBody1.name = 'leftWallBody';

    // right wall
    const wallBody2 = createWall(wall_news_anchor_img, { world: world, scene: test.scene });
    wallBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2);
    wallBody2.position.set(positionX, positionY, 0)
    wallBody2.name = 'rightWallBody';

    // backwall
    const wallBody3 = createWall(wall_news_anchor_img, { world: world, scene: test.scene });
    wallBody3.position.set(0, positionY, positionZ)
    wallBody3.name = 'backWallBody';

    // set up ground
    const groundGeometry = new THREE.PlaneGeometry(wallWidth, wallDepth);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.position.set(0, -2, 0);

    groundMesh.name = 'groundMesh';
    test.scene.add(groundMesh);

    // set up background
    const bgBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Box(new CANNON.Vec3(wallWidth / 2, wallHeight / 2, 0.5)),
    });

    bgBody.position.set(0, positionY, -positionZ);
    bgBody.name = 'bgBody';
    world.addBody(bgBody);

    const bgGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, 0.5);
    const bgTexture = new THREE.TextureLoader().load('/src/assets/news_anchor.jpeg');
    const bgMaterial = new THREE.MeshPhongMaterial({ map: bgTexture, });

    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);

    bgMesh.name = 'backgroundMesh';
    test.scene.add(bgMesh);

    // set up wall
    const wallGeometry = new THREE.BoxGeometry(wallDepth, wallHeight, 0.5);
    const wallTetxture = new THREE.TextureLoader().load(wall_news_anchor_img);
    const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTetxture });

    // set up ceiling
    const ceilingBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Box(new CANNON.Vec3(wallWidth / 2, 1, wallDepth / 2)),
    })
    ceilingBody.position.set(0, 22, 0);
    ceilingBody.name = 'ceilingBody';
    world.addBody(ceilingBody);

    const ceilingGeometry = new THREE.BoxGeometry(wallWidth, 0.5, wallDepth);

    const ceilingMesh = new THREE.Mesh(ceilingGeometry, wallMaterial);

    ceilingMesh.name = 'ceilingMesh';
    test.scene.add(ceilingMesh);

    // set up video geometry

    const box_test = new THREE.BoxGeometry(1, 1, 1);

    const video = document.getElementById('video_test');
    const texture = new THREE.VideoTexture(video);

    // texture.minFilter = THREE.LinearFilter;
    // texture.magFilter = THREE.LinearFilter;

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

    // mainGroup.add(videoMesh);


    // GLTF model loader
    const modelLoader = new GLTFLoader();
    modelLoader.load('/src/assets/ocarina_of_time_link.glb', function (gltf) {
      gltf.scene.scale.set(0.2, 0.2, 0.2);

      const scaledModel = gltf.scene;
      scaledModel.position.set(0, -2, 0);
      scaledModel.castShadow = true;

      scaledModel.name = 'link';
      // mainGroup.add(scaledModel);

    });

    // create tv screen

    const tvVideoMaterial = createTvMesh({ scene: test });
    // const tvGeometry = new THREE.BoxGeometry(20, 9, 0.5);
    // const mainCamera = test.renderer.domElement;
    // const mainCameratexture = new THREE.Texture(mainCamera);
    // const tvVideoMaterial = new THREE.MeshBasicMaterial({ map: mainCameratexture, side: THREE.DoubleSide, toneMapped: false });

    // const tvVideoMesh = new THREE.Mesh(tvGeometry, tvVideoMaterial);
    // tvVideoMesh.name = 'tvVideoMesh';

    // tvVideoMesh.position.set(9.2, positionY + 1.9, -positionZ + 0.1)

    // test.scene.add(tvVideoMesh);

    // const tvMeshJson = JSON.stringify(test.scene.children[2]);

    console.log('scene children:', test.scene.children);

    // add sphere mesh
    const radius = 1;
    const sphereGeometry = new THREE.SphereGeometry(radius);
    const sphereMaterial = new THREE.MeshBasicMaterial({});

    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.castShadow = true;

    sphereMesh.name = 'sphereMesh';
    test.scene.add(sphereMesh);

    // add sphere body
    const sphereBody = new CANNON.Body({
      mass: 5,
      shape: new CANNON.Sphere(radius),
    })

    sphereBody.id = sphereMesh.uuid;
    sphereBody.name = 'sphereBody';
    sphereBody.position.set(0, 10, 1);
    world.addBody(sphereBody);

    // add box mesh
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshBasicMaterial({});
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.castShadow = true;
    boxMesh.name = 'boxMesh';
    test.scene.add(boxMesh);

    // add box body
    const boxBody = new CANNON.Body({
      mass: 5,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    });

    boxBody.id = boxMesh.uuid;
    boxBody.name = 'boxBody';
    boxBody.position.set(0, 12, 0);
    world.addBody(boxBody);

    // set up ambient light
    const al = new THREE.AmbientLight(0xffffff, 0.5);
    al.name = 'ambientLight';
    test.scene.add(al);

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
    dl.name = 'directionalLight';
    test.scene.add(dl);
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
    sl.name = 'spotLight'
    test.scene.add(sl);

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

    // console.log('scene children length:', test.scene.children)

    // for (let i = 0; i < test.scene.children.length; i++) {
    //   console.log('scene children:', test.scene.children[i])
    // }

    console.log('world', world)

    // for (let i = 0; i < world.bodies.length; i++) {
    //   console.log('world children:', world.bodies[i])
    // }

    //  animate function
    const animate = () => {

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
      test.camera.lookAt(0, 0, 0);
      subCamera.lookAt(boxMesh.position);

      window.requestAnimationFrame(animate);
    }

    const updateVideoTexture = () => {

      // // define the camera limits
      // const minCameraPosition = new THREE.Vector3(0, 0, 0);
      // const maxCameraPosition = new THREE.Vector3(50, 25, 50);

      // // position limits
      // test.camera.position.clamp(minCameraPosition, maxCameraPosition);

      test.controls.update();
      texture.needsUpdate = true;

    }

    // const saveScene = () => {

    //   // save three objects
    //   // test.controls.detach();
    //   test.scene.remove(test.controls);
    //   test.scene.updateMatrixWorld();
    //   const exporter = test.scene.toJSON();
    //   const sceneJson = JSON.stringify(exporter);
    //   localStorage.setItem('scene', sceneJson);

    //   // const blob = new Blob([sceneJson], { type: 'application/json' });
    //   // saveAs(blob, 'scene.json');

    //   // save cannon objects
    //   const cannonBodies = [];

    //   // console.log('world.bodies: ', world.bodies);
    //   world.bodies.forEach((body) => {
    //     const cannonBody = {
    //       uuid: body.uuid,
    //       type: body.type,
    //       name: body.name,
    //       mass: body.mass,
    //       position: body.position.toArray(),
    //       quaternion: body.quaternion.toArray(),
    //       velocity: body.velocity.toArray(),
    //       angularVelocity: body.angularVelocity.toArray(),
    //     };

    //     cannonBodies.push(cannonBody);
    //   })

    //   const cannonWorld = {
    //     bodies: cannonBodies,
    //   }

    //   localStorage.setItem('cannon', JSON.stringify(cannonWorld));
    //   console.log('cannonWorld: ', world);

    // }

    animate();
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
