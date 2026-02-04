"use client";

/**
 * useVisibilityAwarePolling Hook
 * 
 * Centralized polling utility that pauses when the browser tab is not visible.
 * Uses the Page Visibility API to prevent unnecessary API calls when users
 * are on another tab, significantly reducing Edge Requests and server load.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Pauses polling when tab is hidden (Page Visibility API)
 * - Resumes polling immediately when tab becomes visible
 * - Configurable polling interval (default: 180 seconds / 3 minutes)
 * - Automatic cleanup on unmount
 * - Optional immediate fetch on mount
 * 
 * ============================================================================
 * USAGE
 * ============================================================================
 * ```tsx
 * const { isVisible } = useVisibilityAwarePolling({
 *   callback: fetchPrices,
 *   interval: 21600000, // 6 hours (default)
 *   enabled: true,
 *   fetchOnMount: true,
 *   fetchOnVisible: true, // Fetch immediately when tab becomes visible
 * });
 * ```
 * 
 * ============================================================================
 * COST OPTIMIZATION
 * ============================================================================
 * With 6-hour polling (vs 30s) and visibility pausing:
 * - Tab visible: ~4 requests/day (vs 2880 with 30s)
 * - Tab hidden: 0 requests
 * - fetchOnVisible: true ensures fresh data when user returns
 * - Estimated 99.8%+ reduction in Edge Requests
 */

import { useEffect, useRef, useCallback, useState } from "react";

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default polling interval: 6 hours (21,600,000ms)
 * 
 * COST OPTIMIZATION: Maximum polling interval to minimize Edge Requests.
 * For a financial data site:
 * - Server-side rendering provides fresh data on page load
 * - Users who need real-time data can manually refresh
 * - Visibility API ensures data refreshes when user returns to tab
 * - 6-hour polling means ~4 requests/day per active tab (vs 2880 with 30s)
 * 
 * This reduces Edge Requests by ~99.8% compared to 30-second polling.
 */
export const DEFAULT_POLL_INTERVAL = 21600000; // 6 hours

/**
 * Extended polling interval: 12 hours (43,200,000ms)
 */
export const EXTENDED_POLL_INTERVAL = 43200000; // 12 hours

/**
 * Maximum polling interval: 24 hours (86,400,000ms)
 */
export const MAX_POLL_INTERVAL = 86400000; // 24 hours

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface UseVisibilityAwarePollingOptions {
  /** The function to call on each poll interval */
  callback: () => void | Promise<void>;
  /** Polling interval in milliseconds (default: 21600000 = 6 hours) */
  interval?: number;
  /** Whether polling is enabled (default: true) */
  enabled?: boolean;
  /** Whether to fetch immediately on mount (default: true) */
  fetchOnMount?: boolean;
  /** Whether to fetch immediately when tab becomes visible (default: true) */
  fetchOnVisible?: boolean;
}

interface UseVisibilityAwarePollingReturn {
  /** Whether the tab is currently visible */
  isVisible: boolean;
  /** Manually trigger a fetch */
  triggerFetch: () => void;
  /** Whether polling is currently active (visible + enabled) */
  isPollingActive: boolean;
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export function useVisibilityAwarePolling({
  callback,
  interval = DEFAULT_POLL_INTERVAL,
  enabled = true,
  fetchOnMount = true,
  fetchOnVisible = true,
}: UseVisibilityAwarePollingOptions): UseVisibilityAwarePollingReturn {
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  
  // Keep callback ref updated to avoid stale closures
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Manual trigger function
  const triggerFetch = useCallback(() => {
    callbackRef.current();
  }, []);

  // Handle visibility change
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      const visible = document.visibilityState === "visible";
      setIsVisible(visible);

      if (visible && fetchOnVisible && enabled) {
        // Tab became visible - fetch immediately to refresh stale data
        callbackRef.current();
      }
    };

    // Set initial visibility state
    setIsVisible(document.visibilityState === "visible");

    // Listen for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchOnVisible, enabled]);

  // Setup polling interval
  useEffect(() => {
    if (!enabled) {
      // Clear any existing interval when disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial fetch on mount
    if (fetchOnMount) {
      callbackRef.current();
    }

    // Setup interval - only runs when visible
    const startPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        // Only fetch if tab is visible
        if (document.visibilityState === "visible") {
          callbackRef.current();
        }
      }, interval);
    };

    startPolling();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, fetchOnMount]);

  return {
    isVisible,
    triggerFetch,
    isPollingActive: isVisible && enabled,
  };
}

// ============================================================================
// UTILITY HOOK: usePageVisibility
// ============================================================================

/**
 * Simple hook to track page visibility state
 * Useful for components that need to know if the tab is visible
 * without setting up their own polling
 */
export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    setIsVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
}

export default useVisibilityAwarePolling;
