/**
 * Country Flag SVG Components
 * 
 * Reusable SVG flag icons that work across all platforms (Windows, Mac, Linux).
 * Emoji flags don't render properly on Windows, so we use SVGs instead.
 */

import React from 'react';

interface FlagProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-5 h-3.5',
  md: 'w-6 h-4',
  lg: 'w-8 h-6',
};

// 🇺🇸 USA Flag
export function USFlag({ className = '', size = 'md' }: FlagProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} rounded shadow-sm ${className}`} 
      viewBox="0 0 30 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stripes */}
      <rect width="30" height="20" fill="#B22234"/>
      <rect y="1.54" width="30" height="1.54" fill="#FFFFFF"/>
      <rect y="4.62" width="30" height="1.54" fill="#FFFFFF"/>
      <rect y="7.69" width="30" height="1.54" fill="#FFFFFF"/>
      <rect y="10.77" width="30" height="1.54" fill="#FFFFFF"/>
      <rect y="13.85" width="30" height="1.54" fill="#FFFFFF"/>
      <rect y="16.92" width="30" height="1.54" fill="#FFFFFF"/>
      {/* Blue canton */}
      <rect width="12" height="10.77" fill="#3C3B6E"/>
      {/* Stars (simplified) */}
      <g fill="#FFFFFF">
        <circle cx="1.5" cy="1.5" r="0.5"/>
        <circle cx="3.5" cy="1.5" r="0.5"/>
        <circle cx="5.5" cy="1.5" r="0.5"/>
        <circle cx="7.5" cy="1.5" r="0.5"/>
        <circle cx="9.5" cy="1.5" r="0.5"/>
        <circle cx="2.5" cy="2.5" r="0.5"/>
        <circle cx="4.5" cy="2.5" r="0.5"/>
        <circle cx="6.5" cy="2.5" r="0.5"/>
        <circle cx="8.5" cy="2.5" r="0.5"/>
        <circle cx="10.5" cy="2.5" r="0.5"/>
        <circle cx="1.5" cy="3.5" r="0.5"/>
        <circle cx="3.5" cy="3.5" r="0.5"/>
        <circle cx="5.5" cy="3.5" r="0.5"/>
        <circle cx="7.5" cy="3.5" r="0.5"/>
        <circle cx="9.5" cy="3.5" r="0.5"/>
        <circle cx="2.5" cy="4.5" r="0.5"/>
        <circle cx="4.5" cy="4.5" r="0.5"/>
        <circle cx="6.5" cy="4.5" r="0.5"/>
        <circle cx="8.5" cy="4.5" r="0.5"/>
        <circle cx="10.5" cy="4.5" r="0.5"/>
        <circle cx="1.5" cy="5.5" r="0.5"/>
        <circle cx="3.5" cy="5.5" r="0.5"/>
        <circle cx="5.5" cy="5.5" r="0.5"/>
        <circle cx="7.5" cy="5.5" r="0.5"/>
        <circle cx="9.5" cy="5.5" r="0.5"/>
        <circle cx="2.5" cy="6.5" r="0.5"/>
        <circle cx="4.5" cy="6.5" r="0.5"/>
        <circle cx="6.5" cy="6.5" r="0.5"/>
        <circle cx="8.5" cy="6.5" r="0.5"/>
        <circle cx="1.5" cy="7.5" r="0.5"/>
        <circle cx="3.5" cy="7.5" r="0.5"/>
        <circle cx="5.5" cy="7.5" r="0.5"/>
        <circle cx="7.5" cy="7.5" r="0.5"/>
        <circle cx="9.5" cy="7.5" r="0.5"/>
        <circle cx="2.5" cy="8.5" r="0.5"/>
        <circle cx="4.5" cy="8.5" r="0.5"/>
        <circle cx="6.5" cy="8.5" r="0.5"/>
        <circle cx="8.5" cy="8.5" r="0.5"/>
        <circle cx="1.5" cy="9.5" r="0.5"/>
        <circle cx="3.5" cy="9.5" r="0.5"/>
        <circle cx="5.5" cy="9.5" r="0.5"/>
        <circle cx="7.5" cy="9.5" r="0.5"/>
        <circle cx="9.5" cy="9.5" r="0.5"/>
      </g>
    </svg>
  );
}

// 🇨🇳 China Flag
export function ChinaFlag({ className = '', size = 'md' }: FlagProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} rounded shadow-sm ${className}`} 
      viewBox="0 0 30 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="30" height="20" fill="#DE2910"/>
      <g fill="#FFDE00">
        <polygon points="5,4 6.2,7.8 10,7.8 7,10 8,14 5,11.5 2,14 3,10 0,7.8 3.8,7.8"/>
        <polygon points="12,2 12.4,3 13.5,3 12.6,3.7 13,4.8 12,4 11,4.8 11.4,3.7 10.5,3 11.6,3" transform="rotate(23 12 3)"/>
        <polygon points="14,5 14.4,6 15.5,6 14.6,6.7 15,7.8 14,7 13,7.8 13.4,6.7 12.5,6 13.6,6" transform="rotate(-10 14 6)"/>
        <polygon points="14,9 14.4,10 15.5,10 14.6,10.7 15,11.8 14,11 13,11.8 13.4,10.7 12.5,10 13.6,10" transform="rotate(30 14 10)"/>
        <polygon points="12,12 12.4,13 13.5,13 12.6,13.7 13,14.8 12,14 11,14.8 11.4,13.7 10.5,13 11.6,13" transform="rotate(45 12 13)"/>
      </g>
    </svg>
  );
}

