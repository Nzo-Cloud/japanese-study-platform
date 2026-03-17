import React from 'react';

const JapaneseCastle = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[60%] sm:h-[80%] pointer-events-none overflow-hidden z-[-1] opacity-5 sm:opacity-10 select-none will-change-transform">
      <svg
        viewBox="0 0 1000 800"
        className="absolute bottom-[-5%] left-[-10%] w-[120%] h-auto mix-blend-screen"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Base Stone Wall (Ishigaki) */}
        <path d="M100 800 L300 600 H700 L900 800 Z" fill="#2c2c2e" />
        <path d="M150 750 L320 620 H680 L850 750 Z" fill="#1a1a1b" opacity="0.5" />
        
        {/* First Tier */}
        <path d="M280 600 L320 500 H680 L720 600 Z" fill="#444446" stroke="#D4AF37" strokeWidth="1" />
        <path d="M260 510 Q500 450 740 510" stroke="#D4AF37" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.4" /> {/* Roof 1 */}
        <path d="M260 510 L280 530 H720 L740 510 Z" fill="#2c2c2e" />
        
        {/* Second Tier */}
        <path d="M350 500 L380 400 H620 L650 500 Z" fill="#444446" stroke="#D4AF37" strokeWidth="1" />
        <path d="M330 410 Q500 360 670 410" stroke="#D4AF37" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4" /> {/* Roof 2 */}
        <path d="M330 410 L350 430 H650 L670 410 Z" fill="#2c2c2e" />
        
        {/* Third Tier (Top) */}
        <path d="M420 400 L440 320 H560 L580 400 Z" fill="#444446" stroke="#D4AF37" strokeWidth="1" />
        <path d="M400 330 Q500 290 600 330" stroke="#D4AF37" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.4" /> {/* Roof 3 */}
        <path d="M400 330 L420 350 H580 L600 330 Z" fill="#2c2c2e" />
        
        {/* Topmost Gables */}
        <path d="M480 320 L500 280 L520 320 Z" fill="#444446" stroke="#D4AF37" strokeWidth="1" />
        
        {/* Windows / Detail - Glowing as if lit from within */}
        <rect x="475" y="340" width="15" height="15" fill="#D4AF37" opacity="0.3" />
        <rect x="510" y="340" width="15" height="15" fill="#D4AF37" opacity="0.3" />
        
        {/* Shachihoko (Golden orcas on roof) */}
        <circle cx="400" cy="330" r="3" fill="#D4AF37" />
        <circle cx="600" cy="330" r="3" fill="#D4AF37" />
      </svg>
    </div>
  );
};

export default JapaneseCastle;
