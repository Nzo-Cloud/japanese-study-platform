'use client';

import { Sky } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MotionValue } from 'framer-motion';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Props {
  progress: MotionValue<number>;
}

// ── Moon ──────────────────────────────────────────────────────────────────────
function Moon() {
  return (
    <group position={[20, 26, -18]}>
      {/* Core — pure white, strong emissive */}
      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2.5}
          roughness={0.3}
        />
      </mesh>
      {/* Inner halo */}
      <mesh>
        <sphereGeometry args={[5.0, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* Outer bloom halo */}
      <mesh>
        <sphereGeometry args={[7.5, 16, 16]} />
        <meshBasicMaterial color="#e8f0ff" transparent opacity={0.03} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* Moonlight */}
      <pointLight color="#e8f0ff" intensity={5.5} distance={200} decay={1.0} />
    </group>
  );
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars() {
  const positions = useMemo(() => {
    const pos = new Float32Array(900 * 3);
    // Seeded deterministic placement
    let s = 31337;
    const rng = () => {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      return s / 4294967296;
    };
    for (let i = 0; i < 900; i++) {
      const theta = rng() * Math.PI * 2;
      const phi   = Math.acos(2 * rng() - 1);
      const r     = 120 + rng() * 30;
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 8; // upper hemisphere only
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        color="#ffffff"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Ground ─────────────────────────────────────────────────────────────────────
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, -25]} receiveShadow>
      <planeGeometry args={[300, 160]} />
      <meshStandardMaterial color="#3a9048" roughness={0.92} />
    </mesh>
  );
}

// ── Ghibli stone path (irregular tiles, not straight) ─────────────────────────
function GhibliPath() {
  const tiles = useMemo(() => {
    // Seeded RNG for deterministic variation
    let s = 77;
    const rng = () => {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      return s / 4294967296;
    };

    const result: { z: number; w: number; d: number; xOff: number; rot: number; yOff: number }[] = [];
    let z = 16;
    while (z > -56) {
      const w    = 2.8 + rng() * 1.8;      // 2.8–4.6 wide  (landscape orientation)
      const d    = 0.7 + rng() * 0.7;      // 0.7–1.4 deep  (thin slabs)
      const xOff = (rng() - 0.5) * 0.5;   // subtle wander, mostly centered
      const rot  = (rng() - 0.5) * 0.14;  // subtle rotation
      const yOff = rng() * 0.03;           // very slight height variation
      result.push({ z, w, d, xOff, rot, yOff });
      z -= d + 0.25 + rng() * 0.4;         // clear gaps between tiles
    }
    return result;
  }, []);

  return (
    <group>
      {tiles.map((t, i) => (
        <mesh
          key={i}
          position={[t.xOff, -0.46 + t.yOff, t.z]}
          rotation={[0, t.rot, 0]}
          receiveShadow
        >
          <boxGeometry args={[t.w, 0.09, t.d]} />
          <meshStandardMaterial color="#6a6878" roughness={0.94} metalness={0.04} />
        </mesh>
      ))}
    </group>
  );
}

// ── Cherry blossom tree (bright morning) ──────────────────────────────────────
function BlossomTree({ x, z, scale = 1 }: {
  x: number; z: number; scale?: number;
}) {
  return (
    <group position={[x, -0.5, z]} scale={[scale, scale, scale]}>
      {/* Trunk — thick, dark brown */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 5.0, 6]} />
        <meshStandardMaterial color="#5a3420" roughness={0.97} />
      </mesh>
      {/* Main canopy — LOW poly, pale pink */}
      <mesh position={[0, 6.2, 0]} castShadow>
        <sphereGeometry args={[2.8, 6, 5]} />
        <meshStandardMaterial color="#ffc0d0" emissive="#ffaac4" emissiveIntensity={0.38} roughness={0.8} />
      </mesh>
      {/* Left cluster */}
      <mesh position={[-1.8, 5.6, 0.2]} castShadow>
        <sphereGeometry args={[1.9, 6, 5]} />
        <meshStandardMaterial color="#ffb8cc" emissive="#ffa8bc" emissiveIntensity={0.35} roughness={0.8} />
      </mesh>
      {/* Right cluster */}
      <mesh position={[1.8, 5.4, -0.2]} castShadow>
        <sphereGeometry args={[2.0, 6, 5]} />
        <meshStandardMaterial color="#ffc8d8" emissive="#ffb0cc" emissiveIntensity={0.35} roughness={0.8} />
      </mesh>
      {/* Front lower cluster */}
      <mesh position={[0.5, 4.8, 1.5]} castShadow>
        <sphereGeometry args={[1.5, 5, 4]} />
        <meshStandardMaterial color="#ffb0c8" emissive="#ffa0b8" emissiveIntensity={0.32} roughness={0.8} />
      </mesh>
      {/* Top small cluster */}
      <mesh position={[0, 8.0, 0]} castShadow>
        <sphereGeometry args={[1.2, 5, 4]} />
        <meshStandardMaterial color="#ffd0e0" emissive="#ffbcd4" emissiveIntensity={0.38} roughness={0.8} />
      </mesh>
    </group>
  );
}

