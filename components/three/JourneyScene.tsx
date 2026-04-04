'use client';

import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useScroll, useSpring } from 'framer-motion';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import CameraRig from './CameraRig';
import ToriiGate from './ToriiGate';
import Environment from './Environment';
import Particles from './Particles';
import ContentOverlays from './ContentOverlays';

// Fallback logic for when WebGL is not available/loading screen
function LoadingScreen() {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0815', color: '#c9a84c', fontSize: '10rem', fontFamily: "'Noto Serif JP', serif",
      animation: 'neonPulse 2s infinite'
    }}>
      日
    </div>
  );
}

export default function JourneyScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80, damping: 25
  });

  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  // Very basic WebGL check
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0815', color: '#f5efe6' }}>
        <h2>Your browser or device does not support WebGL, which is required for this 3D experience.</h2>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: '900vh', background: '#0a0815' }}>
      <div style={{
        position: 'sticky', top: 0,
        height: '100vh', overflow: 'hidden'
      }}>

        {/* React Three Fiber Canvas */}
        <Canvas
          camera={{ position: [0, 2, 20], fov: 60 }}
          style={{ position: 'absolute', inset: 0 }}
          shadows
          gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
          dpr={[1, 1.5]}
          frameloop="always" // Can change to "demand" later if performance is heavily constrained and no ongoing animations exist
        >
          <Suspense fallback={<Html center><LoadingScreen /></Html>}>
            {/* Ambient — soft, color-matched to sky */}
            <ambientLight color="#5a4a60" intensity={0.2} />

            {/* Moon — for shrine night scene */}
            <pointLight position={[10, 20, -5]} color="#c8d8f0" intensity={2.5} distance={80} />

            {/* Torii warm accent — make the gate glow with shrine lantern warmth */}
            <pointLight position={[0, 3, 2]} color="#ff6b35" intensity={1.2} distance={15} />

            {/* Ground rim light — lifts the black floor */}
            <pointLight position={[0, -1, 0]} color="#4a2060" intensity={0.8} distance={20} />

            {/* Scene Elements */}
            <CameraRig progress={smoothProgress} />
            <Environment progress={smoothProgress} />
            <ToriiGate />
            <Particles progress={smoothProgress} />
            <ContentOverlays progress={smoothProgress} />

            <EffectComposer>
              <Bloom
                intensity={0.3}
                luminanceThreshold={0.75}
                luminanceSmoothing={0.9}
                mipmapBlur={true}
                radius={0.4}
              />
            </EffectComposer>
          </Suspense>
        </Canvas>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 20,
          pointerEvents: 'none',
          opacity: 0.5,
        }}>
          <div style={{
            width: '1px',
            height: '48px',
            background: 'linear-gradient(to bottom, transparent, #c9a84c)',
            animation: 'pulse 2s infinite',
          }} />
        </div>

        {/* Fade out to page below */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to bottom, transparent, #0a0815)',
          pointerEvents: 'none',
          zIndex: 10,
        }} />
      </div>
    </div>
  );
}
