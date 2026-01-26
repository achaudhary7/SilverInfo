/**
 * Gold Price Card Component
 * 
 * Displays live gold prices in a beautiful gold-themed card.
 * Shows 24K, 22K prices with real-time updates and daily extremes.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Live 24K and 22K gold prices
 * - 24h change indicator
 * - Today's high/low tracking
 * - MCX market status
 * - Gold-themed color palette
 * - Responsive design
 * 
 * Used By: /gold/page.tsx (Gold homepage)
 */

"use client";

import { useLiveGoldPrice } from "@/hooks/useLiveGoldPrice";
import { formatIndianGoldPrice, getGoldPriceChangeIndicator } from "@/lib/goldApi";
import type { GoldPrice } from "@/lib/goldApi";
import Link from "next/link";

// ============================================================================
// STYLES
// ============================================================================

const CARD_STYLE = {
  background: "linear-gradient(135deg, #1a1a0f 0%, #2d2a1f 50%, #1a1a0f 100%)",
  borderRadius: "16px",
  padding: "24px",
  border: "1px solid rgba(255, 215, 0, 0.3)",
  boxShadow: "0 4px 20px rgba(255, 215, 0, 0.1)",
};

const GOLD_ACCENT = "#FFD700";
const GOLD_LIGHT = "#FFE4B5";
const GOLD_DARK = "#B8860B";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatHighLowTime(isoTimestamp: string): string {
  try {
    const date = new Date(isoTimestamp);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  } catch {
    return "";
  }
}

function getMCXMarketStatus(): { isOpen: boolean; status: string; nextChange: string } {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  
  const hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes();
  const day = istDate.getUTCDay();
  const time = hours * 60 + minutes;
  
  // MCX Gold Trading Hours (IST):
  // Monday to Friday: 9:00 AM - 11:30 PM (exceptions on expiry)
  // Saturday/Sunday: Closed
  
  if (day === 0 || day === 6) {
    return { isOpen: false, status: "Weekend Closed", nextChange: "Opens Monday 9:00 AM" };
  }
  
  const openTime = 9 * 60;     // 9:00 AM
  const closeTime = 23 * 60 + 30; // 11:30 PM
  
  if (time >= openTime && time < closeTime) {
    const hoursLeft = Math.floor((closeTime - time) / 60);
    const minsLeft = (closeTime - time) % 60;
    return { 
      isOpen: true, 
      status: "MCX Open", 
      nextChange: `Closes in ${hoursLeft}h ${minsLeft}m` 
    };
  }
  
  if (time < openTime) {
    const minsUntilOpen = openTime - time;
    const hoursUntilOpen = Math.floor(minsUntilOpen / 60);
    const minsRemaining = minsUntilOpen % 60;
    return { 
      isOpen: false, 
      status: "Pre-Market", 
      nextChange: `Opens in ${hoursUntilOpen}h ${minsRemaining}m` 
    };
  }
  
  return { isOpen: false, status: "After Hours", nextChange: "Opens 9:00 AM" };
}

// ============================================================================
// PROPS
// ============================================================================

