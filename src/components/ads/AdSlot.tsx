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

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-7457883797698050";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const SHOW_ADS = IS_PRODUCTION && ADSENSE_ID;

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
  const adRef = useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // ========================================================================
  // INTERSECTION OBSERVER - Lazy load ads
  // ========================================================================
  useEffect(() => {
    if (!adRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before visible
    );

    observer.observe(adRef.current);

    return () => observer.disconnect();
  }, []);

  // ========================================================================
  // ADSENSE INITIALIZATION
  // ========================================================================
  useEffect(() => {
    if (!isVisible || !SHOW_ADS || testMode || isLoaded) return;

    try {
      // Push ad to AdSense
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
      setIsLoaded(true);
    } catch (error) {
      console.error("[AdSlot] Error loading ad:", error);
    }
  }, [isVisible, testMode, isLoaded]);

  // ========================================================================
  // DEVELOPMENT PLACEHOLDER
  // ========================================================================
  if (!SHOW_ADS || testMode) {
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

  return (
    <div className={`ad-container ${className}`} style={{ overflow: "hidden" }}>
      <ins
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
