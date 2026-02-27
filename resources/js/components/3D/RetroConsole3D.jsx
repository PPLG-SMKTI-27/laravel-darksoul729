import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

// Low-poly material for performance
const PlasticMaterial = React.memo(({ color, roughness = 0.5, metalness = 0.1, side = THREE.FrontSide }) => (
    <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        side={side}
    />
));

const RetroConsole3D = (props) => {
    const group = useRef();
    const coverRef = useRef();
    const consoleGroupRef = useRef();

    const [isOpen, setIsOpen] = useState(false);

    // Theme Colors
    const CASE_COLOR = "#f8fafc"; // White/Light Gray case
    const SCREEN_BEZEL = "#334155"; // Dark Slate
    const ACCENT_BTN_1 = "#db2777"; // Pink Action Button A
    const ACCENT_BTN_2 = "#3b82f6"; // Blue Action Button B
    const DPAD_COLOR = "#1e293b"; // Dark D-Pad

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Packaging Animation
        if (coverRef.current) {
            const targetCoverRotX = isOpen ? -Math.PI / 1.5 : 0;
            coverRef.current.rotation.x = THREE.MathUtils.lerp(coverRef.current.rotation.x, targetCoverRotX, 0.05);
        }

        // Console Animation
        if (isOpen) {
            // "Free" / Active state: Hovering out of the packaging
            if (consoleGroupRef.current) {
                consoleGroupRef.current.position.y = THREE.MathUtils.lerp(consoleGroupRef.current.position.y, 0.5 + Math.sin(t * 1.5) * 0.1, 0.05);
                consoleGroupRef.current.position.z = THREE.MathUtils.lerp(consoleGroupRef.current.position.z, 0.6, 0.05);

                // Slight floating rotation tilt
                consoleGroupRef.current.rotation.y = THREE.MathUtils.lerp(consoleGroupRef.current.rotation.y, Math.sin(t * 0.8) * 0.2, 0.05);
                consoleGroupRef.current.rotation.x = THREE.MathUtils.lerp(consoleGroupRef.current.rotation.x, Math.sin(t * 1.2) * 0.1, 0.05);
            }
        } else {
            // "Packaged" / Idle state: Resting in blister pack
            if (consoleGroupRef.current) {
                consoleGroupRef.current.position.y = THREE.MathUtils.lerp(consoleGroupRef.current.position.y, 0, 0.05);
                consoleGroupRef.current.position.z = THREE.MathUtils.lerp(consoleGroupRef.current.position.z, 0, 0.05);

                // Return to flat orientation
                consoleGroupRef.current.rotation.y = THREE.MathUtils.lerp(consoleGroupRef.current.rotation.y, 0, 0.08);
                consoleGroupRef.current.rotation.x = THREE.MathUtils.lerp(consoleGroupRef.current.rotation.x, 0, 0.08);
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

            {/* --- CARDBOARD PACKAGING --- */}
            <group position={[0, -0.2, -0.6]}>
                <RoundedBox args={[3.2, 4.5, 0.05]} radius={0.15} smoothness={2}>
                    {/* Blue Cardboard */}
                    <meshStandardMaterial color="#3b82f6" roughness={0.8} />
                </RoundedBox>
                {/* Backing Inner Accent */}
                <RoundedBox args={[3.0, 4.3, 0.06]} radius={0.1} smoothness={2} position={[0, 0, 0.01]}>
                    <meshStandardMaterial color="#bfdbfe" roughness={0.9} />
                </RoundedBox>

                {/* Simulated Graphics/Text Boxes */}
                <group position={[0, 1.7, 0.05]}>
                    <Text fontSize={0.35} color="#1d4ed8" anchorX="center" anchorY="middle" letterSpacing={0.05}>
                        DEVBOY
                    </Text>
                    <Text position={[0, -0.35, 0]} fontSize={0.14} color="#2563eb" anchorX="center" anchorY="middle" letterSpacing={0.1}>
                        PORTABLE DEV ENVIRONMENT
                    </Text>
                </group>

                {/* Fake bar code */}
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

                {/* Warning Label */}
                <group position={[-1.0, -1.8, 0.05]}>
                    <mesh>
                        <circleGeometry args={[0.2, 16]} />
                        <meshBasicMaterial color="#facc15" />
                    </mesh>
                    <Text fontSize={0.12} color="#000" anchorX="center" anchorY="middle" position={[0, 0, 0.01]}>
                        8-BIT
                    </Text>
                </group>
            </group>

            {/* --- PLASTIC BLISTER COVER --- */}
            <group position={[0, -0.3, -0.55]}>
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

            {/* --- RETRO CONSOLE ITSELF --- */}
            <group ref={consoleGroupRef} position={[0, 0, 0]}>
                {/* Main Body */}
                <RoundedBox args={[1.6, 2.6, 0.4]} radius={0.15} smoothness={2}>
                    <PlasticMaterial color={CASE_COLOR} />
                </RoundedBox>

                {/* Indentations / Styling lines */}
                <RoundedBox args={[1.5, 0.2, 0.42]} radius={0.02} smoothness={1} position={[0, -1.1, 0]}>
                    <PlasticMaterial color="#e2e8f0" />
                </RoundedBox>

                {/* Screen Bezel */}
                <RoundedBox args={[1.3, 1.0, 0.05]} radius={0.1} smoothness={1} position={[0, 0.6, 0.2]}>
                    <PlasticMaterial color={SCREEN_BEZEL} roughness={0.3} />
                </RoundedBox>

                {/* Glowing Screen */}
                <mesh position={[0, 0.6, 0.23]}>
                    <planeGeometry args={[0.9, 0.7]} />
                    {isOpen ? (
                        <meshBasicMaterial color="#4ade80" /> // Bright green when active
                    ) : (
                        <meshStandardMaterial color="#022c22" roughness={0.1} /> // Dark when off
                    )}
                </mesh>

                {/* Content on Screen (Only visible when active) */}
                {isOpen && (
                    <group position={[0, 0.6, 0.24]}>
                        <Text fontSize={0.1} color="#064e3b" position={[-0.35, 0.2, 0]} anchorX="left" anchorY="center">
                            {">"} npm start
                        </Text>
                        <Text fontSize={0.1} color="#064e3b" position={[-0.35, 0.0, 0]} anchorX="left" anchorY="center">
                            READY...
                        </Text>
                        <mesh position={[-0.1, -0.01, 0]}>
                            <planeGeometry args={[0.06, 0.1]} />
                            <meshBasicMaterial color="#064e3b">
                                {/* Simple blink animation without complex materials for performance */}
                                <primitive object={new THREE.MeshBasicMaterial({ color: "#064e3b" })} attach="material" />
                            </meshBasicMaterial>
                        </mesh>
                    </group>
                )}

                {/* D-Pad Container */}
                <group position={[-0.4, -0.5, 0.22]}>
                    <RoundedBox args={[0.4, 0.4, 0.05]} radius={0.05} smoothness={1}>
                        <PlasticMaterial color="#cbd5e1" />
                    </RoundedBox>

                    {/* Cross */}
                    <mesh position={[0, 0, 0.02]}>
                        <boxGeometry args={[0.15, 0.35, 0.06]} />
                        <PlasticMaterial color={DPAD_COLOR} roughness={0.3} />
                    </mesh>
                    <mesh position={[0, 0, 0.02]}>
                        <boxGeometry args={[0.35, 0.15, 0.06]} />
                        <PlasticMaterial color={DPAD_COLOR} roughness={0.3} />
                    </mesh>
                </group>

                {/* Action Buttons */}
                <group position={[0.4, -0.4, 0.2]}>
                    {/* A Button */}
                    <Cylinder args={[0.12, 0.12, 0.08, 12]} rotation={[Math.PI / 2, 0, 0]} position={[0.15, 0.1, 0]}>
                        <PlasticMaterial color={ACCENT_BTN_1} />
                    </Cylinder>
                    {/* B Button */}
                    <Cylinder args={[0.12, 0.12, 0.08, 12]} rotation={[Math.PI / 2, 0, 0]} position={[-0.15, -0.1, 0]}>
                        <PlasticMaterial color={ACCENT_BTN_2} />
                    </Cylinder>
                </group>

                {/* Start / Select Buttons */}
                <group position={[0, -0.85, 0.2]}>
                    <Cylinder args={[0.04, 0.04, 0.15, 8]} rotation={[Math.PI / 2, 0, -Math.PI / 6]} position={[-0.15, 0, 0]}>
                        <PlasticMaterial color="#475569" />
                    </Cylinder>
                    <Cylinder args={[0.04, 0.04, 0.15, 8]} rotation={[Math.PI / 2, 0, -Math.PI / 6]} position={[0.15, 0, 0]}>
                        <PlasticMaterial color="#475569" />
                    </Cylinder>
                </group>

                {/* Speaker Holes */}
                <group position={[0.4, -0.85, 0.2]}>
                    <mesh position={[0, 0.06, 0.01]}><circleGeometry args={[0.02, 6]} /><meshBasicMaterial color="#94a3b8" /></mesh>
                    <mesh position={[-0.05, 0.03, 0.01]}><circleGeometry args={[0.02, 6]} /><meshBasicMaterial color="#94a3b8" /></mesh>
                    <mesh position={[0.05, 0.03, 0.01]}><circleGeometry args={[0.02, 6]} /><meshBasicMaterial color="#94a3b8" /></mesh>
                    <mesh position={[-0.05, -0.03, 0.01]}><circleGeometry args={[0.02, 6]} /><meshBasicMaterial color="#94a3b8" /></mesh>
                    <mesh position={[0.05, -0.03, 0.01]}><circleGeometry args={[0.02, 6]} /><meshBasicMaterial color="#94a3b8" /></mesh>
                    <mesh position={[0, -0.06, 0.01]}><circleGeometry args={[0.02, 6]} /><meshBasicMaterial color="#94a3b8" /></mesh>
                </group>

            </group>
        </group>
    );
};

export default React.memo(RetroConsole3D);
