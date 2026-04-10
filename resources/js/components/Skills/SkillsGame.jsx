import React, { useEffect, useRef, useState } from 'react';
import { Footprints, LogIn, LogOut, Move, Orbit, PanelRightOpen, Scan, Sprout } from 'lucide-react';
import * as THREE from 'three';
import { navigateWithCleanup } from '../../lib/pageTransitionCleanup';

const ROOM_SYNC_INTERVAL_SECONDS = 0.22;
const HUD_RAYCAST_INTERVAL_SECONDS = 0.08;
const LANDING_IMPACT_DECAY = 7.5;
const COLLECTION_RADIUS = 6.5;
const INTERACTION_RADIUS = 7.5;
const WATER_LEVEL = -0.8;
const MAIN_ISLAND_RADIUS = 74;
const MAIN_ISLAND_CENTER = new THREE.Vector3(0, 0, 0);
const DOCK_CENTER = new THREE.Vector3(8, 0, 64);
const SHORE_EXIT_POINT = new THREE.Vector3(8, 0, 52);
const START_BOAT_POSITION = new THREE.Vector3(8, 0, 88);
const CAMERA_MODES = ['third-back', 'third-front'];
const DOCK_CHANNEL_WIDTH = 8.5;
const DOCK_CHANNEL_START_Z = 56;
const DOCK_CHANNEL_END_Z = 96;
const CHARACTER_FOOT_OFFSET = 0.38;
const DOCK_SURFACE_Y = 0.56;
const DOCK_SHORE_PLATFORM_Z = 60.5;
const DOCK_PIER_HALF_WIDTH = 3.1;
const DOCK_PIER_START_Z = 62;
const DOCK_PIER_END_Z = 82;
const DOCK_BERTH_POINT = new THREE.Vector3(8, 0, 89.2);
const DOCK_LAND_POINT = new THREE.Vector3(DOCK_CENTER.x, 0, 60.8);
const DOCK_ACCESS_CENTER_X = DOCK_CENTER.x;
const DOCK_ACCESS_CENTER_Z = 57.7;
const DOCK_ACCESS_HALF_WIDTH = 2.45;
const DOCK_ACCESS_HALF_DEPTH = 3.2;
const DOCK_STAIR_TOP_Y = 1.84;
const DOCK_STEP_COUNT = 10;
const HOUSE_CENTER = new THREE.Vector3(40, 0, -38);
const HOUSE_HALF_WIDTH = 4.6;
const HOUSE_HALF_DEPTH = 4.9;
const HOUSE_DOOR_HALF_WIDTH = 1.15;
const EASTER_EGG_POSITION = new THREE.Vector3(-46, 0, -34);
const DEBUG_DOCK_OVERLAY = false;

const SKILLS = [
    { name: 'Laravel', color: '#FF2D20', category: 'Backend Citadel', zone: 'Laravel Bay', position: [-22, 0, 8] },
    { name: 'React', color: '#61DAFB', category: 'Frontend Harbor', zone: 'React Pier', position: [20, 0, 10] },
    { name: 'Three.js', color: '#E2E8F0', category: '3D Forge', zone: 'Three Ridge', position: [0, 0, -20] },
    { name: 'JavaScript', color: '#F7DF1E', category: 'Logic Beacon', zone: 'JS Steps', position: [30, 0, -2] },
    { name: 'PHP', color: '#8993BE', category: 'Server Bastion', zone: 'PHP Point', position: [-30, 0, -4] },
    { name: 'TailwindCSS', color: '#38BDF8', category: 'UI Garden', zone: 'Tailwind Grove', position: [36, 0, -30] },
    { name: 'MySQL', color: '#4479A1', category: 'Data Vault', zone: 'MySQL Basin', position: [-36, 0, -28] },
    { name: 'Node.js', color: '#539E43', category: 'Runtime Yard', zone: 'Node Camp', position: [14, 0, -42] },
    { name: 'Docker', color: '#2496ED', category: 'Deploy Dock', zone: 'Docker Wharf', position: [-12, 0, 32] },
    { name: 'Git', color: '#F05032', category: 'Version Outpost', zone: 'Git Trail', position: [0, 0, 38] },
    { name: 'Vite', color: '#BD34FE', category: 'Build Relay', zone: 'Vite Cliffs', position: [44, 0, 22] },
    { name: 'CSS3', color: '#1572B6', category: 'Style Terrace', zone: 'CSS Terrace', position: [-44, 0, 22] },
];

const WAVE_PARAMS = [
    { dir: [1.0, 0.5], steep: 0.05, len: 46 },
    { dir: [0.4, 1.0], steep: 0.038, len: 28 },
    { dir: [-0.7, 0.5], steep: 0.024, len: 18 },
];

function normalizeHexColor(color, fallbackColor = '#7dd3fc') {
    const normalizedColor = typeof color === 'string' ? color.trim() : '';

    return /^#[0-9a-fA-F]{6}$/.test(normalizedColor) ? normalizedColor : fallbackColor;
}

function parseHexColor(color, fallbackColor = '#7dd3fc') {
    return Number.parseInt(normalizeHexColor(color, fallbackColor).slice(1), 16);
}

function normalizeSkill(skill, index = 0) {
    const fallbackSkill = SKILLS[index % SKILLS.length] ?? SKILLS[0];

    return {
        ...fallbackSkill,
        ...skill,
        color: normalizeHexColor(skill?.color, fallbackSkill.color),
    };
}

function waveHeight(x, z, t) {
    let height = 0;

    for (const wave of WAVE_PARAMS) {
        const [dx, dz] = wave.dir;
        const length = Math.sqrt(dx * dx + dz * dz);
        const nx = dx / length;
        const nz = dz / length;
        const k = (2 * Math.PI) / wave.len;
        const c = Math.sqrt(9.8 / k);
        const phase = k * (nx * x + nz * z) - c * (t * 0.28);
        height += (wave.steep / k) * Math.sin(phase);
    }

    return WATER_LEVEL + height;
}

function getDockApproachCarve(x, z) {
    const lateralFade = THREE.MathUtils.clamp(1 - Math.abs(x - DOCK_CENTER.x) / 11.5, 0, 1);
    const innerLane = THREE.MathUtils.clamp(1 - Math.abs(x - DOCK_CENTER.x) / 6.2, 0, 1);
    const forwardFade = THREE.MathUtils.clamp(1 - Math.abs(z - 55.2) / 8.2, 0, 1);
    const shelfFade = THREE.MathUtils.clamp(1 - Math.abs(z - 55.1) / 3.2, 0, 1);

    return lateralFade * forwardFade * 1.3 + innerLane * shelfFade * 0.55;
}

function getHouseTerraceLift(x, z) {
    const dx = x - HOUSE_CENTER.x;
    const dz = z - HOUSE_CENTER.z;
    const radial = Math.sqrt((dx * dx) / 68 + (dz * dz) / 84);
    const plateauMask = THREE.MathUtils.clamp(1 - radial, 0, 1);
    const frontApron = THREE.MathUtils.clamp(1 - Math.abs(dz - 5.4) / 4.8, 0, 1) * THREE.MathUtils.clamp(1 - Math.abs(dx) / 5.6, 0, 1);

    return plateauMask * 1.75 + frontApron * 0.5;
}

function getSwellHeight(x, z, t, swellState) {
    if (!swellState || t < swellState.startAt || t > swellState.endAt) {
        return 0;
    }

    const progress = (t - swellState.startAt) / Math.max(swellState.endAt - swellState.startAt, 0.001);
    const envelope = Math.sin(progress * Math.PI);
    const dx = x - swellState.origin.x;
    const dz = z - swellState.origin.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    const directionPhase = (dx * swellState.direction.x + dz * swellState.direction.z) * 0.08;

    return Math.sin(t * swellState.frequency + directionPhase - distance * 0.035) * swellState.amplitude * envelope;
}

function islandHeightAt(x, z) {
    const dx = x - MAIN_ISLAND_CENTER.x;
    const dz = z - MAIN_ISLAND_CENTER.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance >= MAIN_ISLAND_RADIUS) {
        return null;
    }

    const insideDockChannel =
        Math.abs(x - DOCK_CENTER.x) <= getDockChannelHalfWidthAt(z) &&
        z >= DOCK_CHANNEL_START_Z &&
        z <= DOCK_CHANNEL_END_Z;

    if (insideDockChannel) {
        return null;
    }

    const normalized = distance / MAIN_ISLAND_RADIUS;
    const base = (1 - normalized * normalized) * 10.5;
    const terrace = Math.sin(dx * 0.08) * 0.75 + Math.cos(dz * 0.06) * 0.7;
    const ridge = Math.sin((dx + dz) * 0.045) * 0.9;
    const shoreline = Math.max(0, 1 - normalized * 1.22);

    const dockApproachCarve = getDockApproachCarve(x, z);
    const houseTerraceLift = getHouseTerraceLift(x, z);

    return Math.max(0.25, base * 0.82 + terrace + ridge * shoreline - dockApproachCarve + houseTerraceLift);
}

function isInsideDockChannel(x, z, padding = 0) {
    return (
        Math.abs(x - DOCK_CENTER.x) <= getDockChannelHalfWidthAt(z, padding) &&
        z >= DOCK_CHANNEL_START_Z - padding &&
        z <= DOCK_CHANNEL_END_Z + padding
    );
}

function getDockChannelHalfWidthAt(z, padding = 0) {
    if (z <= DOCK_CHANNEL_START_Z) {
        return 3.4 + padding;
    }

    const widenProgress = THREE.MathUtils.clamp((z - DOCK_CHANNEL_START_Z) / 11, 0, 1);

    return THREE.MathUtils.lerp(3.4 + padding, DOCK_CHANNEL_WIDTH + padding, widenProgress);
}

function isSolidIslandAt(x, z, padding = 0) {
    const dx = x - MAIN_ISLAND_CENTER.x;
    const dz = z - MAIN_ISLAND_CENTER.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance >= MAIN_ISLAND_RADIUS + padding) {
        return false;
    }

    if (isInsideDockChannel(x, z, padding * 0.5)) {
        return false;
    }

    return true;
}

function isInsideDockSurface(x, z, padding = 0) {
    const onShorePlatform =
        Math.abs(x - DOCK_CENTER.x) <= 2.9 + padding &&
        z >= 59.8 - padding &&
        z <= 62.4 + padding;
    const onMainPier =
        Math.abs(x - DOCK_CENTER.x) <= DOCK_PIER_HALF_WIDTH + padding &&
        z >= DOCK_PIER_START_Z - padding &&
        z <= DOCK_PIER_END_Z + padding;
    const onBoardingPad =
        Math.abs(x - DOCK_CENTER.x) <= 2.9 + padding &&
        z >= 69.4 - padding &&
        z <= 76.4 + padding;
    const onAccess =
        Math.abs(x - DOCK_ACCESS_CENTER_X) <= DOCK_ACCESS_HALF_WIDTH + padding &&
        Math.abs(z - DOCK_ACCESS_CENTER_Z) <= DOCK_ACCESS_HALF_DEPTH + padding;

    return onShorePlatform || onMainPier || onBoardingPad || onAccess;
}

function isDockSolidAt(x, z, padding = 0) {
    const onShorePlatform =
        Math.abs(x - DOCK_CENTER.x) <= 2.9 + padding &&
        z >= 59.8 - padding &&
        z <= 62.4 + padding;
    const onMainPier =
        Math.abs(x - DOCK_CENTER.x) <= DOCK_PIER_HALF_WIDTH + padding &&
        z >= DOCK_PIER_START_Z - padding &&
        z <= DOCK_PIER_END_Z + padding;
    const onBoardingPad =
        Math.abs(x - DOCK_CENTER.x) <= 2.9 + padding &&
        z >= 69.4 - padding &&
        z <= 76.4 + padding;
    const onAccess =
        Math.abs(x - DOCK_ACCESS_CENTER_X) <= DOCK_ACCESS_HALF_WIDTH + padding &&
        Math.abs(z - DOCK_ACCESS_CENTER_Z) <= DOCK_ACCESS_HALF_DEPTH + padding;

    return onShorePlatform || onMainPier || onBoardingPad || onAccess;
}

function getDockSurfaceHeightAt(x, z) {
    const stairStartZ = DOCK_ACCESS_CENTER_Z - DOCK_ACCESS_HALF_DEPTH;
    const stairEndZ = DOCK_ACCESS_CENTER_Z + DOCK_ACCESS_HALF_DEPTH;
    const stairBaseY = DOCK_SURFACE_Y + 0.14;

    if (
        Math.abs(x - DOCK_CENTER.x) <= 2.9 &&
        z >= 69.4 &&
        z <= 76.4
    ) {
        return DOCK_SURFACE_Y + 0.14;
    }

    if (
        Math.abs(x - DOCK_CENTER.x) <= DOCK_PIER_HALF_WIDTH &&
        z >= DOCK_PIER_START_Z &&
        z <= DOCK_PIER_END_Z
    ) {
        return DOCK_SURFACE_Y + 0.14;
    }

    if (
        Math.abs(x - DOCK_CENTER.x) <= 2.9 &&
        z >= 59.8 &&
        z <= 62.4
    ) {
        return stairBaseY;
    }

    if (
        Math.abs(x - DOCK_ACCESS_CENTER_X) <= DOCK_ACCESS_HALF_WIDTH &&
        Math.abs(z - DOCK_ACCESS_CENTER_Z) <= DOCK_ACCESS_HALF_DEPTH
    ) {
        const progress = THREE.MathUtils.clamp((stairEndZ - z) / (stairEndZ - stairStartZ), 0, 0.9999);
        const stepIndex = Math.floor(progress * DOCK_STEP_COUNT);
        const risePerStep = (DOCK_STAIR_TOP_Y - stairBaseY) / DOCK_STEP_COUNT;

        return stairBaseY + risePerStep * (stepIndex + 1);
    }

    return null;
}

function getGroundHeightAt(x, z) {
    const islandHeight = islandHeightAt(x, z);
    const dockHeight = getDockSurfaceHeightAt(x, z);
    const housePadHeight = (() => {
        const withinHousePad =
            Math.abs(x - HOUSE_CENTER.x) <= HOUSE_HALF_WIDTH - 0.4 &&
            Math.abs(z - HOUSE_CENTER.z) <= HOUSE_HALF_DEPTH - 0.38;

        if (!withinHousePad) {
            return null;
        }

        const houseBaseHeight = islandHeightAt(HOUSE_CENTER.x, HOUSE_CENTER.z);

        return houseBaseHeight === null ? null : houseBaseHeight + 0.52;
    })();

    if (dockHeight !== null || housePadHeight !== null) {
        return Math.max(islandHeight ?? -Infinity, dockHeight ?? -Infinity, housePadHeight ?? -Infinity);
    }

    return islandHeight;
}

function getForwardVector(angle) {
    return new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
}

function getRightVector(angle) {
    return new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle));
}

function distanceToSegment2D(px, pz, ax, az, bx, bz) {
    const abx = bx - ax;
    const abz = bz - az;
    const abLengthSquared = abx * abx + abz * abz;

    if (abLengthSquared === 0) {
        return Math.hypot(px - ax, pz - az);
    }

    const t = THREE.MathUtils.clamp(((px - ax) * abx + (pz - az) * abz) / abLengthSquared, 0, 1);
    const closestX = ax + abx * t;
    const closestZ = az + abz * t;

    return Math.hypot(px - closestX, pz - closestZ);
}

function isFiniteVector3(vector) {
    return Number.isFinite(vector.x) && Number.isFinite(vector.y) && Number.isFinite(vector.z);
}

function isPointBlockedByObstacle(point, obstacleColliders, padding = 0) {
    return obstacleColliders.some((collider) => {
        if (collider.shape === 'box') {
            return (
                Math.abs(point.x - collider.position.x) <= collider.halfWidth + padding &&
                Math.abs(point.z - collider.position.z) <= collider.halfDepth + padding
            );
        }

        return collider.position.distanceToSquared(point) < (collider.radius + padding) ** 2;
    });
}

function islandNormalAt(x, z) {
    const sampleOffset = 0.6;
    const hL = getGroundHeightAt(x - sampleOffset, z) ?? 0;
    const hR = getGroundHeightAt(x + sampleOffset, z) ?? 0;
    const hD = getGroundHeightAt(x, z - sampleOffset) ?? 0;
    const hU = getGroundHeightAt(x, z + sampleOffset) ?? 0;
    const normal = new THREE.Vector3(hL - hR, sampleOffset * 2, hD - hU);

    return normal.normalize();
}

function buildSharedAssets() {
    return {
        materials: {
            sand: new THREE.MeshStandardMaterial({ color: 0xd9c38c, roughness: 1.0 }),
            grass: new THREE.MeshStandardMaterial({ color: 0x6f9f49, roughness: 0.95 }),
            meadowGrass: new THREE.MeshStandardMaterial({ color: 0x8fbb4f, roughness: 0.94 }),
            brightGrass: new THREE.MeshStandardMaterial({ color: 0xc0d85d, roughness: 0.92 }),
            darkGrass: new THREE.MeshStandardMaterial({ color: 0x456b35, roughness: 0.96 }),
            soil: new THREE.MeshStandardMaterial({ color: 0xb99b69, roughness: 0.98 }),
            rock: new THREE.MeshStandardMaterial({ color: 0x6b7d88, roughness: 0.98 }),
            wood: new THREE.MeshStandardMaterial({ color: 0x85552a, roughness: 0.96 }),
            woodDark: new THREE.MeshStandardMaterial({ color: 0x5c371b, roughness: 0.98 }),
            sail: new THREE.MeshStandardMaterial({ color: 0xe9e4d2, roughness: 0.9 }),
            rope: new THREE.MeshStandardMaterial({ color: 0xc89b62, roughness: 0.94 }),
            metal: new THREE.MeshStandardMaterial({ color: 0xb3c6d5, roughness: 0.45, metalness: 0.08 }),
            skin: new THREE.MeshStandardMaterial({ color: 0xf2d1b0, roughness: 0.92 }),
            cloth: new THREE.MeshStandardMaterial({ color: 0x10253c, roughness: 0.9 }),
            clothAlt: new THREE.MeshStandardMaterial({ color: 0x0f3d5b, roughness: 0.88 }),
            white: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85 }),
            crystal: new THREE.MeshStandardMaterial({ color: 0x7dd3fc, roughness: 0.2, emissive: 0x16324b, emissiveIntensity: 0.35 }),
            boardFrame: new THREE.MeshStandardMaterial({ color: 0x2e2218, roughness: 0.95 }),
            flowerWhite: new THREE.MeshStandardMaterial({ color: 0xfff8dd, roughness: 0.88 }),
            flowerCream: new THREE.MeshStandardMaterial({ color: 0xf8efc1, roughness: 0.88 }),
            flowerCenter: new THREE.MeshStandardMaterial({ color: 0xd9b24c, roughness: 0.8 }),
        },
        geometries: {
            trunk: new THREE.CylinderGeometry(0.16, 0.2, 3.8, 6),
            palmLeaf: new THREE.ConeGeometry(0.48, 2.1, 5),
            grassTuft: new THREE.ConeGeometry(0.38, 1.3, 5),
            flowerStem: new THREE.CylinderGeometry(0.018, 0.028, 0.52, 5),
            flowerPetal: new THREE.SphereGeometry(0.075, 6, 6),
            flowerCenter: new THREE.SphereGeometry(0.06, 6, 6),
            beaconCrystal: new THREE.OctahedronGeometry(0.9, 0),
            beaconBase: new THREE.CylinderGeometry(1.1, 1.55, 1.1, 8),
            pole: new THREE.CylinderGeometry(0.11, 0.13, 2.8, 6),
            dockPost: new THREE.BoxGeometry(0.34, 2.6, 0.34),
            dockPlank: new THREE.BoxGeometry(2.8, 0.18, 0.72),
            hull: new THREE.BoxGeometry(6.4, 1.2, 3.2),
            deck: new THREE.BoxGeometry(5.2, 0.18, 2.5),
            mast: new THREE.CylinderGeometry(0.12, 0.16, 5.6, 6),
            sail: new THREE.PlaneGeometry(2.6, 3.6),
            head: new THREE.BoxGeometry(0.56, 0.56, 0.56),
            torso: new THREE.BoxGeometry(0.72, 0.95, 0.42),
            arm: new THREE.BoxGeometry(0.18, 0.72, 0.18),
            leg: new THREE.BoxGeometry(0.22, 0.8, 0.22),
            shoulderPad: new THREE.BoxGeometry(0.26, 0.14, 0.24),
            hat: new THREE.ConeGeometry(0.36, 0.44, 6),
            cabin: new THREE.BoxGeometry(1.8, 1.15, 1.2),
            bow: new THREE.CylinderGeometry(0.14, 0.28, 1.6, 6),
        },
    };
}

function createCloudTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let index = 0; index < 4; index += 1) {
        const x = 70 + Math.random() * 120;
        const y = 90 + Math.random() * 80;
        const radius = 34 + Math.random() * 44;
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255,255,255,0.82)');
        gradient.addColorStop(0.65, 'rgba(228,238,248,0.42)');
        gradient.addColorStop(1, 'rgba(228,238,248,0)');
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
    }

    return new THREE.CanvasTexture(canvas);
}

function createSkyBeam(accentColor) {
    const beamGroup = new THREE.Group();
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 4.8, 150, 18, 1, true),
        beamMaterial,
    );
    beam.position.y = 75;
    beamGroup.add(beam);

    const innerBeam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 1.3, 166, 12, 1, true),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
        }),
    );
    innerBeam.position.y = 83;
    beamGroup.add(innerBeam);

    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(2.8, 18, 18),
        new THREE.MeshBasicMaterial({
            color: accentColor,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        }),
    );
    glow.position.y = 8;
    beamGroup.add(glow);

    beamGroup.visible = false;
    beamGroup.userData = {
        beam,
        innerBeam,
        glow,
        baseColor: accentColor,
        phase: Math.random() * Math.PI * 2,
    };

    return beamGroup;
}

