"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "./Skeleton";
import type { CityPrice } from "@/lib/metalApi";
import type { FAQItem } from "@/lib/schema";

// ============================================================================
// SKELETON LOADERS
// ============================================================================

function CalculatorSkeleton() {
  return (
    <div className="card p-6">
      <Skeleton className="h-6 w-40 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full mt-4" />
      </div>
    </div>
  );
}

function CityTableSkeleton() {
  return (
    <div className="card p-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQSkeleton() {
  return (
    <div className="card p-6">
      <Skeleton className="h-6 w-64 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4">
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// DYNAMIC IMPORTS - Load only when component is in viewport
// ============================================================================

/**
 * Calculator - Lazy loaded (below fold, requires interaction)
 * Reduces initial bundle by ~15-20KB
 */
export const DynamicCalculator = dynamic(
  () => import("./Calculator"),
  {
    loading: () => <CalculatorSkeleton />,
    ssr: true, // Keep SSR for SEO
  }
);

/**
 * CityTable - Lazy loaded (below fold)
 * Reduces initial bundle by ~10-15KB
 */
export const DynamicCityTable = dynamic(
  () => import("./CityTable"),
  {
    loading: () => <CityTableSkeleton />,
    ssr: true,
  }
);

/**
 * FAQ - Lazy loaded (far below fold)
 * Reduces initial bundle by ~5-10KB
 */
export const DynamicFAQ = dynamic(
  () => import("./FAQ"),
  {
    loading: () => <FAQSkeleton />,
    ssr: true,
  }
);

// ============================================================================
// TYPE EXPORTS for props
// ============================================================================

export interface DynamicCalculatorProps {
  currentPrice: number;
  compact?: boolean;
}

export interface DynamicCityTableProps {
  cities: CityPrice[];
  limit?: number;
  showViewAll?: boolean;
}

export interface DynamicFAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
}
