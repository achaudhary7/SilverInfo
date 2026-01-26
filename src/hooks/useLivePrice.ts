"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SilverPrice } from "@/lib/metalApi";

interface UseLivePriceOptions {
  initialPrice: SilverPrice;
  pollInterval?: number; // in milliseconds, default 60000 (60 seconds)
  enabled?: boolean;
}

interface UseLivePriceReturn {
  price: SilverPrice;
  lastUpdated: Date;
  secondsAgo: number;
  isRefreshing: boolean;
  hasNewPrice: boolean;
  refresh: () => Promise<void>;
}

// =====================================================================
// localStorage Keys for persisting high/low across page refreshes
// =====================================================================
const STORAGE_KEY_HIGH = 'silverinfo_today_high';
const STORAGE_KEY_LOW = 'silverinfo_today_low';
const STORAGE_KEY_DATE = 'silverinfo_tracking_date';

interface StoredExtreme {
  value: number;
  time: string;
}

// Get today's date in IST (YYYY-MM-DD)
function getTodayIST(): string {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split('T')[0];
}

// Load extreme from localStorage (if same day)
function loadStoredExtreme(key: string): StoredExtreme | null {
  if (typeof window === 'undefined') return null;
  try {
    const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
    const todayIST = getTodayIST();
    
    // Clear if it's a new day
    if (storedDate !== todayIST) {
      localStorage.removeItem(STORAGE_KEY_HIGH);
      localStorage.removeItem(STORAGE_KEY_LOW);
      localStorage.setItem(STORAGE_KEY_DATE, todayIST);
      return null;
    }
    
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as StoredExtreme;
    }
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }
  return null;
}

// Save extreme to localStorage
function saveStoredExtreme(key: string, extreme: StoredExtreme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(extreme));
    localStorage.setItem(STORAGE_KEY_DATE, getTodayIST());
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

// Helper to get initial high value
// Priority: localStorage > todayHigh from server > current price
function getInitialHigh(price: SilverPrice): { value: number; time: string } {
  // Try localStorage first (most reliable)
  const stored = loadStoredExtreme(STORAGE_KEY_HIGH);
  if (stored && stored.value > 0) {
    // Compare with server value and take the max
    const serverHigh = price.todayHigh && price.todayHigh > 0 ? price.todayHigh : price.pricePerGram;
    if (stored.value >= serverHigh) {
      return stored;
    }
  }
  
  // Use server value
  const high = price.todayHigh && price.todayHigh > 0 ? price.todayHigh : price.pricePerGram;
  const time = price.todayHighTime || new Date().toISOString();
  return { value: high, time };
}

// Helper to get initial low value
// Priority: localStorage > todayLow from server > current price
function getInitialLow(price: SilverPrice): { value: number; time: string } {
  // Try localStorage first (most reliable)
  const stored = loadStoredExtreme(STORAGE_KEY_LOW);
  if (stored && stored.value > 0) {
    // Compare with server value and take the min
    const serverLow = price.todayLow && price.todayLow > 0 ? price.todayLow : price.pricePerGram;
    if (stored.value <= serverLow) {
      return stored;
    }
  }
  
  // Use server value
  const low = price.todayLow && price.todayLow > 0 ? price.todayLow : price.pricePerGram;
  const time = price.todayLowTime || new Date().toISOString();
  return { value: low, time };
}

