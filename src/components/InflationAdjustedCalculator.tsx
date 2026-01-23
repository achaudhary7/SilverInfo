"use client";

/**
 * Inflation-Adjusted Returns Calculator (Real Return)
 * 
 * Calculates real returns after accounting for inflation using CPI data.
 * Helps investors understand the true purchasing power of their returns.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Uses official CPI data from MOSPI
 * - Shows both nominal and real returns
 * - Two calculation modes: Exact (CPI) and Approximate
 * - Clear warnings for short holding periods
 * - Educational content about inflation impact
 */

import { useState, useMemo } from "react";
import {
  DEFAULT_INFLATION_RATE,
  getCPI,
  formatINR,
  formatPercent,
  CONFIG_LAST_UPDATED,
} from "@/lib/calculatorConfig";

// ============================================================================
// STYLES
// ============================================================================

const INPUT_STYLE = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-gray-900";
const LABEL_STYLE = "block text-sm font-medium text-gray-700 mb-2";
const CARD_STYLE = "bg-white rounded-xl border border-gray-200 p-6";

// ============================================================================
// TYPES
// ============================================================================

type CalculationMode = "exact" | "approximate";

interface RealReturnResult {
  investedAmount: number;
  currentValue: number;
  nominalGain: number;
  nominalReturnPercent: number;
  holdingYears: number;
  startYear: number;
  endYear: number;
  startCPI: number | null;
  endCPI: number | null;
  inflationRate: number;
  inflationSource: "CPI" | "Default";
  realReturn: number;
  realReturnPercent: number;
  purchasingPowerLost: number;
  warning: string | null;
}

// ============================================================================
// COMPONENT
// ============================================================================

interface Props {
  currentPrice?: number;
}

