import React from 'react';

interface StadiumBackgroundProps {
  illuminationLevel?: 'dark' | 'dim' | 'bright' | 'celebration';
  showParticles?: boolean;
}

export const StadiumBackground: React.FC<StadiumBackgroundProps> = ({
  illuminationLevel = 'dim',
  showParticles = true,
}) => {
  // Illumination opacity settings
  const lightOpacity =
    illuminationLevel === 'dark'
      ? 'opacity-20'
      : illuminationLevel === 'dim'
      ? 'opacity-50'
      : illuminationLevel === 'bright'
      ? 'opacity-85'
      : 'opacity-100';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-black">
      {/* Deep sky night gradient: Black to Deep Midnight Blue */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#020817] to-[#00040d]" />

      {/* Floodlight Beams - Left Top (Cyan/Sky) */}
      <div
        className={`absolute -top-16 -left-16 w-[520px] h-[780px] transition-opacity duration-1000 ${lightOpacity}`}
        style={{
          background: 'radial-gradient(circle at 10% 10%, rgba(200, 240, 255, 0.4) 0%, rgba(56, 189, 248, 0.22) 30%, transparent 70%)',
          transform: 'rotate(25deg)',
          filter: 'blur(32px)',
        }}
      />
      {/* Floodlight Beams - Right Top (Electric Blue/Royal) */}
      <div
        className={`absolute -top-16 -right-16 w-[520px] h-[780px] transition-opacity duration-1000 ${lightOpacity}`}
        style={{
          background: 'radial-gradient(circle at 90% 10%, rgba(147, 197, 253, 0.4) 0%, rgba(37, 99, 235, 0.25) 35%, transparent 70%)',
          transform: 'rotate(-25deg)',
          filter: 'blur(32px)',
        }}
      />

      {/* Stadium Floodlight Towers Structure Graphic */}
      <div className="absolute top-4 left-6 md:left-14 flex flex-col items-center opacity-50">
        <div className="grid grid-cols-4 gap-1 p-1 bg-black/90 rounded border border-cyan-400/40 shadow-[0_0_18px_rgba(56,189,248,0.6)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
        <div className="w-0.5 h-16 bg-gradient-to-b from-blue-600 to-transparent" />
      </div>

      <div className="absolute top-4 right-6 md:right-14 flex flex-col items-center opacity-50">
        <div className="grid grid-cols-4 gap-1 p-1 bg-black/90 rounded border border-blue-400/40 shadow-[0_0_18px_rgba(37,99,235,0.6)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
        <div className="w-0.5 h-16 bg-gradient-to-b from-blue-600 to-transparent" />
      </div>

      {/* Distant Stadium Stands Silhouette */}
      <div className="absolute bottom-0 inset-x-0 h-72 opacity-30">
        <svg
          viewBox="0 0 1200 400"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Tiered stands */}
          <path
            d="M0 400 L0 260 Q300 210 600 200 Q900 210 1200 260 L1200 400 Z"
            fill="#030b1c"
          />
          <path
            d="M0 400 L0 300 Q300 250 600 245 Q900 250 1200 300 L1200 400 Z"
            fill="#05132d"
          />
          {/* Subtle crowd phone flashlights in stands */}
          {Array.from({ length: 36 }).map((_, idx) => (
            <circle
              key={idx}
              cx={30 + (idx * 32) + (Math.sin(idx) * 12)}
              cy={240 + (Math.cos(idx * 2) * 25)}
              r={1.2}
              fill={idx % 2 === 0 ? '#38bdf8' : '#93c5fd'}
              opacity={0.35 + (Math.sin(idx * 4) * 0.4)}
            />
          ))}
          {/* Cricket Pitch Ground Glow */}
          <ellipse cx="600" cy="380" rx="420" ry="60" fill="#032047" opacity="0.45" />
          {/* Cricket Pitch Strip */}
          <path d="M570 340 L630 340 L645 400 L555 400 Z" fill="#0f172a" opacity="0.5" />
          {/* Bowling crease hint */}
          <line x1="565" y1="365" x2="635" y2="365" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
        </svg>
      </div>

      {/* Atmospheric Fog / Vignette */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, transparent 35%, rgba(0, 0, 0, 0.85) 90%)'
      }} />

      {/* Floating particles in Blue & Cyan */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-cyan-300/60 pointer-events-none"
              style={{
                top: `${(i * 19) % 100}%`,
                left: `${(i * 29) % 100}%`,
                width: `${(i % 3) + 1.5}px`,
                height: `${(i % 3) + 1.5}px`,
                boxShadow: '0 0 8px rgba(56, 189, 248, 0.8)',
                animation: `float-particle ${6 + (i % 6)}s infinite ease-in-out`,
                animationDelay: `${(i * 0.4)}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