function createSkillTexture(skill) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const accent = normalizeHexColor(skill.color);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#22160f';
    roundRect(context, 18, 18, 476, 220, 16);
    context.fill();

    context.strokeStyle = 'rgba(255,255,255,0.08)';
    context.lineWidth = 3;
    roundRect(context, 26, 26, 460, 204, 12);
    context.stroke();

    context.fillStyle = accent;
    context.fillRect(38, 42, 90, 90);
    context.fillStyle = '#0f172a';
    context.font = 'bold 56px "Courier New", monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(skill.name[0], 84, 88);

    context.textAlign = 'left';
    context.fillStyle = '#f8fafc';
    context.font = 'bold 48px "Courier New", monospace';
    context.fillText(skill.name.toUpperCase(), 152, 98);

    context.fillStyle = accent;
    context.font = 'bold 20px "Courier New", monospace';
    context.fillText(skill.zone.toUpperCase(), 152, 140);

    context.fillStyle = 'rgba(248,250,252,0.72)';
    context.font = '16px "Courier New", monospace';
    context.fillText(skill.category.toUpperCase(), 152, 174);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
}

function createNameBadge(label, accentColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 120;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(84, 59, 42, 0.96)';
    roundRect(context, 12, 16, 376, 88, 20);
    context.fill();
    context.strokeStyle = 'rgba(33,23,15,0.94)';
    context.lineWidth = 8;
    context.stroke();

    context.strokeStyle = 'rgba(217,161,95,0.42)';
    context.lineWidth = 2;
    roundRect(context, 22, 24, 356, 72, 16);
    context.stroke();

    context.fillStyle = `#${accentColor.toString(16).padStart(6, '0')}`;
    context.fillRect(34, 36, 48, 48);
    context.fillStyle = '#1b130d';
    context.font = 'bold 26px "Courier New", monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(label.slice(0, 1).toUpperCase(), 58, 60);

    context.fillStyle = '#f8fafc';
    context.font = 'bold 30px "Courier New", monospace';
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(label, 102, canvas.height / 2 + 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        depthTest: false,
    }));
    sprite.scale.set(3.1, 0.94, 1);
    sprite.position.set(0, 6.9, 0);
    sprite.renderOrder = 20;

    return sprite;
}

function disposeNameBadge(badge) {
    badge?.material?.map?.dispose?.();
    badge?.material?.dispose?.();
}

function normalizePlayerName(name) {
    return (typeof name === 'string' ? name : '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 24);
}

function replaceNameBadge(parent, currentBadge, label, accentColor, visible = true) {
    if (!parent) {
        return currentBadge;
    }

    if (currentBadge?.parent === parent) {
        parent.remove(currentBadge);
    }

    disposeNameBadge(currentBadge);

    const nextBadge = createNameBadge(label, accentColor);
    nextBadge.visible = visible;
    parent.add(nextBadge);

    return nextBadge;
}

function createCharacter(sharedAssets, accentColor = 0x61dafb) {
    const root = new THREE.Group();
    const accentMaterial = sharedAssets.materials.cloth.clone();
    accentMaterial.color = new THREE.Color(accentColor);
    const visorMaterial = sharedAssets.materials.metal.clone();
    visorMaterial.color = new THREE.Color(0x9be7ff);

    const hips = new THREE.Group();
    root.add(hips);

    const torso = new THREE.Mesh(sharedAssets.geometries.torso, accentMaterial);
    torso.position.y = 1.7;
    root.add(torso);

    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.08), sharedAssets.materials.white);
    chestPlate.position.set(0, 1.75, 0.22);
    root.add(chestPlate);

    const head = new THREE.Mesh(sharedAssets.geometries.head, sharedAssets.materials.skin);
    head.position.y = 2.52;
    root.add(head);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.08), visorMaterial);
    visor.position.set(0, 2.56, 0.31);
    root.add(visor);

    const hat = new THREE.Mesh(sharedAssets.geometries.hat, sharedAssets.materials.rope);
    hat.position.set(0, 2.92, 0);
    hat.rotation.x = 0.08;
    root.add(hat);

    const leftShoulder = new THREE.Mesh(sharedAssets.geometries.shoulderPad, sharedAssets.materials.white);
    leftShoulder.position.set(-0.42, 2.02, 0.02);
    root.add(leftShoulder);

    const rightShoulder = leftShoulder.clone();
    rightShoulder.position.x = 0.42;
    root.add(rightShoulder);

    const leftArm = new THREE.Group();
    leftArm.position.set(-0.42, 1.96, 0);
    const leftArmMesh = new THREE.Mesh(sharedAssets.geometries.arm, sharedAssets.materials.clothAlt);
    leftArmMesh.position.y = -0.36;
    leftArm.add(leftArmMesh);
    root.add(leftArm);

    const rightArm = leftArm.clone();
    rightArm.position.x = 0.42;
    root.add(rightArm);

    const leftLeg = new THREE.Group();
    leftLeg.position.set(-0.18, 1.18, 0);
    const leftLegMesh = new THREE.Mesh(sharedAssets.geometries.leg, sharedAssets.materials.clothAlt);
    leftLegMesh.position.y = -0.4;
    leftLeg.add(leftLegMesh);
    hips.add(leftLeg);

    const rightLeg = leftLeg.clone();
    rightLeg.position.x = 0.18;
    hips.add(rightLeg);

    root.traverse((object) => {
        if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });

    root.userData = {
        hips,
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        head,
        baseY: 0,
        jumpOffset: 0,
    };

    return root;
}

function animateCharacter(character, elapsedTime, movementStrength, isAirborne = false) {
    const amplitude = isAirborne ? 0.05 : 0.3 * movementStrength;
    const swing = Math.sin(elapsedTime * (isAirborne ? 4 : 7.4)) * amplitude;
    const bob = isAirborne ? 0 : Math.abs(Math.sin(elapsedTime * 7.4)) * 0.025 * movementStrength;
    const idle = isAirborne ? 0 : Math.sin(elapsedTime * 1.8) * 0.012;

    character.position.y = character.userData.baseY - CHARACTER_FOOT_OFFSET + (character.userData.jumpOffset ?? 0) + idle + bob;
    character.rotation.y = character.userData.heading ?? 0;
    character.userData.hips.rotation.x = 0;
    character.userData.leftArm.rotation.x = swing;
    character.userData.rightArm.rotation.x = -swing;
    character.userData.leftLeg.rotation.x = -swing;
    character.userData.rightLeg.rotation.x = swing;
    character.userData.head.rotation.y = Math.sin(elapsedTime * 1.1) * 0.08;
}

function keepObjectAlwaysRenderable(root, renderOrder = 0) {
    root.traverse((object) => {
        object.frustumCulled = false;

        if (typeof object.renderOrder === 'number') {
            object.renderOrder = Math.max(object.renderOrder, renderOrder);
        }
    });
}

function createBoatRig(sharedAssets, { accentColor = 0x61dafb, label = 'YOU' } = {}) {
    const boat = new THREE.Group();
    const visuals = new THREE.Group();
    visuals.rotation.y = -Math.PI / 2;
    boat.add(visuals);

    const hull = new THREE.Mesh(sharedAssets.geometries.hull, sharedAssets.materials.woodDark);
    hull.scale.z = 0.88;
    hull.position.y = 0.82;
    hull.castShadow = true;
    hull.receiveShadow = true;
    visuals.add(hull);

    const bow = new THREE.Mesh(sharedAssets.geometries.bow, sharedAssets.materials.woodDark);
    bow.position.set(0, 1.1, -1.9);
    bow.rotation.x = Math.PI / 2;
    visuals.add(bow);

    const stern = bow.clone();
    stern.position.z = 1.9;
    visuals.add(stern);

    const deck = new THREE.Mesh(sharedAssets.geometries.deck, sharedAssets.materials.wood);
    deck.position.y = 1.42;
    deck.castShadow = true;
    deck.receiveShadow = true;
    visuals.add(deck);

    const cabin = new THREE.Mesh(sharedAssets.geometries.cabin, sharedAssets.materials.wood);
    cabin.position.set(0.45, 2.08, 0.35);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    visuals.add(cabin);

    const mast = new THREE.Mesh(sharedAssets.geometries.mast, sharedAssets.materials.woodDark);
    mast.position.set(-0.2, 4.2, -0.1);
    mast.castShadow = true;
    mast.receiveShadow = true;
    visuals.add(mast);

    const sail = new THREE.Mesh(sharedAssets.geometries.sail, sharedAssets.materials.sail);
    sail.position.set(1.1, 4.25, -0.1);
    sail.rotation.y = -Math.PI / 2;
    visuals.add(sail);

    for (const side of [-1, 1]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.12, 0.12), sharedAssets.materials.rope);
        rail.position.set(0, 1.95, side * 1.28);
        visuals.add(rail);
    }

    const lampMaterial = sharedAssets.materials.crystal.clone();
    lampMaterial.color = new THREE.Color(accentColor);
    lampMaterial.emissive = new THREE.Color(accentColor);
    lampMaterial.emissiveIntensity = 0.55;
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), lampMaterial);
    lamp.position.set(2.25, 2.0, 0);
    visuals.add(lamp);

    const deckCharacter = createCharacter(sharedAssets, accentColor);
    deckCharacter.position.set(-1.2, 1.44, 0);
    deckCharacter.userData.baseY = deckCharacter.position.y;
    deckCharacter.userData.heading = Math.PI / 2;
    visuals.add(deckCharacter);

    const cameraBackAnchor = new THREE.Object3D();
    cameraBackAnchor.position.set(0, 5.4, -9.4);
    boat.add(cameraBackAnchor);

    const cameraFrontAnchor = new THREE.Object3D();
    cameraFrontAnchor.position.set(0, 5.8, 8.8);
    boat.add(cameraFrontAnchor);

    const cameraLookAnchor = new THREE.Object3D();
    cameraLookAnchor.position.set(0, 2.15, 0.4);
    boat.add(cameraLookAnchor);

    const nameBadge = createNameBadge(label, accentColor);
    boat.add(nameBadge);

    boat.traverse((object) => {
        if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
    keepObjectAlwaysRenderable(boat, 3);

    boat.userData = {
        lamp,
        deckCharacter,
        visuals,
        cameraBackAnchor,
        cameraFrontAnchor,
        cameraLookAnchor,
        nameBadge,
        accentColor,
    };

    return boat;
}

function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
}

