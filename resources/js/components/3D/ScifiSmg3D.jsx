import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

const ScifiSmg3D = (props) => {
    const group = useRef();
    const coverRef = useRef();
    const smgRef = useRef();
    const { nodes, materials } = useGLTF('/3d/Scifi Smg.glb');

    const [isOpen, setIsOpen] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Packaging Animation
        if (coverRef.current) {
            const targetCoverRotX = isOpen ? -Math.PI / 1.5 : 0;
            coverRef.current.rotation.x = THREE.MathUtils.lerp(coverRef.current.rotation.x, targetCoverRotX, 0.05);
        }

        // SMG Floating Animation
        if (isOpen) {
            if (smgRef.current) {
                smgRef.current.position.y = THREE.MathUtils.lerp(smgRef.current.position.y, 0.5 + Math.sin(t * 1.5) * 0.1, 0.05);
                smgRef.current.position.z = THREE.MathUtils.lerp(smgRef.current.position.z, 0.5, 0.05);
                smgRef.current.rotation.y = t * 0.5; // Rotate slowly
            }
        } else {
            if (smgRef.current) {
                smgRef.current.position.y = THREE.MathUtils.lerp(smgRef.current.position.y, 0, 0.05);
                smgRef.current.position.z = THREE.MathUtils.lerp(smgRef.current.position.z, 0, 0.05);
                smgRef.current.rotation.y = THREE.MathUtils.lerp(smgRef.current.rotation.y, 0, 0.05);
            }
        }
    });

    const handleToggleOpen = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <group ref={group} {...props} dispose={null} onClick={handleToggleOpen}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}>

            {/* Packaging Base */}
            <group position={[0, 0, -0.6]}>
                <RoundedBox args={[3.2, 4.5, 0.05]} radius={0.15} smoothness={4}>
                    <meshStandardMaterial color="#3b82f6" roughness={0.8} metalness={0.1} />
                </RoundedBox>
                <RoundedBox args={[3.0, 4.3, 0.06]} radius={0.1} smoothness={4} position={[0, 0, 0.01]}>
                    <meshStandardMaterial color="#60a5fa" roughness={0.9} />
                </RoundedBox>

                <group position={[0, 1.7, 0.05]}>
                    <Text fontSize={0.35} color="#1e3a8a" anchorX="center" anchorY="middle" letterSpacing={0.05}>
                        SCIFI_SMG
                    </Text>
                    <Text position={[0, -0.35, 0]} fontSize={0.14} color="#bfdbfe" anchorX="center" anchorY="middle" letterSpacing={0.1}>
                        HIGH TECH WEAPONRY
                    </Text>
                </group>
                <group position={[0.9, -1.8, 0.05]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.7, 0.25, 0.02]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    <mesh position={[-0.25, 0, 0.02]}><planeGeometry args={[0.02, 0.18]} /><meshBasicMaterial color="#000" /></mesh>
                    <mesh position={[-0.18, 0, 0.02]}><planeGeometry args={[0.04, 0.18]} /><meshBasicMaterial color="#000" /></mesh>
                    <mesh position={[-0.08, 0, 0.02]}><planeGeometry args={[0.01, 0.18]} /><meshBasicMaterial color="#000" /></mesh>
                    <mesh position={[-0.02, 0, 0.02]}><planeGeometry args={[0.03, 0.18]} /><meshBasicMaterial color="#000" /></mesh>
                    <mesh position={[0.1, 0, 0.02]}><planeGeometry args={[0.06, 0.18]} /><meshBasicMaterial color="#000" /></mesh>
                    <mesh position={[0.22, 0, 0.02]}><planeGeometry args={[0.02, 0.18]} /><meshBasicMaterial color="#000" /></mesh>
                </group>
                <group position={[-1.0, -1.8, 0.05]}>
                    <mesh>
                        <circleGeometry args={[0.2, 32]} />
                        <meshBasicMaterial color="#facc15" />
                    </mesh>
                    <Text fontSize={0.12} color="#000" anchorX="center" anchorY="middle" position={[0, 0, 0.01]}>
                        18+
                    </Text>
                </group>
            </group>

            {/* Clear Plastic Blister Cover */}
            <group position={[0, -0.1, -0.55]}>
                <group position={[0, 2.0, 0]} ref={coverRef}>
                    <group position={[0, -2.0, 0.35]}>
                        <RoundedBox args={[2.4, 3.8, 0.7]} radius={0.3} smoothness={3}>
                            <meshPhysicalMaterial
                                transparent={true}
                                transmission={0.95}
                                opacity={1}
                                metalness={0.1}
                                roughness={0}
                                ior={1.5}
                                thickness={0.05}
                                color="#ffffff"
                                side={THREE.DoubleSide}
                            />
                        </RoundedBox>
                    </group>
                </group>
            </group>

            {/* Custom GLTF Model */}
            <group ref={smgRef} position={[0, 0, 0]} scale={0.5}>
                <primitive object={nodes.Scene || Object.values(nodes)[0]} />
            </group>

        </group>
    );
};

export default React.memo(ScifiSmg3D);
