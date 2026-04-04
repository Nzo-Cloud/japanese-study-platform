'use client';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { useMemo } from 'react';

interface Props {
  progress: MotionValue<number>;
}

export default function StaticHero({ progress }: Props) {
  const y1 = useTransform(progress, [0, 1], [0, -60]);
  const y2 = useTransform(progress, [0, 1], [0, -120]);
  const y3 = useTransform(progress, [0, 1], [0, -200]);
  const y4 = useTransform(progress, [0, 1], [0, -300]);
  const opacityHero = useTransform(progress, [0, 0.3], [1, 0]);
  const opacityCity = useTransform(progress, [0.3, 0.5, 0.85, 0.95], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0, 1], [1, 1.08]);

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
    <div style={{
      position: 'relative',
      height: '300vh',
      background: '#080612',
    }}>

      {/* LAYER 1 — Deep night sky */}
      <motion.div style={{
        position: 'fixed', inset: 0, zIndex: 1,
        scale,
        background: `
          radial-gradient(ellipse 120% 60% at 50% -10%, #1a0e3a 0%, transparent 70%),
          radial-gradient(ellipse 80% 40% at 80% 20%, #0e1a3a 0%, transparent 60%),
          linear-gradient(180deg, #0a0618 0%, #080412 100%)
        `,
      }}>
        {/* Moon */}
        <div style={{
          position: 'absolute', top: '10%', right: '12%',
          width: '72px', height: '72px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 38%, #fffde0, #f5d87a)',
          boxShadow: `
            0 0 0 1px rgba(255,240,150,0.1),
            0 0 30px 15px rgba(240,208,80,0.12),
            0 0 80px 40px rgba(240,208,80,0.06)
          `,
        }} />
        {/* Stars */}
        {Array.from({ length: 90 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${(i * 11 + 3) % 70}%`,
            left: `${(i * 19 + 7) % 100}%`,
            width: i % 7 === 0 ? '2.5px' : '1.5px',
            height: i % 7 === 0 ? '2.5px' : '1.5px',
            borderRadius: '50%',
            background: i % 4 === 0 ? '#c8d8f8' : '#ffffff',
            opacity: 0.2 + (i % 5) * 0.12,
            animation: `twinkle ${2.5 + (i % 4) * 0.8}s ease-in-out infinite`,
            animationDelay: `${(i * 0.4) % 4}s`,
          }} />
        ))}
      </motion.div>

      {/* LAYER 2 — Far mountain silhouettes */}
      <motion.div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '45vh', zIndex: 2, y: y1,
        background: `
          radial-gradient(ellipse 30% 80% at 20% 100%, #0f0d20 30%, transparent 70%),
          radial-gradient(ellipse 25% 70% at 50% 100%, #120f25 30%, transparent 70%),
          radial-gradient(ellipse 30% 80% at 80% 100%, #0f0d20 30%, transparent 70%)
        `,
      }}>
        <svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice"
          style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <path d="M0 300 L0 200 L100 130 L200 180 L340 90 L480 160 
                   L580 70 L700 140 L820 60 L940 130 L1060 80 
                   L1180 150 L1300 100 L1440 160 L1440 300 Z"
            fill="#0d0b1e" />
          <path d="M0 300 L0 240 L150 180 L300 220 L480 160 
                   L640 200 L800 150 L960 190 L1120 160 
                   L1280 195 L1440 170 L1440 300 Z"
            fill="#110f26" />
        </svg>
      </motion.div>

      {/* LAYER 3 — Mid ground mist */}
      <motion.div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '30vh', zIndex: 3, y: y2,
        background: `linear-gradient(
          to top,
          rgba(20,15,45,0.95) 0%,
          rgba(20,15,45,0.6) 40%,
          transparent 100%
        )`,
      }} />

      {/* LAYER 4 — Sakura tree silhouettes left and right */}
      <motion.div style={{
        position: 'fixed', inset: 0, zIndex: 4,
        y: y3, opacity: opacityHero,
        pointerEvents: 'none',
      }}>
        {/* Left tree cluster */}
        <div style={{
          position: 'absolute', left: '-2%', bottom: '15%',
          width: '28vw', height: '55vh',
          background: 'radial-gradient(ellipse 80% 100% at 60% 80%, #2d1428 80%, transparent 100%)',
          borderRadius: '50% 50% 30% 30%',
          boxShadow: 'inset -20px -10px 40px rgba(180,100,140,0.08)',
        }} />
        <div style={{
          position: 'absolute', left: '4%', bottom: '22%',
          width: '20vw', height: '42vh',
          background: 'radial-gradient(ellipse at 40% 70%, #3a1a35 70%, transparent 100%)',
          borderRadius: '50% 40% 30% 40%',
        }} />
        {/* Right tree cluster */}
        <div style={{
          position: 'absolute', right: '-2%', bottom: '15%',
          width: '28vw', height: '55vh',
          background: 'radial-gradient(ellipse 80% 100% at 40% 80%, #2d1428 80%, transparent 100%)',
          borderRadius: '50% 50% 30% 30%',
          boxShadow: 'inset 20px -10px 40px rgba(180,100,140,0.08)',
        }} />
        <div style={{
          position: 'absolute', right: '4%', bottom: '22%',
          width: '20vw', height: '42vh',
          background: 'radial-gradient(ellipse at 60% 70%, #3a1a35 70%, transparent 100%)',
          borderRadius: '40% 50% 40% 30%',
        }} />
      </motion.div>

      {/* LAYER 5 — Torii gate + hero text */}
      <motion.div style={{
        position: 'fixed', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '0px',
        y: y4, opacity: opacityHero,
      }}>
        {/* Gate */}
        <div style={{ position: 'relative', marginBottom: '0px' }}>
          {/* Top curved beam */}
          <div style={{
            width: '260px', height: '22px',
            background: 'linear-gradient(180deg, #d42040 0%, #a01828 100%)',
            borderRadius: '50% 50% 0 0 / 80% 80% 0 0',
            transform: 'scaleX(1.15)',
            boxShadow: '0 4px 20px rgba(180,20,40,0.5)',
            marginBottom: '3px',
          }} />
          {/* Second beam */}
          <div style={{
            width: '230px', height: '14px',
            background: 'linear-gradient(180deg, #c41e3a 0%, #8b1429 100%)',
            borderRadius: '2px',
            margin: '0 auto 4px',
            boxShadow: '0 2px 12px rgba(180,20,40,0.4)',
          }} />
          {/* Gold tablet */}
          <div style={{
            width: '60px', height: '32px',
            background: 'linear-gradient(135deg, #d4a832, #c9a84c, #a8882a)',
            borderRadius: '4px',
            margin: '-4px auto 0',
            boxShadow: '0 0 16px rgba(201,168,76,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-noto-serif-jp)',
            fontSize: '18px', color: '#0a0815', fontWeight: 700,
          }}>神</div>
          {/* Pillars */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            width: '220px', margin: '0 auto',
          }}>
            {[0,1].map(i => (
              <div key={i} style={{
                width: '18px', height: '180px',
                background: 'linear-gradient(180deg, #c41e3a 0%, #8b1429 100%)',
                borderRadius: '2px 2px 0 0',
                boxShadow: `${i===0?'-':''}4px 0 16px rgba(180,20,40,0.3)`,
              }} />
            ))}
          </div>
          {/* Lantern bases */}
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            width: '240px', margin: '-4px auto 0',
          }}>
            {[0,1].map(i => (
              <div key={i} style={{
                width: '28px', height: '18px',
                background: '#5a4a3a',
                borderRadius: '3px',
                boxShadow: `0 0 12px rgba(255,140,50,0.4)`,
              }} />
            ))}
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <p style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.4rem)',
            fontWeight: 300,
            letterSpacing: '14px',
            textTransform: 'uppercase',
            color: '#e8ddd0',
            margin: '0 0 4px',
            textShadow: '0 2px 20px rgba(0,0,0,1)',
          }}>Japan is waiting</p>
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
        </div>
      </motion.div>

      {/* LAYER 6 — Sakura petals */}
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

      {/* LAYER 7 — City reveal text */}
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

      {/* CSS animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.85; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
