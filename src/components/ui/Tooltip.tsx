/**
 * Tooltip Component
 *
 * Shared tooltip component for hover-to-reveal information.
 * Used by: CombinedCurrencyConverter, LiveCombinedSection, CurrencyConverter
 *
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Hover to show/hide
 * - Positioned above the element
 * - Dark theme styling
 * - Smooth transitions
 */

"use client";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  /** Optional: Minimum width for the tooltip */
  minWidth?: string;
  /** Optional: Position - default is above */
  position?: "top" | "bottom";
}

export default function Tooltip({ 
  children, 
  content, 
  minWidth = "200px",
  position = "top" 
}: TooltipProps) {
  const positionClasses = position === "top" 
    ? "bottom-full mb-2" 
    : "top-full mt-2";
  
  const arrowClasses = position === "top"
    ? "top-full -mt-1 border-t-gray-600"
    : "bottom-full -mb-1 border-b-gray-600 rotate-180";

  return (
    <div className="group relative inline-block w-full">
      {children}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 ${positionClasses} px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl`}
        style={{ minWidth }}
      >
        {content}
        <div className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${arrowClasses}`}></div>
      </div>
    </div>
  );
}

/**
 * Inline Tooltip - for use in inline contexts
 */
export function TooltipInline({ 
  children, 
  content,
  minWidth = "200px"
}: Omit<TooltipProps, "position">) {
  return (
    <span className="group relative inline-block">
      {children}
      <span 
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-xl whitespace-nowrap"
        style={{ minWidth }}
      >
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-600"></span>
      </span>
    </span>
  );
}
