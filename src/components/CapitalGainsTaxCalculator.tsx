"use client";

/**
 * Capital Gains Tax Calculator for Silver (India)
 * 
 * Calculates estimated capital gains tax on silver investments based on
 * current Indian tax laws. Supports STCG and LTCG calculations.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Asset type selection (Physical silver, Jewellery, ETF)
 * - STCG vs LTCG classification based on holding period
 * - Tax slab selection for STCG
 * - Clear breakdown of tax calculation
 * - Disclaimer and official source links
 * 
 * ============================================================================
 * UIF PATTERNS
 * ============================================================================
 * - Controlled form inputs
 * - Ternary for conditional rendering
 * - Pre-calculated values for display
 */

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  TAX_CONFIG,
  formatINR,
  isLTCG,
  CONFIG_LAST_UPDATED,
} from "@/lib/calculatorConfig";

// ============================================================================
// TYPES
// ============================================================================

type AssetType = keyof typeof TAX_CONFIG.ASSET_TYPES;
type TaxRegime = "new" | "old";

interface CalculationResult {
  assetType: string;
  holdingDays: number;
  holdingMonths: number;
  holdingYears: number;
  isLTCG: boolean;
  taxType: "LTCG" | "STCG";
  purchaseCost: number;
  saleProceedsGross: number;
  capitalGain: number;
  taxableGain: number;
  taxRate: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  netProceeds: number;
  effectiveTaxRate: number;
}

// ============================================================================
// STYLES
// ============================================================================

const INPUT_STYLE = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-gray-900";
const LABEL_STYLE = "block text-sm font-medium text-gray-700 mb-2";
const CARD_STYLE = "bg-white rounded-xl border border-gray-200 p-6";

// ============================================================================
// COMPONENT
// ============================================================================

interface Props {
  currentPrice?: number;
}

