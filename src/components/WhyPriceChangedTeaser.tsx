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
        const response = await fetch("/api/price?t=" + Date.now(), {
          cache: "no-store",
        });
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

  return (
    <div className="bg-gradient-to-r from-[#1e3a5f]/5 via-blue-50/50 to-[#1e3a5f]/5 rounded-xl p-3 sm:p-4 border border-[#1e3a5f]/10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Left: Market Data Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
          <span className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-1.5">
            <span className="text-lg">📊</span>
            <span className="hidden sm:inline">Market Pulse:</span>
          </span>
          
          {/* COMEX Price */}
          <Tooltip text={comexTooltip}>
            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-white shadow-sm text-xs sm:text-sm font-mono hover:shadow-md transition-shadow">
              <span className="text-gray-500 mr-1">COMEX</span>
              <span className="font-semibold text-gray-900">${comexUsd.toFixed(2)}</span>
            </span>
          </Tooltip>
          
          {/* USD/INR */}
          <Tooltip text={usdInrTooltip}>
            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-white shadow-sm text-xs sm:text-sm font-mono hover:shadow-md transition-shadow">
              <span className="text-gray-500 mr-1">₹/$</span>
              <span className="font-semibold text-gray-900">{usdInr.toFixed(2)}</span>
            </span>
          </Tooltip>
          
          {/* 24h Change */}
          <Tooltip text={changeTooltip}>
            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs sm:text-sm font-semibold hover:shadow-md transition-shadow ${
              change > 0 
                ? "bg-green-100 text-green-700" 
                : change < 0 
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}>
              {change > 0 ? "↑" : change < 0 ? "↓" : "→"} {Math.abs(change).toFixed(2)}%
            </span>
          </Tooltip>
        </div>
        
        {/* Right: Explanation + Link */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-gray-600 hidden md:inline">{shortExplanation}</span>
          <Link
            href="#why-price-changed"
            className="inline-flex items-center gap-1 text-[#1e3a5f] font-medium hover:underline whitespace-nowrap"
          >
            <span>See full analysis</span>
            <span className="text-lg">↓</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
