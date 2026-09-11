import React from 'react';

interface CricketBallProps {
  size?: number;
  className?: string;
  spinning?: boolean;
}

export const CricketBall: React.FC<CricketBallProps> = ({
  size = 48,
  className = '',
  spinning = true,
}) => {
  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-[0_8px_16px_rgba(185,28,28,0.5)] ${
          spinning ? 'animate-[spin_4s_linear_infinite]' : ''
        }`}
      >
        <defs>
          <radialGradient id="ballGradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="35%" stopColor="#b91c1c" />
            <stop offset="75%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#450a0a" />
          </radialGradient>
          <linearGradient id="seamGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* Sphere base */}
        <circle cx="50" cy="50" r="46" fill="url(#ballGradient)" />

        {/* Highlight sheen */}
        <ellipse cx="38" cy="28" rx="20" ry="12" fill="white" opacity="0.25" transform="rotate(-25 38 28)" />

        {/* Cricket ball seam line */}
        <path
          d="M12 50 C 30 20, 70 20, 88 50 C 70 80, 30 80, 12 50 Z"
          fill="none"
          stroke="#450a0a"
          strokeWidth="3.5"
          opacity="0.8"
        />
        <path
          d="M12 50 C 30 20, 70 20, 88 50 C 70 80, 30 80, 12 50 Z"
          fill="none"
          stroke="url(#seamGlow)"
          strokeWidth="2"
          strokeDasharray="2 3"
        />

        {/* Secondary seam stitches */}
        <path
          d="M16 50 C 32 24, 68 24, 84 50"
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.2"
          strokeDasharray="1.5 2.5"
          opacity="0.9"
        />
        <path
          d="M16 50 C 32 76, 68 76, 84 50"
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.2"
          strokeDasharray="1.5 2.5"
          opacity="0.9"
        />

        {/* Gold brand crest stamp */}
        <circle cx="50" cy="50" r="8" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.7" />
        <text
          x="50"
          y="52"
          fontSize="5"
          fill="#fef08a"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          opacity="0.8"
        >
          ULLAS
        </text>
      </svg>
    </div>
  );
};
