import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Edges, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const UndergroundCore3D = (props) => {
    const coreRef = useRef();
    const ring1Ref = useRef();
    const ring2Ref = useRef();

    useFrame((state, delta) => {
        if (coreRef.current) {
            coreRef.current.rotation.x += delta * 0.2;
            coreRef.current.rotation.y += delta * 0.3;
        }
        if (ring1Ref.current) {
            ring1Ref.current.rotation.x -= delta * 0.5;
            ring1Ref.current.rotation.y -= delta * 0.1;
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.x += delta * 0.1;
            ring2Ref.current.rotation.y += delta * 0.4;
            ring2Ref.current.rotation.z -= delta * 0.2;
        }
    });

    return (
        <group {...props}>
            <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
                {/* Outer Energy Rings */}
                <mesh ref={ring1Ref}>
                    <torusGeometry args={[2.5, 0.05, 16, 100]} />
                    <meshStandardMaterial color="#fcd34d" emissive="#d97706" emissiveIntensity={2} wireframe />
                </mesh>
                <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[3, 0.03, 16, 100]} />
                    <meshStandardMaterial color="#fcd34d" emissive="#b45309" emissiveIntensity={1.5} />
                </mesh>

                {/* Geo casing */}
                <mesh>
                    <icosahedronGeometry args={[2, 1]} />
                    <meshStandardMaterial color="#1c1917" wireframe transparent opacity={0.3} />
                    <Edges scale={1.05} threshold={15} color="#44403c" />
                </mesh>

                {/* The Core Crystal */}
                <mesh ref={coreRef}>
                    <octahedronGeometry args={[1.2, 0]} />
                    <MeshDistortMaterial
                        color="#fcd34d"
                        emissive="#d97706"
                        emissiveIntensity={1.5}
                        distort={0.3}
                        speed={2}
                        roughness={0.2}
                        metalness={0.8}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                    />
                </mesh>

                {/* Floating particles around it */}
                <Sparkles count={100} scale={6} size={4} speed={0.4} opacity={0.5} color="#fbbf24" />
            </Float>
        </group>
    );
};

export default UndergroundCore3D;
