"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLivePrice, formatTimeAgo } from "@/hooks/useLivePrice";
import { formatIndianPrice, type SilverPrice } from "@/lib/metalApi";

interface LivePriceCardProps {
  initialPrice: SilverPrice;
  pollInterval?: number;
}

// Check if MCX market is open (9 AM - 11:30 PM IST, Mon-Fri)
function getMarketStatus(): { isOpen: boolean; label: string } {
  const now = new Date();
  // Convert to IST
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = istTime.getDay(); // 0 = Sunday
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  // MCX: Monday-Friday, 9:00 AM - 11:30 PM IST
  const mcxOpen = 9 * 60; // 9:00 AM
  const mcxClose = 23 * 60 + 30; // 11:30 PM
  
  if (day >= 1 && day <= 5 && totalMinutes >= mcxOpen && totalMinutes <= mcxClose) {
    return { isOpen: true, label: "MCX Open" };
  }
  
  // Check COMEX (nearly 24/5)
  if (day >= 1 && day <= 5) {
    return { isOpen: true, label: "COMEX Active" };
  }
  
  return { isOpen: false, label: "Markets Closed" };
}

// Get change indicator
function getChangeIndicator(change: number) {
  if (change > 0) return { icon: "↑", direction: "up" as const, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
  if (change < 0) return { icon: "↓", direction: "down" as const, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  return { icon: "→", direction: "neutral" as const, color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" };
}

export default function LivePriceCard({ initialPrice, pollInterval = 60000 }: LivePriceCardProps) {
  const { price, secondsAgo, isRefreshing, hasNewPrice, refresh } = useLivePrice({
    initialPrice,
    pollInterval,
    enabled: true,
  });
  
  const [marketStatus, setMarketStatus] = useState({ isOpen: true, label: "MCX Open" });
  const changeIndicator = getChangeIndicator(price.change24h);
  
  useEffect(() => {
    setMarketStatus(getMarketStatus());
    const interval = setInterval(() => {
      setMarketStatus(getMarketStatus());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="card p-4 sm:p-6 relative overflow-hidden">
      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 animate-pulse" />
      )}
      
      {/* Main Price Display */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs sm:text-sm text-gray-500">Silver Rate Today</p>
            {/* Live Indicator */}
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-green-50 border border-green-200">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-green-700">LIVE</span>
            </span>
          </div>
          <p 
            className={`text-3xl sm:text-4xl font-bold text-gray-900 price-display transition-all duration-300 ${
              hasNewPrice ? "scale-105 text-green-600" : ""
            }`}
          >
            {formatIndianPrice(price.pricePerGram)}
            <span className="text-sm sm:text-lg font-normal text-gray-500">/gram</span>
          </p>
        </div>
        
        {/* Right Side: 24h Change + Market Status + Calculate */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:space-y-2">
          {/* 24h Change Badge */}
          <div 
            className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border ${changeIndicator.bg} ${changeIndicator.border}`}
            title={`24h change: ${price.change24h >= 0 ? "+" : ""}₹${price.change24h.toFixed(2)} vs yesterday's close (COMEX)`}
          >
            <span className={`text-xs sm:text-sm font-bold ${changeIndicator.color}`}>
              {changeIndicator.icon} {Math.abs(price.changePercent24h).toFixed(2)}%
            </span>
          </div>
          <p className="hidden sm:block text-xs text-gray-400">24h change</p>
          
          {/* Market Status + Calculate Row */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Market Status */}
            <div 
              className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs ${
                marketStatus.isOpen 
                  ? "bg-green-50 text-green-700" 
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                marketStatus.isOpen ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`} />
              <span className="font-medium hidden sm:inline">{marketStatus.label}</span>
              <span className="font-medium sm:hidden">{marketStatus.isOpen ? "Open" : "Closed"}</span>
            </div>
            
            {/* Quick Action Button */}
            <Link
              href="/silver-price-calculator"
              className="inline-flex items-center gap-1 px-2 py-1 bg-[#1e3a5f] text-white rounded-full text-xs font-medium hover:bg-[#2c5282] transition-colors min-h-[32px] sm:min-h-0"
            >
              <span>🧮</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Price Grid - Responsive */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-gray-100">
        <div className="text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Per 10g</p>
          <p className={`text-sm sm:text-lg font-semibold text-gray-900 price-display transition-all duration-300 ${
            hasNewPrice ? "text-green-600" : ""
          }`}>
            {formatIndianPrice(price.pricePer10Gram)}
          </p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Per Kg</p>
          <p className={`text-sm sm:text-lg font-semibold text-gray-900 price-display transition-all duration-300 ${
            hasNewPrice ? "text-green-600" : ""
          }`}>
            {formatIndianPrice(price.pricePerKg)}
          </p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Per Tola</p>
          <p className={`text-sm sm:text-lg font-semibold text-gray-900 price-display transition-all duration-300 ${
            hasNewPrice ? "text-green-600" : ""
          }`}>
            {formatIndianPrice(price.pricePerTola)}
          </p>
        </div>
      </div>
      
      {/* Quick City Links - Scrollable on mobile */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-gray-500">Popular Cities:</p>
          <div className="flex gap-1 sm:gap-2 flex-wrap sm:flex-nowrap">
            {["Mumbai", "Delhi", "Chennai", "Bangalore"].map((city) => (
              <Link
                key={city}
                href={`/city/${city.toLowerCase()}`}
                className="text-xs text-[#1e3a5f] hover:underline px-2 py-1.5 sm:py-0 bg-gray-50 sm:bg-transparent rounded-md sm:rounded-none min-h-[36px] sm:min-h-0 flex items-center"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Live Status Bar - Mobile optimized */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-gray-500 hover:text-[#1e3a5f] transition-colors disabled:opacity-50 py-2 px-3 -ml-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
        >
          <span className={`${isRefreshing ? "animate-spin" : ""}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </span>
          <span>{isRefreshing ? "Updating..." : `Updated ${formatTimeAgo(secondsAgo)}`}</span>
        </button>
        
        <Link 
          href="/how-we-calculate" 
          className="flex items-center gap-1.5 hover:text-[#1e3a5f] transition-colors py-2 px-3 -mr-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-gray-500 hover:text-[#1e3a5f] underline decoration-dotted">
            COMEX + Duties
          </span>
          <span className="hidden sm:inline text-gray-400">
            • {pollInterval / 1000}s refresh
          </span>
        </Link>
      </div>
      
      <p className="mt-2 text-center text-[10px] sm:text-xs text-gray-400 leading-relaxed">
        Indicative price from COMEX • Not official MCX rate •{" "}
        <Link href="/how-we-calculate" className="underline hover:text-gray-600">
          How we calculate
        </Link>
      </p>
    </div>
  );
}
