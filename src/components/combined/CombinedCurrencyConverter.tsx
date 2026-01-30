/**
 * CombinedCurrencyConverter Component
 *
 * Converts both gold and silver prices between USD, INR, EUR, and GBP.
 * Features:
 * - Toggle between Gold and Silver
 * - SVG flag icons (shared component)
 * - Tooltips with calculation breakdowns (shared component)
 * - INR shows both spot and market price (with duties)
 */

"use client";

import { useState, useMemo } from "react";
import type { CombinedMetalPrices } from "@/lib/metalApi";
import { USFlag, IndiaFlag, EUFlag, UKFlag } from "@/components/ui/FlagIcons";
import Tooltip from "@/components/ui/Tooltip";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface CombinedCurrencyConverterProps {
  prices: CombinedMetalPrices;
}

export default function CombinedCurrencyConverter({ prices }: CombinedCurrencyConverterProps) {
  const [amount, setAmount] = useState<number>(1);
  const [unit, setUnit] = useState<"oz" | "gram" | "kg">("gram");
  // Default to Silver since users often come here from Silver price cards
  const [metal, setMetal] = useState<"gold" | "silver">("silver");

  // Exchange rates - ALL from API (Frankfurter/ECB data)
  // Note: Use fallback only during initial render before API data arrives
  const usdInr = prices.usdInr;
  const usdEur = prices.usdEur ?? 0.92;  // Fallback only for hydration safety
  const usdGbp = prices.usdGbp ?? 0.79;  // Fallback only for hydration safety

  // Get base price in USD for selected metal and unit
  const basePriceUSD = useMemo(() => {
    const ozPrice = metal === "gold" ? prices.gold.pricePerOzUsd : prices.silver.pricePerOzUsd;
    switch (unit) {
      case "oz": return ozPrice;
      case "gram": return ozPrice / 31.1035;
      case "kg": return (ozPrice / 31.1035) * 1000;
      default: return ozPrice / 31.1035;
    }
  }, [unit, metal, prices]);

  // Calculate values
  const totalUSD = basePriceUSD * amount;

  // Get the ACTUAL INR prices from API (already includes duties correctly)
  // This ensures Currency Converter matches the main price cards exactly
  // Use the pre-calculated values from API for consistency
  const pricesINR = metal === "gold" 
    ? {
        perGram: prices.gold.pricePerGram,
        perKg: prices.gold.pricePerKg,
        perOz: prices.gold.pricePerGram * 31.1035, // oz not stored, calculate
      }
    : {
        perGram: prices.silver.pricePerGram,
        perKg: prices.silver.pricePerKg,
        perOz: prices.silver.pricePerGram * 31.1035, // oz not stored, calculate
      };

  // Calculate all conversions
  const conversions = useMemo(() => {
    const spotINR = totalUSD * usdInr;
    
    // Use ACTUAL market prices from API directly for consistency
    // This ensures the values match the main price cards exactly
    let marketINR: number;
    if (unit === "gram") {
      marketINR = pricesINR.perGram * amount;
    } else if (unit === "oz") {
      // 1 oz = 31.1035 grams - use API value for per gram
      marketINR = pricesINR.perOz * amount;
    } else {
      // Use the pre-calculated pricePerKg from API directly!
      // This ensures exact match with the Silver/Gold Rate cards
      marketINR = pricesINR.perKg * amount;
    }
    
    const spotEUR = totalUSD * usdEur;
    const spotGBP = totalUSD * usdGbp;

    return {
      usd: { value: totalUSD },
      inr: { spot: spotINR, market: marketINR },
      eur: { value: spotEUR },
      gbp: { value: spotGBP },
    };
  }, [totalUSD, usdInr, usdEur, usdGbp, unit, amount, pricesINR.perGram, pricesINR.perKg, pricesINR.perOz]);

  // Format number with currency
  const formatValue = (value: number, symbol: string, decimals: number = 2): string => {
    return `${symbol}${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  };

  // Color scheme based on selected metal
  const metalColors = metal === "gold" 
    ? { primary: "yellow", ring: "ring-yellow-500", bg: "bg-yellow-500", border: "border-yellow-500" }
    : { primary: "gray", ring: "ring-gray-500", bg: "bg-gray-500", border: "border-gray-500" };

  return (
    <div className="space-y-3">
      {/* Metal Toggle - Compact */}
      <div className="flex gap-2">
        <button
          onClick={() => setMetal("gold")}
          className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all ${
            metal === "gold"
              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
              : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300"
          }`}
        >
          🥇 Gold
        </button>
        <button
          onClick={() => setMetal("silver")}
          className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all ${
            metal === "silver"
              ? "bg-gray-100 text-gray-700 border border-gray-300"
              : "bg-gray-50 text-gray-500 border border-gray-200 hover:border-gray-300"
          }`}
        >
          🥈 Silver
        </button>
      </div>

      {/* Input Row - Compact */}
      <div className="flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
          className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded text-gray-800 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          min="0"
          step="0.1"
          placeholder="Amount"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as "oz" | "gram" | "kg")}
          className="w-24 px-2 py-1.5 bg-white border border-gray-200 rounded text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="gram">g</option>
          <option value="oz">oz</option>
          <option value="kg">kg</option>
        </select>
      </div>

      {/* Currency Grid - 2x2 Compact */}
      <div className="grid grid-cols-2 gap-2">
        {/* USD */}
        <Tooltip content={
          <div>
            <p className="font-semibold text-blue-600 mb-1">🇺🇸 USD (COMEX Spot)</p>
            <div className="font-mono text-[11px] text-gray-600">
              <p>{amount} {unit} × ${basePriceUSD.toFixed(3)} = ${totalUSD.toFixed(2)}</p>
            </div>
          </div>
        }>
          <div className="p-2 rounded bg-blue-50 border border-blue-100 cursor-help text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <USFlag className="w-4 h-3" />
              <span className="text-[10px] text-gray-500">USD</span>
            </div>
            <p className="text-sm font-bold text-blue-700">
              {formatValue(conversions.usd.value, '$')}
            </p>
          </div>
        </Tooltip>

        {/* INR */}
        <Tooltip content={
          <div>
            <p className="font-semibold text-amber-600 mb-1">🇮🇳 INR (Market Price)</p>
            <div className="font-mono text-[11px] text-gray-600 space-y-0.5">
              <p>Spot: ₹{conversions.inr.spot.toFixed(0)}</p>
              <p>+ Duties/GST/Premium</p>
              <p className="text-amber-700 font-bold">= ₹{conversions.inr.market.toFixed(0)}</p>
            </div>
          </div>
        }>
          <div className="p-2 rounded bg-amber-50 border border-amber-100 cursor-help text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <IndiaFlag className="w-4 h-3" />
              <span className="text-[10px] text-gray-500">INR</span>
            </div>
            <p className="text-sm font-bold text-amber-700">
              {formatValue(conversions.inr.market, '₹', 0)}
            </p>
          </div>
        </Tooltip>

        {/* EUR */}
        <Tooltip content={
          <div>
            <p className="font-semibold text-gray-700 mb-1">🇪🇺 Euro (Spot)</p>
            <div className="font-mono text-[11px] text-gray-600">
              <p>${totalUSD.toFixed(2)} × {usdEur.toFixed(4)} = €{conversions.eur.value.toFixed(2)}</p>
            </div>
          </div>
        }>
          <div className="p-2 rounded bg-gray-50 border border-gray-200 cursor-help text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <EUFlag className="w-4 h-3" />
              <span className="text-[10px] text-gray-500">EUR</span>
            </div>
            <p className="text-sm font-bold text-gray-700">
              {formatValue(conversions.eur.value, '€')}
            </p>
          </div>
        </Tooltip>

        {/* GBP */}
        <Tooltip content={
          <div>
            <p className="font-semibold text-gray-700 mb-1">🇬🇧 British Pound (Spot)</p>
            <div className="font-mono text-[11px] text-gray-600">
              <p>${totalUSD.toFixed(2)} × {usdGbp.toFixed(4)} = £{conversions.gbp.value.toFixed(2)}</p>
            </div>
          </div>
        }>
          <div className="p-2 rounded bg-gray-50 border border-gray-200 cursor-help text-center">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <UKFlag className="w-4 h-3" />
              <span className="text-[10px] text-gray-500">GBP</span>
            </div>
            <p className="text-sm font-bold text-gray-700">
              {formatValue(conversions.gbp.value, '£')}
            </p>
          </div>
        </Tooltip>
      </div>

      {/* Spot Price Info */}
      <p className="text-[10px] text-gray-500 text-center">
        {metal === "gold" ? "Gold" : "Silver"} spot: ${basePriceUSD.toFixed(unit === "gram" ? 3 : 2)}/{unit}
      </p>
    </div>
  );
}