export function useLivePrice({
  initialPrice,
  pollInterval = 60000,
  enabled = true,
}: UseLivePriceOptions): UseLivePriceReturn {
  const [price, setPrice] = useState<SilverPrice>(initialPrice);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date(initialPrice.timestamp));
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNewPrice, setHasNewPrice] = useState(false);
  
  const previousPriceRef = useRef(initialPrice.pricePerGram);
  
  // Track the best high/low we've seen across all fetches (solves cold start issue)
  // ALWAYS initialize with a valid value - never null
  const bestHighRef = useRef<{ value: number; time: string }>(getInitialHigh(initialPrice));
  const bestLowRef = useRef<{ value: number; time: string }>(getInitialLow(initialPrice));
  
  // Track if we've received valid API data with proper high/low tracking
  const hasReceivedValidTrackingRef = useRef(false);

  // Fetch new price from API
  const fetchPrice = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      // Add timestamp to prevent any caching
      const timestamp = Date.now();
      const response = await fetch(`/api/price?t=${timestamp}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch price");
      }
      
      const newPrice: SilverPrice = await response.json();
      
      // Check if price actually changed
      if (newPrice.pricePerGram !== previousPriceRef.current) {
        setHasNewPrice(true);
        previousPriceRef.current = newPrice.pricePerGram;
        
        // Reset the "new price" indicator after animation
        setTimeout(() => setHasNewPrice(false), 1000);
      }
      
      // =====================================================================
      // FIX: Merge high/low with best values seen
      // 
      // Strategy:
      // 1. If API returns valid todayHigh (> 0 and != todayLow), use it as a candidate
      // 2. Compare with our best tracked high - keep the MAXIMUM
      // 3. Also compare current price - it might be a new high
      // 4. Never decrease high, never increase low
      // =====================================================================
      
      const currentPrice = newPrice.pricePerGram;
      const now = new Date().toISOString();
      
      // Check if API has valid tracking data (high != low means it's tracking)
      const apiHasValidTracking = newPrice.todayHigh && newPrice.todayLow && 
        newPrice.todayHigh > 0 && newPrice.todayLow > 0 &&
        newPrice.todayHigh !== newPrice.todayLow;
      
      if (apiHasValidTracking) {
        hasReceivedValidTrackingRef.current = true;
      }
      
      // --- HIGH CALCULATION ---
      // Candidate values for high
      const apiHigh = newPrice.todayHigh && newPrice.todayHigh > 0 ? newPrice.todayHigh : currentPrice;
      const ourHigh = bestHighRef.current.value;
      
      // Take the maximum of: our tracked high, API high, current price
      const newHigh = Math.max(apiHigh, ourHigh, currentPrice);
      
      // Determine the time to use
      let newHighTime = bestHighRef.current.time;
      if (newHigh === apiHigh && newPrice.todayHighTime) {
        newHighTime = newPrice.todayHighTime;
      } else if (newHigh === currentPrice && newHigh > ourHigh) {
        newHighTime = now;
      }
      
      bestHighRef.current = { value: newHigh, time: newHighTime };
      
      // Save to localStorage for persistence across page refreshes
      saveStoredExtreme(STORAGE_KEY_HIGH, bestHighRef.current);
      
      // --- LOW CALCULATION ---
      // Candidate values for low
      const apiLow = newPrice.todayLow && newPrice.todayLow > 0 ? newPrice.todayLow : currentPrice;
      const ourLow = bestLowRef.current.value;
      
      // Take the minimum of: our tracked low, API low, current price
      const newLow = Math.min(apiLow, ourLow, currentPrice);
      
      // Determine the time to use
      let newLowTime = bestLowRef.current.time;
      if (newLow === apiLow && newPrice.todayLowTime) {
        newLowTime = newPrice.todayLowTime;
      } else if (newLow === currentPrice && newLow < ourLow) {
        newLowTime = now;
      }
      
      bestLowRef.current = { value: newLow, time: newLowTime };
      
      // Save to localStorage for persistence across page refreshes
      saveStoredExtreme(STORAGE_KEY_LOW, bestLowRef.current);
      
      // Merge the best values into the price object
      const mergedPrice: SilverPrice = {
        ...newPrice,
        todayHigh: bestHighRef.current.value,
        todayHighTime: bestHighRef.current.time,
        todayLow: bestLowRef.current.value,
        todayLowTime: bestLowRef.current.time,
      };
      
      setPrice(mergedPrice);
      setLastUpdated(new Date());
      setSecondsAgo(0);
    } catch (error) {
      console.error("Error fetching live price:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Manual refresh function
  const refresh = useCallback(async () => {
    await fetchPrice();
  }, [fetchPrice]);

  // Fetch immediately on mount, then poll every pollInterval
  useEffect(() => {
    if (!enabled) return;

    // Fetch immediately on mount (don't wait for first interval)
    fetchPrice();

    // Then continue polling at regular intervals
    const interval = setInterval(fetchPrice, pollInterval);
    
    return () => clearInterval(interval);
  }, [enabled, pollInterval, fetchPrice]);

  // Update "seconds ago" counter every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = now.getTime() - lastUpdated.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      setSecondsAgo(diffSeconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return {
    price,
    lastUpdated,
    secondsAgo,
    isRefreshing,
    hasNewPrice,
    refresh,
  };
}

// Format seconds ago into human-readable string
export function formatTimeAgo(seconds: number): string {
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
