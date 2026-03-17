'use client';

import React, { useEffect, useState, useRef } from 'react';

interface PetalState {
  id: number;
  left: number; // percentage
  top: number;  // viewport height percentage
  duration: number;
  delay: number;
  size: number;
  opacity: number;
  rotation: number;
}

const SakuraPetals = () => {
  const [petals, setPetals] = useState<PetalState[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const petalRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Initialize petals
    const newPetals = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: -10 - (Math.random() * 100), // Start above screen
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 15,
      size: 10 + Math.random() * 15,
      opacity: 0.3 + Math.random() * 0.5,
      rotation: Math.random() * 360,
    }));
    setPetals(newPetals);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;

      petalRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const petal = newPetals[i];
        
        // Calculate vertical progress (0 to 1) based on time, duration, and delay
        let progress = ((elapsed + petal.delay) % petal.duration) / petal.duration;
        let y = progress * 120 - 10; // -10% to 110%
        let x = petal.left + Math.sin(progress * 5) * 5; // Adding a wavy motion
        
        // Convert percentage to pixels
        const vx = (x / 100) * window.innerWidth;
        const vy = (y / 100) * window.innerHeight;
        
        // Mouse repulsion logic
        const dx = vx - mouseRef.current.x;
        const dy = vy - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 150;
        
        let offsetX = 0;
        let offsetY = 0;
        
        if (distance < repulsionRadius) {
          const force = (repulsionRadius - distance) / repulsionRadius;
          const angle = Math.atan2(dy, dx);
          offsetX = Math.cos(angle) * force * 50;
          offsetY = Math.sin(angle) * force * 50;
        }

        const rotation = (petal.rotation + progress * 360) % 360;
        
        ref.style.transform = `translate(${vx + offsetX}px, ${vy + offsetY}px) rotate(${rotation}px)`;
        // Using translate3d for GPU acceleration
        ref.style.transform = `translate3d(${vx + offsetX}px, ${vy + offsetY}px, 0) rotate(${rotation}deg)`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {petals.map((petal, i) => (
        <div
          key={petal.id}
          ref={(el) => { petalRefs.current[i] = el; }}
          className="absolute text-white/40 will-change-transform"
          style={{
            fontSize: `${petal.size}px`,
            opacity: petal.opacity * 0.5,
            left: 0,
            top: 0,
          }}
        >
          🌸
        </div>
      ))}
    </div>
  );
};

export default SakuraPetals;
