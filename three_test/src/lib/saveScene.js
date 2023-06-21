import * as THREE from 'three';
import { saveAs } from 'file-saver';


export default function saveScene({ scene, world }) {

    // clear the previous localstorage
    localStorage.clear();

    // save three objects
    // scene.controls.detach();
    // scene.remove(controls);
    // scene.updateMatrixWorld();
    const exporter = scene.toJSON();
    const sceneJson = JSON.stringify(exporter);
    localStorage.setItem('scene', sceneJson);

    // const blob = new Blob([sceneJson], { type: 'application/json' });
    // saveAs(blob, 'scene.json');

    // save cannon objects
    const cannonBodies = [];

    // console.log('world.bodies: ', world.bodies);
    let i = 0;
    world.bodies.forEach((body) => {
        i += 1;

        if (i === 7) {
            console.log('i: ', i);
            console.log('body: ', body);
        }
        const cannonBody = {
            id: body.id,
            type: body.type,
            name: body.name,
            mass: body.mass,
            position: body.position.toArray(),
            quaternion: body.quaternion.toArray(),
            velocity: body.velocity.toArray(),
            angularVelocity: body.angularVelocity.toArray(),
        };

        cannonBodies.push(cannonBody);
    })

    const cannonWorld = {
        bodies: cannonBodies,
    }

    localStorage.setItem('cannon', JSON.stringify(cannonWorld));

    // const cannonExporter = world.toJSON();
    // const cannonJson = JSON.stringify(cannonExporter);
    // localStorage.setItem('cannon', cannonJson);

};