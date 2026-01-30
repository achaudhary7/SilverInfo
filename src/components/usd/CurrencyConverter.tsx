/**
 * CurrencyConverter Component
 *
 * Converts silver prices between USD, INR, EUR, and GBP.
 * Features:
 * - SVG flag icons (works everywhere)
 * - Tooltips with calculation breakdowns
 * - INR shows both spot and market price (with duties)
 */

"use client";

import { useState, useMemo } from "react";
import type { CombinedUSDPrices } from "@/lib/metalApi";

// ============================================================================
// SVG FLAG ICONS
// ============================================================================

function USFlag({ className = "w-5 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="24" fill="#B22234"/>
      <path d="M0 2.77h32M0 7.38h32M0 12h32M0 16.62h32M0 21.23h32" stroke="white" strokeWidth="1.85"/>
      <rect width="12.8" height="12.92" fill="#3C3B6E"/>
      <g fill="white">
        <circle cx="1.6" cy="1.29" r="0.6"/><circle cx="4.27" cy="1.29" r="0.6"/><circle cx="6.93" cy="1.29" r="0.6"/>
        <circle cx="9.6" cy="1.29" r="0.6"/><circle cx="2.93" cy="2.58" r="0.6"/><circle cx="5.6" cy="2.58" r="0.6"/>
        <circle cx="8.27" cy="2.58" r="0.6"/><circle cx="1.6" cy="3.87" r="0.6"/><circle cx="4.27" cy="3.87" r="0.6"/>
        <circle cx="6.93" cy="3.87" r="0.6"/><circle cx="9.6" cy="3.87" r="0.6"/><circle cx="2.93" cy="5.16" r="0.6"/>
        <circle cx="5.6" cy="5.16" r="0.6"/><circle cx="8.27" cy="5.16" r="0.6"/><circle cx="1.6" cy="6.45" r="0.6"/>
        <circle cx="4.27" cy="6.45" r="0.6"/><circle cx="6.93" cy="6.45" r="0.6"/><circle cx="9.6" cy="6.45" r="0.6"/>
      </g>
    </svg>
  );
}

function IndiaFlag({ className = "w-5 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="8" fill="#FF9933"/>
      <rect y="8" width="32" height="8" fill="white"/>
      <rect y="16" width="32" height="8" fill="#138808"/>
      <circle cx="16" cy="12" r="3" fill="#000080"/>
      <circle cx="16" cy="12" r="2.2" fill="white"/>
      <circle cx="16" cy="12" r="0.6" fill="#000080"/>
    </svg>
  );
}

function EUFlag({ className = "w-5 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="24" fill="#003399"/>
      <g fill="#FFCC00">
        <polygon points="16,3 16.5,4.5 18,4.5 16.75,5.5 17.25,7 16,6 14.75,7 15.25,5.5 14,4.5 15.5,4.5"/>
        <polygon points="16,17 16.5,18.5 18,18.5 16.75,19.5 17.25,21 16,20 14.75,21 15.25,19.5 14,18.5 15.5,18.5"/>
        <polygon points="9,5 9.5,6.5 11,6.5 9.75,7.5 10.25,9 9,8 7.75,9 8.25,7.5 7,6.5 8.5,6.5"/>
        <polygon points="23,5 23.5,6.5 25,6.5 23.75,7.5 24.25,9 23,8 21.75,9 22.25,7.5 21,6.5 22.5,6.5"/>
        <polygon points="9,15 9.5,16.5 11,16.5 9.75,17.5 10.25,19 9,18 7.75,19 8.25,17.5 7,16.5 8.5,16.5"/>
        <polygon points="23,15 23.5,16.5 25,16.5 23.75,17.5 24.25,19 23,18 21.75,19 22.25,17.5 21,16.5 22.5,16.5"/>
        <polygon points="6,10 6.5,11.5 8,11.5 6.75,12.5 7.25,14 6,13 4.75,14 5.25,12.5 4,11.5 5.5,11.5"/>
        <polygon points="26,10 26.5,11.5 28,11.5 26.75,12.5 27.25,14 26,13 24.75,14 25.25,12.5 24,11.5 25.5,11.5"/>
      </g>
    </svg>
  );
}

