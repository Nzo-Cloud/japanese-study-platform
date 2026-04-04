'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  is3D: boolean;
  onToggle: (val: boolean) => void;
}

export default function HeroToggle({ is3D, onToggle }: Props) {
  const [isHighPerf, setIsHighPerf] = useState(false);

  useEffect(() => {
    // Simple hardware detection: 8+ cores or 8G+ RAM is usually safe for Smooth WebGL
    const cores = navigator.hardwareConcurrency || 4;
    // @ts-ignore (deviceMemory is not in standard types but works on Chrome)
    const memory = navigator.deviceMemory || 4;
    if (cores >= 8 || memory >= 8) {
      setIsHighPerf(true);
    }
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '12px'
    }}>
      {isHighPerf && !is3D && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(201, 168, 76, 0.15)',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            padding: '8px 16px',
            borderRadius: '12px',
            color: '#c9a84c',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-noto-serif-jp)',
            letterSpacing: '0.05em',
            backdropFilter: 'blur(10px)',
          }}
        >
          Recommended for your device
        </motion.div>
      )}

      <button
        onClick={() => onToggle(!is3D)}
        style={{
          background: is3D ? 'rgba(201, 168, 76, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${is3D ? '#c9a84c' : 'rgba(255, 255, 255, 0.1)'}`,
          borderRadius: '99px',
          padding: '6px',
          display: 'flex',
          gap: '4px',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(12px)',
          boxShadow: is3D ? '0 0 20px rgba(201, 168, 76, 0.15)' : 'none',
        }}
      >
        <div style={{
          padding: '8px 16px',
          borderRadius: '99px',
          background: !is3D ? '#c9a84c' : 'transparent',
          color: !is3D ? '#0a0815' : '#a89880',
          fontSize: '0.8rem',
          fontWeight: 600,
          transition: 'all 0.3s',
        }}>
          Static
        </div>
        <div style={{
          padding: '8px 16px',
          borderRadius: '99px',
          background: is3D ? '#c9a84c' : 'transparent',
          color: is3D ? '#0a0815' : '#a89880',
          fontSize: '0.8rem',
          fontWeight: 600,
          transition: 'all 0.3s',
        }}>
          3D Interactive
        </div>
      </button>
    </div>
  );
}