interface GoldPriceCardProps {
  initialPrice?: GoldPrice;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function GoldPriceCard({ initialPrice }: GoldPriceCardProps) {
  const { price, isLoading, lastUpdated } = useLiveGoldPrice(initialPrice);
  
  // ========================================================================
  // LOADING STATE
  // ========================================================================
  if (isLoading && !price) {
    return (
      <div style={CARD_STYLE} className="animate-pulse">
        <div className="h-8 bg-yellow-900/30 rounded w-2/3 mb-4"></div>
        <div className="h-16 bg-yellow-900/30 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-yellow-900/30 rounded w-1/3"></div>
      </div>
    );
  }
  
  if (!price) {
    return (
      <div style={CARD_STYLE}>
        <p style={{ color: GOLD_LIGHT }}>Unable to load gold price</p>
      </div>
    );
  }

  // ========================================================================
  // COMPUTED VALUES
  // ========================================================================
  const changeIndicator = getGoldPriceChangeIndicator(price.change24h);
  const marketStatus = getMCXMarketStatus();
  
  const changeColors = {
    up: { bg: "bg-green-900/50", border: "border-green-600", color: "text-green-400", icon: "▲" },
    down: { bg: "bg-red-900/50", border: "border-red-600", color: "text-red-400", icon: "▼" },
    neutral: { bg: "bg-gray-800/50", border: "border-gray-600", color: "text-gray-400", icon: "•" },
  };
  
  const changeStyle = changeColors[changeIndicator.direction];

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div style={CARD_STYLE}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪙</span>
          <h2 className="text-lg font-bold" style={{ color: GOLD_ACCENT }}>
            Live Gold Rate
          </h2>
        </div>
        
        {/* Badges Row */}
        <div className="flex items-center gap-1.5">
          {/* 24h Change Badge */}
          <div className="relative group">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border cursor-help ${changeStyle.bg} ${changeStyle.border}`}>
              <span className={`text-xs font-bold ${changeStyle.color}`}>
                {changeStyle.icon} {Math.abs(price.changePercent24h).toFixed(1)}%
              </span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
              24H: {price.change24h >= 0 ? "+" : ""}₹{price.change24h.toFixed(0)}/g
            </div>
          </div>
          
          {/* Market Status */}
          <div className="relative group">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full cursor-help ${
              marketStatus.isOpen 
                ? "bg-green-900/50 border border-green-600" 
                : "bg-gray-800/50 border border-gray-600"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                marketStatus.isOpen ? "bg-green-400 animate-pulse" : "bg-gray-400"
              }`} />
              <span className={`text-[10px] font-medium ${
                marketStatus.isOpen ? "text-green-400" : "text-gray-400"
              }`}>
                {marketStatus.isOpen ? "MCX" : "Off"}
              </span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
              {marketStatus.nextChange}
            </div>
          </div>
          
          {/* Calculator Link */}
          <Link
            href="/gold#calculator"
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm transition-colors"
            style={{ background: GOLD_DARK, color: "#000" }}
          >
            🧮
          </Link>
        </div>
      </div>
      
