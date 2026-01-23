"use client";

import { useState, useEffect } from "react";
import { calculateSilverPrice, formatIndianPrice } from "@/lib/metalApi";

interface CalculatorProps {
  currentPrice: number;
  compact?: boolean;
}

const PURITY_OPTIONS = [
  { value: 999, label: "999 (Pure)", description: "99.9% pure silver" },
  { value: 925, label: "925 (Sterling)", description: "92.5% pure silver" },
  { value: 900, label: "900 (Coin)", description: "90% pure silver" },
  { value: 800, label: "800", description: "80% pure silver" },
];

const WEIGHT_UNITS = [
  { value: "gram", label: "Grams", multiplier: 1 },
  { value: "kg", label: "Kilograms", multiplier: 1000 },
  { value: "tola", label: "Tola", multiplier: 11.6638 },
  { value: "oz", label: "Troy Ounce", multiplier: 31.1035 },
];

export default function Calculator({ currentPrice, compact = false }: CalculatorProps) {
  const [weight, setWeight] = useState<string>("10");
  const [weightUnit, setWeightUnit] = useState<string>("gram");
  const [purity, setPurity] = useState<number>(999);
  const [makingCharges, setMakingCharges] = useState<string>("8");
  const [includeGst, setIncludeGst] = useState<boolean>(true);
  
  const [result, setResult] = useState({
    metalValue: 0,
    makingCharges: 0,
    gst: 0,
    total: 0,
  });
  
  useEffect(() => {
    const weightNum = parseFloat(weight) || 0;
    const makingNum = parseFloat(makingCharges) || 0;
    const unit = WEIGHT_UNITS.find((u) => u.value === weightUnit);
    const weightInGrams = weightNum * (unit?.multiplier || 1);
    
    const calculated = calculateSilverPrice(
      weightInGrams,
      purity,
      currentPrice,
      makingNum,
      includeGst
    );
    
    setResult(calculated);
  }, [weight, weightUnit, purity, makingCharges, includeGst, currentPrice]);
  
  if (compact) {
    return (
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Calculator</h3>
        
        <div className="space-y-3 sm:space-y-4">
          {/* Weight Input */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-base min-h-[48px]"
                placeholder="Enter weight"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-base min-h-[48px]"
              >
                {WEIGHT_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Purity Select */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Purity
            </label>
            <select
              value={purity}
              onChange={(e) => setPurity(Number(e.target.value))}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-base min-h-[48px]"
            >
              {PURITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Result */}
          <div className="pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">Estimated Value</span>
              <span className="text-xl sm:text-2xl font-bold text-[#1e3a5f]">
                {formatIndianPrice(result.metalValue)}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
              *Excludes making charges and GST
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Silver Price Calculator</h3>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
        Calculate the exact price of silver based on weight, purity, and making charges
      </p>
      
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Input Section */}
        <div className="space-y-3 sm:space-y-4">
          {/* Weight Input */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-base min-h-[48px]"
                placeholder="Enter weight"
                min="0"
                step="0.01"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-base min-h-[48px]"
              >
                {WEIGHT_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Purity Select - Stack on mobile */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Purity
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PURITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPurity(option.value)}
                  className={`px-3 sm:px-4 py-3 rounded-lg border text-left transition-all min-h-[48px] active:scale-[0.98] ${
                    purity === option.value
                      ? "border-[#1e3a5f] bg-[#1e3a5f]/5 ring-2 ring-[#1e3a5f]"
                      : "border-gray-300 hover:border-gray-400 active:bg-gray-100"
                  }`}
                >
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{option.label}</span>
                  <span className="block text-[10px] sm:text-xs text-gray-500">{option.description}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Making Charges */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Making Charges (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={makingCharges}
              onChange={(e) => setMakingCharges(e.target.value)}
              className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent text-base min-h-[48px]"
              placeholder="Enter making charges %"
              min="0"
              max="50"
            />
          </div>
          
          {/* GST Toggle */}
          <div className="flex items-center justify-between py-2 min-h-[48px]">
            <span className="text-xs sm:text-sm font-medium text-gray-700">Include GST (3%)</span>
            <button
              onClick={() => setIncludeGst(!includeGst)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                includeGst ? "bg-[#1e3a5f]" : "bg-gray-300"
              }`}
              aria-label={includeGst ? "Disable GST" : "Enable GST"}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                  includeGst ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* Result Section */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mt-2 md:mt-0">
          <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-3 sm:mb-4">Price Breakdown</h4>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between">
              <span className="text-xs sm:text-sm text-gray-600">Silver Value ({purity})</span>
              <span className="font-medium text-sm sm:text-base">{formatIndianPrice(result.metalValue)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-xs sm:text-sm text-gray-600">Making ({makingCharges}%)</span>
              <span className="font-medium text-sm sm:text-base">{formatIndianPrice(result.makingCharges)}</span>
            </div>
            
            {includeGst && (
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-gray-600">GST (3%)</span>
                <span className="font-medium text-sm sm:text-base">{formatIndianPrice(result.gst)}</span>
              </div>
            )}
            
            <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-lg font-medium text-gray-900">Total Amount</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#1e3a5f]">
                  {formatIndianPrice(result.total)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Current Price Reference */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Based on current silver rate: <strong>{formatIndianPrice(currentPrice)}/gram</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
