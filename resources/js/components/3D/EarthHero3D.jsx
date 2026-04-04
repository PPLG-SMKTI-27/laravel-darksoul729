import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const drawBlob = (context, points, fillStyle) => {
    if (points.length === 0) {
        return;
    }

    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);

    for (let index = 0; index < points.length; index += 1) {
        const currentPoint = points[index];
        const nextPoint = points[(index + 1) % points.length];
        const controlX = (currentPoint[0] + nextPoint[0]) / 2;
        const controlY = (currentPoint[1] + nextPoint[1]) / 2;

        context.quadraticCurveTo(currentPoint[0], currentPoint[1], controlX, controlY);
    }
natural”, tapi kalau mau benar-benar seamless seperti shared-scene transition, langkah berikutnya adalah pakai satu canvas ship yang sama antara intro dan hero, bukan dua layer terpisah. Itu lebih kompleks, tapi itu yang bikin transisi benar-benar nyatu.
    context.closePath();
    context.fillStyle = fillStyle;
    context.fill();
};

const createEarthTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;

    const context = canvas.getContext('2d');

    if (!context) {
        return null;
    }

    const oceanGradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    oceanGradient.addColorStop(0, '#04142f');
    oceanGradient.addColorStop(0.38, '#0d4ea6');
    oceanGradient.addColorStop(0.7, '#1f7ed6');
    oceanGradient.addColorStop(1, '#07192d');
    Saya cek cepat asset lokal yang memang sudah pernah dipakai di codebase. Kalau file-nya ada, saya swap sekarang dan b

    context.fillStyle = oceanGradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const lightBloom = context.createRadialGradient(700, 320, 80, 960, 380, 860);
    lightBloom.addColorStop(0, 'rgba(140, 220, 255, 0.55)');
    lightBloom.addColorStop(0.45, 'rgba(52, 144, 255, 0.18)');
    lightBloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = lightBloom;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const continentColors = ['#325d2f', '#5d8f45', '#7db15f', '#9cca6d'];
    const continentBlobs = [
        [[240, 280], [340, 210], [470, 230], [540, 340], [510, 450], [390, 500], [260, 440], [210, 350]],
        [[620, 170], [780, 130], [920, 220], [910, 340], [800, 380], [670, 330], [590, 250]],
        [[920, 520], [1030, 430], [1190, 460], [1280, 560], [1210, 700], [1040, 730], [910, 640]],
        [[1390, 210], [1540, 170], [1710, 250], [1770, 380], [1670, 520], [1490, 490], [1370, 350]],
        [[1500, 610], [1640, 560], [1780, 620], [1835, 760], [1710, 850], [1540, 790], [1460, 700]],
    ];

    continentBlobs.forEach((blob, index) => {
        drawBlob(context, blob, continentColors[index % continentColors.length]);
    });

    context.globalAlpha = 0.22;
    for (let index = 0; index < 22; index += 1) {
        context.fillStyle = index % 2 === 0 ? '#b6da80' : '#d5ed9e';
        drawBlob(context, [
            [160 + index * 75, 110 + (index % 4) * 40],
            [230 + index * 75, 85 + (index % 3) * 25],
            [320 + index * 75, 125 + (index % 2) * 30],
            [260 + index * 75, 200 + (index % 4) * 24],
            [180 + index * 75, 180 + (index % 2) * 30],
        ], context.fillStyle);
    }
    context.globalAlpha = 1;

    context.strokeStyle = 'rgba(255,255,255,0.65)';
    context.lineWidth = 18;
    context.lineCap = 'round';
    const cloudBands = [
        [180, 260, 580, 220, 960, 260, 1340, 230, 1760, 260],
        [100, 560, 450, 520, 760, 570, 1080, 520, 1520, 590],
        [380, 760, 770, 700, 1090, 760, 1410, 720, 1700, 790],
    ];

    cloudBands.forEach((band, index) => {
        context.beginPath();
        context.moveTo(band[0], band[1]);
        for (let point = 2; point < band.length; point += 4) {
            context.bezierCurveTo(
                band[point - 2],
                band[point - 1] - 24 + index * 8,
                band[point],
                band[point + 1] + 24 - index * 8,
                band[point + 2] ?? band[point],
                band[point + 3] ?? band[point + 1],
            );
        }
        context.stroke();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    texture.needsUpdate = true;

    return texture;
};

const EarthHero3D = (props) => {
    const groupRef = useRef();
    const atmosphereRef = useRef();
    const cloudRef = useRef();
    const rimRef = useRef();
    const texture = useMemo(() => createEarthTexture(), []);
    const baseRotationZ = Array.isArray(props.rotation) ? (props.rotation[2] ?? 0) : 0;

    useEffect(() => {
        return () => {
            if (texture) {
                texture.dispose();
            }
        };
    }, [texture]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.12;
            groupRef.current.rotation.z = baseRotationZ + Math.sin(state.clock.getElapsedTime() * 0.22) * 0.02;
        }

        if (cloudRef.current) {
            cloudRef.current.rotation.y += delta * 0.016;
        }

        if (atmosphereRef.current) {
            const pulse = 1.12 + Math.sin(state.clock.getElapsedTime() * 0.7) * 0.008;
            atmosphereRef.current.scale.setScalar(pulse);
        }

        if (rimRef.current) {
            rimRef.current.material.opacity = 0.2 + Math.sin(state.clock.getElapsedTime() * 1.1) * 0.025;
        }
    });

    return (
        <group ref={groupRef} {...props}>
            <mesh>
                <sphereGeometry args={[1, 72, 72]} />
                <meshStandardMaterial
                    map={texture ?? undefined}
                    roughness={0.9}
                    metalness={0.02}
                    emissive="#06101f"
                    emissiveIntensity={0.12}
                />
            </mesh>

            <mesh ref={cloudRef} scale={1.02}>
                <sphereGeometry args={[1, 48, 48]} />
                <meshStandardMaterial
                    color="#f8fbff"
                    transparent
                    opacity={0.09}
                    roughness={0.25}
                    depthWrite={false}
                />
            </mesh>

            <mesh ref={atmosphereRef} scale={1.12}>
                <sphereGeometry args={[1, 48, 48]} />
                <meshBasicMaterial
                    color="#6dc9ff"
                    transparent
                    opacity={0.14}
                    side={THREE.BackSide}
                />
            </mesh>

            <mesh scale={1.19}>
                <sphereGeometry args={[1, 48, 48]} />
                <meshBasicMaterial
                    color="#1d4ed8"
                    transparent
                    opacity={0.04}
                    side={THREE.BackSide}
                />
            </mesh>

            <mesh ref={rimRef} position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.34, 1.34, 1]}>
                <torusGeometry args={[1, 0.03, 12, 96, Math.PI]} />
                <meshBasicMaterial
                    color="#7ef9d8"
                    transparent
                    opacity={0.2}
                />
            </mesh>
        </group>
    );
};

export default React.memo(EarthHero3D);
