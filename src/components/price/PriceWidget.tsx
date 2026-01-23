"use client";

/**
 * PriceWidget - Compact price display for sidebars and small spaces
 * 
 * Usage:
 * <PriceWidget />
 * <PriceWidget variant="minimal" />
 */

import Link from "next/link";
import { formatIndianPrice, type SilverPrice } from "@/lib/metalApi";

interface PriceWidgetProps {
  price: SilverPrice;
  variant?: "default" | "minimal" | "detailed";
  showLink?: boolean;
  className?: string;
}

export default function PriceWidget({
  price,
  variant = "default",
  showLink = true,
  className = "",
}: PriceWidgetProps) {

  if (variant === "minimal") {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span className="font-semibold text-gray-900">
          {formatIndianPrice(price.pricePerGram)}/g
        </span>
        <span className="flex items-center gap-1 text-xs text-green-600">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Silver Rate</span>
          <span className="flex items-center gap-1 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </span>
        </div>
        
        <p className="text-2xl font-bold text-gray-900 mb-3">
          {formatIndianPrice(price.pricePerGram)}
          <span className="text-sm font-normal text-gray-500">/gram</span>
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-500">Per 10g</p>
            <p className="font-medium">{formatIndianPrice(price.pricePer10Gram)}</p>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <p className="text-xs text-gray-500">Per Kg</p>
            <p className="font-medium">{formatIndianPrice(price.pricePerKg)}</p>
          </div>
        </div>
        
        {showLink && (
          <Link
            href="/"
            className="block mt-3 text-center text-sm text-[#1e3a5f] hover:underline"
          >
            View Full Details →
          </Link>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Silver Rate</p>
          <p className="text-lg font-bold text-gray-900">
            {formatIndianPrice(price.pricePerGram)}
            <span className="text-xs font-normal text-gray-500">/g</span>
          </p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-700">Live</span>
        </div>
      </div>
      {showLink && (
        <Link
          href="/"
          className="block mt-2 text-center text-xs text-[#1e3a5f] hover:underline"
        >
          More Details →
        </Link>
      )}
    </div>
  );
}