function createPortfolioIsland(sharedAssets) {
    const island = new THREE.Group();
    const obstacleColliders = [];
    const houseLocation = new THREE.Vector2(HOUSE_CENTER.x, HOUSE_CENTER.z);
    const groundZones = [
        { position: new THREE.Vector2(-26, 12), radius: 26, tint: new THREE.Color(0x6c9543) },
        { position: new THREE.Vector2(24, 6), radius: 24, tint: new THREE.Color(0x88a94f) },
        { position: new THREE.Vector2(-8, -26), radius: 22, tint: new THREE.Color(0x7f9d46) },
        { position: new THREE.Vector2(32, -30), radius: 24, tint: new THREE.Color(0x9cad58) },
        { position: new THREE.Vector2(-36, -18), radius: 22, tint: new THREE.Color(0x8b7e4e) },
        { position: new THREE.Vector2(HOUSE_CENTER.x - 6, HOUSE_CENTER.z + 8), radius: 18, tint: new THREE.Color(0x8f7f53) },
        { position: new THREE.Vector2(HOUSE_CENTER.x + 10, HOUSE_CENTER.z - 2), radius: 16, tint: new THREE.Color(0x738b44) },
    ];

    const terrainGeometry = new THREE.PlaneGeometry(170, 170, 54, 54);
    terrainGeometry.rotateX(-Math.PI / 2);
    const positions = terrainGeometry.attributes.position;
    const colors = [];

    const getPathMask = (x, z, normalized) => {
        const pathCenterX = Math.sin((z - 6) * 0.048) * 5.4 + Math.sin(z * 0.022) * 2.2;
        const pathWidth = 4.4 + normalized * 1.35;
        const mainPathMask = THREE.MathUtils.clamp(1 - Math.abs(x - pathCenterX) / pathWidth, 0, 1);
        const houseTrailDistance = distanceToSegment2D(x, z, 6, -4, HOUSE_CENTER.x, HOUSE_CENTER.z + 8);
        const houseTrailMask = THREE.MathUtils.clamp(1 - houseTrailDistance / 3.8, 0, 1);
        const dockTrailDistance = distanceToSegment2D(x, z, 8, 56, -8, 22);
        const dockTrailMask = THREE.MathUtils.clamp(1 - dockTrailDistance / 3.4, 0, 1);
        const eastLoopDistance = distanceToSegment2D(x, z, 18, 18, 46, 10);
        const eastLoopMask = THREE.MathUtils.clamp(1 - eastLoopDistance / 3.2, 0, 1);

        return Math.max(mainPathMask, houseTrailMask * 0.92, dockTrailMask * 0.78, eastLoopMask * 0.58);
    };

    const getTerrainNoise = (x, z) => {
        return (
            Math.sin(x * 0.06) * 0.46 +
            Math.cos(z * 0.054) * 0.32 +
            Math.sin((x + z) * 0.031) * 0.22
        );
    };

    const getZoneTint = (x, z) => {
        const base = new THREE.Color(0x7d9f4f);
        const sample = new THREE.Vector2(x, z);

        groundZones.forEach((zone) => {
            const influence = THREE.MathUtils.clamp(1 - sample.distanceTo(zone.position) / zone.radius, 0, 1);
            base.lerp(zone.tint, influence * 0.22);
        });

        return base;
    };

    for (let index = 0; index < positions.count; index += 1) {
        const x = positions.getX(index);
        const z = positions.getZ(index);
        const height = islandHeightAt(x, z);

        if (height === null) {
            positions.setY(index, WATER_LEVEL - 5);
            colors.push(0.1, 0.28, 0.42);
        } else {
            positions.setY(index, height);
            const normalized = Math.min(1, height / 11.5);
            const terrainNoise = getTerrainNoise(x, z);
            const warmNoise = (Math.sin(x * 0.12 - z * 0.08) + 1) * 0.5;
            const pathMask = getPathMask(x, z, normalized);
            const coastalFade = THREE.MathUtils.clamp(1 - normalized * 1.12, 0, 1);
            const ridgeShade = THREE.MathUtils.clamp(0.5 + Math.sin((x - z) * 0.026) * 0.24, 0, 1);
            const houseDistance = new THREE.Vector2(x, z).distanceTo(houseLocation);
            const houseClearing = THREE.MathUtils.clamp(1 - houseDistance / 9.5, 0, 1);
            const meadowMask = THREE.MathUtils.clamp((getTerrainNoise(x * 0.75 + 22, z * 0.75 - 14) + 1) * 0.5, 0, 1);
            const clearingMask = THREE.MathUtils.clamp(1 - Math.abs(x - 4) / 18, 0, 1) * THREE.MathUtils.clamp(1 - Math.abs(z - 8) / 14, 0, 1);
            const grassBlend = THREE.MathUtils.clamp(0.44 + terrainNoise * 0.22 + coastalFade * 0.18 + meadowMask * 0.16 - pathMask * 0.26 - clearingMask * 0.08, 0, 1);
            const dryBlend = pathMask * 0.88 + (1 - coastalFade) * 0.16 + houseClearing * 0.22 + clearingMask * 0.12;
            const pathStripe = THREE.MathUtils.clamp(1 - Math.abs(Math.sin(z * 0.24 + x * 0.05)) * 1.35, 0, 1) * pathMask;
            const zoneTint = getZoneTint(x, z);
            const adventureGlow = THREE.MathUtils.clamp(0.08 + houseClearing * 0.16 + pathMask * 0.06, 0, 0.26);
            const r = THREE.MathUtils.lerp(zoneTint.r * (0.74 + grassBlend * 0.18) + ridgeShade * 0.02, 0.78 + adventureGlow * 0.18, dryBlend + pathStripe * 0.08);
            const g = THREE.MathUtils.lerp(zoneTint.g * (0.82 + grassBlend * 0.18) + warmNoise * 0.04, 0.71 + adventureGlow * 0.08, dryBlend + pathStripe * 0.08);
            const b = THREE.MathUtils.lerp(zoneTint.b * (0.66 + normalized * 0.12), 0.41, dryBlend * 0.92);
            colors.push(r, g, b);
        }
    }

    terrainGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    terrainGeometry.computeVertexNormals();

    const terrainMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        vertexColors: true,
        flatShading: true,
        roughness: 0.98,
    });

    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrain.receiveShadow = true;
    terrain.castShadow = true;
    island.add(terrain);

    const dock = new THREE.Group();

    const dockEntryLanding = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.24, 2.9), sharedAssets.materials.woodDark);
    dockEntryLanding.position.set(DOCK_CENTER.x, DOCK_SURFACE_Y + 0.02, 61.1);
    dockEntryLanding.castShadow = true;
    dockEntryLanding.receiveShadow = true;
    dock.add(dockEntryLanding);

    const boardingPad = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.24, 7.2), sharedAssets.materials.wood);
    boardingPad.position.set(DOCK_CENTER.x, DOCK_SURFACE_Y + 0.02, 72.8);
    boardingPad.castShadow = true;
    boardingPad.receiveShadow = true;
    dock.add(boardingPad);

    const mainPier = new THREE.Mesh(
        new THREE.BoxGeometry(DOCK_PIER_HALF_WIDTH * 2, 0.24, DOCK_PIER_END_Z - DOCK_PIER_START_Z),
        sharedAssets.materials.wood,
    );
    mainPier.position.set(DOCK_CENTER.x, DOCK_SURFACE_Y + 0.02, (DOCK_PIER_START_Z + DOCK_PIER_END_Z) / 2);
    mainPier.castShadow = true;
    mainPier.receiveShadow = true;
    dock.add(mainPier);

    for (let z = DOCK_PIER_START_Z - 0.5; z <= DOCK_PIER_END_Z + 0.5; z += 4.2) {
        for (const xOffset of [-2.5, 2.5]) {
            const post = new THREE.Mesh(sharedAssets.geometries.dockPost, sharedAssets.materials.woodDark);
            post.position.set(DOCK_CENTER.x + xOffset, DOCK_SURFACE_Y - 1.16, z);
            post.castShadow = true;
            post.receiveShadow = true;
            dock.add(post);
        }
    }

    for (const side of [-1, 1]) {
        for (let z = DOCK_PIER_START_Z + 0.8; z <= DOCK_PIER_END_Z - 0.8; z += 5.8) {
            const railPost = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.0, 0.18), sharedAssets.materials.woodDark);
            railPost.position.set(DOCK_CENTER.x + side * 2.92, DOCK_SURFACE_Y + 0.38, z);
            railPost.castShadow = true;
            railPost.receiveShadow = true;
            dock.add(railPost);
        }

        const topRail = new THREE.Mesh(
            new THREE.BoxGeometry(0.16, 0.12, DOCK_PIER_END_Z - DOCK_PIER_START_Z - 0.8),
            sharedAssets.materials.woodDark,
        );
        topRail.position.set(DOCK_CENTER.x + side * 2.92, DOCK_SURFACE_Y + 0.92, (DOCK_PIER_START_Z + DOCK_PIER_END_Z) / 2);
        topRail.castShadow = true;
        topRail.receiveShadow = true;
        dock.add(topRail);

        const midRail = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.1, DOCK_PIER_END_Z - DOCK_PIER_START_Z - 0.8),
            sharedAssets.materials.wood,
        );
        midRail.position.set(DOCK_CENTER.x + side * 2.82, DOCK_SURFACE_Y + 0.62, (DOCK_PIER_START_Z + DOCK_PIER_END_Z) / 2);
        midRail.castShadow = true;
        midRail.receiveShadow = true;
        dock.add(midRail);
    }

    for (const x of [DOCK_CENTER.x - 2.2, DOCK_CENTER.x + 2.2]) {
        for (const z of [60.2, 62.0]) {
            const post = new THREE.Mesh(sharedAssets.geometries.dockPost, sharedAssets.materials.woodDark);
            post.position.set(x, DOCK_SURFACE_Y - 1.12, z);
            post.castShadow = true;
            post.receiveShadow = true;
            dock.add(post);
        }
    }

    for (const side of [-1, 1]) {
        const landingPostA = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.98, 0.18), sharedAssets.materials.woodDark);
        landingPostA.position.set(DOCK_CENTER.x + side * 2.86, DOCK_SURFACE_Y + 0.36, 60.08);
        landingPostA.castShadow = true;
        landingPostA.receiveShadow = true;
        dock.add(landingPostA);

        const landingPostB = landingPostA.clone();
        landingPostB.position.z = 62.1;
        dock.add(landingPostB);

        const landingRail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 2.22), sharedAssets.materials.woodDark);
        landingRail.position.set(DOCK_CENTER.x + side * 2.86, DOCK_SURFACE_Y + 0.9, 61.09);
        landingRail.castShadow = true;
        landingRail.receiveShadow = true;
        dock.add(landingRail);
    }

    const accessStepMaterial = sharedAssets.materials.wood.clone();
    accessStepMaterial.color = new THREE.Color(0xb67a42);
    const accessSideMaterial = sharedAssets.materials.woodDark.clone();
    accessSideMaterial.color = new THREE.Color(0x6f4527);
    const accessTrimMaterial = sharedAssets.materials.woodDark.clone();
    accessTrimMaterial.color = new THREE.Color(0x4b2c18);
    const stepDepth = 0.58;
    const stepHeight = 0.16;
    const stairBaseY = DOCK_SURFACE_Y + 0.14;
    const risePerStep = (DOCK_STAIR_TOP_Y - stairBaseY) / DOCK_STEP_COUNT;

    for (let index = 0; index < DOCK_STEP_COUNT; index += 1) {
        const stepWidth = 4.35 - index * 0.05;
        const stepTopY = stairBaseY + risePerStep * (index + 1);
        const supportHeight = Math.max(0.28, stepTopY - 0.02);
        const support = new THREE.Mesh(
            new THREE.BoxGeometry(stepWidth - 0.16, supportHeight, stepDepth - 0.04),
            accessSideMaterial,
        );
        support.position.set(
            DOCK_ACCESS_CENTER_X,
            supportHeight * 0.5 - 0.02,
            60.22 - index * stepDepth,
        );
        support.castShadow = true;
        support.receiveShadow = true;
        dock.add(support);

        const step = new THREE.Mesh(
            new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth),
            accessStepMaterial,
        );
        step.position.set(
            DOCK_ACCESS_CENTER_X,
            stepTopY - stepHeight * 0.5,
            60.22 - index * stepDepth,
        );
        step.castShadow = true;
        step.receiveShadow = true;
        dock.add(step);
    }

    for (const side of [-1, 1]) {
        const sideSkirt = new THREE.Mesh(
            new THREE.BoxGeometry(0.14, 1.52, 5.9),
            accessSideMaterial,
        );
        sideSkirt.position.set(DOCK_ACCESS_CENTER_X + side * 2.12, 0.72, 57.68);
        sideSkirt.castShadow = true;
        sideSkirt.receiveShadow = true;
        dock.add(sideSkirt);

        const retainingWall = new THREE.Mesh(
            new THREE.BoxGeometry(0.22, 1.7, 6.2),
            accessSideMaterial,
        );
        retainingWall.position.set(DOCK_ACCESS_CENTER_X + side * 2.32, 0.88, 57.6);
        retainingWall.castShadow = true;
        retainingWall.receiveShadow = true;
        dock.add(retainingWall);

        const stringer = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.34, 6.3),
            sharedAssets.materials.woodDark,
        );
        stringer.position.set(DOCK_ACCESS_CENTER_X + side * 2.48, 1.05, 57.6);
        stringer.castShadow = true;
        stringer.receiveShadow = true;
        dock.add(stringer);
    }

    const stairFrontTrim = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.34, 0.18), accessTrimMaterial);
    stairFrontTrim.position.set(DOCK_ACCESS_CENTER_X, 0.22, 60.58);
    stairFrontTrim.castShadow = true;
    stairFrontTrim.receiveShadow = true;
    dock.add(stairFrontTrim);

    for (const side of [-1, 1]) {
        const stairCap = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 6.05), accessTrimMaterial);
        stairCap.position.set(DOCK_ACCESS_CENTER_X + side * 2.38, 1.74, 57.63);
        stairCap.castShadow = true;
        stairCap.receiveShadow = true;
        dock.add(stairCap);
    }

    if (DEBUG_DOCK_OVERLAY) {
        const dockDebugMaterial = new THREE.MeshBasicMaterial({
            color: 0xef4444,
            transparent: true,
            opacity: 0.28,
            depthWrite: false,
        });
        const stairDebugMaterial = new THREE.MeshBasicMaterial({
            color: 0x22c55e,
            transparent: true,
            opacity: 0.3,
            depthWrite: false,
        });
        const berthDebugMaterial = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
        });

        const shoreOverlay = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.08, 2.6), dockDebugMaterial);
        shoreOverlay.position.set(DOCK_CENTER.x, DOCK_SURFACE_Y + 0.22, 61.1);
        dock.add(shoreOverlay);

        const pierOverlay = new THREE.Mesh(
            new THREE.BoxGeometry(DOCK_PIER_HALF_WIDTH * 2, 0.08, DOCK_PIER_END_Z - DOCK_PIER_START_Z),
            dockDebugMaterial,
        );
        pierOverlay.position.set(DOCK_CENTER.x, DOCK_SURFACE_Y + 0.22, (DOCK_PIER_START_Z + DOCK_PIER_END_Z) / 2);
        dock.add(pierOverlay);

        const boardOverlay = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.08, 7), dockDebugMaterial);
        boardOverlay.position.set(DOCK_CENTER.x, DOCK_SURFACE_Y + 0.26, 72.8);
        dock.add(boardOverlay);

        const stairOverlay = new THREE.Mesh(
            new THREE.BoxGeometry(DOCK_ACCESS_HALF_WIDTH * 2, 0.08, DOCK_ACCESS_HALF_DEPTH * 2),
            stairDebugMaterial,
        );
        stairOverlay.position.set(DOCK_ACCESS_CENTER_X, 0.44, DOCK_ACCESS_CENTER_Z);
        dock.add(stairOverlay);

        const berthOverlay = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.18, 20), berthDebugMaterial);
        berthOverlay.position.set(DOCK_BERTH_POINT.x, WATER_LEVEL + 0.3, DOCK_BERTH_POINT.z);
        dock.add(berthOverlay);
    }

    island.add(dock);

    const palmOffsets = [
        [-18, 0, 48],
        [-30, 0, 16],
        [28, 0, 42],
        [42, 0, -10],
        [-46, 0, -8],
        [10, 0, -54],
    ];

    palmOffsets.forEach(([x, y, z], index) => {
        const palm = new THREE.Group();
        palm.position.set(x, (islandHeightAt(x, z) ?? 0) + 0.08 + y, z);
        palm.rotation.z = (index % 2 === 0 ? -1 : 1) * 0.08;

        const trunk = new THREE.Mesh(sharedAssets.geometries.trunk, sharedAssets.materials.woodDark);
        trunk.position.y = 1.9;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        palm.add(trunk);

        for (let leafIndex = 0; leafIndex < 5; leafIndex += 1) {
            const leaf = new THREE.Mesh(sharedAssets.geometries.palmLeaf, sharedAssets.materials.darkGrass);
            leaf.position.y = 4;
            leaf.rotation.z = Math.PI / 2;
            leaf.rotation.y = (leafIndex / 5) * Math.PI * 2;
            leaf.rotation.x = 0.48;
            leaf.castShadow = true;
            palm.add(leaf);
        }

        island.add(palm);
        obstacleColliders.push({
            position: new THREE.Vector3(x, 0, z),
            radius: 1.15,
        });
    });

    const houseBaseY = (islandHeightAt(HOUSE_CENTER.x, HOUSE_CENTER.z) ?? 0) + 0.02;
    const house = new THREE.Group();
    house.position.set(HOUSE_CENTER.x, houseBaseY, HOUSE_CENTER.z);

    const houseFloorMaterial = sharedAssets.materials.wood.clone();
    houseFloorMaterial.color = new THREE.Color(0xb88752);
    const houseWallMaterial = sharedAssets.materials.wood.clone();
    houseWallMaterial.color = new THREE.Color(0xe0c190);
    const houseTrimMaterial = sharedAssets.materials.woodDark.clone();
    houseTrimMaterial.color = new THREE.Color(0x694126);
    const houseRoofMaterial = sharedAssets.materials.clothAlt.clone();
    houseRoofMaterial.color = new THREE.Color(0x9c4e31);
    const houseStoneMaterial = sharedAssets.materials.rock.clone();
    houseStoneMaterial.color = new THREE.Color(0x6f7766);

    const houseFooting = new THREE.Mesh(new THREE.BoxGeometry(9.9, 3.1, 10.2), houseStoneMaterial);
    houseFooting.position.y = -1.18;
    houseFooting.castShadow = true;
    houseFooting.receiveShadow = true;
    house.add(houseFooting);

    const housePad = new THREE.Mesh(new THREE.BoxGeometry(9.1, 0.42, 9.3), houseStoneMaterial);
    housePad.position.y = 0.04;
    housePad.castShadow = true;
    housePad.receiveShadow = true;
    house.add(housePad);

    const houseFloor = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.16, 8.05), houseFloorMaterial);
    houseFloor.position.y = 0.46;
    houseFloor.castShadow = true;
    houseFloor.receiveShadow = true;
    house.add(houseFloor);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(7.6, 3.0, 0.22), houseWallMaterial);
    backWall.position.set(0, 1.72, -3.78);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    house.add(backWall);

    for (const side of [-1, 1]) {
        const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.0, 7.45), houseWallMaterial);
        sideWall.position.set(side * 3.76, 1.72, 0);
        sideWall.castShadow = true;
        sideWall.receiveShadow = true;
        house.add(sideWall);

        const roofSlope = new THREE.Mesh(new THREE.BoxGeometry(4.24, 0.24, 8.72), houseRoofMaterial);
        roofSlope.position.set(side * 1.98, 3.76, -0.04);
        roofSlope.rotation.z = side * -0.3;
        roofSlope.castShadow = true;
        roofSlope.receiveShadow = true;
        house.add(roofSlope);
    }

    const roofCap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 8.72), houseTrimMaterial);
    roofCap.position.set(0, 4.34, -0.04);
    roofCap.castShadow = true;
    roofCap.receiveShadow = true;
    house.add(roofCap);

    const frontWallLeft = new THREE.Mesh(new THREE.BoxGeometry(2.3, 3.0, 0.22), houseWallMaterial);
    frontWallLeft.position.set(-2.52, 1.72, 3.76);
    frontWallLeft.castShadow = true;
    frontWallLeft.receiveShadow = true;
    house.add(frontWallLeft);

    const frontWallRight = frontWallLeft.clone();
    frontWallRight.position.x = 2.52;
    house.add(frontWallRight);

    const frontFascia = new THREE.Mesh(new THREE.BoxGeometry(8.02, 0.16, 0.18), houseTrimMaterial);
    frontFascia.position.set(0, 3.38, 4.16);
    frontFascia.castShadow = true;
    frontFascia.receiveShadow = true;
    house.add(frontFascia);

    const backFascia = frontFascia.clone();
    backFascia.position.z = -4.16;
    house.add(backFascia);

    const gableShape = new THREE.Shape();
    gableShape.moveTo(-3.74, 0);
    gableShape.lineTo(3.74, 0);
    gableShape.lineTo(0, 1.14);
    gableShape.closePath();
    const gableGeometry = new THREE.ExtrudeGeometry(gableShape, {
        depth: 0.14,
        bevelEnabled: false,
    });
    gableGeometry.translate(0, 0, -0.07);

    const frontGable = new THREE.Mesh(gableGeometry, houseWallMaterial);
    frontGable.position.set(0, 3.04, 3.83);
    frontGable.castShadow = true;
    frontGable.receiveShadow = true;
    house.add(frontGable);

    const backGable = frontGable.clone();
    backGable.position.z = -3.97;
    house.add(backGable);

    const doorLintel = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.42, 0.24), houseTrimMaterial);
    doorLintel.position.set(0, 2.92, 3.76);
    doorLintel.castShadow = true;
    doorLintel.receiveShadow = true;
    house.add(doorLintel);

    for (const side of [-1, 1]) {
        const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.92, 0.24), houseTrimMaterial);
        doorFrame.position.set(side * 1.08, 1.5, 3.76);
        doorFrame.castShadow = true;
        doorFrame.receiveShadow = true;
        house.add(doorFrame);
    }

    const windowMaterial = sharedAssets.materials.metal.clone();
    windowMaterial.color = new THREE.Color(0x9fd0d7);
    windowMaterial.emissive = new THREE.Color(0x1a2f35);
    windowMaterial.emissiveIntensity = 0.18;

    const frontWindowLeft = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.82, 0.14), windowMaterial);
    frontWindowLeft.position.set(-2.48, 1.98, 3.68);
    frontWindowLeft.castShadow = true;
    house.add(frontWindowLeft);

    const frontWindowRight = frontWindowLeft.clone();
    frontWindowRight.position.x = 2.48;
    house.add(frontWindowRight);

    const porch = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.16, 1.98), houseFloorMaterial);
    porch.position.set(0, 0.4, 4.76);
    porch.castShadow = true;
    porch.receiveShadow = true;
    house.add(porch);

    const porchStep = new THREE.Mesh(new THREE.BoxGeometry(2.56, 0.14, 0.88), houseTrimMaterial);
    porchStep.position.set(0, 0.2, 5.82);
    porchStep.castShadow = true;
    porchStep.receiveShadow = true;
    house.add(porchStep);

    const porchStepLower = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 1.08), houseStoneMaterial);
    porchStepLower.position.set(0, 0.02, 6.28);
    porchStepLower.castShadow = true;
    porchStepLower.receiveShadow = true;
    house.add(porchStepLower);

    for (const side of [-1, 1]) {
        const porchPost = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.62, 0.16), houseTrimMaterial);
        porchPost.position.set(side * 1.34, 1.12, 4.98);
        porchPost.castShadow = true;
        porchPost.receiveShadow = true;
        house.add(porchPost);

        const sideBrace = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.92), houseTrimMaterial);
        sideBrace.position.set(side * 1.52, 1.42, 5.02);
        sideBrace.castShadow = true;
        sideBrace.receiveShadow = true;
        house.add(sideBrace);
    }

    const awning = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.16, 1.72), houseRoofMaterial);
    awning.position.set(0, 3.02, 4.55);
    awning.rotation.x = -0.12;
    awning.castShadow = true;
    awning.receiveShadow = true;
    house.add(awning);

    const awningTrim = new THREE.Mesh(new THREE.BoxGeometry(3.84, 0.12, 0.18), houseTrimMaterial);
    awningTrim.position.set(0, 2.94, 5.34);
    awningTrim.castShadow = true;
    awningTrim.receiveShadow = true;
    house.add(awningTrim);

    const awningBackTrim = awningTrim.clone();
    awningBackTrim.position.z = 3.74;
    house.add(awningBackTrim);

    for (const side of [-1, 1]) {
        const sideWindow = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.86, 1.2), windowMaterial);
        sideWindow.position.set(side * 3.67, 1.94, -1.05);
        sideWindow.castShadow = true;
        house.add(sideWindow);
    }

    const rearWindow = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.92, 0.16), windowMaterial);
    rearWindow.position.set(0, 1.98, -3.69);
    rearWindow.castShadow = true;
    house.add(rearWindow);

    const interiorTable = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 1), houseTrimMaterial);
    interiorTable.position.set(-1.2, 0.74, -0.4);
    interiorTable.castShadow = true;
    interiorTable.receiveShadow = true;
    house.add(interiorTable);

    for (const xOffset of [-0.52, 0.52]) {
        for (const zOffset of [-0.32, 0.32]) {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.7, 0.1), houseTrimMaterial);
            leg.position.set(-1.2 + xOffset, 0.35, -0.4 + zOffset);
            leg.castShadow = true;
            leg.receiveShadow = true;
            house.add(leg);
        }
    }

    const chest = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.72, 0.62), houseTrimMaterial);
    chest.position.set(2.2, 0.42, -2.4);
    chest.castShadow = true;
    chest.receiveShadow = true;
    house.add(chest);

    house.traverse((object) => {
        if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
    island.add(house);

    const houseWallColliders = [
        { x: HOUSE_CENTER.x, z: HOUSE_CENTER.z - 3.92, halfWidth: 3.95, halfDepth: 0.2 },
        { x: HOUSE_CENTER.x - 3.88, z: HOUSE_CENTER.z, halfWidth: 0.2, halfDepth: 4.0 },
        { x: HOUSE_CENTER.x + 3.88, z: HOUSE_CENTER.z, halfWidth: 0.2, halfDepth: 4.0 },
        { x: HOUSE_CENTER.x - 2.63, z: HOUSE_CENTER.z + 3.92, halfWidth: 1.35, halfDepth: 0.2 },
        { x: HOUSE_CENTER.x + 2.63, z: HOUSE_CENTER.z + 3.92, halfWidth: 1.35, halfDepth: 0.2 },
    ];

    houseWallColliders.forEach((collider) => {
        obstacleColliders.push({
            shape: 'box',
            position: new THREE.Vector3(collider.x, 0, collider.z),
            halfWidth: collider.halfWidth,
            halfDepth: collider.halfDepth,
        });
    });

    const adventureRocks = [
        { x: HOUSE_CENTER.x - 8, z: HOUSE_CENTER.z + 5, scale: 1.25, rot: 0.3 },
        { x: HOUSE_CENTER.x + 7, z: HOUSE_CENTER.z + 8, scale: 0.95, rot: -0.45 },
        { x: HOUSE_CENTER.x + 11, z: HOUSE_CENTER.z - 4, scale: 1.1, rot: 0.8 },
        { x: HOUSE_CENTER.x - 12, z: HOUSE_CENTER.z - 3, scale: 0.82, rot: -0.22 },
    ];

    adventureRocks.forEach(({ x, z, scale, rot }) => {
        const rock = new THREE.Mesh(
            new THREE.CylinderGeometry(1.0 * scale, 1.55 * scale, 1.15 * scale, 6),
            houseStoneMaterial,
        );
        rock.position.set(x, (getGroundHeightAt(x, z) ?? 0) + 0.34 * scale, z);
        rock.rotation.y = rot;
        rock.castShadow = true;
        rock.receiveShadow = true;
        island.add(rock);
        obstacleColliders.push({
            position: new THREE.Vector3(x, 0, z),
            radius: 1.15 * scale,
        });
    });

    const camp = new THREE.Group();
    const campX = HOUSE_CENTER.x - 10;
    const campZ = HOUSE_CENTER.z + 11;
    camp.position.set(campX, (getGroundHeightAt(campX, campZ) ?? 0) + 0.02, campZ);
    const campRing = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.45, 0.16, 8), houseStoneMaterial);
    campRing.position.y = 0.08;
    campRing.castShadow = true;
    campRing.receiveShadow = true;
    camp.add(campRing);
    for (const angle of [0, Math.PI / 2]) {
        const log = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.18, 0.24), sharedAssets.materials.woodDark);
        log.position.y = 0.2;
        log.rotation.y = angle;
        log.castShadow = true;
        log.receiveShadow = true;
        camp.add(log);
    }
    island.add(camp);

    const trailProps = [
        { x: -6, z: 16, type: 'log', rot: 0.32, scale: 1.0 },
        { x: 14, z: 12, type: 'rock', rot: -0.4, scale: 0.9 },
        { x: 24, z: 18, type: 'rock', rot: 0.2, scale: 1.05 },
        { x: 10, z: -12, type: 'stump', rot: -0.2, scale: 1.0 },
        { x: -18, z: 4, type: 'log', rot: -0.62, scale: 0.92 },
        { x: 34, z: -10, type: 'stump', rot: 0.18, scale: 1.08 },
    ];

    trailProps.forEach(({ x, z, type, rot, scale }) => {
        const y = (getGroundHeightAt(x, z) ?? 0) + 0.02;

        if (type === 'rock') {
            const rock = new THREE.Mesh(
                new THREE.CylinderGeometry(0.6 * scale, 0.95 * scale, 0.72 * scale, 6),
                houseStoneMaterial,
            );
            rock.position.set(x, y + 0.28 * scale, z);
            rock.rotation.y = rot;
            rock.castShadow = true;
            rock.receiveShadow = true;
            island.add(rock);
            obstacleColliders.push({
                position: new THREE.Vector3(x, 0, z),
                radius: 0.72 * scale,
            });
            return;
        }

        if (type === 'stump') {
            const stump = new THREE.Mesh(
                new THREE.CylinderGeometry(0.34 * scale, 0.42 * scale, 0.56 * scale, 6),
                sharedAssets.materials.woodDark,
            );
            stump.position.set(x, y + 0.22 * scale, z);
            stump.rotation.y = rot;
            stump.castShadow = true;
            stump.receiveShadow = true;
            island.add(stump);
            obstacleColliders.push({
                position: new THREE.Vector3(x, 0, z),
                radius: 0.42 * scale,
            });
            return;
        }

        const log = new THREE.Mesh(
            new THREE.BoxGeometry(1.4 * scale, 0.18 * scale, 0.28 * scale),
            sharedAssets.materials.woodDark,
        );
        log.position.set(x, y + 0.12 * scale, z);
        log.rotation.y = rot;
        log.castShadow = true;
        log.receiveShadow = true;
        island.add(log);
        obstacleColliders.push({
            position: new THREE.Vector3(x, 0, z),
            radius: 0.72 * scale,
        });
    });

    const easterEgg = (() => {
        const secret = new THREE.Group();
        const secretY = (getGroundHeightAt(EASTER_EGG_POSITION.x, EASTER_EGG_POSITION.z) ?? 0) + 0.02;
        secret.position.set(EASTER_EGG_POSITION.x, secretY, EASTER_EGG_POSITION.z);

        const stashBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.9, 1.15, 0.28, 6),
            houseStoneMaterial,
        );
        stashBase.position.y = 0.12;
        stashBase.castShadow = true;
        stashBase.receiveShadow = true;
        secret.add(stashBase);

        const secretMaterial = sharedAssets.materials.crystal.clone();
        secretMaterial.color = new THREE.Color(0xf472b6);
        secretMaterial.emissive = new THREE.Color(0x7c2d5f);
        secretMaterial.emissiveIntensity = 0.68;
        const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 0), secretMaterial);
        crystal.position.y = 0.7;
        crystal.castShadow = true;
        secret.add(crystal);

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.82, 0.06, 8, 18),
            new THREE.MeshStandardMaterial({ color: 0xf9a8d4, emissive: 0xf472b6, emissiveIntensity: 0.26, roughness: 0.35 }),
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.18;
        secret.add(ring);

        island.add(secret);

        return {
            grp: secret,
            crystal,
            ring,
            collected: false,
            rewardValue: 180,
            label: 'Cache Pink Crystal',
        };
    })();

    const canPlaceGrassAt = (x, z) => {
        const tuftGround = getGroundHeightAt(x, z);

        if (tuftGround === null || tuftGround < 0.28) {
            return null;
        }

        if (isInsideDockChannel(x, z, 2.4) || isInsideDockSurface(x, z, 0.5)) {
            return null;
        }

        const houseYard = Math.abs(x - HOUSE_CENTER.x) <= 7.8 && Math.abs(z - HOUSE_CENTER.z) <= 7.6;

        if (houseYard) {
            return null;
        }

        const blockedByObstacle = isPointBlockedByObstacle(new THREE.Vector3(x, 0, z), obstacleColliders, 1.45);

        if (blockedByObstacle) {
            return null;
        }

        return tuftGround;
    };

    const grassPatchSamples = [];

    let grassAttempts = 0;
    while (grassPatchSamples.length < 4200 && grassAttempts < 26000) {
        grassAttempts += 1;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * (MAIN_ISLAND_RADIUS - 4);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const groundY = canPlaceGrassAt(x, z);

        if (groundY === null) {
            continue;
        }

        const normalized = Math.min(1, Math.sqrt(x * x + z * z) / MAIN_ISLAND_RADIUS);
        const pathMask = getPathMask(x, z, normalized);
        const patchNoise = (getTerrainNoise(x * 0.9, z * 0.9) + 1) * 0.5;
        const adventureBands = (Math.sin(x * 0.028 + z * 0.031) + 1) * 0.5;
        const meadowZone = THREE.MathUtils.clamp((getTerrainNoise(x * 0.62 - 8, z * 0.62 + 10) + 1) * 0.5, 0, 1);
        const densityGate = patchNoise + adventureBands * 0.18 + meadowZone * 0.14 - pathMask * 0.92 - normalized * 0.06;

        if (densityGate < 0.34) {
            continue;
        }

        grassPatchSamples.push({
            x,
            y: groundY,
            z,
            scale: 0.72 + patchNoise * 0.56 + meadowZone * 0.18 + Math.random() * 0.24,
        });
    }

    const bladeGeometry = new THREE.CylinderGeometry(0.03, 0.085, 0.8, 3);
    bladeGeometry.translate(0, 0.4, 0);
    const grassMaterials = [
        sharedAssets.materials.grass,
        sharedAssets.materials.meadowGrass,
        sharedAssets.materials.brightGrass,
    ];
    const grassInstanceBuckets = grassMaterials.map(() => []);
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    grassPatchSamples.forEach((sample) => {
        const bladeCount = 2 + Math.floor(sample.scale * 4.1);

        for (let bladeIndex = 0; bladeIndex < bladeCount; bladeIndex += 1) {
            const materialIndex = Math.floor(Math.random() * grassMaterials.length);
            grassInstanceBuckets[materialIndex].push({
                x: sample.x + (Math.random() - 0.5) * 0.9,
                y: sample.y,
                z: sample.z + (Math.random() - 0.5) * 0.9,
                scale: sample.scale * (0.72 + Math.random() * 0.34),
                yaw: Math.random() * Math.PI * 2,
                lean: (Math.random() - 0.5) * 0.18,
            });
        }
    });

    grassInstanceBuckets.forEach((bucket, materialIndex) => {
        const instancedGrass = new THREE.InstancedMesh(bladeGeometry, grassMaterials[materialIndex], bucket.length);
        instancedGrass.castShadow = false;
        instancedGrass.receiveShadow = true;

        bucket.forEach((instance, index) => {
            position.set(instance.x, instance.y + 0.02, instance.z);
            rotation.set(instance.lean, instance.yaw, instance.lean * 0.35);
            quaternion.setFromEuler(rotation);
            scale.set(0.72 * instance.scale, instance.scale, 0.72 * instance.scale);
            matrix.compose(position, quaternion, scale);
            instancedGrass.setMatrixAt(index, matrix);
        });

        instancedGrass.instanceMatrix.needsUpdate = true;
        island.add(instancedGrass);
    });

    const flowerPositions = [];
    let flowerAttempts = 0;
    while (flowerPositions.length < 120 && flowerAttempts < 2400) {
        flowerAttempts += 1;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * (MAIN_ISLAND_RADIUS - 6);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const groundY = canPlaceGrassAt(x, z);

        if (groundY === null) {
            continue;
        }

        const normalized = Math.min(1, Math.sqrt(x * x + z * z) / MAIN_ISLAND_RADIUS);
        const pathMask = getPathMask(x, z, normalized);

        if (pathMask > 0.2 || (getTerrainNoise(x * 1.2, z * 1.2) + 1) * 0.5 < 0.62) {
            continue;
        }

        flowerPositions.push({ x, y: groundY, z, scale: 0.82 + Math.random() * 0.28 });
    }

    const flowerGeometry = new THREE.OctahedronGeometry(0.11, 0);
    const flowerMaterials = [sharedAssets.materials.flowerWhite, sharedAssets.materials.flowerCream];
    flowerMaterials.forEach((material, materialIndex) => {
        const bucket = flowerPositions.filter((_, index) => index % flowerMaterials.length === materialIndex);
        const instancedFlowers = new THREE.InstancedMesh(flowerGeometry, material, bucket.length);
        instancedFlowers.castShadow = false;
        instancedFlowers.receiveShadow = false;

        bucket.forEach((instance, index) => {
            position.set(instance.x, instance.y + 0.38 + Math.random() * 0.12, instance.z);
            rotation.set(0, Math.random() * Math.PI * 2, 0);
            quaternion.setFromEuler(rotation);
            scale.setScalar(instance.scale);
            matrix.compose(position, quaternion, scale);
            instancedFlowers.setMatrixAt(index, matrix);
        });

        instancedFlowers.instanceMatrix.needsUpdate = true;
        island.add(instancedFlowers);
    });

    const skillEntries = [];

    SKILLS.forEach((skill, index) => {
        const safeSkill = normalizeSkill(skill, index);
        const [x, , z] = safeSkill.position;
        const y = getGroundHeightAt(x, z) ?? 0;
        const skillGroup = new THREE.Group();
        skillGroup.position.set(x, y + 0.02, z);

        const base = new THREE.Mesh(sharedAssets.geometries.beaconBase, sharedAssets.materials.rock);
        base.position.y = 0.55;
        base.castShadow = true;
        base.receiveShadow = true;
        skillGroup.add(base);

        const pole = new THREE.Mesh(sharedAssets.geometries.pole, sharedAssets.materials.metal);
        pole.position.y = 2.1;
        skillGroup.add(pole);

        const beaconMaterial = sharedAssets.materials.crystal.clone();
        const beaconColor = parseHexColor(safeSkill.color);
        beaconMaterial.color = new THREE.Color(beaconColor);
        beaconMaterial.emissive = new THREE.Color(beaconColor);
        beaconMaterial.emissiveIntensity = 0.65;

        const crystal = new THREE.Mesh(sharedAssets.geometries.beaconCrystal, beaconMaterial);
        crystal.position.y = 3.85;
        crystal.rotation.y = Math.PI / 4;
        skillGroup.add(crystal);

        const signTexture = createSkillTexture(safeSkill);
        const sign = new THREE.Sprite(new THREE.SpriteMaterial({ map: signTexture, transparent: true, depthWrite: false }));
        sign.position.set(0, 5.1, 0);
        sign.scale.set(5.2, 2.6, 1);
        sign.userData.skill = safeSkill;
        skillGroup.add(sign);

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(1.35, 0.08, 8, 20),
            new THREE.MeshStandardMaterial({ color: beaconColor, emissive: beaconColor, emissiveIntensity: 0.2, roughness: 0.35 }),
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.18;
        skillGroup.add(ring);

        const accentGroundMaterial = sharedAssets.materials.rock.clone();
        accentGroundMaterial.color = new THREE.Color(beaconColor).multiplyScalar(0.55);
        accentGroundMaterial.roughness = 0.98;
        const accentGround = new THREE.Mesh(
            new THREE.CylinderGeometry(2.35, 3.1, 0.24, 7),
            accentGroundMaterial,
        );
        accentGround.position.y = 0.06;
        accentGround.rotation.y = index * 0.32;
        skillGroup.add(accentGround);

        for (let shardIndex = 0; shardIndex < 4; shardIndex += 1) {
            const shard = new THREE.Mesh(
                new THREE.BoxGeometry(0.22, 0.28 + shardIndex * 0.05, 0.46),
                accentGroundMaterial,
            );
            const shardAngle = (shardIndex / 4) * Math.PI * 2 + index * 0.18;
            shard.position.set(Math.cos(shardAngle) * 2.35, 0.18, Math.sin(shardAngle) * 2.35);
            shard.rotation.y = shardAngle;
            shard.rotation.z = (shardIndex % 2 === 0 ? 1 : -1) * 0.18;
            skillGroup.add(shard);
        }

        skillGroup.traverse((object) => {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });

        island.add(skillGroup);
        obstacleColliders.push({
            position: new THREE.Vector3(x, 0, z),
            radius: 2.05,
        });
        skillEntries.push({
            grp: skillGroup,
            crystal,
            ring,
            sign,
            skill: safeSkill,
            collected: false,
            rewardValue: 90 + index * 15,
            pulseSeed: Math.random() * Math.PI * 2,
        });
    });

    return {
        island,
        skillEntries,
        easterEgg,
        grassTufts: [],
        flowerClusters: [],
        obstacleColliders,
    };
}

