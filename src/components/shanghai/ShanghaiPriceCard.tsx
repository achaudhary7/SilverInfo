"use client";

import { useState, useEffect } from "react";
import { useLiveShanghaiPrice, formatShanghaiTimeAgo } from "@/hooks/useLiveShanghaiPrice";
import { formatCnyPrice, formatUsdPrice, getBeijingTimeString } from "@/lib/shanghaiApi";
import type { ShanghaiSilverPrice } from "@/lib/shanghaiApi";
import Link from "next/link";
import { TooltipInline } from "@/components/ui/Tooltip";
import { ChinaFlag, IndiaFlag } from "@/components/Flags";

/**
 * ShanghaiPriceCard Component
 * 
 * Displays live Shanghai silver price with warm Chinese theme.
 * Optimized for Indian users with INR comparison.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Real-time price updates (30s polling)
 * - Multi-currency display (CNY, USD, INR)
 * - India vs Shanghai comparison
 * - Shanghai vs COMEX premium indicator
 * - SGE market status with tooltips
 * - Warm burgundy/gold aesthetic
 * 
 * Uses shared components:
 * - @/components/ui/Tooltip for hover information
 * - @/components/Flags for SVG flag icons
 */

interface ShanghaiPriceCardProps {
  initialPrice?: ShanghaiSilverPrice | null;
}

