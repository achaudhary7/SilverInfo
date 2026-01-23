"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLivePrice, formatTimeAgo } from "@/hooks/useLivePrice";
import { formatIndianPrice, type SilverPrice } from "@/lib/metalApi";

interface LivePriceCardProps {
  initialPrice: SilverPrice;
  pollInterval?: number;
  lastWeekPrice?: number; // Price from 7 days ago for comparison
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

export default function LivePriceCard({ initialPrice, pollInterval = 60000, lastWeekPrice }: LivePriceCardProps) {
  const { price, secondsAgo, isRefreshing, hasNewPrice, refresh } = useLivePrice({
    initialPrice,
    pollInterval,
    enabled: true,
  });
  
  const [marketStatus, setMarketStatus] = useState({ isOpen: true, label: "MCX Open" });
  const [showShareToast, setShowShareToast] = useState(false);
  const changeIndicator = getChangeIndicator(price.change24h);
  
  // Calculate week-over-week change
  const weekChange = lastWeekPrice ? price.pricePerGram - lastWeekPrice : null;
  const weekChangePercent = lastWeekPrice ? ((price.pricePerGram - lastWeekPrice) / lastWeekPrice) * 100 : null;
  
  useEffect(() => {
    setMarketStatus(getMarketStatus());
    const interval = setInterval(() => {
      setMarketStatus(getMarketStatus());
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Share price function
  const handleShare = async () => {
    const shareText = `Silver Rate Today: ₹${price.pricePerGram.toFixed(2)}/gram (${price.changePercent24h >= 0 ? "+" : ""}${price.changePercent24h.toFixed(2)}% 24h)\n\nPer 10g: ₹${price.pricePer10Gram.toFixed(2)}\nPer Kg: ₹${price.pricePerKg.toFixed(2)}\n\nLive prices on SilverInfo.in`;
    const shareUrl = "https://silverinfo.in";
    
    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Silver Rate Today - SilverInfo.in",
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or error, fall through to WhatsApp
      }
    }
    
    // Fallback to WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
    window.open(whatsappUrl, "_blank");
    
    // Show toast
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };
  
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
          <div className="relative group">
            <div 
              className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border cursor-help ${changeIndicator.bg} ${changeIndicator.border}`}
            >
              <span className={`text-xs sm:text-sm font-bold ${changeIndicator.color}`}>
                {changeIndicator.icon} {Math.abs(price.changePercent24h).toFixed(2)}%
              </span>
              <svg className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${changeIndicator.color} opacity-60`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
              <div className="space-y-1">
                <p className="font-semibold text-gray-300">24h Price Change</p>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Change:</span>
                  <span className={price.change24h >= 0 ? "text-green-400" : "text-red-400"}>
                    {price.change24h >= 0 ? "+" : ""}₹{price.change24h.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Percent:</span>
                  <span className={price.changePercent24h >= 0 ? "text-green-400" : "text-red-400"}>
                    {price.changePercent24h >= 0 ? "+" : ""}{price.changePercent24h.toFixed(2)}%
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 pt-1 border-t border-gray-700">vs yesterday&apos;s close (COMEX)</p>
              </div>
              <span className="absolute bottom-full right-4 border-4 border-transparent border-b-gray-900"></span>
            </div>
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
      
      {/* Week Comparison - Only show if lastWeekPrice is available */}
      {weekChange !== null && weekChangePercent !== null && lastWeekPrice && (
        <div 
          className={`mt-4 p-3 rounded-lg border cursor-help relative group ${
            weekChange > 0 
              ? "bg-green-50/50 border-green-200" 
              : weekChange < 0 
              ? "bg-red-50/50 border-red-200"
              : "bg-gray-50 border-gray-200"
          }`}
          title={`Today: ₹${price.pricePerGram.toFixed(2)} | 7 days ago: ₹${lastWeekPrice.toFixed(2)} | Change: ₹${weekChange.toFixed(2)} (${weekChangePercent.toFixed(2)}%)`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 flex items-center gap-1">
              vs Last Week
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className={`text-sm font-semibold ${
              weekChange > 0 ? "text-green-600" : weekChange < 0 ? "text-red-600" : "text-gray-600"
            }`}>
              {weekChange > 0 ? "↑" : weekChange < 0 ? "↓" : "→"} ₹{Math.abs(weekChange).toFixed(2)} ({weekChangePercent > 0 ? "+" : ""}{weekChangePercent.toFixed(2)}%)
            </span>
          </div>
          
          {/* Detailed Tooltip on Hover */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
            <div className="space-y-1">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Today:</span>
                <span className="font-semibold">₹{price.pricePerGram.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">7 days ago:</span>
                <span>₹{lastWeekPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 pt-1 mt-1">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">Difference:</span>
                  <span className={weekChange > 0 ? "text-green-400" : weekChange < 0 ? "text-red-400" : ""}>
                    {weekChange > 0 ? "+" : ""}₹{weekChange.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></span>
          </div>
        </div>
      )}

      {/* Live Status Bar - Mobile optimized */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
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
          
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#1e3a5f] transition-colors py-2 px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
            title="Share price on WhatsApp"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
        
        <Link 
          href="/how-we-calculate" 
          className="flex items-center gap-1.5 hover:text-[#1e3a5f] transition-colors py-2 px-3 sm:-mr-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
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
      
      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-50 animate-pulse">
          Opening WhatsApp...
        </div>
      )}
      
      <p className="mt-2 text-center text-[10px] sm:text-xs text-gray-400 leading-relaxed">
        Indicative price from COMEX • Not official MCX rate •{" "}
        <Link href="/how-we-calculate" className="underline hover:text-gray-600">
          How we calculate
        </Link>
      </p>
    </div>
  );
}