function createOuterIslets(sharedAssets) {
    const group = new THREE.Group();
    const obstacleColliders = [];
    const beamEmitters = [];
    const islets = [
        { x: -122, y: 0, z: -84, scale: 1.2, beamColor: 0x60a5fa, rockColor: 0x355c7d, topColor: 0x7dd3fc },
        { x: 138, y: 0, z: -60, scale: 1.0, beamColor: 0xf472b6, rockColor: 0x7a3b69, topColor: 0xf9a8d4 },
        { x: -148, y: 0, z: 84, scale: 0.95, beamColor: 0x34d399, rockColor: 0x2f6b57, topColor: 0x86efac },
        { x: 128, y: 0, z: 102, scale: 1.08, beamColor: 0xfacc15, rockColor: 0x7a5b1f, topColor: 0xfde68a },
        { x: 16, y: 0, z: -154, scale: 0.9, beamColor: 0xc084fc, rockColor: 0x59408a, topColor: 0xd8b4fe },
    ];

    islets.forEach(({ x, y, z, scale, beamColor, rockColor, topColor }, index) => {
        const islet = new THREE.Group();
        islet.position.set(x, y, z);
        const baseMaterial = sharedAssets.materials.rock.clone();
        baseMaterial.color = new THREE.Color(rockColor);
        const topMaterial = sharedAssets.materials.grass.clone();
        topMaterial.color = new THREE.Color(topColor);
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(5.5 * scale, 8.4 * scale, 6.8 * scale, 7),
            baseMaterial,
        );
        base.position.y = 2.1 * scale;
        base.castShadow = true;
        base.receiveShadow = true;
        islet.add(base);

        const top = new THREE.Mesh(
            new THREE.CylinderGeometry(3.8 * scale, 4.8 * scale, 1.8 * scale, 7),
            topMaterial,
        );
        top.position.y = 5.9 * scale;
        top.castShadow = true;
        top.receiveShadow = true;
        islet.add(top);

        if (index % 2 === 0) {
            const tower = new THREE.Mesh(
                new THREE.CylinderGeometry(0.45 * scale, 0.58 * scale, 6.4 * scale, 6),
                sharedAssets.materials.metal,
            );
            tower.position.y = 9.2 * scale;
            islet.add(tower);

            const cap = new THREE.Mesh(
                new THREE.SphereGeometry(0.72 * scale, 10, 10),
                sharedAssets.materials.crystal,
            );
            cap.position.y = 12.6 * scale;
            islet.add(cap);
        }

        const beam = createSkyBeam(beamColor);
        beam.position.y = 6.8 * scale;
        beam.scale.set(scale * 1.35, scale * 1.95, scale * 1.35);
        islet.add(beam);

        obstacleColliders.push({
            position: new THREE.Vector3(x, 0, z),
            radius: 8.8 * scale,
        });
        beamEmitters.push(beam);
        group.add(islet);
    });

    return {
        group,
        obstacleColliders,
        beamEmitters,
    };
}

function createOceanMaterial() {
    return new THREE.ShaderMaterial({
        transparent: false,
        depthWrite: true,
        uniforms: {
            uTime: { value: 0 },
            uSunDir: { value: new THREE.Vector3(0.4, 0.7, -0.58).normalize() },
        },
        vertexShader: `
            uniform float uTime;
            varying vec3 vWorldPos;
            varying vec3 vNormalDir;

            vec3 wave(vec2 p, float t) {
                float h = 0.0;
                float nx = 0.0;
                float nz = 0.0;

                vec2 d = normalize(vec2(1.0, 0.5));
                float k = 6.28318 / 46.0;
                float c = sqrt(9.8 / k);
                float a = 0.05 / k;
                float f = k * dot(d, p) - c * t;
                h += a * sin(f);
                nx -= d.x * a * k * cos(f);
                nz -= d.y * a * k * cos(f);

                d = normalize(vec2(0.4, 1.0));
                k = 6.28318 / 28.0;
                c = sqrt(9.8 / k);
                a = 0.038 / k;
                f = k * dot(d, p) - c * t;
                h += a * sin(f);
                nx -= d.x * a * k * cos(f);
                nz -= d.y * a * k * cos(f);

                d = normalize(vec2(-0.7, 0.5));
                k = 6.28318 / 18.0;
                c = sqrt(9.8 / k);
                a = 0.024 / k;
                f = k * dot(d, p) - c * t;
                h += a * sin(f);
                nx -= d.x * a * k * cos(f);
                nz -= d.y * a * k * cos(f);

                return vec3(nx, h, nz);
            }

            void main() {
                vec4 worldPos = modelMatrix * vec4(position, 1.0);
                vec3 displacement = wave(worldPos.xz, uTime * 0.28);
                vec3 finalPos = worldPos.xyz + vec3(0.0, displacement.y - 0.8, 0.0);
                vWorldPos = finalPos;
                vNormalDir = normalize(vec3(displacement.x, 1.0, displacement.z));
                gl_Position = projectionMatrix * viewMatrix * vec4(finalPos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 uSunDir;
            varying vec3 vWorldPos;
            varying vec3 vNormalDir;

            vec3 skyColor(vec3 dir) {
                float t = clamp(dir.y * 1.2 + 0.2, 0.0, 1.0);
                vec3 bot = vec3(0.66, 0.84, 0.96);
                vec3 top = vec3(0.12, 0.28, 0.5);
                return mix(bot, top, t);
            }

            void main() {
                vec3 viewDir = normalize(cameraPosition - vWorldPos);
                vec3 normalDir = normalize(vNormalDir);
                float distanceToCamera = length(cameraPosition.xz - vWorldPos.xz);
                float fresnel = pow(1.0 - max(dot(normalDir, viewDir), 0.0), 3.0);
                vec3 deep = vec3(0.04, 0.18, 0.3);
                vec3 shallow = vec3(0.12, 0.43, 0.58);
                vec3 lagoon = vec3(0.26, 0.66, 0.7);
                vec3 reflection = skyColor(reflect(-viewDir, normalDir));
                vec3 color = mix(deep, shallow, clamp(0.45 + normalDir.y * 0.6, 0.0, 1.0));
                float caustic = sin(vWorldPos.x * 0.08 + vWorldPos.z * 0.05) * sin(vWorldPos.z * 0.1 - vWorldPos.x * 0.04);
                color = mix(color, lagoon, smoothstep(-0.1, 0.85, caustic) * 0.18);
                color = mix(color, reflection, fresnel * 0.82);
                float diff = max(dot(normalDir, uSunDir), 0.0);
                float spec = pow(max(dot(reflect(-uSunDir, normalDir), viewDir), 0.0), 110.0);
                color += vec3(1.0, 0.97, 0.88) * spec * 0.24;
                color += vec3(0.96, 0.9, 0.74) * diff * 0.1;
                float foam = smoothstep(0.12, 0.52, 1.0 - normalDir.y);
                color = mix(color, vec3(0.92, 0.97, 1.0), foam * 0.12);
                float horizonFog = smoothstep(85.0, 320.0, distanceToCamera);
                color = mix(color, vec3(0.73, 0.82, 0.9), horizonFog * 0.3);
                gl_FragColor = vec4(color, 1.0);
            }
        `,
    });
}

function getControlledLookOrigin(player, boat, landCharacter, time) {
    if (player.mode === 'boat') {
        return new THREE.Vector3(
            boat.position.x,
            boat.position.y + 3.15 + Math.sin(time * 2.2) * 0.04,
            boat.position.z,
        );
    }

    return new THREE.Vector3(
        landCharacter.position.x,
        landCharacter.position.y + 2.18 + Math.sin(player.walkTime * 7.5) * Math.min(player.landSpeed / 7.2, 1) * 0.06,
        landCharacter.position.z,
    );
}

function getControlledTarget(player, boat, landCharacter, time) {
    const origin = getControlledLookOrigin(player, boat, landCharacter, time);
    const lookYaw = player.mode === 'boat' ? player.heading : player.yaw;
    const forward = new THREE.Vector3(Math.sin(lookYaw), Math.sin(player.pitch), Math.cos(lookYaw));

    if (player.mode === 'boat') {
        forward.y = Math.sin(player.pitch) * 0.4;
    }

    forward.normalize();

    return origin.clone().add(forward.multiplyScalar(8));
}

function getCameraLabel(mode) {
    if (mode === 'third-back') {
        return 'Third Person Back';
    }

    if (mode === 'third-front') {
        return 'Third Person Front';
    }

    return 'Camera';
}

function getDefaultLocalLabel(sessionInfo) {
    return normalizePlayerName(sessionInfo?.displayName) || 'Player';
}

function getInteractionPrompt(playerMode, canDisembark, canBoard) {
    if (playerMode === 'boat' && canDisembark) {
        return 'Tekan E untuk turun ke pulau';
    }

    if (playerMode === 'land' && canBoard) {
        return 'Tekan E untuk naik kapal lagi';
    }

    return null;
}

