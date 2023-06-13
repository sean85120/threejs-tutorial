import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// create wall function
export default function createWall(image, { world }, { group }) {

    // const
    const wallHeight = 25;
    const wallWidth = 50;
    const wallDepth = 50;

    const positionY = 10;
    const positionX = wallWidth / 2;
    const positionZ = wallDepth / 2;

    // wall body
    const wallBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(wallDepth / 2, wallHeight / 2, 0.5)),
    });

    world.addBody(wallBody);

    const wallGeometry = new THREE.BoxGeometry(wallDepth, wallHeight, 0.5);
    const wallTexture = new THREE.TextureLoader().load(image);

    const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture });
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

    group.add(wallMesh);

    const action = () => {
        world.fixedStep();

        wallMesh.position.copy(wallBody.position);
        wallMesh.quaternion.copy(wallBody.quaternion);

        requestAnimationFrame(action);
    }
    action();


    return wallBody;
};