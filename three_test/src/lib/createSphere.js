import * as THREE from 'three';

import * as CANNON from 'cannon-es';

// create box
export default function createSphere({ world, scene }) {

    const radius = 1;
    const randomSphereBody = new CANNON.Body({
        mass: 5,
        shape: new CANNON.Sphere(radius),
    });

    const randomX = Math.random() * 20 - 10;
    // const randomY = Math.random() * 10;
    const randomZ = Math.random() * 20 - 10;

    randomSphereBody.position.set(randomX, 10, randomZ);
    world.addBody(randomSphereBody);

    const randomSphereGeometry = new THREE.SphereGeometry(radius);
    const randomSphereMaterial = new THREE.MeshBasicMaterial();
    const randomSphereMesh = new THREE.Mesh(randomSphereGeometry, randomSphereMaterial);

    randomSphereMesh.castShadow = true;
    // randomSphereMesh.receiveShadow = true;
    scene.add(randomSphereMesh);

    const action = () => {

        // randomSphereBody.position.x += Math.random() * 1 - 0.5;
        // randomSphereBody.position.y += Math.random() * 2 - 1;
        // randomSphereBody.position.z += Math.random() * 1 - 0.5;

        // randomSphereBody.rotation.x += 0.01;
        // randomSphereBody.rotation.y += 0.01;
        // randomSphereBody.rotation.z += 0.01;
        world.fixedStep();

        randomSphereMesh.position.copy(randomSphereBody.position);
        randomSphereMesh.quaternion.copy(randomSphereBody.quaternion);
        requestAnimationFrame(action);

    }
    action();

    return randomSphereMesh;
};
