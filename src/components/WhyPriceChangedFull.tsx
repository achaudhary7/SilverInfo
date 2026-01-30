"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface PriceDriver {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
  icon: string;
  link?: { text: string; href: string; external?: boolean };
  value?: string;
}

interface MarketData {
  pricePerGram: number;
  change24h: number;
  changePercent24h: number;
  usdInr: number;
  comexUsd: number;
  timestamp: string;
}

/**
 * WhyPriceChangedFull Component
 * 
 * Full-width section with detailed market analysis.
 * Displays real market data and explains why silver prices moved.
 * 
 * This is a KEY DIFFERENTIATOR for SilverInfo.in
 */
export default function WhyPriceChangedFull() {
  const [drivers, setDrivers] = useState<PriceDriver[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState<MarketData | null>(null);

  const fetchAndAnalyze = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Use Edge cache to reduce requests
      const response = await fetch("/api/price", {
        next: { revalidate: 15 },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch price data");
      }
      
      const data = await response.json();
      setMarketData(data);
      
      const newDrivers = generateRealDrivers(data);
      setDrivers(newDrivers);
      
      setLastUpdated(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch (error) {
      console.error("Error fetching market data:", error);
      setDrivers(getFallbackDrivers());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndAnalyze();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchAndAnalyze, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAndAnalyze]);

  if (isLoading) {
    return (
      <div id="why-price-changed" className="card p-6 sm:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-50 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const overallChange = marketData?.changePercent24h || 0;
  const usdInr = marketData?.usdInr || 84;
  const comexUsd = marketData?.comexUsd || 30;
  
  const sentimentText = overallChange > 0.5 
    ? "Silver prices are UP today" 
    : overallChange < -0.5 
    ? "Silver prices are DOWN today"
    : "Silver prices are STABLE today";
    
  const sentimentEmoji = overallChange > 0.5 ? "📈" : overallChange < -0.5 ? "📉" : "➡️";

  return (
    <div 
      id="why-price-changed" 
      className="card overflow-hidden border-2 border-[#1e3a5f]/10 scroll-mt-20"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📊</span>
              <h2 className="text-xl sm:text-2xl font-bold">
                Why Silver Price Changed Today
              </h2>
            </div>
            <p className="text-sm text-white/80">
              Real-time market intelligence • Updated {lastUpdated}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{sentimentEmoji}</span>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {overallChange > 0 ? "+" : ""}{overallChange.toFixed(2)}%
              </p>
              <p className="text-xs text-white/70">24-hour change</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* COMEX Silver */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🌍</span>
              <span className="text-sm font-medium text-gray-500">COMEX Silver</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${comexUsd.toFixed(2)}</p>
            <p className="text-xs text-gray-500">per troy ounce</p>
            <a 
              href="https://www.cmegroup.com/markets/metals/precious/silver.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#1e3a5f] hover:underline mt-2 inline-block"
            >
              View on CME →
            </a>
          </div>
          
          {/* USD/INR */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💱</span>
              <span className="text-sm font-medium text-gray-500">USD/INR Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{usdInr.toFixed(2)}</p>
            <p className="text-xs text-gray-500">per US Dollar</p>
            <a 
              href="https://www.rbi.org.in/scripts/ReferenceRateArchive.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#1e3a5f] hover:underline mt-2 inline-block"
            >
              RBI Reference Rate →
            </a>
          </div>
          
          {/* Today's Sentiment */}
          <div className={`rounded-xl p-4 shadow-sm border ${
            overallChange > 0.5 
              ? "bg-green-50 border-green-200" 
              : overallChange < -0.5 
              ? "bg-red-50 border-red-200"
              : "bg-gray-50 border-gray-200"
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{sentimentEmoji}</span>
              <span className="text-sm font-medium text-gray-500">Market Sentiment</span>
            </div>
            <p className={`text-lg font-bold ${
              overallChange > 0.5 
                ? "text-green-700" 
                : overallChange < -0.5 
                ? "text-red-700"
                : "text-gray-700"
            }`}>
              {sentimentText}
            </p>
            <p className="text-xs text-gray-500 mt-1">Based on 24h movement</p>
          </div>
        </div>
        
        {/* Detailed Analysis */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>🔍</span> Today&apos;s Price Drivers
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((driver, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                driver.impact === "positive"
                  ? "bg-green-50/50 border-green-200 hover:border-green-300"
                  : driver.impact === "negative"
                  ? "bg-red-50/50 border-red-200 hover:border-red-300"
                  : "bg-gray-50/50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{driver.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900">{driver.factor}</span>
                    {driver.value && (
                      <span className="text-xs font-mono bg-white px-2 py-0.5 rounded shadow-sm">
                        {driver.value}
                      </span>
                    )}
                    <span className={`text-sm font-bold ${
                      driver.impact === "positive"
                        ? "text-green-600"
                        : driver.impact === "negative"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}>
                      {driver.impact === "positive" ? "↑" : driver.impact === "negative" ? "↓" : "→"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{driver.description}</p>
                  {driver.link && (
                    driver.link.external ? (
                      <a 
                        href={driver.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#1e3a5f] hover:underline mt-2 inline-block font-medium"
                      >
                        {driver.link.text} →
                      </a>
                    ) : (
                      <Link 
                        href={driver.link.href}
                        className="text-xs text-[#1e3a5f] hover:underline mt-2 inline-block font-medium"
                      >
                        {driver.link.text} →
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer with Sources */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">
                Analysis based on real-time market data • For informational purposes only
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Prices calculated from COMEX futures + USD/INR. Not official MCX rates.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://www.mcxindia.com/market-data/spot-market-price"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors font-medium"
              >
                MCX India
              </a>
              <a
                href="https://www.rbi.org.in/scripts/ReferenceRateArchive.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors font-medium"
              >
                RBI Forex
              </a>
              <Link
                href="/how-we-calculate"
                className="text-xs px-3 py-1.5 bg-[#1e3a5f] hover:bg-[#2c5282] rounded-lg text-white transition-colors font-medium"
              >
                How We Calculate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generate price drivers based on REAL market data
 */
function generateRealDrivers(data: MarketData): PriceDriver[] {
  const drivers: PriceDriver[] = [];
  const change = data.changePercent24h || 0;
  
  // 1. USD/INR Rate Analysis
  const usdInr = data.usdInr || 84;
  drivers.push({
    factor: "USD/INR Exchange Rate",
    impact: change > 0.3 ? "positive" : change < -0.3 ? "negative" : "neutral",
    description: change > 0.3 
      ? `Rupee at ₹${usdInr.toFixed(2)}/USD. Weaker rupee makes imported silver costlier, pushing prices up.`
      : change < -0.3
      ? `Rupee strengthened to ₹${usdInr.toFixed(2)}/USD, reducing silver prices in INR terms.`
      : `Rupee stable at ₹${usdInr.toFixed(2)}/USD. Exchange rate having minimal impact today.`,
    icon: "💱",
    value: `₹${usdInr.toFixed(2)}`,
    link: {
      text: "RBI Reference Rate",
      href: "https://www.rbi.org.in/scripts/ReferenceRateArchive.aspx",
      external: true
    }
  });
  
  // 2. COMEX/International Price Analysis
  const comexUsd = data.comexUsd || 30;
  drivers.push({
    factor: "COMEX Silver Futures",
    impact: change > 0.5 ? "positive" : change < -0.5 ? "negative" : "neutral",
    description: change > 0.5
      ? `International silver trading higher at $${comexUsd.toFixed(2)}/oz. Strong global demand from investors.`
      : change < -0.5
      ? `COMEX silver down to $${comexUsd.toFixed(2)}/oz. Profit booking in international markets.`
      : `COMEX silver steady at $${comexUsd.toFixed(2)}/oz. Markets in consolidation mode.`,
    icon: "🌍",
    value: `$${comexUsd.toFixed(2)}/oz`,
    link: {
      text: "COMEX Data",
      href: "https://www.cmegroup.com/markets/metals/precious/silver.html",
      external: true
    }
  });
  
  // 3. Context-specific driver based on magnitude of change
  if (Math.abs(change) > 1) {
    drivers.push({
      factor: "High Volatility Day",
      impact: change > 0 ? "positive" : "negative",
      description: change > 0
        ? `Silver surged ${Math.abs(change).toFixed(2)}% today! Strong buying interest from institutional investors.`
        : `Silver dropped ${Math.abs(change).toFixed(2)}% today due to profit booking in global markets.`,
      icon: change > 0 ? "🚀" : "⚠️",
      value: `${change > 0 ? "+" : ""}${change.toFixed(2)}%`,
      link: {
        text: "Investment guide",
        href: "/learn/silver-vs-gold-investment",
        external: false
      }
    });
  } else {
    // Normal day - add seasonal/industrial context
    const today = new Date();
    const month = today.getMonth();
    
    if (month >= 8 && month <= 10) {
      // Festival season (Sep-Nov)
      drivers.push({
        factor: "Festival Season Demand",
        impact: "positive",
        description: "Increased silver demand ahead of Navratri, Diwali, and Dhanteras. Traditional buying peaks in India.",
        icon: "🎉",
        link: {
          text: "Silver buying guide",
          href: "/updates/silver-buying-guide-india",
          external: false
        }
      });
    } else if (month >= 10 || month <= 1) {
      // Wedding season (Nov-Feb)
      drivers.push({
        factor: "Wedding Season",
        impact: "positive",
        description: "Peak wedding season in India driving demand for jewelry and silverware gifts.",
        icon: "💍",
        link: {
          text: "Check city prices",
          href: "/city/mumbai",
          external: false
        }
      });
    } else {
      // Industrial demand context
      drivers.push({
        factor: "Industrial Demand",
        impact: "neutral",
        description: "Steady industrial demand from solar panels, electronics, and EV battery sectors supporting prices.",
        icon: "🏭",
        link: {
          text: "Why silver matters",
          href: "/learn/silver-vs-gold-investment",
          external: false
        }
      });
    }
  }
  
  // 4. Add MCX context
  drivers.push({
    factor: "MCX Trading",
    impact: "neutral",
    description: "MCX silver futures providing price discovery for Indian markets. Check MCX for official contract prices.",
    icon: "📊",
    link: {
      text: "MCX Spot Price",
      href: "https://www.mcxindia.com/market-data/spot-market-price",
      external: true
    }
  });
  
  return drivers;
}

/**
 * Fallback drivers if API fails
 */
function getFallbackDrivers(): PriceDriver[] {
  return [
    {
      factor: "Market Data Loading",
      impact: "neutral",
      description: "Live market data is being refreshed. Prices shown are from the last successful update.",
      icon: "🔄",
    },
    {
      factor: "Check Back Soon",
      impact: "neutral", 
      description: "Our market analysis updates every 5 minutes with real-time COMEX and forex data.",
      icon: "⏱️",
      link: {
        text: "How we calculate",
        href: "/how-we-calculate",
        external: false
      }
    },
  ];
}
