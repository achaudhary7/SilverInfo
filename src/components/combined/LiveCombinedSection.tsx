/**
 * LiveCombinedSection Component
 *
 * Wrapper component that provides live gold & silver price data to all child components.
 * Polls the API every 30 seconds and passes updated prices to:
 * - Price Cards (Gold & Silver main cards - inline)
 * - GoldSilverRatioCard
 * - CombinedPriceTable
 * - CombinedCurrencyConverter
 *
 * This ensures ALL components show the same live prices.
 *
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Live price updates every 30 seconds
 * - Error handling with graceful UI
 * - Trust badges for transparency
 * - Catchy taglines for user engagement
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import type { CombinedMetalPrices } from "@/lib/metalApi";
import LiveBadge from "@/components/ui/LiveBadge";
import { USFlag, IndiaFlag } from "@/components/ui/FlagIcons";
import Tooltip from "@/components/ui/Tooltip";
import GoldSilverRatioCard from "./GoldSilverRatioCard";
import CombinedPriceTable from "./CombinedPriceTable";
import CombinedCurrencyConverter from "./CombinedCurrencyConverter";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface LiveCombinedSectionProps {
  initialPrices: CombinedMetalPrices;
}

export default function LiveCombinedSection({ initialPrices }: LiveCombinedSectionProps) {
  const [prices, setPrices] = useState<CombinedMetalPrices>(initialPrices);
  const [lastUpdate, setLastUpdate] = useState<string>(initialPrices.timestamp);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceChanged, setPriceChanged] = useState<"gold" | "silver" | null>(null);

  // Track previous prices for change detection
  const prevGoldPrice = useRef(initialPrices.gold.pricePerGram);
  const prevSilverPrice = useRef(initialPrices.silver.pricePerGram);

  // Format price in Indian style
  const formatINR = useCallback((price: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }, []);

  // Format USD
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
      const response = await fetch("/api/combined-prices");

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch prices");
        return;
      }

      const data: CombinedMetalPrices = await response.json();

      // Detect price changes
      if (data.gold.pricePerGram !== prevGoldPrice.current) {
        setPriceChanged("gold");
        setTimeout(() => setPriceChanged(null), 1000);
        prevGoldPrice.current = data.gold.pricePerGram;
      }
      if (data.silver.pricePerGram !== prevSilverPrice.current) {
        setPriceChanged("silver");
        setTimeout(() => setPriceChanged(null), 1000);
        prevSilverPrice.current = data.silver.pricePerGram;
      }

      setPrices(data);
      setLastUpdate(data.timestamp);
    } catch (err) {
      console.error("Error fetching combined prices:", err);
      setError("Network error. Retrying...");
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

  // Calculate comparison metrics
  const goldToSilverMultiple = Math.round(prices.gold.pricePerGram / prices.silver.pricePerGram);

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Section 1: Main Price Cards */}
      <section id="live-prices" className="scroll-mt-20">
        {/* Live indicator header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </span>
            <span className="text-xs text-gray-500">
              Updated {new Date(lastUpdate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {isLoading && (
            <span className="text-xs text-gray-500 animate-pulse">
              Updating...
            </span>
          )}
        </div>

        {/* Price Cards Grid - 3 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Gold Card (Compact) - India */}
          <Tooltip content={
            <div>
              <p className="font-semibold text-yellow-600 mb-1">🇮🇳 Gold Price Calculation (India)</p>
              <div className="font-mono text-[11px] space-y-1 text-gray-700">
                <p>COMEX: ${prices.gold.pricePerOzUsd}/oz</p>
                <p>÷ 31.1035 = ${(prices.gold.pricePerOzUsd / 31.1035).toFixed(3)}/g (USD)</p>
                <p>× ₹{prices.usdInr} = ₹{(prices.gold.pricePerOzUsd / 31.1035 * prices.usdInr).toFixed(2)}/g (raw)</p>
                <p className="border-t border-gray-300 pt-1">+ 10% Import Duty + 3% GST + Premium</p>
                <p className="text-yellow-700 font-bold">= {formatINR(prices.gold.pricePerGram)}/g (India)</p>
              </div>
            </div>
          }>
            <div
              className={`card bg-gradient-to-br from-yellow-50 to-amber-50 p-4 border-yellow-200 transition-all duration-300 cursor-help h-full ${
                priceChanged === "gold" ? "ring-2 ring-yellow-400" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="text-2xl">🥇</span>
                    <IndiaFlag className="w-3 h-2 absolute -bottom-0.5 -right-1" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-yellow-700">Gold Rate</h2>
                    <p className="text-xs text-yellow-600/70 flex items-center gap-1">
                      <span>24K</span>
                      <span className="text-orange-600">India</span>
                    </p>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
                  LIVE
                </span>
              </div>
              <div className={`text-2xl font-bold text-yellow-700 mb-1 ${priceChanged === "gold" ? "scale-105" : ""}`}>
                {formatINR(prices.gold.pricePerGram)}
                <span className="text-sm font-normal">/g</span>
              </div>
              <p className="text-gray-500 text-xs mb-2">
                10g: {formatINR(prices.gold.pricePer10Gram)}
              </p>
              <Link href="/gold" className="text-yellow-700 hover:text-yellow-800 text-xs font-medium">
                Details →
              </Link>
            </div>
          </Tooltip>

          {/* Silver Card INR (Compact) - India */}
          <Tooltip content={
            <div>
              <p className="font-semibold text-gray-700 mb-1">🇮🇳 Silver Price Calculation (India)</p>
              <div className="font-mono text-[11px] space-y-1 text-gray-600">
                <p>COMEX: ${prices.silver.pricePerOzUsd}/oz</p>
                <p>÷ 31.1035 = ${(prices.silver.pricePerOzUsd / 31.1035).toFixed(3)}/g (USD)</p>
                <p>× ₹{prices.usdInr} = ₹{(prices.silver.pricePerOzUsd / 31.1035 * prices.usdInr).toFixed(2)}/g (raw)</p>
                <p className="border-t border-gray-300 pt-1">+ 10% Import Duty + 3% GST + Premium</p>
                <p className="text-gray-800 font-bold">= {formatINR(prices.silver.pricePerGram)}/g (India)</p>
              </div>
            </div>
          }>
            <div
              className={`card bg-gradient-to-br from-gray-50 to-slate-50 p-4 border-gray-200 transition-all duration-300 cursor-help h-full ${
                priceChanged === "silver" ? "ring-2 ring-gray-400" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="text-2xl">🥈</span>
                    <IndiaFlag className="w-3 h-2 absolute -bottom-0.5 -right-1" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-700">Silver Rate</h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span>999</span>
                      <span className="text-orange-600">India</span>
                    </p>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
                  LIVE
                </span>
              </div>
              <div className={`text-2xl font-bold text-gray-800 mb-1 ${priceChanged === "silver" ? "scale-105" : ""}`}>
                {formatINR(prices.silver.pricePerGram)}
                <span className="text-sm font-normal">/g</span>
              </div>
              <p className="text-gray-500 text-xs mb-2">
                1Kg: {formatINR(prices.silver.pricePerKg)}
              </p>
              <Link href="/" className="text-gray-700 hover:text-gray-900 text-xs font-medium">
                Details →
              </Link>
            </div>
          </Tooltip>

          {/* Silver USD Card (Compact) */}
          <Tooltip content={
            <div>
              <p className="font-semibold text-blue-700 mb-1">🇺🇸 COMEX Silver Spot</p>
              <div className="font-mono text-[11px] space-y-1 text-gray-600">
                <p>Source: Yahoo Finance (SI=F)</p>
                <p>Exchange: COMEX (CME Group)</p>
                <p className="border-t border-gray-300 pt-1">Live spot price for immediate delivery</p>
                <p className="text-blue-600">No added duties or premiums</p>
              </div>
            </div>
          }>
            <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border-blue-200 cursor-help h-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <USFlag className="w-6 h-4" />
                  <div>
                    <h2 className="text-base font-bold text-blue-700">Silver USD</h2>
                    <p className="text-xs text-blue-600/70">COMEX Spot</p>
                  </div>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700">
                  LIVE
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-700 mb-1">
                {formatUSD(prices.silver.pricePerOzUsd)}
                <span className="text-sm font-normal">/oz</span>
              </div>
              <p className="text-gray-500 text-xs mb-2">
                {formatUSD(prices.silver.pricePerOzUsd / 31.1035, 3)}/g
              </p>
              <Link href="/silver-price-usd" className="text-blue-700 hover:text-blue-800 text-xs font-medium">
                Full USD Page →
              </Link>
            </div>
          </Tooltip>
        </div>

        {/* Quick fact */}
        <div className="mt-4 text-center">
          <span className="inline-block bg-white rounded-full px-4 py-2 text-sm text-gray-700 border border-gray-200 shadow-sm">
            💡 Gold is{" "}
            <span className="text-yellow-600 font-semibold">
              {goldToSilverMultiple}x
            </span>{" "}
            more expensive than silver per gram
          </span>
        </div>
      </section>

      {/* Section 2: COMEX Market Data (US Prices) - 2 Column Compact */}
      <section id="comex-prices" className="scroll-mt-20">
        <div className="card p-4">
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            🌍 International Prices (USD)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Tooltip content={
              <div>
                <p className="font-semibold text-yellow-600 mb-1">COMEX Gold</p>
                <p className="text-gray-600">Live spot price from COMEX</p>
              </div>
            }>
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100 cursor-help text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <USFlag className="w-4 h-3" />
                  <p className="text-xs text-gray-500">Gold</p>
                </div>
                <p className="text-lg font-bold text-yellow-700">{formatUSD(prices.gold.pricePerOzUsd)}</p>
                <p className="text-[10px] text-gray-500">per troy oz</p>
              </div>
            </Tooltip>
            
            <Tooltip content={
              <div>
                <p className="font-semibold text-gray-700 mb-1">COMEX Silver</p>
                <p className="text-gray-600">Live spot price from COMEX</p>
              </div>
            }>
              <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-help text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <USFlag className="w-4 h-3" />
                  <p className="text-xs text-gray-500">Silver</p>
                </div>
                <p className="text-lg font-bold text-gray-700">{formatUSD(prices.silver.pricePerOzUsd)}</p>
                <p className="text-[10px] text-gray-500">per troy oz</p>
              </div>
            </Tooltip>
            
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-center">
              <p className="text-xs text-gray-500 mb-1">USD/INR</p>
              <p className="text-lg font-bold text-blue-700">₹{prices.usdInr.toFixed(2)}</p>
              <p className="text-[10px] text-gray-500">exchange rate</p>
            </div>
            
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Au/Ag Ratio</p>
              <p className="text-lg font-bold text-purple-700">{prices.ratio?.ratio.toFixed(1) || "—"}</p>
              <p className="text-[10px] text-gray-500">avg: 65</p>
            </div>
          </div>

          {/* External Authority Links */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3 justify-center text-xs">
            <a 
              href="https://www.cmegroup.com/markets/metals/precious/gold.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-yellow-600 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              CME Gold
            </a>
            <span className="text-gray-300">•</span>
            <a 
              href="https://www.cmegroup.com/markets/metals/precious/silver.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              CME Silver
            </a>
            <span className="text-gray-300">•</span>
            <a 
              href="https://www.lbma.org.uk/prices-and-data/precious-metal-prices" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              LBMA
            </a>
          </div>

          {/* Features Bar - Data Source Trust Badges */}
          <div className="mt-4 p-3 rounded-lg bg-[#1e3a5f]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-white">
              <div className="flex items-center justify-center gap-1.5">
                <span>✅</span>
                <span className="text-xs">Real COMEX Data</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span>⚡</span>
                <span className="text-xs">30-Second Updates</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span>📊</span>
                <span className="text-xs">Transparent Formula</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span>🌏</span>
                <span className="text-xs">India + Global Prices</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ratio + Price Table + Converter - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Gold-Silver Ratio */}
        <section id="ratio-analysis" className="scroll-mt-20">
          <div className="card p-4 h-full">
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              ⚖️ Gold-Silver Ratio
            </h2>
            <GoldSilverRatioCard initialRatio={prices.ratio} />
          </div>
        </section>

        {/* Right: Currency Converter */}
        <section id="converter" className="scroll-mt-20">
          <div className="card p-4 h-full">
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              💱 Currency Converter
            </h2>
            <CombinedCurrencyConverter prices={prices} />
          </div>
        </section>
      </div>

      {/* Price Table - Full Width */}
      <section id="price-table" className="scroll-mt-20">
        <div className="card p-4">
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            📊 Price by Weight
          </h2>
          <CombinedPriceTable prices={prices} />
        </div>
      </section>
    </div>
  );
}
