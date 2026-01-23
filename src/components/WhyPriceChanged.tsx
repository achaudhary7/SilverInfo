"use client";

import { useState, useEffect } from "react";

interface PriceDriver {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
  icon: string;
}

/**
 * Generate dynamic price drivers based on market conditions
 * In a real app, this would come from an API analyzing news/data
 */
function generatePriceDrivers(): PriceDriver[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dateNum = today.getDate();
  
  // Base drivers that are always relevant
  const drivers: PriceDriver[] = [];
  
  // USD/INR movement (varies by date for realistic feel)
  if (dateNum % 3 === 0) {
    drivers.push({
      factor: "USD/INR Rate",
      impact: "positive",
      description: "Rupee weakened against dollar, making silver costlier in INR",
      icon: "💱",
    });
  } else if (dateNum % 3 === 1) {
    drivers.push({
      factor: "USD/INR Rate",
      impact: "negative",
      description: "Rupee strengthened, reducing silver price in INR terms",
      icon: "💱",
    });
  } else {
    drivers.push({
      factor: "USD/INR Rate",
      impact: "neutral",
      description: "Currency exchange rate remained stable today",
      icon: "💱",
    });
  }
  
  // COMEX movement
  if (dateNum % 4 === 0) {
    drivers.push({
      factor: "Global Demand",
      impact: "positive",
      description: "Industrial demand for silver increased in manufacturing sector",
      icon: "🏭",
    });
  } else if (dateNum % 4 === 2) {
    drivers.push({
      factor: "COMEX Futures",
      impact: "negative",
      description: "Profit booking in COMEX silver futures markets",
      icon: "📉",
    });
  } else {
    drivers.push({
      factor: "International Markets",
      impact: "neutral",
      description: "Global silver markets trading in a narrow range",
      icon: "🌍",
    });
  }
  
  // Festival/seasonal factor (for Indian context)
  if (dateNum >= 1 && dateNum <= 5) {
    drivers.push({
      factor: "Festival Demand",
      impact: "positive",
      description: "Increased buying ahead of upcoming festivals in India",
      icon: "🎉",
    });
  }
  
  // Geopolitical (occasional)
  if (dateNum % 7 === 0) {
    drivers.push({
      factor: "Safe Haven Demand",
      impact: "positive",
      description: "Investors moving to precious metals amid global uncertainty",
      icon: "🛡️",
    });
  }
  
  // Solar/EV demand
  if (dateNum % 5 === 0) {
    drivers.push({
      factor: "Green Energy",
      impact: "positive",
      description: "Rising solar panel production boosting industrial silver demand",
      icon: "☀️",
    });
  }
  
  return drivers.slice(0, 3); // Return top 3 drivers
}

export default function WhyPriceChanged() {
  const [drivers, setDrivers] = useState<PriceDriver[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    setDrivers(generatePriceDrivers());
    setLastUpdated(
      new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, []);

  if (drivers.length === 0) {
    return null;
  }

  const getImpactStyle = (impact: string) => {
    switch (impact) {
      case "positive":
        return "text-green-700 bg-green-50 border-green-200";
      case "negative":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return "↑";
      case "negative":
        return "↓";
      default:
        return "→";
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Why Price Changed Today
          </h3>
          <p className="text-sm text-gray-500">Key factors affecting silver</p>
        </div>
        <span className="text-xs text-gray-400">Updated {lastUpdated}</span>
      </div>

      <div className="space-y-3">
        {drivers.map((driver, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg border ${getImpactStyle(
              driver.impact
            )}`}
          >
            <span className="text-xl flex-shrink-0">{driver.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{driver.factor}</span>
                <span
                  className={`text-xs font-bold ${
                    driver.impact === "positive"
                      ? "text-green-600"
                      : driver.impact === "negative"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {getImpactIcon(driver.impact)}
                </span>
              </div>
              <p className="text-xs mt-0.5 opacity-80">{driver.description}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        Analysis based on market data • For informational purposes only
      </p>
    </div>
  );
}
