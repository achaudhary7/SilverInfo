"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ShanghaiSilverPrice } from "@/lib/shanghaiApi";

/**
 * useLiveShanghaiPrice Hook
 * 
 * Client-side hook for real-time Shanghai silver price polling.
 * Updates every 30 seconds for live price display.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Automatic polling (30s interval)
 * - Error handling with retry
 * - Loading states
 * - Manual refresh capability
 * - Last update timestamp
 */

interface UseLiveShanghaiPriceReturn {
  price: ShanghaiSilverPrice | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

const POLL_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;

export function useLiveShanghaiPrice(
  initialPrice?: ShanghaiSilverPrice | null
): UseLiveShanghaiPriceReturn {
  const [price, setPrice] = useState<ShanghaiSilverPrice | null>(initialPrice || null);
  const [isLoading, setIsLoading] = useState(!initialPrice);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialPrice ? new Date() : null
  );
  
  const retryCountRef = useRef(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      const response = await fetch("/api/shanghai-price", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ShanghaiSilverPrice = await response.json();
      
      setPrice(data);
      setLastUpdated(new Date());
      setError(null);
      retryCountRef.current = 0;
    } catch (err) {
      console.error("Error fetching Shanghai price:", err);
      
      retryCountRef.current += 1;
      
      if (retryCountRef.current >= MAX_RETRIES) {
        setError("Unable to fetch price. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchPrice();
  }, [fetchPrice]);

  // Initial fetch and polling
  useEffect(() => {
    // Fetch immediately if no initial price
    if (!initialPrice) {
      fetchPrice();
    }

    // Set up polling interval
    pollIntervalRef.current = setInterval(fetchPrice, POLL_INTERVAL);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchPrice, initialPrice]);

  return {
    price,
    isLoading,
    error,
    lastUpdated,
    refresh,
  };
}

/**
 * Format time ago string
 */
export function formatShanghaiTimeAgo(date: Date | null): string {
  if (!date) return "—";
  
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

export default useLiveShanghaiPrice;
