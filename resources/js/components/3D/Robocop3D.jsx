import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/3d/hero-spaceship.glb';

const Robocop3D = ({ scale = 1.8, position = [-0.6, -1.0, 0], rotation = [0, 0, 0], ...groupProps }) => {
    const { scene } = useGLTF(MODEL_PATH);

    const preparedScene = useMemo(() => {
        const clonedScene = scene.clone(true);

        clonedScene.traverse((child) => {
            if (!child.isMesh) {
                return;
            }

            child.castShadow = false;
            child.receiveShadow = false;
            child.frustumCulled = true;
        });

        const box = new THREE.Box3().setFromObject(clonedScene);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        const maxAxis = Math.max(size.x, size.y, size.z);
        const normalizedScale = maxAxis > 0 ? 1 / maxAxis : 1;

        clonedScene.scale.setScalar(normalizedScale);
        clonedScene.position.set(-center.x * normalizedScale, -center.y * normalizedScale, -center.z * normalizedScale);

        return clonedScene;
    }, [scene]);

    return (
        <group {...groupProps} dispose={null}>
            <group scale={scale} position={position} rotation={rotation}>
                <primitive object={preparedScene} />
            </group>
        </group>
    );
};

useGLTF.preload(MODEL_PATH);

export default React.memo(Robocop3D);
