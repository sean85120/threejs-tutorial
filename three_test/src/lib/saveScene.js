import * as THREE from 'three';
// import { promises as fsPromises } from 'fs';


export default function saveScene({ scene }) {

    // const fs = require('fs');
    const exporter = scene.toJSON();
    const sceneJson = JSON.stringify(exporter);
    localStorage.setItem('scene', sceneJson);

    // try {

    //     const writeContent = fsPromises.writeFile('scene.json', sceneJson, 'utf8');
    //     console.log('JSON file has been saved.');

    // } catch (err) {
    //     console.error(err);
    // }

};