function UKFlag({ className = "w-5 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="24" fill="#012169"/>
      <path d="M0 0L32 24M32 0L0 24" stroke="white" strokeWidth="4"/>
      <path d="M0 0L32 24M32 0L0 24" stroke="#C8102E" strokeWidth="2"/>
      <path d="M16 0V24M0 12H32" stroke="white" strokeWidth="6"/>
      <path d="M16 0V24M0 12H32" stroke="#C8102E" strokeWidth="4"/>
    </svg>
  );
}

// ============================================================================
// TOOLTIP COMPONENT
// ============================================================================

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

function Tooltip({ children, content }: TooltipProps) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-xs text-gray-300 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[200px] shadow-xl">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-600"></div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface CurrencyConverterProps {
  prices: CombinedUSDPrices;
}

export default function CurrencyConverter({ prices }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<number>(1);
  const [unit, setUnit] = useState<"oz" | "gram" | "kg">("gram");

  // Duty constants for calculations
  const IMPORT_DUTY = 0.10;  // 10%
  const GST = 0.03;          // 3%
  const MCX_PREMIUM = 0.10;  // 10%
  const TOTAL_DUTY_MULTIPLIER = (1 + IMPORT_DUTY) * (1 + GST) * (1 + MCX_PREMIUM);

  // Get base price in USD for selected unit
  const basePriceUSD = useMemo(() => {
    switch (unit) {
      case "oz": return prices.silver.pricePerOz;
      case "gram": return prices.silver.pricePerGram;
      case "kg": return prices.silver.pricePerKg;
      default: return prices.silver.pricePerGram;
    }
  }, [unit, prices]);

  // Calculate values
  const totalUSD = basePriceUSD * amount;
  const usdInr = prices.silver.usdInr;
  const usdEur = prices.silver.usdEur;
  const usdGbp = prices.silver.usdGbp;

  // Calculate all conversions
  const conversions = useMemo(() => {
    const spotINR = totalUSD * usdInr;
    const marketINR = spotINR * TOTAL_DUTY_MULTIPLIER;
    const spotEUR = totalUSD * usdEur;
    const spotGBP = totalUSD * usdGbp;

    return {
      usd: { value: totalUSD },
      inr: { spot: spotINR, market: marketINR },
      eur: { value: spotEUR },
      gbp: { value: spotGBP },
    };
  }, [totalUSD, usdInr, usdEur, usdGbp, TOTAL_DUTY_MULTIPLIER]);

  // Format number with currency
  const formatValue = (value: number, symbol: string, decimals: number = 2): string => {
    return `${symbol}${value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 overflow-hidden">
      {/* Input Section */}
      <div className="p-5 border-b border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Amount Input */}
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-2">
              Amount of Silver
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="0.1"
            />
          </div>

          {/* Unit Selector */}
          <div className="sm:w-48">
            <label className="block text-sm text-gray-400 mb-2">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as "oz" | "gram" | "kg")}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="oz">Troy Ounce (oz)</option>
              <option value="gram">Gram (g)</option>
              <option value="kg">Kilogram (kg)</option>
            </select>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-400">
          Silver spot price: <span className="text-blue-400 font-medium">${basePriceUSD.toFixed(unit === "gram" ? 3 : 2)}</span> per {unit === "oz" ? "troy ounce" : unit}
        </p>
      </div>

      {/* Currency Cards */}
      <div className="p-5">
        <h4 className="text-sm font-medium text-gray-400 mb-4">
          Value in Different Currencies
          <span className="ml-2 text-xs text-gray-500">(hover for calculation)</span>
        </h4>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* USD Card */}
          <Tooltip content={
            <div>
              <p className="font-semibold text-blue-400 mb-1">🇺🇸 US Dollar (Spot)</p>
              <p className="text-gray-400 mb-2">Base COMEX price - no additional fees</p>
              <div className="border-t border-slate-700 pt-2 font-mono text-[11px]">
                <p>{amount} {unit} × ${basePriceUSD.toFixed(3)}</p>
                <p className="text-blue-400">= ${totalUSD.toFixed(2)}</p>
              </div>
            </div>
          }>
            <div className="rounded-lg p-4 border bg-blue-500/10 border-blue-500/30 cursor-help">
              <div className="flex items-center gap-2 mb-2">
                <USFlag />
                <span className="text-sm text-gray-400">USD</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  SPOT
                </span>
              </div>
              <p className="text-xl font-bold text-blue-400">
                {formatValue(conversions.usd.value, '$')}
              </p>
              <p className="text-xs text-gray-500 mt-1">COMEX base price</p>
            </div>
          </Tooltip>

          {/* INR Card - Shows BOTH spot and market */}
          <Tooltip content={
            <div>
              <p className="font-semibold text-amber-400 mb-1">🇮🇳 Indian Rupee</p>
              <p className="text-gray-400 mb-2">Shows actual Indian market price</p>
              <div className="border-t border-slate-700 pt-2 font-mono text-[11px] space-y-1">
                <p>Spot: ${totalUSD.toFixed(2)} × ₹{usdInr}</p>
                <p>= ₹{conversions.inr.spot.toFixed(2)} (raw)</p>
                <div className="border-t border-slate-600 pt-1 mt-1">
                  <p>+ Import Duty: 10%</p>
                  <p>+ GST: 3%</p>
                  <p>+ MCX Premium: 10%</p>
                  <p className="text-amber-400 font-semibold">= ₹{conversions.inr.market.toFixed(2)}</p>
                </div>
              </div>
            </div>
          }>
            <div className="rounded-lg p-4 border bg-amber-500/10 border-amber-500/30 cursor-help">
              <div className="flex items-center gap-2 mb-2">
                <IndiaFlag />
                <span className="text-sm text-gray-400">INR</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  MARKET
                </span>
              </div>
              <p className="text-xl font-bold text-amber-400">
                {formatValue(conversions.inr.market, '₹')}
              </p>
              <p className="text-xs text-amber-500/70 mt-1">
                Spot: ₹{conversions.inr.spot.toFixed(2)}
              </p>
            </div>
          </Tooltip>

          {/* EUR Card */}
          <Tooltip content={
            <div>
              <p className="font-semibold text-white mb-1">🇪🇺 Euro (Spot)</p>
              <p className="text-gray-400 mb-2">Direct conversion from USD</p>
              <div className="border-t border-slate-700 pt-2 font-mono text-[11px]">
                <p>${totalUSD.toFixed(2)} × €{usdEur.toFixed(4)}</p>
                <p className="text-white">= €{conversions.eur.value.toFixed(2)}</p>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                Note: EU may have VAT (~20%) on physical silver
              </p>
            </div>
          }>
            <div className="rounded-lg p-4 border bg-slate-800/50 border-slate-700 hover:border-slate-600 cursor-help">
              <div className="flex items-center gap-2 mb-2">
                <EUFlag />
                <span className="text-sm text-gray-400">EUR</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-gray-400">
                  SPOT
                </span>
              </div>
              <p className="text-xl font-bold text-white">
                {formatValue(conversions.eur.value, '€')}
              </p>
              <p className="text-xs text-gray-500 mt-1">Rate: {usdEur.toFixed(4)}</p>
            </div>
          </Tooltip>

          {/* GBP Card */}
          <Tooltip content={
            <div>
              <p className="font-semibold text-white mb-1">🇬🇧 British Pound (Spot)</p>
              <p className="text-gray-400 mb-2">Direct conversion from USD</p>
              <div className="border-t border-slate-700 pt-2 font-mono text-[11px]">
                <p>${totalUSD.toFixed(2)} × £{usdGbp.toFixed(4)}</p>
                <p className="text-white">= £{conversions.gbp.value.toFixed(2)}</p>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                Note: UK has 20% VAT on silver (not applied here)
              </p>
            </div>
          }>
            <div className="rounded-lg p-4 border bg-slate-800/50 border-slate-700 hover:border-slate-600 cursor-help">
              <div className="flex items-center gap-2 mb-2">
                <UKFlag />
                <span className="text-sm text-gray-400">GBP</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-gray-400">
                  SPOT
                </span>
              </div>
              <p className="text-xl font-bold text-white">
                {formatValue(conversions.gbp.value, '£')}
              </p>
              <p className="text-xs text-gray-500 mt-1">Rate: {usdGbp.toFixed(4)}</p>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Footer Legend */}
      <div className="px-5 py-4 bg-slate-800/50 border-t border-slate-700">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">SPOT</span>
            <span className="text-gray-400">= Raw market price (no taxes/duties)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">MARKET</span>
            <span className="text-gray-400">= Includes local duties/taxes</span>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-gray-500">
          💡 <strong>Spot price</strong> = Current raw market price for immediate delivery (COMEX). 
          Local markets add import duties, GST/VAT, and dealer premiums.
        </p>
      </div>
    </div>
  );
}
