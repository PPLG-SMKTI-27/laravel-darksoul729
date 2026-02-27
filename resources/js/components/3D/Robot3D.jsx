import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, RoundedBox, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced Plastic Material - Memoized
const PlasticMaterial = React.memo(({ color, roughness = 0.4, metalness = 0.1, side = THREE.FrontSide }) => (
    <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        side={side}
    />
));

const Robot3D = (props) => {
    const group = useRef();
    const headRef = useRef();
    const bodyRef = useRef();
    const leftArmRef = useRef();
    const rightArmRef = useRef();
    const leftLegRef = useRef();
    const rightLegRef = useRef();
    const coverRef = useRef(); // Ref for the plastic cover
    const robotGroupRef = useRef(); // Ref for the robot inside the package

    const [isOpen, setIsOpen] = useState(false);

    // Theme Colors
    const MAIN_COLOR = "#3b82f6"; // Blue
    const ACCENT_COLOR = "#f59e0b"; // Amber/Yellow
    const WHITE_COLOR = "#f8fafc"; // White

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // --- Packaging Animation ---
        if (coverRef.current) {
            // Target rotation for the cover: closed = 0, open = swings open (e.g., -Math.PI / 1.5)
            const targetCoverRotX = isOpen ? -Math.PI / 1.5 : 0;
            coverRef.current.rotation.x = THREE.MathUtils.lerp(coverRef.current.rotation.x, targetCoverRotX, 0.05);
        }

        // --- Robot Animations ---
        if (isOpen) {
            // "Free" / Active state
            // Float higher, look around more, swing arms
            if (robotGroupRef.current) {
                // Rise out of the box smoothly
                robotGroupRef.current.position.y = THREE.MathUtils.lerp(robotGroupRef.current.position.y, 0.5 + Math.sin(t * 1.5) * 0.1, 0.05);
                robotGroupRef.current.position.z = THREE.MathUtils.lerp(robotGroupRef.current.position.z, 0.5, 0.05);
            }

            // More active body/head movements
            if (bodyRef.current) bodyRef.current.rotation.x = Math.sin(t * 2) * 0.05;
            if (headRef.current) {
                headRef.current.rotation.y = Math.sin(t * 1.2) * 0.3;
                headRef.current.rotation.x = Math.sin(t * 1.5) * 0.1;
            }

            // Exaggerated Arm swing (greeting/floating pose)
            if (leftArmRef.current) {
                leftArmRef.current.rotation.x = Math.sin(t * 2 + Math.PI) * 0.3 - 0.2;
                leftArmRef.current.rotation.z = 0.2;
            }
            if (rightArmRef.current) {
                rightArmRef.current.rotation.x = Math.sin(t * 2) * 0.3 - 0.2;
                rightArmRef.current.rotation.z = -0.2;
            }

            // Leg kick
            if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(t * 2 + Math.PI) * 0.2 + 0.1;
            if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(t * 2) * 0.2 + 0.1;

        } else {
            // "Packaged" / Idle state
            // Rest inside the package, very slight subtle movements
            if (robotGroupRef.current) {
                robotGroupRef.current.position.y = THREE.MathUtils.lerp(robotGroupRef.current.position.y, -0.2, 0.05);
                robotGroupRef.current.position.z = THREE.MathUtils.lerp(robotGroupRef.current.position.z, 0, 0.05);
            }

            // Return to neutral slightly
            if (bodyRef.current) bodyRef.current.rotation.x = Math.sin(t * 1) * 0.01;

            if (headRef.current) {
                headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0, 0.05);
                headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.05);
            }

            // Arms pinned to sides in the package
            if (leftArmRef.current) {
                leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, 0, 0.1);
                leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.05, 0.1);
            }
            if (rightArmRef.current) {
                rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 0.1);
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.05, 0.1);
            }

            // Legs straight down
            if (leftLegRef.current) leftLegRef.current.rotation.x = THREE.MathUtils.lerp(leftLegRef.current.rotation.x, 0, 0.1);
            if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 0.1);
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

            {/* --- TOY PACKAGING --- */}

            {/* Cardboard Backing */}
            <group position={[0, 0, -0.6]}>
                <RoundedBox args={[3.2, 4.5, 0.05]} radius={0.15} smoothness={4}>
                    {/* Vibrant Gradient-like material or just a solid bright color for the cardboard */}
                    <meshStandardMaterial color="#ec4899" roughness={0.8} metalness={0.1} />
                </RoundedBox>
                {/* Backing Inner Accent */}
                <RoundedBox args={[3.0, 4.3, 0.06]} radius={0.1} smoothness={4} position={[0, 0, 0.01]}>
                    <meshStandardMaterial color="#fce7f3" roughness={0.9} />
                </RoundedBox>

                {/* Text on Cardboard */}
                {/* Simulated Graphics/Text Boxes */}
                <group position={[0, 1.7, 0.05]}>
                    <Text fontSize={0.35} color="#db2777" anchorX="center" anchorY="middle" letterSpacing={0.05}>
                        KEVIN_OS
                    </Text>
                    <Text position={[0, -0.35, 0]} fontSize={0.14} color="#f472b6" anchorX="center" anchorY="middle" letterSpacing={0.1}>
                        FULLSTACK ACTION FIGURE
                    </Text>
                </group>

                {/* Fake bar code / logos bottom */}
                <group position={[0.9, -1.8, 0.05]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.7, 0.25, 0.02]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                    {/* Barcode lines */}
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
                        <circleGeometry args={[0.2, 32]} />
                        <meshBasicMaterial color="#facc15" />
                    </mesh>
                    <Text fontSize={0.12} color="#000" anchorX="center" anchorY="middle" position={[0, 0, 0.01]}>
                        3+
                    </Text>
                </group>
            </group>

            {/* Clear Plastic Blister Cover */}
            <group position={[0, -0.1, -0.55]}>
                <group position={[0, 2.0, 0]} ref={coverRef}>
                    {/* The cover pivot is at the top so it swings open upwards */}
                    <group position={[0, -2.0, 0.35]}>
                        <RoundedBox args={[2.4, 3.8, 0.7]} radius={0.3} smoothness={3}>
                            <meshPhysicalMaterial
                                transparent={true}
                                transmission={0.95} // Glass-like transparency
                                opacity={1}
                                metalness={0.1}
                                roughness={0}       // Perfectly smooth
                                ior={1.5}           // Index of refraction like plastic
                                thickness={0.05}    // Simulated volume thickness
                                color="#ffffff"
                                side={THREE.DoubleSide}
                            />
                        </RoundedBox>
                    </group>
                </group>
            </group>

            {/* --- ROBOT ITSELF --- */}
            {/* We wrap the robot in robotGroupRef to move it independently of the packaging */}
            <group ref={robotGroupRef} scale={0.85} position={[0, 0.1, 0]}>

                {/* --- HEAD GROUP --- */}
                <group position={[0, 1.4, 0]} ref={headRef}>
                    {/* Main Head Shape - Techy Boxy - Reduced Smoothness */}
                    <RoundedBox args={[0.7, 0.6, 0.7]} radius={0.15} smoothness={1}>
                        <PlasticMaterial color={WHITE_COLOR} />
                    </RoundedBox>

                    {/* Visor Area - Reduced Smoothness */}
                    <group position={[0, 0.05, 0.28]}>
                        <RoundedBox args={[0.5, 0.25, 0.2]} radius={0.05} smoothness={1}>
                            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
                        </RoundedBox>
                        {/* Glowing Eyes/Visor Line */}
                        <mesh position={[0, 0, 0.11]}>
                            <boxGeometry args={[0.3, 0.05, 0.01]} />
                            <meshBasicMaterial color="#06b6d4" toneMapped={false} />
                        </mesh>
                    </group>

                    {/* Ear Headphones - Reduced Segments */}
                    <group position={[0.4, 0, 0]}>
                        <Cylinder args={[0.15, 0.15, 0.1, 12]} rotation={[0, 0, Math.PI / 2]}>
                            <PlasticMaterial color={ACCENT_COLOR} />
                        </Cylinder>
                    </group>
                    <group position={[-0.4, 0, 0]}>
                        <Cylinder args={[0.15, 0.15, 0.1, 12]} rotation={[0, 0, Math.PI / 2]}>
                            <PlasticMaterial color={ACCENT_COLOR} />
                        </Cylinder>
                    </group>

                    {/* Antenna */}
                    <group position={[0.2, 0.35, -0.1]}>
                        <Cylinder args={[0.02, 0.02, 0.3, 6]}>
                            <PlasticMaterial color="#94a3b8" metalness={0.5} />
                        </Cylinder>
                        <Sphere args={[0.06, 8, 8]} position={[0, 0.15, 0]}>
                            <meshStandardMaterial color={ACCENT_COLOR} emissive={ACCENT_COLOR} emissiveIntensity={0.5} />
                        </Sphere>
                    </group>
                </group>

                {/* --- NECK --- */}
                <Cylinder args={[0.15, 0.15, 0.2, 8]} position={[0, 1.05, 0]}>
                    <PlasticMaterial color="#334155" />
                </Cylinder>

                {/* --- BODY GROUP --- */}
                <group position={[0, 0.4, 0]} ref={bodyRef}>
                    {/* Torso - Reduced Smoothness */}
                    <RoundedBox args={[0.7, 0.9, 0.5]} radius={0.1} smoothness={1} position={[0, 0.1, 0]}>
                        <PlasticMaterial color={MAIN_COLOR} />
                    </RoundedBox>

                    {/* White Chest Plate */}
                    <RoundedBox args={[0.5, 0.4, 0.1]} radius={0.05} position={[0, 0.2, 0.26]} smoothness={1}>
                        <PlasticMaterial color={WHITE_COLOR} />
                    </RoundedBox>

                    {/* Core Reactor */}
                    <mesh position={[0, 0.2, 0.32]}>
                        <cylinderGeometry args={[0.1, 0.1, 0.02, 12]} rotation={[Math.PI / 2, 0, 0]} />
                        <meshBasicMaterial color="#06b6d4" toneMapped={false} />
                    </mesh>

                    {/* Backpack / Jetpack */}
                    <RoundedBox args={[0.5, 0.6, 0.3]} radius={0.1} position={[0, 0.2, -0.35]} smoothness={1}>
                        <PlasticMaterial color="#cbd5e1" />
                    </RoundedBox>
                    <Cylinder args={[0.08, 0.12, 0.3, 8]} position={[0.15, -0.2, -0.35]} rotation={[0, 0, 0]}>
                        <PlasticMaterial color="#64748b" />
                    </Cylinder>
                    <Cylinder args={[0.08, 0.12, 0.3, 8]} position={[-0.15, -0.2, -0.35]} rotation={[0, 0, 0]}>
                        <PlasticMaterial color="#64748b" />
                    </Cylinder>
                </group>

                {/* --- ARMS --- */}
                {/* Left Arm */}
                <group position={[-0.5, 1.0, 0]} ref={leftArmRef}>
                    {/* Shoulder */}
                    <Sphere args={[0.22, 10, 10]}>
                        <PlasticMaterial color={ACCENT_COLOR} />
                    </Sphere>
                    {/* Upper Arm */}
                    <Cylinder args={[0.12, 0.12, 0.4, 8]} position={[0, -0.3, 0]}>
                        <PlasticMaterial color={WHITE_COLOR} />
                    </Cylinder>
                    {/* Elbow */}
                    <Sphere args={[0.14, 8, 8]} position={[0, -0.55, 0]}>
                        <PlasticMaterial color="#334155" />
                    </Sphere>
                    {/* Forearm - slightly wider */}
                    <RoundedBox args={[0.2, 0.45, 0.2]} radius={0.05} position={[0, -0.85, 0]} smoothness={1}>
                        <PlasticMaterial color={MAIN_COLOR} />
                    </RoundedBox>
                    {/* Hand */}
                    <Sphere args={[0.15, 8, 8]} position={[0, -1.15, 0]}>
                        <PlasticMaterial color="#1e293b" />
                    </Sphere>
                </group>

                {/* Right Arm */}
                <group position={[0.5, 1.0, 0]} ref={rightArmRef}>
                    {/* Shoulder */}
                    <Sphere args={[0.22, 10, 10]}>
                        <PlasticMaterial color={ACCENT_COLOR} />
                    </Sphere>
                    {/* Upper Arm */}
                    <Cylinder args={[0.12, 0.12, 0.4, 8]} position={[0, -0.3, 0]}>
                        <PlasticMaterial color={WHITE_COLOR} />
                    </Cylinder>
                    {/* Elbow */}
                    <Sphere args={[0.14, 8, 8]} position={[0, -0.55, 0]}>
                        <PlasticMaterial color="#334155" />
                    </Sphere>
                    {/* Forearm */}
                    <RoundedBox args={[0.2, 0.45, 0.2]} radius={0.05} position={[0, -0.85, 0]} smoothness={1}>
                        <PlasticMaterial color={MAIN_COLOR} />
                    </RoundedBox>
                    {/* Hand */}
                    <Sphere args={[0.15, 8, 8]} position={[0, -1.15, 0]}>
                        <PlasticMaterial color="#1e293b" />
                    </Sphere>
                </group>

                {/* --- LEGS --- */}
                <group position={[-0.2, 0.0, 0]} ref={leftLegRef}>
                    {/* Hip Joint (internal, visual only) */}
                    <Sphere args={[0.14, 8, 8]} position={[0, -0.1, 0]}>
                        <PlasticMaterial color="#334155" />
                    </Sphere>
                    {/* Thigh */}
                    <Cylinder args={[0.15, 0.12, 0.5, 8]} position={[0, -0.4, 0]}>
                        <PlasticMaterial color={WHITE_COLOR} />
                    </Cylinder>
                    {/* Knee */}
                    <Sphere args={[0.14, 8, 8]} position={[0, -0.7, 0]}>
                        <PlasticMaterial color="#334155" />
                    </Sphere>
                    {/* Shin / Boot */}
                    <RoundedBox args={[0.22, 0.5, 0.25]} radius={0.08} position={[0, -1.1, 0]} smoothness={1}>
                        <PlasticMaterial color={MAIN_COLOR} />
                    </RoundedBox>
                    {/* Foot Base */}
                    <RoundedBox args={[0.24, 0.1, 0.35]} radius={0.05} position={[0, -1.4, 0.05]} smoothness={1}>
                        <PlasticMaterial color={ACCENT_COLOR} />
                    </RoundedBox>
                </group>

                <group position={[0.2, 0.0, 0]} ref={rightLegRef}>
                    {/* Hip Joint */}
                    <Sphere args={[0.14, 8, 8]} position={[0, -0.1, 0]}>
                        <PlasticMaterial color="#334155" />
                    </Sphere>
                    {/* Thigh */}
                    <Cylinder args={[0.15, 0.12, 0.5, 8]} position={[0, -0.4, 0]}>
                        <PlasticMaterial color={WHITE_COLOR} />
                    </Cylinder>
                    {/* Knee */}
                    <Sphere args={[0.14, 8, 8]} position={[0, -0.7, 0]}>
                        <PlasticMaterial color="#334155" />
                    </Sphere>
                    {/* Shin / Boot */}
                    <RoundedBox args={[0.22, 0.5, 0.25]} radius={0.08} position={[0, -1.1, 0]} smoothness={1}>
                        <PlasticMaterial color={MAIN_COLOR} />
                    </RoundedBox>
                    {/* Foot Base */}
                    <RoundedBox args={[0.24, 0.1, 0.35]} radius={0.05} position={[0, -1.4, 0.05]} smoothness={1}>
                        <PlasticMaterial color={ACCENT_COLOR} />
                    </RoundedBox>
                </group>

            </group>
        </group>
    );
};

export default React.memo(Robot3D);
