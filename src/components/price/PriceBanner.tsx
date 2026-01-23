"use client";

/**
 * PriceBanner - Horizontal banner showing current price
 * 
 * Usage:
 * <PriceBanner />
 * <PriceBanner variant="compact" />
 * <PriceBanner variant="gradient" />
 */

import Link from "next/link";
import { formatIndianPrice, type SilverPrice } from "@/lib/metalApi";

interface PriceBannerProps {
  price: SilverPrice;
  variant?: "default" | "compact" | "gradient";
  className?: string;
}

export default function PriceBanner({
  price,
  variant = "default",
  className = "",
}: PriceBannerProps) {

  if (variant === "compact") {
    return (
      <div className={`bg-gray-900 text-white py-2 px-4 ${className}`}>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="text-gray-400">Silver Rate:</span>
          <span className="font-semibold">{formatIndianPrice(price.pricePerGram)}/g</span>
          <span className="flex items-center gap-1 text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live
          </span>
          <Link href="/" className="text-blue-400 hover:underline ml-2">
            View Details
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "gradient") {
    return (
      <div className={`bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white py-4 px-6 rounded-xl ${className}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-200">Silver Rate Today</p>
              <p className="text-2xl font-bold">{formatIndianPrice(price.pricePerGram)}/gram</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-blue-200">Per Kg</p>
              <p className="font-semibold">{formatIndianPrice(price.pricePerKg)}</p>
            </div>
            <Link
              href="/silver-price-calculator"
              className="px-4 py-2 bg-white text-[#1e3a5f] rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Calculate →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-green-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium">LIVE</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Silver Rate</p>
            <p className="text-xl font-bold text-gray-900">{formatIndianPrice(price.pricePerGram)}/gram</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">Per 10g</p>
            <p className="font-medium text-gray-900">{formatIndianPrice(price.pricePer10Gram)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Per Kg</p>
            <p className="font-medium text-gray-900">{formatIndianPrice(price.pricePerKg)}</p>
          </div>
          <Link
            href="/"
            className="px-3 py-1.5 bg-[#1e3a5f] text-white text-sm rounded-lg hover:bg-[#2c5282] transition-colors"
          >
            More →
          </Link>
        </div>
      </div>
    </div>
  );
}
