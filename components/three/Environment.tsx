'use client';

import { useFrame } from '@react-three/fiber';
import { MotionValue } from 'framer-motion';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Props {
  progress: MotionValue<number>;
}

// ── Gradient Sky Dome ─────────────────────────────────────────────────────────
function GradientSky() {
  const vertexShader = /* glsl */`
    varying vec3 vWorldPos;
    void main() {
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = /* glsl */`
    varying vec3 vWorldPos;
    void main() {
      float t = clamp(vWorldPos.y / 250.0, 0.0, 1.0);

      vec3 horizon    = vec3(0.88, 0.50, 0.19);  // warm amber
      vec3 warmPurple = vec3(0.55, 0.25, 0.28);  // pink-purple band
      vec3 deepPurple = vec3(0.24, 0.13, 0.31);  // twilight purple
      vec3 navyBlue   = vec3(0.11, 0.16, 0.35);  // mid navy
      vec3 upperNavy  = vec3(0.06, 0.11, 0.26);  // upper navy
      vec3 zenith     = vec3(0.03, 0.06, 0.16);  // deep night

      vec3 color;
      if (t < 0.08) {
        color = mix(horizon, warmPurple, smoothstep(0.0, 1.0, t / 0.08));
      } else if (t < 0.25) {
        color = mix(warmPurple, deepPurple, smoothstep(0.0, 1.0, (t - 0.08) / 0.17));
      } else if (t < 0.45) {
        color = mix(deepPurple, navyBlue, smoothstep(0.0, 1.0, (t - 0.25) / 0.20));
      } else if (t < 0.65) {
        color = mix(navyBlue, upperNavy, smoothstep(0.0, 1.0, (t - 0.45) / 0.20));
      } else {
        color = mix(upperNavy, zenith, smoothstep(0.0, 1.0, (t - 0.65) / 0.35));
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[500, 32, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Moon ──────────────────────────────────────────────────────────────────────
function Moon() {
  return (
    <group position={[20, 26, -18]}>
      {/* Core — large, bright, strongly emissive */}
      <mesh>
        <sphereGeometry args={[5.5, 32, 32]} />
        <meshStandardMaterial
          color="#fffef0"
          emissive="#ffffff"
          emissiveIntensity={3.5}
          roughness={0.2}
        />
      </mesh>
      {/* Inner halo — tight glow */}
      <mesh>
        <sphereGeometry args={[8.0, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.10} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* Mid halo */}
      <mesh>
        <sphereGeometry args={[13.0, 16, 16]} />
        <meshBasicMaterial color="#e8f0ff" transparent opacity={0.05} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* Wide diffuse halo */}
      <mesh>
        <sphereGeometry args={[22.0, 16, 16]} />
        <meshBasicMaterial color="#d0e0ff" transparent opacity={0.02} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {/* Moonlight point */}
      <pointLight color="#ddeeff" intensity={8.0} distance={280} decay={1.0} />
    </group>
  );
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars() {
  const positions = useMemo(() => {
    const count = 1400;
    const pos = new Float32Array(count * 3);
    let s = 31337;
    const rng = () => {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      return s / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      const theta = rng() * Math.PI * 2;
      // Bias toward upper sky — avoid the bright amber horizon band
      const phi = Math.acos(1 - rng() * 0.72);
      const r   = 130 + rng() * 40;
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) + 25; // keep well above horizon
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
        size={0.45}
        color="#ffffff"
        transparent
        opacity={0.95}
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
      <meshStandardMaterial color="#4db358" roughness={0.88} />
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
          <boxGeometry args={[t.w, 0.12, t.d]} />
          <meshStandardMaterial color="#a8a8b8" roughness={0.88} metalness={0.04} />
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
      {/* Main canopy — LOW poly, vibrant pink */}
      <mesh position={[0, 6.2, 0]} castShadow>
        <sphereGeometry args={[2.8, 6, 5]} />
        <meshStandardMaterial color="#f5a0c0" emissive="#e8609a" emissiveIntensity={0.65} roughness={0.8} />
      </mesh>
      {/* Left cluster */}
      <mesh position={[-1.8, 5.6, 0.2]} castShadow>
        <sphereGeometry args={[1.9, 6, 5]} />
        <meshStandardMaterial color="#f0a0bc" emissive="#e05590" emissiveIntensity={0.60} roughness={0.8} />
      </mesh>
      {/* Right cluster */}
      <mesh position={[1.8, 5.4, -0.2]} castShadow>
        <sphereGeometry args={[2.0, 6, 5]} />
        <meshStandardMaterial color="#f8aac8" emissive="#e86098" emissiveIntensity={0.60} roughness={0.8} />
      </mesh>
      {/* Front lower cluster */}
      <mesh position={[0.5, 4.8, 1.5]} castShadow>
        <sphereGeometry args={[1.5, 5, 4]} />
        <meshStandardMaterial color="#ee98b8" emissive="#d84e88" emissiveIntensity={0.58} roughness={0.8} />
      </mesh>
      {/* Top small cluster */}
      <mesh position={[0, 8.0, 0]} castShadow>
        <sphereGeometry args={[1.2, 5, 4]} />
        <meshStandardMaterial color="#fcc0d8" emissive="#f070a8" emissiveIntensity={0.65} roughness={0.8} />
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
          {/* Glowing windows — all 4 sides */}
          <mesh position={[0, 1.45,  0.54]}><boxGeometry args={[0.52, 0.52, 0.01]} /><meshBasicMaterial color="#ffcc60" toneMapped={false} /></mesh>
          <mesh position={[0, 1.45, -0.54]}><boxGeometry args={[0.52, 0.52, 0.01]} /><meshBasicMaterial color="#ffcc60" toneMapped={false} /></mesh>
          <mesh position={[ 0.54, 1.45, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[0.52, 0.52, 0.01]} /><meshBasicMaterial color="#ffcc60" toneMapped={false} /></mesh>
          <mesh position={[-0.54, 1.45, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[0.52, 0.52, 0.01]} /><meshBasicMaterial color="#ffcc60" toneMapped={false} /></mesh>
          {/* Wide overhanging cap */}
          <mesh position={[0, 2.0, 0]} castShadow>
            <boxGeometry args={[1.4, 0.18, 1.4]} />
            <meshStandardMaterial color="#585864" roughness={0.95} />
          </mesh>
          {/* Warm amber point light — strong enough to pool on ground */}
          <pointLight position={[0, 1.45, 0]} color="#ff9020" intensity={4.0} distance={18} decay={2} />
        </group>
      ))}
    </group>
  );
}

// ── City data — seeded, computed once at module load ──────────────────────────
type Building   = { x: number; z: number; w: number; h: number; d: number };
type WinTile    = { x: number; y: number; z: number; ww: number };
type RoofDetail = { x: number; y: number; z: number; w: number; h: number; d: number };

function buildCityData(): { buildings: Building[]; windows: WinTile[]; roofDetails: RoofDetail[] } {
  let s = 137;
  const rng = () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };

  const buildings:   Building[]   = [];
  const windows:     WinTile[]    = [];
  const roofDetails: RoofDetail[] = [];

  const addBuilding = (x: number, z: number, w: number, h: number, d: number) => {
    buildings.push({ x, z, w, h, d });

    // Individual scattered windows per floor (not full-width strips)
    const numFloors = Math.max(1, Math.floor(h / 2.2));
    for (let fl = 0; fl < numFloors; fl++) {
      const y = 0.9 + fl * 2.2;
      if (y > h - 0.8) continue;
      const numWins = 2 + Math.floor(rng() * 3);
      for (let wn = 0; wn < numWins; wn++) {
        const ww   = 0.35 + rng() * 0.35;
        const xOff = (rng() - 0.5) * Math.max(0, w - ww - 0.3);
        windows.push({ x: x + xOff, y, z: z + d / 2 + 0.06, ww });
      }
    }

    // Flat roof cap — slightly wider, defines the top edge
    roofDetails.push({ x, y: h - 0.5 + 0.18, z, w: w + 0.5, h: 0.35, d: d + 0.5 });

    // Stepped top section on taller buildings
    if (h > 9 && rng() > 0.45) {
      const sw = w * (0.45 + rng() * 0.25);
      const sd = d * (0.45 + rng() * 0.25);
      const sh = 1.5 + rng() * 3.0;
      roofDetails.push({ x, y: h - 0.5 + sh / 2, z, w: sw, h: sh, d: sd });
    }
  };

  // Left cluster
  for (let i = 0; i < 36; i++) addBuilding(
    -62 + rng() * 38, -56 - rng() * 18,
    2.5 + rng() * 4, 2 + rng() * 6, 2.5 + rng() * 3.5,
  );
  // Center — tallest
  for (let i = 0; i < 48; i++) addBuilding(
    -24 + rng() * 48, -53 - rng() * 20,
    2.5 + rng() * 5, 5 + rng() * 12, 2.5 + rng() * 4,
  );
  // Right cluster
  for (let i = 0; i < 36; i++) addBuilding(
    24 + rng() * 38, -56 - rng() * 18,
    2.5 + rng() * 4, 2 + rng() * 6, 2.5 + rng() * 3.5,
  );

  return { buildings, windows, roofDetails };
}

const CITY_DATA = buildCityData();

// ── City skyline ──────────────────────────────────────────────────────────────
function CityBackground() {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const winRef  = useRef<THREE.InstancedMesh>(null);
  const capRef  = useRef<THREE.InstancedMesh>(null);
  const { buildings, windows, roofDetails } = CITY_DATA;

  useEffect(() => {
    if (!bodyRef.current || !winRef.current || !capRef.current) return;
    const dummy = new THREE.Object3D();

    buildings.forEach((b, i) => {
      dummy.position.set(b.x, b.h / 2 - 0.5, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      bodyRef.current!.setMatrixAt(i, dummy.matrix);
    });
    bodyRef.current.instanceMatrix.needsUpdate = true;

    windows.forEach((w, i) => {
      dummy.position.set(w.x, w.y, w.z);
      dummy.scale.set(w.ww, 0.28, 0.05);
      dummy.updateMatrix();
      winRef.current!.setMatrixAt(i, dummy.matrix);
    });
    winRef.current.instanceMatrix.needsUpdate = true;

    roofDetails.forEach((r, i) => {
      dummy.position.set(r.x, r.y, r.z);
      dummy.scale.set(r.w, r.h, r.d);
      dummy.updateMatrix();
      capRef.current!.setMatrixAt(i, dummy.matrix);
    });
    capRef.current.instanceMatrix.needsUpdate = true;
  }, [buildings, windows, roofDetails]);

  return (
    <group>
      {/* Building bodies — cool slate, fog-affected */}
      <instancedMesh ref={bodyRef} args={[undefined, undefined, buildings.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4a5068" roughness={0.95} />
      </instancedMesh>

      {/* Individual windows — small scattered tiles, no fog */}
      <instancedMesh ref={winRef} args={[undefined, undefined, windows.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#ffd060" toneMapped={false} fog={false} />
      </instancedMesh>

      {/* Roof caps + stepped tops — slightly lighter slate */}
      <instancedMesh ref={capRef} args={[undefined, undefined, roofDetails.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#686880" roughness={0.92} />
      </instancedMesh>

      {/* City glow lights */}
      <pointLight position={[  0, 4, -65]} color="#f0a840" intensity={18} distance={160} decay={1} />
      <pointLight position={[-40, 4, -68]} color="#f0a840" intensity={9}  distance={110} decay={1} />
      <pointLight position={[ 40, 4, -68]} color="#f0a840" intensity={9}  distance={110} decay={1} />
    </group>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Environment({ progress }: Props) {
  const gateGlowRef = useRef<THREE.PointLight>(null);
  const fogRef = useRef(new THREE.FogExp2('#b87030', 0.009));

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

    // Amber haze — thickens as camera pushes into the city
    scene.fog = fogRef.current;
    if (p < 0.45) {
      fogRef.current.density = 0.009;
    } else if (p < 0.70) {
      fogRef.current.density = 0.009 + ((p - 0.45) / 0.25) * 0.006;
    } else {
      fogRef.current.density = 0.015;
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
      {/* Gradient sky dome — deep indigo zenith → twilight purple → warm amber horizon */}
      <GradientSky />

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

      {/* Directional moonlight — cool blue-white from moon's position */}
      <directionalLight position={[20, 26, -18]} color="#c8d8ff" intensity={0.8} castShadow />

      {/* Ground fill — lifts dark foreground grass */}
      <pointLight position={[0, 5, 8]}  color="#f0e0c0" intensity={5.0} distance={60} decay={1.2} />
      <pointLight position={[0, 5, -20]} color="#f0e0c0" intensity={3.5} distance={60} decay={1.2} />
    </>
  );
}
