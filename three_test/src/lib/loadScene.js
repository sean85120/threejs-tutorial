import * as THREE from 'three';
import * as CANNON from 'cannon-es';


export default function loadScene({ scene, world }) {

    console.log('before load:', scene.children)
    console.log('before load:', scene.children.length)

    // load scene json
    // {"method": "loadScene"}

    // for (let i = 0, l = scene.children[2].children.length; i < l; i++) {
    //     const element = scene.children[2].children[i];
    //     console.log('element:', element);
    //     if (element.name === 'tvVideoMesh') {
    //         // pass
    //     } else {
    //         scene.remove(element);
    //     }
    // };
    // console.log('scene.children: ', scene.children[2].children);


    //  remove all the children of scene
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
        // console.log('scene.children: ', scene.children);
    }

    const sceneJson = localStorage.getItem('scene');

    const jsonLoader = new THREE.ObjectLoader();
    const loadedScene = jsonLoader.parse(JSON.parse(sceneJson));

    console.log('load scene: ', loadedScene.children);

    // for (let i = 0, l = loadedScene.children.length; i < l; i++) {
    //     try {
    //         console.log('loadedScene.children[i]:', loadedScene.children[i].name);
    //         scene.add(loadedScene.children[i]);
    //     } catch (error) {
    //         console.log('name', loadedScene.children[i].name);
    //         console.log('error:', error);
    //     }
    // }

    scene.add(loadedScene);

    console.log('after load:', scene.children)


    // load cannon json
    while (world.bodies.length > 6) {
        world.removeBody(world.bodies[world.bodies.length - 1]);
    }

    console.log('world bodies:', world.bodies);

    const cannon = localStorage.getItem('cannon');
    const cannonJson = JSON.parse(cannon);

    cannonJson.bodies.forEach((element) => {

        console.log('element:', element);
        // const cannonBody = new CANNON.Body({
        //     id: element.id,
        //     mass: element.mass,
        //     type: element.type,
        //     name: element.name,
        //     position: new CANNON.Vec3(...element.position),
        //     quaternion: new CANNON.Quaternion(...element.quaternion),
        //     velocity: new CANNON.Vec3(...element.velocity),
        //     angularVelocity: new CANNON.Vec3(...element.angularVelocity),
        // });

        world.addBody(element);
        console.log('cannonBody:', element);
    });

    console.log('world', world)

    const animate = () => {
        requestAnimationFrame(animate);
        world.fixedStep();
        // checkMatchUUID(scene.children, world.bodies);
    };

    function checkMatchUUID(list1, list2) {
        // Iterate over list1
        list1.forEach((child) => {
            // Check if any object in list2 has matching UUID
            if (list2.some((body) => body.id === child.uuid)) {
                console.log('check:', body.id);
                child.position.copy(body.position);
                child.quaternion.copy(body.quaternion);
            }
        });
    }
    animate();

}