import React from 'react';

// El Capitan - massive vertical cliff face (Yosemite icon)
export const ElCapitan: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main cliff face - sketchy style */}
    <path
      d="M50 400 L50 50 Q55 48, 58 52 L58 85 Q62 82, 65 90 L65 130 Q68 127, 72 138 L72 190 Q75 187, 78 200 L78 260 Q80 257, 83 270 L83 400 Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      opacity="0.25"
      strokeLinecap="round"
    />
    {/* Sketchy vertical cracks */}
    <path d="M54 100 Q56 150, 54 250" stroke="currentColor" strokeWidth="0.8" opacity="0.15" strokeLinecap="round" />
    <path d="M68 120 Q70 180, 68 300" stroke="currentColor" strokeWidth="0.8" opacity="0.15" strokeLinecap="round" />
    <path d="M78 90 Q80 160, 78 280" stroke="currentColor" strokeWidth="0.8" opacity="0.15" strokeLinecap="round" />
    {/* Horizontal features - ledges */}
    <path d="M50 160 Q60 158, 83 160" stroke="currentColor" strokeWidth="0.6" opacity="0.12" strokeLinecap="round" />
    <path d="M50 260 Q60 258, 83 260" stroke="currentColor" strokeWidth="0.6" opacity="0.12" strokeLinecap="round" />
  </svg>
);

// Half Dome - iconic rounded granite dome
export const HalfDome: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main dome shape - sketchy */}
    <path
      d="M20 200 L20 120 Q22 82, 42 62 Q62 42, 100 40 Q138 42, 158 62 Q178 82, 180 120 L180 200 Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      opacity="0.22"
      strokeLinecap="round"
    />
    {/* Sketchy texture lines */}
    <path d="M45 125 Q52 115, 58 125" stroke="currentColor" strokeWidth="0.7" opacity="0.12" strokeLinecap="round" />
    <path d="M72 105 Q82 95, 92 105" stroke="currentColor" strokeWidth="0.7" opacity="0.12" strokeLinecap="round" />
    <path d="M108 105 Q118 95, 128 105" stroke="currentColor" strokeWidth="0.7" opacity="0.12" strokeLinecap="round" />
    <path d="M142 125 Q152 115, 158 125" stroke="currentColor" strokeWidth="0.7" opacity="0.12" strokeLinecap="round" />
    {/* Vertical striations */}
    <path d="M65 85 Q68 130, 62 185" stroke="currentColor" strokeWidth="0.6" opacity="0.08" strokeLinecap="round" />
    <path d="M100 52 Q103 110, 100 180" stroke="currentColor" strokeWidth="0.6" opacity="0.08" strokeLinecap="round" />
    <path d="M135 85 Q138 130, 135 185" stroke="currentColor" strokeWidth="0.6" opacity="0.08" strokeLinecap="round" />
  </svg>
);

// Sketchy mountain range - hand-drawn style
export const SketchyMountains: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    {/* Main peaks - very sketchy */}
    <path
      d="M0 200 L45 165 L50 170 L75 130 L80 135 L115 70 L120 75 L145 95 L150 90 L185 45 L190 50 L220 75 L225 70 L260 30 L265 35 L300 65 L305 60 L340 90 L345 85 L380 50 L385 55 L420 85 L425 80 L460 110 L465 105 L500 130 L505 125 L540 150 L545 145 L580 165 L585 160 L600 175 L600 200 Z"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
      opacity="0.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Shadow layer */}
    <path
      d="M0 200 L50 168 L120 73 L190 48 L265 33 L340 88 L425 78 L505 123 L600 173"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      opacity="0.12"
      strokeLinecap="round"
    />
    {/* Detail textures */}
    <path d="M115 70 L110 120" stroke="currentColor" strokeWidth="0.8" opacity="0.08" strokeLinecap="round" />
    <path d="M185 45 L180 100" stroke="currentColor" strokeWidth="0.8" opacity="0.08" strokeLinecap="round" />
    <path d="M260 30 L255 90" stroke="currentColor" strokeWidth="0.8" opacity="0.08" strokeLinecap="round" />
  </svg>
);

// Mountain silhouette line art
export const MountainLine: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 80 L30 50 L50 60 L80 20 L110 45 L140 10 L170 40 L200 30 L200 80 Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.15"
    />
    <path
      d="M0 70 L40 45 L70 55 L100 25 L130 50 L160 20 L200 40"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.1"
    />
  </svg>
);

// Rope swirl decoration
export const RopeSwirl: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 50 Q 25 10, 50 30 T 90 50"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.2"
      strokeLinecap="round"
    />
    <path
      d="M15 55 Q 30 20, 55 35 T 85 55"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.15"
      strokeLinecap="round"
    />
  </svg>
);

// Carabiner icon
export const Carabiner: React.FC<{ className?: string; filled?: boolean }> = ({
  className = '',
  filled = false
}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 4 C 8 2, 12 2, 12 4 L 12 8 C 12 10, 16 10, 16 12 L 16 18 C 16 22, 8 22, 8 18 L 8 4 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill={filled ? "currentColor" : "none"}
      opacity={filled ? "0.1" : "0.3"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="9" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1" opacity="0.4" />
  </svg>
);

// Simple rope knot
export const RopeKnot: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1" opacity="0.2" />
    <path
      d="M12 20 Q 15 10, 20 20 T 28 20"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      opacity="0.25"
      strokeLinecap="round"
    />
    <path
      d="M20 12 Q 10 15, 20 20 T 20 28"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      opacity="0.25"
      strokeLinecap="round"
    />
  </svg>
);

// Decorative corner swirl
export const CornerSwirl: React.FC<{ className?: string; flip?: boolean }> = ({
  className = '',
  flip = false
}) => (
  <svg
    className={className}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: flip ? 'scaleX(-1)' : undefined }}
  >
    <path
      d="M5 5 Q 15 5, 20 15 T 30 35 Q 35 45, 45 50"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.15"
      strokeLinecap="round"
    />
    <path
      d="M10 8 Q 18 8, 22 18 T 32 38"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.1"
      strokeLinecap="round"
    />
  </svg>
);

// Chalk bag icon
export const ChalkBag: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 8 L 8 18 Q 8 20, 12 20 Q 16 20, 16 18 L 16 8 Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.2"
    />
    <path
      d="M7 8 L 17 8"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.3"
      strokeLinecap="round"
    />
    <circle cx="12" cy="14" r="2" fill="currentColor" opacity="0.1" />
  </svg>
);

// Climbing hold
export const ClimbingHold: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse
      cx="15"
      cy="15"
      rx="10"
      ry="12"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.2"
    />
    <ellipse
      cx="15"
      cy="15"
      rx="6"
      ry="8"
      fill="currentColor"
      opacity="0.05"
    />
  </svg>
);

// Horizontal divider with mountain peaks
export const MountainDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <line x1="0" y1="20" x2="120" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
    <path
      d="M120 20 L140 10 L160 20 L180 5 L200 20 L220 12 L240 20"
      stroke="currentColor"
      strokeWidth="0.5"
      fill="none"
      opacity="0.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="240" y1="20" x2="400" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
  </svg>
);
