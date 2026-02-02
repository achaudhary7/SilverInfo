/**
 * Gold Price Card Component - Light Theme
 * 
 * Displays live gold prices in a clean white card matching home page design.
 * Shows 24K, 22K prices with real-time updates and daily extremes.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Live 24K and 22K gold prices
 * - 24h change indicator
 * - Today's high/low tracking
 * - MCX market status
 * - Light theme with amber accents
 * - Responsive design
 */

"use client";

import { useState, useEffect } from "react";
import { useLiveGoldPrice } from "@/hooks/useLiveGoldPrice";
import { formatIndianGoldPrice, getGoldPriceChangeIndicator } from "@/lib/goldApi";
import type { GoldPrice } from "@/lib/goldApi";
import Link from "next/link";
import ShareButtons from "@/components/ui/ShareButtons";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getMCXMarketStatus(): { isOpen: boolean; status: string; nextChange: string } {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  
  const hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes();
  const day = istDate.getUTCDay();
  const time = hours * 60 + minutes;
  
  if (day === 0 || day === 6) {
    return { isOpen: false, status: "Weekend Closed", nextChange: "Opens Monday 9:00 AM" };
  }
  
  const openTime = 9 * 60;
  const closeTime = 23 * 60 + 30;
  
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
  
  // Defer market status calculation to client to avoid hydration mismatch
  const [marketStatus, setMarketStatus] = useState<{ isOpen: boolean; status: string; nextChange: string }>({
    isOpen: true,
    status: "MCX",
    nextChange: "Loading..." // Static placeholder for SSR
  });
  
  useEffect(() => {
    // Calculate immediately on mount
    setMarketStatus(getMCXMarketStatus());
    
    // Update every minute
    const interval = setInterval(() => {
      setMarketStatus(getMCXMarketStatus());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Loading State
  if (isLoading && !price) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-8 bg-amber-100 rounded w-2/3 mb-4"></div>
        <div className="h-16 bg-amber-100 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-amber-100 rounded w-1/3"></div>
      </div>
    );
  }
  
  if (!price) {
    return (
      <div className="card p-6">
        <p className="text-gray-500">Unable to load gold price</p>
      </div>
    );
  }

  const changeIndicator = getGoldPriceChangeIndicator(price.change24h);
  
  const changeColors = {
    up: { bg: "bg-green-100", border: "border-green-300", color: "text-green-700", icon: "▲" },
    down: { bg: "bg-red-100", border: "border-red-300", color: "text-red-700", icon: "▼" },
    neutral: { bg: "bg-gray-100", border: "border-gray-300", color: "text-gray-700", icon: "•" },
  };
  
  const changeStyle = changeColors[changeIndicator.direction];

  return (
    <div className="card p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🪙</span>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Gold Rate Today</h2>
            <div className="flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              <span className="text-[10px] text-green-600 font-medium">LIVE</span>
              <span className="text-[10px] text-gray-400">• Calculated</span>
            </div>
          </div>
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
                ? "bg-green-100 border border-green-300" 
                : "bg-gray-100 border border-gray-300"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                marketStatus.isOpen ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`} />
              <span className={`text-[10px] font-medium ${
                marketStatus.isOpen ? "text-green-700" : "text-gray-500"
              }`}>
                MCX
              </span>
            </div>
            <div 
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"
              suppressHydrationWarning={true}
            >
              {marketStatus.nextChange}
            </div>
          </div>
          
          {/* Calculator Link */}
          <Link
            href="/gold#calculator"
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm transition-colors bg-amber-100 hover:bg-amber-200 text-amber-700"
          >
            🧮
          </Link>
        </div>
      </div>
      
      {/* Main Price Display - 24K */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-bold text-amber-700">
            {formatIndianGoldPrice(price.price24KPerGram)}
          </span>
          <span className="text-sm text-gray-500">/gram</span>
        </div>
        <p className="text-sm mt-1 text-gray-500">
          24 Karat (999) Pure Gold
        </p>
      </div>
      
      {/* Price Grid - Multiple Purities */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* 22K Price */}
        <div className="rounded-lg p-3 bg-amber-50 border border-amber-100">
          <p className="text-xs mb-1 text-gray-500">22K (916) / gram</p>
          <p className="text-lg font-bold text-amber-700">
            {formatIndianGoldPrice(price.price22KPerGram)}
          </p>
        </div>
        
        {/* 18K Price */}
        <div className="rounded-lg p-3 bg-amber-50 border border-amber-100">
          <p className="text-xs mb-1 text-gray-500">18K (750) / gram</p>
          <p className="text-lg font-bold text-amber-700">
            {formatIndianGoldPrice(price.price18KPerGram)}
          </p>
        </div>
        
        {/* 10 Gram 24K */}
        <div className="rounded-lg p-3 bg-gray-50 border border-gray-100">
          <p className="text-xs mb-1 text-gray-500">24K / 10 grams</p>
          <p className="text-lg font-bold text-gray-900">
            {formatIndianGoldPrice(price.price24KPer10Gram)}
          </p>
        </div>
        
        {/* 1 Tola */}
        <div className="rounded-lg p-3 bg-gray-50 border border-gray-100">
          <p className="text-xs mb-1 text-gray-500">24K / Tola (11.66g)</p>
          <p className="text-lg font-bold text-gray-900">
            {formatIndianGoldPrice(price.price24KPerTola)}
          </p>
        </div>
      </div>
      
      {/* Popular Cities Quick Links */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Popular Cities:</p>
          <div className="flex gap-2">
            <span className="text-xs text-amber-700 hover:underline cursor-pointer">Mumbai</span>
            <span className="text-xs text-amber-700 hover:underline cursor-pointer">Delhi</span>
            <span className="text-xs text-amber-700 hover:underline cursor-pointer">Chennai</span>
            <span className="text-xs text-amber-700 hover:underline cursor-pointer">Bangalore</span>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2 text-center">Share Gold Rate:</p>
        <ShareButtons 
          url="https://silverinfo.in/gold"
          title={`🪙 Gold Rate Today: 24K ₹${formatIndianGoldPrice(price.price24KPerGram)}/g, 22K ₹${formatIndianGoldPrice(price.price22KPerGram)}/g | Live prices at SilverInfo.in`}
          variant="light"
        />
      </div>
      
      {/* Footer - Last Updated */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400" suppressHydrationWarning={true}>
          Last updated: {lastUpdated?.toLocaleTimeString("en-IN", { 
            hour: "2-digit", 
            minute: "2-digit",
            timeZone: "Asia/Kolkata"
          }) || "Loading..."}
        </p>
        <p className="text-xs text-gray-400">
          Source: {price.source === "calculated" ? "COMEX + Forex" : price.source}
        </p>
      </div>
    </div>
  );
}

export default GoldPriceCard;
