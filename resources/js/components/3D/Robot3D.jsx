import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, RoundedBox } from '@react-three/drei';

// Enhanced Plastic Material - Memoized
const PlasticMaterial = React.memo(({ color, roughness = 0.3, metalness = 0.1 }) => (
    <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
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

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Hover animation
        if (group.current) group.current.position.y = Math.sin(t * 1.5) * 0.08;

        // Subtle body rotation (breathing)
        if (bodyRef.current) bodyRef.current.rotation.x = Math.sin(t * 2) * 0.02;

        // Head looking around
        if (headRef.current) {
            headRef.current.rotation.y = Math.sin(t * 0.8) * 0.15;
            headRef.current.rotation.x = Math.sin(t * 1.2) * 0.05;
        }

        // Arm swing
        if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 1.5 + Math.PI) * 0.1;
        if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(t * 1.5) * 0.1;

        // Leg dangle
        if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(t * 1.5 + Math.PI) * 0.05;
        if (rightLegRef.current) rightLegRef.current.rotation.x = Math.sin(t * 1.5) * 0.05;
    });

    // Theme Colors
    const MAIN_COLOR = "#3b82f6"; // Blue
    const ACCENT_COLOR = "#f59e0b"; // Amber/Yellow
    const WHITE_COLOR = "#f8fafc"; // White

    return (
        <group ref={group} {...props} dispose={null}>

            {/* --- HEAD GROUP --- */}
            <group position={[0, 1.4, 0]} ref={headRef}>
                {/* Main Head Shape - Techy Boxy - Reduced Smoothness */}
                <RoundedBox args={[0.7, 0.6, 0.7]} radius={0.15} smoothness={2}>
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
                <RoundedBox args={[0.7, 0.9, 0.5]} radius={0.1} smoothness={2} position={[0, 0.1, 0]}>
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
                <RoundedBox args={[0.5, 0.6, 0.3]} radius={0.1} position={[0, 0.2, -0.35]} smoothness={2}>
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
                <Sphere args={[0.22, 16, 16]}>
                    <PlasticMaterial color={ACCENT_COLOR} />
                </Sphere>
                {/* Upper Arm */}
                <Cylinder args={[0.12, 0.12, 0.4, 8]} position={[0, -0.3, 0]}>
                    <PlasticMaterial color={WHITE_COLOR} />
                </Cylinder>
                {/* Elbow */}
                <Sphere args={[0.14, 12, 12]} position={[0, -0.55, 0]}>
                    <PlasticMaterial color="#334155" />
                </Sphere>
                {/* Forearm - slightly wider */}
                <RoundedBox args={[0.2, 0.45, 0.2]} radius={0.05} position={[0, -0.85, 0]} smoothness={1}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </RoundedBox>
                {/* Hand */}
                <Sphere args={[0.15, 12, 12]} position={[0, -1.15, 0]}>
                    <PlasticMaterial color="#1e293b" />
                </Sphere>
            </group>

            {/* Right Arm */}
            <group position={[0.5, 1.0, 0]} ref={rightArmRef}>
                {/* Shoulder */}
                <Sphere args={[0.22, 16, 16]}>
                    <PlasticMaterial color={ACCENT_COLOR} />
                </Sphere>
                {/* Upper Arm */}
                <Cylinder args={[0.12, 0.12, 0.4, 8]} position={[0, -0.3, 0]}>
                    <PlasticMaterial color={WHITE_COLOR} />
                </Cylinder>
                {/* Elbow */}
                <Sphere args={[0.14, 12, 12]} position={[0, -0.55, 0]}>
                    <PlasticMaterial color="#334155" />
                </Sphere>
                {/* Forearm */}
                <RoundedBox args={[0.2, 0.45, 0.2]} radius={0.05} position={[0, -0.85, 0]} smoothness={1}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </RoundedBox>
                {/* Hand */}
                <Sphere args={[0.15, 12, 12]} position={[0, -1.15, 0]}>
                    <PlasticMaterial color="#1e293b" />
                </Sphere>
            </group>

            {/* --- LEGS --- */}
            <group position={[-0.2, 0.0, 0]} ref={leftLegRef}>
                {/* Hip Joint (internal, visual only) */}
                <Sphere args={[0.14, 12, 12]} position={[0, -0.1, 0]}>
                    <PlasticMaterial color="#334155" />
                </Sphere>
                {/* Thigh */}
                <Cylinder args={[0.15, 0.12, 0.5, 8]} position={[0, -0.4, 0]}>
                    <PlasticMaterial color={WHITE_COLOR} />
                </Cylinder>
                {/* Knee */}
                <Sphere args={[0.14, 12, 12]} position={[0, -0.7, 0]}>
                    <PlasticMaterial color="#334155" />
                </Sphere>
                {/* Shin / Boot */}
                <RoundedBox args={[0.22, 0.5, 0.25]} radius={0.08} position={[0, -1.1, 0]} smoothness={2}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </RoundedBox>
                {/* Foot Base */}
                <RoundedBox args={[0.24, 0.1, 0.35]} radius={0.05} position={[0, -1.4, 0.05]} smoothness={1}>
                    <PlasticMaterial color={ACCENT_COLOR} />
                </RoundedBox>
            </group>

            <group position={[0.2, 0.0, 0]} ref={rightLegRef}>
                {/* Hip Joint */}
                <Sphere args={[0.14, 12, 12]} position={[0, -0.1, 0]}>
                    <PlasticMaterial color="#334155" />
                </Sphere>
                {/* Thigh */}
                <Cylinder args={[0.15, 0.12, 0.5, 8]} position={[0, -0.4, 0]}>
                    <PlasticMaterial color={WHITE_COLOR} />
                </Cylinder>
                {/* Knee */}
                <Sphere args={[0.14, 12, 12]} position={[0, -0.7, 0]}>
                    <PlasticMaterial color="#334155" />
                </Sphere>
                {/* Shin / Boot */}
                <RoundedBox args={[0.22, 0.5, 0.25]} radius={0.08} position={[0, -1.1, 0]} smoothness={2}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </RoundedBox>
                {/* Foot Base */}
                <RoundedBox args={[0.24, 0.1, 0.35]} radius={0.05} position={[0, -1.4, 0.05]} smoothness={1}>
                    <PlasticMaterial color={ACCENT_COLOR} />
                </RoundedBox>
            </group>

        </group>
    );
};

export default React.memo(Robot3D);
