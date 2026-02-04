"use client";

/**
 * Live Gold Price Hook
 * 
 * Client-side hook for real-time gold price fetching.
 * Fetches directly from Yahoo Finance + Frankfurter APIs.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Direct API calls (no server required)
 * - Visibility-aware polling (pauses when tab hidden)
 * - 1-hour polling interval with localStorage cache
 * - Refreshes immediately when tab becomes visible
 * - Loading and error states
 * - Support for 24K, 22K, 18K gold prices
 */

import { useState, useCallback, useRef } from "react";
import { fetchGoldPrice, type GoldPrice } from "@/lib/clientPriceApi";
import { useVisibilityAwarePolling } from "./useVisibilityAwarePolling";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface UseLiveGoldPriceReturn {
  price: GoldPrice | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

// Polling interval: 1 hour (prices are cached in localStorage)
const POLL_INTERVAL = 60 * 60 * 1000;

// ============================================================================
// HOOK
// ============================================================================

export function useLiveGoldPrice(): UseLiveGoldPriceReturn {
  const [price, setPrice] = useState<GoldPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const retryCountRef = useRef(0);

  // Fetch price from client API
  const fetchPrice = useCallback(async () => {
    try {
      const newPrice = await fetchGoldPrice();

      if (newPrice) {
        setPrice(newPrice);
        setError(null);
        setLastUpdated(new Date());
        retryCountRef.current = 0;
      } else {
        throw new Error("Unable to fetch gold price");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch gold price";
      setError(errorMessage);
      console.error("[useLiveGoldPrice] Error:", errorMessage);

      retryCountRef.current += 1;
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
    callback: () => {
      if (retryCountRef.current > 10) return;
      fetchPrice();
    },
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

export default useLiveGoldPrice;
