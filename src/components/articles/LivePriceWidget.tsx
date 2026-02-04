"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useVisibilityAwarePolling, DEFAULT_POLL_INTERVAL } from "@/hooks/useVisibilityAwarePolling";
import { fetchSilverPrice } from "@/lib/clientPriceApi";

interface PriceData {
  pricePerGram: number;
  pricePerKg: number;
  change24h: number;
  changePercent24h: number;
  lastUpdated: string;
}

/**
 * LivePriceWidget - Embedded live price display for articles
 * 
 * Shows current silver price with 24h change.
 * Uses visibility-aware polling with 6-hour interval to minimize Edge Requests.
 * Refreshes immediately when user returns to tab.
 * Used in blog posts and articles to show real-time data.
 */
export default function LivePriceWidget() {
  const [price, setPrice] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPriceData = useCallback(async () => {
    try {
      const priceData = await fetchSilverPrice();
      if (priceData) {
        setPrice({
          pricePerGram: priceData.pricePerGram,
          pricePerKg: priceData.pricePerKg,
          change24h: priceData.change24h,
          changePercent24h: priceData.changePercent24h,
          lastUpdated: priceData.timestamp,
        });
      }
    } catch (error) {
      console.error("Error fetching price:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Use visibility-aware polling - pauses when tab is hidden
  // 6-hour interval maximizes cost savings, fetchOnVisible ensures fresh data
  useVisibilityAwarePolling({
    callback: fetchPriceData,
    interval: DEFAULT_POLL_INTERVAL, // 6 hours
    enabled: true,
    fetchOnMount: true,
    fetchOnVisible: true,
  });

  if (isLoading) {
    return (
      <div className="my-6 p-4 bg-gradient-to-r from-[#1e3a5f]/5 to-blue-50 rounded-xl border border-[#1e3a5f]/10 animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!price) {
    return null;
  }

  const isPositive = price.change24h >= 0;

  return (
    <div className="my-6 p-4 sm:p-5 bg-gradient-to-r from-[#1e3a5f]/5 via-blue-50/50 to-[#1e3a5f]/5 rounded-xl border border-[#1e3a5f]/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-gray-600">Live Silver Price</span>
        </div>
        <span className="text-xs text-gray-400">
          Updated: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Price per Gram */}
        <div className="text-center sm:text-left">
          <p className="text-xs text-gray-500 mb-1">Per Gram</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            ₹{price.pricePerGram.toFixed(2)}
          </p>
        </div>

        {/* Price per Kg */}
        <div className="text-center sm:text-left">
          <p className="text-xs text-gray-500 mb-1">Per Kg</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            ₹{price.pricePerKg.toLocaleString("en-IN")}
          </p>
        </div>

        {/* 24h Change */}
        <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
          <p className="text-xs text-gray-500 mb-1">24h Change</p>
          <p className={`text-xl sm:text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "↑" : "↓"} {Math.abs(price.changePercent24h).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap gap-3 text-sm">
        <Link href="/silver-rate-today" className="text-[#1e3a5f] hover:underline font-medium">
          View Full Dashboard →
        </Link>
        <Link href="/silver-price-calculator" className="text-[#1e3a5f] hover:underline font-medium">
          Calculate Cost →
        </Link>
      </div>
    </div>
  );
}
