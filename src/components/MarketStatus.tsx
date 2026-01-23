"use client";

import { useState, useEffect } from "react";

interface MarketInfo {
  name: string;
  isOpen: boolean;
  hours: string;
  nextChange: string;
}

/**
 * Get current time in IST (Indian Standard Time)
 */
function getISTTime(): Date {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60; // 5 hours 30 minutes in minutes
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + istOffset * 60000);
}

/**
 * Check if MCX India is open
 * Trading Hours: Monday-Friday, 9:00 AM - 11:30 PM IST
 */
function getMCXStatus(istTime: Date): MarketInfo {
  const day = istTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;
  
  const openTime = 9 * 60; // 9:00 AM = 540 minutes
  const closeTime = 23 * 60 + 30; // 11:30 PM = 1410 minutes
  
  // Weekends - closed
  if (day === 0 || day === 6) {
    const daysUntilMonday = day === 0 ? 1 : 2;
    return {
      name: "MCX India",
      isOpen: false,
      hours: "Mon-Fri: 9AM-11:30PM IST",
      nextChange: `Opens Monday 9:00 AM`,
    };
  }
  
  // Weekday - check time
  const isOpen = currentMinutes >= openTime && currentMinutes < closeTime;
  
  if (isOpen) {
    const closeHour = Math.floor(closeTime / 60);
    const closeMin = closeTime % 60;
    return {
      name: "MCX India",
      isOpen: true,
      hours: "9AM-11:30PM IST",
      nextChange: `Closes at 11:30 PM`,
    };
  } else {
    // Before market opens
    if (currentMinutes < openTime) {
      return {
        name: "MCX India",
        isOpen: false,
        hours: "9AM-11:30PM IST",
        nextChange: `Opens at 9:00 AM`,
      };
    }
    // After market closes (11:30 PM - midnight)
    const isLastWeekday = day === 5; // Friday
    return {
      name: "MCX India",
      isOpen: false,
      hours: "9AM-11:30PM IST",
      nextChange: isLastWeekday ? `Opens Monday 9:00 AM` : `Opens tomorrow 9:00 AM`,
    };
  }
}

/**
 * Check if COMEX (International) is open
 * Trading Hours: Sunday 5PM CT to Friday 4PM CT (nearly 24/5)
 * In IST: Monday ~4:30 AM to Saturday ~3:30 AM
 * Daily maintenance break: 4PM-5PM CT (~3:30-4:30 AM IST)
 */
function getCOMEXStatus(istTime: Date): MarketInfo {
  const day = istTime.getDay();
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;
  
  // Maintenance break: 3:30 AM - 4:30 AM IST daily
  const maintenanceStart = 3 * 60 + 30; // 3:30 AM
  const maintenanceEnd = 4 * 60 + 30; // 4:30 AM
  const inMaintenance = currentMinutes >= maintenanceStart && currentMinutes < maintenanceEnd;
  
  // Saturday after 3:30 AM IST - closed until Monday 4:30 AM
  if (day === 6 && currentMinutes >= maintenanceStart) {
    return {
      name: "COMEX International",
      isOpen: false,
      hours: "Mon-Sat (24/5)",
      nextChange: `Opens Monday 4:30 AM IST`,
    };
  }
  
  // Sunday - closed all day until 4:30 AM Monday
  if (day === 0) {
    return {
      name: "COMEX International",
      isOpen: false,
      hours: "Mon-Sat (24/5)",
      nextChange: `Opens Monday 4:30 AM IST`,
    };
  }
  
  // Monday before 4:30 AM - still closed from weekend
  if (day === 1 && currentMinutes < maintenanceEnd) {
    return {
      name: "COMEX International",
      isOpen: false,
      hours: "Mon-Sat (24/5)",
      nextChange: `Opens at 4:30 AM IST`,
    };
  }
  
  // During maintenance break on weekdays
  if (inMaintenance && day >= 1 && day <= 5) {
    return {
      name: "COMEX International",
      isOpen: false,
      hours: "Mon-Sat (24/5)",
      nextChange: `Resumes at 4:30 AM IST`,
    };
  }
  
  // Market is open
  return {
    name: "COMEX International",
    isOpen: true,
    hours: "24/5 Trading",
    nextChange: day === 5 ? `Closes Sat 3:30 AM IST` : `Maintenance 3:30-4:30 AM`,
  };
}

export default function MarketStatus() {
  const [istTime, setIstTime] = useState<Date | null>(null);
  const [mcxStatus, setMcxStatus] = useState<MarketInfo | null>(null);
  const [comexStatus, setComexStatus] = useState<MarketInfo | null>(null);

  useEffect(() => {
    // Update immediately
    const updateStatus = () => {
      const time = getISTTime();
      setIstTime(time);
      setMcxStatus(getMCXStatus(time));
      setComexStatus(getCOMEXStatus(time));
    };
    
    updateStatus();
    
    // Update every minute
    const interval = setInterval(updateStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Loading state
  if (!istTime || !mcxStatus || !comexStatus) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Status</h3>
        <div className="space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="h-4 bg-gray-200 rounded w-36"></div>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Status</h3>
      <div className="space-y-4">
        {/* COMEX International */}
        <div className="flex items-start gap-3">
          <div className={`w-3 h-3 rounded-full mt-0.5 ${
            comexStatus.isOpen 
              ? "bg-green-500 animate-pulse" 
              : "bg-red-500"
          }`}></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {comexStatus.name}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                comexStatus.isOpen 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {comexStatus.isOpen ? "Open" : "Closed"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {comexStatus.hours} • {comexStatus.nextChange}
            </p>
          </div>
        </div>

        {/* MCX India */}
        <div className="flex items-start gap-3">
          <div className={`w-3 h-3 rounded-full mt-0.5 ${
            mcxStatus.isOpen 
              ? "bg-green-500 animate-pulse" 
              : "bg-red-500"
          }`}></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {mcxStatus.name}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                mcxStatus.isOpen 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {mcxStatus.isOpen ? "Open" : "Closed"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {mcxStatus.hours} • {mcxStatus.nextChange}
            </p>
          </div>
        </div>
      </div>

      {/* Current Time */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          🕐 IST: <span className="font-medium text-gray-700">{formatTime(istTime)}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formatDate(istTime)}
        </p>
      </div>
    </div>
  );
}
