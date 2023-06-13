import * as THREE from 'three';

//  switch camera to tv camera screen 

export default function switchTvScreen() {
    console.log('renderer.domElement: ', renderer.domElement);

    const sideCamera = renderer.domElement;
    console.log('sideCamera: ', sideCamera);
    tvVideoMaterial.map = new THREE.Texture(sideCamera);
};