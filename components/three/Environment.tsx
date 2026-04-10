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


// ── Ground ─────────────────────────────────────────────────────────────────────
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, -25]} receiveShadow>
      <planeGeometry args={[300, 160]} />
      <meshStandardMaterial color="#4db358" roughness={0.88} />
    </mesh>
  );
}

// ── Grass tufts flanking the stone path ────────────────────────────────────────
function GrassTufts() {
  const COUNT = 350;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useRef(new THREE.Object3D()).current;

  // Seeded deterministic placement
  const tufts = useMemo(() => {
    let s = 42;
    const rng = () => {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      return s / 4294967296;
    };

    return Array.from({ length: COUNT }, () => {
      // Pick left or right band
      const side = rng() < 0.5 ? -1 : 1;
      const x = side * (5 + rng() * 13);   // ±5 to ±18
      const z = -4 - rng() * 28;            // -4 to -32
      const rotY = rng() * Math.PI * 2;
      const tiltX = (rng() - 0.5) * 0.30;  // -0.15 to +0.15
      const sc = 0.5 + rng() * 0.5;        // 0.5 to 1.0
      return { x, z, rotY, tiltX, sc };
    });
  }, []);

  // Initial matrix setup
  useEffect(() => {
    if (!meshRef.current) return;
    tufts.forEach((t, i) => {
      dummy.position.set(t.x, -0.45, t.z);
      dummy.rotation.set(t.tiltX, t.rotY, 0);
      dummy.scale.setScalar(t.sc);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [tufts, dummy]);

  // Gentle collective sway
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const sway = Math.sin(clock.elapsedTime * 0.8) * 0.04;
    tufts.forEach((t, i) => {
      dummy.position.set(t.x, -0.45, t.z);
      dummy.rotation.set(t.tiltX + sway, t.rotY, 0);
      dummy.scale.setScalar(t.sc);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <planeGeometry args={[0.25, 0.55]} />
      <meshStandardMaterial
        color="#5ac060"
        emissive="#1a3a1a"
        emissiveIntensity={0.12}
        transparent
        alphaTest={0.4}
        side={THREE.DoubleSide}
        depthWrite={true}
      />
    </instancedMesh>
  );
}

// ── Fireflies — warm ambient particles above the ground ───────────────────────
function Fireflies() {
  const COUNT = 120;
  const pointsRef = useRef<THREE.Points>(null);

  // Seeded initial positions + per-particle animation params
  const { initPositions, phases, speeds, flickerSpeeds } = useMemo(() => {
    let s = 999;
    const rng = () => {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      return s / 4294967296;
    };

    const init = new Float32Array(COUNT * 3);
    const ph = new Float32Array(COUNT);
    const sp = new Float32Array(COUNT);
    const fl = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      init[i * 3 + 0] = (rng() - 0.5) * 32;          // x: -16 to +16
      init[i * 3 + 1] = 0.2 + rng() * 2.6;           // y: 0.2 to 2.8
      init[i * 3 + 2] = 2 - rng() * 50;              // z: 2 to -48
      ph[i] = rng() * Math.PI * 2;                    // phase: 0 to 2π
      sp[i] = 0.4 + rng() * 0.5;                     // speed: 0.4 to 0.9
      fl[i] = 1.5 + rng() * 2.5;                     // flickerSpeed: 1.5 to 4.0
    }
    return { initPositions: init, phases: ph, speeds: sp, flickerSpeeds: fl };
  }, []);

  // Live positions buffer
  const positions = useRef(new Float32Array(COUNT * 3)).current;

  // Copy initial positions into the live buffer
  useEffect(() => {
    positions.set(initPositions);
  }, [initPositions, positions]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.elapsedTime;

    for (let i = 0; i < COUNT; i++) {
      const phase = phases[i];
      const speed = speeds[i];
      positions[i * 3 + 0] = initPositions[i * 3 + 0] + Math.sin(t * 0.15 + phase) * 0.4;
      positions[i * 3 + 1] = initPositions[i * 3 + 1] + Math.sin(t * speed + phase) * 0.3;
      // z stays at initial
      positions[i * 3 + 2] = initPositions[i * 3 + 2];
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Global opacity flicker — average of all individual flickers
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    const flicker = Math.sin(t * 2.2) * 0.5 + 0.5; // 0→1
    mat.opacity = 0.4 + flicker * 0.55;             // 0.4→0.95
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffe090"
        size={0.18}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ── Ground mist wisps ─────────────────────────────────────────────────────────
function MistWisps() {
  const wisps = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      x:      (Math.random() - 0.5) * 18,
      z:      -4 - Math.random() * 22,
      speed:  0.012 + Math.random() * 0.010,
      offset: Math.random() * Math.PI * 2,
      scale:  4 + Math.random() * 5,
    }))
  ).current;

  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    wisps.forEach((w, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.position.x = w.x + Math.sin(t * w.speed + w.offset) * 2.5;
      mesh.material && ((mesh.material as THREE.MeshBasicMaterial).opacity =
        0.06 + Math.sin(t * w.speed * 0.5 + w.offset) * 0.03);
    });
  });

  return (
    <group>
      {wisps.map((w, i) => (
        <mesh
          key={i}
          ref={el => { refs.current[i] = el; }}
          position={[w.x, -0.35, w.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[w.scale, w.scale * 0.4]} />
          <meshBasicMaterial
            color="#e8d8c0"
            transparent
            opacity={0.07}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Twinkling stars ───────────────────────────────────────────────────────────
function Stars() {
  const COUNT = 1400;
  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    let s = 31337;
    const rng = () => {
      s = (Math.imul(1664525, s) + 1013904223) >>> 0;
      return s / 4294967296;
    };
    for (let i = 0; i < COUNT; i++) {
      const theta = rng() * Math.PI * 2;
      const phi   = Math.acos(1 - rng() * 0.72);
      const r     = 130 + rng() * 40;
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) + 25;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return pos;
  }, []);

  const matRef = useRef<THREE.PointsMaterial>(null);
  // We'll modulate the whole material opacity slightly — cheap global shimmer
  useFrame(({ clock }) => {
    if (!matRef.current) return;
    const t = clock.elapsedTime;
    matRef.current.opacity = 0.78 + Math.sin(t * 0.7) * 0.12 + Math.sin(t * 1.9) * 0.06;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
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

// ── Falling sakura petals ─────────────────────────────────────────────────────
function SakuraPetals() {
  const COUNT = 280;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy   = useRef(new THREE.Object3D()).current;

  const petals = useRef(
    Array.from({ length: COUNT }, () => ({
      x:         (Math.random() - 0.5) * 28,
      y:         Math.random() * 14 + 2,
      z:         -2 - Math.random() * 32,
      vy:        -(0.018 + Math.random() * 0.025),
      vx:        (Math.random() - 0.5) * 0.008,
      rotZ:      Math.random() * Math.PI * 2,
      rotSpeed:  (Math.random() - 0.5) * 0.045,
      swayOffset: Math.random() * Math.PI * 2,
      swayAmp:   0.004 + Math.random() * 0.009,
      swaySpeed: 0.35 + Math.random() * 0.65,
      scale:     0.10 + Math.random() * 0.09,
    }))
  ).current;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    petals.forEach((p, i) => {
      p.y   += p.vy;
      p.x   += p.vx + Math.sin(t * p.swaySpeed + p.swayOffset) * p.swayAmp;
      p.rotZ += p.rotSpeed;
      if (p.y < -1) {
        p.y = 12 + Math.random() * 10;
        p.x = (Math.random() - 0.5) * 28;
        p.z = -2 - Math.random() * 32;
      }
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(Math.PI * 0.3, 0, p.rotZ);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <planeGeometry args={[1, 0.65]} />
      <meshStandardMaterial
        color="#f5a0c0"
        emissive="#e06090"
        emissiveIntensity={0.35}
        transparent
        opacity={0.82}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

// ── Bird silhouettes crossing the moon ────────────────────────────────────────
function Birds() {
  const bird1Ref = useRef<THREE.Mesh>(null);
  const bird2Ref = useRef<THREE.Mesh>(null);

  const birdShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.4, -0.1);
    s.lineTo(-0.7,  0.3);
    s.lineTo(-0.2,  0.05);
    s.lineTo( 0,    0.15);
    s.lineTo( 0.2,  0.05);
    s.lineTo( 0.7,  0.3);
    s.lineTo( 1.4, -0.1);
    s.lineTo( 0.7, -0.15);
    s.lineTo( 0,   -0.05);
    s.lineTo(-0.7, -0.15);
    s.closePath();
    return s;
  }, []);

  // Moon sits at [20, 26, -18]. Birds cross left→right just in front (z = -16).
  const PERIOD = 15, SPAN = 40;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (bird1Ref.current) {
      const phase = (t % PERIOD) / PERIOD;
      bird1Ref.current.position.x = 20 - SPAN / 2 + phase * SPAN;
    }
    if (bird2Ref.current) {
      const phase = ((t + 7) % PERIOD) / PERIOD;
      bird2Ref.current.position.x = 20 - SPAN / 2 + phase * SPAN;
    }
  });

  return (
    <group>
      <mesh ref={bird1Ref} position={[20, 27.2, -16]} scale={1.5}>
        <shapeGeometry args={[birdShape]} />
        <meshBasicMaterial color="#0a0510" transparent opacity={0.88} depthWrite={false} />
      </mesh>
      <mesh ref={bird2Ref} position={[20, 24.5, -16]} scale={1.1}>
        <shapeGeometry args={[birdShape]} />
        <meshBasicMaterial color="#0a0510" transparent opacity={0.82} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Flickering lantern light ───────────────────────────────────────────────────
function FlickerLight({ position }: { position: [number, number, number] }) {
  const ref    = useRef<THREE.PointLight>(null);
  const offset = useMemo(() => Math.random() * 100, []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime + offset;
    const flicker =
      Math.sin(t * 7.3)  * 0.18 +
      Math.sin(t * 13.7) * 0.10 +
      Math.sin(t * 2.1)  * 0.06;
    ref.current.intensity = 4.0 + flicker * 1.4;
  });
  return <pointLight ref={ref} position={position} color="#ff9020" intensity={4.0} distance={18} decay={2} />;
}

// ── Cherry blossom tree with canopy sway ──────────────────────────────────────
function BlossomTree({ x, z, scale = 1 }: {
  x: number; z: number; scale?: number;
}) {
  const groupRef   = useRef<THREE.Group>(null);
  const swayOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const swaySpeed  = useMemo(() => 0.30 + Math.random() * 0.20, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.rotation.z = Math.sin(t * swaySpeed + swayOffset) * 0.028;
    groupRef.current.rotation.x = Math.sin(t * swaySpeed * 0.7 + swayOffset + 1) * 0.014;
  });

  return (
    <group ref={groupRef} position={[x, -0.5, z]} scale={[scale, scale, scale]}>
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
          {/* Flickering amber flame light */}
          <FlickerLight position={[0, 1.45, 0]} />
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

  // Flicker state — ~15% of windows randomly blink on/off
  const flickerDummy  = useRef(new THREE.Object3D()).current;
  const flickerWins   = useRef<{ idx: number; nextFlip: number; on: boolean }[]>([]);

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

    // Pick flickerable windows after initial setup
    flickerWins.current = windows
      .map((_, i) => i)
      .filter(() => Math.random() < 0.15)
      .map(idx => ({ idx, nextFlip: Math.random() * 8, on: true }));
  }, [buildings, windows, roofDetails]);

  useFrame(({ clock }) => {
    if (!winRef.current || flickerWins.current.length === 0) return;
    const t = clock.elapsedTime;
    let dirty = false;
    flickerWins.current.forEach(f => {
      if (t < f.nextFlip) return;
      f.on = !f.on;
      f.nextFlip = t + 2 + Math.random() * 10;
      const w = windows[f.idx];
      flickerDummy.position.set(w.x, w.y, w.z);
      flickerDummy.scale.set(w.ww, f.on ? 0.28 : 0, 0.05);
      flickerDummy.updateMatrix();
      winRef.current!.setMatrixAt(f.idx, flickerDummy.matrix);
      dirty = true;
    });
    if (dirty) winRef.current.instanceMatrix.needsUpdate = true;
  });

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

// ── Mount Fuji — low-poly faceted silhouette behind the city ────────────────
function MountFuji() {
  return (
    <group>
      {/* Main cone (mountain body) */}
      <mesh position={[0, 8, -130]}>
        <coneGeometry args={[58, 80, 6]} />
        <meshStandardMaterial color="#2a2d3a" emissive="#151820" emissiveIntensity={0.15} roughness={1.0} />
      </mesh>

      {/* Snow cap */}
      <mesh position={[0, 40, -130]}>
        <coneGeometry args={[22, 22, 6]} />
        <meshStandardMaterial color="#dde8f5" emissive="#aac4e8" emissiveIntensity={0.6} roughness={0.9} />
      </mesh>

      {/* Snow skirt — wider band just below the cap */}
      <mesh position={[0, 30, -130]}>
        <coneGeometry args={[30, 8, 6]} />
        <meshStandardMaterial color="#dde8f5" emissive="#aac4e8" emissiveIntensity={0.6} roughness={0.9} />
      </mesh>

      {/* Left foothill */}
      <mesh position={[-52, -4, -122]}>
        <coneGeometry args={[32, 36, 5]} />
        <meshStandardMaterial color="#1e2428" emissive="#0e1214" emissiveIntensity={0.1} roughness={1.0} />
      </mesh>

      {/* Right foothill */}
      <mesh position={[50, -4, -122]}>
        <coneGeometry args={[28, 32, 5]} />
        <meshStandardMaterial color="#1e2428" emissive="#0e1214" emissiveIntensity={0.1} roughness={1.0} />
      </mesh>

      {/* Atmosphere glow behind the summit */}
      <mesh position={[0, 18, -138]}>
        <sphereGeometry args={[45, 8, 6]} />
        <meshBasicMaterial color="#7b5ea7" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Wispy clouds drifting across the sky ───────────────────────────────────────
function WispyClouds() {
  const cloudData = useMemo(() => [
    { pos: [-22, 28, -18] as [number, number, number], scale: [10,  1.6, 3.0] as [number, number, number], opacity: 0.08, speed: 0.004 },
    { pos: [-14, 32, -25] as [number, number, number], scale: [ 8,  1.4, 2.5] as [number, number, number], opacity: 0.10, speed: 0.006 },
    { pos: [ -6, 35, -30] as [number, number, number], scale: [12,  1.8, 3.5] as [number, number, number], opacity: 0.07, speed: 0.005 },
    { pos: [  2, 30, -20] as [number, number, number], scale: [14,  2.0, 4.0] as [number, number, number], opacity: 0.09, speed: 0.003 },
    { pos: [-18, 22, -12] as [number, number, number], scale: [ 6,  1.2, 2.0] as [number, number, number], opacity: 0.13, speed: 0.007 },
    { pos: [-10, 26, -15] as [number, number, number], scale: [ 9,  1.5, 3.0] as [number, number, number], opacity: 0.11, speed: 0.008 },
    { pos: [-26, 24, -22] as [number, number, number], scale: [11,  1.7, 3.2] as [number, number, number], opacity: 0.09, speed: 0.005 },
    // Deep-scene clouds — visible during city / Fuji scroll chapters
    { pos: [-20, 22, -58] as [number, number, number], scale: [12,  1.5, 3.4] as [number, number, number], opacity: 0.08, speed: 0.004 },
    { pos: [ -8, 26, -65] as [number, number, number], scale: [ 9,  1.8, 2.8] as [number, number, number], opacity: 0.10, speed: 0.005 },
    { pos: [  4, 20, -72] as [number, number, number], scale: [13,  1.3, 3.6] as [number, number, number], opacity: 0.06, speed: 0.003 },
    { pos: [ 14, 24, -60] as [number, number, number], scale: [ 7,  1.6, 2.4] as [number, number, number], opacity: 0.11, speed: 0.006 },
    { pos: [-30, 18, -68] as [number, number, number], scale: [10,  1.4, 3.0] as [number, number, number], opacity: 0.07, speed: 0.002 },
    { pos: [  8, 28, -80] as [number, number, number], scale: [11,  2.0, 3.8] as [number, number, number], opacity: 0.09, speed: 0.004 },
  ], []);

  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame(() => {
    cloudData.forEach((cloud, i) => {
      const group = refs.current[i];
      if (!group) return;
      group.position.x += cloud.speed;
      if (group.position.x > 15) {
        group.position.x = -40;
      }
    });
  });

  return (
    <group>
      {cloudData.map((cloud, i) => (
        <group
          key={i}
          ref={el => { refs.current[i] = el; }}
          position={cloud.pos}
          scale={cloud.scale}
        >
          {/* Center sphere */}
          <mesh>
            <sphereGeometry args={[1, 5, 4]} />
            <meshBasicMaterial color="#d8c8f0" transparent opacity={cloud.opacity} depthWrite={false} />
          </mesh>
          {/* Left sphere */}
          <mesh position={[-2.0, 0.2, 0]}>
            <sphereGeometry args={[1, 5, 4]} />
            <meshBasicMaterial color="#d8c8f0" transparent opacity={cloud.opacity} depthWrite={false} />
          </mesh>
          {/* Right sphere */}
          <mesh position={[1.8, -0.3, 0.5]}>
            <sphereGeometry args={[1, 5, 4]} />
            <meshBasicMaterial color="#d8c8f0" transparent opacity={cloud.opacity} depthWrite={false} />
          </mesh>
        </group>
      ))}
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

      {/* Wispy translucent clouds — fills empty left/center sky */}
      <WispyClouds />

      {/* City horizon glow — warm amber light from below, simulates light pollution */}
      <pointLight position={[0, -8, -60]} color="#f0a840" intensity={6} distance={180} decay={1} />

      {/* Moon + halo + moonlight */}
      <Moon />

      {/* Bird silhouettes crossing the moon */}
      <Birds />

      {/* Stars — upper hemisphere, seeded deterministic */}
      <Stars />

      {/* Gate warm glow (dynamic) */}
      <pointLight ref={gateGlowRef} position={[0, 5, 1]} color="#ff9050" intensity={0} distance={20} decay={2} />

      {/* Ground */}
      <Ground />

      {/* Grass tufts — flanking the stone path */}
      <GrassTufts />

      {/* Fireflies — warm ambient particles */}
      <Fireflies />

      {/* Ground mist wisps */}
      <MistWisps />

      {/* Ghibli stone path */}
      <GhibliPath />

      {/* Falling sakura petals */}
      <SakuraPetals />

      {/* Cherry blossom trees */}
      {trees.map((t, i) => (
        <BlossomTree key={i} x={t.x} z={t.z} scale={t.s} />
      ))}

      {/* Stone lanterns */}
      <StoneWayLanterns />

      {/* Mount Fuji — behind the city skyline */}
      <MountFuji />

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
