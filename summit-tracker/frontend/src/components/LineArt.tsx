import React from 'react';

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
