import React from 'react';
import { cn } from '../utils';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 100 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={cn("h-10 w-auto", className)}
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#818cf8" /> {/* Indigo */}
          <stop offset="50%" stopColor="#22d3ee" /> {/* Cyan */}
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      
      {/* Stylized i59 */}
      <g filter="url(#glow)">
        {/* i */}
        <circle cx="15" cy="12" r="4" fill="url(#logo-gradient)" />
        <path d="M15 20 V40" stroke="url(#logo-gradient)" strokeWidth="6" strokeLinecap="round" />
        
        {/* 5 */}
        <path d="M30 20 H45 L43 30 C43 30 48 28 50 32 C52 36 50 40 45 40 H35" stroke="url(#logo-gradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        
        {/* 9 */}
        <path d="M75 40 V20" stroke="url(#logo-gradient)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="68" cy="27" r="7" stroke="url(#logo-gradient)" strokeWidth="5" fill="none" />
      </g>
    </svg>
  );
};