import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, RoundedBox, Cone, Torus, Text } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced Plastic Material - Memoized
const PlasticMaterial = React.memo(({ color, roughness = 0.3, metalness = 0.2 }) => (
    <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
    />
));

const Dragon3D = (props) => {
    const group = useRef();
    const bodyRef = useRef();
    const headRef = useRef();
    const tailRef = useRef();
    const leftWingRef = useRef();
    const rightWingRef = useRef();
    const [isHovered, setIsHovered] = useState(false);

    // Theme Colors
    const MAIN_COLOR = "#10b981"; // Emerald Green
    const BELLY_COLOR = "#fbbf24"; // Amber
    const WING_COLOR = "#8b5cf6"; // Violet
    const HORN_COLOR = "#f472b6"; // Pink

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Hover animation
        if (group.current) {
            group.current.position.y = Math.sin(t * 1.5) * 0.15;
            group.current.rotation.y = Math.sin(t * 0.8) * 0.3;
        }

        // Body breathing
        if (bodyRef.current) {
            bodyRef.current.scale.x = 1 + Math.sin(t * 2) * 0.02;
            bodyRef.current.scale.y = 1 + Math.sin(t * 2) * 0.02;
        }

        // Head looking around
        if (headRef.current) {
            headRef.current.rotation.y = Math.sin(t * 1.2) * 0.4;
            headRef.current.rotation.x = Math.sin(t * 1.5) * 0.1;
        }

        // Tail wagging
        if (tailRef.current) {
            tailRef.current.rotation.y = Math.sin(t * 2.5) * 0.3;
        }

        // Wing flapping (more active when hovered)
        const wingSpeed = isHovered ? 4 : 1.5;
        const wingAmplitude = isHovered ? 0.8 : 0.2;
        
        if (leftWingRef.current) {
            leftWingRef.current.rotation.z = -Math.PI / 6 + Math.sin(t * wingSpeed) * wingAmplitude;
        }
        if (rightWingRef.current) {
            rightWingRef.current.rotation.z = Math.PI / 6 - Math.sin(t * wingSpeed) * wingAmplitude;
        }
    });

    return (
        <group ref={group} {...props} dispose={null}
            onPointerOver={() => { setIsHovered(true); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { setIsHovered(false); document.body.style.cursor = 'auto'; }}>
            
            {/* === BODY === */}
            <group ref={bodyRef} position={[0, 0, 0]}>
                {/* Main Body - Teardrop shape */}
                <RoundedBox args={[0.9, 1.2, 1.4]} radius={0.2} smoothness={4} position={[0, 0, 0]}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </RoundedBox>
                
                {/* Belly - Lighter color */}
                <RoundedBox args={[0.6, 0.8, 1]} radius={0.15} position={[0, -0.1, 0.5]} smoothness={4}>
                    <PlasticMaterial color={BELLY_COLOR} />
                </RoundedBox>
            </group>

            {/* === NECK === */}
            <Cylinder args={[0.25, 0.35, 0.5, 12]} position={[0, 0.8, -0.3]} rotation={[-0.2, 0, 0]}>
                <PlasticMaterial color={MAIN_COLOR} />
            </Cylinder>

            {/* === HEAD === */}
            <group ref={headRef} position={[0, 1.3, -0.5]}>
                {/* Main Head */}
                <RoundedBox args={[0.5, 0.45, 0.6]} radius={0.12} smoothness={4}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </RoundedBox>
                
                {/* Snout */}
                <RoundedBox args={[0.35, 0.25, 0.35]} radius={0.08} position={[0, -0.1, 0.45]} smoothness={3}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </RoundedBox>
                
                {/* Nostrils */}
                <mesh position={[-0.08, -0.05, 0.62]}>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshStandardMaterial color="#1f2937" />
                </mesh>
                <mesh position={[0.08, -0.05, 0.62]}>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshStandardMaterial color="#1f2937" />
                </mesh>
                
                {/* Eyes - Large and cute */}
                <group position={[-0.18, 0.1, 0.25]}>
                    <Sphere args={[0.12, 16, 16]}>
                        <meshStandardMaterial color="#ffffff" roughness={0.2} />
                    </Sphere>
                    <Sphere args={[0.06, 16, 16]} position={[0, 0, 0.1]}>
                        <meshStandardMaterial color="#1f2937" roughness={0.2} />
                    </Sphere>
                    <Sphere args={[0.025, 8, 8]} position={[0.03, 0.03, 0.15]}>
                        <meshBasicMaterial color="#ffffff" />
                    </Sphere>
                </group>
                <group position={[0.18, 0.1, 0.25]}>
                    <Sphere args={[0.12, 16, 16]}>
                        <meshStandardMaterial color="#ffffff" roughness={0.2} />
                    </Sphere>
                    <Sphere args={[0.06, 16, 16]} position={[0, 0, 0.1]}>
                        <meshStandardMaterial color="#1f2937" roughness={0.2} />
                    </Sphere>
                    <Sphere args={[0.025, 8, 8]} position={[0.03, 0.03, 0.15]}>
                        <meshBasicMaterial color="#ffffff" />
                    </Sphere>
                </group>
                
                {/* Horns */}
                <group position={[-0.15, 0.25, -0.15]}>
                    <Cone args={[0.08, 0.35, 8]} rotation={[0.3, 0, 0]}>
                        <PlasticMaterial color={HORN_COLOR} />
                    </Cone>
                </group>
                <group position={[0.15, 0.25, -0.15]}>
                    <Cone args={[0.08, 0.35, 8]} rotation={[0.3, 0, 0]}>
                        <PlasticMaterial color={HORN_COLOR} />
                    </Cone>
                </group>
                
                {/* Small spikes on head */}
                <Cone args={[0.05, 0.15, 8]} position={[0, 0.3, -0.2]} rotation={[0.2, 0, 0]}>
                    <PlasticMaterial color={HORN_COLOR} />
                </Cone>
            </group>

            {/* === TAIL === */}
            <group ref={tailRef} position={[0, -0.4, -0.8]}>
                <Cylinder args={[0.3, 0.15, 0.8, 8]} rotation={[0.3, 0, 0]}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </Cylinder>
                <group position={[0, -0.3, -0.5]} rotation={[0.3, 0, 0]}>
                    <Cone args={[0.2, 0.5, 8]} rotation={[Math.PI / 2, 0, 0]}>
                        <PlasticMaterial color={MAIN_COLOR} />
                    </Cone>
                    {/* Tail tip spike */}
                    <Cone args={[0.08, 0.25, 8]} position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
                        <PlasticMaterial color={HORN_COLOR} />
                    </Cone>
                </group>
            </group>

            {/* === WINGS === */}
            {/* Left Wing */}
            <group ref={leftWingRef} position={[-0.3, 0.5, -0.4]}>
                <group rotation={[0, 0, -Math.PI / 6]}>
                    {/* Wing membrane - stylized bat wing */}
                    <Torus args={[0.6, 0.04, 8, 20, Math.PI]} rotation={[0, 0, Math.PI / 4]}>
                        <PlasticMaterial color={WING_COLOR} />
                    </Torus>
                    <Torus args={[0.4, 0.03, 8, 16, Math.PI]} rotation={[0, 0, Math.PI / 4]} position={[-0.3, 0.2, 0]}>
                        <PlasticMaterial color={WING_COLOR} />
                    </Torus>
                    {/* Wing webbing */}
                    <mesh position={[-0.25, 0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
                        <planeGeometry args={[0.7, 0.5]} />
                        <meshStandardMaterial color={WING_COLOR} transparent opacity={0.7} side={THREE.DoubleSide} />
                    </mesh>
                </group>
            </group>

            {/* Right Wing */}
            <group ref={rightWingRef} position={[0.3, 0.5, -0.4]}>
                <group rotation={[0, 0, Math.PI / 6]}>
                    <Torus args={[0.6, 0.04, 8, 20, Math.PI]} rotation={[0, 0, -Math.PI / 4]}>
                        <PlasticMaterial color={WING_COLOR} />
                    </Torus>
                    <Torus args={[0.4, 0.03, 8, 16, Math.PI]} rotation={[0, 0, -Math.PI / 4]} position={[0.3, 0.2, 0]}>
                        <PlasticMaterial color={WING_COLOR} />
                    </Torus>
                    <mesh position={[0.25, 0.15, 0]} rotation={[0, 0, -Math.PI / 4]}>
                        <planeGeometry args={[0.7, 0.5]} />
                        <meshStandardMaterial color={WING_COLOR} transparent opacity={0.7} side={THREE.DoubleSide} />
                    </mesh>
                </group>
            </group>

            {/* === LEGS === */}
            {/* Front Left Leg */}
            <group position={[-0.35, -0.4, 0.4]}>
                <Cylinder args={[0.1, 0.08, 0.35, 8]} rotation={[0.5, 0, 0]}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </Cylinder>
                <Sphere args={[0.12, 8, 8]} position={[0, -0.15, 0.15]}>
                    <PlasticMaterial color={BELLY_COLOR} />
                </Sphere>
            </group>

            {/* Front Right Leg */}
            <group position={[0.35, -0.4, 0.4]}>
                <Cylinder args={[0.1, 0.08, 0.35, 8]} rotation={[0.5, 0, 0]}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </Cylinder>
                <Sphere args={[0.12, 8, 8]} position={[0, -0.15, 0.15]}>
                    <PlasticMaterial color={BELLY_COLOR} />
                </Sphere>
            </group>

            {/* Back Left Leg */}
            <group position={[-0.35, -0.6, -0.3]}>
                <Cylinder args={[0.12, 0.1, 0.4, 8]} rotation={[0.3, 0, 0]}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </Cylinder>
                <Sphere args={[0.14, 8, 8]} position={[0, -0.18, -0.15]}>
                    <PlasticMaterial color={BELLY_COLOR} />
                </Sphere>
            </group>

            {/* Back Right Leg */}
            <group position={[0.35, -0.6, -0.3]}>
                <Cylinder args={[0.12, 0.1, 0.4, 8]} rotation={[0.3, 0, 0]}>
                    <PlasticMaterial color={MAIN_COLOR} />
                </Cylinder>
                <Sphere args={[0.14, 8, 8]} position={[0, -0.18, -0.15]}>
                    <PlasticMaterial color={BELLY_COLOR} />
                </Sphere>
            </group>

            {/* === SMALL BACK SPIKES === */}
            <group position={[0, 0.3, -0.6]}>
                <Cone args={[0.06, 0.12, 8]} rotation={[0.3, 0, 0]}>
                    <PlasticMaterial color={HORN_COLOR} />
                </Cone>
            </group>
            <group position={[0, 0.1, -0.7]}>
                <Cone args={[0.05, 0.1, 8]} rotation={[0.4, 0, 0]}>
                    <PlasticMaterial color={HORN_COLOR} />
                </Cone>
            </group>

        </group>
    );
};

export default React.memo(Dragon3D);
