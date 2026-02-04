"use client";

/**
 * AdSlot Component - Reusable Google AdSense Ad Unit
 * 
 * A flexible, responsive ad component that supports multiple ad formats
 * and automatically adapts to different screen sizes.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Multiple ad formats (auto, horizontal, vertical, rectangle, fluid)
 * - Responsive sizing for all devices
 * - Development placeholder mode
 * - Lazy loading with Intersection Observer
 * - Proper cleanup on unmount
 * 
 * ============================================================================
 * USAGE
 * ============================================================================
 * ```tsx
 * // Auto-sized responsive ad (recommended)
 * <AdSlot slot="1234567890" format="auto" />
 * 
 * // Horizontal banner (header/footer)
 * <AdSlot slot="1234567890" format="horizontal" />
 * 
 * // Rectangle ad (sidebar/in-content)
 * <AdSlot slot="1234567890" format="rectangle" />
 * 
 * // With custom styling
 * <AdSlot slot="1234567890" format="auto" className="my-4" />
 * ```
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// ============================================================================
// TYPES
// ============================================================================

export type AdFormat = 
  | "auto"        // Fully responsive, Google decides size
  | "horizontal"  // Leaderboard-style (728x90, 320x50)
  | "vertical"    // Skyscraper-style (160x600, 300x600)
  | "rectangle"   // Medium rectangle (300x250, 336x280)
  | "fluid";      // Native/in-feed style

export type AdLayoutKey = 
  | "in-article"  // For in-article native ads
  | "in-feed"     // For feed-based native ads
  | "";           // Default display ads

export interface AdSlotProps {
  /** Your AdSense ad slot ID (from AdSense dashboard) */
  slot: string;
  
  /** Ad format type */
  format?: AdFormat;
  
  /** For native ads - layout key from AdSense */
  layoutKey?: AdLayoutKey;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Custom inline styles */
  style?: React.CSSProperties;
  
  /** Enable full-width on mobile (default: true) */
  fullWidthMobile?: boolean;
  
  /** Test mode - shows placeholder instead of real ad */
  testMode?: boolean;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

// AdSense Publisher ID - hardcoded for reliability in static export
const ADSENSE_ID = "ca-pub-7457883797698050";

// Check if we should show ads (runtime check to avoid hydration mismatch)
function shouldShowAds(): boolean {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  return !isLocalhost;
}

// Format-specific default styles
const FORMAT_STYLES: Record<AdFormat, React.CSSProperties> = {
  auto: {
    display: "block",
    width: "100%",
    height: "auto",
    minHeight: "90px",
  },
  horizontal: {
    display: "block",
    width: "100%",
    height: "90px",
    maxHeight: "90px",
  },
  vertical: {
    display: "block",
    width: "160px",
    height: "600px",
  },
  rectangle: {
    display: "block",
    width: "300px",
    height: "250px",
    maxWidth: "100%",
  },
  fluid: {
    display: "block",
    width: "100%",
    height: "auto",
  },
};

// Placeholder dimensions for dev mode
const PLACEHOLDER_SIZES: Record<AdFormat, { width: string; height: string; label: string }> = {
  auto: { width: "100%", height: "90px", label: "Auto Ad (Responsive)" },
  horizontal: { width: "100%", height: "90px", label: "Horizontal Banner (728×90)" },
  vertical: { width: "160px", height: "600px", label: "Vertical (160×600)" },
  rectangle: { width: "300px", height: "250px", label: "Rectangle (300×250)" },
  fluid: { width: "100%", height: "120px", label: "Fluid/Native Ad" },
};

// ============================================================================
// COMPONENT
// ============================================================================

