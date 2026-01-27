"use client";

import { useState, useEffect } from "react";

interface LiveTimeDisplayProps {
  timezone: string;
  className?: string;
  placeholder?: string;
}

/**
 * LiveTimeDisplay - Client-side only time display
 * 
 * Prevents hydration mismatch by only rendering time on the client.
 * Updates every minute to keep time current.
 */
export function LiveTimeDisplay({ timezone, className = "", placeholder = "--:-- --" }: LiveTimeDisplayProps) {
  const [time, setTime] = useState<string>(placeholder);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const updateTime = () => {
      const timeStr = new Date().toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setTime(timeStr);
    };
    
    // Set initial time
    updateTime();
    
    // Update every second for real-time feel
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, [timezone]);
  
  // Render placeholder on server, actual time on client
  return <span className={className}>{mounted ? time : placeholder}</span>;
}

interface LiveDateDisplayProps {
  timezone: string;
  format?: 'short' | 'long';
  className?: string;
  placeholder?: string;
}

/**
 * LiveDateDisplay - Client-side only date display
 */
export function LiveDateDisplay({ timezone, format = 'long', className = "", placeholder = "Loading..." }: LiveDateDisplayProps) {
  const [date, setDate] = useState<string>(placeholder);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const options: Intl.DateTimeFormatOptions = format === 'long' 
      ? { timeZone: timezone, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
      : { timeZone: timezone, weekday: 'short', month: 'short', day: 'numeric' };
    
    const dateStr = new Date().toLocaleDateString('en-US', options);
    setDate(dateStr);
  }, [timezone, format]);
  
  return <span className={className}>{mounted ? date : placeholder}</span>;
}

export default LiveTimeDisplay;
