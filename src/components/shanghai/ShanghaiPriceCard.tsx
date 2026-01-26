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

// China Flag SVG Component (renders consistently across all platforms)
function ChinaFlag({ className = "w-6 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#DE2910"/>
      <g fill="#FFDE00">
        {/* Main star */}
        <polygon points="5,4 6.2,7.8 10,7.8 7,10 8,14 5,11.5 2,14 3,10 0,7.8 3.8,7.8"/>
        {/* Small stars */}
        <polygon points="12,2 12.4,3 13.5,3 12.6,3.7 13,4.8 12,4 11,4.8 11.4,3.7 10.5,3 11.6,3" transform="rotate(23 12 3)"/>
        <polygon points="14,5 14.4,6 15.5,6 14.6,6.7 15,7.8 14,7 13,7.8 13.4,6.7 12.5,6 13.6,6" transform="rotate(-10 14 6)"/>
        <polygon points="14,9 14.4,10 15.5,10 14.6,10.7 15,11.8 14,11 13,11.8 13.4,10.7 12.5,10 13.6,10" transform="rotate(30 14 10)"/>
        <polygon points="12,12 12.4,13 13.5,13 12.6,13.7 13,14.8 12,14 11,14.8 11.4,13.7 10.5,13 11.6,13" transform="rotate(45 12 13)"/>
      </g>
    </svg>
  );
}

// India Flag SVG Component
function IndiaFlag({ className = "w-5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="6.67" fill="#FF9933"/>
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF"/>
      <rect y="13.33" width="30" height="6.67" fill="#138808"/>
      <circle cx="15" cy="10" r="2.5" fill="#000080"/>
      <circle cx="15" cy="10" r="2" fill="#FFFFFF"/>
    </svg>
  );
}

