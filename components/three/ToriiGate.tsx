'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export default function ToriiGate() {
  const redMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#c41e3a',
    roughness: 0.6,
    metalness: 0.0,
    emissive: new THREE.Color('#3d0010'),
    emissiveIntensity: 0.3
  }), []);

  const darkRedMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#901020', // slightly darker for the top
    roughness: 0.6,
    metalness: 0.0,
    emissive: new THREE.Color('#3d0010'),
    emissiveIntensity: 0.3
  }), []);

  const stoneBaseMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#8a7a6a',
    roughness: 0.95,
    metalness: 0.0
  }), []);

  // CatmullRomCurve3 for the shimenawa rope sagging
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.8, 8.5, 0),
      new THREE.Vector3(0, 8, 0),
      new THREE.Vector3(2.8, 8.5, 0)
    ]);
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Light for lantern-like glow localized near the gate is handled by the global pointLight we put in JourneyScene. */}
      
      {/* Left pillar */}
      <mesh position={[-3, 5, 0]} material={redMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.5, 10, 8]} />
      </mesh>

      {/* Right pillar */}
      <mesh position={[3, 5, 0]} material={redMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.5, 10, 8]} />
      </mesh>

      {/* Left pillar base (kamebara) */}
      <mesh position={[-3, 0.3, 0]} material={redMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.6, 8]} />
      </mesh>

      {/* Right pillar base (kamebara) */}
      <mesh position={[3, 0.3, 0]} material={redMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.6, 8]} />
      </mesh>

      {/* Lower crossbeam (nuki) */}
      <mesh position={[0, 8, 0]} material={redMaterial} castShadow receiveShadow>
        <boxGeometry args={[7.5, 0.5, 0.6]} />
      </mesh>

      {/* Upper crossbeam (kasagi) */}
      <mesh position={[0, 9.5, 0]} material={darkRedMaterial} castShadow receiveShadow>
        <boxGeometry args={[9, 0.7, 0.8]} />
      </mesh>

      {/* Kasagi end caps (upturned tips) */}
      <mesh position={[-4.2, 9.7, 0]} rotation={[0, 0, 0.15]} material={darkRedMaterial} castShadow receiveShadow>
        <boxGeometry args={[1, 0.7, 0.8]} />
      </mesh>
      <mesh position={[4.2, 9.7, 0]} rotation={[0, 0, -0.15]} material={darkRedMaterial} castShadow receiveShadow>
        <boxGeometry args={[1, 0.7, 0.8]} />
      </mesh>

      {/* Center vertical beam (gakuzuka) */}
      <mesh position={[0, 8.8, 0]} material={redMaterial} castShadow receiveShadow>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
      </mesh>

      {/* Shimenawa rope */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <tubeGeometry args={[curve, 20, 0.15, 8, false]} />
        <meshStandardMaterial color="#c9a84c" roughness={0.8} />
      </mesh>

      {/* Left stone base lantern (tan box) replaced to look like an ishidoro/box */}
      <mesh position={[-3, -0.2, 0]} material={stoneBaseMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 1.2]} />
      </mesh>
      <pointLight position={[-3, 0.8, 0]} color="#ff8c42" intensity={0.8} distance={4} />
      <mesh position={[-3, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#ffaa44" transparent opacity={0.7} />
      </mesh>

      {/* Right stone base lantern */}
      <mesh position={[3, -0.2, 0]} material={stoneBaseMaterial} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 1.2]} />
      </mesh>
      <pointLight position={[3, 0.8, 0]} color="#ff8c42" intensity={0.8} distance={4} />
      <mesh position={[3, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#ffaa44" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
