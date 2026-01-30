/**
 * Live Gold Price Hook
 * 
 * Client-side hook for real-time gold price polling.
 * Polls the /api/gold-price endpoint every 30 seconds.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Auto-polling every 30 seconds
 * - Loading and error states
 * - Automatic retry on failure
 * - Cleanup on unmount
 * 
 * Used By: GoldPriceCard, Gold page components
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { GoldPrice } from "@/lib/goldApi";

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

// ============================================================================
// CONSTANTS
// ============================================================================

const POLL_INTERVAL = 60000; // 60 seconds (reduced from 30s to lower Edge Requests)
const API_ENDPOINT = "/api/gold-price";

// ============================================================================
// HOOK
// ============================================================================

export function useLiveGoldPrice(
  initialPrice?: GoldPrice | null
): UseLiveGoldPriceReturn {
  // ========================================================================
  // STATE
  // ========================================================================
  const [price, setPrice] = useState<GoldPrice | null>(initialPrice ?? null);
  const [isLoading, setIsLoading] = useState(!initialPrice);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialPrice ? new Date() : null
  );

  // ========================================================================
  // REFS
  // ========================================================================
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  // ========================================================================
  // FETCH FUNCTION
  // ========================================================================
  const fetchPrice = useCallback(async () => {
    try {
      // Fetch from API - server-side caching via unstable_cache + Edge caching via headers
      // Note: Client-side fetches don't support `next: { revalidate }` option
      const response = await fetch(API_ENDPOINT);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPrice(data);
      setError(null);
      setLastUpdated(new Date());
      retryCountRef.current = 0; // Reset retry counter on success
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch gold price";
      setError(errorMessage);
      console.error("[useLiveGoldPrice] Error:", errorMessage);

      // Increment retry counter
      retryCountRef.current += 1;

      // If too many retries, slow down polling
      if (retryCountRef.current > 5) {
        console.log(
          "[useLiveGoldPrice] Too many failures, will continue with reduced frequency"
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ========================================================================
  // MANUAL REFRESH
  // ========================================================================
  const refresh = useCallback(async () => {
    setIsLoading(true);
    await fetchPrice();
  }, [fetchPrice]);

  // ========================================================================
  // POLLING EFFECT
  // ========================================================================
  useEffect(() => {
    // Initial fetch if no initial price provided
    if (!initialPrice) {
      fetchPrice();
    }

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      // Skip if too many consecutive failures
      if (retryCountRef.current > 10) {
        return;
      }
      fetchPrice();
    }, POLL_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchPrice, initialPrice]);

  // ========================================================================
  // RETURN
  // ========================================================================
  return {
    price,
    isLoading,
    error,
    lastUpdated,
    refresh,
  };
}

export default useLiveGoldPrice;
