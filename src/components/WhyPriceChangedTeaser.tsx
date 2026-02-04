"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MarketData {
  pricePerGram: number;
  change24h: number;
  changePercent24h: number;
  usdInr: number;
  comexUsd: number;
}

/**
 * Tooltip wrapper component
 */
function Tooltip({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <span className="relative group cursor-help">
      {children}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] sm:text-xs text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 shadow-lg">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
      </span>
    </span>
  );
}

/**
 * WhyPriceChangedTeaser Component
 * 
 * A compact one-line teaser that appears in the hero area.
 * Links to the full "Why Price Changed" section below.
 */
export default function WhyPriceChangedTeaser() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from API - server-side caching handles freshness
        // Note: `next: { revalidate }` doesn't work in client components
        // Edge caching via Cache-Control headers in API route handles this
        const response = await fetch("/api/price");
        if (response.ok) {
          const data = await response.json();
          setMarketData(data);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-[#1e3a5f]/5 to-blue-50 rounded-xl p-3 sm:p-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>
    );
  }

  if (!marketData) {
    return null;
  }

  const change = marketData.changePercent24h || 0;
  const usdInr = marketData.usdInr || 84;
  const comexUsd = marketData.comexUsd || 30;
  
  // Generate short explanation based on change
  const shortExplanation = change > 0.5 
    ? "Rupee weakened, driving prices up"
    : change < -0.5 
    ? "Rupee strengthened, prices cooling"
    : "Markets stable, prices steady";

  // Dynamic tooltip content based on market conditions
  const comexTooltip = change > 0.5
    ? `🌍 COMEX at $${comexUsd.toFixed(2)}/oz ↑ Strong global demand from investors`
    : change < -0.5
    ? `🌍 COMEX at $${comexUsd.toFixed(2)}/oz ↓ Profit booking in international markets`
    : `🌍 COMEX at $${comexUsd.toFixed(2)}/oz → Markets in consolidation`;

  const usdInrTooltip = change > 0.3
    ? `💱 Rupee at ₹${usdInr.toFixed(2)}/USD ↑ Weaker rupee makes silver costlier`
    : change < -0.3
    ? `💱 Rupee at ₹${usdInr.toFixed(2)}/USD ↓ Stronger rupee reduces silver prices`
    : `💱 Rupee at ₹${usdInr.toFixed(2)}/USD → Exchange rate stable today`;

  const changeTooltip = Math.abs(change) > 1
    ? change > 0
      ? `🚀 High Volatility! Silver surged ${change.toFixed(2)}% today`
      : `⚠️ High Volatility! Silver dropped ${Math.abs(change).toFixed(2)}% today`
    : `📊 24h change in Indian silver rate`;

  // Generate primary reason for price change
  const getPrimaryReason = () => {
    if (Math.abs(change) > 2) {
      return change > 0 
        ? { icon: "🚀", text: "High volatility - Strong buying interest today" }
        : { icon: "⚠️", text: "High volatility - Selling pressure in markets" };
    } else if (Math.abs(change) > 0.5) {
      return change > 0
        ? { icon: "💱", text: "Weaker rupee + global demand pushing prices up" }
        : { icon: "💱", text: "Stronger rupee bringing prices down" };
    }
    return { icon: "📊", text: "Markets stable - Minor price fluctuations" };
  };

  const primaryReason = getPrimaryReason();

  return (
    <div className="bg-gradient-to-r from-[#1e3a5f]/5 via-blue-50/50 to-[#1e3a5f]/5 rounded-xl p-4 sm:p-5 border border-[#1e3a5f]/10">
      {/* Title Row - Visible on all devices */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <span className="text-base sm:text-lg font-semibold text-gray-800">
            Why Price Changed Today
          </span>
        </div>
        <Link
          href="#market-factors"
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1e3a5f]/10 hover:bg-[#1e3a5f]/20 rounded-lg transition-colors active:scale-95 min-h-[44px]"
        >
          <span className="text-xs sm:text-sm text-[#1e3a5f] font-medium">See details</span>
          <span className="text-[#1e3a5f]">↓</span>
        </Link>
      </div>

      {/* Primary Reason - Always Visible */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-4 ${
        change > 0.5 
          ? "bg-green-100/70 border border-green-200" 
          : change < -0.5 
          ? "bg-red-100/70 border border-red-200"
          : "bg-gray-100/70 border border-gray-200"
      }`}>
        <span className="text-2xl">{primaryReason.icon}</span>
        <span className={`text-sm sm:text-base font-medium ${
          change > 0.5 ? "text-green-800" : change < -0.5 ? "text-red-800" : "text-gray-700"
        }`}>
          {primaryReason.text}
        </span>
      </div>

      {/* Market Data Pills - 3 columns centered */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
        {/* COMEX Price */}
        <Tooltip text={comexTooltip}>
          <div className="flex flex-col items-center px-2 sm:px-4 py-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow text-center">
            <span className="text-[10px] sm:text-xs text-gray-500 mb-1">COMEX</span>
            <span className="text-sm sm:text-lg font-bold text-gray-900">${comexUsd.toFixed(2)}</span>
            <span className="text-[10px] sm:text-[11px] text-gray-400">per oz</span>
          </div>
        </Tooltip>
        
        {/* USD/INR */}
        <Tooltip text={usdInrTooltip}>
          <div className="flex flex-col items-center px-2 sm:px-4 py-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow text-center">
            <span className="text-[10px] sm:text-xs text-gray-500 mb-1">USD/INR</span>
            <span className="text-sm sm:text-lg font-bold text-gray-900">₹{usdInr.toFixed(2)}</span>
            <span className="text-[10px] sm:text-[11px] text-gray-400">exchange</span>
          </div>
        </Tooltip>
        
        {/* 24h Change */}
        <Tooltip text={changeTooltip}>
          <div className={`flex flex-col items-center px-2 sm:px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center ${
            change > 0 
              ? "bg-green-50 border border-green-200" 
              : change < 0 
              ? "bg-red-50 border border-red-200"
              : "bg-gray-50 border border-gray-200"
          }`}>
            <span className="text-[10px] sm:text-xs text-gray-500 mb-1">24h Change</span>
            <span className={`text-sm sm:text-lg font-bold ${
              change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
            }`}>
              {change > 0 ? "↑" : change < 0 ? "↓" : "→"} {Math.abs(change).toFixed(2)}%
            </span>
            <span className="text-[10px] sm:text-[11px] text-gray-400">in INR</span>
          </div>
        </Tooltip>
      </div>

      {/* Market Status - Full Width */}
      <div className="flex flex-col px-4 py-3 rounded-lg bg-blue-50 border border-blue-200">
        <span className="text-xs text-blue-600 font-medium mb-1">📈 Market Status</span>
        <span className="text-xs sm:text-sm text-blue-800">
          {change > 0.5 
            ? "Prices trending higher than yesterday"
            : change < -0.5
            ? "Prices trending lower than yesterday"
            : "Prices stable compared to yesterday"
          }
        </span>
      </div>
    </div>
  );
}
