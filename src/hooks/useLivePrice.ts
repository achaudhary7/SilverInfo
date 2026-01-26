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
  // This persists the correct high/low even if a new serverless instance returns stale data
  const bestHighRef = useRef<{ value: number; time: string } | null>(
    initialPrice.todayHigh ? { value: initialPrice.todayHigh, time: initialPrice.todayHighTime || '' } : null
  );
  const bestLowRef = useRef<{ value: number; time: string } | null>(
    initialPrice.todayLow ? { value: initialPrice.todayLow, time: initialPrice.todayLowTime || '' } : null
  );

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
      // This prevents cold-start issues where different serverless instances
      // have different globalThis caches and return stale high/low values
      // =====================================================================
      
      // Update best high: keep the MAXIMUM we've ever seen
      const apiHigh = newPrice.todayHigh || newPrice.pricePerGram;
      const apiHighTime = newPrice.todayHighTime || new Date().toISOString();
      if (!bestHighRef.current || apiHigh > bestHighRef.current.value) {
        bestHighRef.current = { value: apiHigh, time: apiHighTime };
      }
      // Also check current price against best high
      if (newPrice.pricePerGram > (bestHighRef.current?.value || 0)) {
        bestHighRef.current = { value: newPrice.pricePerGram, time: new Date().toISOString() };
      }
      
      // Update best low: keep the MINIMUM we've ever seen
      const apiLow = newPrice.todayLow || newPrice.pricePerGram;
      const apiLowTime = newPrice.todayLowTime || new Date().toISOString();
      if (!bestLowRef.current || apiLow < bestLowRef.current.value) {
        bestLowRef.current = { value: apiLow, time: apiLowTime };
      }
      // Also check current price against best low
      if (newPrice.pricePerGram < (bestLowRef.current?.value || Infinity)) {
        bestLowRef.current = { value: newPrice.pricePerGram, time: new Date().toISOString() };
      }
      
      // Merge the best values into the price object
      const mergedPrice: SilverPrice = {
        ...newPrice,
        todayHigh: bestHighRef.current?.value || newPrice.todayHigh,
        todayHighTime: bestHighRef.current?.time || newPrice.todayHighTime,
        todayLow: bestLowRef.current?.value || newPrice.todayLow,
        todayLowTime: bestLowRef.current?.time || newPrice.todayLowTime,
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
