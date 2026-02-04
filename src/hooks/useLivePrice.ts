"use client";

/**
 * Live Silver Price Hook
 * 
 * Client-side hook for real-time silver price fetching.
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
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchSilverPrice, type SilverPrice } from "@/lib/clientPriceApi";
import { useVisibilityAwarePolling } from "./useVisibilityAwarePolling";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface UseLivePriceReturn {
  price: SilverPrice | null;
  lastUpdated: Date | null;
  secondsAgo: number;
  isLoading: boolean;
  isRefreshing: boolean;
  hasNewPrice: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// Polling interval: 1 hour (prices are cached in localStorage)
const POLL_INTERVAL = 60 * 60 * 1000;

// ============================================================================
// HOOK
// ============================================================================

export function useLivePrice(): UseLivePriceReturn {
  const [price, setPrice] = useState<SilverPrice | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasNewPrice, setHasNewPrice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const previousPriceRef = useRef<number | null>(null);

  // Fetch price from client API
  const fetchPrice = useCallback(async () => {
    try {
      if (price) {
        setIsRefreshing(true);
      }
      
      const newPrice = await fetchSilverPrice();
      
      if (newPrice) {
        // Check if price changed
        if (previousPriceRef.current !== null && 
            newPrice.pricePerGram !== previousPriceRef.current) {
          setHasNewPrice(true);
          setTimeout(() => setHasNewPrice(false), 1000);
        }
        
        previousPriceRef.current = newPrice.pricePerGram;
        setPrice(newPrice);
        setLastUpdated(new Date());
        setSecondsAgo(0);
        setError(null);
      } else {
        setError("Unable to fetch price. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching silver price:", err);
      setError("Failed to fetch price");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [price]);

  // Manual refresh function
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
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

  // Update "seconds ago" counter every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdated) {
        const now = new Date();
        const diffMs = now.getTime() - lastUpdated.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        setSecondsAgo(diffSeconds);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return {
    price,
    lastUpdated,
    secondsAgo,
    isLoading,
    isRefreshing,
    hasNewPrice,
    error,
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

export default useLivePrice;