function createLandscapePrompt() {
    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(6, 12, 23, 0.96)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            padding: 24,
            textAlign: 'center',
        }}>
            <div style={{
                width: '100%',
                maxWidth: 340,
                borderRadius: 24,
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'linear-gradient(180deg, rgba(8,15,31,0.94) 0%, rgba(5,10,24,0.96) 100%)',
                padding: '28px 24px',
                boxShadow: '0 28px 60px rgba(0,0,0,0.42)',
            }}>
                <div style={{ fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#7dd3fc', fontWeight: 900 }}>
                    Deck Notice
                </div>
                <div style={{ marginTop: 14, fontSize: 28, fontWeight: 900, color: '#f8fafc' }}>
                    Putar ke Landscape
                </div>
                <p style={{ margin: '12px 0 0', color: 'rgba(226,232,240,0.75)', lineHeight: 1.6, fontSize: 14 }}>
                    World pulau, kapal, dan kontrol kamera dirancang untuk mode horizontal.
                </p>
                <button
                    type="button"
                    onClick={() => navigateWithCleanup('/')}
                    style={{
                        marginTop: 18,
                        border: '1px solid rgba(125,211,252,0.24)',
                        borderRadius: 999,
                        background: 'rgba(8,15,31,0.9)',
                        color: '#e0f2fe',
                        padding: '12px 18px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                    }}
                >
                    Home
                </button>
            </div>
        </div>
    );
}

const SkillsGame = () => {
    const shellRef = useRef(null);
    const mountRef = useRef(null);
    const gameRef = useRef({});
    const keysRef = useRef({});
    const networkRef = useRef({ roomCode: null, playerId: null, remotePlayers: new Map(), lastSyncAt: 0, syncInFlight: false });
    const stageRef = useRef('loading');
    const sessionInfoRef = useRef(null);
    const touchLookRef = useRef({ active: false, touchId: null, lastX: 0, lastY: 0 });

    const [loaded, setLoaded] = useState(false);
    const [gameStage, setGameStage] = useState('loading');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingLabel, setLoadingLabel] = useState('Menyiapkan world...');
    const [hud, setHud] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(() => typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false);
    const [showHelp, setShowHelp] = useState(true);
    const [paused, setPaused] = useState(false);
    const [menuMessage, setMenuMessage] = useState('');
    const [menuBusy, setMenuBusy] = useState(false);
    const [roomCode, setRoomCode] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [sessionInfo, setSessionInfo] = useState(null);
    const [roomPopulation, setRoomPopulation] = useState(1);
    const [cameraMode, setCameraMode] = useState('third-back');
    const [interactionPrompt, setInteractionPrompt] = useState(null);
    const [mobilePlayerMode, setMobilePlayerMode] = useState('boat');
    const [canBoardBoat, setCanBoardBoat] = useState(false);
    const [canLeaveBoat, setCanLeaveBoat] = useState(false);
    const [missionState, setMissionState] = useState({
        collectedCount: 0,
        totalCount: SKILLS.length,
        score: 0,
        nextSkill: SKILLS[0]?.name ?? null,
        nextDistance: null,
        recentlyCollected: null,
        completed: false,
        easterEggFound: false,
        easterEggLabel: null,
    });

    const missionRef = useRef(missionState);
    const cameraModeRef = useRef(cameraMode);
    const pausedRef = useRef(false);
    const hudRef = useRef(null);
    const missionProgress = missionState.totalCount > 0 ? missionState.collectedCount / missionState.totalCount : 0;
    const missionHeadline = missionState.completed
        ? 'Pulau pulih. Semua beacon aktif.'
        : missionProgress >= 0.66
            ? 'Finishing sweep: aktifkan beacon terakhir.'
            : missionProgress >= 0.25
                ? 'Dorong ekspedisi dan rebut distrik berikutnya.'
                : 'Mulai ekspedisi dan bangunkan beacon pertama.';
    const missionSubline = missionState.completed
        ? 'Sinyal maritim kembali stabil dan jalur eksplorasi telah diamankan.'
        : missionState.recentlyCollected
            ? `${missionState.recentlyCollected} berhasil diamankan.`
            : missionState.easterEggFound
                ? `Easter egg ditemukan: ${missionState.easterEggLabel}.`
                : 'Jelajahi pulau, ikuti trail, dan aktifkan jaringan skill beacon.';

    const syncStage = (stage) => {
        stageRef.current = stage;
        setGameStage(stage);
    };

    const updateMissionState = (nextMissionState) => {
        missionRef.current = nextMissionState;
        setMissionState(nextMissionState);
    };

    useEffect(() => {
        sessionInfoRef.current = sessionInfo;
    }, [sessionInfo]);

    useEffect(() => {
        cameraModeRef.current = cameraMode;
    }, [cameraMode]);

    useEffect(() => {
        if (gameStage !== 'playing' || !showHelp) {
            return undefined;
        }

        const timeoutId = window.setTimeout(() => {
            setShowHelp(false);
        }, 5000);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [gameStage, showHelp]);

    useEffect(() => {
        const syncMedia = () => {
            const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 900;
            setIsMobile(mobile);
            if (mobile) {
                setIsPortrait(window.innerHeight > window.innerWidth);
            }
        };

        syncMedia();
        window.addEventListener('resize', syncMedia);
        window.addEventListener('orientationchange', syncMedia);

        return () => {
            window.removeEventListener('resize', syncMedia);
            window.removeEventListener('orientationchange', syncMedia);
        };
    }, []);

    useEffect(() => {
        const syncFullscreen = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        syncFullscreen();
        document.addEventListener('fullscreenchange', syncFullscreen);

        return () => {
            document.removeEventListener('fullscreenchange', syncFullscreen);
        };
    }, []);

    useEffect(() => {
        if (isPortrait && isMobile) {
            return undefined;
        }

        const animationFrame = requestAnimationFrame(() => {
            void initGame();
        });

        return () => {
            cancelAnimationFrame(animationFrame);
            destroyGame();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPortrait]);

    async function initGame() {
        const mount = mountRef.current;

        if (!mount) {
            return;
        }

        syncStage('loading');
        setLoaded(false);
        setLoadingProgress(6);
        setLoadingLabel('Membuka horizon...');
        setHud(null);
        setInteractionPrompt(null);
        setMobilePlayerMode('boat');
        setCanBoardBoat(false);
        setCanLeaveBoat(false);
        updateMissionState({
            collectedCount: 0,
            totalCount: SKILLS.length,
            score: 0,
            nextSkill: SKILLS[0]?.name ?? null,
            nextDistance: null,
            recentlyCollected: null,
            completed: false,
            easterEggFound: false,
            easterEggLabel: null,
        });

        const initSession = Symbol('skills-init');
        gameRef.current.initSession = initSession;

        const updateLoading = (progress, label) => {
            if (gameRef.current.initSession !== initSession) {
                return false;
            }

            setLoadingProgress(progress);
            setLoadingLabel(label);

            return true;
        };

        const lowPowerMode =
            (navigator.hardwareConcurrency ?? 4) <= 6 ||
            (navigator.deviceMemory ?? 4) <= 6 ||
            navigator.connection?.saveData ||
            window.matchMedia?.('(pointer: coarse)')?.matches;

        const renderProfile = {
            pixelRatioCap: lowPowerMode ? 1.05 : isMobile ? 1.2 : 1.5,
            shadowsEnabled: !lowPowerMode,
            oceanSegments: lowPowerMode ? 110 : 160,
            cloudCount: lowPowerMode ? 8 : 12,
        };

        const renderer = new THREE.WebGLRenderer({
            antialias: !lowPowerMode,
            alpha: false,
            powerPreference: lowPowerMode ? 'low-power' : 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, renderProfile.pixelRatioCap));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.93;
        renderer.shadowMap.enabled = renderProfile.shadowsEnabled;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        mount.appendChild(renderer.domElement);
        updateLoading(14, 'Membangun pulau...');

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xa8c4df);
        scene.fog = new THREE.FogExp2(0xc6d4d9, 0.0036);

        const camera = new THREE.PerspectiveCamera(68, mount.clientWidth / mount.clientHeight, 0.1, 1200);
        camera.position.set(0, 10, 24);

        const sunDirection = new THREE.Vector3(0.36, 0.8, -0.5).normalize();
        const sun = new THREE.DirectionalLight(0xffe6b2, 2.42);
        sun.position.copy(sunDirection).multiplyScalar(180);
        sun.castShadow = renderProfile.shadowsEnabled;
        sun.shadow.mapSize.set(lowPowerMode ? 1024 : 1536, lowPowerMode ? 1024 : 1536);
        sun.shadow.camera.near = 1;
        sun.shadow.camera.far = 320;
        sun.shadow.camera.left = -90;
        sun.shadow.camera.right = 90;
        sun.shadow.camera.top = 90;
        sun.shadow.camera.bottom = -90;
        scene.add(sun);
        scene.add(new THREE.AmbientLight(0xe1dccb, 1.14));
        scene.add(new THREE.HemisphereLight(0xf6ead2, 0x566447, 0.82));

        const sky = new THREE.Mesh(
            new THREE.SphereGeometry(760, 18, 14),
            new THREE.ShaderMaterial({
                side: THREE.BackSide,
                depthWrite: false,
                uniforms: {
                    uSunDir: { value: sunDirection },
                    uTime: { value: 0 },
                },
                vertexShader: `
                    varying vec3 vDir;

                    void main() {
                        vDir = normalize((modelMatrix * vec4(position, 1.0)).xyz);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 uSunDir;
                    uniform float uTime;
                    varying vec3 vDir;

                    float hash(vec2 p) {
                        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
                    }

                    float noise(vec2 p) {
                        vec2 i = floor(p);
                        vec2 f = fract(p);
                        vec2 u = f * f * (3.0 - 2.0 * f);
                        return mix(
                            mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
                            u.y
                        );
                    }

                    vec3 atmosphere(vec3 rayDir, vec3 sunDir) {
                        float t = clamp(rayDir.y * 0.8 + 0.45, 0.0, 1.0);
                        vec3 horizon = vec3(0.82, 0.9, 0.98);
                        vec3 zenith = vec3(0.28, 0.46, 0.74);
                        vec3 color = mix(horizon, zenith, smoothstep(0.0, 0.72, rayDir.y));
                        float sunAmount = max(dot(rayDir, sunDir), 0.0);
                        color += vec3(1.0, 0.9, 0.7) * pow(sunAmount, 14.0) * 0.26;
                        color += vec3(0.98, 0.72, 0.42) * pow(1.0 - abs(rayDir.y), 5.0) * 0.12;
                        vec2 cloudUv = rayDir.xz / max(rayDir.y + 0.3, 0.18);
                        cloudUv += vec2(uTime * 0.004, -uTime * 0.002);
                        float cloud = noise(cloudUv * 1.35) * 0.7 + noise(cloudUv * 2.8) * 0.3;
                        float cloudMask = smoothstep(0.62, 0.83, cloud) * smoothstep(-0.04, 0.26, rayDir.y);
                        color = mix(color, vec3(0.96, 0.98, 1.0), cloudMask * 0.32);
                        return color;
                    }

                    void main() {
                        gl_FragColor = vec4(atmosphere(normalize(vDir), normalize(uSunDir)), 1.0);
                    }
                `,
            }),
        );
        scene.add(sky);

        const ocean = new THREE.Mesh(
            new THREE.PlaneGeometry(1400, 1400, renderProfile.oceanSegments, renderProfile.oceanSegments),
            createOceanMaterial(),
        );
        ocean.rotation.x = -Math.PI / 2;
        scene.add(ocean);

        const sharedAssets = buildSharedAssets();
        const { island, skillEntries, easterEgg, grassTufts, flowerClusters, obstacleColliders } = createPortfolioIsland(sharedAssets);
        scene.add(island);
        const outerIslets = createOuterIslets(sharedAssets);
        scene.add(outerIslets.group);
        updateLoading(32, 'Menyiapkan kapal...');

        const localLabel = getDefaultLocalLabel(sessionInfoRef.current);
        const boat = createBoatRig(sharedAssets, { accentColor: 0x38bdf8, label: localLabel });
        boat.position.copy(START_BOAT_POSITION);
        boat.position.y = waveHeight(boat.position.x, boat.position.z, 0) + 1.45;
        scene.add(boat);

        const landCharacter = createCharacter(sharedAssets, 0x38bdf8);
        landCharacter.userData.nameBadge = createNameBadge(localLabel, 0x38bdf8);
        landCharacter.userData.nameBadge.visible = false;
        landCharacter.add(landCharacter.userData.nameBadge);
        landCharacter.visible = false;
        landCharacter.position.set(DOCK_LAND_POINT.x, (getGroundHeightAt(DOCK_LAND_POINT.x, DOCK_LAND_POINT.z) ?? 0) + 0.02, DOCK_LAND_POINT.z);
        landCharacter.userData.baseY = landCharacter.position.y;
        scene.add(landCharacter);

        const remotePlayersGroup = new THREE.Group();
        scene.add(remotePlayersGroup);

        const cloudTexture = createCloudTexture();
        const clouds = [];
        for (let index = 0; index < renderProfile.cloudCount; index += 1) {
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: cloudTexture,
                transparent: true,
                opacity: 0.72,
                depthWrite: false,
            }));
            const scale = 70 + Math.random() * 90;
            sprite.scale.set(scale, scale * 0.42, 1);
            sprite.position.set((Math.random() - 0.5) * 700, 58 + Math.random() * 30, (Math.random() - 0.5) * 700);
            sprite.userData.speed = 1.6 + Math.random() * 1.4;
            clouds.push(sprite);
            scene.add(sprite);
        }

        const player = {
            mode: 'boat',
            yaw: Math.PI,
            pitch: -0.16,
            heading: Math.PI,
            boatSpeed: 0,
            landSpeed: 0,
            verticalVelocity: 0,
            jumpOffset: 0,
            onGround: true,
            walkTime: 0,
            landingImpact: 0,
            interactionLatch: false,
            transitionLockUntil: 0,
            cameraLockUntil: 0,
            cameraPosition: new THREE.Vector3(0, 0, 0),
            targetPosition: new THREE.Vector3(0, 0, 0),
            lastSafeBoatPosition: START_BOAT_POSITION.clone(),
            lastSafeHeading: Math.PI,
            wasOrbitEnabled: false,
        };

        const raycaster = new THREE.Raycaster();
        const clock = new THREE.Clock();
        const cameraTarget = new THREE.Vector3();
        const cameraDirection = new THREE.Vector3();
        const lookOrigin = new THREE.Vector3();
        const forwardVector = new THREE.Vector3();
        const rightVector = new THREE.Vector3();
        const boatCameraWorldPosition = new THREE.Vector3();
        const boatCameraWorldLook = new THREE.Vector3();
        const boatCameraSway = new THREE.Vector3();
        const boatCameraUp = new THREE.Vector3();
        const worldUp = new THREE.Vector3(0, 1, 0);
        const moveVector = new THREE.Vector3();
        const sampleVector = new THREE.Vector3();
        const bendDirection = new THREE.Vector3();
        const obstacleSample = new THREE.Vector3();
        const swellState = {
            startAt: 4,
            endAt: 4,
            amplitude: 0,
            frequency: 1,
            origin: new THREE.Vector2(0, 0),
            direction: new THREE.Vector2(1, 0),
            nextAt: 10,
        };
        let animationFrame = null;
        let missionFeedbackTimeout = null;
        let hudSample = 0;

        const cycleCameraMode = () => {
            if (player.mode === 'boat') {
                setCameraMode('third-back');
                cameraModeRef.current = 'third-back';
                setMenuMessage('Camera: Third Person Back');
                document.exitPointerLock?.();
                return;
            }

            const currentIndex = CAMERA_MODES.indexOf(cameraModeRef.current);
            const nextMode = CAMERA_MODES[(currentIndex + 1) % CAMERA_MODES.length];
            setCameraMode(nextMode);
            cameraModeRef.current = nextMode;
            setMenuMessage(`Camera: ${getCameraLabel(nextMode)}`);

            document.exitPointerLock?.();
        };

        const updateInteractionState = (canDisembark, canBoard) => {
            setInteractionPrompt(getInteractionPrompt(player.mode, canDisembark, canBoard));
            setMobilePlayerMode(player.mode);
            setCanBoardBoat(canBoard);
            setCanLeaveBoat(canDisembark);
        };

        const syncLocalBadgeVisibility = (mode) => {
            boat.userData.nameBadge.visible = mode === 'boat';
            landCharacter.userData.nameBadge.visible = mode === 'land';
        };

        const applyLocalDisplayName = (displayName) => {
            const normalizedLabel = normalizePlayerName(displayName) || 'Player';
            boat.userData.nameBadge = replaceNameBadge(boat, boat.userData.nameBadge, normalizedLabel, 0x38bdf8, player.mode === 'boat');
            landCharacter.userData.nameBadge = replaceNameBadge(
                landCharacter,
                landCharacter.userData.nameBadge,
                normalizedLabel,
                0x38bdf8,
                player.mode === 'land',
            );
        };

        const collectSkill = (entry) => {
            if (entry.collected) {
                return;
            }

            entry.collected = true;
            entry.crystal.material.emissiveIntensity = 1.25;
            entry.crystal.material.roughness = 0.12;
            player.boatSpeed = Math.min(10.5, player.boatSpeed + 0.65);

            const collectedCount = skillEntries.filter((skillEntry) => skillEntry.collected).length;
            const remainingEntries = skillEntries.filter((skillEntry) => !skillEntry.collected);
            const controlledPosition = player.mode === 'boat' ? boat.position : landCharacter.position;
            const nextEntry = remainingEntries.reduce((nearest, candidate) => {
                if (!nearest) {
                    return candidate;
                }

                return controlledPosition.distanceTo(candidate.grp.position) < controlledPosition.distanceTo(nearest.grp.position) ? candidate : nearest;
            }, null);

            updateMissionState({
                collectedCount,
                totalCount: skillEntries.length,
                score: missionRef.current.score + entry.rewardValue,
                nextSkill: nextEntry?.skill.name ?? null,
                nextDistance: nextEntry ? Math.round(controlledPosition.distanceTo(nextEntry.grp.position)) : null,
                recentlyCollected: entry.skill.name,
                completed: collectedCount === skillEntries.length,
            });

            if (missionFeedbackTimeout) {
                window.clearTimeout(missionFeedbackTimeout);
            }

            missionFeedbackTimeout = window.setTimeout(() => {
                updateMissionState({
                    ...missionRef.current,
                    recentlyCollected: null,
                });
            }, 1800);
        };

        const collectEasterEgg = () => {
            if (easterEgg.collected) {
                return;
            }

            easterEgg.collected = true;
            easterEgg.grp.visible = false;
            updateMissionState({
                ...missionRef.current,
                score: missionRef.current.score + easterEgg.rewardValue,
                easterEggFound: true,
                easterEggLabel: easterEgg.label,
                recentlyCollected: 'Secret Cache',
            });

            if (missionFeedbackTimeout) {
                window.clearTimeout(missionFeedbackTimeout);
            }

            missionFeedbackTimeout = window.setTimeout(() => {
                updateMissionState({
                    ...missionRef.current,
                    recentlyCollected: null,
                });
            }, 2200);
        };

        const onMouseMove = (event) => {
            if (document.pointerLockElement !== renderer.domElement) {
                return;
            }

            if (player.mode === 'land') {
                player.yaw -= event.movementX * 0.0024;
                player.pitch -= event.movementY * 0.002;
                player.pitch = THREE.MathUtils.clamp(player.pitch, -0.82, 0.42);
            }
        };

        const onMouseDown = () => {
            if (isMobile) {
                return;
            }

            renderer.domElement.requestPointerLock?.();
        };

        const onKeyDown = (event) => {
            if (event.code === 'Escape') {
                if (stageRef.current !== 'playing') {
                    return;
                }

                const nextPausedState = !pausedRef.current;
                pausedRef.current = nextPausedState;
                setPaused(nextPausedState);

                if (nextPausedState) {
                    document.exitPointerLock?.();
                }

                return;
            }

            if (event.code === 'KeyC' && !event.repeat) {
                cycleCameraMode();
                return;
            }

            keysRef.current[event.code] = true;
        };

        const onKeyUp = (event) => {
            keysRef.current[event.code] = false;
        };

        renderer.domElement.addEventListener('pointerdown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        syncLocalBadgeVisibility(player.mode);

        updateLoading(54, 'Menyalakan distrik skill...');

        function animate() {
            animationFrame = requestAnimationFrame(animate);

            const delta = Math.min(clock.getDelta(), 0.05);
            const elapsedTime = clock.getElapsedTime();
            const controlsEnabled = stageRef.current === 'playing' && !pausedRef.current;
            const keys = keysRef.current;

            ocean.material.uniforms.uTime.value = elapsedTime;
            sky.material.uniforms.uTime.value = elapsedTime;

            if (elapsedTime >= swellState.nextAt && elapsedTime > swellState.endAt) {
                swellState.startAt = elapsedTime;
                swellState.endAt = elapsedTime + 4.6 + Math.random() * 2.2;
                swellState.amplitude = 0.28 + Math.random() * 0.22;
                swellState.frequency = 1.4 + Math.random() * 0.7;
                swellState.origin.set(
                    boat.position.x + (Math.random() - 0.5) * 120,
                    boat.position.z + (Math.random() - 0.5) * 120,
                );
                const swellAngle = Math.random() * Math.PI * 2;
                swellState.direction.set(Math.cos(swellAngle), Math.sin(swellAngle));
                swellState.nextAt = swellState.endAt + 10 + Math.random() * 18;
            }

            clouds.forEach((cloud) => {
                cloud.position.x += cloud.userData.speed * delta;
                if (cloud.position.x > 380) {
                    cloud.position.x = -380;
                }
            });

            if (controlsEnabled) {
                if (player.mode === 'boat') {
                    const throttle = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
                    const steer = (keys.KeyA || keys.ArrowLeft ? 1 : 0) - (keys.KeyD || keys.ArrowRight ? 1 : 0);

                    if (Math.abs(throttle) > 0) {
                        const acceleration = throttle > 0 ? 6.5 : 4.1;
                        player.boatSpeed += throttle * acceleration * delta;
                    } else {
                        player.boatSpeed = THREE.MathUtils.damp(player.boatSpeed, 0, 4.2, delta);
                    }

                    player.boatSpeed = THREE.MathUtils.clamp(player.boatSpeed, -3.2, 9.5);

                    if (Math.abs(steer) > 0) {
                        const turnStrength = THREE.MathUtils.lerp(0.42, 1.45, Math.min(Math.abs(player.boatSpeed) / 9.5, 1));
                        player.heading += steer * turnStrength * delta;
                    }
                    player.yaw = THREE.MathUtils.lerp(player.yaw, player.heading + Math.PI, 0.14);

                    const boatForward = getForwardVector(player.heading);
                    const boatRight = getRightVector(player.heading);
                    const nextBoatX = THREE.MathUtils.clamp(boat.position.x + boatForward.x * player.boatSpeed * delta, -180, 180);
                    const nextBoatZ = THREE.MathUtils.clamp(boat.position.z + boatForward.z * player.boatSpeed * delta, -180, 180);
                    const bowOffset = boatForward.clone().multiplyScalar(3.2);
                    const sternOffset = boatForward.clone().multiplyScalar(-2.4);
                    const sideOffset = boatRight.clone().multiplyScalar(1.7);
                    const collisionSamples = [
                        new THREE.Vector3(nextBoatX, 0, nextBoatZ),
                        new THREE.Vector3(nextBoatX, 0, nextBoatZ).add(bowOffset),
                        new THREE.Vector3(nextBoatX, 0, nextBoatZ).add(sternOffset),
                        new THREE.Vector3(nextBoatX, 0, nextBoatZ).add(bowOffset).add(sideOffset),
                        new THREE.Vector3(nextBoatX, 0, nextBoatZ).add(bowOffset).sub(sideOffset),
                        new THREE.Vector3(nextBoatX, 0, nextBoatZ).add(sternOffset).add(sideOffset),
                        new THREE.Vector3(nextBoatX, 0, nextBoatZ).add(sternOffset).sub(sideOffset),
                    ];
                    const blockedByIsland = collisionSamples.some((sample) => isSolidIslandAt(sample.x, sample.z, 1.8));
                    const blockedByDock = collisionSamples.some((sample) => isDockSolidAt(sample.x, sample.z, 0.85));
                    const blockedByOuterIslet = collisionSamples.some((sample) => outerIslets.obstacleColliders.some(
                        (collider) => collider.position.distanceToSquared(sample) < (collider.radius + 1.2) ** 2,
                    ));

                    if (!blockedByIsland && !blockedByDock && !blockedByOuterIslet) {
                        boat.position.x = nextBoatX;
                        boat.position.z = nextBoatZ;
                    } else {
                        player.boatSpeed = THREE.MathUtils.damp(player.boatSpeed, 0, 8.5, delta);
                    }

                    const centerSurface = waveHeight(boat.position.x, boat.position.z, elapsedTime);
                    const bowSurface = waveHeight(boat.position.x + boatForward.x * 3.2, boat.position.z + boatForward.z * 3.2, elapsedTime);
                    const sternSurface = waveHeight(boat.position.x - boatForward.x * 2.4, boat.position.z - boatForward.z * 2.4, elapsedTime);
                    const rightSurface = waveHeight(boat.position.x + boatRight.x * 1.8, boat.position.z + boatRight.z * 1.8, elapsedTime);
                    const leftSurface = waveHeight(boat.position.x - boatRight.x * 1.8, boat.position.z - boatRight.z * 1.8, elapsedTime);
                    boat.position.y = centerSurface + 1.45;
                    boat.rotation.y = player.heading;
                    boat.rotation.x = 0;
                    boat.rotation.z = 0;
                    boat.userData.visuals.rotation.x =
                        THREE.MathUtils.clamp((sternSurface - bowSurface) * 0.045, -0.032, 0.032)
                        + THREE.MathUtils.clamp(player.boatSpeed / 120, -0.018, 0.018);
                    boat.userData.visuals.rotation.z =
                        THREE.MathUtils.clamp((leftSurface - rightSurface) * 0.065, -0.045, 0.045)
                        + steer * 0.012;

                    animateCharacter(boat.userData.deckCharacter, elapsedTime, 0);
                    boat.userData.deckCharacter.userData.heading = Math.PI / 2;
                } else {
                    const moveForward = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
                    const moveSide = (keys.KeyA || keys.ArrowLeft ? 1 : 0) - (keys.KeyD || keys.ArrowRight ? 1 : 0);
                    const isRunning = keys.ShiftLeft || keys.ShiftRight;
                    const targetSpeed = (moveForward !== 0 || moveSide !== 0) ? (isRunning ? 7.2 : 4.6) : 0;
                    player.landSpeed = THREE.MathUtils.damp(player.landSpeed, targetSpeed, 6.2, delta);

                    forwardVector.copy(getForwardVector(player.yaw));
                    rightVector.copy(getRightVector(player.yaw));
                    moveVector.set(0, 0, 0);
                    moveVector.addScaledVector(forwardVector, moveForward);
                    moveVector.addScaledVector(rightVector, moveSide);

                    if (moveVector.lengthSq() > 0) {
                        moveVector.normalize().multiplyScalar(player.landSpeed * delta);
                        sampleVector.copy(landCharacter.position).add(moveVector);
                        const groundHeight = getGroundHeightAt(sampleVector.x, sampleVector.z);

                        obstacleSample.set(sampleVector.x, 0, sampleVector.z);
                        const blockedByObstacle = isPointBlockedByObstacle(obstacleSample, obstacleColliders, 0.72);

                        const walkableSurface = groundHeight !== null && groundHeight > 0.05;
                        const onIslandSurface = isSolidIslandAt(sampleVector.x, sampleVector.z, 0.6);
                        const onDockSurface = isInsideDockSurface(sampleVector.x, sampleVector.z, 0.22);

                        if (walkableSurface && (onIslandSurface || onDockSurface) && !blockedByObstacle) {
                            landCharacter.position.x = sampleVector.x;
                            landCharacter.position.z = sampleVector.z;
                            landCharacter.userData.baseY = groundHeight;
                            landCharacter.userData.heading = Math.atan2(moveVector.x, moveVector.z);
                            player.walkTime += delta * (isRunning ? 2.2 : 1.55);
                        }
                    }

                    if (player.onGround && keys.Space) {
                        player.verticalVelocity = 7.6;
                        player.jumpOffset = 0.02;
                        player.onGround = false;
                    }

                    player.verticalVelocity += -18 * delta;
                    player.jumpOffset += player.verticalVelocity * delta;

                    const groundHeight = getGroundHeightAt(landCharacter.position.x, landCharacter.position.z) ?? 0;
                    const targetY = groundHeight;
                    if (player.jumpOffset <= 0) {
                        player.landingImpact = Math.min(0.45, Math.abs(player.verticalVelocity) * 0.03);
                        player.verticalVelocity = 0;
                        player.jumpOffset = 0;
                        player.onGround = true;
                    }

                    landCharacter.userData.baseY = targetY;
                    landCharacter.userData.jumpOffset = player.jumpOffset;

                    animateCharacter(landCharacter, elapsedTime, Math.min(player.landSpeed / 7.2, 1), !player.onGround);
                    landCharacter.rotation.y = landCharacter.userData.heading ?? player.yaw;
                    boat.userData.deckCharacter.position.y = boat.userData.deckCharacter.userData.baseY;
                }
            } else {
                player.boatSpeed = THREE.MathUtils.damp(player.boatSpeed, 0, 5.2, delta);
                if (player.mode === 'boat') {
                    boat.rotation.x = 0;
                    boat.rotation.z = 0;
                    boat.userData.visuals.rotation.x = Math.sin(elapsedTime * 0.7) * 0.012;
                    boat.userData.visuals.rotation.z = Math.cos(elapsedTime * 0.62) * 0.014;
                    animateCharacter(boat.userData.deckCharacter, elapsedTime, 0);
                } else {
                    animateCharacter(landCharacter, elapsedTime, 0.05, !player.onGround);
                }
            }

            player.landingImpact = THREE.MathUtils.damp(player.landingImpact, 0, LANDING_IMPACT_DECAY, delta);

            const dockDistance = boat.position.distanceTo(DOCK_BERTH_POINT);
            const playerOnDock = isInsideDockSurface(landCharacter.position.x, landCharacter.position.z, 0.35);
            const transitionUnlocked = elapsedTime >= player.transitionLockUntil;
            const canDisembark = player.mode === 'boat' && transitionUnlocked && dockDistance < 14.2 && Math.abs(player.boatSpeed) < 2.2;
            const canBoard =
                player.mode === 'land' &&
                transitionUnlocked &&
                playerOnDock &&
                dockDistance < 17 &&
                landCharacter.position.distanceTo(boat.position) < 18;
            updateInteractionState(canDisembark, canBoard);

            if (keys.KeyE && !player.interactionLatch) {
                player.interactionLatch = true;

                if (canDisembark) {
                    player.mode = 'land';
                    landCharacter.visible = true;
                    boat.userData.deckCharacter.visible = false;
                    syncLocalBadgeVisibility('land');
                    player.boatSpeed = 0;
                    landCharacter.position.set(
                        DOCK_LAND_POINT.x,
                        (getGroundHeightAt(DOCK_LAND_POINT.x, DOCK_LAND_POINT.z) ?? 0) + 0.02,
                        DOCK_LAND_POINT.z,
                    );
                    landCharacter.userData.baseY = landCharacter.position.y;
                    player.transitionLockUntil = elapsedTime + 0.45;
                    player.cameraLockUntil = elapsedTime + 0.35;
                    player.pitch = 0;
                    player.yaw = player.heading;
                    landCharacter.userData.heading = player.heading;
                    player.cameraPosition.set(
                        landCharacter.position.x - Math.sin(player.yaw) * 6.4,
                        landCharacter.position.y + 2.8,
                        landCharacter.position.z - Math.cos(player.yaw) * 6.4,
                    );
                    setMenuMessage('Explorer mode aktif. Jalan kaki di pulau lalu kembali ke dock.');
                } else if (canBoard) {
                    player.mode = 'boat';
                    setCameraMode('third-back');
                    cameraModeRef.current = 'third-back';
                    player.onGround = true;
                    player.verticalVelocity = 0;
                    player.jumpOffset = 0;
                    player.boatSpeed = 0;
                    landCharacter.visible = false;
                    boat.userData.deckCharacter.visible = true;
                    syncLocalBadgeVisibility('boat');
                    boat.position.x = DOCK_BERTH_POINT.x;
                    boat.position.z = DOCK_BERTH_POINT.z;
                    boat.position.y = waveHeight(boat.position.x, boat.position.z, elapsedTime) + 1.45;
                    player.transitionLockUntil = elapsedTime + 0.45;
                    player.cameraLockUntil = elapsedTime + 0.65;
                    player.heading = Math.atan2(boat.position.x - DOCK_CENTER.x, boat.position.z - DOCK_CENTER.z);
                    player.pitch = 0;
                    player.yaw = player.heading;
                    boat.rotation.y = player.heading;
                    boat.rotation.x = 0;
                    boat.rotation.z = 0;
                    boat.userData.visuals.rotation.x = 0;
                    boat.userData.visuals.rotation.z = 0;
                    player.lastSafeBoatPosition.copy(boat.position);
                    player.lastSafeHeading = player.heading;
                    forwardVector.copy(getForwardVector(player.heading)).normalize();
                    rightVector.copy(getRightVector(player.heading)).normalize();
                    player.cameraPosition.set(
                        boat.position.x - forwardVector.x * 11.4 + rightVector.x * 0.45,
                        boat.position.y + 5.6,
                        boat.position.z - forwardVector.z * 11.4 + rightVector.z * 0.45,
                    );
                    setMenuMessage('Kembali ke kapal.');
                }
            } else if (!keys.KeyE) {
                player.interactionLatch = false;
            }

            if (!Number.isFinite(player.heading)) {
                player.heading = player.lastSafeHeading;
            }

            if (!Number.isFinite(player.yaw)) {
                player.yaw = player.lastSafeHeading;
            }

            if (!Number.isFinite(player.boatSpeed)) {
                player.boatSpeed = 0;
            }

            if (!isFiniteVector3(boat.position)) {
                boat.position.copy(player.lastSafeBoatPosition);
                boat.position.y = waveHeight(boat.position.x, boat.position.z, elapsedTime) + 1.45;
                player.heading = player.lastSafeHeading;
                player.yaw = player.lastSafeHeading;
            }

            if (!isFiniteVector3(player.cameraPosition)) {
                forwardVector.copy(getForwardVector(player.heading)).normalize();
                rightVector.copy(getRightVector(player.heading)).normalize();
                player.cameraPosition.set(
                    boat.position.x - forwardVector.x * 11.4 + rightVector.x * 0.45,
                    boat.position.y + 5.6,
                    boat.position.z - forwardVector.z * 11.4 + rightVector.z * 0.45,
                );
            }

            const controlledObject = player.mode === 'boat' ? boat : landCharacter;

            if (player.mode === 'boat' && isFiniteVector3(boat.position) && Number.isFinite(player.heading)) {
                player.lastSafeBoatPosition.copy(boat.position);
                player.lastSafeHeading = player.heading;
            }

            if (player.mode === 'land') {
                grassTufts.forEach((tuft) => {
                    const distance = tuft.position.distanceTo(landCharacter.position);
                    const pressed = distance < 1.6;
                    const targetScaleY = pressed ? 0.28 : 1;
                    tuft.scale.y = THREE.MathUtils.damp(tuft.scale.y, targetScaleY, 10, delta);

                    if (pressed) {
                        bendDirection.subVectors(tuft.position, landCharacter.position).normalize();
                        tuft.rotation.z = THREE.MathUtils.damp(tuft.rotation.z, bendDirection.x * 0.55, 10, delta);
                        tuft.rotation.x = THREE.MathUtils.damp(tuft.rotation.x, -bendDirection.z * 0.45, 10, delta);
                    } else {
                        tuft.rotation.z = THREE.MathUtils.damp(tuft.rotation.z, tuft.userData.baseRotationZ, 8, delta);
                        tuft.rotation.x = THREE.MathUtils.damp(tuft.rotation.x, 0, 8, delta);
                    }
                });
            } else {
                grassTufts.forEach((tuft) => {
                    tuft.scale.y = THREE.MathUtils.damp(tuft.scale.y, 1, 8, delta);
                    tuft.rotation.z = THREE.MathUtils.damp(tuft.rotation.z, tuft.userData.baseRotationZ, 8, delta);
                    tuft.rotation.x = THREE.MathUtils.damp(tuft.rotation.x, 0, 8, delta);
                });
            }

            flowerClusters.forEach((cluster, index) => {
                const wind = Math.sin(elapsedTime * 1.5 + index * 0.18) * 0.05;
                cluster.rotation.z = THREE.MathUtils.damp(cluster.rotation.z, cluster.userData.baseRotationZ + wind, 3.2, delta);
                cluster.rotation.x = THREE.MathUtils.damp(cluster.rotation.x, Math.cos(elapsedTime * 1.2 + index * 0.14) * 0.025, 3.2, delta);
            });

            skillEntries.forEach((entry, index) => {
                const pulse = 0.5 + 0.5 * Math.sin(elapsedTime * 2.6 + entry.pulseSeed);
                const distance = controlledObject.position.distanceTo(entry.grp.position);
                entry.crystal.rotation.y += delta * 0.9;
                entry.ring.rotation.z = elapsedTime * 0.5 + index * 0.2;
                entry.sign.material.opacity = THREE.MathUtils.lerp(entry.sign.material.opacity ?? 1, distance < 30 ? 1 : 0.72, 0.12);

                if (entry.collected) {
                    entry.crystal.material.emissiveIntensity = THREE.MathUtils.damp(entry.crystal.material.emissiveIntensity, 0.25, 4.2, delta);
                    entry.ring.material.emissiveIntensity = THREE.MathUtils.damp(entry.ring.material.emissiveIntensity ?? 0.2, 0.08, 4.2, delta);
                } else {
                    entry.crystal.material.emissiveIntensity = 0.55 + pulse * 0.35;
                    entry.ring.material.emissiveIntensity = 0.14 + pulse * 0.1;
                    if (controlsEnabled && distance < COLLECTION_RADIUS) {
                        collectSkill(entry);
                    }
                }
            });

            if (!easterEgg.collected) {
                easterEgg.crystal.rotation.y += delta * 1.25;
                easterEgg.ring.rotation.z = elapsedTime * 0.9;
                easterEgg.crystal.position.y = 0.7 + Math.sin(elapsedTime * 2.8) * 0.08;
                easterEgg.crystal.material.emissiveIntensity = 0.56 + Math.sin(elapsedTime * 3.2) * 0.16;

                if (controlsEnabled && player.mode === 'land' && controlledObject.position.distanceTo(easterEgg.grp.position) < 3.4) {
                    collectEasterEgg();
                }
            }

            outerIslets.beamEmitters.forEach((beamEmitter, index) => {
                const beamVisible = missionRef.current.completed;
                const pulse = 0.65 + 0.35 * Math.sin(elapsedTime * 2.1 + beamEmitter.userData.phase + index * 0.28);
                beamEmitter.visible = beamVisible;

                if (!beamVisible) {
                    beamEmitter.userData.beam.material.opacity = 0;
                    beamEmitter.userData.innerBeam.material.opacity = 0;
                    beamEmitter.userData.glow.material.opacity = 0;
                    return;
                }

                beamEmitter.rotation.y += delta * (0.1 + index * 0.02);
                beamEmitter.userData.beam.material.opacity = 0.22 + pulse * 0.22;
                beamEmitter.userData.innerBeam.material.opacity = 0.38 + pulse * 0.28;
                beamEmitter.userData.glow.material.opacity = 0.28 + pulse * 0.28;
                beamEmitter.userData.glow.scale.setScalar(0.92 + pulse * 0.38);
            });

            lookOrigin.copy(getControlledLookOrigin(player, boat, landCharacter, elapsedTime));
            cameraTarget.copy(getControlledTarget(player, boat, landCharacter, elapsedTime));

            if (player.mode === 'boat') {
                forwardVector.copy(getForwardVector(player.heading)).normalize();
                rightVector.copy(getRightVector(player.heading)).normalize();

                boat.userData.cameraBackAnchor.getWorldPosition(boatCameraWorldPosition);
                boat.userData.cameraLookAnchor.getWorldPosition(boatCameraWorldLook);
                const boatPitch = boat.userData.visuals.rotation.x ?? 0;
                const boatRoll = boat.userData.visuals.rotation.z ?? 0;
                const waveCameraBob = Math.sin(elapsedTime * 2.4 + boat.position.x * 0.03 + boat.position.z * 0.024) * 0.08;

                boatCameraSway.copy(rightVector).multiplyScalar(boatRoll * 2.6);
                boatCameraSway.addScaledVector(forwardVector, -boatPitch * 1.85);
                boatCameraSway.y += waveCameraBob + Math.abs(boatPitch) * 0.42;
                boatCameraWorldPosition.add(boatCameraSway);
                boatCameraWorldLook.addScaledVector(rightVector, boatRoll * 1.1);
                boatCameraWorldLook.addScaledVector(forwardVector, boatPitch * 1.2);
                boatCameraWorldLook.y += waveCameraBob * 0.6;

                if (elapsedTime < player.cameraLockUntil) {
                    player.cameraPosition.copy(boatCameraWorldPosition);
                } else {
                    player.cameraPosition.lerp(boatCameraWorldPosition, 0.16);
                }

                camera.position.copy(player.cameraPosition);
                boatCameraUp
                    .copy(worldUp)
                    .addScaledVector(rightVector, -boatRoll * 1.6)
                    .addScaledVector(forwardVector, boatPitch * 0.38)
                    .normalize();
                camera.up.copy(boatCameraUp);
                camera.lookAt(boatCameraWorldLook);
            } else {
                const cameraYaw = player.yaw;
                cameraDirection.copy(getForwardVector(cameraYaw)).normalize();
                const isFrontCamera = cameraModeRef.current === 'third-front';
                const followDirection = isFrontCamera ? 1 : -1;
                const desiredPosition = lookOrigin
                    .clone()
                    .addScaledVector(cameraDirection, 6.6 * followDirection)
                    .add(new THREE.Vector3(Math.cos(cameraYaw) * 0.3, 2.8 + player.landingImpact * 1.6, -Math.sin(cameraYaw) * 0.3));

                if (elapsedTime < player.cameraLockUntil) {
                    player.cameraPosition.copy(desiredPosition);
                } else {
                    player.cameraPosition.lerp(desiredPosition, 0.12);
                }

                camera.position.copy(player.cameraPosition);
                camera.lookAt(lookOrigin.clone().add(new THREE.Vector3(0, 0.82, 0)));
            }

            networkRef.current.remotePlayers.forEach((entry) => {
                if (!entry.targetState) {
                    return;
                }

                const boatState = entry.targetState.boat ?? entry.targetState;
                const landState = entry.targetState.land ?? entry.targetState;
                const remoteMode = entry.targetState.mode ?? 'boat';

                entry.boat.position.x = THREE.MathUtils.lerp(entry.boat.position.x, boatState.x ?? entry.boat.position.x, 0.12);
                entry.boat.position.y = THREE.MathUtils.lerp(entry.boat.position.y, boatState.y ?? entry.boat.position.y, 0.16);
                entry.boat.position.z = THREE.MathUtils.lerp(entry.boat.position.z, boatState.z ?? entry.boat.position.z, 0.12);

                const nextBoatHeading = THREE.MathUtils.lerp(entry.heading, boatState.heading ?? entry.heading, 0.14);
                entry.heading = nextBoatHeading;
                entry.boat.rotation.y = nextBoatHeading;
                entry.boat.rotation.x = 0;
                entry.boat.rotation.z = 0;
                entry.boat.userData.visuals.rotation.x = Math.sin(elapsedTime * 0.7 + entry.seed) * 0.03;
                entry.boat.userData.visuals.rotation.z = Math.cos(elapsedTime * 0.6 + entry.seed) * 0.02;
                entry.boat.userData.deckCharacter.visible = remoteMode === 'boat';
                entry.boat.userData.nameBadge.visible = remoteMode === 'boat';
                animateCharacter(entry.boat.userData.deckCharacter, elapsedTime, 0);

                if (remoteMode === 'land') {
                    entry.landCharacter.visible = true;
                    entry.landCharacter.position.x = THREE.MathUtils.lerp(entry.landCharacter.position.x, landState.x ?? entry.landCharacter.position.x, 0.16);
                    entry.landCharacter.position.y = THREE.MathUtils.lerp(entry.landCharacter.position.y, landState.y ?? entry.landCharacter.position.y, 0.2);
                    entry.landCharacter.position.z = THREE.MathUtils.lerp(entry.landCharacter.position.z, landState.z ?? entry.landCharacter.position.z, 0.16);
                    entry.landCharacter.userData.baseY = entry.landCharacter.position.y;
                    entry.landCharacter.userData.heading = THREE.MathUtils.lerp(
                        entry.landCharacter.userData.heading ?? entry.heading,
                        landState.heading ?? entry.heading,
                        0.18,
                    );
                    entry.landCharacter.userData.nameBadge.visible = true;
                    animateCharacter(entry.landCharacter, elapsedTime, 0.55);
                    entry.landCharacter.rotation.y = entry.landCharacter.userData.heading;
                } else {
                    entry.landCharacter.visible = false;
                    entry.landCharacter.userData.nameBadge.visible = false;
                }
            });

            const shouldSyncRoom =
                networkRef.current.playerId &&
                stageRef.current === 'playing' &&
                sessionInfoRef.current?.mode === 'multiplayer' &&
                elapsedTime - networkRef.current.lastSyncAt > ROOM_SYNC_INTERVAL_SECONDS &&
                !networkRef.current.syncInFlight;

            if (shouldSyncRoom) {
                networkRef.current.lastSyncAt = elapsedTime;
                networkRef.current.syncInFlight = true;

                void postJson('/skills/rooms/sync', {
                    code: sessionInfoRef.current.code,
                    player_uuid: networkRef.current.playerId,
                    state: {
                        mode: player.mode,
                        x: controlledObject.position.x,
                        y: controlledObject.position.y,
                        z: controlledObject.position.z,
                        heading: player.mode === 'boat' ? player.heading : (landCharacter.userData.heading ?? player.yaw),
                        boat: {
                            x: boat.position.x,
                            y: boat.position.y,
                            z: boat.position.z,
                            heading: player.heading,
                        },
                        land: {
                            x: landCharacter.position.x,
                            y: landCharacter.position.y,
                            z: landCharacter.position.z,
                            heading: landCharacter.userData.heading ?? player.yaw,
                        },
                    },
                })
                    .then((data) => {
                        const seenPlayers = new Set();

                        (data.players ?? []).forEach((remotePlayer) => {
                            const remoteEntry = ensureRemotePlayer(remotePlayer.player_uuid, remotePlayer.role, remotePlayer.display_name);
                            remoteEntry.targetState = remotePlayer.state;
                            seenPlayers.add(remotePlayer.player_uuid);
                        });

                        Array.from(networkRef.current.remotePlayers.keys()).forEach((playerId) => {
                            if (!seenPlayers.has(playerId)) {
                                removeRemotePlayer(playerId);
                            }
                        });

                        setRoomPopulation(data.player_count ?? seenPlayers.size + 1);
                    })
                    .catch(() => {
                        setMenuMessage('Koneksi room terputus. Coba masuk lagi.');
                    })
                    .finally(() => {
                        networkRef.current.syncInFlight = false;
                    });
            }

            if (elapsedTime - hudSample >= HUD_RAYCAST_INTERVAL_SECONDS) {
                hudSample = elapsedTime;
                raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
                const hits = raycaster.intersectObjects(skillEntries.map((entry) => entry.sign), false);
                const hoveredSkill = hits.length > 0 && hits[0].distance < 30 ? hits[0].object.userData.skill : null;
                const nextHudKey = hoveredSkill?.name ?? null;
                const currentHudKey = hudRef.current?.name ?? null;

                if (nextHudKey !== currentHudKey) {
                    hudRef.current = hoveredSkill;
                    setHud(hoveredSkill);
                }

                const remainingEntries = skillEntries.filter((entry) => !entry.collected);
                const nearestEntry = remainingEntries.reduce((nearest, entry) => {
                    if (!nearest) {
                        return entry;
                    }

                    const controlledPosition = player.mode === 'boat' ? boat.position : landCharacter.position;
                    return controlledPosition.distanceTo(entry.grp.position) < controlledPosition.distanceTo(nearest.grp.position) ? entry : nearest;
                }, null);

                if (nearestEntry) {
                    const controlledPosition = player.mode === 'boat' ? boat.position : landCharacter.position;
                    const nextDistance = controlledPosition.distanceTo(nearestEntry.grp.position);
                    updateMissionState({
                        ...missionRef.current,
                        nextSkill: nearestEntry.skill.name,
                        nextDistance: Number.isFinite(nextDistance) ? Math.round(nextDistance) : null,
                    });
                }
            }

            renderer.render(scene, camera);
        }

        animate();
        updateLoading(100, 'World siap dimainkan');

        const onResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };

        window.addEventListener('resize', onResize);

        if (gameRef.current.initSession !== initSession) {
            renderer.dispose();
            return;
        }

        gameRef.current = {
            ...gameRef.current,
            renderer,
            scene,
            camera,
            animationFrame,
            onResize,
            onMouseMove,
            onMouseDown,
            onKeyDown,
            onKeyUp,
            remotePlayersGroup,
            player,
            boat,
            landCharacter,
            applyLocalDisplayName,
            cleanupMissionFeedback: () => {
                if (missionFeedbackTimeout) {
                    window.clearTimeout(missionFeedbackTimeout);
                }
            },
            cleanupBadges: () => {
                disposeNameBadge(boat.userData.nameBadge);
                disposeNameBadge(landCharacter.userData.nameBadge);
            },
        };

        gameRef.current.applyLocalDisplayName(localLabel);

        setLoaded(true);
        syncStage('menu');
    }

    function destroyGame() {
        const currentGame = gameRef.current;
        gameRef.current.initSession = null;
        closeRoomSession();

        if (!currentGame.renderer) {
            return;
        }

        cancelAnimationFrame(currentGame.animationFrame);
        document.removeEventListener('mousemove', currentGame.onMouseMove);
        document.removeEventListener('keydown', currentGame.onKeyDown);
        document.removeEventListener('keyup', currentGame.onKeyUp);
        window.removeEventListener('resize', currentGame.onResize);
        currentGame.renderer.domElement.removeEventListener('pointerdown', currentGame.onMouseDown);
        currentGame.cleanupMissionFeedback?.();
        currentGame.cleanupBadges?.();
        currentGame.renderer.dispose();

        if (mountRef.current && currentGame.renderer.domElement.parentNode === mountRef.current) {
            mountRef.current.removeChild(currentGame.renderer.domElement);
        }
    }

    const postJson = async (url, payload = {}) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.message ?? 'Permintaan room gagal.');
        }

        return data;
    };

    const requestMobileFullscreen = async () => {
        if (!isMobile || isPortrait || document.fullscreenElement) {
            return;
        }

        const target = shellRef.current || document.documentElement;

        if (!target?.requestFullscreen) {
            return;
        }

        try {
            await target.requestFullscreen({ navigationUI: 'hide' });
        } catch {
            try {
                await target.requestFullscreen();
            } catch {
                return;
            }
        }
    };

    const resolvePlayerName = () => {
        const normalizedName = normalizePlayerName(playerName);

        if (!normalizedName) {
            setMenuMessage('Nama player wajib diisi sebelum memulai game.');
            return null;
        }

        return normalizedName;
    };

    const onTouchLookStart = (event) => {
        void requestMobileFullscreen();

        if (paused) {
            return;
        }

        const targetElement = event.target instanceof Element ? event.target : null;

        if (targetElement?.closest('[data-mobile-control="true"]')) {
            return;
        }

        const touch = event.touches[0];

        if (!touch) {
            return;
        }

        const shellBounds = shellRef.current?.getBoundingClientRect();

        if (shellBounds) {
            const relativeTouchX = touch.clientX - shellBounds.left;

            if (relativeTouchX < shellBounds.width * 0.42) {
                return;
            }
        }

        touchLookRef.current = {
            active: true,
            touchId: touch.identifier,
            lastX: touch.clientX,
            lastY: touch.clientY,
        };
    };

    const onTouchLookMove = (event) => {
        if (!touchLookRef.current.active || paused) {
            return;
        }

        const touch = Array.from(event.touches).find((currentTouch) => currentTouch.identifier === touchLookRef.current.touchId);

        if (!touch || !gameRef.current.player) {
            return;
        }

        const deltaX = touch.clientX - touchLookRef.current.lastX;
        const deltaY = touch.clientY - touchLookRef.current.lastY;
        gameRef.current.player.yaw -= deltaX * 0.006;
        gameRef.current.player.pitch -= deltaY * 0.005;
        gameRef.current.player.pitch = THREE.MathUtils.clamp(gameRef.current.player.pitch, -0.82, 0.42);
        touchLookRef.current.lastX = touch.clientX;
        touchLookRef.current.lastY = touch.clientY;
    };

    const onTouchLookEnd = (event) => {
        const activeTouchEnded = Array.from(event.changedTouches).some((touch) => touch.identifier === touchLookRef.current.touchId);

        if (!activeTouchEnded) {
            return;
        }

        touchLookRef.current = {
            active: false,
            touchId: null,
            lastX: 0,
            lastY: 0,
        };
    };

    const mobileJump = () => {
        keysRef.current.Space = true;
        window.setTimeout(() => {
            keysRef.current.Space = false;
        }, 120);
    };

    const setMobileRunState = (nextState) => {
        keysRef.current.ShiftLeft = nextState;
    };

    const mobileInteract = () => {
        keysRef.current.KeyE = true;
        window.setTimeout(() => {
            keysRef.current.KeyE = false;
        }, 120);
    };

    const updateRoomPopulation = () => {
        setRoomPopulation(networkRef.current.remotePlayers.size + (sessionInfoRef.current?.mode === 'multiplayer' ? 1 : 0));
    };

    const removeRemotePlayer = (playerId) => {
        const remoteEntry = networkRef.current.remotePlayers.get(playerId);

        if (!remoteEntry) {
            return;
        }

        if (gameRef.current.remotePlayersGroup) {
            gameRef.current.remotePlayersGroup.remove(remoteEntry.boat);
            gameRef.current.remotePlayersGroup.remove(remoteEntry.landCharacter);
        }

        disposeNameBadge(remoteEntry.boat.userData.nameBadge);
        disposeNameBadge(remoteEntry.landCharacter.userData.nameBadge);
        networkRef.current.remotePlayers.delete(playerId);
        updateRoomPopulation();
    };

    const ensureRemotePlayer = (playerId, role, displayName) => {
        const existingEntry = networkRef.current.remotePlayers.get(playerId);

        if (existingEntry) {
            const nextLabel = normalizePlayerName(displayName) || (role === 'host' ? 'HOST' : 'CREW');
            existingEntry.boat.userData.nameBadge = replaceNameBadge(
                existingEntry.boat,
                existingEntry.boat.userData.nameBadge,
                nextLabel,
                existingEntry.accentColor,
                existingEntry.targetState?.mode !== 'land',
            );
            existingEntry.landCharacter.userData.nameBadge = replaceNameBadge(
                existingEntry.landCharacter,
                existingEntry.landCharacter.userData.nameBadge,
                nextLabel,
                existingEntry.accentColor,
                existingEntry.targetState?.mode === 'land',
            );
            return existingEntry;
        }

        const sharedAssets = buildSharedAssets();
        const accentColor = role === 'host' ? 0x38bdf8 : 0xfacc15;
        const normalizedLabel = normalizePlayerName(displayName) || (role === 'host' ? 'HOST' : 'CREW');
        const boat = createBoatRig(sharedAssets, {
            accentColor,
            label: normalizedLabel,
        });
        keepObjectAlwaysRenderable(boat, 3);
        boat.position.set((networkRef.current.remotePlayers.size + 1) * 4, waveHeight((networkRef.current.remotePlayers.size + 1) * 4, 0, 0) + 1.45, 0);
        boat.userData.deckCharacter.visible = true;

        const landCharacter = createCharacter(sharedAssets, accentColor);
        landCharacter.userData.nameBadge = createNameBadge(normalizedLabel, accentColor);
        landCharacter.userData.nameBadge.visible = false;
        landCharacter.add(landCharacter.userData.nameBadge);
        landCharacter.visible = false;
        keepObjectAlwaysRenderable(landCharacter, 3);

        if (gameRef.current.remotePlayersGroup) {
            gameRef.current.remotePlayersGroup.add(boat);
            gameRef.current.remotePlayersGroup.add(landCharacter);
        }

        const nextEntry = {
            boat,
            landCharacter,
            heading: Math.PI,
            role,
            targetState: null,
            seed: Math.random() * Math.PI * 2,
            accentColor,
        };
        networkRef.current.remotePlayers.set(playerId, nextEntry);
        updateRoomPopulation();

        return nextEntry;
    };

    const closeRoomSession = () => {
        networkRef.current.remotePlayers.forEach((entry) => {
            if (gameRef.current.remotePlayersGroup) {
                gameRef.current.remotePlayersGroup.remove(entry.boat);
                gameRef.current.remotePlayersGroup.remove(entry.landCharacter);
            }

            disposeNameBadge(entry.boat.userData.nameBadge);
            disposeNameBadge(entry.landCharacter.userData.nameBadge);
        });

        networkRef.current = {
            roomCode: null,
            playerId: null,
            remotePlayers: new Map(),
            lastSyncAt: 0,
            syncInFlight: false,
        };
        setRoomPopulation(1);
    };

    const openRoomSession = async (nextSessionInfo) => {
        closeRoomSession();

        if (nextSessionInfo.mode !== 'multiplayer' || !nextSessionInfo.code) {
            return true;
        }

        const data = await postJson('/skills/rooms/join', {
            code: nextSessionInfo.code,
            display_name: nextSessionInfo.displayName,
            role: nextSessionInfo.role,
        });

        networkRef.current = {
            roomCode: data.room.code,
            playerId: data.player_uuid,
            remotePlayers: new Map(),
            lastSyncAt: 0,
            syncInFlight: false,
        };

        (data.players ?? []).forEach((remotePlayer) => {
            const remoteEntry = ensureRemotePlayer(
                remotePlayer.player_uuid,
                remotePlayer.role,
                remotePlayer.display_name,
            );
            remoteEntry.targetState = remotePlayer.state;
        });

        setRoomPopulation(data.player_count ?? 1);

        return true;
    };

    const startGameplay = async (nextSessionInfo) => {
        const normalizedName = normalizePlayerName(nextSessionInfo.displayName ?? playerName);

        if (!normalizedName) {
            setMenuMessage('Nama player wajib diisi sebelum memulai game.');
            return;
        }

        const sessionPayload = {
            ...nextSessionInfo,
            displayName: normalizedName,
        };

        setMenuMessage('');
        setMenuBusy(true);

        if (sessionPayload.mode === 'multiplayer') {
            try {
                await openRoomSession(sessionPayload);
            } catch (error) {
                setMenuBusy(false);
                setMenuMessage(error.message);
                return;
            }
        } else {
            closeRoomSession();
        }

        gameRef.current.applyLocalDisplayName?.(normalizedName);
        setSessionInfo(sessionPayload);
        setShowHelp(true);
        setPaused(false);
        pausedRef.current = false;
        syncStage('playing');
        setMenuBusy(false);
        await requestMobileFullscreen();
    };

    const handleSinglePlayer = async () => {
        const normalizedName = resolvePlayerName();

        if (!normalizedName) {
            return;
        }

        await startGameplay({
            mode: 'single',
            role: 'solo',
            label: 'Single Player',
            displayName: normalizedName,
        });
    };

    const handleCreateGame = async () => {
        const normalizedName = resolvePlayerName();

        if (!normalizedName) {
            return;
        }

        setMenuBusy(true);
        setMenuMessage('');

        try {
            const data = await postJson('/skills/rooms');
            setRoomCode(data.code);
            setSessionInfo({
                mode: 'multiplayer',
                role: 'host',
                code: data.code,
                label: 'Multiplayer Host',
                displayName: normalizedName,
            });
            setMenuMessage('Room siap. Bagikan kode ini ke pemain kedua.');
        } catch (error) {
            setMenuMessage(error.message);
        } finally {
            setMenuBusy(false);
        }
    };

    const handleJoinGame = () => {
        const normalizedName = resolvePlayerName();

        if (!normalizedName) {
            return;
        }

        const normalizedCode = joinCode.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);

        if (normalizedCode.length !== 6) {
            setMenuMessage('Masukkan 6 karakter kode room terlebih dulu.');
            return;
        }

        setRoomCode(normalizedCode);
        setSessionInfo({
            mode: 'multiplayer',
            role: 'guest',
            code: normalizedCode,
            label: 'Multiplayer Guest',
            displayName: normalizedName,
        });
        setMenuMessage(`Player 2 siap masuk ke room ${normalizedCode}.`);
    };

    const handleCopyCode = async () => {
        if (!roomCode || !navigator.clipboard?.writeText) {
            return;
        }

        try {
            await navigator.clipboard.writeText(roomCode);
            setMenuMessage(`Kode ${roomCode} berhasil disalin.`);
        } catch {
            setMenuMessage('Browser menolak copy otomatis. Salin manual saja.');
        }
    };

    if (isMobile && isPortrait) {
        return createLandscapePrompt();
    }

    return (
        <div
            ref={shellRef}
            onTouchStart={onTouchLookStart}
            onTouchMove={onTouchLookMove}
            onTouchEnd={onTouchLookEnd}
            style={{
                position: 'relative',
                width: '100%',
                height: isMobile ? '100dvh' : '100vh',
                overflow: 'hidden',
                background: '#04111f',
                touchAction: 'none',
            }}
        >
            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

            {!loaded && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 50,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'linear-gradient(180deg, rgba(6,10,18,0.88) 0%, rgba(5,10,24,0.92) 48%, rgba(5,10,20,0.96) 100%)',
                    color: '#f8fafc',
                    padding: 24,
                    backdropFilter: 'blur(16px)',
                }}>
                    <div style={{
                        ...voyagePanelStyle(isMobile),
                        maxWidth: 460,
                        textAlign: 'center',
                        display: 'grid',
                        gap: 18,
                    }}>
                        <div style={{ fontSize: 11, letterSpacing: '0.34em', textTransform: 'uppercase', color: '#d9a15f', fontWeight: 900 }}>
                            Loading Voyage
                        </div>
                        <div style={{
                            fontSize: isMobile ? 28 : 34,
                            fontWeight: 900,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#fff2d8',
                            lineHeight: 1.15,
                        }}>
                            {loadingLabel}
                        </div>
                        <div style={{ fontSize: 14, color: 'rgba(255,240,214,0.72)', lineHeight: 1.7 }}>
                            Engine 3D sedang dipasang.
                        </div>
                        <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
                            <div style={{ width: 220, maxWidth: '80vw', height: 7, borderRadius: 999, background: 'rgba(34,22,14,0.66)', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${loadingProgress}%`,
                                    height: '100%',
                                    borderRadius: 999,
                                    background: 'linear-gradient(90deg, #8a5f3f 0%, #d9a15f 55%, #f6ddb4 100%)',
                                    boxShadow: '0 0 22px rgba(217,161,95,0.28)',
                                    transition: 'width 220ms ease',
                                }}
                                />
                            </div>
                            <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,240,214,0.48)' }}>
                                {loadingProgress}% ready
                            </div>
                        </div>
                    </div>
                    <style>{`
                        @keyframes skillsSpin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}

            {loaded && gameStage === 'playing' && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: isMobile ? 10 : 18,
                        left: isMobile ? 10 : 18,
                        zIndex: 20,
                        width: isMobile ? 'min(210px, calc(100% - 130px))' : 340,
                        maxWidth: 'calc(100% - 36px)',
                        ...voyagePanelStyle(isMobile),
                        color: '#fff2d8',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                            <div>
                                <div style={{ fontSize: isMobile ? 8 : 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#8fd8ff', fontWeight: 900 }}>
                                    Voyage Objective
                                </div>
                                <div style={{ marginTop: isMobile ? 4 : 10, fontSize: isMobile ? 11 : 24, fontWeight: 900, lineHeight: 1.1, color: '#fff8ea' }}>
                                    {missionHeadline}
                                </div>
                                <div style={{ marginTop: isMobile ? 5 : 10, fontSize: isMobile ? 8 : 12, lineHeight: 1.3, color: 'rgba(255,240,214,0.82)' }}>
                                    {missionSubline}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: isMobile ? 8 : 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,240,214,0.7)' }}>
                                    Intel
                                </div>
                                <div style={{ marginTop: 3, fontSize: isMobile ? 11 : 24, fontWeight: 900, color: '#f6ddb4' }}>
                                    {missionState.score}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: isMobile ? 8 : 16, height: isMobile ? 5 : 8, borderRadius: 999, background: 'rgba(34,22,14,0.66)', overflow: 'hidden' }}>
                            <div style={{
                                width: `${(missionState.collectedCount / Math.max(missionState.totalCount, 1)) * 100}%`,
                                height: '100%',
                                borderRadius: 999,
                                background: 'linear-gradient(90deg, #8a5f3f 0%, #d9a15f 55%, #f6ddb4 100%)',
                                boxShadow: '0 0 22px rgba(217,161,95,0.28)',
                                transition: 'width 220ms ease',
                            }}
                            />
                        </div>

                        <div style={{ marginTop: isMobile ? 6 : 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: isMobile ? 8 : 12, color: 'rgba(255,240,214,0.74)' }}>
                            <span>{missionState.collectedCount}/{missionState.totalCount} beacon diamankan</span>
                            <span>{missionState.nextDistance !== null ? `${missionState.nextDistance}m` : 'Selesai'}</span>
                        </div>

                        <div style={{ marginTop: 5, fontSize: isMobile ? 8 : 12, color: missionState.completed ? '#dff5b2' : 'rgba(255,240,214,0.84)' }}>
                            {missionState.completed
                                ? 'Semua distrik aktif. Pulau portfolio selesai dipulihkan.'
                                : `Target terdekat: ${missionState.nextSkill ?? 'Mencari beacon berikutnya'}`}
                        </div>

                        {!missionState.easterEggFound && (
                            <div style={{ marginTop: 5, fontSize: isMobile ? 7 : 11, color: 'rgba(255,192,220,0.88)' }}>
                                Easter egg: cari sinyal kristal pink di tepian pulau.
                            </div>
                        )}
                    </div>

                    {sessionInfo?.mode === 'multiplayer' && (
                        <div style={{
                            position: 'absolute',
                            top: isMobile ? 10 : 18,
                            right: isMobile ? 10 : 18,
                            zIndex: 20,
                            padding: isMobile ? '8px 10px' : '12px 14px',
                            borderRadius: isMobile ? 12 : 16,
                            border: '1px solid rgba(148,163,184,0.16)',
                            background: 'rgba(8,15,31,0.84)',
                            color: '#f8fafc',
                            minWidth: isMobile ? 108 : 180,
                            textAlign: 'right',
                        }}>
                            <div style={{ fontSize: isMobile ? 8 : 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: sessionInfo.role === 'host' ? '#7dd3fc' : '#fde68a', fontWeight: 900 }}>
                                {sessionInfo.role === 'host' ? 'Host Room' : 'Player 2'}
                            </div>
                            <div style={{ marginTop: 4, fontSize: isMobile ? 11 : 18, fontWeight: 900, letterSpacing: '0.16em' }}>
                                {sessionInfo.code}
                            </div>
                            <div style={{ marginTop: 2, fontSize: isMobile ? 9 : 12, color: 'rgba(226,232,240,0.74)' }}>
                                {roomPopulation} pemain
                            </div>
                        </div>
                    )}

                    {showHelp && (
                        <div
                            onClick={() => setShowHelp(false)}
                            style={{
                                position: 'absolute',
                                top: isMobile ? 96 : sessionInfo?.mode === 'multiplayer' ? 122 : 18,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 20,
                                width: isMobile ? 'min(300px, calc(100% - 40px))' : 420,
                                maxWidth: 'calc(100% - 36px)',
                                padding: isMobile ? '12px 14px' : '16px 18px',
                                borderRadius: isMobile ? 16 : 18,
                                border: '1px solid rgba(125,211,252,0.16)',
                                background: 'rgba(8,15,31,0.86)',
                                color: '#f8fafc',
                                textAlign: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            <div style={{ fontSize: isMobile ? 12 : 15, fontWeight: 700, lineHeight: 1.6 }}>
                                {isMobile
                                    ? 'Swipe kanan untuk arah · Analog kiri untuk jalan · Run dan Jump di kanan'
                                    : 'WASD bergerak · Space jump · E naik/turun kapal · C ganti kamera · Esc menu'}
                            </div>
                            <div style={{ marginTop: 6, fontSize: isMobile ? 11 : 12, color: 'rgba(226,232,240,0.56)' }}>
                                Klik panel ini untuk dismiss
                            </div>
                        </div>
                    )}

                    {hud && (
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '58%',
                            transform: 'translateX(-50%)',
                            zIndex: 18,
                            pointerEvents: 'none',
                            padding: '10px 18px',
                            borderRadius: 16,
                            border: `1px solid ${hud.color}55`,
                            background: 'rgba(5,12,25,0.84)',
                            color: '#f8fafc',
                            textAlign: 'center',
                            minWidth: 220,
                        }}>
                            <div style={{ fontSize: 18, fontWeight: 900, color: hud.color }}>
                                {hud.name}
                            </div>
                            <div style={{ marginTop: 4, fontSize: 12, color: 'rgba(226,232,240,0.7)' }}>
                                {hud.zone} · {hud.category}
                            </div>
                        </div>
                    )}

                    {interactionPrompt && !isMobile && (
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: isMobile ? 116 : 34,
                            transform: 'translateX(-50%)',
                            zIndex: 18,
                            padding: isMobile ? '10px 14px' : '12px 18px',
                            borderRadius: 999,
                            border: '1px solid rgba(125,211,252,0.22)',
                            background: 'rgba(5,12,25,0.84)',
                            color: '#e0f2fe',
                            fontSize: isMobile ? 11 : 13,
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            boxShadow: '0 16px 36px rgba(2,8,23,0.28)',
                            maxWidth: 'calc(100% - 140px)',
                            textAlign: 'center',
                        }}>
                            {interactionPrompt}
                        </div>
                    )}

                    {missionState.recentlyCollected && (
                        <div style={{
                            position: 'absolute',
                            right: 18,
                            bottom: isMobile ? 128 : 34,
                            zIndex: 18,
                            padding: isMobile ? '12px 14px' : '14px 16px',
                            borderRadius: isMobile ? 16 : 18,
                            border: '1px solid rgba(110,231,183,0.22)',
                            background: 'linear-gradient(180deg, rgba(4,18,16,0.94) 0%, rgba(4,12,10,0.88) 100%)',
                            color: '#ecfdf5',
                            minWidth: isMobile ? 170 : 240,
                            maxWidth: isMobile ? 188 : 'none',
                        }}>
                            <div style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#6ee7b7', fontWeight: 900 }}>
                                Beacon Secured
                            </div>
                            <div style={{ marginTop: 8, fontSize: isMobile ? 16 : 20, fontWeight: 900 }}>
                                {missionState.recentlyCollected}
                            </div>
                        </div>
                    )}

                    {!isMobile && (
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                            zIndex: 16,
                        }}>
                            <svg width="20" height="20" viewBox="0 0 20 20">
                                <line x1="10" y1="1" x2="10" y2="7" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                                <line x1="10" y1="13" x2="10" y2="19" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                                <line x1="1" y1="10" x2="7" y2="10" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                                <line x1="13" y1="10" x2="19" y2="10" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
                                <circle cx="10" cy="10" r="2" fill="none" stroke="rgba(125,211,252,0.9)" strokeWidth="1.2" />
                            </svg>
                        </div>
                    )}
                </>
            )}

            {(gameStage === 'menu' || paused) && loaded && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobile ? 8 : 20,
                    background: 'linear-gradient(180deg, rgba(6,10,18,0.34) 0%, rgba(5,10,24,0.62) 50%, rgba(5,10,20,0.78) 100%)',
                    backdropFilter: 'blur(14px)',
                }}>
                    <div style={{
                        ...voyagePanelStyle(isMobile),
                        width: '100%',
                        maxWidth: isMobile ? 340 : 520,
                        color: '#f8fafc',
                    }}>
                        <div style={{ fontSize: 11, letterSpacing: '0.34em', textTransform: 'uppercase', color: '#d9a15f', fontWeight: 900 }}>
                            {paused ? 'Voyage Paused' : 'Launch World'}
                        </div>
                        <div style={{
                            marginTop: isMobile ? 8 : 14,
                            fontSize: isMobile ? 16 : 30,
                            fontWeight: 900,
                            lineHeight: 1.14,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            color: '#fff2d8',
                        }}>
                            {paused ? 'Perjalanan Dijeda' : 'Skills Island Portfolio'}
                        </div>
                        {paused && isMobile && (
                            <p style={{ margin: '8px 0 0', color: 'rgba(255,240,214,0.72)', lineHeight: 1.45, fontSize: 11 }}>
                                Lanjutkan perjalanan atau kembali ke menu utama.
                            </p>
                        )}
                        {!isMobile && (
                            <p style={{ margin: '12px 0 0', color: 'rgba(255,240,214,0.72)', lineHeight: 1.6, fontSize: 15 }}>
                                {paused
                                    ? 'Perjalanan dihentikan sebentar. Lanjutkan pelayaran atau kembali ke menu utama.'
                                    : 'Pulau utama sekarang punya dock, distrik skill, eksplorasi jalan kaki, dan mode kamera yang lebih stabil.'}
                            </p>
                        )}

                        {!(paused && isMobile) && (
                            <>
                                <div style={{ marginTop: isMobile ? 12 : 16, display: 'grid', gap: isMobile ? 8 : 12 }}>
                                    <input
                                        type="text"
                                        value={playerName}
                                        onChange={(event) => {
                                            setPlayerName(normalizePlayerName(event.target.value));
                                            setMenuMessage('');
                                        }}
                                        placeholder="Masukkan nama player"
                                        maxLength={24}
                                        style={{
                                            width: '100%',
                                            minWidth: 0,
                                            padding: isMobile ? '10px 11px' : '14px 16px',
                                            borderRadius: isMobile ? 12 : 14,
                                            border: '1px solid rgba(217,161,95,0.18)',
                                            background: 'rgba(38,26,18,0.54)',
                                            color: '#fff2d8',
                                            fontSize: isMobile ? 13 : 16,
                                            fontWeight: 700,
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => void handleSinglePlayer()}
                                        disabled={menuBusy}
                                        style={menuPrimaryButton('#d9a15f', isMobile)}
                                    >
                                        Start Single Player
                                    </button>

                                    {sessionInfo?.mode === 'multiplayer' ? (
                                        <button
                                            type="button"
                                            onClick={() => void startGameplay(sessionInfo)}
                                            disabled={menuBusy}
                                            style={menuPrimaryButton('#c78b52', isMobile)}
                                        >
                                            {sessionInfo.role === 'host' ? 'Start As Host' : 'Join As Player 2'}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => void handleCreateGame()}
                                            disabled={menuBusy}
                                            style={menuSecondaryButton(isMobile)}
                                        >
                                            Create Multiplayer Room
                                        </button>
                                    )}

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: isMobile ? '1fr' : '1fr auto auto',
                                        gap: isMobile ? 6 : 10,
                                    }}>
                                        <input
                                            type="text"
                                            value={joinCode}
                                            onChange={(event) => {
                                                setJoinCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
                                                setMenuMessage('');
                                            }}
                                            placeholder="Masukkan kode room"
                                            style={{
                                                width: '100%',
                                                minWidth: 0,
                                                padding: isMobile ? '10px 11px' : '14px 16px',
                                                borderRadius: isMobile ? 12 : 14,
                                                border: '1px solid rgba(217,161,95,0.18)',
                                                background: 'rgba(38,26,18,0.54)',
                                                color: '#fff2d8',
                                                fontSize: isMobile ? 13 : 16,
                                                fontWeight: 700,
                                                letterSpacing: '0.14em',
                                                textTransform: 'uppercase',
                                            }}
                                        />
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))',
                                        gap: isMobile ? 6 : 10,
                                    }}>
                                        <button type="button" onClick={handleJoinGame} disabled={menuBusy} style={menuGhostButton(isMobile)}>
                                            Join
                                        </button>
                                        {roomCode ? (
                                            <button type="button" onClick={() => void handleCopyCode()} style={menuGhostButton(isMobile)}>
                                                Copy
                                            </button>
                                        ) : (
                                            <button type="button" onClick={() => navigateWithCleanup('/')} style={menuGhostButton(isMobile)}>
                                                Home
                                            </button>
                                        )}
                                        {isMobile && roomCode && (
                                            <button type="button" onClick={() => navigateWithCleanup('/')} style={menuGhostButton(isMobile)}>
                                                Home
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {(menuBusy || menuMessage || !isMobile) && (
                                    <div style={{
                                        marginTop: isMobile ? 10 : 16,
                                        padding: isMobile ? '9px 10px' : '14px 16px',
                                        borderRadius: isMobile ? 12 : 16,
                                        border: '1px solid rgba(217,161,95,0.12)',
                                        background: 'rgba(34,22,14,0.34)',
                                        fontSize: isMobile ? 10 : 13,
                                        lineHeight: isMobile ? 1.4 : 1.5,
                                        color: menuMessage ? '#fff2d8' : 'rgba(255,240,214,0.7)',
                                    }}>
                                        {menuBusy
                                            ? 'Menghubungkan room online...'
                                            : menuMessage || 'Isi nama player dulu, lalu WASD bergerak, E naik turun kapal, C ganti kamera, dan eksplorasi distrik skill di pulau utama.'}
                                    </div>
                                )}
                            </>
                        )}

                        {paused && (
                            <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPaused(false);
                                        pausedRef.current = false;
                                    }}
                                    style={menuPrimaryButton('#d9a15f', isMobile)}
                                >
                                    Resume Voyage
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPaused(false);
                                        pausedRef.current = false;
                                        syncStage('menu');
                                    }}
                                    style={menuGhostButton(isMobile)}
                                >
                                    Main Menu
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isMobile && loaded && gameStage === 'playing' && (
                <>
                    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 90, display: 'flex', gap: 4 }}>
                        {!isFullscreen && (
                            <button type="button" onClick={() => void requestMobileFullscreen()} style={floatingButtonStyle(true)}>
                                <Scan size={10} />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                const activeMode = gameRef.current.player?.mode === 'boat' ? 'third-back' : cameraModeRef.current;
                                const currentIndex = CAMERA_MODES.indexOf(activeMode);
                                const nextMode = gameRef.current.player?.mode === 'boat'
                                    ? 'third-back'
                                    : CAMERA_MODES[(currentIndex + 1) % CAMERA_MODES.length];
                                setCameraMode(nextMode);
                                cameraModeRef.current = nextMode;
                            }}
                            style={floatingButtonStyle(true)}
                        >
                            <Orbit size={10} />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setPaused(true);
                                pausedRef.current = true;
                            }}
                            style={floatingButtonStyle(true)}
                        >
                            <PanelRightOpen size={10} />
                        </button>
                    </div>
                    <MobileControls
                        keys={keysRef.current}
                        playerMode={mobilePlayerMode}
                        showBoardButton={canBoardBoat}
                        showLeaveButton={canLeaveBoat}
                        onBoardBoat={mobileInteract}
                        onLeaveBoat={mobileInteract}
                        onJump={mobileJump}
                        onRunChange={setMobileRunState}
                    />
                </>
            )}
        </div>
    );
};

