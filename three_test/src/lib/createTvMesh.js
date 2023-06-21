import * as THREE from 'three';


export default function createTvMesh({ scene }) {
    const wallHeight = 25;
    const wallWidth = 50;
    const wallDepth = 50;
    const positionY = 10;
    const positionX = wallWidth / 2;
    const positionZ = wallDepth / 2;

    const tvGeometry = new THREE.BoxGeometry(20, 9, 0.5);

    const mainCamera = scene.renderer.domElement;
    const mainCameratexture = new THREE.Texture(mainCamera);
    const tvVideoMaterial = new THREE.MeshBasicMaterial({ map: mainCameratexture, side: THREE.DoubleSide, toneMapped: false });

    const tvVideoMesh = new THREE.Mesh(tvGeometry, tvVideoMaterial);
    tvVideoMesh.name = 'tvVideoMesh';

    tvVideoMesh.position.set(9.2, positionY + 1.9, -positionZ + 0.1)

    scene.scene.add(tvVideoMesh);

    return tvVideoMaterial
}