export default function ShanghaiPriceCard({ initialPrice }: ShanghaiPriceCardProps) {
  const { price, isLoading, lastUpdated } = useLiveShanghaiPrice(initialPrice);
  
  // State for Beijing time (client-side only to avoid hydration mismatch)
  const [beijingTime, setBeijingTime] = useState<string>("");
  
  // Update Beijing time on client only
  useEffect(() => {
    // Set initial time
    setBeijingTime(getBeijingTimeString());
    
    // Update every minute
    const interval = setInterval(() => {
      setBeijingTime(getBeijingTimeString());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Loading skeleton - Professional neutral theme
  if (isLoading && !price) {
    return (
      <div 
        className="rounded-2xl p-6 animate-pulse bg-white border border-slate-300 shadow-sm"
      >
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-slate-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (!price) {
    return (
      <div 
        className="rounded-2xl p-6 text-center bg-white border border-slate-300 shadow-sm"
      >
        <p className="text-slate-600">Unable to load Shanghai price. Please refresh.</p>
      </div>
    );
  }
  
  const isPositiveChange = price.change24hPercent >= 0;
  
  // India vs Shanghai comparison
  // Shanghai INR is direct conversion (no duties)
  // India rate includes import duty + GST + local premium
  const shanghaiInInr = price.pricePerGramInr;
  const indiaRate = price.indiaRatePerGram;
  const indiaPremiumOverShanghai = ((indiaRate - shanghaiInInr) / shanghaiInInr) * 100;
  
  return (
    <div 
      className="rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-300 h-full"
    >
      {/* Header - Professional dark theme with subtle red accent */}
      <div 
        className="px-4 sm:px-6 py-3 flex items-center justify-between"
        style={{ 
          background: "linear-gradient(90deg, #1e293b 0%, #334155 100%)",
          borderBottom: "1px solid #475569"
        }}
      >
        <div className="flex items-center gap-2.5">
          <ChinaFlag className="w-7 h-5 rounded shadow-sm" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Shanghai Silver Price
            </h2>
            <p className="text-xs text-white/70">
              SGE • {beijingTime || "Loading..."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Market Status Badge with Tooltip */}
          <TooltipInline content={`SGE ${price.marketSession}`} minWidth="auto">
            <span 
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                background: price.marketStatus === 'open' 
                  ? "rgba(16, 185, 129, 0.9)" 
                  : price.marketStatus === 'pre-market'
                    ? "rgba(251, 191, 36, 0.9)"
                    : "rgba(255, 255, 255, 0.3)",
                color: price.marketStatus === 'open' || price.marketStatus === 'pre-market'
                  ? "#ffffff" 
                  : "#ffffff"
              }}
            >
              {price.marketStatus === 'open' ? '● Open' : price.marketStatus === 'pre-market' ? '● Pre' : '○ Closed'}
            </span>
          </TooltipInline>
          
          {/* Live indicator with pulse */}
          <span 
            className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 bg-white/20 text-white"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
            LIVE
          </span>
        </div>
      </div>
      
      {/* Main Price Section - Compact */}
      <div className="px-3 sm:px-4 py-2 sm:py-3">
        {/* Primary Price Row */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <TooltipInline content="Shanghai Gold Exchange standard unit">
              <p className="text-xs uppercase tracking-wide inline-flex items-center gap-1 text-slate-500">
                SGE Price (CNY/kg)
              </p>
            </TooltipInline>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-800">
                {formatCnyPrice(price.pricePerKgCny, 0)}
              </span>
              <span 
                className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                  isPositiveChange 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {isPositiveChange ? "↑" : "↓"} {Math.abs(price.change24hPercent).toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-slate-500">{formatCnyPrice(price.pricePerGramCny)}/gram</p>
          </div>
        </div>
        
        {/* India vs Shanghai - Compact */}
        <div className="rounded-lg p-2 mb-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <IndiaFlag className="w-3 h-2" />
              <h3 className="font-semibold text-white text-xs">India vs Shanghai</h3>
            </div>
            <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
              India +{indiaPremiumOverShanghai.toFixed(0)}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="text-center p-1.5 rounded bg-slate-700/50 border border-slate-600">
              <p className="text-xs text-slate-400">Shanghai</p>
              <p className="text-sm font-bold text-white">₹{shanghaiInInr.toFixed(0)}</p>
            </div>
            <div className="text-center p-1.5 rounded bg-slate-700/50 border border-slate-600">
              <p className="text-xs text-slate-400">India</p>
              <p className="text-sm font-bold text-amber-400">₹{indiaRate.toFixed(0)}</p>
            </div>
          </div>
          <Link href="/" className="block text-center mt-1.5 py-1 rounded text-xs font-medium hover:bg-slate-600 bg-slate-700 text-slate-200">
            View Live India Rate →
          </Link>
        </div>
        
        {/* Multi-Currency + Premium - Combined Row */}
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          <div className="rounded p-1.5 text-center bg-slate-50 border border-slate-300">
            <p className="text-xs text-slate-500">USD/oz</p>
            <p className="text-xs font-bold text-slate-700">{formatUsdPrice(price.pricePerOzUsd)}</p>
          </div>
          <div className="rounded p-1.5 text-center bg-slate-50 border border-slate-300">
            <p className="text-xs text-slate-500">USD/g</p>
            <p className="text-xs font-bold text-slate-700">{formatUsdPrice(price.pricePerGramUsd)}</p>
          </div>
          <div className="rounded p-1.5 text-center bg-slate-50 border border-slate-300">
            <p className="text-xs text-slate-500">INR/g</p>
            <p className="text-xs font-bold text-slate-700">₹{price.pricePerGramInr.toFixed(0)}</p>
          </div>
          <div className="rounded p-1.5 text-center bg-emerald-50 border border-emerald-200">
            <p className="text-xs text-emerald-600">Premium</p>
            <p className="text-xs font-bold text-emerald-700">+{price.premiumPercent.toFixed(1)}%</p>
          </div>
        </div>
        
        {/* COMEX + Exchange Rates - Compact Row */}
        <div className="rounded p-2 mb-2 bg-slate-50 border border-slate-300">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">COMEX: <span className="font-semibold text-slate-700">${price.comexUsd.toFixed(2)}/oz</span></span>
            <span className="text-slate-500">USD/CNY: <span className="font-semibold">{price.usdCny.toFixed(2)}</span></span>
            <span className="text-slate-500">USD/INR: <span className="font-semibold">₹{price.usdInr.toFixed(2)}</span></span>
          </div>
        </div>
        
        {/* Data Source - Minimal */}
        <div className="text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Real-time API • Shanghai = COMEX × {(1 + price.premiumPercent/100).toFixed(2)} × FX
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-4 sm:px-6 py-2 flex items-center justify-between text-xs bg-slate-50 border-t border-slate-300">
        <span className="flex items-center gap-1.5 text-slate-500">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          Updated {formatShanghaiTimeAgo(lastUpdated)}
        </span>
        <span className="text-slate-500">
          {price.source}
        </span>
      </div>
    </div>
  );
}
