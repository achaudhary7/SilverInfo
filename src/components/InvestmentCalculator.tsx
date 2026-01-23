"use client";

import { useState, useCallback } from "react";
import { formatIndianPrice } from "@/lib/metalApi";

interface InvestmentCalculatorProps {
  currentPrice: number;
}

// Minimum holding period (days) to show CAGR
const MIN_DAYS_FOR_CAGR = 365;

// Price sanity threshold - warn if purchase price is below this % of current
const PRICE_SANITY_THRESHOLD = 0.15; // 15%

export default function InvestmentCalculator({ currentPrice }: InvestmentCalculatorProps) {
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [purchaseDate, setPurchaseDate] = useState<string>("");

  const calculateReturns = useCallback(() => {
    const purchasePriceNum = parseFloat(purchasePrice) || 0;
    const weightNum = parseFloat(weight) || 0;

    if (purchasePriceNum <= 0 || weightNum <= 0) {
      return null;
    }

    const investedAmount = purchasePriceNum * weightNum;
    const currentValue = currentPrice * weightNum;
    const absoluteGain = currentValue - investedAmount;
    const percentageGain = ((currentValue - investedAmount) / investedAmount) * 100;

    // Check if purchase price is unrealistically low (price sanity check)
    const isPriceSuspicious = purchasePriceNum < currentPrice * PRICE_SANITY_THRESHOLD;

    // Calculate holding period if date provided
    let holdingDays = 0;
    let cagr: number | null = null;
    let simpleAnnualizedReturn = 0;
    let showCagr = false;
    
    if (purchaseDate) {
      const purchase = new Date(purchaseDate);
      const today = new Date();
      holdingDays = Math.floor((today.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24));
      
      if (holdingDays > 0 && investedAmount > 0) {
        // Simple Annualized Return (linear, non-compounding)
        // Formula: (Profit / Investment) × (365 / days)
        simpleAnnualizedReturn = (absoluteGain / investedAmount) * (365 / holdingDays) * 100;
        
        // CAGR only for periods >= 1 year
        if (holdingDays >= MIN_DAYS_FOR_CAGR) {
          showCagr = true;
          const ratio = currentValue / investedAmount;
          const exponent = 365 / holdingDays;
          cagr = (Math.pow(ratio, exponent) - 1) * 100;
        }
      }
    }

    return {
      investedAmount,
      currentValue,
      absoluteGain,
      percentageGain,
      holdingDays,
      cagr,
      simpleAnnualizedReturn,
      showCagr,
      isPriceSuspicious,
      isProfit: absoluteGain >= 0,
    };
  }, [purchasePrice, weight, currentPrice, purchaseDate]);

  const results = calculateReturns();

  // Format percentage for display (cap extreme values)
  const formatPercentage = (value: number, showSign: boolean = true): string => {
    const sign = showSign && value >= 0 ? '+' : '';
    if (Math.abs(value) > 99999) {
      return value >= 0 ? '>99,999%' : '<-99,999%';
    }
    if (Math.abs(value) >= 1000) {
      return `${sign}${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}%`;
    }
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Calculate Your Silver Investment Returns
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Track your silver investment performance with absolute and percentage returns
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price (₹ per gram)
            </label>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="e.g., 300"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            />
            {/* Price sanity warning */}
            {results?.isPriceSuspicious && (
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <span>⚠️</span>
                This purchase price is historically very old. Returns may appear exaggerated.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (grams)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Date (optional)
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
            />
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-500">
              Current Market Price: <span className="font-semibold text-gray-900">{formatIndianPrice(currentPrice)}/gram</span>
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div>
          {results ? (
            <div className="space-y-4">
              {/* Primary Metrics - Absolute Values (emphasized) */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invested Amount</span>
                  <span className="font-semibold text-gray-900">{formatIndianPrice(results.investedAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Value</span>
                  <span className="font-semibold text-gray-900">{formatIndianPrice(results.currentValue)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-medium text-gray-700">Profit / Loss</span>
                  <span className={`font-bold text-lg ${results.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {results.isProfit ? '+' : ''}{formatIndianPrice(results.absoluteGain)}
                  </span>
                </div>
              </div>

              {/* Percentage Return (de-emphasized) */}
              <div className={`rounded-lg p-3 ${results.isProfit ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Percentage Return</span>
                  <span className={`font-medium ${results.isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(results.percentageGain)}
                  </span>
                </div>
                {results.isPriceSuspicious && Math.abs(results.percentageGain) > 500 && (
                  <p className="text-xs text-gray-500 mt-1">
                    * High % due to historically low purchase price
                  </p>
                )}
              </div>

              {/* Holding Period & Annualized Metrics */}
              {results.holdingDays > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-blue-800">Holding Period</span>
                    <span className="font-medium text-blue-900">{results.holdingDays} days</span>
                  </div>
                  
                  {/* CAGR - Only show for >= 1 year */}
                  <div className="border-t border-blue-200 pt-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm text-blue-800">Annualized Return (CAGR)</span>
                        <span 
                          className="ml-1 text-blue-400 cursor-help text-xs"
                          title="Compound Annual Growth Rate - meaningful only for investments held 1+ years"
                        >
                          ⓘ
                        </span>
                      </div>
                      {results.showCagr && results.cagr !== null ? (
                        <span className={`font-bold ${results.cagr >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(results.cagr)}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </div>
                    
                    {!results.showCagr && (
                      <p className="text-xs text-blue-600 mt-2">
                        CAGR is shown only for holding periods of 1 year or more. 
                        Silver is a physical asset that doesn&apos;t compound like equities.
                      </p>
                    )}
                  </div>
                  
                  {/* Simple Annualized Return - Always show as reference */}
                  {results.holdingDays > 0 && results.holdingDays < MIN_DAYS_FOR_CAGR && (
                    <div className="border-t border-blue-200 pt-3 mt-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm text-blue-800">Simple Annualized</span>
                          <span 
                            className="ml-1 text-blue-400 cursor-help text-xs"
                            title="Linear projection to 1 year (non-compounding). For reference only."
                          >
                            ⓘ
                          </span>
                        </div>
                        <span className={`font-medium text-sm ${results.simpleAnnualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(results.simpleAnnualizedReturn)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Linear projection • Not a guaranteed return
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-5xl mb-3">📊</div>
                <p className="text-lg font-medium text-gray-600">Enter your investment details</p>
                <p className="text-sm">Results will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Note */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <strong className="text-gray-700">About Silver Returns:</strong> Silver is a physical commodity, 
          not a compounding instrument like stocks or mutual funds. Returns depend on spot price changes, 
          not reinvestment. CAGR is meaningful only for long-term holdings (1+ years). 
          <a href="/learn/silver-vs-gold-investment" className="text-[#1e3a5f] hover:underline ml-1">
            Learn more →
          </a>
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        Calculator uses current indicative prices. Actual returns may vary based on selling price and dealer margins.
      </p>
    </div>
  );
}
