'use client';

import { Sky } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MotionValue } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
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
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#0f111a" roughness={1.0} />
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

// 2. Entrance Stone Lanterns
function LanternPath() {
  const lanterns = useMemo(() => {
    const lants = [];
    let zIter = 18; // Start near the camera

    // Line the path downwards towards the Torii gate
    while (zIter > -10) {
      // Left side organic scatter
      lants.push({
        x: -3 - Math.random() * 1.5,
        z: zIter + (Math.random() * 2 - 1),
        lit: Math.random() > 0.3, // 70% chance to be lit
        rotY: Math.random() * Math.PI,
        scale: 0.7 + Math.random() * 0.4
      });

      // Right side organic scatter
      lants.push({
        x: 3 + Math.random() * 1.5,
        z: zIter + (Math.random() * 2 - 1),
        lit: Math.random() > 0.3,
        rotY: Math.random() * Math.PI,
        scale: 0.7 + Math.random() * 0.4
      });

      zIter -= 6; // Move ~6 units down the path for the next pair
    }
    return lants;
  }, []);

  return (
    <group>
      {lanterns.map((lant, i) => (
        <group key={i} position={[lant.x, 0, lant.z]} rotation={[0, lant.rotY, 0]} scale={lant.scale}>
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow><boxGeometry args={[0.6, 0.4, 0.6]} /><meshStandardMaterial color="#2d3545" roughness={0.9} /></mesh>
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow><boxGeometry args={[0.4, 0.8, 0.4]} /><meshStandardMaterial color="#2d3545" roughness={0.9} /></mesh>
          <mesh position={[0, 1.4, 0]} castShadow receiveShadow><boxGeometry args={[0.5, 0.4, 0.5]} /><meshStandardMaterial color={lant.lit ? "#ffccaa" : "#1a1f2e"} emissive={lant.lit ? "#ff8c42" : "#000000"} emissiveIntensity={lant.lit ? 2.0 : 0} roughness={0.9} /></mesh>
          <mesh position={[0, 1.7, 0]} castShadow receiveShadow><boxGeometry args={[0.8, 0.2, 0.8]} /><meshStandardMaterial color="#2d3545" roughness={0.9} /></mesh>
          {lant.lit && <pointLight position={[0, 1.4, 0]} color="#ff8c42" intensity={0.5} distance={6} />}
        </group>
      ))}
    </group>
  );
}

function FieldDecorSystem() {
  return (
    <group>
      <GrassField />
      <LanternPath />
    </group>
  );
}

