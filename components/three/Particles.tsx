'use client';

import { useFrame } from '@react-three/fiber';
import { MotionValue } from 'framer-motion';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface Props {
  progress: MotionValue<number>;
}

export default function Particles({ progress }: Props) {
  const petalsRef = useRef<THREE.Points>(null);
  const petalsCount = 600;

  // Generate circular glow texture
  const dotTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const [petalsPositions] = useMemo(() => {
    const pos = new Float32Array(petalsCount * 3);
    for (let i = 0; i < petalsCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = 10 + Math.random() * 20;    // start high
      pos[i * 3 + 2] = -10 - Math.random() * 30;   // distributed in forest
    }
    return [pos];
  }, []);

  useFrame((state) => {
    const p = progress.get();
    const time = state.clock.elapsedTime;

    // --- Petals ---
    if (petalsRef.current) {
      const positions = petalsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < petalsCount; i++) {
        positions[i * 3 + 0] += Math.sin(time * 0.3 + i) * 0.01;
        positions[i * 3 + 1] -= 0.008;
        positions[i * 3 + 2] += Math.cos(time * 0.2 + i) * 0.005;

        // Reset if too low
        if (positions[i * 3 + 1] < -2) {
          positions[i * 3 + 1] = 10 + Math.random() * 10;
          positions[i * 3 + 0] = (Math.random() - 0.5) * 40;
        }
      }
      petalsRef.current.geometry.attributes.position.needsUpdate = true;

      const mat = petalsRef.current.material as THREE.PointsMaterial;
      if (p >= 0.35 && p <= 0.65) {
        if (p < 0.5) {
          mat.opacity = (p - 0.35) / 0.15; // fades in
        } else {
          mat.opacity = 1 - ((p - 0.5) / 0.15); // fades out
        }
      } else {
        mat.opacity = 0;
      }
    }
  });

  return (
    <group>
      {/* Sakura Petals */}
      <points ref={petalsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[petalsPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial 
          transparent 
          color="#ffb7c5" 
          size={0.12} 
          sizeAttenuation={true} 
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
          map={dotTexture}
          alphaTest={0.01}
        />
      </points>
    </group>
  );
}
