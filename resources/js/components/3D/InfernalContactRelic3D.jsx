import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import UndergroundCore3D from './UndergroundCore3D';
import UndergroundCrystal3D from './UndergroundCrystal3D';

const InfernalContactRelic3D = (props) => {
    const outerRingRef = useRef();
    const innerRingRef = useRef();
    const shardGroupRef = useRef();

    const shards = useMemo(
        () => [
            { position: [2.3, 0.5, 0.1], rotation: [0.4, 0.2, 0.1], scale: 1.0, color: '#fb923c', emissive: '#c2410c' },
            { position: [-2.2, -0.4, 0.7], rotation: [0.8, -0.3, 0.4], scale: 0.7, color: '#991b1b', emissive: '#7f1d1d' },
            { position: [0.5, 2.0, -0.4], rotation: [0.2, 0.4, 0.6], scale: 0.85, color: '#fbbf24', emissive: '#b45309' },
            { position: [-0.8, -2.0, -0.7], rotation: [0.5, 0.2, -0.3], scale: 0.75, color: '#7f1d1d', emissive: '#450a0a' },
            { position: [1.8, -1.6, -0.3], rotation: [0.7, 0.1, 0.8], scale: 0.65, color: '#f97316', emissive: '#9a3412' },
            { position: [-1.6, 1.7, 0.2], rotation: [0.1, 0.7, 0.4], scale: 0.8, color: '#fb7185', emissive: '#be123c' },
        ],
        [],
    );

    useFrame((state, delta) => {
        if (outerRingRef.current) {
            outerRingRef.current.rotation.z += delta * 0.18;
            outerRingRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.15;
        }

        if (innerRingRef.current) {
            innerRingRef.current.rotation.z -= delta * 0.32;
            innerRingRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.6) * 0.2;
        }

        if (shardGroupRef.current) {
            shardGroupRef.current.rotation.y += delta * 0.22;
            shardGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
        }
    });

    return (
        <group {...props}>
            <Float speed={1.8} rotationIntensity={0.55} floatIntensity={0.9}>
                <group ref={outerRingRef}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[3.2, 0.08, 18, 120]} />
                        <meshStandardMaterial color="#fb923c" emissive="#ea580c" emissiveIntensity={1.2} metalness={0.65} roughness={0.28} />
                    </mesh>
                    <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
                        <torusGeometry args={[2.45, 0.04, 16, 120]} />
                        <meshStandardMaterial color="#fda4af" emissive="#be123c" emissiveIntensity={1.1} wireframe />
                    </mesh>
                </group>

                <group ref={innerRingRef}>
                    <mesh rotation={[Math.PI / 2, 0, Math.PI / 6]}>
                        <torusGeometry args={[1.55, 0.1, 20, 120]} />
                        <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={1.4} metalness={0.7} roughness={0.2} />
                    </mesh>
                </group>

                <group ref={shardGroupRef}>
                    {shards.map((shard, index) => (
                        <mesh
                            key={`infernal-shard-${index}`}
                            position={shard.position}
                            rotation={shard.rotation}
                            scale={shard.scale}
                        >
                            <octahedronGeometry args={[0.42, 0]} />
                            <meshStandardMaterial
                                color={shard.color}
                                emissive={shard.emissive}
                                emissiveIntensity={0.9}
                                metalness={0.72}
                                roughness={0.26}
                            />
                        </mesh>
                    ))}
                </group>

                <UndergroundCore3D scale={0.38} />
                <UndergroundCrystal3D scale={0.24} position={[0.2, 1.1, 0.2]} />
            </Float>
        </group>
    );
};

export default React.memo(InfernalContactRelic3D);
