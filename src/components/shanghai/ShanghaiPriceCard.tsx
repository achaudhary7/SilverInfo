"use client";

import { useLiveShanghaiPrice, formatShanghaiTimeAgo } from "@/hooks/useLiveShanghaiPrice";
import { formatCnyPrice, formatUsdPrice, getBeijingTimeString } from "@/lib/shanghaiApi";
import type { ShanghaiSilverPrice } from "@/lib/shanghaiApi";
import Link from "next/link";

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
 */

interface ShanghaiPriceCardProps {
  initialPrice?: ShanghaiSilverPrice | null;
}

// Tooltip component
function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <span className="relative group cursor-help">
      {children}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
      </span>
    </span>
  );
}

export default function ShanghaiPriceCard({ initialPrice }: ShanghaiPriceCardProps) {
  const { price, isLoading, lastUpdated } = useLiveShanghaiPrice(initialPrice);
  
  // Loading skeleton
  if (isLoading && !price) {
    return (
      <div 
        className="rounded-2xl p-6 animate-pulse"
        style={{ 
          background: "linear-gradient(135deg, #722F37 0%, #4a1c24 100%)",
          border: "1px solid rgba(255, 215, 0, 0.3)"
        }}
      >
        <div className="h-8 bg-yellow-500/20 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-yellow-500/20 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-yellow-500/20 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (!price) {
    return (
      <div 
        className="rounded-2xl p-6 text-center"
        style={{ 
          background: "linear-gradient(135deg, #722F37 0%, #4a1c24 100%)",
          border: "1px solid rgba(255, 215, 0, 0.3)"
        }}
      >
        <p style={{ color: "#FFE4B5" }}>Unable to load Shanghai price. Please refresh.</p>
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
      className="rounded-2xl overflow-hidden"
      style={{ 
        background: "linear-gradient(135deg, #722F37 0%, #4a1c24 100%)",
        border: "2px solid rgba(255, 215, 0, 0.4)",
        boxShadow: "0 4px 20px rgba(114, 47, 55, 0.4)"
      }}
    >
      {/* Header */}
      <div 
        className="px-4 sm:px-6 py-3 flex items-center justify-between"
        style={{ 
          background: "linear-gradient(90deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 215, 0, 0.04) 100%)",
          borderBottom: "1px solid rgba(255, 215, 0, 0.15)"
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🇨🇳</span>
          <div>
            <h2 className="text-sm sm:text-base font-bold" style={{ color: "#FFD700" }}>
              Shanghai Silver Price
            </h2>
            <p className="text-xs" style={{ color: "#FFE4B5", opacity: 0.7 }}>
              SGE • {getBeijingTimeString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Market Status Badge with Tooltip */}
          <Tooltip text={`SGE ${price.marketSession}`}>
            <span 
              className="px-2 py-1 rounded text-xs font-medium"
              style={{ 
                background: price.marketStatus === 'open' 
                  ? "rgba(16, 185, 129, 0.2)" 
                  : price.marketStatus === 'pre-market'
                    ? "rgba(251, 191, 36, 0.2)"
                    : "rgba(156, 163, 175, 0.2)",
                color: price.marketStatus === 'open' 
                  ? "#10b981" 
                  : price.marketStatus === 'pre-market'
                    ? "#fbbf24"
                    : "#9ca3af",
                border: `1px solid ${price.marketStatus === 'open' ? "#10b981" : price.marketStatus === 'pre-market' ? "#fbbf24" : "#9ca3af"}40`
              }}
            >
              {price.marketStatus === 'open' ? '🟢 Open' : price.marketStatus === 'pre-market' ? '🟡 Pre' : '⚪ Closed'}
            </span>
          </Tooltip>
          
          {/* Live indicator with pulse */}
          <span 
            className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5"
            style={{ 
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              border: "1px solid rgba(16, 185, 129, 0.3)"
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            LIVE
          </span>
        </div>
      </div>
      
      {/* Main Price Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        {/* Primary Price - CNY/kg (SGE Standard) */}
        <div className="mb-4">
          <Tooltip text="Shanghai Gold Exchange standard unit">
            <p className="text-xs uppercase tracking-wide mb-1 inline-flex items-center gap-1" style={{ color: "#FFE4B5", opacity: 0.7 }}>
              SGE Price (CNY/kg)
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </p>
          </Tooltip>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span 
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: "#FFD700", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
            >
              {formatCnyPrice(price.pricePerKgCny, 0)}
            </span>
            
            {/* 24h Change Badge */}
            <span 
              className="px-2 py-1 rounded text-sm font-semibold"
              style={{ 
                background: isPositiveChange 
                  ? "rgba(16, 185, 129, 0.2)" 
                  : "rgba(239, 68, 68, 0.2)",
                color: isPositiveChange ? "#10b981" : "#ef4444"
              }}
            >
              {isPositiveChange ? "↑" : "↓"} {Math.abs(price.change24hPercent).toFixed(2)}%
            </span>
          </div>
          
          {/* Per gram in CNY */}
          <p className="text-sm mt-1" style={{ color: "#FFE4B5", opacity: 0.8 }}>
            {formatCnyPrice(price.pricePerGramCny)}/gram
          </p>
        </div>
        
        {/* 🇮🇳 INDIA vs SHANGHAI - Prominent for Indian users */}
        <div 
          className="rounded-xl p-4 mb-4"
          style={{ 
            background: "linear-gradient(135deg, rgba(30, 58, 95, 0.9) 0%, rgba(44, 82, 130, 0.9) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.15)"
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🇮🇳</span>
            <h3 className="font-semibold text-white text-sm">India vs Shanghai Comparison</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Tooltip text="Shanghai price converted to INR (no Indian duties)">
              <div className="text-center p-2 rounded-lg cursor-help" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
                <p className="text-xs text-gray-300 mb-1">Shanghai (INR)</p>
                <p className="text-lg font-bold text-white">₹{shanghaiInInr.toFixed(0)}</p>
                <p className="text-xs text-gray-400">per gram</p>
              </div>
            </Tooltip>
            <Tooltip text="India market rate with 10% duty + 3% GST + 10% premium">
              <div className="text-center p-2 rounded-lg cursor-help" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
                <p className="text-xs text-gray-300 mb-1">India Market</p>
                <p className="text-lg font-bold text-amber-400">₹{indiaRate.toFixed(0)}</p>
                <p className="text-xs text-gray-400">per gram</p>
              </div>
            </Tooltip>
          </div>
          
          <div className="mt-3 flex items-center justify-center gap-2">
            <Tooltip text="India price is higher due to 10% import duty + 3% GST + local premium">
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  background: "rgba(251, 191, 36, 0.2)",
                  color: "#fbbf24"
                }}
              >
                India +{indiaPremiumOverShanghai.toFixed(1)}% vs Shanghai
              </span>
            </Tooltip>
          </div>
          
          <Link 
            href="/"
            className="block text-center mt-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{ 
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff"
            }}
          >
            View Live India Silver Rate →
          </Link>
        </div>
        
        {/* Multi-Currency Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          {/* USD/oz Price */}
          <Tooltip text="International standard: Troy ounce">
            <div 
              className="rounded-lg p-2 sm:p-3 text-center cursor-help"
              style={{ background: "rgba(255, 215, 0, 0.08)" }}
            >
              <p className="text-xs mb-1" style={{ color: "#FFE4B5", opacity: 0.6 }}>USD/oz</p>
              <p className="text-sm sm:text-base font-bold" style={{ color: "#FFD700" }}>
                {formatUsdPrice(price.pricePerOzUsd)}
              </p>
            </div>
          </Tooltip>
          
          {/* USD per gram */}
          <Tooltip text="Per gram in US Dollars">
            <div 
              className="rounded-lg p-2 sm:p-3 text-center cursor-help"
              style={{ background: "rgba(255, 215, 0, 0.08)" }}
            >
              <p className="text-xs mb-1" style={{ color: "#FFE4B5", opacity: 0.6 }}>USD/gram</p>
              <p className="text-sm sm:text-base font-bold" style={{ color: "#FFD700" }}>
                {formatUsdPrice(price.pricePerGramUsd)}
              </p>
            </div>
          </Tooltip>
          
          {/* INR equivalent */}
          <Tooltip text="Shanghai price in INR (no Indian duties)">
            <div 
              className="rounded-lg p-2 sm:p-3 text-center cursor-help"
              style={{ background: "rgba(255, 215, 0, 0.08)" }}
            >
              <p className="text-xs mb-1" style={{ color: "#FFE4B5", opacity: 0.6 }}>INR/gram</p>
              <p className="text-sm sm:text-base font-bold" style={{ color: "#FFD700" }}>
                ₹{price.pricePerGramInr.toFixed(0)}
              </p>
            </div>
          </Tooltip>
        </div>
        
        {/* INR per Kg - useful for bulk buyers */}
        <div 
          className="rounded-lg p-2 mb-4 text-center"
          style={{ background: "rgba(255, 215, 0, 0.05)" }}
        >
          <p className="text-xs" style={{ color: "#FFE4B5", opacity: 0.6 }}>
            Shanghai Rate: <span className="font-medium" style={{ color: "#FFD700" }}>₹{(price.pricePerKgInr / 1000).toFixed(0)},000/kg</span> • 
            <span className="ml-2">₹{price.pricePerOzInr?.toFixed(0) || (price.pricePerGramInr * 31.1).toFixed(0)}/oz</span>
          </p>
        </div>
        
        {/* Shanghai vs COMEX Comparison */}
        <div 
          className="rounded-lg p-3 sm:p-4 mb-4"
          style={{ 
            background: "rgba(255, 215, 0, 0.06)",
            border: "1px solid rgba(255, 215, 0, 0.15)"
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <Tooltip text="Difference between Shanghai and NY COMEX prices">
              <span className="text-sm font-semibold flex items-center gap-1" style={{ color: "#FFD700" }}>
                Shanghai Premium vs COMEX
                <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
            </Tooltip>
            <span 
              className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ 
                background: "rgba(16, 185, 129, 0.2)",
                color: "#10b981"
              }}
            >
              +{price.premiumPercent.toFixed(2)}%
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p style={{ color: "#FFE4B5", opacity: 0.6 }}>COMEX (NY)</p>
              <p className="font-medium" style={{ color: "#FFE4B5" }}>
                {formatUsdPrice(price.comexUsd)}/oz
              </p>
            </div>
            <div>
              <p style={{ color: "#FFE4B5", opacity: 0.6 }}>Premium</p>
              <p className="font-medium" style={{ color: "#10b981" }}>
                +{formatUsdPrice(price.premiumUsd)}/oz
              </p>
            </div>
          </div>
          
          {/* Premium explanation */}
          <p className="text-xs mt-2" style={{ color: "#FFE4B5", opacity: 0.5 }}>
            Shanghai trades at premium due to Chinese demand & import costs
          </p>
        </div>
        
        {/* Exchange Rates */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Tooltip text="US Dollar to Chinese Yuan exchange rate">
            <div 
              className="rounded-lg p-2 text-center cursor-help"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <p className="text-xs" style={{ color: "#FFE4B5", opacity: 0.6 }}>USD/CNY</p>
              <p className="text-sm font-medium" style={{ color: "#FFE4B5" }}>
                {price.usdCny.toFixed(4)}
              </p>
            </div>
          </Tooltip>
          <Tooltip text="US Dollar to Indian Rupee exchange rate">
            <div 
              className="rounded-lg p-2 text-center cursor-help"
              style={{ background: "rgba(255, 255, 255, 0.05)" }}
            >
              <p className="text-xs" style={{ color: "#FFE4B5", opacity: 0.6 }}>USD/INR</p>
              <p className="text-sm font-medium" style={{ color: "#FFE4B5" }}>
                ₹{price.usdInr.toFixed(2)}
              </p>
            </div>
          </Tooltip>
        </div>
        
        {/* Quick Links for Indian Users */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
            style={{ 
              background: "linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <span>🇮🇳</span>
            India Rate
          </Link>
          <Link 
            href="/silver-price-calculator"
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
            style={{ 
              background: "rgba(255, 215, 0, 0.15)",
              color: "#FFD700",
              border: "1px solid rgba(255, 215, 0, 0.3)"
            }}
          >
            <span>🧮</span>
            Calculator
          </Link>
        </div>
        
        {/* Data Source - 100% Real-time API Data */}
        <div 
          className="rounded-lg p-3 text-center"
          style={{ 
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)"
          }}
        >
          <p className="text-xs font-medium mb-1 flex items-center justify-center gap-1" style={{ color: "#10b981" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            100% Real-time API Data
          </p>
          <p className="text-xs" style={{ color: "#FFE4B5", opacity: 0.7 }}>
            COMEX: ${price.comexUsd.toFixed(2)}/oz • USD/CNY: {price.usdCny.toFixed(4)} • USD/INR: ₹{price.usdInr.toFixed(2)}
          </p>
          <p className="text-xs mt-1" style={{ color: "#FFE4B5", opacity: 0.5 }}>
            Shanghai = COMEX × (1 + {price.premiumPercent.toFixed(1)}% premium) × Exchange Rate
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div 
        className="px-4 sm:px-6 py-2 flex items-center justify-between text-xs"
        style={{ 
          background: "rgba(0, 0, 0, 0.15)",
          borderTop: "1px solid rgba(255, 215, 0, 0.1)"
        }}
      >
        <span className="flex items-center gap-1.5" style={{ color: "#FFE4B5", opacity: 0.5 }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          Updated {formatShanghaiTimeAgo(lastUpdated)}
        </span>
        <span style={{ color: "#FFE4B5", opacity: 0.5 }}>
          {price.source}
        </span>
      </div>
    </div>
  );
}