function voyagePanelStyle(isMobile = false) {
    return {
        borderRadius: isMobile ? 22 : 28,
        border: '1px solid rgba(103,72,47,0.92)',
        background: 'linear-gradient(180deg, rgba(92,65,46,0.96) 0%, rgba(84,59,42,0.98) 100%)',
        padding: isMobile ? 14 : 30,
        boxShadow: '0 0 0 8px rgba(33,23,15,0.92), 0 28px 80px rgba(0,0,0,0.42)',
    };
}

function menuPrimaryButton(color = '#d9a15f', compact = false) {
    return {
        width: '100%',
        padding: compact ? '10px 12px' : '14px 18px',
        border: 'none',
        borderRadius: compact ? 12 : 16,
        background: color,
        color: '#1b130d',
        fontSize: compact ? 12 : 15,
        fontWeight: 900,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 24px rgba(18,11,7,0.24)',
    };
}

function menuSecondaryButton(compact = false) {
    return {
        width: '100%',
        padding: compact ? '10px 12px' : '14px 18px',
        border: '1px solid rgba(217,161,95,0.22)',
        borderRadius: compact ? 12 : 16,
        background: 'rgba(34,22,14,0.42)',
        color: '#fff2d8',
        fontSize: compact ? 11 : 14,
        fontWeight: 800,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: 'pointer',
    };
}

