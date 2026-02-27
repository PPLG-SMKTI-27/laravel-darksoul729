import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const Robocop3D = (props) => {
    const group = useRef();
    const modelRef = useRef();
    const { nodes, materials } = useGLTF('/3d/Secret Camping spot.glb');

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        if (modelRef.current) {
            // Floating effect
            modelRef.current.position.y = Math.sin(t * 1.5) * 0.1;

            // Slow, continuous spin
            modelRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group ref={group} {...props} dispose={null}>
            <group ref={modelRef} scale={props.scale || 1.8} position={props.position || [-0.6, -1.0, 0]}>
                <primitive object={nodes.Scene || Object.values(nodes)[0]} />
            </group>
        </group>
    );
};

export default React.memo(Robocop3D);
