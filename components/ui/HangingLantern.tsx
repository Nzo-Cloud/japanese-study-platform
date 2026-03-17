import React from 'react';

const HangingLantern = ({ className = "", style = {} }: { className?: string, style?: React.CSSProperties }) => {
  return (
    <div className={`absolute top-0 w-24 h-32 pointer-events-none z-10 animate-lantern ${className}`} style={style}>
      <svg
        viewBox="0 0 100 150"
        className="w-full h-full drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cord */}
        <line x1="50" y1="0" x2="50" y2="20" stroke="#3A3A3C" strokeWidth="2" />
        
        {/* Lantern Top */}
        <path d="M20 20 H80 L85 30 H15 L20 20 Z" fill="#2C2C2E" stroke="#D4AF37" strokeWidth="1" />
        
        {/* Lantern Body */}
        <rect x="15" y="30" width="70" height="90" rx="10" fill="#D4AF37" opacity="0.2" stroke="#D4AF37" strokeWidth="2" />
        
        {/* Inner Glow / Light Source */}
        <rect x="30" y="45" width="40" height="60" rx="5" fill="#D4AF37" opacity="0.4">
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
        </rect>
        
        {/* Japanese Character (Light) */}
        <text x="50" y="75" textAnchor="middle" fill="#D4AF37" fontSize="24" className="font-jp" opacity="0.8">灯</text>
        
        {/* Lantern Bottom */}
        <path d="M20 120 H80 L85 130 H15 L20 120 Z" fill="#2C2C2E" stroke="#D4AF37" strokeWidth="1" />
        
        {/* Tassels */}
        <line x1="50" y1="130" x2="50" y2="150" stroke="#D4AF37" strokeWidth="1" opacity="0.6" />
      </svg>
    </div>
  );
};

export default HangingLantern;
