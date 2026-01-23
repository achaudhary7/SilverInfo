"use client";

import { useState, useEffect } from "react";

interface SeasonalComparisonProps {
  currentPrice: number;
}

// Historical prices for key dates (approximate values for demonstration)
// In production, these would come from an API or database
const SEASONAL_PRICES: Record<string, { price: number; date: string; event: string }> = {
  dhanteras2025: {
    price: 92500, // per kg
    date: "2025-10-29",
    event: "Dhanteras 2025",
  },
  diwali2025: {
    price: 93000, // per kg
    date: "2025-10-31",
    event: "Diwali 2025",
  },
  akshayaTritiya2025: {
    price: 88000, // per kg
    date: "2025-05-01",
    event: "Akshaya Tritiya 2025",
  },
  newYear2026: {
    price: 95000, // per kg  
    date: "2026-01-01",
    event: "New Year 2026",
  },
};

/**
 * SeasonalComparison Component
 * 
 * Shows price comparison with important dates like Dhanteras, Diwali, etc.
 * Helps users understand if current price is good for buying.
 */
export default function SeasonalComparison({ currentPrice }: SeasonalComparisonProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-gray-100 rounded"></div>
      </div>
    );
  }

  // Find the most recent past event for comparison
  const now = new Date();
  const comparisons = Object.entries(SEASONAL_PRICES)
    .map(([key, data]) => ({
      key,
      ...data,
      dateObj: new Date(data.date),
      diff: currentPrice - data.price,
      diffPercent: ((currentPrice - data.price) / data.price) * 100,
    }))
    .filter(item => item.dateObj <= now) // Only past events
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime()); // Most recent first

  const primaryComparison = comparisons[0];
  
  if (!primaryComparison) {
    return null;
  }

  const isHigher = primaryComparison.diff > 0;
  const isMuchHigher = primaryComparison.diffPercent > 5;
  const isMuchLower = primaryComparison.diffPercent < -5;

  // Get buying recommendation
  const getRecommendation = () => {
    if (isMuchLower) {
      return { icon: "🟢", text: "Good time to buy!", color: "text-green-700", bg: "bg-green-50" };
    } else if (isMuchHigher) {
      return { icon: "🔴", text: "Consider waiting", color: "text-red-700", bg: "bg-red-50" };
    } else if (isHigher) {
      return { icon: "🟡", text: "Fair price", color: "text-yellow-700", bg: "bg-yellow-50" };
    }
    return { icon: "🟢", text: "Below festival price", color: "text-green-700", bg: "bg-green-50" };
  };

  const recommendation = getRecommendation();

  return (
    <div className="card p-4 border border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <span>🪔</span>
          vs {primaryComparison.event}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${recommendation.bg} ${recommendation.color} font-medium`}>
          {recommendation.icon} {recommendation.text}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-500 mb-0.5">Current vs {primaryComparison.event}</p>
          <p className={`text-lg font-bold ${isHigher ? "text-red-600" : "text-green-600"}`}>
            {isHigher ? "+" : ""}₹{Math.abs(primaryComparison.diff).toLocaleString("en-IN")}/kg
          </p>
          <p className={`text-xs ${isHigher ? "text-red-500" : "text-green-500"}`}>
            ({isHigher ? "+" : ""}{primaryComparison.diffPercent.toFixed(1)}%)
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] text-gray-500">{primaryComparison.event} price</p>
          <p className="text-sm font-medium text-gray-700">
            ₹{primaryComparison.price.toLocaleString("en-IN")}/kg
          </p>
          <p className="text-[10px] text-gray-400">
            {new Date(primaryComparison.date).toLocaleDateString("en-IN", { 
              day: "numeric", 
              month: "short",
              year: "numeric"
            })}
          </p>
        </div>
      </div>

      {/* Quick context */}
      <div className="mt-3 pt-3 border-t border-amber-200">
        <p className="text-[10px] text-gray-500">
          💡 Silver prices often peak during Dhanteras & Diwali due to high demand.
        </p>
      </div>
    </div>
  );
}