      {/* Main Price Display - 24K */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-bold" style={{ color: GOLD_ACCENT }}>
            {formatIndianGoldPrice(price.price24KPerGram)}
          </span>
          <span className="text-sm" style={{ color: GOLD_LIGHT, opacity: 0.7 }}>/gram</span>
        </div>
        <p className="text-sm mt-1" style={{ color: GOLD_LIGHT, opacity: 0.6 }}>
          24 Karat (999) Pure Gold
        </p>
      </div>
      
      {/* Price Grid - Multiple Purities */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* 22K Price */}
        <div className="rounded-lg p-3" style={{ background: "rgba(255, 215, 0, 0.1)", border: "1px solid rgba(255, 215, 0, 0.2)" }}>
          <p className="text-xs mb-1" style={{ color: GOLD_LIGHT, opacity: 0.6 }}>22K (916) / gram</p>
          <p className="text-lg font-bold" style={{ color: GOLD_ACCENT }}>
            {formatIndianGoldPrice(price.price22KPerGram)}
          </p>
        </div>
        
        {/* 18K Price */}
        <div className="rounded-lg p-3" style={{ background: "rgba(255, 215, 0, 0.1)", border: "1px solid rgba(255, 215, 0, 0.2)" }}>
          <p className="text-xs mb-1" style={{ color: GOLD_LIGHT, opacity: 0.6 }}>18K (750) / gram</p>
          <p className="text-lg font-bold" style={{ color: GOLD_ACCENT }}>
            {formatIndianGoldPrice(price.price18KPerGram)}
          </p>
        </div>
        
        {/* 10 Gram 24K */}
        <div className="rounded-lg p-3" style={{ background: "rgba(255, 215, 0, 0.05)", border: "1px solid rgba(255, 215, 0, 0.15)" }}>
          <p className="text-xs mb-1" style={{ color: GOLD_LIGHT, opacity: 0.6 }}>24K / 10 grams</p>
          <p className="text-lg font-bold" style={{ color: GOLD_LIGHT }}>
            {formatIndianGoldPrice(price.price24KPer10Gram)}
          </p>
        </div>
        
        {/* 1 Tola */}
        <div className="rounded-lg p-3" style={{ background: "rgba(255, 215, 0, 0.05)", border: "1px solid rgba(255, 215, 0, 0.15)" }}>
          <p className="text-xs mb-1" style={{ color: GOLD_LIGHT, opacity: 0.6 }}>24K / Tola (11.66g)</p>
          <p className="text-lg font-bold" style={{ color: GOLD_LIGHT }}>
            {formatIndianGoldPrice(price.price24KPerTola)}
          </p>
        </div>
      </div>
      
      {/* Today's High/Low Section */}
      {(() => {
        const hasRealTracking = price.todayHigh && price.todayLow && price.todayHigh > price.todayLow;
        const displayHigh = hasRealTracking ? price.todayHigh : price.high24h;
        const displayLow = hasRealTracking ? price.todayLow : price.low24h;
        const highTime = hasRealTracking ? price.todayHighTime : undefined;
        const lowTime = hasRealTracking ? price.todayLowTime : undefined;
        const isEstimated = !hasRealTracking;

        if (!displayHigh || !displayLow || displayHigh <= displayLow) {
          return null;
        }

        const currentPrice = price.price24KPerGram;
        const dayRange = displayHigh - displayLow;
        const dayRangePercent = (dayRange / displayLow) * 100;
        const positionInDayRange = ((currentPrice - displayLow) / dayRange) * 100;

        return (
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255, 215, 0, 0.2)" }}>
            <div className="grid grid-cols-2 gap-2">
              {/* Today's High */}
              <div className="rounded-lg p-2 sm:p-3" style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] sm:text-xs font-medium text-green-400 flex items-center gap-1">
                    📈 Today's High
                    {isEstimated && <span className="text-[8px] text-green-500">~</span>}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-green-400">
                  {formatIndianGoldPrice(displayHigh)}
                </p>
                <p className="text-[9px] sm:text-[10px] text-green-400/70">
                  {highTime ? formatHighLowTime(highTime) : isEstimated ? "est. range" : ""}
                </p>
              </div>
              
              {/* Today's Low */}
              <div className="rounded-lg p-2 sm:p-3" style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] sm:text-xs font-medium text-red-400 flex items-center gap-1">
                    📉 Today's Low
                    {isEstimated && <span className="text-[8px] text-red-500">~</span>}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-red-400">
                  {formatIndianGoldPrice(displayLow)}
                </p>
                <p className="text-[9px] sm:text-[10px] text-red-400/70">
                  {lowTime ? formatHighLowTime(lowTime) : isEstimated ? "est. range" : ""}
                </p>
              </div>
            </div>
            
            {/* Day Range Bar */}
            <div className="mt-3 px-1">
              <div className="flex justify-between text-[10px] mb-1" style={{ color: GOLD_LIGHT, opacity: 0.6 }}>
                <span>Range: {formatIndianGoldPrice(dayRange)} ({dayRangePercent.toFixed(2)}%)</span>
                <span>{positionInDayRange.toFixed(0)}% up</span>
              </div>
              <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255, 215, 0, 0.2)" }}>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transform -translate-x-1/2 z-10"
                  style={{
                    left: `${Math.max(5, Math.min(95, positionInDayRange))}%`,
                    background: GOLD_ACCENT,
                    boxShadow: "0 0 6px rgba(255, 215, 0, 0.5)",
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{ background: "linear-gradient(to right, #ef4444, #fbbf24, #22c55e)", opacity: 0.5 }}
                />
              </div>
            </div>
          </div>
        );
      })()}
      
      {/* Footer - Last Updated */}
      <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid rgba(255, 215, 0, 0.1)" }}>
        <p className="text-xs" style={{ color: GOLD_LIGHT, opacity: 0.5 }}>
          Last updated: {lastUpdated?.toLocaleTimeString("en-IN", { 
            hour: "2-digit", 
            minute: "2-digit",
            timeZone: "Asia/Kolkata"
          }) || "Loading..."}
        </p>
        <p className="text-xs" style={{ color: GOLD_LIGHT, opacity: 0.4 }}>
          Source: {price.source === "calculated" ? "COMEX + Forex" : price.source}
        </p>
      </div>
    </div>
  );
}

export default GoldPriceCard;
