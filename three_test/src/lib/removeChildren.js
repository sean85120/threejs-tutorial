

export default function removeLastChildren({ scene }) {

    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);

        console.log('scene.children: ', scene.children);

        console.log('scene', scene);
    };
};