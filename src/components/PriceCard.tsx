"use client";

import Link from "next/link";
import { formatIndianPrice, type SilverPrice } from "@/lib/metalApi";

interface PriceCardProps {
  price: SilverPrice;
}

export default function PriceCard({ price }: PriceCardProps) {
  return (
    <div className="card p-6">
      {/* Main Price Display */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm text-gray-500">Silver Rate Today</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-700">LIVE</span>
            </span>
          </div>
          <p className="text-4xl font-bold text-gray-900 price-display">
            {formatIndianPrice(price.pricePerGram)}
            <span className="text-lg font-normal text-gray-500">/gram</span>
          </p>
        </div>
        
        {/* Quick Action */}
        <Link
          href="/silver-price-calculator"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] text-white rounded-full text-xs font-medium hover:bg-[#2c5282] transition-colors"
        >
          <span>🧮</span>
          <span>Calculate</span>
        </Link>
      </div>
      
      {/* Price Grid */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-1">Per 10 Gram</p>
          <p className="text-lg font-semibold text-gray-900 price-display">
            {formatIndianPrice(price.pricePer10Gram)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Per Kg</p>
          <p className="text-lg font-semibold text-gray-900 price-display">
            {formatIndianPrice(price.pricePerKg)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Per Tola</p>
          <p className="text-lg font-semibold text-gray-900 price-display">
            {formatIndianPrice(price.pricePerTola)}
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>Updated: {new Date(price.timestamp).toLocaleTimeString("en-IN")}</span>
        <Link href="/how-we-calculate" className="text-[#1e3a5f] hover:underline">
          How we calculate →
        </Link>
      </div>
      
      <p className="mt-2 text-center text-xs text-gray-400">
        Indicative prices • Not official exchange rates
      </p>
    </div>
  );
}
