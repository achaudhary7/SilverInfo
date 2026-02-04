"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ShanghaiSilverPrice } from "@/lib/shanghaiApi";
import { useVisibilityAwarePolling, DEFAULT_POLL_INTERVAL } from "./useVisibilityAwarePolling";

/**
 * useLiveShanghaiPrice Hook
 * 
 * Client-side hook for real-time Shanghai silver price polling.
 * Uses visibility-aware polling with 6-hour interval.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Visibility-aware polling (pauses when tab hidden)
 * - 6-hour polling interval (maximized to minimize Edge Requests)
 * - Refreshes immediately when tab becomes visible
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

  const fetchPrice = useCallback(async () => {
    try {
      // Fetch from API route - server-side caching via unstable_cache + Edge caching via headers
      // Note: Client-side fetches don't support `next: { revalidate }` option
      const response = await fetch("/api/shanghai-price");

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

  // Use visibility-aware polling - pauses when tab is hidden
  // 6-hour interval maximizes cost savings, fetchOnVisible ensures fresh data
  useVisibilityAwarePolling({
    callback: fetchPrice,
    interval: DEFAULT_POLL_INTERVAL, // 6 hours
    enabled: true,
    fetchOnMount: !initialPrice, // Only fetch on mount if no initial price
    fetchOnVisible: true, // Refresh data when user returns to tab
  });

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
