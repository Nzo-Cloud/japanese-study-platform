'use client';

import { Html } from '@react-three/drei';
import { MotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  progress: MotionValue<number>;
}

export default function ContentOverlays({ progress }: Props) {
  const [p, setP] = useState(0);

  useEffect(() => {
    return progress.on('change', (v) => setP(v));
  }, [progress]);

  // Triangular opacity envelope
  const getOpacity = (current: number, start: number, end: number, fadeIn = true) => {
    if (current < start || current > end) return 0;
    const peakStart = fadeIn ? start + (end - start) * 0.2 : start;
    const peakEnd = start + (end - start) * 0.8;

    if (current < peakStart) {
      return (current - start) / (peakStart - start);
    } else if (current > peakEnd) {
      return 1 - (current - peakEnd) / (end - peakEnd);
    }
    return 1;
  };

  return (
    <group>
      {/* PANEL 1A — HERO (progress 0 -> 0.12) */}
      <Html position={[0, 2, 15]} center style={{ opacity: getOpacity(p, 0, 0.12, false), transition: 'opacity 0.2s', pointerEvents: getOpacity(p, 0, 0.12, false) > 0.5 ? 'auto' : 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '1200px' }}>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2.5rem', fontWeight: 300, letterSpacing: '16px', textTransform: 'uppercase', margin: '0 0 -10px 0', color: '#f5efe6', textShadow: '0 4px 20px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.8)' }}>
            Japan is waiting
          </h1>
          <div style={{ fontFamily: 'var(--font-noto-serif-jp)', fontSize: '15rem', fontWeight: 400, color: '#cca24c', lineHeight: 1.1, textShadow: '0 12px 50px rgba(0,0,0,0.9), 0 0 100px rgba(201,168,76,0.6)' }}>
            日本語
          </div>
        </div>
      </Html>

      {/* PANEL 1B — STORY (progress 0.08 -> 0.26) */}
      <Html position={[0, 3, 6]} center style={{ opacity: getOpacity(p, 0.08, 0.26), transition: 'opacity 0.2s', pointerEvents: getOpacity(p, 0.08, 0.26) > 0.5 ? 'auto' : 'none' }}>
        <div style={{ background: 'transparent', border: 'none', backdropFilter: 'none', width: '800px', textAlign: 'center', fontFamily: 'var(--font-cormorant)' }}>
          <p style={{ fontSize: '4.5rem', fontStyle: 'italic', margin: 0, color: '#f5efe6', textShadow: '0 4px 24px rgba(0,0,0,1), 0 0 60px rgba(0,0,0,0.9), 0 0 100px rgba(0,0,0,0.9)' }}>Your story starts here.</p>
        </div>
      </Html>

      {/* PANEL 3 — CITY (progress 0.45 -> 0.85) */}
      <Html position={[0, 5, -45]} center style={{
        opacity: getOpacity(p, 0.45, 0.85),
        transition: 'opacity 0.3s',
        pointerEvents: getOpacity(p, 0.45, 0.85) > 0.5 ? 'auto' : 'none'
      }}>
        <div style={{
          textAlign: 'center',
          fontFamily: 'var(--font-cormorant)',
          color: '#f5efe6',
        }}>
          <p style={{
            fontSize: '8rem',
            letterSpacing: '24px',
            textTransform: 'uppercase',
            color: '#c9a84c',
            margin: '0 0 20px',
            textShadow: '0 12px 50px rgba(0,0,0,0.9)',
          }}>東京</p>
          <p style={{
            fontSize: '3.8rem',
            fontStyle: 'italic',
            margin: 0,
            whiteSpace: 'nowrap',
            textShadow: '0 4px 24px rgba(0,0,0,1), 0 0 60px rgba(0,0,0,0.9)',
            maxWidth: '1200px',
            lineHeight: 1.1,
          }}>The city that never sleeps.</p>
        </div>
      </Html>

      {/* PANEL 4 — FUJI (progress 0.85 -> 1.0) */}
      <Html position={[0, 8, -50]} center style={{
        opacity: getOpacity(p, 0.85, 1.0),
        transition: 'opacity 0.3s',
        pointerEvents: getOpacity(p, 0.85, 1.0) > 0.5 ? 'auto' : 'none'
      }}>
        <div style={{
          textAlign: 'center',
          fontFamily: 'var(--font-cormorant)',
          color: '#f5efe6',
        }}>
          {/* Text and button removed to favor clean scene transition */}
        </div>
      </Html>
    </group>
  );
}