// ── Stone lanterns — chunky, 3-part stacked boxes, glowing amber window ────────
function StoneWayLanterns() {
  const positions: [number, number][] = [
    [-4.0,  -3], [ 4.0,  -3],
    [-4.0, -13], [ 4.0, -13],
    [-4.0, -23], [ 4.0, -23],
  ];

  return (
    <group>
      {positions.map(([x, z], i) => (
        <group key={i} position={[x, -0.5, z]}>
          {/* Wide flat base */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[1.5, 0.4, 1.5]} />
            <meshStandardMaterial color="#62626e" roughness={0.96} />
          </mesh>
          {/* Narrow pedestal */}
          <mesh position={[0, 0.75, 0]} castShadow>
            <boxGeometry args={[0.8, 0.7, 0.8]} />
            <meshStandardMaterial color="#585864" roughness={0.96} />
          </mesh>
          {/* Lantern body */}
          <mesh position={[0, 1.45, 0]} castShadow>
            <boxGeometry args={[1.05, 1.0, 1.05]} />
            <meshStandardMaterial color="#505060" roughness={0.92} />
          </mesh>
          {/* Glowing window — front face */}
          <mesh position={[0, 1.45, 0.54]}>
            <boxGeometry args={[0.52, 0.52, 0.01]} />
            <meshBasicMaterial color="#ffe090" toneMapped={false} />
          </mesh>
          {/* Wide overhanging cap */}
          <mesh position={[0, 2.0, 0]} castShadow>
            <boxGeometry args={[1.4, 0.18, 1.4]} />
            <meshStandardMaterial color="#585864" roughness={0.95} />
          </mesh>
          {/* Warm point light from inside */}
          <pointLight position={[0, 1.45, 0]} color="#f0a030" intensity={1.8} distance={10} decay={2} />
        </group>
      ))}
    </group>
  );
}

// ── City data — seeded, computed once at module load ──────────────────────────
type Building = { x: number; z: number; w: number; h: number; d: number };
type Strip    = { x: number; y: number; z: number; w: number };

function buildCityData(): { buildings: Building[]; strips: Strip[] } {
  let s = 137;
  const rng = () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };

  const buildings: Building[] = [];
  const strips: Strip[]       = [];

  const addBuilding = (x: number, z: number, w: number, h: number, d: number) => {
    buildings.push({ x, z, w, h, d });
    // Window strips on front face — one per ~2.5 units of height
    const numStrips = Math.max(1, Math.floor(h / 2.5));
    const yStart = 0.4;
    const yEnd   = h - 0.9;
    for (let i = 0; i < numStrips; i++) {
      const y = numStrips > 1
        ? yStart + (i / (numStrips - 1)) * (yEnd - yStart)
        : (yStart + yEnd) / 2;
      strips.push({ x, y, z: z + d / 2 + 0.06, w: w - 0.15 });
    }
  };

  // Left cluster — 36 buildings, tighter spread
  for (let i = 0; i < 36; i++) addBuilding(
    -62 + rng() * 38,   // x: -62 to -24
    -56 - rng() * 18,   // z: -56 to -74
    2.5 + rng() * 4,    // w: 2.5–6.5
    2   + rng() * 6,    // h: 2–8
    2.5 + rng() * 3.5,  // d: 2.5–6
  );

  // Center — 48 buildings, tallest, framed by gate
  for (let i = 0; i < 48; i++) addBuilding(
    -24 + rng() * 48,   // x: -24 to 24
    -53 - rng() * 20,   // z: -53 to -73
    2.5 + rng() * 5,    // w: 2.5–7.5
    5   + rng() * 12,   // h: 5–17
    2.5 + rng() * 4,    // d: 2.5–6.5
  );

  // Right cluster — 36 buildings, tighter spread
  for (let i = 0; i < 36; i++) addBuilding(
    24  + rng() * 38,   // x: 24 to 62
    -56 - rng() * 18,   // z: -56 to -74
    2.5 + rng() * 4,    // w: 2.5–6.5
    2   + rng() * 6,    // h: 2–8
    2.5 + rng() * 3.5,  // d: 2.5–6
  );

  return { buildings, strips };
}

const CITY_DATA = buildCityData();

