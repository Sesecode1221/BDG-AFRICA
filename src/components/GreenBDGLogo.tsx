import React from 'react';

interface GreenBDGLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  variant?: 'mark' | 'full' | 'badge';
  theme?: 'dark' | 'light';
}

/**
 * Official GreenBDG Africa Logo Component
 * Incorporates the circular emblem with the African continent silhouette
 * forming the signature stylized "G" spur.
 */
export const GreenBDGLogo: React.FC<GreenBDGLogoProps> = ({
  className = 'w-10 h-10',
  size,
  variant = 'badge',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  if (variant === 'badge') {
    return (
      <div
        style={style}
        className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-xs border border-[#0A2E20]/40 bg-[#041D14] ${className}`}
        title="GreenBDG Africa"
      >
        <img
          src="/greenbdglogo.png"
          alt="GreenBDG Africa Logo"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Pure SVG vector version with exact geometry
  return (
    <svg
      viewBox="0 0 256 256"
      style={style}
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="GreenBDG Africa Logo"
    >
      <rect width="256" height="256" fill="#041D14" rx="36" />
      <g transform="translate(128, 128) scale(1.04) translate(-144.85, -501.0)">
        <path
          fill="#4FB180"
          d="M253.5,503.8h-96.3v29.7h35.8c1.6,0,2.9,1.2,3.2,2.7l1,6.6c.1.9-.1,1.8-.7,2.5l-30.7,37.9c-.6.8-1.5,1.2-2.5,1.2h-16.2c-1.3,0-2.5-.8-3-2l-14.2-35.5c-.1-.3-.2-.5-.2-.8l-5.1-39.4c-.2-1.6-1.6-2.8-3.2-2.8h-27.8c-.8,0-1.6-.3-2.2-.8l-20.8-18.9c-.9-.8-1.2-2-1-3.1l5.3-21.9c.1-.6.4-1.1.8-1.5l25.9-26.1c.6-.6,1.4-1,2.3-1h30.9c1.7,0,3.1,1.3,3.2,3l.2,2.8c.1,1.5,1.3,2.8,2.8,3l37.1,5.1c1.6.2,2.8,1.6,2.8,3.2v6.5c0,.7.2,1.4.6,1.9l18.2,24.4c.6.8,1.6,1.3,2.6,1.3h49.8c-9.2-51.7-54.9-90.8-109.5-89.6-58.6,1.3-106,49.4-106.4,108-.4,60.4,48.4,109.6,108.8,109.6s89.9-32,103.8-76.1h0c0-.1,0-.3.1-.4.2-.5.3-1.1.6-1.5.5-.7.8-1.6.7-2.4s0-.7.1-1c.1-.6.3-1.1.4-1.7,0-.3.2-.7.2-1,.1-.5.2-1.1.3-1.6,0-.4.2-.8.2-1.2.1-.5.2-1,.3-1.5,0-.4.2-.8.2-1.3,0-.5.2-1,.2-1.4,0-.5.1-.9.2-1.4,0-.4.1-.9.2-1.3,0-.6.2-1.2.2-1.8,0-.5.1-1,.2-1.5,0-.7.1-1.3.2-2h0c0-.1,0-.3,0-.4v-6.2Z"
        />
      </g>
    </svg>
  );
};
