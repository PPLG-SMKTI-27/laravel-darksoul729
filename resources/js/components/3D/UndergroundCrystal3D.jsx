import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Octahedron, Tetrahedron, Float } from '@react-three/drei';
import * as THREE from 'three';

const UndergroundCrystal3D = (props) => {
    const group = useRef();
    const crystalRef = useRef();
    const rocksRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (crystalRef.current) {
            crystalRef.current.rotation.y = t * 0.2;
            crystalRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
        }
        if (rocksRef.current) {
            rocksRef.current.rotation.y = t * -0.1;
        }
    });

    return (
        <group ref={group} {...props} dispose={null}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5} floatingRange={[-0.1, 0.1]}>
                {/* Main Glowing Crystal */}
                <group ref={crystalRef} position={[0, 0, 0]}>
                    <Icosahedron args={[1.2, 0]}>
                        <meshPhysicalMaterial
                            color="#f59e0b" // Amber glow
                            emissive="#b45309"
                            emissiveIntensity={0.8}
                            roughness={0.1}
                            metalness={0.2}
                            transmission={0.8}
                            thickness={1.5}
                            clearcoat={1}
                            clearcoatRoughness={0.1}
                            ior={1.8}
                        />
                    </Icosahedron>

                    {/* Inner core for extra brightness */}
                    <Octahedron args={[0.6, 0]}>
                        <meshBasicMaterial color="#fef3c7" />
                    </Octahedron>

                    {/* Pulsing Light inside the crystal */}
                    <pointLight color="#fde68a" intensity={2} distance={5} decay={2} />
                </group>

                {/* Orbiting Rocks */}
                <group ref={rocksRef}>
                    <Tetrahedron args={[0.3, 1]} position={[2, 0.5, 0]} rotation={[0.4, 0.2, 0.1]}>
                        <meshStandardMaterial color="#44403c" roughness={0.9} />
                    </Tetrahedron>
                    <Tetrahedron args={[0.2, 1]} position={[-1.5, -1, 1]} rotation={[0.1, 0.8, -0.3]}>
                        <meshStandardMaterial color="#292524" roughness={0.8} />
                    </Tetrahedron>
                    <Tetrahedron args={[0.4, 0]} position={[0, 1.5, -1.5]} rotation={[-0.5, 0.4, 0.2]}>
                        <meshStandardMaterial color="#57534e" roughness={0.9} />
                    </Tetrahedron>
                    <Icosahedron args={[0.2, 0]} position={[-1, 1.2, 1]} rotation={[0.4, 0.1, 0.5]}>
                        <meshStandardMaterial color="#44403c" roughness={0.85} />
                    </Icosahedron>
                    <Octahedron args={[0.3, 0]} position={[1, -1.8, -0.5]} rotation={[0.2, -0.6, 0.3]}>
                        <meshStandardMaterial color="#292524" roughness={0.95} />
                    </Octahedron>
                </group>
            </Float>

            {/* Ground Ambient Reflection */}
            <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#1a0f0a" roughness={1} />
            </mesh>
        </group>
    );
};

export default React.memo(UndergroundCrystal3D);
