/**
 * LiveUSDPriceCard Component
 *
 * Client-side component showing live silver price in USD with auto-refresh.
 * Primary display unit: Troy Ounce (US standard)
 *
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Live price updates every 30 seconds
 * - LIVE badge with pulsing animation
 * - Price change animation
 * - Per ounce (primary), per gram (secondary)
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CombinedUSDPrices } from "@/lib/metalApi";
import LiveBadge from "@/components/ui/LiveBadge";

interface LiveUSDPriceCardProps {
  initialPrices: CombinedUSDPrices;
}

export default function LiveUSDPriceCard({ initialPrices }: LiveUSDPriceCardProps) {
  const [prices, setPrices] = useState<CombinedUSDPrices>(initialPrices);
  const [lastUpdate, setLastUpdate] = useState<string>(initialPrices.timestamp);
  const [isLoading, setIsLoading] = useState(false);
  const [priceChanged, setPriceChanged] = useState(false);

  // Track previous price for change detection
  const prevPrice = useRef(initialPrices.silver.pricePerOz);

  // Format USD price
  const formatUSD = useCallback((price: number, decimals: number = 2): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);
  }, []);

  // Fetch live prices
  const fetchPrices = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/silver-price-usd");

      if (response.ok) {
        const data: CombinedUSDPrices = await response.json();

        // Detect price change
        if (data.silver.pricePerOz !== prevPrice.current) {
          setPriceChanged(true);
          setTimeout(() => setPriceChanged(false), 1000);
          prevPrice.current = data.silver.pricePerOz;
        }

        setPrices(data);
        setLastUpdate(data.timestamp);
      }
    } catch (error) {
      console.error("Error fetching USD prices:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Poll every 30 seconds
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return (
    <section className="mb-8">
      {/* Live indicator header */}
      <div className="flex items-center justify-between mb-4">
        <LiveBadge
          lastUpdate={lastUpdate}
          variant="prominent"
          showTimestamp={true}
        />
        {isLoading && (
          <span className="text-xs text-gray-500 animate-pulse">
            Updating...
          </span>
        )}
      </div>

      {/* Main Price Card */}
      <div
        className={`bg-gradient-to-br from-blue-500/20 to-slate-600/10 rounded-2xl p-6 md:p-8 border border-blue-500/30 transition-all duration-300 ${
          priceChanged ? "ring-2 ring-blue-400 ring-opacity-50" : ""
        }`}
      >
        {/* Source badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-4xl">🥈</span>
            <div>
              <h2 className="text-xl font-bold text-white">Silver Spot Price</h2>
              <p className="text-sm text-blue-400/70">COMEX • XAG/USD</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
            {prices.silver.source === 'COMEX' ? 'COMEX Live' : 'Calculated'}
          </span>
        </div>

        {/* Main Price Display */}
        <div className="text-center py-6">
          <div
            className={`text-5xl md:text-6xl font-bold text-blue-400 mb-2 transition-all duration-300 ${
              priceChanged ? "scale-105" : ""
            }`}
          >
            {formatUSD(prices.silver.pricePerOz)}
            <span className="text-xl font-normal text-blue-400/70">/oz</span>
          </div>
          <p className="text-gray-400">
            per troy ounce (31.1g)
          </p>
        </div>

        {/* Secondary prices */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Per Gram</p>
            <p className="text-lg font-semibold text-white">
              {formatUSD(prices.silver.pricePerGram, 3)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Per Kilogram</p>
            <p className="text-lg font-semibold text-white">
              {formatUSD(prices.silver.pricePerKg)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Gold/Silver Ratio</p>
            <p className="text-lg font-semibold text-amber-400">
              {prices.goldSilverRatio.toFixed(1)}
            </p>
          </div>
        </div>

        {/* 24h Range */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">24h Range</span>
            <div className="flex items-center gap-4">
              <span className="text-red-400">
                Low: {formatUSD(prices.silver.low24h)}
              </span>
              <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-blue-400 to-green-500"
                  style={{
                    width: `${((prices.silver.pricePerOz - prices.silver.low24h) / (prices.silver.high24h - prices.silver.low24h)) * 100}%`,
                  }}
                />
              </div>
              <span className="text-green-400">
                High: {formatUSD(prices.silver.high24h)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
