/**
 * PriceSourceBadge Component
 *
 * Shows where the price data comes from with tooltip explanation.
 * Adds transparency and builds user trust.
 *
 * ============================================================================
 * SOURCES
 * ============================================================================
 * - COMEX: New York Mercantile Exchange (official futures)
 * - calculated: Self-calculated from COMEX + forex
 * - snapshot: Manually updated local snapshot (no runtime API calls)
 * - fallback: Static fallback when APIs fail
 * - simulated: Demo/test data
 */

"use client";

import { useState } from "react";

interface PriceSourceBadgeProps {
  source: string;
  showTooltip?: boolean;
  className?: string;
}

// Source configurations
const SOURCE_CONFIG: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  tooltip: string;
}> = {
  COMEX: {
    label: "COMEX Live",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    tooltip: "Live price from COMEX (New York Mercantile Exchange) - the world's largest precious metals exchange.",
  },
  calculated: {
    label: "Calculated",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    tooltip: "Price calculated from COMEX spot + USD/INR exchange rate + import duty (6%) + IGST (3%) + local premium (3%).",
  },
  snapshot: {
    label: "Snapshot",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    tooltip: "Price loaded from a manually maintained local snapshot file. No runtime API calls are used for this value.",
  },
  goldapi: {
    label: "GoldAPI",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    tooltip: "Price sourced from GoldAPI.io - a professional precious metals data provider.",
  },
  metalpriceapi: {
    label: "MetalPriceAPI",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    tooltip: "Price sourced from MetalPriceAPI - enterprise-grade commodity data.",
  },
  fallback: {
    label: "Estimated",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    tooltip: "Estimated price based on recent market data. Live APIs temporarily unavailable.",
  },
  simulated: {
    label: "Demo",
    color: "text-gray-400",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/30",
    tooltip: "Simulated price for demonstration. Not real market data.",
  },
};

export default function PriceSourceBadge({
  source,
  showTooltip = true,
  className = "",
}: PriceSourceBadgeProps) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  // Get config for this source (default to calculated)
  const config = SOURCE_CONFIG[source] || SOURCE_CONFIG.calculated;

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor} cursor-help flex items-center gap-1.5 transition-all hover:opacity-80`}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onClick={() => setIsTooltipVisible(!isTooltipVisible)}
        aria-label={`Price source: ${config.label}`}
      >
        {/* Status dot */}
        <span className="relative flex h-2 w-2">
          {source === "COMEX" || source === "calculated" ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          )}
        </span>
        {config.label}
        {showTooltip && <span className="text-[10px] opacity-60">ⓘ</span>}
      </button>

      {/* Tooltip */}
      {showTooltip && isTooltipVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg bg-gray-900 border border-gray-700 shadow-xl text-left">
          <p className="text-xs text-gray-300 leading-relaxed">{config.tooltip}</p>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-8 border-transparent border-t-gray-700"></div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact inline version for tight spaces
 */
export function PriceSourceInline({ source }: { source: string }) {
  const config = SOURCE_CONFIG[source] || SOURCE_CONFIG.calculated;
  
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${config.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      <span>{config.label}</span>
    </span>
  );
}
