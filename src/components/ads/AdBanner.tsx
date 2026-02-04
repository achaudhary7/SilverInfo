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

// Real AdSense Ad Unit IDs (ca-pub-7457883797698050)
const AD_SLOTS = {
  // Horizontal Ads - for header/content areas
  horizontal: "7333542685",
  // Horizontal Ads-Footer - specifically for footer placement
  footer: "7551626964",
  // Vertical Ads - for sidebar
  vertical: "7368630887",
  // Square Ads - for sidebar/in-content rectangles
  square: "4798878684",
  // In-Article Ads - for within article content
  inArticle: "9115990072",
  // In-Article Ads (alternate) - for second in-article placement
  inArticle2: "1406428581",
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
 * Header Banner - Horizontal responsive ad
 * Place after navigation, before main content
 */
function HeaderBanner({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-header w-full flex justify-center py-2 bg-gray-50 ${className}`}>
      <AdSlot
        slot={AD_SLOTS.horizontal}
        format="auto"
        testMode={testMode}
        fullWidthMobile={true}
      />
    </div>
  );
}

// ============================================================================
// FOOTER BANNER
// ============================================================================

/**
 * Footer Banner - Horizontal responsive ad
 * Place before footer, after main content
 */
function FooterBanner({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-footer w-full flex justify-center py-4 bg-gray-100 border-t border-gray-200 ${className}`}>
      <AdSlot
        slot={AD_SLOTS.footer}
        format="auto"
        testMode={testMode}
        fullWidthMobile={true}
      />
    </div>
  );
}

// ============================================================================
// IN-CONTENT BANNER
// ============================================================================

/**
 * In-Content Banner - Horizontal responsive
 * Place between content sections (e.g., between FAQ items, after charts)
 */
function InContentBanner({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-incontent w-full my-6 ${className}`}>
      <p className="text-[10px] text-gray-400 text-center mb-1">Advertisement</p>
      <AdSlot
        slot={AD_SLOTS.horizontal}
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
 * Sidebar Ad - Square/Vertical for sidebar
 * Place in sidebar on desktop, hidden on mobile
 */
function SidebarAd({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-sidebar hidden lg:block sticky top-24 ${className}`}>
      <p className="text-[10px] text-gray-400 text-center mb-1">Sponsored</p>
      <AdSlot
        slot={AD_SLOTS.square}
        format="auto"
        testMode={testMode}
        style={{
          minWidth: "300px",
          minHeight: "250px",
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
 * Note: Uses horizontal ad slot for mobile banner
 */
function MobileAnchorAd({ className = "", testMode }: BannerProps) {
  return (
    <div 
      className={`ad-mobile-anchor fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-lg ${className}`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <AdSlot
        slot={AD_SLOTS.horizontal}
        format="auto"
        testMode={testMode}
        fullWidthMobile={true}
        style={{
          width: "100%",
          minHeight: "50px",
          maxHeight: "100px",
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
 * Best for long-form content pages (updates, learn articles)
 * Uses fluid format with in-article layout
 */
function ArticleAd({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-article w-full my-8 py-4 border-y border-gray-100 ${className}`}>
      <p className="text-[10px] text-gray-400 text-center mb-2">Advertisement</p>
      <AdSlot
        slot={AD_SLOTS.inArticle}
        format="fluid"
        layoutKey="in-article"
        testMode={testMode}
      />
    </div>
  );
}

/**
 * Article Ad 2 - Second in-article placement
 * Use when placing multiple in-article ads (with sufficient content between)
 */
function ArticleAd2({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-article-2 w-full my-8 py-4 border-y border-gray-100 ${className}`}>
      <p className="text-[10px] text-gray-400 text-center mb-2">Advertisement</p>
      <AdSlot
        slot={AD_SLOTS.inArticle2}
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
        slot={AD_SLOTS.square}
        format="auto"
        testMode={testMode}
        style={{
          minHeight: "200px",
        }}
      />
    </div>
  );
}

/**
 * Vertical Ad - For sidebar placement
 * Best for desktop sidebars with tall content
 */
function VerticalAd({ className = "", testMode }: BannerProps) {
  return (
    <div className={`ad-vertical hidden lg:block ${className}`}>
      <p className="text-[10px] text-gray-400 text-center mb-1">Sponsored</p>
      <AdSlot
        slot={AD_SLOTS.vertical}
        format="auto"
        testMode={testMode}
        style={{
          minWidth: "160px",
          minHeight: "600px",
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
  Article2: ArticleAd2,
  Multiplex: MultiplexAd,
  Vertical: VerticalAd,
};

export default AdBanner;
