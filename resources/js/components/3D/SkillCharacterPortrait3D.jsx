import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const ClayMaterial = ({ color = '#efefec' }) => {
    return <meshStandardMaterial color={color} roughness={0.88} metalness={0.02} envMapIntensity={0.6} />;
};

const SkillCharacterPortrait3D = ({ basePositionY = 0, baseRotationY = 0, ...props }) => {
    const groupRef = useRef();
    const headRef = useRef();
    const shouldersRef = useRef();

    useFrame((state) => {
        const elapsedTime = state.clock.getElapsedTime();

        if (groupRef.current) {
            groupRef.current.rotation.y = baseRotationY + Math.sin(elapsedTime * 0.42) * 0.11;
            groupRef.current.position.y = basePositionY + Math.sin(elapsedTime * 0.86) * 0.06;
        }

        if (headRef.current) {
            headRef.current.rotation.x = -0.03 + Math.sin(elapsedTime * 0.74) * 0.018;
            headRef.current.rotation.z = Math.sin(elapsedTime * 0.53) * 0.02;
        }

        if (shouldersRef.current) {
            shouldersRef.current.rotation.z = Math.sin(elapsedTime * 0.36) * 0.012;
        }
    });

    return (
        <group ref={groupRef} {...props}>
            <group ref={shouldersRef}>
                <mesh position={[0, -2.1, 0]} scale={[3.45, 1.45, 2.28]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 64, 64]} />
                    <ClayMaterial color="#f0f0ed" />
                </mesh>

                <mesh position={[0, -1.38, 0.1]} scale={[2.1, 1.8, 1.42]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 64, 64]} />
                    <ClayMaterial />
                </mesh>

                <mesh position={[-1.58, -1.82, 0.02]} scale={[1.16, 0.84, 1.1]} rotation={[0, 0, 0.42]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 48, 48]} />
                    <ClayMaterial />
                </mesh>

                <mesh position={[1.58, -1.82, 0.02]} scale={[1.16, 0.84, 1.1]} rotation={[0, 0, -0.42]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 48, 48]} />
                    <ClayMaterial />
                </mesh>

                <mesh position={[0, -0.58, 0]} scale={[0.86, 1.06, 0.82]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.56, 0.72, 1.45, 48]} />
                    <ClayMaterial color="#ecece8" />
                </mesh>
            </group>

            <group ref={headRef} position={[0, 0.96, 0.1]}>
                <mesh position={[0, 0.25, 0]} scale={[1.1, 1.36, 1.02]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 80, 80]} />
                    <ClayMaterial />
                </mesh>

                <mesh position={[0, -0.42, 0.18]} scale={[0.82, 0.56, 0.8]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 56, 56]} />
                    <ClayMaterial color="#f2f2ef" />
                </mesh>

                <mesh position={[0, 1.22, -0.02]} scale={[0.82, 0.45, 0.72]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 48, 48]} />
                    <ClayMaterial color="#f5f5f2" />
                </mesh>

                <mesh position={[-0.54, -0.08, 0.38]} scale={[0.46, 0.62, 0.5]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 40, 40]} />
                    <ClayMaterial color="#f0f0ed" />
                </mesh>

                <mesh position={[0.54, -0.08, 0.38]} scale={[0.46, 0.62, 0.5]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 40, 40]} />
                    <ClayMaterial color="#f0f0ed" />
                </mesh>

                <mesh position={[-1.01, -0.12, 0.02]} scale={[0.22, 0.42, 0.22]} rotation={[0, 0, 0.1]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 32, 32]} />
                    <ClayMaterial />
                </mesh>

                <mesh position={[1.01, -0.12, 0.02]} scale={[0.22, 0.42, 0.22]} rotation={[0, 0, -0.1]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 32, 32]} />
                    <ClayMaterial />
                </mesh>

                <mesh position={[0, -0.08, 0.7]} scale={[0.22, 0.44, 0.22]} castShadow receiveShadow>
                    <capsuleGeometry args={[0.24, 0.24, 8, 18]} />
                    <ClayMaterial color="#e7e7e3" />
                </mesh>

                <mesh position={[0, -0.34, 0.86]} scale={[0.34, 0.16, 0.18]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 28, 28]} />
                    <ClayMaterial color="#ededea" />
                </mesh>

                <mesh position={[0, 0.16, 0.67]} scale={[0.25, 0.2, 0.18]} castShadow receiveShadow>
                    <sphereGeometry args={[1, 28, 28]} />
                    <ClayMaterial color="#ecece8" />
                </mesh>

                <mesh position={[-0.34, 0.28, 0.73]} rotation={[0.2, 0.16, -0.1]} scale={[0.34, 0.045, 0.12]} castShadow receiveShadow>
                    <capsuleGeometry args={[0.12, 0.76, 6, 18]} />
                    <ClayMaterial color="#d6d6d1" />
                </mesh>

                <mesh position={[0.34, 0.28, 0.73]} rotation={[0.2, -0.16, 0.1]} scale={[0.34, 0.045, 0.12]} castShadow receiveShadow>
                    <capsuleGeometry args={[0.12, 0.76, 6, 18]} />
                    <ClayMaterial color="#d6d6d1" />
                </mesh>

                <mesh position={[-0.34, 0.42, 0.62]} rotation={[0.18, 0.1, -0.12]} scale={[0.42, 0.11, 0.14]} castShadow receiveShadow>
                    <capsuleGeometry args={[0.12, 0.78, 6, 18]} />
                    <ClayMaterial color="#e2e2dd" />
                </mesh>

                <mesh position={[0.34, 0.42, 0.62]} rotation={[0.18, -0.1, 0.12]} scale={[0.42, 0.11, 0.14]} castShadow receiveShadow>
                    <capsuleGeometry args={[0.12, 0.78, 6, 18]} />
                    <ClayMaterial color="#e2e2dd" />
                </mesh>

                <mesh position={[0, -0.7, 0.73]} rotation={[-0.1, 0, 0]} scale={[0.5, 0.055, 0.14]} castShadow receiveShadow>
                    <capsuleGeometry args={[0.1, 0.92, 6, 18]} />
                    <ClayMaterial color="#d5d5cf" />
                </mesh>
            </group>
        </group>
    );
};

export default React.memo(SkillCharacterPortrait3D);
