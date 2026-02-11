"use client";

import Link from "next/link";
import type { SnapshotPrice } from "@/lib/priceSnapshot";

interface WhyPriceChangedTeaserStaticProps {
  price: SnapshotPrice;
}

export default function WhyPriceChangedTeaserStatic({ price }: WhyPriceChangedTeaserStaticProps) {
  const change = price.changePercent24h;
  const shortExplanation = change > 0.5
    ? "Rupee weakened and international silver stayed strong."
    : change < -0.5
    ? "Rupee strengthened and international silver cooled."
    : "Markets were relatively stable in the last snapshot.";

  return (
    <div className="bg-gradient-to-r from-[#1e3a5f]/5 via-blue-50/50 to-[#1e3a5f]/5 rounded-xl p-4 sm:p-5 border border-[#1e3a5f]/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <span className="text-base sm:text-lg font-semibold text-gray-800">Why Price Moved (Snapshot)</span>
        </div>
        <Link
          href="#market-factors"
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1e3a5f]/10 hover:bg-[#1e3a5f]/20 rounded-lg transition-colors min-h-[44px]"
        >
          <span className="text-xs sm:text-sm text-[#1e3a5f] font-medium">See details</span>
          <span className="text-[#1e3a5f]">↓</span>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
        <div className="flex flex-col items-center px-2 sm:px-4 py-3 rounded-lg bg-white shadow-sm text-center">
          <span className="text-[10px] sm:text-xs text-gray-500 mb-1">COMEX</span>
          <span className="text-sm sm:text-lg font-bold text-gray-900">${price.comexUsd.toFixed(2)}</span>
          <span className="text-[10px] sm:text-[11px] text-gray-400">per oz</span>
        </div>

        <div className="flex flex-col items-center px-2 sm:px-4 py-3 rounded-lg bg-white shadow-sm text-center">
          <span className="text-[10px] sm:text-xs text-gray-500 mb-1">USD/INR</span>
          <span className="text-sm sm:text-lg font-bold text-gray-900">₹{price.usdInr.toFixed(2)}</span>
          <span className="text-[10px] sm:text-[11px] text-gray-400">exchange</span>
        </div>

        <div className={`flex flex-col items-center px-2 sm:px-4 py-3 rounded-lg shadow-sm text-center ${
          change > 0 ? "bg-green-50 border border-green-200" : change < 0 ? "bg-red-50 border border-red-200" : "bg-gray-50 border border-gray-200"
        }`}>
          <span className="text-[10px] sm:text-xs text-gray-500 mb-1">24h Change</span>
          <span className={`text-sm sm:text-lg font-bold ${
            change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-gray-600"
          }`}>
            {change > 0 ? "↑" : change < 0 ? "↓" : "→"} {Math.abs(change).toFixed(2)}%
          </span>
          <span className="text-[10px] sm:text-[11px] text-gray-400">in INR</span>
        </div>
      </div>

      <div className="flex flex-col px-4 py-3 rounded-lg bg-blue-50 border border-blue-200">
        <span className="text-xs text-blue-600 font-medium mb-1">Snapshot Insight</span>
        <span className="text-xs sm:text-sm text-blue-800">{shortExplanation}</span>
      </div>
    </div>
  );
}
