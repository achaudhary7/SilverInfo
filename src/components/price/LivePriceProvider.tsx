/**
 * LivePriceProvider - Server Component that fetches price and passes to client components
 * 
 * This allows using price components anywhere without prop drilling.
 * 
 * Usage in Server Components:
 * import { LivePriceWidget, LivePriceBanner, LivePriceTable } from "@/components/price";
 * 
 * <LivePriceWidget variant="detailed" />
 * <LivePriceBanner variant="gradient" />
 * <LivePriceTable showSterling />
 */

import { getSilverPriceWithChange } from "@/lib/metalApi";
import PriceWidget from "./PriceWidget";
import PriceBanner from "./PriceBanner";
import PriceTable from "./PriceTable";
import LiveRateCard from "./LiveRateCard";

// Reusable price fetcher with 24h change data (cached via ISR)
async function getPrice() {
  return await getSilverPriceWithChange();
}

// ============================================================================
// LIVE PRICE WIDGET
// ============================================================================

interface LivePriceWidgetProps {
  variant?: "default" | "minimal" | "detailed";
  showChange?: boolean;
  showLink?: boolean;
  className?: string;
}

export async function LivePriceWidget(props: LivePriceWidgetProps) {
  const price = await getPrice();
  if (!price) {
    return <div className="text-gray-500 text-sm">Unable to load price</div>;
  }
  return <PriceWidget price={price} {...props} />;
}

// ============================================================================
// LIVE PRICE BANNER
// ============================================================================

interface LivePriceBannerProps {
  variant?: "default" | "compact" | "gradient";
  className?: string;
}

export async function LivePriceBanner(props: LivePriceBannerProps) {
  const price = await getPrice();
  if (!price) {
    return <div className="text-gray-500 text-sm">Unable to load price</div>;
  }
  return <PriceBanner price={price} {...props} />;
}

// ============================================================================
// LIVE PRICE TABLE
// ============================================================================

interface LivePriceTableProps {
  variant?: "default" | "compact" | "full";
  showSterling?: boolean;
  className?: string;
}

export async function LivePriceTable(props: LivePriceTableProps) {
  const price = await getPrice();
  if (!price) {
    return <div className="text-gray-500 text-sm">Unable to load price</div>;
  }
  return <PriceTable price={price} {...props} />;
}

// ============================================================================
// QUICK PRICE DISPLAY (Inline use)
// ============================================================================

interface LivePriceInlineProps {
  unit?: "gram" | "10gram" | "kg" | "tola";
  showLabel?: boolean;
  className?: string;
}

export async function LivePriceInline({ 
  unit = "gram", 
  showLabel = true,
  className = "" 
}: LivePriceInlineProps) {
  const price = await getPrice();
  
  if (!price) {
    return <span className="text-gray-500">—</span>;
  }
  
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const labels: Record<string, string> = {
    gram: "/gram",
    "10gram": "/10g",
    kg: "/kg",
    tola: "/tola",
  };
  
  const values: Record<string, number> = {
    gram: price.pricePerGram,
    "10gram": price.pricePer10Gram,
    kg: price.pricePerKg,
    tola: price.pricePerTola,
  };
  
  return (
    <span className={`font-semibold text-[#1e3a5f] ${className}`}>
      {formatPrice(values[unit])}
      {showLabel && <span className="font-normal text-gray-500">{labels[unit]}</span>}
    </span>
  );
}

// ============================================================================
// LIVE RATE CARD (Sidebar Component)
// ============================================================================

interface LiveSilverRateCardProps {
  showLink?: boolean;
  className?: string;
}

export async function LiveSilverRateCard(props: LiveSilverRateCardProps) {
  const price = await getPrice();
  if (!price) {
    return <div className="text-gray-500 text-sm">Unable to load price</div>;
  }
  return <LiveRateCard price={price} {...props} />;
}
