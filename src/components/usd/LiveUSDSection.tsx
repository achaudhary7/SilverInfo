/**
 * LiveUSDSection Component
 *
 * Wrapper component that provides live price data to all child components.
 * Polls the API every 30 seconds and passes updated prices to:
 * - LiveUSDPriceCard
 * - USDPriceTable
 * - CurrencyConverter
 *
 * This ensures ALL components show the same live prices.
 */

"use client";

import { useState, useCallback, useRef } from "react";
import type { CombinedUSDPrices } from "@/lib/metalApi";
import LiveBadge from "@/components/ui/LiveBadge";
import USDPriceTable from "./USDPriceTable";
import CurrencyConverter from "./CurrencyConverter";
import { useVisibilityAwarePolling, DEFAULT_POLL_INTERVAL } from "@/hooks/useVisibilityAwarePolling";

interface LiveUSDSectionProps {
  initialPrices: CombinedUSDPrices;
}

export default function LiveUSDSection({ initialPrices }: LiveUSDSectionProps) {
  const [prices, setPrices] = useState<CombinedUSDPrices>(initialPrices);
  const [lastUpdate, setLastUpdate] = useState<string>(initialPrices.timestamp);
  const [isLoading, setIsLoading] = useState(false);
  const [priceChanged, setPriceChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      const response = await fetch("/api/silver-price-usd");

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch prices");
        return;
      }

      const data: CombinedUSDPrices = await response.json();

      // Detect price change
      if (data.silver.pricePerOz !== prevPrice.current) {
        setPriceChanged(true);
        setTimeout(() => setPriceChanged(false), 1000);
        prevPrice.current = data.silver.pricePerOz;
      }

      setPrices(data);
      setLastUpdate(data.timestamp);
    } catch (err) {
      console.error("Error fetching USD prices:", err);
      setError("Network error. Retrying...");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Use visibility-aware polling - pauses when tab is hidden
  // 6-hour interval maximizes cost savings, fetchOnVisible ensures fresh data
  useVisibilityAwarePolling({
    callback: fetchPrices,
    interval: DEFAULT_POLL_INTERVAL, // 6 hours
    enabled: true,
    fetchOnMount: true,
    fetchOnVisible: true, // Refresh data when user returns to tab
  });

  return (
    <div className="space-y-8">
      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Section 1: Main Price Card */}
      <section>
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

          {/* Secondary prices - 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-700">
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
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Gold Price</p>
              <p className="text-lg font-semibold text-yellow-500">
                {formatUSD(prices.gold.pricePerOz)}
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

          {/* Trust Badges / USPs */}
          <div className="mt-6 pt-5 border-t border-slate-700/50">
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Real COMEX Data
              </span>
              <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Live Updates
              </span>
              <span className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Formula Transparent
              </span>
              <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
                Multi-Currency
              </span>
            </div>
          </div>
        </div>

        {/* Catchy Tagline Banner */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-800/80 via-slate-800/50 to-slate-800/80 border border-slate-700/50 text-center">
          <p className="text-sm text-gray-400">
            <span className="text-blue-400 font-semibold">Calculated, Not Copied.</span> We derive prices directly from COMEX futures + live exchange rates.
            <span className="text-gray-500"> No guesswork. No delays. Just math.</span>
          </p>
        </div>
      </section>

      {/* Section 2: Price Table */}
      <section id="price-table" className="scroll-mt-20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📊</span> Silver Price by Weight (USD)
        </h2>
        <USDPriceTable prices={prices} />
      </section>

      {/* Section 3: Currency Converter */}
      <section id="converter" className="scroll-mt-20">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>💱</span> Currency Converter
        </h2>
        <CurrencyConverter prices={prices} />
      </section>
    </div>
  );
}
