"use client";

import { useState, useEffect } from "react";

interface SeasonalComparisonProps {
  currentPrice: number; // Price per KG
  historicalPrices?: Array<{ date: string; price: number }>; // From API
}

// Key festival/event dates for 2025-2026
// Prices will be calculated from historical data if available
const FESTIVAL_DATES = [
  { key: "dhanteras2025", date: "2025-10-29", event: "Dhanteras 2025" },
  { key: "diwali2025", date: "2025-10-31", event: "Diwali 2025" },
  { key: "akshayaTritiya2025", date: "2025-05-01", event: "Akshaya Tritiya 2025" },
  { key: "newYear2026", date: "2026-01-01", event: "New Year 2026" },
  { key: "christmas2025", date: "2025-12-25", event: "Christmas 2025" },
];

/**
 * Find the closest historical price to a given date
 */
function findClosestPrice(
  targetDate: Date, 
  historicalPrices: Array<{ date: string; price: number }>
): number | null {
  if (!historicalPrices || historicalPrices.length === 0) return null;
  
  let closest = historicalPrices[0];
  let minDiff = Math.abs(new Date(closest.date).getTime() - targetDate.getTime());
  
  for (const price of historicalPrices) {
    const diff = Math.abs(new Date(price.date).getTime() - targetDate.getTime());
    if (diff < minDiff) {
      minDiff = diff;
      closest = price;
    }
  }
  
  // Only return if within 7 days of target date
  if (minDiff > 7 * 24 * 60 * 60 * 1000) return null;
  
  // Convert per gram to per kg
  return closest.price * 1000;
}

/**
 * SeasonalComparison Component
 * 
 * Shows price comparison with important dates like Dhanteras, Diwali, etc.
 * Uses REAL historical data from the API.
 */
export default function SeasonalComparison({ currentPrice, historicalPrices }: SeasonalComparisonProps) {
  const [mounted, setMounted] = useState(false);
  const [comparison, setComparison] = useState<{
    event: string;
    date: string;
    price: number;
    diff: number;
    diffPercent: number;
  } | null>(null);
  
  useEffect(() => {
    setMounted(true);
    
    // Find a valid comparison from historical data
    if (historicalPrices && historicalPrices.length > 0) {
      const now = new Date();
      
      // Find past festivals with available price data
      for (const festival of FESTIVAL_DATES) {
        const festivalDate = new Date(festival.date);
        if (festivalDate > now) continue; // Skip future dates
        
        const historicalPrice = findClosestPrice(festivalDate, historicalPrices);
        if (historicalPrice) {
          const diff = currentPrice - historicalPrice;
          const diffPercent = ((currentPrice - historicalPrice) / historicalPrice) * 100;
          
          setComparison({
            event: festival.event,
            date: festival.date,
            price: historicalPrice,
            diff,
            diffPercent,
          });
          break; // Use the most recent past festival
        }
      }
    }
  }, [currentPrice, historicalPrices]);

  if (!mounted) {
    return (
      <div className="card p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-gray-100 rounded"></div>
      </div>
    );
  }

  // If no historical data, show a simple week-over-week comparison
  if (!comparison && historicalPrices && historicalPrices.length >= 7) {
    const weekAgoPrice = historicalPrices[historicalPrices.length - 7]?.price * 1000; // per kg
    if (weekAgoPrice) {
      const diff = currentPrice - weekAgoPrice;
      const diffPercent = ((currentPrice - weekAgoPrice) / weekAgoPrice) * 100;
      
      return (
        <div className="card p-4 border border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <span>📊</span>
              vs Last Week
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              diff > 0 ? "bg-red-50 text-red-700" : diff < 0 ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"
            }`}>
              {diff > 0 ? "↑ Higher" : diff < 0 ? "↓ Lower" : "→ Same"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-lg font-bold ${diff > 0 ? "text-red-600" : diff < 0 ? "text-green-600" : "text-gray-600"}`}>
                {diff > 0 ? "+" : ""}₹{Math.abs(diff).toLocaleString("en-IN", { maximumFractionDigits: 0 })}/kg
              </p>
              <p className={`text-xs ${diff > 0 ? "text-red-500" : diff < 0 ? "text-green-500" : "text-gray-500"}`}>
                ({diff > 0 ? "+" : ""}{diffPercent.toFixed(1)}% change)
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500">7 days ago</p>
              <p className="text-sm font-medium text-gray-700">
                ₹{weekAgoPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}/kg
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  // No comparison data available
  if (!comparison) {
    return null;
  }

  const isHigher = comparison.diff > 0;
  const isMuchHigher = comparison.diffPercent > 5;
  const isMuchLower = comparison.diffPercent < -5;

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
          vs {comparison.event}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${recommendation.bg} ${recommendation.color} font-medium`}>
          {recommendation.icon} {recommendation.text}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-gray-500 mb-0.5">Current vs {comparison.event}</p>
          <p className={`text-lg font-bold ${isHigher ? "text-red-600" : "text-green-600"}`}>
            {isHigher ? "+" : ""}₹{Math.abs(comparison.diff).toLocaleString("en-IN", { maximumFractionDigits: 0 })}/kg
          </p>
          <p className={`text-xs ${isHigher ? "text-red-500" : "text-green-500"}`}>
            ({isHigher ? "+" : ""}{comparison.diffPercent.toFixed(1)}%)
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-[10px] text-gray-500">{comparison.event} price</p>
          <p className="text-sm font-medium text-gray-700">
            ₹{comparison.price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}/kg
          </p>
          <p className="text-[10px] text-gray-400">
            {new Date(comparison.date).toLocaleDateString("en-IN", { 
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
          💡 Based on actual historical prices from our database.
        </p>
      </div>
    </div>
  );
}
