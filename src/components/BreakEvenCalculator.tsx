"use client";

/**
 * Break-Even Calculator for Silver Jewellery & Bullion
 * 
 * Calculates the break-even price including all costs like making charges,
 * GST, and other fees. Compares against current market price.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Includes making charges (percentage or flat)
 * - GST calculation (3% on silver + 5% on making charges)
 * - Optional fees (hallmarking, shipping)
 * - Market vs Jeweller buyback scenarios
 * - Clear above/below break-even indicators
 */

import { useState, useMemo, useCallback } from "react";
import {
  GST_CONFIG,
  CALCULATOR_DEFAULTS,
  formatINR,
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

type PurchaseType = "jewellery" | "bullion";
type MakingChargeType = "percentage" | "flat";
type BuybackScenario = "market" | "jeweller";

interface BreakEvenResult {
  purchaseType: string;
  weight: number;
  purchasePricePerGram: number;
  silverValue: number;
  makingChargesAmount: number;
  gstOnSilver: number;
  gstOnMakingCharges: number;
  totalGST: number;
  otherFees: number;
  totalCost: number;
  breakEvenPricePerGram: number;
  currentPrice: number;
  difference: number;
  differencePercent: number;
  isAboveBreakEven: boolean;
  buybackScenario: BuybackScenario;
  buybackDiscount: number;
  adjustedCurrentPrice: number;
  adjustedDifference: number;
  adjustedIsAboveBreakEven: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

interface Props {
  currentPrice?: number;
}

export default function BreakEvenCalculator({ currentPrice = 0 }: Props) {
  // ========================================================================
  // STATE
  // ========================================================================
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("jewellery");
  const [weight, setWeight] = useState<string>("50");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [marketPrice, setMarketPrice] = useState<string>(currentPrice > 0 ? currentPrice.toFixed(2) : "");
  const [makingChargeType, setMakingChargeType] = useState<MakingChargeType>("percentage");
  const [makingChargeValue, setMakingChargeValue] = useState<string>("10");
  const [hallmarkingFee, setHallmarkingFee] = useState<string>("45");
  const [otherFees, setOtherFees] = useState<string>("0");
  const [buybackScenario, setBuybackScenario] = useState<BuybackScenario>("market");
  const [buybackDiscount, setBuybackDiscount] = useState<string>("5");
  const [showDetails, setShowDetails] = useState(false);

  // ========================================================================
  // CALCULATIONS
  // ========================================================================
  const result = useMemo((): BreakEvenResult | null => {
    const weightNum = parseFloat(weight);
    const purchasePriceNum = parseFloat(purchasePrice);
    const marketPriceNum = parseFloat(marketPrice);
    const makingChargeNum = parseFloat(makingChargeValue) || 0;
    const hallmarkingFeeNum = parseFloat(hallmarkingFee) || 0;
    const otherFeesNum = parseFloat(otherFees) || 0;
    const buybackDiscountNum = parseFloat(buybackDiscount) || 0;
    
    if (!weightNum || weightNum <= 0 || !purchasePriceNum || purchasePriceNum <= 0) {
      return null;
    }
    
    // Calculate silver value
    const silverValue = purchasePriceNum * weightNum;
    
    // Calculate making charges
    let makingChargesAmount: number;
    if (makingChargeType === "percentage") {
      makingChargesAmount = silverValue * (makingChargeNum / 100);
    } else {
      makingChargesAmount = makingChargeNum * weightNum; // Per gram flat rate
    }
    
    // For bullion, making charges are minimal
    if (purchaseType === "bullion") {
      makingChargesAmount = silverValue * 0.02; // ~2% premium for bullion
    }
    
    // Calculate GST
    const gstOnSilver = silverValue * GST_CONFIG.SILVER_GST_RATE;
    const gstOnMakingCharges = makingChargesAmount * GST_CONFIG.MAKING_CHARGES_GST_RATE;
    const totalGST = gstOnSilver + gstOnMakingCharges;
    
    // Other fees (hallmarking + custom)
    const totalOtherFees = (purchaseType === "jewellery" ? hallmarkingFeeNum : 0) + otherFeesNum;
    
    // Total cost
    const totalCost = silverValue + makingChargesAmount + totalGST + totalOtherFees;
    
    // Break-even price per gram
    const breakEvenPricePerGram = totalCost / weightNum;
    
    // Current market comparison
    const currentPriceNum = marketPriceNum || currentPrice;
    const difference = currentPriceNum - breakEvenPricePerGram;
    const differencePercent = (difference / breakEvenPricePerGram) * 100;
    const isAboveBreakEven = difference >= 0;
    
    // Adjusted for buyback scenario
    let adjustedCurrentPrice = currentPriceNum;
    if (buybackScenario === "jeweller") {
      adjustedCurrentPrice = currentPriceNum * (1 - buybackDiscountNum / 100);
    }
    const adjustedDifference = adjustedCurrentPrice - breakEvenPricePerGram;
    const adjustedIsAboveBreakEven = adjustedDifference >= 0;
    
    return {
      purchaseType: purchaseType === "jewellery" ? "Silver Jewellery" : "Silver Bullion (Bars/Coins)",
      weight: weightNum,
      purchasePricePerGram: purchasePriceNum,
      silverValue,
      makingChargesAmount,
      gstOnSilver,
      gstOnMakingCharges,
      totalGST,
      otherFees: totalOtherFees,
      totalCost,
      breakEvenPricePerGram,
      currentPrice: currentPriceNum,
      difference,
      differencePercent,
      isAboveBreakEven,
      buybackScenario,
      buybackDiscount: buybackDiscountNum,
      adjustedCurrentPrice,
      adjustedDifference,
      adjustedIsAboveBreakEven,
    };
  }, [
    purchaseType, weight, purchasePrice, marketPrice, makingChargeType,
    makingChargeValue, hallmarkingFee, otherFees, buybackScenario, buybackDiscount, currentPrice
  ]);

  // ========================================================================
  // HANDLERS
  // ========================================================================
  const handleUseLivePrice = useCallback(() => {
    if (currentPrice > 0) {
      setMarketPrice(currentPrice.toFixed(2));
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
          Break-Even Calculator
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Calculate the break-even price for your silver purchase
        </p>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section - Left Side */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Purchase Type */}
              <div>
                <label className={LABEL_STYLE}>Type</label>
                <select
                  value={purchaseType}
                  onChange={(e) => setPurchaseType(e.target.value as PurchaseType)}
                  className={INPUT_STYLE}
                >
                  <option value="jewellery">Jewellery</option>
                  <option value="bullion">Bullion</option>
                </select>
              </div>
              
              {/* Weight */}
              <div>
                <label className={LABEL_STYLE}>Weight (grams)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="50"
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
              
              {/* Current Market Price */}
              <div>
                <label className={LABEL_STYLE}>
                  Market Price (₹/g)
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
                  value={marketPrice}
                  onChange={(e) => setMarketPrice(e.target.value)}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  className={INPUT_STYLE}
                />
              </div>
            </div>
            
            {/* Making Charges - Only for Jewellery */}
            {purchaseType === "jewellery" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_STYLE}>Making Type</label>
                    <select
                      value={makingChargeType}
                      onChange={(e) => setMakingChargeType(e.target.value as MakingChargeType)}
                      className={INPUT_STYLE}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="flat">Flat ₹/gram</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={LABEL_STYLE}>
                      Making {makingChargeType === "percentage" ? "(%)" : "(₹/g)"}
                    </label>
                    <input
                      type="number"
                      value={makingChargeValue}
                      onChange={(e) => setMakingChargeValue(e.target.value)}
                      placeholder="10"
                      min="0"
                      step="0.1"
                      className={INPUT_STYLE}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL_STYLE}>Hallmarking (₹)</label>
                    <input
                      type="number"
                      value={hallmarkingFee}
                      onChange={(e) => setHallmarkingFee(e.target.value)}
                      placeholder="45"
                      min="0"
                      className={INPUT_STYLE}
                    />
                  </div>
                  <div>
                    <label className={LABEL_STYLE}>Other Fees (₹)</label>
                    <input
                      type="number"
                      value={otherFees}
                      onChange={(e) => setOtherFees(e.target.value)}
                      placeholder="0"
                      min="0"
                      className={INPUT_STYLE}
                    />
                  </div>
                </div>
              </>
            )}
            
            {purchaseType === "bullion" && (
              <div>
                <label className={LABEL_STYLE}>Other Fees (₹)</label>
                <input
                  type="number"
                  value={otherFees}
                  onChange={(e) => setOtherFees(e.target.value)}
                  placeholder="0"
                  min="0"
                  className={INPUT_STYLE}
                />
              </div>
            )}
            
            {/* Buyback Scenario */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_STYLE}>Buyback Type</label>
                  <select
                    value={buybackScenario}
                    onChange={(e) => setBuybackScenario(e.target.value as BuybackScenario)}
                    className={INPUT_STYLE}
                  >
                    <option value="market">Market Rate</option>
                    <option value="jeweller">Jeweller (discount)</option>
                  </select>
                </div>
                
                {buybackScenario === "jeweller" && (
                  <div>
                    <label className={LABEL_STYLE}>Discount (%)</label>
                    <input
                      type="number"
                      value={buybackDiscount}
                      onChange={(e) => setBuybackDiscount(e.target.value)}
                      placeholder="5"
                      min="0"
                      max="20"
                      step="0.5"
                      className={INPUT_STYLE}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Results Section - Right Side */}
          <div>
            {result ? (
              <div className="space-y-4">
                {/* Break-Even Status */}
                <div className={`text-center p-4 rounded-lg ${
                  (buybackScenario === "market" ? result.isAboveBreakEven : result.adjustedIsAboveBreakEven)
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}>
                  <div className={`text-3xl mb-1 ${
                    (buybackScenario === "market" ? result.isAboveBreakEven : result.adjustedIsAboveBreakEven)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    {(buybackScenario === "market" ? result.isAboveBreakEven : result.adjustedIsAboveBreakEven) ? "✅" : "⚠️"}
                  </div>
                  <div className={`text-xl font-bold ${
                    (buybackScenario === "market" ? result.isAboveBreakEven : result.adjustedIsAboveBreakEven)
                      ? "text-green-700"
                      : "text-red-700"
                  }`}>
                    {(buybackScenario === "market" ? result.isAboveBreakEven : result.adjustedIsAboveBreakEven)
                      ? "Above Break-Even"
                      : "Below Break-Even"
                    }
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {(buybackScenario === "market" ? result.isAboveBreakEven : result.adjustedIsAboveBreakEven) ? (
                      <>Profit: <span className="font-semibold text-green-600">{formatINR(Math.abs(buybackScenario === "market" ? result.difference : result.adjustedDifference) * result.weight)}</span></>
                    ) : (
                      <>Need: <span className="font-semibold text-red-600">+₹{Math.abs(buybackScenario === "market" ? result.difference : result.adjustedDifference).toFixed(2)}/g</span></>
                    )}
                  </div>
                </div>
                
                {/* Key Numbers */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Break-Even</div>
                    <div className="text-lg font-bold text-gray-900">₹{result.breakEvenPricePerGram.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">per gram</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">{buybackScenario === "market" ? "Market" : "Buyback"}</div>
                    <div className="text-lg font-bold text-gray-900">₹{(buybackScenario === "market" ? result.currentPrice : result.adjustedCurrentPrice).toFixed(2)}</div>
                    <div className="text-xs text-gray-400">per gram</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Difference</div>
                    <div className={`text-lg font-bold ${(buybackScenario === "market" ? result.difference : result.adjustedDifference) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {(buybackScenario === "market" ? result.difference : result.adjustedDifference) >= 0 ? "+" : ""}₹{(buybackScenario === "market" ? result.difference : result.adjustedDifference).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">per gram</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Total Cost</div>
                    <div className="text-lg font-bold text-gray-900">{formatINR(result.totalCost)}</div>
                    <div className="text-xs text-gray-400">{result.weight}g</div>
                  </div>
                </div>
                
                {/* Cost Breakdown */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center justify-between w-full text-left py-2 border-t border-gray-200 text-sm"
                >
                  <span className="font-medium text-gray-900">Cost Breakdown</span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${showDetails ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDetails && (
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Silver Value</span>
                      <span className="font-medium">{formatINR(result.silverValue)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Making Charges</span>
                      <span className="font-medium">{formatINR(result.makingChargesAmount)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">GST (Silver 3% + Making 5%)</span>
                      <span className="font-medium">{formatINR(result.totalGST)}</span>
                    </div>
                    {result.otherFees > 0 && (
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Other Fees</span>
                        <span className="font-medium">{formatINR(result.otherFees)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-5xl mb-3">⚖️</div>
                  <p className="text-lg font-medium text-gray-600">Enter your details</p>
                  <p className="text-sm">Break-even analysis will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Important Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-900 mb-2">⚠️ Important to Know</h4>
        <ul className="space-y-1 text-sm text-amber-800 list-disc list-inside">
          <li>Making charges are typically <strong>not recoverable</strong> when selling back</li>
          <li>Jeweller buyback prices are usually 2-10% below market rate</li>
          <li>Bullion (bars/coins) has better resale value than jewellery</li>
          <li>Always get multiple quotes before selling</li>
        </ul>
      </div>
      
      {/* Config Update */}
      <div className="text-xs text-gray-500 text-center">
        GST Rates: Silver {(GST_CONFIG.SILVER_GST_RATE * 100)}% | Making Charges {(GST_CONFIG.MAKING_CHARGES_GST_RATE * 100)}% • 
        Last Updated: {CONFIG_LAST_UPDATED}
      </div>
    </div>
  );
}