export default function CapitalGainsTaxCalculator({ currentPrice = 0 }: Props) {
  // ========================================================================
  // STATE
  // ========================================================================
  const [assetType, setAssetType] = useState<AssetType>("PHYSICAL_SILVER");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [salePrice, setSalePrice] = useState<string>(currentPrice > 0 ? currentPrice.toFixed(2) : "");
  const [weight, setWeight] = useState<string>("100");
  const [purchaseDate, setPurchaseDate] = useState<string>("");
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [taxRegime, setTaxRegime] = useState<TaxRegime>("new");
  const [annualIncome, setAnnualIncome] = useState<string>("1000000"); // For STCG slab calculation
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // ========================================================================
  // CALCULATIONS
  // ========================================================================
  const result = useMemo((): CalculationResult | null => {
    const purchasePriceNum = parseFloat(purchasePrice);
    const salePriceNum = parseFloat(salePrice);
    const weightNum = parseFloat(weight);
    
    if (!purchasePriceNum || !salePriceNum || !weightNum || !purchaseDate || !saleDate) {
      return null;
    }
    
    // Calculate holding period
    const purchaseDateObj = new Date(purchaseDate);
    const saleDateObj = new Date(saleDate);
    const holdingDays = Math.floor((saleDateObj.getTime() - purchaseDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    if (holdingDays < 0) return null;
    
    const holdingMonths = holdingDays / 30.44;
    const holdingYears = holdingDays / 365;
    
    // Calculate costs and proceeds
    const purchaseCost = purchasePriceNum * weightNum;
    const saleProceedsGross = salePriceNum * weightNum;
    const capitalGain = saleProceedsGross - purchaseCost;
    
    // No tax if loss
    if (capitalGain <= 0) {
      return {
        assetType: TAX_CONFIG.ASSET_TYPES[assetType].name,
        holdingDays,
        holdingMonths,
        holdingYears,
        isLTCG: isLTCG(holdingDays),
        taxType: isLTCG(holdingDays) ? "LTCG" : "STCG",
        purchaseCost,
        saleProceedsGross,
        capitalGain,
        taxableGain: 0,
        taxRate: 0,
        taxBeforeCess: 0,
        cess: 0,
        totalTax: 0,
        netProceeds: saleProceedsGross,
        effectiveTaxRate: 0,
      };
    }
    
    const taxableGain = capitalGain;
    const isLongTerm = isLTCG(holdingDays);
    
    let taxRate: number;
    let taxBeforeCess: number;
    
    if (isLongTerm) {
      // LTCG: Flat 12.5% (post July 2024)
      taxRate = TAX_CONFIG.LTCG_RATE;
      taxBeforeCess = taxableGain * taxRate;
    } else {
      // STCG: Added to income, taxed at slab rate
      const annualIncomeNum = parseFloat(annualIncome) || 0;
      const totalIncome = annualIncomeNum + taxableGain;
      const slabs = taxRegime === "new" ? TAX_CONFIG.NEW_REGIME_SLABS : TAX_CONFIG.OLD_REGIME_SLABS;
      
      // Find marginal tax rate
      let marginalRate = 0;
      for (let i = slabs.length - 1; i >= 0; i--) {
        const slab = slabs[i];
        if ('above' in slab && totalIncome > slab.above) {
          marginalRate = slab.rate;
          break;
        }
        if ('upto' in slab && totalIncome > slab.upto) {
          marginalRate = slabs[i + 1]?.rate || slab.rate;
          break;
        }
      }
      
      taxRate = marginalRate;
      taxBeforeCess = taxableGain * taxRate;
    }
    
    // Add 4% Health & Education Cess
    const cess = taxBeforeCess * TAX_CONFIG.CESS_RATE;
    const totalTax = taxBeforeCess + cess;
    const netProceeds = saleProceedsGross - totalTax;
    const effectiveTaxRate = (totalTax / capitalGain) * 100;
    
    return {
      assetType: TAX_CONFIG.ASSET_TYPES[assetType].name,
      holdingDays,
      holdingMonths,
      holdingYears,
      isLTCG: isLongTerm,
      taxType: isLongTerm ? "LTCG" : "STCG",
      purchaseCost,
      saleProceedsGross,
      capitalGain,
      taxableGain,
      taxRate,
      taxBeforeCess,
      cess,
      totalTax,
      netProceeds,
      effectiveTaxRate,
    };
  }, [purchasePrice, salePrice, weight, purchaseDate, saleDate, assetType, taxRegime, annualIncome]);

  // ========================================================================
  // HANDLERS
  // ========================================================================
  const handleUseLivePrice = useCallback(() => {
    if (currentPrice > 0) {
      setSalePrice(currentPrice.toFixed(2));
    }
  }, [currentPrice]);

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div className="space-y-6">
      {/* Main Calculator Card - Side by Side Layout */}
      <div className={CARD_STYLE}>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Capital Gains Tax Calculator
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Calculate estimated STCG/LTCG tax on your silver investment
        </p>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section - Left Side */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Asset Type */}
              <div>
                <label className={LABEL_STYLE}>Asset Type</label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as AssetType)}
                  className={INPUT_STYLE}
                >
                  {Object.entries(TAX_CONFIG.ASSET_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Weight */}
              <div>
                <label className={LABEL_STYLE}>Weight (grams)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="100"
                  min="0"
                  step="0.01"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Purchase Price */}
              <div>
                <label className={LABEL_STYLE}>Purchase Price (₹/g)</label>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  className={INPUT_STYLE}
                />
              </div>
              
              {/* Sale Price */}
              <div>
                <label className={LABEL_STYLE}>
                  Sale Price (₹/g)
                  {currentPrice > 0 && (
                    <button
                      type="button"
                      onClick={handleUseLivePrice}
                      className="ml-1 text-xs text-[#1e3a5f] hover:underline"
                    >
                      [Live]
                    </button>
                  )}
                </label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
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
              
              {/* Sale Date */}
              <div>
                <label className={LABEL_STYLE}>Sale Date</label>
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
              {/* Tax Regime (for STCG) */}
              <div>
                <label className={LABEL_STYLE}>Tax Regime</label>
                <select
                  value={taxRegime}
                  onChange={(e) => setTaxRegime(e.target.value as TaxRegime)}
                  className={INPUT_STYLE}
                >
                  <option value="new">New Regime</option>
                  <option value="old">Old Regime</option>
                </select>
              </div>
              
              {/* Annual Income (for slab calculation) */}
              <div>
                <label className={LABEL_STYLE}>Annual Income (₹)</label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                  placeholder="1000000"
                  min="0"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
          </div>
          
          {/* Results Section - Right Side */}
          <div>
            {result ? (
              <div className="space-y-4">
                {/* Tax Type Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{result.assetType}</span>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    result.isLTCG 
                      ? "bg-green-100 text-green-800" 
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {result.taxType}
                  </div>
                </div>
                
                {/* Holding Period */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Holding Period</span>
                    <span className="font-semibold">{result.holdingDays} days ({result.holdingYears.toFixed(1)}y)</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.isLTCG ? "✓ Long-Term" : "Short-Term"} (threshold: {TAX_CONFIG.LTCG_HOLDING_PERIOD_MONTHS} months)
                  </div>
                </div>
                
                {/* Key Figures */}
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Purchase Cost</span>
                    <span className="font-medium">{formatINR(result.purchaseCost)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Sale Proceeds</span>
                    <span className="font-medium">{formatINR(result.saleProceedsGross)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Capital Gain</span>
                    <span className={`font-semibold ${result.capitalGain >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {result.capitalGain >= 0 ? "+" : ""}{formatINR(result.capitalGain)}
                    </span>
                  </div>
                  {result.capitalGain > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Tax Rate + 4% Cess</span>
                      <span className="font-medium">{(result.taxRate * 100).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                
                {/* Final Results */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-red-600 mb-1">Estimated Tax</div>
                    <div className="text-xl font-bold text-red-700">
                      {formatINR(result.totalTax)}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-xs text-green-600 mb-1">Net Proceeds</div>
                    <div className="text-xl font-bold text-green-700">
                      {formatINR(result.netProceeds)}
                    </div>
                  </div>
                </div>
                
                {/* Tax Rule Note */}
                <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
                  {result.isLTCG ? (
                    <>LTCG @ {(TAX_CONFIG.LTCG_RATE * 100)}% flat (no indexation)</>
                  ) : (
                    <>STCG @ your income slab ({taxRegime === "new" ? "New" : "Old"} Regime)</>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-5xl mb-3">🏛️</div>
                  <p className="text-lg font-medium text-gray-600">Enter your details</p>
                  <p className="text-sm">Tax calculation will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className={CARD_STYLE}>
        <button
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            📚 How This Is Calculated
          </h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${showHowItWorks ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showHowItWorks && (
          <div className="mt-4 space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900">Long-Term Capital Gains (LTCG)</h4>
              <p>
                If you hold silver for more than {TAX_CONFIG.LTCG_HOLDING_PERIOD_MONTHS} months, 
                gains are taxed at a flat rate of {(TAX_CONFIG.LTCG_RATE * 100)}% + 4% cess.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Short-Term Capital Gains (STCG)</h4>
              <p>
                If you sell within {TAX_CONFIG.LTCG_HOLDING_PERIOD_MONTHS} months, gains are 
                added to your income and taxed at your applicable slab rate + 4% cess.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Formula Used</h4>
              <code className="block bg-gray-100 p-2 rounded mt-1">
                Tax = Taxable Gain × Tax Rate × (1 + Cess Rate)
              </code>
            </div>
          </div>
        )}
      </div>
      
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-amber-500 text-xl">⚠️</span>
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-2">Important Disclaimer</p>
            <ul className="space-y-1 list-disc list-inside text-amber-700">
              <li>This is an <strong>estimated calculation</strong> for informational purposes only.</li>
              <li>Tax rules change frequently. Always verify with the latest regulations.</li>
              <li>Surcharge may apply for high-value gains (not included here).</li>
              <li>Consult a qualified Chartered Accountant for actual tax filing.</li>
            </ul>
            <div className="mt-3 flex gap-4 text-xs">
              <a 
                href="https://incometaxindia.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-900 hover:underline"
              >
                Income Tax India Official →
              </a>
              <span className="text-amber-500">
                Config updated: {CONFIG_LAST_UPDATED}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