function HorizonSilhouettes() {
  const figures = useMemo(() => [
    // Walking figures spread across the horizon
    { x: -18, z: -29, hasUmbrella: false, scale: 1.0, walking: true },
    { x: -12, z: -30, hasUmbrella: true, scale: 0.95, walking: false },
    { x: -7, z: -28, hasUmbrella: false, scale: 1.1, walking: true },
    { x: -3, z: -31, hasUmbrella: true, scale: 0.9, walking: false },
    { x: 2, z: -29, hasUmbrella: false, scale: 1.0, walking: true },
    { x: 6, z: -30, hasUmbrella: false, scale: 1.05, walking: true },
    { x: 10, z: -28, hasUmbrella: true, scale: 0.95, walking: false },
    { x: 15, z: -31, hasUmbrella: false, scale: 1.0, walking: true },
    { x: 20, z: -29, hasUmbrella: true, scale: 1.1, walking: false },
    // A few closer figures for depth layering
    { x: -22, z: -26, hasUmbrella: false, scale: 1.2, walking: true },
    { x: 24, z: -27, hasUmbrella: true, scale: 1.15, walking: false },
    { x: -5, z: -26, hasUmbrella: false, scale: 1.2, walking: true },
    { x: 8, z: -27, hasUmbrella: true, scale: 1.1, walking: false },
  ], []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    // Animate walking figures with subtle bob
    groupRef.current.children.forEach((child, i) => {
      const fig = figures[i];
      if (fig?.walking) {
        child.position.y = Math.sin(time * 1.2 + i * 0.8) * 0.04;
        // Slow walk — move x slightly
        child.position.x += 0.003;
        // Wrap around
        if (child.position.x > 30) child.position.x = -30;
      }
    });
  });

  const silhouetteColor = "#0a0812";

  return (
    <group ref={groupRef}>
      {figures.map((fig, i) => (
        <group key={i} position={[fig.x, 0, fig.z]} scale={[fig.scale, fig.scale, fig.scale]}>
          {/* Body */}
          <mesh position={[0, 0.6, 0]}>
            <capsuleGeometry args={[0.12, 0.7, 4, 8]} />
            <meshBasicMaterial color={silhouetteColor} />
          </mesh>
          {/* Head */}
          <mesh position={[0, 1.25, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color={silhouetteColor} />
          </mesh>
          {/* Umbrella — only for some figures */}
          {fig.hasUmbrella && (
            <group position={[0.1, 1.55, 0]}>
              {/* Handle */}
              <mesh position={[0, -0.2, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
                <meshBasicMaterial color={silhouetteColor} />
              </mesh>
              {/* Canopy — flat disc */}
              <mesh position={[0, 0, 0]} rotation={[0.15, 0, 0]}>
                <coneGeometry args={[0.45, 0.18, 12]} />
                <meshBasicMaterial color={silhouetteColor} />
              </mesh>
            </group>
          )}
          {/* Subtle glow behind each figure from city light */}
          <pointLight
            position={[0, 0.8, 0.5]}
            color="#ff8844"
            intensity={0.3}
            distance={2}
          />
        </group>
      ))}
    </group>
  );
}

export default function Environment({ progress }: Props) {
  const fogRef = useRef<THREE.FogExp2>(null);
  const dawnLightRef = useRef<THREE.DirectionalLight>(null);

  const sunPositionRef = useRef(new THREE.Vector3(0, -0.1, -1));
  const rayleighRef = useRef(6);
  const turbidityRef = useRef(8);

  const [skyUniforms, setSkyUniforms] = useState({
    sunPosition: new THREE.Vector3(0, -0.1, -1) as [number, number, number] | THREE.Vector3,
    rayleigh: 6,
    turbidity: 8
  });

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

  // Generate window data separately — deterministic per building
  const windowData = useMemo(() => cityBlocks.map(b => {
    const windows = [];
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

  const windowColors = ['#000000', '#ffdd88', '#fff5cc', '#aaddff'];
  const windowIntensity = [0, 1.2, 1.8, 2.5];

  // We will force a component render periodically for the Sky if needed, but R3F useFrame can manipulate refs directly without re-render.

  useFrame(() => {
    const p = progress.get();

    // 1. Fog Color Lerping
    if (fogRef.current) {
      const fogColors = [
        { stop: 0.0, color: new THREE.Color('#1a1a2e') },
        { stop: 0.35, color: new THREE.Color('#2d1b69') },
        { stop: 0.55, color: new THREE.Color('#ffb4a2') },
        { stop: 0.8, color: new THREE.Color('#ff6b35') },
        { stop: 1.0, color: new THREE.Color('#ffd4a8') },
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

    // 2. Sky Lerping
    // Manually setting properties to prevent massive re-renders
    if (p <= 0.35) {
      sunPositionRef.current.lerpVectors(new THREE.Vector3(0, -0.1, -1), new THREE.Vector3(0.3, 0.1, -1), p / 0.35);
    } else if (p <= 0.55) {
      const t = (p - 0.35) / 0.20;
      sunPositionRef.current.lerpVectors(new THREE.Vector3(0.3, 0.1, -1), new THREE.Vector3(1, 0.2, -1), t);
    } else {
      sunPositionRef.current.lerpVectors(new THREE.Vector3(1, 0.2, -1), new THREE.Vector3(1, 0.5, -1), (p - 0.55) / 0.45); // Rising further
    }

    let r = 6, t = 8;
    if (p > 0.35 && p <= 0.55) {
      r = 3; t = 6;
    } else if (p > 0.55) {
      r = 2; t = 4;
    }
    rayleighRef.current = r;
    turbidityRef.current = t;

    const newSun = sunPositionRef.current;

    // Check state update threshold
    const currentX = skyUniforms.sunPosition instanceof THREE.Vector3
      ? skyUniforms.sunPosition.x
      : skyUniforms.sunPosition[0];

    if (Math.abs(newSun.x - currentX) > 0.01) {
      setSkyUniforms({
        sunPosition: newSun.clone(),
        rayleigh: rayleighRef.current,
        turbidity: turbidityRef.current
      });
    }

    // 3. Dawn Sun Light intensity lerp (0.55 -> 0.75)
    if (dawnLightRef.current) {
      if (p < 0.55) {
        dawnLightRef.current.intensity = 0;
      } else if (p <= 0.75) {
        dawnLightRef.current.intensity = ((p - 0.55) / 0.20) * 3.0;
      } else {
        dawnLightRef.current.intensity = 3.0;
      }
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={['#1a1a2e', 0.018]} />

      {/* Ambient — base scene fill */}
      <ambientLight color="#b8c4d4" intensity={1.5} />

      {/* Moonlight Wash to Illuminate Ground Options */}
      <directionalLight position={[0, 20, 15]} color="#9ba7d6" intensity={1.2} />

      {/* Moon — shrine night scene */}
      <pointLight position={[10, 20, -5]} color="#c8d8f0" intensity={3.0} distance={100} />

      {/* Torii warmth — orange accent at gate position */}
      <pointLight position={[0, 3, 2]} color="#ff6b35" intensity={1.5} distance={18} />

      {/* Ground rim — lifts the black floor */}
      <pointLight position={[0, -1, 0]} color="#4a2060" intensity={1.0} distance={25} />

      {/* Left lantern glow */}
      <pointLight position={[-2.2, 0.8, 1]} color="#ff8c42" intensity={1.2} distance={5} />

      {/* Right lantern glow */}
      <pointLight position={[2.2, 0.8, 1]} color="#ff8c42" intensity={1.2} distance={5} />

      {/* Sky */}
      <Sky
        sunPosition={skyUniforms.sunPosition}
        rayleigh={skyUniforms.rayleigh}
        turbidity={skyUniforms.turbidity}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
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
      <FieldDecorSystem />

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

      {/* Horizon silhouette people */}
      <HorizonSilhouettes />

      {/* City Blocks Dense Cluster */}
      <group position={[0, -2, -20]}>
        {cityBlocks.map((block, bi) => (
          <group key={block.id} position={[block.x, block.h / 2, block.z]}>
            {/* Building body */}
            <mesh castShadow>
              <boxGeometry args={[block.w, block.h, block.d]} />
              <meshStandardMaterial
                color="#0d0c1a"
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
            {/* Windows — small emissive planes on building face */}
            {windowData[bi].map((win, wi) => {
              const wColor = windowColors[win.lightLevel];
              const wIntensity = windowIntensity[win.lightLevel];
              if (win.lightLevel === 0) return null;
              // Position window on front face (z+ face)
              const wx = -block.w / 2 + 0.5 + (win.col * (block.w / block.cols));
              const wy = -block.h / 2 + 0.7 + (win.row * (block.h / block.rows));
              return (
                <mesh key={wi} position={[wx, wy, block.d / 2 + 0.01]}>
                  <planeGeometry args={[0.35, 0.45]} />
                  <meshBasicMaterial
                    color={wColor}
                    toneMapped={false}
                  />
                </mesh>
              );
            })}
          </group>
        ))}

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