export default function ShanghaiPriceCard({ initialPrice }: ShanghaiPriceCardProps) {
  const { price, isLoading, lastUpdated } = useLiveShanghaiPrice(initialPrice);
  
  // Loading skeleton - Light warm theme
  if (isLoading && !price) {
    return (
      <div 
        className="rounded-2xl p-6 animate-pulse"
        style={{ 
          background: "linear-gradient(135deg, #FDF6E9 0%, #FAF0DC 100%)",
          border: "1px solid #E8D5B5"
        }}
      >
        <div className="h-8 bg-amber-200/50 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-amber-200/50 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-amber-200/50 rounded w-1/2"></div>
      </div>
    );
  }
  
  if (!price) {
    return (
      <div 
        className="rounded-2xl p-6 text-center"
        style={{ 
          background: "linear-gradient(135deg, #FDF6E9 0%, #FAF0DC 100%)",
          border: "1px solid #E8D5B5"
        }}
      >
        <p className="text-gray-700">Unable to load Shanghai price. Please refresh.</p>
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
        background: "linear-gradient(135deg, #FDF6E9 0%, #FAF0DC 100%)",
        border: "2px solid #C9A959",
        boxShadow: "0 4px 20px rgba(201, 169, 89, 0.25)"
      }}
    >
      {/* Header - Chinese Red accent */}
      <div 
        className="px-4 sm:px-6 py-3 flex items-center justify-between"
        style={{ 
          background: "linear-gradient(90deg, #C41E3A 0%, #B31830 100%)",
          borderBottom: "2px solid #C9A959"
        }}
      >
        <div className="flex items-center gap-2.5">
          <ChinaFlag className="w-7 h-5 rounded shadow-sm" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Shanghai Silver Price
            </h2>
            <p className="text-xs text-white/70">
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
          </Tooltip>
          
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
      
      {/* Main Price Section */}
      <div className="px-4 sm:px-6 py-4 sm:py-5">
        {/* Primary Price - CNY/kg (SGE Standard) */}
        <div className="mb-4">
          <Tooltip text="Shanghai Gold Exchange standard unit">
            <p className="text-xs uppercase tracking-wide mb-1 inline-flex items-center gap-1 text-gray-600">
              SGE Price (CNY/kg)
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </p>
          </Tooltip>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span 
              className="text-3xl sm:text-4xl font-bold"
              style={{ color: "#B8860B" }}
            >
              {formatCnyPrice(price.pricePerKgCny, 0)}
            </span>
            
            {/* 24h Change Badge */}
            <span 
              className={`px-2 py-1 rounded text-sm font-semibold ${
                isPositiveChange 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isPositiveChange ? "↑" : "↓"} {Math.abs(price.change24hPercent).toFixed(2)}%
            </span>
          </div>
          
          {/* Per gram in CNY */}
          <p className="text-sm mt-1 text-gray-600">
            {formatCnyPrice(price.pricePerGramCny)}/gram
          </p>
        </div>
        
        {/* INDIA vs SHANGHAI - Prominent for Indian users */}
        <div 
          className="rounded-xl p-4 mb-4"
          style={{ 
            background: "linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)",
            border: "1px solid #3b82f6"
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <IndiaFlag className="w-5 h-3.5" />
            <h3 className="font-semibold text-white text-sm">India vs Shanghai Comparison</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Tooltip text="Shanghai price converted to INR (no Indian duties)">
              <div className="text-center p-2.5 rounded-lg cursor-help bg-white/10">
                <p className="text-xs text-blue-200 mb-1">Shanghai (INR)</p>
                <p className="text-xl font-bold text-white">₹{shanghaiInInr.toFixed(0)}</p>
                <p className="text-xs text-blue-200/70">per gram</p>
              </div>
            </Tooltip>
            <Tooltip text="India market rate with 10% duty + 3% GST + 10% premium">
              <div className="text-center p-2.5 rounded-lg cursor-help bg-white/10">
                <p className="text-xs text-blue-200 mb-1">India Market</p>
                <p className="text-xl font-bold text-amber-400">₹{indiaRate.toFixed(0)}</p>
                <p className="text-xs text-blue-200/70">per gram</p>
              </div>
            </Tooltip>
          </div>
          
          <div className="mt-3 flex items-center justify-center">
            <Tooltip text="India price is higher due to 10% import duty + 3% GST + local premium">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300">
                India +{indiaPremiumOverShanghai.toFixed(1)}% vs Shanghai
              </span>
            </Tooltip>
          </div>
          
          <Link 
            href="/"
            className="block text-center mt-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/20 bg-white/10 text-white"
          >
            View Live India Silver Rate →
          </Link>
        </div>
        
        {/* Multi-Currency Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          {/* USD/oz Price */}
          <Tooltip text="International standard: Troy ounce">
            <div className="rounded-lg p-2 sm:p-3 text-center cursor-help bg-amber-50 border border-amber-200">
              <p className="text-xs mb-1 text-gray-500">USD/oz</p>
              <p className="text-sm sm:text-base font-bold text-amber-700">
                {formatUsdPrice(price.pricePerOzUsd)}
              </p>
            </div>
          </Tooltip>
          
          {/* USD per gram */}
          <Tooltip text="Per gram in US Dollars">
            <div className="rounded-lg p-2 sm:p-3 text-center cursor-help bg-amber-50 border border-amber-200">
              <p className="text-xs mb-1 text-gray-500">USD/gram</p>
              <p className="text-sm sm:text-base font-bold text-amber-700">
                {formatUsdPrice(price.pricePerGramUsd)}
              </p>
            </div>
          </Tooltip>
          
          {/* INR equivalent */}
          <Tooltip text="Shanghai price in INR (no Indian duties)">
            <div className="rounded-lg p-2 sm:p-3 text-center cursor-help bg-amber-50 border border-amber-200">
              <p className="text-xs mb-1 text-gray-500">INR/gram</p>
              <p className="text-sm sm:text-base font-bold text-amber-700">
                ₹{price.pricePerGramInr.toFixed(0)}
              </p>
            </div>
          </Tooltip>
        </div>
        
        {/* INR per Kg - useful for bulk buyers */}
        <div className="rounded-lg p-2 mb-4 text-center bg-gray-50 border border-gray-200">
          <p className="text-xs text-gray-600">
            Shanghai Rate: <span className="font-semibold text-gray-800">₹{(price.pricePerKgInr / 1000).toFixed(0)},000/kg</span> • 
            <span className="ml-2">₹{price.pricePerOzInr?.toFixed(0) || (price.pricePerGramInr * 31.1).toFixed(0)}/oz</span>
          </p>
        </div>
        
        {/* Shanghai vs COMEX Comparison */}
        <div className="rounded-lg p-3 sm:p-4 mb-4 bg-green-50 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Tooltip text="Difference between Shanghai and NY COMEX prices">
              <span className="text-sm font-semibold flex items-center gap-1 text-gray-700">
                Shanghai Premium vs COMEX
                <svg className="w-3 h-3 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
            </Tooltip>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-500 text-white">
              +{price.premiumPercent.toFixed(2)}%
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">COMEX (NY)</p>
              <p className="font-medium text-gray-800">
                {formatUsdPrice(price.comexUsd)}/oz
              </p>
            </div>
            <div>
              <p className="text-gray-500">Premium</p>
              <p className="font-medium text-green-600">
                +{formatUsdPrice(price.premiumUsd)}/oz
              </p>
            </div>
          </div>
          
          {/* Premium explanation */}
          <p className="text-xs mt-2 text-gray-500">
            Shanghai trades at premium due to Chinese demand & import costs
          </p>
        </div>
        
        {/* Exchange Rates */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Tooltip text="US Dollar to Chinese Yuan exchange rate">
            <div className="rounded-lg p-2 text-center cursor-help bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500">USD/CNY</p>
              <p className="text-sm font-medium text-gray-800">
                {price.usdCny.toFixed(4)}
              </p>
            </div>
          </Tooltip>
          <Tooltip text="US Dollar to Indian Rupee exchange rate">
            <div className="rounded-lg p-2 text-center cursor-help bg-gray-50 border border-gray-200">
              <p className="text-xs text-gray-500">USD/INR</p>
              <p className="text-sm font-medium text-gray-800">
                ₹{price.usdInr.toFixed(2)}
              </p>
            </div>
          </Tooltip>
        </div>
        
        {/* Quick Links for Indian Users */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] bg-blue-600 hover:bg-blue-700 text-white"
          >
            <IndiaFlag className="w-4 h-3" />
            India Rate
          </Link>
          <Link 
            href="/silver-price-calculator"
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] bg-amber-500 hover:bg-amber-600 text-white"
          >
            🧮 Calculator
          </Link>
        </div>
        
        {/* Data Source - 100% Real-time API Data */}
        <div className="rounded-lg p-3 text-center bg-green-50 border border-green-200">
          <p className="text-xs font-medium mb-1 flex items-center justify-center gap-1 text-green-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            100% Real-time API Data
          </p>
          <p className="text-xs text-gray-600">
            COMEX: ${price.comexUsd.toFixed(2)}/oz • USD/CNY: {price.usdCny.toFixed(4)} • USD/INR: ₹{price.usdInr.toFixed(2)}
          </p>
          <p className="text-xs mt-1 text-gray-500">
            Shanghai = COMEX × (1 + {price.premiumPercent.toFixed(1)}% premium) × Exchange Rate
          </p>
          <p className="text-xs mt-2 text-gray-400 italic">
            Prices are near-real-time indicators and may vary slightly from live exchange quotes.
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-4 sm:px-6 py-2 flex items-center justify-between text-xs bg-gray-100 border-t border-gray-200">
        <span className="flex items-center gap-1.5 text-gray-500">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
          </span>
          Updated {formatShanghaiTimeAgo(lastUpdated)}
        </span>
        <span className="text-gray-500">
          {price.source}
        </span>
      </div>
    </div>
  );
}