export default function InflationAdjustedCalculator({ currentPrice = 0 }: Props) {
  // ========================================================================
  // STATE
  // ========================================================================
  const [investedAmount, setInvestedAmount] = useState<string>("");
  const [currentValue, setCurrentValue] = useState<string>("");
  const [purchaseDate, setPurchaseDate] = useState<string>("");
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [calculationMode, setCalculationMode] = useState<CalculationMode>("exact");
  const [customInflation, setCustomInflation] = useState<string>("6");
  const [showEducation, setShowEducation] = useState(false);

  // ========================================================================
  // CALCULATIONS
  // ========================================================================
  const result = useMemo((): RealReturnResult | null => {
    const invested = parseFloat(investedAmount);
    const current = parseFloat(currentValue);
    
    if (!invested || invested <= 0 || !current || current <= 0 || !purchaseDate || !saleDate) {
      return null;
    }
    
    const purchaseDateObj = new Date(purchaseDate);
    const saleDateObj = new Date(saleDate);
    const holdingDays = Math.floor((saleDateObj.getTime() - purchaseDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    if (holdingDays <= 0) return null;
    
    const holdingYears = holdingDays / 365;
    const startYear = purchaseDateObj.getFullYear();
    const endYear = saleDateObj.getFullYear();
    
    // Calculate nominal return
    const nominalGain = current - invested;
    const nominalReturnPercent = ((current - invested) / invested) * 100;
    
    // Get CPI data
    const startCPI = getCPI(startYear);
    const endCPI = getCPI(endYear);
    
    let inflationRate: number;
    let inflationSource: "CPI" | "Default";
    
    if (calculationMode === "exact" && startCPI && endCPI) {
      // Use exact CPI-based inflation
      const cumulativeInflation = (endCPI - startCPI) / startCPI;
      inflationRate = cumulativeInflation;
      inflationSource = "CPI";
    } else {
      // Use custom or default inflation rate
      const annualRate = parseFloat(customInflation) / 100 || DEFAULT_INFLATION_RATE;
      inflationRate = Math.pow(1 + annualRate, holdingYears) - 1;
      inflationSource = "Default";
    }
    
    // Calculate real return using proper formula
    // Real Return = (1 + Nominal Return) / (1 + Inflation) - 1
    const nominalReturnDecimal = (current - invested) / invested;
    const realReturnDecimal = (1 + nominalReturnDecimal) / (1 + inflationRate) - 1;
    const realReturnPercent = realReturnDecimal * 100;
    const realReturn = invested * realReturnDecimal;
    
    // Purchasing power lost to inflation
    const purchasingPowerLost = invested * inflationRate;
    
    // Warnings
    let warning: string | null = null;
    if (holdingYears < 1) {
      warning = "Inflation adjustment may be volatile for periods under 1 year. Results should be interpreted with caution.";
    } else if (inflationSource === "Default") {
      warning = `Using estimated ${(parseFloat(customInflation) || 6)}% annual inflation. For precise calculation, CPI data for the selected years may not be available.`;
    }
    
    return {
      investedAmount: invested,
      currentValue: current,
      nominalGain,
      nominalReturnPercent,
      holdingYears,
      startYear,
      endYear,
      startCPI,
      endCPI,
      inflationRate,
      inflationSource,
      realReturn,
      realReturnPercent,
      purchasingPowerLost,
      warning,
    };
  }, [investedAmount, currentValue, purchaseDate, saleDate, calculationMode, customInflation]);

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div className="space-y-6">
      {/* Main Calculator Card - Side by Side Layout */}
      <div className={CARD_STYLE}>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Inflation-Adjusted Returns Calculator
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Calculate your real returns after accounting for inflation
        </p>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section - Left Side */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Invested Amount */}
              <div>
                <label className={LABEL_STYLE}>Amount Invested (₹)</label>
                <input
                  type="number"
                  value={investedAmount}
                  onChange={(e) => setInvestedAmount(e.target.value)}
                  placeholder="e.g., 100000"
                  min="0"
                  className={INPUT_STYLE}
                />
              </div>
              
              {/* Current Value */}
              <div>
                <label className={LABEL_STYLE}>Current Value (₹)</label>
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="e.g., 150000"
                  min="0"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Purchase Date */}
              <div>
                <label className={LABEL_STYLE}>Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  max={saleDate}
                  className={INPUT_STYLE}
                />
              </div>
              
              {/* Sale/Current Date */}
              <div>
                <label className={LABEL_STYLE}>Current Date</label>
                <input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  min={purchaseDate}
                  className={INPUT_STYLE}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Calculation Mode */}
              <div>
                <label className={LABEL_STYLE}>Calculation Mode</label>
                <select
                  value={calculationMode}
                  onChange={(e) => setCalculationMode(e.target.value as CalculationMode)}
                  className={INPUT_STYLE}
                >
                  <option value="exact">Exact (CPI-based)</option>
                  <option value="approximate">Custom Rate</option>
                </select>
              </div>
              
              {/* Custom Inflation Rate */}
              <div>
                <label className={LABEL_STYLE}>Inflation Rate (%)</label>
                <input
                  type="number"
                  value={customInflation}
                  onChange={(e) => setCustomInflation(e.target.value)}
                  placeholder="6"
                  min="0"
                  max="50"
                  step="0.1"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              {calculationMode === "exact" 
                ? "Uses official CPI data from MOSPI when available" 
                : "Uses custom inflation rate for calculation"
              }
            </p>
          </div>
          
          {/* Results Section - Right Side */}
          <div>
            {result ? (
              <div className="space-y-4">
                {/* Warning if applicable */}
                {result.warning && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
                    ⚠️ {result.warning}
                  </div>
                )}
                
                {/* Holding Period */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Holding Period</span>
                    <span className="font-semibold">{result.holdingYears.toFixed(1)} years ({result.startYear}→{result.endYear})</span>
                  </div>
                </div>
                
                {/* Nominal vs Real Returns Comparison */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Nominal Return */}
                  <div className="border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-500 mb-1">Nominal Return</div>
                    <div className={`text-xl font-bold ${result.nominalGain >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatPercent(result.nominalReturnPercent)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {result.nominalGain >= 0 ? "+" : ""}{formatINR(result.nominalGain)}
                    </div>
                  </div>
                  
                  {/* Real Return */}
                  <div className="border-2 border-[#1e3a5f] rounded-lg p-3 text-center bg-blue-50">
                    <div className="text-xs text-[#1e3a5f] mb-1">Real Return</div>
                    <div className={`text-xl font-bold ${result.realReturnPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatPercent(result.realReturnPercent)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.realReturn >= 0 ? "+" : ""}{formatINR(result.realReturn)}
                    </div>
                  </div>
                </div>
                
                {/* Key Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Invested</span>
                    <span className="font-medium">{formatINR(result.investedAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Current Value</span>
                    <span className="font-medium">{formatINR(result.currentValue)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Purchasing Power Lost</span>
                    <span className="font-medium text-red-600">-{formatINR(result.purchasingPowerLost)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Cumulative Inflation</span>
                    <span className="font-medium">{(result.inflationRate * 100).toFixed(1)}%</span>
                  </div>
                </div>
                
                {/* Inflation Data Source */}
                <div className="bg-blue-50 rounded-lg p-3 text-xs">
                  <span className="font-medium text-blue-900">
                    {result.inflationSource === "CPI" ? "📊 CPI Data (MOSPI)" : "📊 Estimated Rate"}
                  </span>
                  {result.inflationSource === "CPI" && result.startCPI && result.endCPI && (
                    <span className="text-blue-700 ml-2">
                      {result.startYear}: {result.startCPI} → {result.endYear}: {result.endCPI}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-5xl mb-3">📊</div>
                  <p className="text-lg font-medium text-gray-600">Enter your details</p>
                  <p className="text-sm">Real returns will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Educational Content */}
      <div className={CARD_STYLE}>
        <button
          onClick={() => setShowEducation(!showEducation)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            📚 Why Real Returns Matter
          </h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${showEducation ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showEducation && (
          <div className="mt-4 space-y-4 text-sm text-gray-600">
            <p>
              <strong>Nominal returns</strong> show how much your money has grown in absolute terms. 
              However, they don&apos;t account for the rising cost of living.
            </p>
            <p>
              <strong>Real returns</strong> show your actual purchasing power gain — what you can 
              buy with your returns after accounting for inflation.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Formula Used</h4>
              <code className="block text-xs bg-white p-2 rounded border">
                Real Return = (1 + Nominal Return) / (1 + Inflation Rate) - 1
              </code>
              <p className="text-xs text-gray-500 mt-2">
                This is the mathematically correct formula, not the simplified approximation.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Example</h4>
              <p>
                If your investment grew 50% over 5 years, but inflation was 30% during that period, 
                your real return is only about 15% — that&apos;s the actual increase in purchasing power.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* CPI Reference */}
      <div className="text-xs text-gray-500 text-center">
        CPI Data Source: Ministry of Statistics and Programme Implementation (MOSPI) • 
        Last Updated: {CONFIG_LAST_UPDATED}
      </div>
    </div>
  );
}
