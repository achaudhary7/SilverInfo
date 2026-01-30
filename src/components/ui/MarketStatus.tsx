/**
 * MarketStatus Component
 *
 * Shows if COMEX/MCX markets are open or closed.
 * Helpful for users to know if prices are actively updating.
 *
 * ============================================================================
 * TRADING HOURS
 * ============================================================================
 * COMEX (New York):
 * - Sunday 6:00 PM to Friday 5:00 PM ET
 * - 60-minute daily break
 *
 * MCX (India):
 * - Monday to Friday: 9:00 AM to 11:30 PM IST
 * - Saturday/Sunday: Closed
 */

"use client";

import { useState, useEffect } from "react";

interface MarketStatusProps {
  market?: "COMEX" | "MCX" | "both";
  variant?: "badge" | "detailed";
  className?: string;
}

interface MarketInfo {
  name: string;
  isOpen: boolean;
  nextEvent: string;
  location: string;
  flag: string;
}

export default function MarketStatus({
  market = "both",
  variant = "badge",
  className = "",
}: MarketStatusProps) {
  const [comexStatus, setComexStatus] = useState<MarketInfo | null>(null);
  const [mcxStatus, setMcxStatus] = useState<MarketInfo | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      
      // COMEX status (ET timezone)
      const comex = getComexStatus(now);
      setComexStatus(comex);
      
      // MCX status (IST timezone)
      const mcx = getMcxStatus(now);
      setMcxStatus(mcx);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (variant === "badge") {
    const isAnyOpen = comexStatus?.isOpen || mcxStatus?.isOpen;
    
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isAnyOpen 
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
      } ${className}`}>
        <span className={`w-2 h-2 rounded-full ${isAnyOpen ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
        <span>{isAnyOpen ? "Markets Open" : "Markets Closed"}</span>
      </div>
    );
  }

  // Detailed variant
  return (
    <div className={`rounded-xl bg-slate-800/50 border border-slate-700 p-4 ${className}`}>
      <h4 className="text-sm font-medium text-gray-400 mb-3">Market Status</h4>
      <div className="space-y-3">
        {(market === "COMEX" || market === "both") && comexStatus && (
          <MarketRow market={comexStatus} />
        )}
        {(market === "MCX" || market === "both") && mcxStatus && (
          <MarketRow market={mcxStatus} />
        )}
      </div>
    </div>
  );
}

function MarketRow({ market }: { market: MarketInfo }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>{market.flag}</span>
        <div>
          <p className="text-sm font-medium text-white">{market.name}</p>
          <p className="text-xs text-gray-500">{market.location}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${market.isOpen ? "text-emerald-400" : "text-amber-400"}`}>
          {market.isOpen ? "Open" : "Closed"}
        </p>
        <p className="text-xs text-gray-500">{market.nextEvent}</p>
      </div>
    </div>
  );
}

/**
 * Get COMEX market status
 * Trading: Sunday 6 PM - Friday 5 PM ET (with 60-min daily break)
 */
function getComexStatus(now: Date): MarketInfo {
  // Convert to ET
  const etOptions: Intl.DateTimeFormatOptions = { 
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
  };
  const etString = now.toLocaleString("en-US", etOptions);
  const dayOfWeek = now.toLocaleString("en-US", { timeZone: "America/New_York", weekday: "short" });
  
  const etHour = parseInt(now.toLocaleString("en-US", { timeZone: "America/New_York", hour: "numeric", hour12: false }));
  const etDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dayOfWeek);
  
  // Simplified: Open Mon-Fri 6 PM Sunday through 5 PM Friday
  const isWeekend = etDay === 0 && etHour < 18; // Sunday before 6 PM
  const isFridayEvening = etDay === 5 && etHour >= 17; // Friday after 5 PM
  const isSaturday = etDay === 6;
  
  const isOpen = !isWeekend && !isFridayEvening && !isSaturday;
  
  return {
    name: "COMEX",
    isOpen,
    nextEvent: isOpen ? "Closes Fri 5 PM ET" : "Opens Sun 6 PM ET",
    location: "New York",
    flag: "🇺🇸",
  };
}

/**
 * Get MCX market status
 * Trading: Mon-Fri 9 AM - 11:30 PM IST
 */
function getMcxStatus(now: Date): MarketInfo {
  // Convert to IST
  const istOptions: Intl.DateTimeFormatOptions = { 
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    weekday: "short",
  };
  const dayOfWeek = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata", weekday: "short" });
  const istHour = parseInt(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false }));
  const istMinute = parseInt(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata", minute: "numeric" }));
  
  const istDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(dayOfWeek);
  
  // MCX: Mon-Fri 9 AM to 11:30 PM IST
  const isWeekday = istDay >= 1 && istDay <= 5;
  const isInHours = (istHour >= 9 && istHour < 23) || (istHour === 23 && istMinute <= 30);
  
  const isOpen = isWeekday && isInHours;
  
  return {
    name: "MCX",
    isOpen,
    nextEvent: isOpen ? "Closes 11:30 PM IST" : "Opens 9 AM IST",
    location: "Mumbai",
    flag: "🇮🇳",
  };
}

/**
 * Inline version for headers
 */
export function MarketStatusInline({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const now = new Date();
    const comex = getComexStatus(now);
    const mcx = getMcxStatus(now);
    setIsOpen(comex.isOpen || mcx.isOpen);
  }, []);

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${
      isOpen ? "text-emerald-400" : "text-amber-400"
    } ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
      <span>{isOpen ? "Live" : "Closed"}</span>
    </span>
  );
}
