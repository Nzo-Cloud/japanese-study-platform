'use client';
import Image from 'next/image';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { useMemo } from 'react';

interface Props {
  progress: MotionValue<number>;
}

export default function StaticHero({ progress }: Props) {
  const yText       = useTransform(progress, [0, 1], [0, -120]);
  const opacityHero = useTransform(progress, [0, 0.3], [1, 0]);
  const opacityCity = useTransform(progress, [0.3, 0.5, 0.85, 0.95], [0, 1, 1, 0]);
  const scale       = useTransform(progress, [0, 1], [1, 1.08]);

  const petals = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    left: `${(i * 41) % 100}%`,
    delay: -(i * 0.8),
    duration: 14 + (i % 6) * 3,
    drift: Math.sin(i * 0.8) * 140,
    size: 5 + (i % 5) * 2,
    opacity: 0.35 + (i % 4) * 0.1,
  })), []);

  return (
    <div style={{ position: 'relative', height: '300vh', background: '#080612' }}>

      {/* LAYER 1 — Gemini background image with parallax scale */}
      <motion.div style={{ position: 'fixed', inset: 0, zIndex: 1, scale }}>
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center center' }}
        />
        {/* Readability overlay — top tint + strong bottom fade covers watermark */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to bottom,
              rgba(8,6,18,0.50) 0%,
              rgba(8,6,18,0.08) 20%,
              rgba(8,6,18,0.08) 60%,
              rgba(8,6,18,0.70) 78%,
              rgba(8,6,18,1.00) 100%
            )
          `,
        }} />
      </motion.div>

      {/* LAYER 2 — Hero text + CTA */}
      <motion.div style={{
        position: 'fixed', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        paddingBottom: '12vh',
        y: yText, opacity: opacityHero,
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.4rem)',
            fontWeight: 300,
            letterSpacing: '14px',
            textTransform: 'uppercase',
            color: '#e8ddd0',
            margin: '0 0 4px',
            textShadow: '0 2px 20px rgba(0,0,0,1)',
          }}>Master Japanese</p>

          <div style={{
            fontFamily: 'var(--font-noto-serif-jp)',
            fontSize: 'clamp(4rem, 11vw, 9rem)',
            fontWeight: 400,
            color: '#cca24c',
            lineHeight: 0.95,
            textShadow: '0 8px 40px rgba(0,0,0,0.95), 0 0 60px rgba(201,168,76,0.35)',
            letterSpacing: '-2px',
          }}>日本語</div>

          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(0.85rem, 1.8vw, 1.15rem)',
            fontStyle: 'italic',
            color: '#c8bfb0',
            marginTop: '10px',
            letterSpacing: '3px',
            textShadow: '0 2px 12px rgba(0,0,0,1)',
          }}>Your story starts here.</p>

          {/* CTA Button */}
          <motion.a
            href="/signup"
            whileHover={{
              scale: 1.04,
              boxShadow: '0 0 36px rgba(201,168,76,0.35), 0 0 14px rgba(201,168,76,0.2)',
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'inline-block',
              marginTop: '30px',
              padding: '15px 44px',
              border: '1.5px solid rgba(201,168,76,0.75)',
              borderRadius: '999px',
              color: '#e8d5a3',
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
              fontWeight: 600,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              background: 'rgba(201,168,76,0.09)',
              backdropFilter: 'blur(6px)',
              cursor: 'pointer',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              boxShadow: '0 0 20px rgba(201,168,76,0.12)',
            }}
          >
            Start Learning for Free
          </motion.a>

          {/* Social proof */}
          <p style={{
            marginTop: '14px',
            fontSize: 'clamp(0.68rem, 1.1vw, 0.8rem)',
            color: 'rgba(200,191,176,0.5)',
            letterSpacing: '2px',
            textShadow: '0 1px 8px rgba(0,0,0,0.9)',
          }}>100% Free · 6,000+ Vocabulary · All JLPT Levels</p>
        </div>
      </motion.div>

      {/* LAYER 3 — Animated sakura petals */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 7, pointerEvents: 'none' }}>
        {petals.map((p) => (
          <motion.div key={p.id}
            animate={{
              y: ['-5vh', '108vh'],
              x: [0, p.drift],
              rotate: [0, 320],
              opacity: [0, p.opacity, p.opacity, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: p.delay,
              times: [0, 0.1, 0.85, 1],
            }}
            style={{
              position: 'absolute',
              top: 0, left: p.left,
              width: `${p.size}px`,
              height: `${p.size * 1.3}px`,
              background: 'radial-gradient(ellipse at 40% 35%, #ffd0dd, #d4809a)',
              borderRadius: '50% 0 50% 50%',
              filter: 'blur(0.3px)',
            }}
          />
        ))}
      </div>

      {/* LAYER 4 — City reveal text (scroll-triggered) */}
      <motion.div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        opacity: opacityCity,
        zIndex: 8,
        pointerEvents: 'none',
        width: 'max-content',
      }}>
        <p style={{
          fontSize: 'clamp(2rem, 6vw, 6rem)',
          fontFamily: 'var(--font-cormorant)',
          letterSpacing: '18px',
          textTransform: 'uppercase',
          color: '#c9a84c',
          margin: '0 0 12px',
          textShadow: '0 6px 30px rgba(0,0,0,1)',
        }}>東京</p>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 2.8rem)',
          fontFamily: 'var(--font-cormorant)',
          fontStyle: 'italic',
          color: '#f5efe6',
          whiteSpace: 'nowrap',
          textShadow: '0 4px 20px rgba(0,0,0,1)',
        }}>The city that never sleeps.</p>
      </motion.div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.85; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
