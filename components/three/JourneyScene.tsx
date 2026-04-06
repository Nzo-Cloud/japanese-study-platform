'use client';

import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useScroll, useSpring, useTransform, motion } from 'framer-motion';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import CameraRig from './CameraRig';
import ToriiGate from './ToriiGate';
import Environment from './Environment';
import Particles from './Particles';
import ContentOverlays from './ContentOverlays';

const CHAPTERS = ['01 · SHRINE', '02 · THE PATH', '03 · BEYOND'];

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

  const exitFade       = useTransform(smoothProgress, [0.78, 0.88], [0, 1]);
  const ctaOpacity     = useTransform(smoothProgress, [0.72, 0.77], [0, 1]);
  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.06], [1, 0]);
  const chapterOpacity = useTransform(smoothProgress, [0.69, 0.75], [1, 0]);

  const [ctaActive, setCtaActive] = useState(false);
  const [chapterIdx, setChapterIdx] = useState(0);

  useEffect(() => {
    return ctaOpacity.on('change', (v) => setCtaActive(v > 0.1));
  }, [ctaOpacity]);

  useEffect(() => {
    return smoothProgress.on('change', (v) => {
      if (v < 0.35) setChapterIdx(0);
      else if (v < 0.69) setChapterIdx(1);
      else setChapterIdx(2);
    });
  }, [smoothProgress]);

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
    <div ref={containerRef} style={{ height: '600vh', background: '#0a0815' }}>
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
            {/* Ambient — soft warm fill, Ghibli night */}
            <ambientLight color="#f0e6d2" intensity={0.55} />

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

        {/* Animated scroll hint */}
        <motion.div style={{
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
          opacity: scrollHintOpacity,
        }}>
          <div style={{ position: 'relative', width: '1px', height: '56px', background: 'rgba(201,168,76,0.25)' }}>
            <motion.div
              animate={{ y: [0, 56] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '14px', background: '#c9a84c' }}
            />
          </div>
        </motion.div>

        {/* Chapter indicator — bottom left */}
        <motion.div style={{
          position: 'absolute',
          bottom: '36px',
          left: '36px',
          zIndex: 20,
          pointerEvents: 'none',
          opacity: chapterOpacity,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
            {CHAPTERS.map((label, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <motion.div style={{
                  width: i === chapterIdx ? 20 : 6,
                  height: '2px',
                  background: i === chapterIdx ? '#c9a84c' : 'rgba(201,168,76,0.35)',
                  transition: 'all 0.5s ease',
                }} />
                <span style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '0.72rem',
                  letterSpacing: '3px',
                  color: i === chapterIdx ? '#c9a84c' : 'rgba(201,168,76,0.4)',
                  transition: 'color 0.5s ease',
                  textTransform: 'uppercase',
                }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA overlay */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 12, opacity: ctaOpacity,
          pointerEvents: ctaActive ? 'auto' : 'none',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(1rem, 2vw, 1.4rem)',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            color: 'rgba(245,239,230,0.7)',
            margin: '0 0 12px',
          }}>Your journey awaits</p>
          <div style={{
            fontFamily: 'var(--font-noto-serif-jp)',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            color: '#c9a84c',
            lineHeight: 1,
            textShadow: '0 0 60px rgba(201,168,76,0.5)',
            marginBottom: '32px',
          }}>始めよう</div>
          <a href="/signup" style={{
            display: 'inline-block',
            padding: '16px 48px',
            border: '1.5px solid rgba(201,168,76,0.75)',
            borderRadius: '999px',
            color: '#e8d5a3',
            fontFamily: 'var(--font-cormorant)',
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            background: 'rgba(201,168,76,0.09)',
            backdropFilter: 'blur(6px)',
            cursor: 'pointer',
          }}>Start Learning for Free</a>
        </motion.div>

        {/* Exit fade to black */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: '#000',
          zIndex: 15,
          opacity: exitFade,
          pointerEvents: 'none',
        }} />

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
