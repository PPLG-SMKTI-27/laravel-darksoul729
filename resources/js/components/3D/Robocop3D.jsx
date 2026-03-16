import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Robocop3D = (props) => {
    const group = useRef();
    const modelRef = useRef();
    const { scene } = useGLTF('/3d/cicada_-_retro_cartoon_car.glb');

    const preparedScene = useMemo(() => {
        const clonedScene = scene.clone(true);

        clonedScene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
                child.frustumCulled = true;
            }
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
        <group ref={group} {...props} dispose={null}>
            <group
                ref={modelRef}
                scale={props.scale || 1.8}
                position={props.position || [-0.6, -1.0, 0]}
                rotation={props.rotation || [0, 0, 0]}
            >
                <primitive object={preparedScene} />
            </group>
        </group>
    );
};

export default React.memo(Robocop3D);
