"use client";

import { useState, useEffect } from "react";
import type { GoldSilverRatioResult } from "@/lib/metalApi";
import { LiveBadgeInline } from "@/components/ui/LiveBadge";

interface GoldSilverRatioCardProps {
  /** 
   * Ratio data from parent component (LiveCombinedSection).
   * Parent polls /api/combined-prices every 30s which includes ratio.
   * No internal polling needed - reduces API calls by 50%!
   */
  initialRatio: GoldSilverRatioResult | null;
}

/**
 * GoldSilverRatioCard Component
 *
 * Displays the Gold-Silver ratio with visual gauge and interpretation.
 * Key differentiator - no competitor shows this clearly!
 *
 * The ratio indicates:
 * - Above 80: Silver undervalued (good time to buy silver)
 * - 60-80: Normal range
 * - Below 60: Silver overvalued (gold may be better value)
 * 
 * NOTE: Ratio updates come from parent via initialRatio prop.
 * Parent (LiveCombinedSection) polls /api/combined-prices every 30s.
 * Removed internal polling to prevent duplicate API calls.
 */
export default function GoldSilverRatioCard({ initialRatio }: GoldSilverRatioCardProps) {
  const [ratio, setRatio] = useState<GoldSilverRatioResult | null>(initialRatio);
  const [showDetails, setShowDetails] = useState(false);

  // Update ratio when parent provides new data (from combined-prices API)
  // This replaces the previous duplicate polling to /api/gold-silver-ratio
  useEffect(() => {
    if (initialRatio) {
      setRatio(initialRatio);
    }
  }, [initialRatio]);

  if (!ratio) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-16 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  // Calculate gauge position (0-100%)
  // Map ratio from 40-120 to 0-100%
  const minRatio = 40;
  const maxRatio = 120;
  const gaugePosition = Math.min(100, Math.max(0, ((ratio.ratio - minRatio) / (maxRatio - minRatio)) * 100));

  // Determine colors based on interpretation (light theme)
  const getColors = () => {
    switch (ratio.interpretation) {
      case 'silver_undervalued':
        return {
          text: 'text-green-600',
          badge: 'bg-green-100 text-green-700',
          interpretation: 'bg-green-50 border-green-100',
        };
      case 'silver_overvalued':
        return {
          text: 'text-amber-600',
          badge: 'bg-amber-100 text-amber-700',
          interpretation: 'bg-amber-50 border-amber-100',
        };
      default:
        return {
          text: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-700',
          interpretation: 'bg-blue-50 border-blue-100',
        };
    }
  };

  const colors = getColors();

  return (
    <div>
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.badge}`}>
          {ratio.interpretation === 'silver_undervalued' ? 'Silver Undervalued' :
           ratio.interpretation === 'silver_overvalued' ? 'Silver Overvalued' : 'Normal Range'}
        </span>
      </div>

      {/* Main Ratio Display */}
      <div className="text-center mb-3">
        <div className={`text-3xl font-bold ${colors.text} mb-0.5`}>
          {ratio.ratio.toFixed(1)}
        </div>
        <p className="text-gray-500 text-xs">
          1 oz Gold = {ratio.ratio.toFixed(1)} oz Silver
        </p>
      </div>

      {/* Compact Visual Gauge */}
      <div className="mb-3">
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="w-1/4 bg-amber-200"></div>
            <div className="w-1/2 bg-blue-200"></div>
            <div className="w-1/4 bg-green-200"></div>
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 rounded-full shadow border-2 border-white transition-all duration-500"
            style={{ left: `calc(${gaugePosition}% - 6px)` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>40</span>
          <span>Silver Overvalued</span>
          <span>Normal</span>
          <span>Undervalued</span>
          <span>120</span>
        </div>
      </div>

      {/* Price Comparison - Compact */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded bg-yellow-50 border border-yellow-100 text-center">
          <div className="text-[10px] text-gray-500">Gold 24K</div>
          <div className="text-sm font-bold text-yellow-700">
            ₹{ratio.goldPricePerGram.toLocaleString('en-IN')}/g
          </div>
        </div>
        <div className="p-2 rounded bg-gray-50 border border-gray-200 text-center">
          <div className="text-[10px] text-gray-500">Silver 999</div>
          <div className="text-sm font-bold text-gray-700">
            ₹{ratio.silverPricePerGram.toLocaleString('en-IN')}/g
          </div>
        </div>
      </div>

      {/* Interpretation - Compact */}
      <div className={`rounded p-2 border ${colors.interpretation}`}>
        <p className={`text-xs font-medium ${colors.text}`}>
          {ratio.interpretationText}
        </p>
      </div>

      {/* Expandable Details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 transition-colors"
      >
        {showDetails ? 'Hide' : 'More Details'}
        <span className={`transition-transform text-[10px] ${showDetails ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {showDetails && (
        <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
          <div className="p-2 rounded bg-gray-50 border border-gray-100">
            <p className="text-[10px] text-gray-500 mb-0.5">Investment Hint</p>
            <p className="text-xs text-gray-700">{ratio.investmentHint}</p>
          </div>

          <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
            <div className="p-1.5 rounded bg-gray-50">
              <div className="text-gray-500">Avg</div>
              <div className="text-gray-800 font-medium">65-70</div>
            </div>
            <div className="p-1.5 rounded bg-gray-50">
              <div className="text-gray-500">COVID</div>
              <div className="text-gray-800 font-medium">~125</div>
            </div>
            <div className="p-1.5 rounded bg-gray-50">
              <div className="text-gray-500">Now</div>
              <div className={`font-medium ${colors.text}`}>{ratio.ratio.toFixed(1)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
