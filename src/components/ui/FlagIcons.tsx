/**
 * FlagIcons Component
 *
 * Shared SVG flag icons for consistent use across the application.
 * Used by: CombinedCurrencyConverter, LiveCombinedSection, CurrencyConverter
 *
 * ============================================================================
 * AVAILABLE FLAGS
 * ============================================================================
 * - USFlag (United States)
 * - IndiaFlag (India)
 * - EUFlag (European Union)
 * - UKFlag (United Kingdom)
 */

interface FlagProps {
  className?: string;
}

export function USFlag({ className = "w-5 h-4" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="24" fill="#B22234"/>
      <path d="M0 2.77h32M0 7.38h32M0 12h32M0 16.62h32M0 21.23h32" stroke="white" strokeWidth="1.85"/>
      <rect width="12.8" height="12.92" fill="#3C3B6E"/>
      <g fill="white">
        <circle cx="1.6" cy="1.29" r="0.6"/><circle cx="4.27" cy="1.29" r="0.6"/><circle cx="6.93" cy="1.29" r="0.6"/>
        <circle cx="9.6" cy="1.29" r="0.6"/><circle cx="2.93" cy="2.58" r="0.6"/><circle cx="5.6" cy="2.58" r="0.6"/>
        <circle cx="8.27" cy="2.58" r="0.6"/>
      </g>
    </svg>
  );
}

export function IndiaFlag({ className = "w-5 h-4" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="8" fill="#FF9933"/>
      <rect y="8" width="32" height="8" fill="white"/>
      <rect y="16" width="32" height="8" fill="#138808"/>
      <circle cx="16" cy="12" r="3" fill="#000080"/>
      <circle cx="16" cy="12" r="2.2" fill="white"/>
      <circle cx="16" cy="12" r="0.6" fill="#000080"/>
    </svg>
  );
}

export function EUFlag({ className = "w-5 h-4" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="24" fill="#003399"/>
      <g fill="#FFCC00">
        <polygon points="16,3 16.5,4.5 18,4.5 16.75,5.5 17.25,7 16,6 14.75,7 15.25,5.5 14,4.5 15.5,4.5"/>
        <polygon points="16,17 16.5,18.5 18,18.5 16.75,19.5 17.25,21 16,20 14.75,21 15.25,19.5 14,18.5 15.5,18.5"/>
        <polygon points="9,5 9.5,6.5 11,6.5 9.75,7.5 10.25,9 9,8 7.75,9 8.25,7.5 7,6.5 8.5,6.5"/>
        <polygon points="23,5 23.5,6.5 25,6.5 23.75,7.5 24.25,9 23,8 21.75,9 22.25,7.5 21,6.5 22.5,6.5"/>
      </g>
    </svg>
  );
}

export function UKFlag({ className = "w-5 h-4" }: FlagProps) {
  return (
    <svg className={className} viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="24" fill="#012169"/>
      <path d="M0 0L32 24M32 0L0 24" stroke="white" strokeWidth="4"/>
      <path d="M0 0L32 24M32 0L0 24" stroke="#C8102E" strokeWidth="2"/>
      <path d="M16 0V24M0 12H32" stroke="white" strokeWidth="6"/>
      <path d="M16 0V24M0 12H32" stroke="#C8102E" strokeWidth="4"/>
    </svg>
  );
}
