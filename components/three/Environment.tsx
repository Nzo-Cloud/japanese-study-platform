import { Sky } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MotionValue } from 'framer-motion';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Props {
  progress: MotionValue<number>;
}

// Cherry Blossom Tree logic
function CherryBlossomTree({ position, opacity, scale = 1 }: {
  position: [number, number, number],
  opacity: number,
  scale?: number
}) {
  if (opacity <= 0) return null;

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 3]} />
        <meshStandardMaterial color="#5c3d2e" roughness={0.9} transparent opacity={opacity} />
      </mesh>

      {/* Canopy Spheres */}
      <mesh position={[0, 3, 0]}>
        <dodecahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#ffb7c5" emissive="#ff6b8a" emissiveIntensity={0.1} transparent opacity={opacity * 0.85} roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 2.5, 0]}>
        <dodecahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color="#ffb7c5" emissive="#ff6b8a" emissiveIntensity={0.1} transparent opacity={opacity * 0.85} roughness={0.8} />
      </mesh>
      <mesh position={[-0.8, 2.0, 0.5]}>
        <dodecahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#ffb7c5" emissive="#ff6b8a" emissiveIntensity={0.1} transparent opacity={opacity * 0.85} roughness={0.8} />
      </mesh>
    </group>
  );
}

function GroundSystem() {
  const stones = useMemo(() => {
    const s = [];
    for (let i = 0; i < 25; i++) {
      s.push({
        x: (Math.random() - 0.5) * 0.5,
        z: -18 + (i * 1.8) + (Math.random() * 0.3),
        rotY: (Math.random() - 0.5) * 0.3,
        width: 2.0 + Math.random() * 0.8,
        depth: 0.9 + Math.random() * 0.4
      })
    }
    return s;
  }, []);

  return (
    <group>
      {/* Matte Dark Moss Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5000, 5000]} />
        <meshStandardMaterial color="#0a0d1a" roughness={1.0} />
      </mesh>

      {/* Ancient Chunked Flagstones */}
      {stones.map((st, i) => (
        <mesh key={i} position={[st.x, 0.05, st.z]} rotation={[-Math.PI / 2, 0, st.rotY]} receiveShadow castShadow>
          <boxGeometry args={[st.width, st.depth, 0.2]} />
          <meshStandardMaterial color="#353b47" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ====== SCENE ENVIRONMENT DECORATIONS ======

// 1. Swaying Wind-Grass (InstancedMesh)
function GrassField() {
  const count = 3000;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Each grass cluster has 3 blades rendered as a group
  // We simulate this by creating 3 instanced meshes with slight offsets
  const initialPositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      let x = (Math.random() - 0.5) * 120;
      if (x > -3.5 && x < 3.5) x = x > 0 ? x + 3.5 : x - 3.5;
      const z = 20 - Math.random() * 40;
      const scale = 0.4 + Math.random() * 0.8;
      const rotation = Math.random() * Math.PI * 2;
      const lean = (Math.random() - 0.5) * 0.4; // random lean angle
      pos.push({ x, z, scale, rotation, lean });
    }
    return pos;
  }, [count]);

  // Blade shape: use a custom rounded blade via CapsuleGeometry or 
  // high-segment cone to get soft rounded tip instead of sharp triangle
  // We'll render 3 layers: back blades (darker), front blades (lighter), 
  // accent blades (pink-tinted for depth)

  const blade1Ref = useRef<THREE.InstancedMesh>(null);
  const blade2Ref = useRef<THREE.InstancedMesh>(null);
  const blade3Ref = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    [blade1Ref, blade2Ref, blade3Ref].forEach((ref, layerIndex) => {
      if (!ref.current) return;
      initialPositions.forEach((p, i) => {
        const windPhase = time * 0.6 + p.x * 0.15 + p.z * 0.08;
        const swayX = Math.sin(windPhase) * 0.12;
        const swayZ = Math.cos(windPhase * 0.7) * 0.08;

        // Each layer offsets slightly for cluster feel
        const offsetX = layerIndex === 0 ? -0.15 : layerIndex === 1 ? 0.15 : 0;
        const offsetZ = layerIndex === 0 ? 0.1 : layerIndex === 1 ? -0.1 : 0.05;
        const scaleY = layerIndex === 2 ? p.scale * 1.2 : p.scale;

        dummy.position.set(
          p.x + offsetX,
          (scaleY * 0.55),
          p.z + offsetZ
        );
        dummy.rotation.set(swayX + p.lean, p.rotation + layerIndex * 0.4, swayZ);
        dummy.scale.set(p.scale * 0.18, scaleY * 0.9, p.scale * 0.18);
        dummy.updateMatrix();
        ref.current!.setMatrixAt(i, dummy.matrix);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    });
  });

  // Color layers: deep forest green base, mid green, and a lighter tip accent
  return (
    <group>
      {/* Back layer — deep shadowed green */}
      <instancedMesh ref={blade1Ref} args={[undefined, undefined, count]}>
        <coneGeometry args={[0.5, 1.0, 8]} />
        <meshStandardMaterial
          color="#2d4a1e"
          roughness={0.95}
          metalness={0}
        />
      </instancedMesh>

      {/* Mid layer — lush Ghibli green */}
      <instancedMesh ref={blade2Ref} args={[undefined, undefined, count]}>
        <coneGeometry args={[0.45, 1.0, 8]} />
        <meshStandardMaterial
          color="#3d6b2a"
          roughness={0.9}
          metalness={0}
        />
      </instancedMesh>

      {/* Front accent layer — lighter, slight warm tint */}
      <instancedMesh ref={blade3Ref} args={[undefined, undefined, count]}>
        <coneGeometry args={[0.35, 1.0, 8]} />
        <meshStandardMaterial
          color="#4a7c35"
          roughness={0.85}
          metalness={0}
          emissive="#1a3a0a"
          emissiveIntensity={0.15}
        />
      </instancedMesh>
    </group>
  );
}



// 0. Sky Controller for high-performance ref updates
function SkyController({ sunRef, rayleighRef, turbidityRef }: {
  sunRef: React.MutableRefObject<THREE.Vector3>,
  rayleighRef: React.MutableRefObject<number>,
  turbidityRef: React.MutableRefObject<number>,
}) {
  const skyRef = useRef<any>(null);
  useFrame(() => {
    if (!skyRef.current) return;
    const mat = skyRef.current.material;
    if (!mat?.uniforms) return;
    mat.uniforms.sunPosition.value.copy(sunRef.current);
    mat.uniforms.rayleigh.value = rayleighRef.current;
    mat.uniforms.turbidity.value = turbidityRef.current;
  });
  return (
    <Sky
      ref={skyRef}
      mieCoefficient={0.005}
      mieDirectionalG={0.8}
    />
  );
}

function ShibuyaCrossing() {
  const groupRef = useRef<THREE.Group>(null);
  const crossingZ = -22;
  const crossingY = 0.1;

  const stripes = useMemo(() => {
    const s: { x: number, z: number, rotY: number, w: number, d: number }[] = [];
    for (let i = -4; i <= 4; i++) s.push({ x: i * 1.2, z: crossingZ, rotY: 0, w: 0.5, d: 8 });
    for (let i = -4; i <= 4; i++) s.push({ x: i * 1.2, z: crossingZ, rotY: Math.PI / 2, w: 0.5, d: 8 });
    for (let i = -4; i <= 4; i++) s.push({ x: i * 1.2, z: crossingZ, rotY: Math.PI / 4, w: 0.4, d: 10 });
    return s;
  }, []);

  const figures = useMemo(() => {
    const figs: { id: number, x: number, z: number, direction: number, speed: number, hasUmbrella: boolean, scale: number, phase: number }[] = [];
    for (let i = 0; i < 60; i++) {
      const direction = i % 4;
      const spread = (Math.random() - 0.5) * 14;
      const offset = (Math.random() - 0.5) * 6;
      figs.push({
        id: i,
        x: direction === 0 || direction === 1 ? spread : offset,
        z: crossingZ + (direction === 2 ? offset : (Math.random() - 0.5) * 8),
        direction,
        speed: 0.008 + Math.random() * 0.006,
        hasUmbrella: Math.random() > 0.65,
        scale: 1.8 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return figs;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    const children = groupRef.current.children;
    const figureStartIndex = 2;
    figures.forEach((fig, i) => {
      const child = children[figureStartIndex + i];
      if (!child) return;
      child.position.y = crossingY + Math.abs(Math.sin(time * 2.5 + fig.phase)) * 0.06;
      switch (fig.direction) {
        case 0: child.position.x -= fig.speed; if (child.position.x < -12) child.position.x = 12; break;
        case 1: child.position.x += fig.speed; if (child.position.x > 12) child.position.x = -12; break;
        case 2: child.position.z += fig.speed; if (child.position.z > crossingZ + 6) child.position.z = crossingZ - 6; break;
        case 3: child.position.x += fig.speed * 0.7; child.position.z += fig.speed * 0.7;
          if (child.position.x > 12) child.position.x = -12;
          if (child.position.z > crossingZ + 6) child.position.z = crossingZ - 6; break;
      }
    });
  });

  const c = "#1a0f20";
  return (
    <group ref={groupRef}>
      <group>
        {stripes.map((stripe, i) => (
          <mesh key={i} position={[stripe.x, crossingY + 0.02, stripe.z]} rotation={[Math.PI / 2, stripe.rotY, 0]}>
            <planeGeometry args={[stripe.w, stripe.d]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.25} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 4, crossingZ]} color="#ff9f1c" intensity={3.0} distance={40} />
      {figures.map((fig) => (
        <group key={fig.id} position={[fig.x, crossingY, fig.z]} scale={[fig.scale, fig.scale, fig.scale]}>
          <mesh position={[0, 0.55, 0]}>
            <capsuleGeometry args={[0.1, 0.6, 4, 6]} />
            <meshBasicMaterial color={c} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.13, 6, 6]} />
            <meshBasicMaterial color={c} />
          </mesh>
          {fig.hasUmbrella && (
            <group position={[0.1, 1.35, 0]}>
              <mesh position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.3, 5]} />
                <meshBasicMaterial color={c} />
              </mesh>
              <mesh position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
                <coneGeometry args={[0.38, 0.15, 10]} />
                <meshBasicMaterial color={c} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}

function SkylineSilhouette() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    // Start bottom left
    s.moveTo(-120, -8);

    // Build a varied skyline profile left to right
    const points = [
      [-120, -8], [-110, -8], [-110, 12], [-106, 12], [-106, 8],
      [-102, 8], [-102, 22], [-99, 22], [-99, 8], [-96, 8],
      [-96, 15], [-93, 15], [-93, 28], [-91, 28], [-91, 30],
      [-89, 30], [-89, 28], [-87, 28], [-87, 18], [-84, 18],
      [-84, 10], [-81, 10], [-81, 25], [-78, 25], [-78, 12],
      [-75, 12], [-75, 35], [-73, 35], [-73, 38], [-71, 38],
      [-71, 35], [-69, 35], [-69, 15], [-66, 15], [-66, 20],
      [-63, 20], [-63, 10], [-60, 10], [-60, 28], [-57, 28],
      [-57, 8], [-54, 8], [-54, 18], [-51, 18], [-51, 32],
      [-48, 32], [-48, 20], [-45, 20], [-45, 42], [-43, 42],
      [-43, 45], [-41, 45], [-41, 42], [-39, 42], [-39, 18],
      [-36, 18], [-36, 25], [-33, 25], [-33, 12], [-30, 12],
      [-30, 30], [-27, 30], [-27, 55], [-25, 55], [-25, 58],
      [-23, 58], [-23, 60], [-21, 60], [-21, 58], [-19, 58],
      [-19, 55], [-17, 55], [-17, 30], [-14, 30], [-14, 22],
      [-11, 22], [-11, 35], [-8, 35], [-8, 18], [-5, 18],
      [-5, 40], [-3, 40], [-3, 42], [-1, 42], [-1, 40],
      [1, 40], [1, 18], [4, 18], [4, 35], [7, 35],
      [7, 22], [10, 22], [10, 55], [12, 55], [12, 58],
      [14, 58], [14, 60], [16, 60], [16, 58], [18, 58],
      [18, 55], [20, 55], [20, 25], [23, 25], [23, 38],
      [26, 38], [26, 20], [29, 20], [29, 32], [32, 32],
      [32, 15], [35, 15], [35, 28], [38, 28], [38, 10],
      [41, 10], [41, 22], [44, 22], [44, 12], [47, 12],
      [47, 35], [50, 35], [50, 8], [53, 8], [53, 42],
      [56, 42], [56, 20], [59, 20], [59, 30], [62, 30],
      [62, 15], [65, 15], [65, 38], [68, 38], [68, 18],
      [71, 18], [71, 25], [74, 25], [74, 10], [77, 10],
      [77, 20], [80, 20], [80, 12], [83, 12], [83, 28],
      [86, 28], [86, 8], [89, 8], [89, 15], [92, 15],
      [92, 22], [95, 22], [95, 8], [98, 8], [98, 18],
      [101, 18], [101, 12], [104, 12], [104, 8], [110, 8],
      [110, -8], [-120, -8],
    ];

    s.moveTo(points[0][0], points[0][1]);
    points.forEach(([x, y]) => s.lineTo(x, y));
    return s;
  }, []);

  return (
    <mesh position={[0, -2, -250]} rotation={[0, 0, 0]} scale={[2.8, 2.8, 1]}>
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial color="#0a0812" />
    </mesh>
  );
}



function UrbanSprawl({ progress }: { progress: MotionValue<number> }) {
  const buildings = useMemo(() => {
    const result = [];
    for (let i = 0; i < 220; i++) {
      const w = 1.5 + Math.random() * 3;
      const d = 1.5 + Math.random() * 3;
      const h = 1.0 + Math.random() * 5;
      const cols = Math.max(1, Math.floor(w / 1.1));
      const rows = Math.max(1, Math.floor(h / 1.2));
      const windows: { wx: number, wy: number, color: string }[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.35) {
            const rand = Math.random();
            windows.push({
              wx: -w / 2 + 0.5 + c * (w / cols),
              wy: 0.4 + r * (h / rows),
              color: rand > 0.6 ? '#ffcc77' : rand > 0.3 ? '#ffaa44' : '#aaddff',
            });
          }
        }
      }
      result.push({
        id: i,
        x: -70 + Math.random() * 140,
        z: -38 - Math.random() * 30,
        w, d, h, windows,
      });
    }
    return result;
  }, []);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const windowMeshRef = useRef<THREE.InstancedMesh>(null);

  const totalWindows = useMemo(() => buildings.reduce((acc: number, b: any) => acc + b.windows.length, 0), [buildings]);

  useEffect(() => {
    if (!meshRef.current || !windowMeshRef.current) return;

    // Initialize all to zero scale to prevent artifacts
    const zeroDummy = new THREE.Object3D();
    zeroDummy.scale.set(0, 0, 0);
    zeroDummy.updateMatrix();

    // meshRef initialization
    const meshCount = meshRef.current.count;
    for (let i = 0; i < meshCount; i++) {
      meshRef.current.setMatrixAt(i, zeroDummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // windowMeshRef initialization
    const windowCount = windowMeshRef.current.count;
    for (let i = 0; i < windowCount; i++) {
      windowMeshRef.current.setMatrixAt(i, zeroDummy.matrix);
    }
    windowMeshRef.current.instanceMatrix.needsUpdate = true;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let winIndex = 0;

    buildings.forEach((b) => {
      // Building body
      dummy.position.set(b.x, b.h / 2, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(b.id, dummy.matrix);

      // Building windows
      b.windows.forEach((win) => {
        dummy.position.set(b.x + win.wx, win.wy, b.z + b.d / 2 + 0.01);
        dummy.scale.set(0.28, 0.35, 1);
        dummy.updateMatrix();
        windowMeshRef.current!.setMatrixAt(winIndex, dummy.matrix);
        windowMeshRef.current!.setColorAt(winIndex, color.set(win.color));
        winIndex++;
      });
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    windowMeshRef.current.instanceMatrix.needsUpdate = true;
    if (windowMeshRef.current.instanceColor) windowMeshRef.current.instanceColor.needsUpdate = true;
  }, [buildings]);

  return (
    <group position={[0, -2, 0]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, buildings.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0d0c1a" roughness={0.85} emissive="#ffdd99" emissiveIntensity={0.05} />
      </instancedMesh>
      <instancedMesh ref={windowMeshRef} args={[undefined, undefined, totalWindows]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function ElevatedTrain() {
  const trainRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!trainRef.current) return;
    const t = state.clock.getElapsedTime();
    // Loop train from left to right
    trainRef.current.position.x = -40 + ((t * 4) % 80);
  });

  const pillarColor = "#1a1828";
  const trackColor = "#2a2838";
  const trainColor = "#c8c0d8";

  return (
    <group position={[0, -2, -28]}>
      {/* Track beam — long horizontal */}
      <mesh position={[0, 4.2, 0]}>
        <boxGeometry args={[80, 0.2, 0.8]} />
        <meshStandardMaterial color={trackColor} roughness={0.9} />
      </mesh>
      {/* Rail lines */}
      <mesh position={[0, 4.35, -0.2]}>
        <boxGeometry args={[80, 0.08, 0.08]} />
        <meshStandardMaterial color="#3a3848" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.35, 0.2]}>
        <boxGeometry args={[80, 0.08, 0.08]} />
        <meshStandardMaterial color="#3a3848" roughness={0.8} />
      </mesh>

      {/* Support pillars every 8 units */}
      {Array.from({ length: 11 }).map((_, i) => (
        <group key={i} position={[-40 + i * 8, 0, 0]}>
          {/* Pillar */}
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[0.4, 4, 0.4]} />
            <meshStandardMaterial color={pillarColor} roughness={0.9} />
          </mesh>
          {/* Crossbeam */}
          <mesh position={[0, 3.8, 0]}>
            <boxGeometry args={[1.2, 0.25, 0.6]} />
            <meshStandardMaterial color={pillarColor} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Train — 4 cars */}
      <group ref={trainRef} position={[-40, 4.45, 0]}>
        {[0, 3.2, 6.4, 9.6].map((offset, ci) => (
          <group key={ci} position={[offset, 0, 0]}>
            {/* Car body */}
            <mesh position={[0, 0.6, 0]}>
              <boxGeometry args={[2.8, 1.0, 0.7]} />
              <meshStandardMaterial
                color={trainColor}
                emissive="#8888cc"
                emissiveIntensity={0.15}
                roughness={0.4}
                metalness={0.3}
              />
            </mesh>
            {/* Windows strip */}
            <mesh position={[0, 0.72, 0.36]}>
              <boxGeometry args={[2.2, 0.35, 0.02]} />
              <meshStandardMaterial
                color="#aaddff"
                emissive="#aaddff"
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Stripe accent */}
            <mesh position={[0, 0.28, 0.36]}>
              <boxGeometry args={[2.8, 0.1, 0.02]} />
              <meshStandardMaterial color="#4466cc" emissive="#4466cc" emissiveIntensity={0.5} />
            </mesh>
          </group>
        ))}
        {/* Train headlight */}
        <pointLight position={[13, 0.6, 0]} color="#ffffff" intensity={1.5} distance={8} />
      </group>
    </group>
  );
}

export default function Environment({ progress }: Props) {
  const fogRef = useRef<THREE.FogExp2>(null);
  const dawnLightRef = useRef<THREE.DirectionalLight>(null);

  const sunPositionRef = useRef(new THREE.Vector3(0, -0.1, -1));
  const rayleighRef = useRef(6);
  const turbidityRef = useRef(8);

  const treePositions: [number, number, number][] = useMemo(() => [
    // Left side forest — close to gate
    [-3, 0, -2], [-5, 0, -4], [-7, 0, -1], [-4, 0, -8],
    [-8, 0, -6], [-10, 0, -3], [-6, 0, -13], [-9, 0, -11],
    [-12, 0, -7], [-11, 0, -15],
    // Right side forest — close to gate
    [3, 0, -2], [5, 0, -4], [7, 0, -1], [4, 0, -8],
    [8, 0, -6], [10, 0, -3], [6, 0, -13], [9, 0, -11],
    [12, 0, -7], [11, 0, -15],
    // Behind gate — deeper forest
    [-2, 0, -16], [2, 0, -18], [-5, 0, -22], [5, 0, -20],
  ], []);

  // Dense City Grid Generation
  const cityBlocks = useMemo(() => {
    const blocks = [];
    for (let i = 0; i < 200; i++) {
      const x = -45 + Math.random() * 90;
      const z = -30 - Math.random() * 40;
      const w = 1.2 + Math.random() * 3.5;
      const d = 1.2 + Math.random() * 3.5;
      const h = 3 + Math.random() * 18;
      // Window grid: cols and rows based on building size
      const cols = Math.floor(w / 0.9);
      const rows = Math.floor(h / 1.2);
      blocks.push({ id: i, x, z, w, d, h, cols, rows });
    }
    return blocks;
  }, []);

  const horizonBuildings = useMemo(() =>
    Array.from({ length: 100 }).map((_, i) => {
      const x = -60 + Math.random() * 120;
      const z = -65 - Math.random() * 25; // z=-65 to z=-90, beyond existing city
      const w = 2 + Math.random() * 5;
      const d = 2 + Math.random() * 5;
      const h = 15 + Math.random() * 35; // much taller to fill skyline
      return { id: i, x, z, w, d, h };
    })
    , []);

  // Generate window data separately — deterministic per building
  const windowData = useMemo(() => cityBlocks.map(b => {
    const windows: { row: number, col: number, lightLevel: number }[] = [];
    for (let row = 0; row < b.rows; row++) {
      for (let col = 0; col < b.cols; col++) {
        const lit = Math.random();
        // 3 light levels: dark, warm yellow, cool blue-white
        const lightLevel = lit < 0.35 ? 0 : lit < 0.65 ? 1 : lit < 0.85 ? 2 : 3;
        windows.push({ row, col, lightLevel });
      }
    }
    return windows;
  }), [cityBlocks]);

  const windowColors = ['#000000', '#ff9f1c', '#ffda88', '#ffd700'];
  const windowIntensity = [0, 1.2, 1.8, 2.5];

  const cityMeshRef = useRef<THREE.InstancedMesh>(null);
  const cityWindowMeshRef = useRef<THREE.InstancedMesh>(null);
  const horizonMeshRef = useRef<THREE.InstancedMesh>(null);

  const totalCityWindows = useMemo(() =>
    windowData.reduce((acc: number, bWindows: { lightLevel: number }[]) =>
      acc + bWindows.filter(w => w.lightLevel !== 0).length, 0),
    [windowData]);

  useEffect(() => {
    if (!cityMeshRef.current || !cityWindowMeshRef.current || !horizonMeshRef.current) return;

    // Initialize all to zero scale to prevent artifacts
    const zeroDummy = new THREE.Object3D();
    zeroDummy.scale.set(0, 0, 0);
    zeroDummy.updateMatrix();

    // cityMeshRef initialization
    const cityCount = cityMeshRef.current.count;
    for (let i = 0; i < cityCount; i++) {
      cityMeshRef.current.setMatrixAt(i, zeroDummy.matrix);
    }
    cityMeshRef.current.instanceMatrix.needsUpdate = true;

    // cityWindowMeshRef initialization
    const cityWindowCount = cityWindowMeshRef.current.count;
    for (let i = 0; i < cityWindowCount; i++) {
      cityWindowMeshRef.current.setMatrixAt(i, zeroDummy.matrix);
    }
    cityWindowMeshRef.current.instanceMatrix.needsUpdate = true;

    // horizonMeshRef initialization
    const horizonCount = horizonMeshRef.current.count;
    for (let i = 0; i < horizonCount; i++) {
      horizonMeshRef.current.setMatrixAt(i, zeroDummy.matrix);
    }
    horizonMeshRef.current.instanceMatrix.needsUpdate = true;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let winIndex = 0;

    // City Blocks
    cityBlocks.forEach((b, bi) => {
      dummy.position.set(b.x, b.h / 2, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      cityMeshRef.current!.setMatrixAt(bi, dummy.matrix);

      windowData[bi].forEach((win: { lightLevel: number, col: number, row: number }) => {
        if (win.lightLevel === 0) return;
        const wx = -b.w / 2 + 0.5 + (win.col * (b.w / b.cols));
        const wy = 0.7 + (win.row * (b.h / b.rows));

        dummy.position.set(b.x + wx, wy, b.z + b.d / 2 + 0.01);
        dummy.scale.set(0.35, 0.45, 1);
        dummy.updateMatrix();
        cityWindowMeshRef.current!.setMatrixAt(winIndex, dummy.matrix);
        cityWindowMeshRef.current!.setColorAt(winIndex, color.set(windowColors[win.lightLevel]));
        winIndex++;
      });
    });

    // Horizon
    horizonBuildings.forEach((b, i) => {
      dummy.position.set(b.x, b.h / 2, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.updateMatrix();
      horizonMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    cityMeshRef.current.instanceMatrix.needsUpdate = true;
    cityWindowMeshRef.current.instanceMatrix.needsUpdate = true;
    if (cityWindowMeshRef.current.instanceColor) cityWindowMeshRef.current.instanceColor.needsUpdate = true;
    horizonMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [cityBlocks, windowData, horizonBuildings]);

  // We will force a component render periodically for the Sky if needed, but R3F useFrame can manipulate refs directly without re-render.

  useFrame(() => {
    const p = progress.get();

    // 1. Fog Color Lerping
    if (fogRef.current) {
      const fogColors = [
        { stop: 0.0, color: new THREE.Color('#0a0a1a') },
        { stop: 0.35, color: new THREE.Color('#1a1a35') },
        { stop: 0.55, color: new THREE.Color('#342045') },
        { stop: 0.8, color: new THREE.Color('#4e3a4e') },
        { stop: 1.0, color: new THREE.Color('#6a4a40') },
      ];

      // Find segment
      for (let i = 0; i < fogColors.length - 1; i++) {
        if (p >= fogColors[i].stop && p <= fogColors[i + 1].stop) {
          const start = fogColors[i];
          const end = fogColors[i + 1];
          const t = (p - start.stop) / (end.stop - start.stop);
          fogRef.current.color.lerpColors(start.color, end.color, t);
          break;
        }
      }

      if (p > 1.0) fogRef.current.color.copy(fogColors[4].color);
    }

    // 1.5 Visibility Culling


    // 2. Sky Lerping
    // Manually setting properties to prevent massive re-renders
    if (p <= 0.35) {
      sunPositionRef.current.lerpVectors(
        new THREE.Vector3(0, -0.5, -1),
        new THREE.Vector3(0, -0.3, -1),
        p / 0.35
      );
    } else if (p <= 0.80) {
      sunPositionRef.current.lerpVectors(
        new THREE.Vector3(0, -0.3, -1),
        new THREE.Vector3(0, -0.1, -1),
        (p - 0.35) / 0.45
      );
      rayleighRef.current = 6;
      turbidityRef.current = 10;
    } else {
      sunPositionRef.current.lerpVectors(
        new THREE.Vector3(0, -0.1, -1),
        new THREE.Vector3(1, 0.5, -1),
        (p - 0.80) / 0.20
      );
      rayleighRef.current = 2;
      turbidityRef.current = 4;
    }

    const newSun = sunPositionRef.current;

    // 3. Dawn Sun Light intensity lerp (0.55 -> 0.75)
    if (dawnLightRef.current) {
      if (p < 0.80) {
        dawnLightRef.current.intensity = 0;
      } else if (p <= 0.95) {
        dawnLightRef.current.intensity = ((p - 0.80) / 0.15) * 2.0;
      } else {
        dawnLightRef.current.intensity = 2.0;
      }
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={['#1a1a2e', 0.014]} />

      {/* Ambient — base scene fill */}
      <ambientLight color="#5a4a60" intensity={0.25} />

      {/* Moonlight Wash to Illuminate Ground Options */}
      <directionalLight position={[0, 20, 15]} color="#6080c0" intensity={0.3} />

      {/* Moon — shrine night scene */}
      <pointLight position={[10, 20, -5]} color="#9a8bb0" intensity={1.5} distance={100} />

      {/* Torii warmth — orange accent at gate position */}
      <pointLight position={[0, 3, 2]} color="#d90429" intensity={0.8} distance={12} />

      {/* Ground rim — lifts the black floor */}
      <pointLight position={[0, -1, 0]} color="#4a2060" intensity={1.0} distance={25} />

      {/* Left lantern glow */}
      <pointLight position={[-2.2, 0.8, 1]} color="#ff8c42" intensity={1.2} distance={5} />

      {/* Right lantern glow */}
      <pointLight position={[2.2, 0.8, 1]} color="#ff8c42" intensity={1.2} distance={5} />

      {/* Sky */}
      <SkyController
        sunRef={sunPositionRef}
        rayleighRef={rayleighRef}
        turbidityRef={turbidityRef}
      />



      {/* Dawn Sun directional light */}
      <directionalLight
        ref={dawnLightRef}
        position={[20, 10, 5]}
        color="#ffcc77"
        intensity={0}
        castShadow
      />

      {/* Master 5-Option Interactive Ground Component */}
      <GroundSystem />

      {/* Dynamic Field Decor Switcher Component */}
      <GrassField />

      {/* Volumetric Ground Mist Plane */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial color="#4a2880" transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Blossom Ground */}
      <mesh position={[0, -0.1, -15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#ffe0e8" roughness={1} />
      </mesh>

      {/* Cherry Blossom Trees */}
      <group>
        {treePositions.map((pos, i) => (
          // In React, since we are doing static trees based on scroll, we can use a wrapper component that listens to the progress and updates its own opacity
          <TreeWrapper key={i} position={pos} progress={progress} index={i} />
        ))}
      </group>

      {/* City crossing crowds */}
      <ShibuyaCrossing />

      <SkylineSilhouette />



      {/* Urban sprawl low buildings */}
      <UrbanSprawl progress={progress} />
      {/* Elevated train */}
      <ElevatedTrain />

      {/* City Blocks Dense Cluster */}
      <group position={[0, -2, -20]}>
        <instancedMesh ref={cityMeshRef} args={[undefined, undefined, cityBlocks.length]} castShadow>
          <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
          <meshStandardMaterial
            color="#0d0c1a"
            emissive="#ffcc88"
            emissiveIntensity={0.12}
            roughness={0.8}
          />
        </instancedMesh>

        <instancedMesh ref={cityWindowMeshRef} args={[undefined, undefined, totalCityWindows]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>

        <instancedMesh ref={horizonMeshRef} args={[undefined, undefined, horizonBuildings.length]} castShadow>
          <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
          <meshStandardMaterial
            color="#0a0918"
            emissive="#ffcc88"
            emissiveIntensity={0.1}
            roughness={0.8}
          />
        </instancedMesh>

        {/* Tokyo Tower — red lattice spire */}
        <group position={[3, 0, -28]}>
          {/* Base wide section */}
          <mesh position={[0, 8, 0]}>
            <coneGeometry args={[2.5, 16, 4]} />
            <meshStandardMaterial color="#c0392b" emissive="#8b0000" emissiveIntensity={0.3} roughness={0.6} />
          </mesh>
          {/* Upper thin spire */}
          <mesh position={[0, 22, 0]}>
            <coneGeometry args={[0.6, 14, 4]} />
            <meshStandardMaterial color="#c0392b" emissive="#8b0000" emissiveIntensity={0.4} roughness={0.6} />
          </mesh>
          {/* Observation deck band */}
          <mesh position={[0, 14, 0]}>
            <cylinderGeometry args={[1.2, 1.2, 1.0, 8]} />
            <meshStandardMaterial color="#e8e0d0" emissive="#ffcc44" emissiveIntensity={0.6} />
          </mesh>
          {/* Beacon light at top */}
          <pointLight position={[0, 30, 0]} color="#ff4444" intensity={2.0} distance={15} />
        </group>
      </group>
    </>
  );
}

// Wrapper to animate opacity of trees smoothly without forcing parent re-renders
function TreeWrapper({ position, progress, index }: {
  position: [number, number, number],
  progress: MotionValue<number>,
  index: number
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = progress.get();
    let o = 0;
    if (p <= 0.5) {
      o = 1;
    } else if (p <= 0.6) {
      o = 1 - ((p - 0.5) / 0.1);
    }
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.opacity = o;
          child.visible = o > 0;
        }
      });
    }
  });

  const scale = 0.7 + (index % 5) * 0.15;  // varies from 0.7 to 1.3

  return (
    <group ref={groupRef} position={position}>
      <CherryBlossomTree position={[0, 0, 0]} opacity={1} scale={scale} />
    </group>
  );
}
