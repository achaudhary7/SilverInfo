import type { Metadata } from "next";
import Link from "next/link";
import { formatUsdPrice, formatCnyPrice } from "@/lib/shanghaiApi";
import { getShanghaiSnapshotPrice } from "@/lib/shanghaiSnapshot";

export const revalidate = 28800;

export async function generateMetadata(): Promise<Metadata> {
  const price = getShanghaiSnapshotPrice();
  const cnyKg = price?.pricePerKgCny?.toFixed(0) || "0";

  return {
    title: `SHFE Silver Price Today | ${cnyKg} CNY/kg`,
    description: `Track SHFE silver price today with CNY/kg values, USD conversions, and Shanghai vs COMEX premium context.`,
    alternates: {
      canonical: "/shfe-silver-price-today",
    },
  };
}

export default function ShfeSilverPriceTodayPage() {
  const price = getShanghaiSnapshotPrice();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">SHFE Silver Price Today</h1>
      <p className="mt-2 text-sm sm:text-base text-gray-600">
        SHFE-focused silver rate view for queries like “current SHFE silver price CNY/kg” and “SHFE vs COMEX”.
      </p>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 border border-red-200 bg-red-50">
          <p className="text-xs text-red-700">SHFE/Shanghai Proxy (CNY/kg)</p>
          <p className="text-2xl font-bold text-red-900">{formatCnyPrice(price.pricePerKgCny, 0)}</p>
        </div>
        <div className="card p-4 border border-blue-200 bg-blue-50">
          <p className="text-xs text-blue-700">USD Equivalent</p>
          <p className="text-2xl font-bold text-blue-900">{formatUsdPrice(price.pricePerOzUsd)}/oz</p>
        </div>
        <div className="card p-4 border border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600">FX Inputs</p>
          <p className="text-sm font-semibold text-gray-900">USD/CNY {price.usdCny.toFixed(4)}</p>
          <p className="text-sm font-semibold text-gray-900">USD/INR {price.usdInr.toFixed(2)}</p>
        </div>
      </section>

      <section className="mt-6 card p-5 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">SHFE vs COMEX Snapshot</h2>
        <div className="mt-3 text-sm text-gray-700 space-y-1">
          <p>COMEX silver: <strong>{formatUsdPrice(price.comexUsd)}/oz</strong></p>
          <p>Shanghai premium: <strong>+{price.premiumPercent.toFixed(2)}%</strong></p>
          <p>Session: <strong>{price.marketSession}</strong></p>
          <p className="text-xs text-gray-500 pt-2">
            Note: This page uses Shanghai-derived pricing as SHFE proxy context, intended for spread and directional comparison.
          </p>
        </div>
      </section>

      <section className="mt-6 card p-5 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Related Pages</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/shanghai-silver-price">
            Shanghai Silver Main
          </Link>
          <Link className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/shanghai-vs-comex-silver-premium">
            Shanghai vs COMEX Premium
          </Link>
          <Link className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/shanghai-silver-price-per-ounce">
            Shanghai Per Ounce
          </Link>
        </div>
      </section>
    </main>
  );
}
