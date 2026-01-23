"use client";

/**
 * LiveRateCard - Reusable live silver rate card for sidebars
 * 
 * Features:
 * - Animated pulsing green "Live" indicator
 * - Current price display
 * - Last updated timestamp
 * - Optional link to main rates page
 * 
 * Usage:
 * <LiveRateCard price={priceData} />
 * <LiveRateCard price={priceData} showLink={false} />
 */

import Link from "next/link";
import type { SilverPrice } from "@/lib/metalApi";

interface LiveRateCardProps {
  price: SilverPrice;
  showLink?: boolean;
  className?: string;
}

export default function LiveRateCard({
  price,
  showLink = true,
  className = "",
}: LiveRateCardProps) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Current Silver Rate
        </h3>
        <span className="flex items-center gap-1.5 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-green-600 font-medium">Live</span>
        </span>
      </div>
      <div className="text-3xl font-bold text-[#1e3a5f] mb-2">
        ₹{price.pricePerGram.toFixed(2)}
        <span className="text-lg font-normal text-gray-500">
          /gram
        </span>
      </div>
      <p className="text-xs text-gray-400">
        Last updated:{" "}
        {new Date(price.timestamp).toLocaleTimeString("en-IN")}
      </p>
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
