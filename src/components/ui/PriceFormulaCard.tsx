/**
 * PriceFormulaCard Component
 *
 * Shows the exact formula used to calculate Indian silver prices.
 * Builds trust through transparency.
 *
 * Formula:
 * INR Price = (COMEX USD/oz × USD/INR) / 31.1035 × (1 + ImportDuty) × (1 + GST) × (1 + MCXPremium)
 */

"use client";

import { useState } from "react";

interface PriceFormulaCardProps {
  comexUsd?: number;
  usdInr?: number;
  finalPriceInr?: number;
  variant?: "compact" | "full";
  className?: string;
}

export default function PriceFormulaCard({
  comexUsd = 30.50,
  usdInr = 84.50,
  finalPriceInr,
  variant = "compact",
  className = "",
}: PriceFormulaCardProps) {
  const [isExpanded, setIsExpanded] = useState(variant === "full");

  // Calculate step-by-step (Budget July 2024 - Updated Rates)
  const OZ_TO_GRAM = 31.1035;
  const IMPORT_DUTY = 0.06;  // 6% (5% BCD + 1% AIDC) - Budget July 2024
  const IGST = 0.03;         // 3%
  const MCX_PREMIUM = 0.03;  // 3% local market premium

  const step1 = comexUsd * usdInr;                    // Price per oz in INR
  const step2 = step1 / OZ_TO_GRAM;                   // Price per gram (base)
  const step3 = step2 * (1 + IMPORT_DUTY);            // With import duty
  const step4 = step3 * (1 + IGST);                   // With GST
  const step5 = step4 * (1 + MCX_PREMIUM);            // With MCX premium
  const calculatedPrice = finalPriceInr || step5;

  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <span>📐</span>
          <span>How is this price calculated?</span>
          <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
        </button>

        {isExpanded && (
          <div className="mt-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-sm">
            <FormulaContent
              comexUsd={comexUsd}
              usdInr={usdInr}
              step1={step1}
              step2={step2}
              step3={step3}
              step4={step4}
              step5={step5}
              calculatedPrice={calculatedPrice}
            />
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 p-5 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span>📐</span>
        How We Calculate Prices
      </h3>
      <FormulaContent
        comexUsd={comexUsd}
        usdInr={usdInr}
        step1={step1}
        step2={step2}
        step3={step3}
        step4={step4}
        step5={step5}
        calculatedPrice={calculatedPrice}
      />
    </div>
  );
}

function FormulaContent({
  comexUsd,
  usdInr,
  step1,
  step2,
  step3,
  step4,
  step5,
  calculatedPrice,
}: {
  comexUsd: number;
  usdInr: number;
  step1: number;
  step2: number;
  step3: number;
  step4: number;
  step5: number;
  calculatedPrice: number;
}) {
  return (
    <div className="space-y-4">
      {/* Formula - Updated Budget July 2024 */}
      <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-xs overflow-x-auto">
        <code className="text-emerald-400">
          INR/gram = (COMEX × USD/INR) ÷ 31.1 × 1.06 × 1.03 × 1.03
        </code>
      </div>

      {/* Step by step */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">① COMEX Spot Price</span>
          <span className="text-white font-medium">${comexUsd.toFixed(2)}/oz</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">② USD → INR Rate</span>
          <span className="text-white font-medium">₹{usdInr.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">③ Per Oz in INR</span>
          <span className="text-gray-300">₹{step1.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">④ Per Gram (base)</span>
          <span className="text-gray-300">₹{step2.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">⑤ + Import Duty (6%)</span>
          <span className="text-gray-300">₹{step3.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">⑥ + IGST (3%)</span>
          <span className="text-gray-300">₹{step4.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm border-t border-slate-700 pt-2 mt-2">
          <span className="text-gray-400">⑦ + MCX Premium (3%)</span>
          <span className="text-emerald-400 font-bold">₹{step5.toFixed(2)}/gram</span>
        </div>
      </div>

      {/* Accuracy note */}
      <div className="text-xs text-gray-500 border-t border-slate-700 pt-3">
        <p>
          <strong className="text-gray-400">Accuracy:</strong> ~98-99% of actual jeweller prices.
          Differences of ₹2-5/gram are normal due to local demand and dealer margins.
        </p>
      </div>

      {/* Data sources */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          📊 COMEX via Yahoo Finance
        </span>
        <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">
          💱 Forex via Frankfurter API
        </span>
      </div>
    </div>
  );
}

/**
 * Mini version for footer/sidebar
 */
export function PriceFormulaMini({ className = "" }: { className?: string }) {
  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      <span className="text-gray-400">Formula:</span>{" "}
      <code className="text-gray-500 bg-gray-800/50 px-1 rounded">
        COMEX × USD/INR ÷ 31.1 × 1.124
      </code>
    </div>
  );
}
