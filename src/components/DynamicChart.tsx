"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "./Skeleton";
import { MiniPriceChart } from "./PriceChart";
import type { HistoricalPrice } from "@/lib/metalApi";

// Dynamically import PriceChart (full chart) to reduce initial bundle size
// Recharts adds ~200KB to the bundle, so we load it on demand
const PriceChart = dynamic(() => import("./PriceChart"), {
  loading: () => <ChartSkeleton height={300} />,
  ssr: false, // Recharts doesn't support SSR well
});

interface DynamicPriceChartProps {
  data: HistoricalPrice[];
  height?: number;
  showControls?: boolean;
}

interface DynamicMiniChartProps {
  data: HistoricalPrice[];
}

/**
 * DynamicPriceChart - Lazy-loaded full price chart
 * 
 * CLS Prevention: Container has fixed min-height to prevent layout shift
 * when Recharts loads client-side.
 */
export function DynamicPriceChart({ data, height = 300, showControls = true }: DynamicPriceChartProps) {
  return (
    // Fixed height container prevents CLS when chart loads
    <div style={{ minHeight: height + 150 }}>
      <PriceChart data={data} height={height} showControls={showControls} />
    </div>
  );
}

/**
 * DynamicMiniChart - Small inline chart
 * 
 * CLS Prevention: Fixed height of 64px (h-16) regardless of data state
 */
export function DynamicMiniChart({ data }: DynamicMiniChartProps) {
  // Always render with same height to prevent CLS
  if (!data || data.length === 0) {
    return (
      <div className="h-16 flex items-center justify-center text-gray-400 text-sm">
        No data available
      </div>
    );
  }
  return (
    <div className="h-16">
      <MiniPriceChart data={data} />
    </div>
  );
}