// 🇬🇧 UK Flag
export function UKFlag({ className = '', size = 'md' }: FlagProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} rounded shadow-sm ${className}`} 
      viewBox="0 0 30 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="30" height="20" fill="#012169"/>
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFFFFF" strokeWidth="4"/>
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="2"/>
      <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" strokeWidth="6"/>
      <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="4"/>
    </svg>
  );
}

// 🇮🇳 India Flag
export function IndiaFlag({ className = '', size = 'md' }: FlagProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} rounded shadow-sm ${className}`} 
      viewBox="0 0 30 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="30" height="6.67" fill="#FF9933"/>
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF"/>
      <rect y="13.33" width="30" height="6.67" fill="#138808"/>
      <circle cx="15" cy="10" r="2.5" fill="none" stroke="#000080" strokeWidth="0.5"/>
      <circle cx="15" cy="10" r="0.5" fill="#000080"/>
      {/* Ashoka Chakra spokes */}
      <g stroke="#000080" strokeWidth="0.2">
        <line x1="15" y1="7.5" x2="15" y2="12.5"/>
        <line x1="12.5" y1="10" x2="17.5" y2="10"/>
        <line x1="13.23" y1="8.23" x2="16.77" y2="11.77"/>
        <line x1="16.77" y1="8.23" x2="13.23" y2="11.77"/>
      </g>
    </svg>
  );
}

// 🇦🇺 Australia Flag
export function AustraliaFlag({ className = '', size = 'md' }: FlagProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} rounded shadow-sm ${className}`} 
      viewBox="0 0 30 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="30" height="20" fill="#00008B"/>
      {/* Union Jack (simplified) */}
      <rect width="15" height="10" fill="#012169"/>
      <path d="M0,0 L15,10 M15,0 L0,10" stroke="#FFFFFF" strokeWidth="2"/>
      <path d="M0,0 L15,10 M15,0 L0,10" stroke="#C8102E" strokeWidth="1"/>
      <path d="M7.5,0 V10 M0,5 H15" stroke="#FFFFFF" strokeWidth="3"/>
      <path d="M7.5,0 V10 M0,5 H15" stroke="#C8102E" strokeWidth="2"/>
      {/* Stars (simplified) */}
      <g fill="#FFFFFF">
        <circle cx="7" cy="15" r="1.5"/>
        <circle cx="24" cy="5" r="1"/>
        <circle cx="26" cy="12" r="1"/>
        <circle cx="22" cy="15" r="1"/>
        <circle cx="24" cy="17" r="0.8"/>
      </g>
    </svg>
  );
}

// 🇩🇪 Germany Flag
export function GermanyFlag({ className = '', size = 'md' }: FlagProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} rounded shadow-sm ${className}`} 
      viewBox="0 0 30 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="30" height="6.67" fill="#000000"/>
      <rect y="6.67" width="30" height="6.67" fill="#DD0000"/>
      <rect y="13.33" width="30" height="6.67" fill="#FFCC00"/>
    </svg>
  );
}

// 🇶🇦 Qatar Flag
export function QatarFlag({ className = '', size = 'md' }: FlagProps) {
  return (
    <svg 
      className={`${sizeClasses[size]} rounded shadow-sm ${className}`} 
      viewBox="0 0 30 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="30" height="20" fill="#8D1B3D"/>
      <polygon points="0,0 12,0 6,2.22 12,4.44 6,6.67 12,8.89 6,11.11 12,13.33 6,15.56 12,17.78 6,20 0,20" fill="#FFFFFF"/>
    </svg>
  );
}

// Export all flags
export const Flags = {
  US: USFlag,
  China: ChinaFlag,
  UK: UKFlag,
  India: IndiaFlag,
  Australia: AustraliaFlag,
  Germany: GermanyFlag,
  Qatar: QatarFlag,
};

export default Flags;
