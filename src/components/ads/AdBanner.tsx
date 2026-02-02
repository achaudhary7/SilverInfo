"use client";

/**
 * AdBanner Component - Pre-configured Banner Ads
 * 
 * Ready-to-use banner ad components for common placements.
 * Uses AdSlot internally with optimized settings for each position.
 * 
 * ============================================================================
 * USAGE
 * ============================================================================
 * ```tsx
 * // Header banner (after navigation)
 * <AdBanner.Header />
 * 
 * // Footer banner (before footer)
 * <AdBanner.Footer />
 * 
 * // In-content banner (between sections)
 * <AdBanner.InContent />
 * 
 * // Mobile anchor (sticky bottom)
 * <AdBanner.MobileAnchor />
 * ```
 */

import { AdSlot, AdFormat } from "./AdSlot";

// ============================================================================
// CONFIGURATION - Ad Slot IDs from AdSense Dashboard
// ============================================================================

// Set these in .env.local after creating ad units in AdSense
const AD_SLOTS = {
  header: process.env.NEXT_PUBLIC_AD_SLOT_HEADER || "HEADER_SLOT_ID",
  footer: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || "FOOTER_SLOT_ID",
  inContent: process.env.NEXT_PUBLIC_AD_SLOT_INCONTENT || "INCONTENT_SLOT_ID",
  sidebar: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || "SIDEBAR_SLOT_ID",
  mobileAnchor: process.env.NEXT_PUBLIC_AD_SLOT_MOBILE || "MOBILE_SLOT_ID",
};

// ============================================================================
// SHARED PROPS
// ============================================================================

interface BannerProps {
  className?: string;
  testMode?: boolean;
}

// ============================================================================
// HEADER BANNER
// ============================================================================

/**
 * Header Banner - 728x90 Leaderboard
 * Place after navigation, before main content
 */
function HeaderBanner({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-header w-full flex justify-center py-2 bg-gray-50 ${className}`}>
      <AdSlot
        slot={AD_SLOTS.header}
        format="horizontal"
        testMode={testMode}
        style={{
          maxWidth: "728px",
          width: "100%",
          height: "90px",
        }}
      />
    </div>
  );
}

// ============================================================================
// FOOTER BANNER
// ============================================================================

/**
 * Footer Banner - 728x90 or responsive
 * Place before footer, after main content
 */
function FooterBanner({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-footer w-full flex justify-center py-4 bg-gray-100 border-t border-gray-200 ${className}`}>
      <AdSlot
        slot={AD_SLOTS.footer}
        format="horizontal"
        testMode={testMode}
        style={{
          maxWidth: "728px",
          width: "100%",
          height: "90px",
        }}
      />
    </div>
  );
}

// ============================================================================
// IN-CONTENT BANNER
// ============================================================================

/**
 * In-Content Banner - Responsive
 * Place between content sections (e.g., between FAQ items, after charts)
 */
function InContentBanner({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-incontent w-full my-6 ${className}`}>
      <p className="text-[10px] text-gray-400 text-center mb-1">Advertisement</p>
      <AdSlot
        slot={AD_SLOTS.inContent}
        format="auto"
        testMode={testMode}
        fullWidthMobile={true}
      />
    </div>
  );
}

// ============================================================================
// SIDEBAR AD
// ============================================================================

/**
 * Sidebar Ad - 300x250 Medium Rectangle
 * Place in sidebar on desktop, hidden on mobile
 */
function SidebarAd({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-sidebar hidden lg:block sticky top-24 ${className}`}>
      <p className="text-[10px] text-gray-400 text-center mb-1">Sponsored</p>
      <AdSlot
        slot={AD_SLOTS.sidebar}
        format="rectangle"
        testMode={testMode}
        style={{
          width: "300px",
          height: "250px",
        }}
      />
    </div>
  );
}

// ============================================================================
// MOBILE ANCHOR AD
// ============================================================================

/**
 * Mobile Anchor Ad - Sticky bottom banner on mobile
 * Only shows on mobile devices (< 768px)
 */
function MobileAnchorAd({ className = "", testMode }: BannerProps) {
  return (
    <div 
      className={`ad-mobile-anchor fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-lg ${className}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <AdSlot
        slot={AD_SLOTS.mobileAnchor}
        format="horizontal"
        testMode={testMode}
        fullWidthMobile={true}
        style={{
          width: "100%",
          height: "50px",
          maxHeight: "50px",
        }}
      />
    </div>
  );
}

// ============================================================================
// ARTICLE AD
// ============================================================================

/**
 * Article Ad - Native in-article format
 * Best for long-form content pages
 */
function ArticleAd({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-article w-full my-8 py-4 border-y border-gray-100 ${className}`}>
      <p className="text-[10px] text-gray-400 text-center mb-2">Advertisement</p>
      <AdSlot
        slot={AD_SLOTS.inContent}
        format="fluid"
        layoutKey="in-article"
        testMode={testMode}
      />
    </div>
  );
}

// ============================================================================
// MULTIPLEX AD (Related Content Style)
// ============================================================================

/**
 * Multiplex Ad - Grid of related content ads
 * Place at end of articles, looks like "Related Articles"
 */
function MultiplexAd({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-multiplex w-full my-6 ${className}`}>
      <p className="text-sm font-medium text-gray-600 mb-3">You May Also Like</p>
      <AdSlot
        slot={AD_SLOTS.inContent}
        format="auto"
        testMode={testMode}
        style={{
          minHeight: "200px",
        }}
      />
    </div>
  );
}

// ============================================================================
// EXPORT COMPOUND COMPONENT
// ============================================================================

export const AdBanner = {
  Header: HeaderBanner,
  Footer: FooterBanner,
  InContent: InContentBanner,
  Sidebar: SidebarAd,
  MobileAnchor: MobileAnchorAd,
  Article: ArticleAd,
  Multiplex: MultiplexAd,
};

export default AdBanner;
