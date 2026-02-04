"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLivePrice, formatTimeAgo } from "@/hooks/useLivePrice";
import { formatIndianPrice, type SilverPrice } from "@/lib/metalApi";
import { PriceSourceInline } from "@/components/ui/PriceSourceBadge";
import { DEFAULT_POLL_INTERVAL } from "@/hooks/useVisibilityAwarePolling";

// Extended price type with daily extremes from API
interface ExtendedSilverPrice extends SilverPrice {
  todayHigh?: number;
  todayHighTime?: string;
  todayLow?: number;
  todayLowTime?: string;
  todayOpen?: number;
}

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

export default function LivePriceCard({ initialPrice, pollInterval = DEFAULT_POLL_INTERVAL, lastWeekPrice }: LivePriceCardProps) {
  const { price: basePrice, secondsAgo, isRefreshing, hasNewPrice, refresh } = useLivePrice({
    initialPrice,
    pollInterval,
    enabled: true,
  });
  
  // Cast to extended type to access daily extremes
  const price = basePrice as ExtendedSilverPrice;
  
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

  // Share price text generator
  const getShareText = () => {
    return `🪙 Silver Rate Today: ₹${price.pricePerGram.toFixed(2)}/gram (${price.changePercent24h >= 0 ? "+" : ""}${price.changePercent24h.toFixed(2)}%)\n\n📊 Per 10g: ₹${price.pricePer10Gram.toFixed(2)}\n📊 Per Kg: ₹${price.pricePerKg.toLocaleString("en-IN")}\n\n✅ Live prices derived from COMEX + RBI rates\n\n🔗 Check live prices:`;
  };
  
  const shareUrl = "https://silverinfo.in";

  // Share via native share (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Silver Rate Today - SilverInfo.in",
          text: getShareText(),
          url: shareUrl,
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  };

  // Share via WhatsApp
  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(getShareText() + " " + shareUrl)}`;
    window.open(whatsappUrl, "_blank");
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  // Share via Twitter/X
  const handleTwitterShare = () => {
    const tweetText = `Silver Rate Today: ₹${price.pricePerGram.toFixed(2)}/gram (${price.changePercent24h >= 0 ? "+" : ""}${price.changePercent24h.toFixed(2)}%) - Live from COMEX + RBI rates`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank");
  };

  // Generic share handler
  const handleShare = async () => {
    const shared = await handleNativeShare();
    if (!shared) {
      handleWhatsAppShare();
    }
  };
  
  return (
    <div className="card p-4 sm:p-6 relative overflow-hidden">
      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 animate-pulse" />
      )}
      
      {/* Main Price Display - Always horizontal */}
      <div className="flex items-start justify-between gap-2 mb-4">
        {/* Left: Price */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <p className="text-xs sm:text-sm text-gray-500">Silver Rate Today</p>
            {/* Live Indicator */}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-50 border border-green-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-medium text-green-700">LIVE</span>
            </span>
            {/* Price Source */}
            <PriceSourceInline source={price.source || "calculated"} />
          </div>
          <p 
            className={`text-2xl sm:text-4xl font-bold text-gray-900 price-display transition-all duration-300 ${
              hasNewPrice ? "scale-105 text-green-600" : ""
            }`}
          >
            {formatIndianPrice(price.pricePerGram)}
            <span className="text-xs sm:text-lg font-normal text-gray-500">/gram</span>
          </p>
        </div>
        
        {/* Right: All badges in one row */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* 24h Change Badge with Tooltip */}
          <div className="relative group">
            <div 
              className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border cursor-help ${changeIndicator.bg} ${changeIndicator.border}`}
            >
              <span className={`text-[10px] sm:text-xs font-bold ${changeIndicator.color}`}>
                {changeIndicator.icon}{Math.abs(price.changePercent24h).toFixed(1)}%
              </span>
            </div>
            {/* 24h Change Tooltip */}
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
          
          {/* Market Status with Tooltip */}
          <div className="relative group">
            <div 
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 sm:py-1 rounded-full cursor-help ${
                marketStatus.isOpen 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                marketStatus.isOpen ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`} />
              <span className="text-[9px] sm:text-[10px] font-medium">
                {marketStatus.isOpen ? "MCX" : "Off"}
              </span>
            </div>
            {/* Market Status Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
              <div className="space-y-1">
                <p className="font-semibold text-gray-300">Market Status</p>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-400">MCX:</span>
                  <span className={marketStatus.isOpen ? "text-green-400" : "text-gray-400"}>
                    {marketStatus.label}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 pt-1 border-t border-gray-700">
                  MCX: Mon-Fri, 9AM-11:30PM IST
                </p>
              </div>
              <span className="absolute bottom-full right-4 border-4 border-transparent border-b-gray-900"></span>
            </div>
          </div>
          
          {/* Calculator Button with Tooltip */}
          <div className="relative group">
            <Link
              href="/silver-price-calculator"
              className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-[#1e3a5f] text-white rounded-full text-[10px] sm:text-xs hover:bg-[#2c5282] transition-colors"
            >
              🧮
            </Link>
            {/* Calculator Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
              <p className="font-semibold">Silver Calculator</p>
              <p className="text-[10px] text-gray-400">Calculate price with GST & making charges</p>
              <span className="absolute bottom-full right-4 border-4 border-transparent border-b-gray-900"></span>
            </div>
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

      {/* Data Source Badges */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[10px] text-gray-400">Powered by:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-medium text-blue-700">
            🌍 COMEX
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full text-[10px] font-medium text-green-700">
            🏛️ RBI Forex
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-200 rounded-full text-[10px] font-medium text-orange-700">
            📊 Real-time
          </span>
        </div>
      </div>

      {/* Live Status Bar - Mobile optimized */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1">
          {/* Refresh/Verified Button */}
          <button
            onClick={refresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-gray-500 hover:text-[#1e3a5f] transition-colors disabled:opacity-50 py-2 px-2 -ml-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
            title="Click to refresh price"
          >
            <span className={`${isRefreshing ? "animate-spin" : ""}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </span>
            <span className="text-gray-600">
              {isRefreshing ? "Verifying from COMEX..." : (
                <>
                  <span className="text-green-600 font-medium">✓ COMEX Verified</span> {formatTimeAgo(secondsAgo)}
                </>
              )}
            </span>
          </button>
          
          <span className="text-gray-300">|</span>
          
          {/* Share Buttons Group */}
          <div className="flex items-center">
            {/* WhatsApp Share */}
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors py-2 px-2 rounded-lg hover:bg-green-50 active:bg-green-100 min-h-[44px]"
              title="Share on WhatsApp"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
            
            {/* Twitter/X Share */}
            <button
              onClick={handleTwitterShare}
              className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors py-2 px-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 min-h-[44px]"
              title="Share on X (Twitter)"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>
            
            {/* Native Share (Mobile) */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-gray-500 hover:text-[#1e3a5f] transition-colors py-2 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
              title="More share options"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
        
        <Link 
          href="/how-we-calculate" 
          className="flex items-center gap-1.5 text-gray-500 hover:text-[#1e3a5f] transition-colors py-2 px-2 sm:-mr-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="underline decoration-dotted">How we calculate</span>
        </Link>
      </div>
      
      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-50 flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Opening WhatsApp...
        </div>
      )}
      
      <p className="mt-3 text-center text-[10px] text-gray-400 leading-relaxed">
        Indicative price • Not official MCX rate •{" "}
        <Link href="/how-we-calculate" className="underline hover:text-gray-600">
          See methodology
        </Link>
      </p>
    </div>
  );
}
