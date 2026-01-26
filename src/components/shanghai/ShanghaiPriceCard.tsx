"use client";

import { useLiveShanghaiPrice, formatShanghaiTimeAgo } from "@/hooks/useLiveShanghaiPrice";
import { formatCnyPrice, formatUsdPrice, formatInrPrice, getBeijingTimeString } from "@/lib/shanghaiApi";
import type { ShanghaiSilverPrice } from "@/lib/shanghaiApi";
import Link from "next/link";

/**
 * ShanghaiPriceCard Component
 * 
 * Displays live Shanghai silver price with Chinese Red/Gold theme.
 * Shows prices in CNY, USD, and INR with COMEX comparison.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Real-time price updates (30s polling)
 * - Multi-currency display (CNY, USD, INR)
 * - Shanghai vs COMEX premium indicator
 * - SGE market status
 * - Beijing time display
 * - Red/Gold Chinese aesthetic
 */

interface ShanghaiPriceCardProps {
  initialPrice?: ShanghaiSilverPrice | null;
}

export default function ShanghaiPriceCard({ initialPrice }: ShanghaiPriceCardProps) {
  const { price, isLoading, lastUpdated } = useLiveShanghaiPrice(initialPrice);
  
  // Loading skeleton
  if (isLoading && !price) {
    return (
      <div 
        className="rounded-2xl p-6 animate-pulse"
        style={{ 
          background: "linear-gradient(135deg, #8B0000 0%, #4a0000 100%)",
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
          background: "linear-gradient(135deg, #8B0000 0%, #4a0000 100%)",
          border: "1px solid rgba(255, 215, 0, 0.3)"
        }}
      >
        <p style={{ color: "#FFE4B5" }}>Unable to load Shanghai price. Please refresh.</p>
      </div>
    );
  }
  
  const isPositiveChange = price.change24hPercent >= 0;
  
  return (
    <div 
      className="rounded-2xl overflow-hidden"
      style={{ 
        background: "linear-gradient(135deg, #8B0000 0%, #4a0000 100%)",
        border: "2px solid rgba(255, 215, 0, 0.4)",
        boxShadow: "0 4px 20px rgba(139, 0, 0, 0.3), inset 0 1px 0 rgba(255, 215, 0, 0.1)"
      }}
    >
      {/* Header */}
      <div 
        className="px-4 sm:px-6 py-3 flex items-center justify-between"
        style={{ 
          background: "linear-gradient(90deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)",
          borderBottom: "1px solid rgba(255, 215, 0, 0.2)"
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
          {/* Market Status Badge */}
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
            {price.marketStatus === 'open' ? '🟢 Open' : price.marketStatus === 'pre-market' ? '🟡 Pre-Market' : '⚪ Closed'}
          </span>
          
          {/* Live indicator */}
          <span 
            className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
            style={{ 
              background: "rgba(255, 215, 0, 0.15)",
              color: "#FFD700",
              border: "1px solid rgba(255, 215, 0, 0.3)"
            }}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            LIVE
          </span>
        </div>
      </div>
      
      {/* Main Price Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {/* Primary Price - CNY/kg (SGE Standard) */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "#FFE4B5", opacity: 0.7 }}>
            SGE Price (CNY/kg)
          </p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span 
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: "#FFD700", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
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
        
        {/* Multi-Currency Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          {/* USD Price */}
          <div 
            className="rounded-lg p-2 sm:p-3 text-center"
            style={{ background: "rgba(255, 215, 0, 0.08)" }}
          >
            <p className="text-xs mb-1" style={{ color: "#FFE4B5", opacity: 0.6 }}>USD/oz</p>
            <p className="text-sm sm:text-base font-bold" style={{ color: "#FFD700" }}>
              {formatUsdPrice(price.pricePerOzUsd)}
            </p>
          </div>
          
          {/* USD per gram */}
          <div 
            className="rounded-lg p-2 sm:p-3 text-center"
            style={{ background: "rgba(255, 215, 0, 0.08)" }}
          >
            <p className="text-xs mb-1" style={{ color: "#FFE4B5", opacity: 0.6 }}>USD/gram</p>
            <p className="text-sm sm:text-base font-bold" style={{ color: "#FFD700" }}>
              {formatUsdPrice(price.pricePerGramUsd)}
            </p>
          </div>
          
          {/* INR equivalent */}
          <div 
            className="rounded-lg p-2 sm:p-3 text-center"
            style={{ background: "rgba(255, 215, 0, 0.08)" }}
          >
            <p className="text-xs mb-1" style={{ color: "#FFE4B5", opacity: 0.6 }}>INR/gram</p>
            <p className="text-sm sm:text-base font-bold" style={{ color: "#FFD700" }}>
              ₹{price.pricePerGramInr.toFixed(0)}
            </p>
          </div>
        </div>
        
        {/* Shanghai vs COMEX Comparison */}
        <div 
          className="rounded-lg p-3 sm:p-4 mb-4"
          style={{ 
            background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)",
            border: "1px solid rgba(255, 215, 0, 0.2)"
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: "#FFD700" }}>
              Shanghai Premium vs COMEX
            </span>
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
              <p style={{ color: "#FFE4B5", opacity: 0.6 }}>COMEX</p>
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
          <div 
            className="rounded-lg p-2 text-center"
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
          >
            <p className="text-xs" style={{ color: "#FFE4B5", opacity: 0.6 }}>USD/CNY</p>
            <p className="text-sm font-medium" style={{ color: "#FFE4B5" }}>
              {price.usdCny.toFixed(4)}
            </p>
          </div>
          <div 
            className="rounded-lg p-2 text-center"
            style={{ background: "rgba(255, 255, 255, 0.05)" }}
          >
            <p className="text-xs" style={{ color: "#FFE4B5", opacity: 0.6 }}>USD/INR</p>
            <p className="text-sm font-medium" style={{ color: "#FFE4B5" }}>
              {price.usdInr.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Compare with India link */}
        <Link 
          href="/"
          className="block text-center py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
          style={{ 
            background: "linear-gradient(135deg, rgba(30, 58, 95, 0.8) 0%, rgba(44, 82, 130, 0.8) 100%)",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          🇮🇳 Compare with India Silver Rate →
        </Link>
      </div>
      
      {/* Footer */}
      <div 
        className="px-4 sm:px-6 py-2 flex items-center justify-between text-xs"
        style={{ 
          background: "rgba(0, 0, 0, 0.2)",
          borderTop: "1px solid rgba(255, 215, 0, 0.1)"
        }}
      >
        <span style={{ color: "#FFE4B5", opacity: 0.5 }}>
          ✓ Updated {formatShanghaiTimeAgo(lastUpdated)}
        </span>
        <span style={{ color: "#FFE4B5", opacity: 0.5 }}>
          Source: COMEX + Premium
        </span>
      </div>
    </div>
  );
}