export function AdSlot({
  slot,
  format = "auto",
  layoutKey = "",
  className = "",
  style = {},
  fullWidthMobile = true,
  testMode = false,
}: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Get current path for key-based re-rendering on navigation
  const pathname = usePathname();

  // ========================================================================
  // HYDRATION SAFETY - Check environment after mount
  // ========================================================================
  useEffect(() => {
    setIsMounted(true);
    setShowAds(shouldShowAds());
  }, []);

  // ========================================================================
  // RESET ON NAVIGATION - Force new ad on page change
  // ========================================================================
  useEffect(() => {
    // Reset loaded state when path changes to allow new ad to load
    setIsLoaded(false);
    setIsVisible(false);
  }, [pathname]);

  // ========================================================================
  // INTERSECTION OBSERVER - Lazy load ads (observe container, not ins)
  // ========================================================================
  useEffect(() => {
    if (!containerRef.current || !showAds) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before visible
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [showAds]);

  // ========================================================================
  // ADSENSE INITIALIZATION - Wait for ins element to be in DOM with proper width
  // ========================================================================
  useEffect(() => {
    if (!isVisible || !showAds || testMode || isLoaded) return;

    // Wait for next frame to ensure DOM is updated
    const checkAndPush = () => {
      const insElement = adRef.current;
      const container = containerRef.current;
      
      // Verify ins element exists in DOM
      if (!insElement || !container) {
        return false;
      }
      
      // Check if ins element is actually in the document
      if (!document.body.contains(insElement)) {
        return false;
      }
      
      // Check container has width
      const width = container.getBoundingClientRect().width;
      if (width < 50) {
        return false;
      }
      
      // Check if this ad slot was already processed (has iframe child)
      if (insElement.querySelector('iframe')) {
        setIsLoaded(true);
        return true;
      }

      try {
        // Push ad to AdSense
        const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle;
        if (adsbygoogle && typeof adsbygoogle.push === 'function') {
          adsbygoogle.push({});
          setIsLoaded(true);
          return true;
        }
        return false;
      } catch (error) {
        // Silently fail - AdSense errors are common and expected sometimes
        setIsLoaded(true); // Mark as loaded to prevent retries
        return true;
      }
    };

    // Use requestAnimationFrame to ensure DOM is painted
    let rafId: number;
    let retries = 0;
    const maxRetries = 10;
    
    const attemptPush = () => {
      rafId = requestAnimationFrame(() => {
        if (checkAndPush()) return;
        
        retries++;
        if (retries < maxRetries) {
          // Wait 100ms and retry
          setTimeout(attemptPush, 100);
        }
      });
    };
    
    attemptPush();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVisible, showAds, testMode, isLoaded]);

  // ========================================================================
  // SSR PLACEHOLDER (shown until mounted)
  // ========================================================================
  if (!isMounted) {
    const placeholder = PLACEHOLDER_SIZES[format];
    return (
      <div
        className={`ad-placeholder ${className}`}
        style={{
          width: placeholder.width,
          minHeight: placeholder.height,
          maxWidth: "100%",
          ...style,
        }}
      />
    );
  }

  // ========================================================================
  // DEVELOPMENT PLACEHOLDER
  // ========================================================================
  if (!showAds || testMode) {
    const placeholder = PLACEHOLDER_SIZES[format];
    return (
      <div
        className={`ad-placeholder ${className}`}
        style={{
          width: placeholder.width,
          height: placeholder.height,
          maxWidth: "100%",
          background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
          border: "2px dashed #9ca3af",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
          fontSize: "12px",
          fontWeight: 500,
          ...style,
        }}
      >
        <span style={{ fontSize: "20px", marginBottom: "4px" }}>📢</span>
        <span>{placeholder.label}</span>
        <span style={{ fontSize: "10px", opacity: 0.7, marginTop: "2px" }}>
          Ad Slot: {slot || "Not Set"}
        </span>
      </div>
    );
  }

  // ========================================================================
  // PRODUCTION AD
  // ========================================================================
  const adStyle: React.CSSProperties = {
    ...FORMAT_STYLES[format],
    ...style,
  };

  // Full-width responsive behavior for mobile
  const dataFullWidth = fullWidthMobile ? "true" : undefined;

  // Ensure container has minimum dimensions to avoid "availableWidth=0" error
  const containerStyle: React.CSSProperties = {
    overflow: "hidden",
    minWidth: format === "vertical" ? "160px" : format === "rectangle" ? "300px" : "320px",
    minHeight: FORMAT_STYLES[format]?.minHeight || 
      (format === "vertical" ? "600px" : format === "rectangle" ? "250px" : "90px"),
    width: "100%",
  };

  // Create unique key for this ad instance - forces React to re-create on navigation
  const adKey = `${pathname}-${slot}`;

  return (
    <div 
      ref={containerRef}
      className={`ad-container ${className}`} 
      style={containerStyle}
    >
      <ins
        key={adKey}
        ref={adRef}
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format === "fluid" ? "fluid" : format === "auto" ? "auto" : undefined}
        data-ad-layout={layoutKey || undefined}
        data-ad-layout-key={layoutKey || undefined}
        data-full-width-responsive={dataFullWidth}
      />
    </div>
  );
}

export default AdSlot;