function menuGhostButton(compact = false) {
    return {
        padding: compact ? '10px 11px' : '14px 16px',
        border: '1px solid rgba(217,161,95,0.18)',
        borderRadius: compact ? 12 : 14,
        background: 'rgba(34,22,14,0.42)',
        color: '#fff2d8',
        fontSize: compact ? 11 : 14,
        fontWeight: 800,
        cursor: 'pointer',
        textTransform: 'uppercase',
    };
}

function floatingButtonStyle(compact = false) {
    return {
        minWidth: compact ? 32 : 74,
        minHeight: compact ? 32 : 'auto',
        padding: compact ? '0' : '10px 14px',
        border: '1px solid rgba(123,88,58,0.82)',
        borderRadius: compact ? 12 : 12,
        background: 'linear-gradient(180deg, rgba(81,56,39,0.96) 0%, rgba(61,39,26,0.98) 100%)',
        color: '#f6ddb4',
        fontSize: compact ? 9 : 12,
        fontWeight: 800,
        display: 'grid',
        placeItems: 'center',
        boxShadow: '0 6px 16px rgba(18,11,7,0.28), inset 0 1px 0 rgba(255,240,214,0.08)',
    };
}

function MobileControls({ keys, playerMode, showBoardButton, showLeaveButton, onBoardBoat, onLeaveBoat, onJump, onRunChange }) {
    useEffect(() => {
        return () => {
            onRunChange(false);
        };
    }, [onRunChange]);

    useEffect(() => {
        if (playerMode === 'boat') {
            onRunChange(false);
        }
    }, [onRunChange, playerMode]);

    return (
        <>
            <MobileJoystick keys={keys} />

            {playerMode !== 'boat' && (
                <div style={{
                    position: 'absolute',
                    right: 26,
                    bottom: 28,
                    zIndex: 90,
                    width: 184,
                    height: 184,
                }}>
                    <div style={{
                        position: 'absolute',
                        right: 84,
                        top: 0,
                    }}>
                        <HoldButton
                            label="Run"
                            onChange={onRunChange}
                        />
                    </div>
                    <div style={{
                        position: 'absolute',
                        right: 0,
                        top: 88,
                    }}>
                        <TapButton
                            label="Jump"
                            onPress={onJump}
                        />
                    </div>
                </div>
            )}

            {(showBoardButton || showLeaveButton) && (
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 32,
                    transform: 'translateX(-50%)',
                    zIndex: 91,
                }}>
                    <SmallActionButton
                        icon={showBoardButton ? LogIn : LogOut}
                        ariaLabel={showBoardButton ? 'Masuk kapal' : 'Keluar kapal'}
                        onPress={showBoardButton ? onBoardBoat : onLeaveBoat}
                    />
                </div>
            )}
        </>
    );
}

