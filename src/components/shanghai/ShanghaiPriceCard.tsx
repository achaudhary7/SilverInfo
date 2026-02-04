"use client";

import { useState, useEffect } from "react";
import { useLiveShanghaiPrice, formatShanghaiTimeAgo } from "@/hooks/useLiveShanghaiPrice";
import { formatCnyPrice, formatUsdPrice, getBeijingTimeString } from "@/lib/shanghaiApi";
import type { ShanghaiSilverPrice } from "@/lib/shanghaiApi";
import { TooltipInline } from "@/components/ui/Tooltip";
import { ChinaFlag } from "@/components/Flags";

/**
 * ShanghaiPriceCard Component (Simplified)
 * 
 * Displays live Shanghai silver price with clean, professional design.
 * Focused on primary CNY price with essential market data.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Real-time price updates (60s polling)
 * - Primary CNY price display
 * - Market status indicator
 * - COMEX comparison with premium
 * - Estimation disclaimer
 */

interface ShanghaiPriceCardProps {
  initialPrice?: ShanghaiSilverPrice | null;
}

export default function ShanghaiPriceCard({ initialPrice }: ShanghaiPriceCardProps) {
  const { price: fetchedPrice, isLoading, lastUpdated } = useLiveShanghaiPrice();
  const price = fetchedPrice || initialPrice;
  
  // State for Beijing time (client-side only to avoid hydration mismatch)
  const [beijingTime, setBeijingTime] = useState<string>("");
  
  // Track if component is mounted (for hydration safety)
  const [isMounted, setIsMounted] = useState(false);
  
  // Update Beijing time on client only
  useEffect(() => {
    setIsMounted(true);
    setBeijingTime(getBeijingTimeString());
    const interval = setInterval(() => {
      setBeijingTime(getBeijingTimeString());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Loading skeleton - shown on server and initial client render for consistency
  // Use consistent className without h-full to avoid hydration mismatch
  const skeletonClassName = "rounded-xl p-5 animate-pulse bg-white border border-slate-200 shadow-sm";
  
  if (!isMounted || (isLoading && !price)) {
    return (
      <div className={skeletonClassName} suppressHydrationWarning>
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-slate-200 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (!price) {
    return (
      <div className="rounded-xl p-5 text-center bg-white border border-slate-200 shadow-sm">
        <p className="text-slate-600">Unable to load Shanghai price. Please refresh.</p>
      </div>
    );
  }
  
  const isPositiveChange = price.change24hPercent >= 0;
  
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-md border border-slate-200 h-full">
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center justify-between"
        style={{ 
          background: "linear-gradient(90deg, #1e293b 0%, #334155 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <ChinaFlag className="w-6 h-4 rounded shadow-sm" />
          <div>
            <h2 className="text-sm font-bold text-white">Shanghai Silver Price</h2>
            <p className="text-[11px] text-white/70">SGE Ag(T+D) • {beijingTime || "..."}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Market Status */}
          <TooltipInline content={`SGE ${price.marketSession}`} minWidth="auto">
            <span 
              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                price.marketStatus === 'open' 
                  ? "bg-emerald-500/90 text-white" 
                  : price.marketStatus === 'pre-market'
                    ? "bg-amber-500/90 text-white"
                    : "bg-white/30 text-white"
              }`}
            >
              {price.marketStatus === 'open' ? '● Open' : price.marketStatus === 'pre-market' ? '● Pre' : '○ Closed'}
            </span>
          </TooltipInline>
          
          {/* Live indicator */}
          <span className="px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 bg-white/20 text-white">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400"></span>
            </span>
            LIVE
          </span>
        </div>
      </div>
      
      {/* Main Price Section */}
      <div className="px-4 py-3">
        {/* Primary Price with Tooltip */}
        <div className="mb-2 group relative">
          <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5 cursor-help inline-flex items-center gap-1">
            Shanghai Silver Spot Price (CNY/kg) <span className="text-slate-400">ⓘ</span>
          </p>
          {/* Tooltip for Estimated Price */}
          <div className="absolute top-full left-0 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-56 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl">
              <p className="font-bold text-amber-400 mb-1">📊 Shanghai Silver Spot</p>
              <p className="text-xs">Estimated from COMEX + Shanghai premium + USD/CNY. Reflects China silver spot market.</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">
              {formatCnyPrice(price.pricePerKgCny, 0)}
            </span>
            {price.change24hPercent !== 0 && Math.abs(price.change24hPercent) > 0.01 ? (
              <span className={`px-1 py-0.5 rounded text-[10px] font-semibold ${isPositiveChange ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                {isPositiveChange ? "↑" : "↓"} {Math.abs(price.change24hPercent).toFixed(2)}%
              </span>
            ) : null}
          </div>
          <p className="text-[11px] text-slate-500">{formatCnyPrice(price.pricePerGramCny)}/gram • ${price.pricePerOzUsd.toFixed(2)}/oz</p>
        </div>
        
        {/* Quick Price Grid - More data */}
        <div className="grid grid-cols-4 gap-1.5 mb-2 text-center">
          <div className="group relative p-1.5 rounded bg-cyan-50 cursor-help hover:bg-cyan-100 transition-colors">
            <p className="text-[9px] text-cyan-600">COMEX</p>
            <p className="text-xs font-bold text-cyan-800">${price.comexUsd.toFixed(2)}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[100] w-36 pointer-events-none">
              <div className="bg-gray-900 text-white text-[10px] px-2 py-1.5 rounded shadow-xl">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></span>
                🇺🇸 NY benchmark ($/oz)
              </div>
            </div>
          </div>
          <div className="group relative p-1.5 rounded bg-emerald-50 cursor-help hover:bg-emerald-100 transition-colors">
            <p className="text-[9px] text-emerald-600">Premium</p>
            <p className="text-xs font-bold text-emerald-700">+{price.premiumPercent.toFixed(1)}%</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[100] w-36 pointer-events-none">
              <div className="bg-gray-900 text-white text-[10px] px-2 py-1.5 rounded shadow-xl">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></span>
                Shanghai over COMEX
              </div>
            </div>
          </div>
          <div className="group relative p-1.5 rounded bg-blue-50 cursor-help hover:bg-blue-100 transition-colors">
            <p className="text-[9px] text-blue-600">USD/CNY</p>
            <p className="text-xs font-bold text-blue-700">{price.usdCny.toFixed(2)}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[100] w-36 pointer-events-none">
              <div className="bg-gray-900 text-white text-[10px] px-2 py-1.5 rounded shadow-xl">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></span>
                💱 FX rate today
              </div>
            </div>
          </div>
          <div className="group relative p-1.5 rounded bg-amber-50 cursor-help hover:bg-amber-100 transition-colors">
            <p className="text-[9px] text-amber-600">USD/g</p>
            <p className="text-xs font-bold text-amber-700">${(price.pricePerOzUsd / 31.1035).toFixed(2)}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-[100] w-36 pointer-events-none">
              <div className="bg-gray-900 text-white text-[10px] px-2 py-1.5 rounded shadow-xl">
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></span>
                Shanghai spot $/gram
              </div>
            </div>
          </div>
        </div>
        
        {/* Spot Price in multiple units - compact row */}
        <div className="flex justify-between items-center text-[10px] mb-2 px-1 py-1.5 bg-slate-50 rounded">
          <span className="text-slate-500">Spot:</span>
          <span className="font-medium text-slate-700">¥{price.pricePerKgCny.toLocaleString()}/kg</span>
          <span className="text-slate-400">•</span>
          <span className="font-medium text-slate-700">${price.pricePerOzUsd.toFixed(2)}/oz</span>
          <span className="text-slate-400">•</span>
          <span className="font-medium text-slate-700">₹{price.pricePerGramInr?.toFixed(0) || Math.round(price.pricePerOzUsd * price.usdInr / 31.1035)}/g</span>
        </div>
        
        {/* Compact disclaimer + share row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <p className="text-[10px] text-amber-700">
            Est: COMEX×(1+{price.premiumPercent.toFixed(0)}%)×FX • 
            <a href="https://en.sge.com.cn/data_SilverBenchmarkPrice" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">SGE →</a>
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => {
                const shareText = `🇨🇳 Shanghai Silver Spot Price\n¥${price.pricePerKgCny.toLocaleString()}/kg ($${price.pricePerOzUsd.toFixed(2)}/oz)\n+${price.premiumPercent.toFixed(1)}% vs COMEX\n🔗 silverinfo.in/shanghai-silver-price`;
                if (navigator.share) {
                  navigator.share({ title: 'Shanghai Silver Price', text: shareText, url: 'https://silverinfo.in/shanghai-silver-price' });
                } else {
                  navigator.clipboard.writeText(shareText);
                  alert('Copied!');
                }
              }}
              className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors text-[10px]"
              title="Copy price info"
            >📋</button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🇨🇳 Shanghai Silver: ¥${price.pricePerKgCny.toLocaleString()}/kg • $${price.pricePerOzUsd.toFixed(2)}/oz • +${price.premiumPercent.toFixed(1)}% premium`)}&url=${encodeURIComponent('https://silverinfo.in/shanghai-silver-price')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors text-white text-[10px]"
              title="Share on X"
            >𝕏</a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`🇨🇳 Shanghai Silver: ¥${price.pricePerKgCny.toLocaleString()}/kg ($${price.pricePerOzUsd.toFixed(2)}/oz) +${price.premiumPercent.toFixed(1)}% vs COMEX\n🔗 https://silverinfo.in/shanghai-silver-price`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-green-500 hover:bg-green-600 transition-colors text-white text-[10px]"
              title="Share on WhatsApp"
            >💬</a>
          </div>
        </div>
      </div>
      
      {/* Quick Reference - fills empty space */}
      <div className="px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
          <div>
            <p className="text-slate-400">10 gram</p>
            <p className="font-semibold text-slate-700">¥{(price.pricePerGramCny * 10).toFixed(0)}</p>
          </div>
          <div>
            <p className="text-slate-400">1 tola (11.66g)</p>
            <p className="font-semibold text-slate-700">¥{(price.pricePerGramCny * 11.66).toFixed(0)}</p>
          </div>
          <div>
            <p className="text-slate-400">100 gram</p>
            <p className="font-semibold text-slate-700">¥{(price.pricePerGramCny * 100).toFixed(0)}</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-4 py-1.5 flex items-center justify-between text-[10px] bg-slate-100 border-t border-slate-200">
        <span className="flex items-center gap-1 text-slate-500">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          Updated {formatShanghaiTimeAgo(lastUpdated)}
        </span>
        <span className="text-slate-400">{price.source}</span>
      </div>
    </div>
  );
}
