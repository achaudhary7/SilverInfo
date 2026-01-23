/**
 * Price Components - Reusable components for displaying live silver prices
 * 
 * ============================================================================
 * COMPONENT OVERVIEW
 * ============================================================================
 * 
 * CLIENT COMPONENTS (require price prop):
 * - PriceWidget: Sidebar/compact widget
 * - PriceBanner: Horizontal banner
 * - PriceTable: Price table with units
 * 
 * SERVER COMPONENTS (auto-fetch price):
 * - LivePriceWidget: Self-contained widget
 * - LivePriceBanner: Self-contained banner
 * - LivePriceTable: Self-contained table
 * - LivePriceInline: Inline price text
 * 
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 * 
 * // In a Server Component (page.tsx):
 * import { LivePriceWidget, LivePriceBanner } from "@/components/price";
 * 
 * <LivePriceWidget variant="detailed" />
 * <LivePriceBanner variant="gradient" />
 * <LivePriceInline unit="gram" />
 * 
 * // In a Client Component (needs price prop):
 * import { PriceWidget, PriceTable } from "@/components/price";
 * 
 * <PriceWidget price={priceData} variant="minimal" />
 * <PriceTable price={priceData} showSterling />
 */

// Client components (require price prop)
export { default as PriceWidget } from "./PriceWidget";
export { default as PriceBanner } from "./PriceBanner";
export { default as PriceTable } from "./PriceTable";
export { default as LiveRateCard } from "./LiveRateCard";

// Server components (auto-fetch price)
export { 
  LivePriceWidget, 
  LivePriceBanner, 
  LivePriceTable,
  LivePriceInline,
  LiveSilverRateCard 
} from "./LivePriceProvider";
