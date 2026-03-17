import React from 'react';

const SakuraGrove = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Grove (smaller, darker, blurred) */}
      <div className="absolute top-[10%] right-[10%] opacity-10 scale-75 blur-[4px] brightness-[0.2] will-change-transform">
        <TreeSVG />
      </div>
      <div className="absolute top-[20%] right-[40%] opacity-5 scale-50 blur-[6px] brightness-[0.1] will-change-transform">
        <TreeSVG />
      </div>
      
      {/* Midground Tree */}
      <div className="absolute top-[5%] right-[-5%] opacity-20 scale-110 brightness-[0.4] will-change-transform">
        <TreeSVG />
      </div>
      
      {/* Main Foreground Tree */}
      <div className="absolute top-0 right-[-150px] sm:right-[-100px] opacity-25 sm:opacity-35 scale-125 brightness-[0.6] will-change-transform">
        <TreeSVG />
      </div>
    </div>
  );
};

const TreeSVG = () => (
  <svg
    viewBox="0 0 500 500"
    className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px]"
    preserveAspectRatio="xMidYMid slice"
  >
    {/* Trunk */}
    <path
      d="M400 500 Q410 400 380 300 T350 150"
      stroke="#1a1a1b"
      strokeWidth="15"
      fill="none"
      strokeLinecap="round"
    />
    {/* Branches */}
    <path
      d="M380 300 Q320 280 280 250"
      stroke="#1a1a1b"
      strokeWidth="8"
      fill="none"
      strokeLinecap="round"
    />
    
    {/* Flower clusters - Dimmed for signature contrast */}
    <circle cx="280" cy="250" r="40" fill="#E6E6E6" opacity="0.3" className="animate-sway" />
    <circle cx="470" cy="150" r="45" fill="#E6E6E6" opacity="0.2" className="animate-sway" style={{ animationDelay: '1.5s' }} />
    <circle cx="250" cy="120" r="50" fill="#E6E6E6" opacity="0.3" className="animate-sway" style={{ animationDelay: '2s' }} />
    <circle cx="350" cy="150" r="60" fill="#E6E6E6" opacity="0.2" className="animate-sway" style={{ animationDelay: '1.2s' }} />
  </svg>
);

export default SakuraGrove;
