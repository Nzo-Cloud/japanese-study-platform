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
            Master Japanese
          </h1>
          <div style={{ fontFamily: 'var(--font-noto-serif-jp)', fontSize: '15rem', fontWeight: 400, color: '#cca24c', lineHeight: 1.1, textShadow: '0 12px 50px rgba(0,0,0,0.9), 0 0 100px rgba(201,168,76,0.6)' }}>
            日本語
          </div>
          <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '2rem', fontStyle: 'italic', color: '#c8bfb0', margin: '0 0 32px', letterSpacing: '3px', textShadow: '0 2px 12px rgba(0,0,0,1)' }}>
            Your story starts here.
          </p>
          <a href="/signup" style={{ display: 'inline-block', padding: '18px 52px', border: '1.5px solid rgba(201,168,76,0.75)', borderRadius: '999px', color: '#e8d5a3', fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', textDecoration: 'none', background: 'rgba(201,168,76,0.09)', backdropFilter: 'blur(6px)', boxShadow: '0 0 24px rgba(201,168,76,0.15)', textShadow: '0 2px 8px rgba(0,0,0,0.8)', cursor: 'pointer' }}>
            Start Learning for Free
          </a>
          <p style={{ marginTop: '14px', fontSize: '0.8rem', color: 'rgba(200,191,176,0.5)', letterSpacing: '2px', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
            100% Free · 6,000+ Vocabulary · All JLPT Levels
          </p>
        </div>
      </Html>

      {/* PANEL 3 — CITY (progress 0.35 -> 0.55) */}
      <Html position={[0, 5, -45]} center style={{
        opacity: getOpacity(p, 0.35, 0.55),
        transition: 'opacity 0.3s',
        pointerEvents: getOpacity(p, 0.35, 0.55) > 0.5 ? 'auto' : 'none'
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

      {/* PANEL 4 — FUJI (progress 0.55 -> 0.72) */}
      <Html position={[0, 8, -50]} center style={{
        opacity: getOpacity(p, 0.55, 0.72),
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }}>
        <div style={{
          textAlign: 'center',
          fontFamily: 'var(--font-cormorant)',
          color: '#f5efe6',
        }}>
          <p style={{
            fontSize: '7rem',
            letterSpacing: '20px',
            color: '#c9a84c',
            margin: '0 0 16px',
            textShadow: '0 12px 50px rgba(0,0,0,0.9), 0 0 80px rgba(201,168,76,0.4)',
          }}>富士山</p>
          <p style={{
            fontSize: '2.8rem',
            fontStyle: 'italic',
            margin: 0,
            textShadow: '0 4px 24px rgba(0,0,0,1)',
            whiteSpace: 'nowrap',
          }}>The peak of your journey.</p>
        </div>
      </Html>
    </group>
  );
}
