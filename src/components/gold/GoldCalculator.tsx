"use client";

import { useState, useEffect } from "react";
import { calculateGoldJewelryPrice, formatIndianGoldPrice, PURITY_OPTIONS as GOLD_PURITY } from "@/lib/goldApi";

interface GoldCalculatorProps {
  currentPrice24K: number;
  compact?: boolean;
}

const PURITY_OPTIONS = [
  { value: "24K" as const, label: "24K (999)", description: "99.9% pure gold" },
  { value: "22K" as const, label: "22K (916)", description: "91.6% pure gold" },
  { value: "18K" as const, label: "18K (750)", description: "75% pure gold" },
  { value: "14K" as const, label: "14K (585)", description: "58.5% pure gold" },
];

const WEIGHT_UNITS = [
  { value: "gram", label: "Grams", multiplier: 1 },
  { value: "kg", label: "Kilograms", multiplier: 1000 },
  { value: "tola", label: "Tola", multiplier: 11.6638 },
  { value: "oz", label: "Troy Ounce", multiplier: 31.1035 },
];

export default function GoldCalculator({ currentPrice24K, compact = false }: GoldCalculatorProps) {
  const [weight, setWeight] = useState<string>("10");
  const [weightUnit, setWeightUnit] = useState<string>("gram");
  const [purity, setPurity] = useState<"24K" | "22K" | "18K" | "14K">("22K");
  const [makingCharges, setMakingCharges] = useState<string>("10");
  const [includeGst, setIncludeGst] = useState<boolean>(true);

  const [result, setResult] = useState({
    metalValue: 0,
    makingCharges: 0,
    gst: 0,
    total: 0,
    purityMultiplier: 0.916,
  });

  useEffect(() => {
    const weightNum = parseFloat(weight) || 0;
    const makingNum = parseFloat(makingCharges) || 0;
    const unit = WEIGHT_UNITS.find((u) => u.value === weightUnit);
    const weightInGrams = weightNum * (unit?.multiplier || 1);

    const calculated = calculateGoldJewelryPrice(
      weightInGrams,
      purity,
      currentPrice24K,
      makingNum,
      includeGst
    );

    // Add purity multiplier for display
    const purityMultiplier = purity === "24K" ? 0.999 : purity === "22K" ? 0.916 : purity === "18K" ? 0.750 : 0.585;
    setResult({ ...calculated, purityMultiplier });
  }, [weight, weightUnit, purity, makingCharges, includeGst, currentPrice24K]);

  if (compact) {
    return (
      <div className="card p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
        <h3 className="text-base sm:text-lg font-semibold text-amber-900 mb-3 sm:mb-4">Quick Gold Calculator</h3>

        <div className="space-y-3">
          {/* Weight Input */}
          <div>
            <label className="block text-xs font-medium text-amber-800 mb-1">
              Weight
            </label>
            <div className="grid grid-cols-5 gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="col-span-3 px-3 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm min-h-[44px] bg-white"
                placeholder="Weight"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="col-span-2 px-2 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm min-h-[44px] bg-white"
              >
                {WEIGHT_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Preset Weight Buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                { value: "1", unit: "gram", label: "1g" },
                { value: "8", unit: "gram", label: "8g" },
                { value: "10", unit: "gram", label: "10g" },
                { value: "1", unit: "tola", label: "1 tola" },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setWeight(preset.value);
                    setWeightUnit(preset.unit);
                  }}
                  className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors ${
                    weight === preset.value && weightUnit === preset.unit
                      ? "bg-amber-600 text-white"
                      : "bg-white text-amber-700 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Purity Select */}
          <div>
            <label className="block text-xs font-medium text-amber-800 mb-1">
              Purity
            </label>
            <select
              value={purity}
              onChange={(e) => setPurity(e.target.value as "24K" | "22K" | "18K" | "14K")}
              className="w-full px-3 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm min-h-[44px] bg-white"
            >
              {PURITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Result */}
          <div className="pt-3 sm:pt-4 border-t border-amber-200">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-amber-700">Estimated Value</span>
              <span className="text-xl sm:text-2xl font-bold text-amber-900">
                {formatIndianGoldPrice(result.metalValue)}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-amber-600 mt-1">
              *Excludes making charges and GST
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4 sm:p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
      <h3 className="text-base sm:text-lg font-semibold text-amber-900 mb-1 sm:mb-2">Gold Price Calculator</h3>
      <p className="text-xs sm:text-sm text-amber-700 mb-4 sm:mb-6">
        Calculate the exact price of gold based on weight, purity, and making charges
      </p>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Input Section */}
        <div className="space-y-3 sm:space-y-4">
          {/* Weight Input */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-amber-800 mb-1">
              Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base min-h-[48px] bg-white"
                placeholder="Enter weight"
                min="0"
                step="0.01"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="px-3 sm:px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base min-h-[48px] bg-white"
              >
                {WEIGHT_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Purity Select - Grid on larger screens */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-amber-800 mb-1">
              Purity
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PURITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPurity(option.value)}
                  className={`px-3 sm:px-4 py-3 rounded-lg border text-left transition-all min-h-[48px] active:scale-[0.98] ${
                    purity === option.value
                      ? "border-amber-600 bg-amber-100 ring-2 ring-amber-500"
                      : "border-amber-300 bg-white hover:border-amber-400 active:bg-amber-50"
                  }`}
                >
                  <span className="font-medium text-amber-900 text-sm sm:text-base">{option.label}</span>
                  <span className="block text-[10px] sm:text-xs text-amber-600">{option.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Making Charges */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-amber-800 mb-1">
              Making Charges (%)
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={makingCharges}
              onChange={(e) => setMakingCharges(e.target.value)}
              className="w-full px-3 sm:px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base min-h-[48px] bg-white"
              placeholder="Enter making charges %"
              min="0"
              max="50"
            />
            <p className="text-[10px] text-amber-600 mt-1">Typical range: 8-15% for jewelry</p>
          </div>

          {/* GST Toggle */}
          <div className="flex items-center justify-between py-2 min-h-[48px]">
            <span className="text-xs sm:text-sm font-medium text-amber-800">Include GST (3%)</span>
            <button
              onClick={() => setIncludeGst(!includeGst)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                includeGst ? "bg-amber-600" : "bg-gray-300"
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
        <div className="bg-white rounded-xl p-4 sm:p-6 mt-2 md:mt-0 border border-amber-200">
          <h4 className="text-xs sm:text-sm font-medium text-amber-700 mb-3 sm:mb-4">Price Breakdown</h4>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between">
              <span className="text-xs sm:text-sm text-amber-700">Gold Value ({purity})</span>
              <span className="font-medium text-sm sm:text-base text-amber-900">{formatIndianGoldPrice(result.metalValue)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-xs sm:text-sm text-amber-700">Making ({makingCharges}%)</span>
              <span className="font-medium text-sm sm:text-base text-amber-900">{formatIndianGoldPrice(result.makingCharges)}</span>
            </div>

            {includeGst && (
              <div className="flex justify-between">
                <span className="text-xs sm:text-sm text-amber-700">GST (3%)</span>
                <span className="font-medium text-sm sm:text-base text-amber-900">{formatIndianGoldPrice(result.gst)}</span>
              </div>
            )}

            <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-amber-200">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-lg font-medium text-amber-900">Total Amount</span>
                <span className="text-2xl sm:text-3xl font-bold text-amber-700">
                  {formatIndianGoldPrice(result.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Current Price Reference */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-amber-200">
            <p className="text-[10px] sm:text-xs text-amber-600">
              Based on current 24K gold rate: <strong>{formatIndianGoldPrice(currentPrice24K)}/gram</strong>
            </p>
            <p className="text-[10px] sm:text-xs text-amber-500 mt-1">
              Purity multiplier: {(result.purityMultiplier * 100).toFixed(1)}% ({purity})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