// ── City skyline — InstancedMesh bodies + strips, individual rooftop details ──
function CityBackground() {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const winRef  = useRef<THREE.InstancedMesh>(null);
  const { buildings, strips } = CITY_DATA;

  useEffect(() => {
    if (!bodyRef.current || !winRef.current) return;
    const dummy = new THREE.Object3D();

    // Building bodies
    buildings.forEach((b, i) => {
      dummy.position.set(b.x, b.h / 2 - 0.5, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      bodyRef.current!.setMatrixAt(i, dummy.matrix);
    });
    bodyRef.current.instanceMatrix.needsUpdate = true;

    // Window strips
    strips.forEach((s, i) => {
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.set(s.w, 0.12, 0.05);
      dummy.updateMatrix();
      winRef.current!.setMatrixAt(i, dummy.matrix);
    });
    winRef.current.instanceMatrix.needsUpdate = true;
  }, [buildings, strips]);

  return (
    <group>
      {/* Building bodies — 120 instances, 1 draw call */}
      <instancedMesh ref={bodyRef} args={[undefined, undefined, buildings.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3d3d52" roughness={0.95} fog={false} />
      </instancedMesh>

      {/* Window strips — ~600 instances, 1 draw call */}
      <instancedMesh ref={winRef} args={[undefined, undefined, strips.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffe090" toneMapped={false} fog={false} />
      </instancedMesh>

      {/* Rooftop details — individual meshes */}
      {buildings.map((b, i) => (
        <group key={i}>
          {/* Antenna on tall buildings */}
          {b.h > 12 && (
            <mesh position={[b.x, b.h - 0.5 + 1.5, b.z]}>
              <cylinderGeometry args={[0.06, 0.06, 3, 4]} />
              <meshStandardMaterial color="#303045" roughness={0.95} fog={false} />
            </mesh>
          )}
          {/* Water tank on medium buildings */}
          {b.h > 5 && b.h <= 12 && (
            <mesh position={[b.x + b.w * 0.2, b.h - 0.2, b.z]}>
              <cylinderGeometry args={[0.35, 0.35, 0.6, 6]} />
              <meshStandardMaterial color="#484858" roughness={0.95} fog={false} />
            </mesh>
          )}
          {/* Base step — grounds every building */}
          <mesh position={[b.x, 0.1, b.z]}>
            <boxGeometry args={[b.w + 0.6, 0.3, b.d + 0.4]} />
            <meshStandardMaterial color="#303045" roughness={0.98} fog={false} />
          </mesh>
        </group>
      ))}

      {/* City glow lights */}
      <pointLight position={[  0, 4, -65]} color="#f0a840" intensity={10} distance={140} decay={1} />
      <pointLight position={[-40, 4, -68]} color="#f0a840" intensity={5}  distance={90}  decay={1} />
      <pointLight position={[ 40, 4, -68]} color="#f0a840" intensity={5}  distance={90}  decay={1} />
    </group>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Environment({ progress }: Props) {
  const gateGlowRef = useRef<THREE.PointLight>(null);
  const fogRef = useRef(new THREE.FogExp2('#f0dcc8', 0.007));

  useFrame(({ scene }) => {
    const p = progress.get();

    // Gate warm glow peaks as camera closes in (p=0→0.20), fades by p=0.35
    if (gateGlowRef.current) {
      if (p < 0.20) {
        gateGlowRef.current.intensity = (p / 0.20) * 5.5;
      } else if (p < 0.35) {
        gateGlowRef.current.intensity = 5.5 * (1 - (p - 0.20) / 0.15);
      } else {
        gateGlowRef.current.intensity = 0;
      }
    }

    // Warm night haze — thickens slightly toward city in distance
    scene.fog = fogRef.current;
    if (p < 0.45) {
      fogRef.current.density = 0.008;
    } else if (p < 0.70) {
      fogRef.current.density = 0.008 + ((p - 0.45) / 0.25) * 0.004;
    } else {
      fogRef.current.density = 0.012;
    }
  });

  // Tree layout — symmetric pairs flanking the path, upright, close to camera
  const trees = [
    { x: -7,   z: -2,  s: 1.1  },
    { x:  7,   z: -2,  s: 1.1  },
    { x: -8,   z: -10, s: 1.0  },
    { x:  8,   z: -10, s: 1.0  },
    { x: -8.5, z: -19, s: 0.88 },
    { x:  8.5, z: -19, s: 0.88 },
    { x: -9,   z: -28, s: 0.72 },
    { x:  9,   z: -28, s: 0.72 },
  ];

  return (
    <>
      {/* Night sky — peach-orange horizon fading to soft blue, Ghibli dusk */}
      <Sky
        sunPosition={[1, -0.02, -1]}
        rayleigh={2.8}
        turbidity={10}
        mieCoefficient={0.008}
        mieDirectionalG={0.85}
      />

      {/* City horizon glow — warm amber light from below, simulates light pollution */}
      <pointLight position={[0, -8, -60]} color="#f0a840" intensity={6} distance={180} decay={1} />

      {/* Moon + halo + moonlight */}
      <Moon />

      {/* Stars — upper hemisphere, seeded deterministic */}
      <Stars />

      {/* Gate warm glow (dynamic) */}
      <pointLight ref={gateGlowRef} position={[0, 5, 1]} color="#ff9050" intensity={0} distance={20} decay={2} />

      {/* Ground */}
      <Ground />

      {/* Ghibli stone path */}
      <GhibliPath />

      {/* Cherry blossom trees */}
      {trees.map((t, i) => (
        <BlossomTree key={i} x={t.x} z={t.z} scale={t.s} />
      ))}

      {/* Stone lanterns */}
      <StoneWayLanterns />

      {/* City skyline */}
      <CityBackground />

      {/* Ground fill — lifts dark foreground grass */}
      <pointLight position={[0, 5, 8]}  color="#f0e0c0" intensity={3.0} distance={50} decay={1.2} />
      <pointLight position={[0, 5, -20]} color="#f0e0c0" intensity={2.0} distance={50} decay={1.2} />
    </>
  );
}