function MobileJoystick({ keys }) {
    const stickPointerRef = useRef(null);
    const [stickOffset, setStickOffset] = useState({ x: 0, y: 0 });
    const [active, setActive] = useState({});
    const baseSize = 78;
    const knobSize = 34;
    const maxDistance = 22;

    useEffect(() => {
        return () => {
            ['KeyW', 'KeyA', 'KeyS', 'KeyD'].forEach((key) => {
                keys[key] = false;
            });
            stickPointerRef.current = null;
        };
    }, [keys]);

    const setKeyState = (key, nextState) => {
        keys[key] = nextState;
        setActive((previousState) => ({ ...previousState, [key]: nextState }));
    };

    const stopTouchLook = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const syncStickKeys = (nextX, nextY) => {
        setKeyState('KeyA', nextX < -0.34);
        setKeyState('KeyD', nextX > 0.34);
        setKeyState('KeyW', nextY < -0.34);
        setKeyState('KeyS', nextY > 0.34);
    };

    const resetStick = () => {
        setStickOffset({ x: 0, y: 0 });
        syncStickKeys(0, 0);
    };

    const updateStick = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;
        const distance = Math.min(Math.hypot(deltaX, deltaY), maxDistance);
        const angle = Math.atan2(deltaY, deltaX);
        const offsetX = Math.cos(angle) * distance;
        const offsetY = Math.sin(angle) * distance;
        const normalizedX = maxDistance === 0 ? 0 : offsetX / maxDistance;
        const normalizedY = maxDistance === 0 ? 0 : offsetY / maxDistance;

        setStickOffset({ x: offsetX, y: offsetY });
        syncStickKeys(normalizedX, normalizedY);
    };

    return (
        <div
            data-mobile-control="true"
            onPointerDown={stopTouchLook}
            onPointerMove={stopTouchLook}
            onPointerUp={stopTouchLook}
            onPointerCancel={stopTouchLook}
            onTouchStart={stopTouchLook}
            onTouchMove={stopTouchLook}
            onTouchEnd={stopTouchLook}
            style={{
                position: 'absolute',
                left: 28,
                bottom: 26,
                zIndex: 90,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                alignItems: 'center',
            }}
        >
            <div style={{
                padding: '4px 7px',
                borderRadius: 999,
                background: 'linear-gradient(180deg, rgba(81,56,39,0.96) 0%, rgba(61,39,26,0.98) 100%)',
                border: '1px solid rgba(123,88,58,0.82)',
                color: '#f6ddb4',
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                boxShadow: '0 5px 12px rgba(18,11,7,0.24)',
            }}>
                <Move size={9} />
                Move
            </div>
            <div
                role="presentation"
                onPointerDown={(event) => {
                    stopTouchLook(event);
                    stickPointerRef.current = event.pointerId;
                    event.currentTarget.setPointerCapture?.(event.pointerId);
                    updateStick(event);
                }}
                onPointerMove={(event) => {
                    if (stickPointerRef.current !== event.pointerId) {
                        return;
                    }

                    stopTouchLook(event);
                    updateStick(event);
                }}
                onPointerUp={(event) => {
                    if (stickPointerRef.current !== event.pointerId) {
                        return;
                    }

                    stopTouchLook(event);
                    event.currentTarget.releasePointerCapture?.(event.pointerId);
                    stickPointerRef.current = null;
                    resetStick();
                }}
                onPointerCancel={(event) => {
                    if (stickPointerRef.current !== event.pointerId) {
                        return;
                    }

                    stopTouchLook(event);
                    stickPointerRef.current = null;
                    resetStick();
                }}
                style={{
                    position: 'relative',
                    width: baseSize,
                    height: baseSize,
                    borderRadius: '50%',
                    border: '1px solid rgba(123,88,58,0.88)',
                    background: 'radial-gradient(circle at 50% 50%, rgba(166,119,74,0.34) 0%, rgba(78,52,35,0.96) 58%, rgba(48,30,20,1) 100%)',
                    boxShadow: '0 12px 24px rgba(18,11,7,0.34)',
                    touchAction: 'none',
                    WebkitTapHighlightColor: 'transparent',
                }}
            >
                <div style={{
                    position: 'absolute',
                    inset: 10,
                    borderRadius: '50%',
                    border: '1px solid rgba(246,221,180,0.14)',
                }}
                />
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: knobSize,
                    height: knobSize,
                    marginLeft: -(knobSize / 2),
                    marginTop: -(knobSize / 2),
                    borderRadius: '50%',
                    border: '1px solid rgba(246,221,180,0.18)',
                    background: active.KeyW || active.KeyA || active.KeyS || active.KeyD
                        ? 'linear-gradient(180deg, rgba(233,194,128,1) 0%, rgba(182,127,66,0.98) 100%)'
                        : 'linear-gradient(180deg, rgba(214,185,153,0.95) 0%, rgba(145,103,63,0.88) 100%)',
                    boxShadow: '0 8px 16px rgba(18,11,7,0.26)',
                    transform: `translate(${stickOffset.x}px, ${stickOffset.y}px)`,
                }}
                />
            </div>
        </div>
    );
}

function HoldButton({ label, onChange }) {
    const [pressed, setPressed] = useState(false);

    const updatePressed = (event, nextState) => {
        event.preventDefault();
        event.stopPropagation();

        if (nextState) {
            event.currentTarget.setPointerCapture?.(event.pointerId);
        } else {
            event.currentTarget.releasePointerCapture?.(event.pointerId);
        }

        setPressed(nextState);
        onChange(nextState);
    };

    return (
        <button
            data-mobile-control="true"
            type="button"
            onPointerDown={(event) => updatePressed(event, true)}
            onPointerUp={(event) => updatePressed(event, false)}
            onPointerCancel={(event) => updatePressed(event, false)}
            onPointerLeave={(event) => {
                if (!pressed) {
                    return;
                }

                updatePressed(event, false);
            }}
            style={{
                width: 76,
                height: 76,
                padding: '0',
                borderRadius: '50%',
                border: '1px solid rgba(123,88,58,0.82)',
                background: pressed
                    ? 'linear-gradient(180deg, rgba(233,194,128,1) 0%, rgba(182,127,66,0.98) 100%)'
                    : 'linear-gradient(180deg, rgba(81,56,39,0.96) 0%, rgba(61,39,26,0.98) 100%)',
                color: pressed ? '#2c170b' : '#f6ddb4',
                fontSize: 10,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                boxShadow: '0 10px 20px rgba(18,11,7,0.28), inset 0 1px 0 rgba(255,240,214,0.08)',
                touchAction: 'none',
                WebkitTapHighlightColor: 'transparent',
            }}
        >
            <Footprints size={10} />
            {label}
        </button>
    );
}

function TapButton({ label, onPress }) {
    return (
        <button
            data-mobile-control="true"
            type="button"
            onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onPress();
            }}
            style={{
                width: 82,
                height: 82,
                padding: '0',
                borderRadius: '50%',
                border: '1px solid rgba(123,88,58,0.82)',
                background: 'linear-gradient(180deg, rgba(81,56,39,0.96) 0%, rgba(61,39,26,0.98) 100%)',
                color: '#f6ddb4',
                fontSize: 10,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                boxShadow: '0 10px 20px rgba(18,11,7,0.28), inset 0 1px 0 rgba(255,240,214,0.08)',
                touchAction: 'none',
                WebkitTapHighlightColor: 'transparent',
            }}
        >
            <Sprout size={10} />
            {label}
        </button>
    );
}

function SmallActionButton({ icon: Icon, ariaLabel, onPress }) {
    return (
        <button
            data-mobile-control="true"
            type="button"
            aria-label={ariaLabel}
            onPointerDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onPress();
            }}
            style={{
                width: 48,
                height: 48,
                padding: '0',
                borderRadius: '50%',
                border: '1px solid rgba(123,88,58,0.82)',
                background: 'radial-gradient(circle at 35% 30%, rgba(143,97,60,0.92) 0%, rgba(88,58,38,0.98) 62%, rgba(61,39,26,1) 100%)',
                color: '#f6ddb4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 18px rgba(18,11,7,0.26), inset 0 1px 0 rgba(255,240,214,0.08)',
                touchAction: 'none',
                WebkitTapHighlightColor: 'transparent',
            }}
        >
            <Icon size={16} strokeWidth={2.2} />
        </button>
    );
}

export default SkillsGame;
