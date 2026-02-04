"use client";

/**
 * Live Shanghai Silver Price Hook
 * 
 * Client-side hook for real-time Shanghai silver price fetching.
 * Fetches directly from Yahoo Finance + Frankfurter APIs.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Direct API calls (no server required)
 * - Visibility-aware polling (pauses when tab hidden)
 * - 1-hour polling interval with localStorage cache
 * - Refreshes immediately when tab becomes visible
 * - SGE market status detection
 * - Loading and error states
 */

import { useState, useCallback, useRef } from "react";
import { fetchShanghaiPrice, type ShanghaiSilverPrice } from "@/lib/clientPriceApi";
import { useVisibilityAwarePolling } from "./useVisibilityAwarePolling";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface UseLiveShanghaiPriceReturn {
  price: ShanghaiSilverPrice | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

// Polling interval: 1 hour (prices are cached in localStorage)
const POLL_INTERVAL = 60 * 60 * 1000;
const MAX_RETRIES = 3;

// ============================================================================
// HOOK
// ============================================================================

export function useLiveShanghaiPrice(): UseLiveShanghaiPriceReturn {
  const [price, setPrice] = useState<ShanghaiSilverPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const retryCountRef = useRef(0);

  // Fetch price from client API
  const fetchPrice = useCallback(async () => {
    try {
      const newPrice = await fetchShanghaiPrice();
      
      if (newPrice) {
        setPrice(newPrice);
        setLastUpdated(new Date());
        setError(null);
        retryCountRef.current = 0;
      } else {
        throw new Error("Unable to fetch Shanghai price");
      }
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

  // Manual refresh function
  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchPrice();
  }, [fetchPrice]);

  // Visibility-aware polling
  useVisibilityAwarePolling({
    callback: fetchPrice,
    interval: POLL_INTERVAL,
    enabled: true,
    fetchOnMount: true,
    fetchOnVisible: true,
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
