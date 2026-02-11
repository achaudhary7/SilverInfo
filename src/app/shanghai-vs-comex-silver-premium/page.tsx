import type { Metadata } from "next";
import Link from "next/link";
import { formatUsdPrice } from "@/lib/shanghaiApi";
import { getShanghaiSnapshotPrice } from "@/lib/shanghaiSnapshot";

export const revalidate = 28800;

export async function generateMetadata(): Promise<Metadata> {
  const price = getShanghaiSnapshotPrice();
  const premium = price?.premiumPercent?.toFixed(2) || "0.00";

  return {
    title: `Shanghai vs COMEX Silver Premium Today | +${premium}%`,
    description: `Track Shanghai vs COMEX silver premium today. See spread in USD/oz, percentage premium, and market context driving the difference.`,
    alternates: {
      canonical: "/shanghai-vs-comex-silver-premium",
    },
  };
}

export default function ShanghaiVsComexPremiumPage() {
  const price = getShanghaiSnapshotPrice();

  const spreadUsd = price.pricePerOzUsd - price.comexUsd;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shanghai vs COMEX Silver Premium</h1>
      <p className="mt-2 text-sm sm:text-base text-gray-600">
        Snapshot premium monitor for “Shanghai silver premium over COMEX” and related spread queries.
      </p>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 border border-emerald-200 bg-emerald-50">
          <p className="text-xs text-emerald-700">Premium (%)</p>
          <p className="text-2xl font-bold text-emerald-900">+{price.premiumPercent.toFixed(2)}%</p>
        </div>
        <div className="card p-4 border border-amber-200 bg-amber-50">
          <p className="text-xs text-amber-700">Spread (USD/oz)</p>
          <p className="text-2xl font-bold text-amber-900">{formatUsdPrice(spreadUsd)}</p>
        </div>
        <div className="card p-4 border border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600">Current Market Session</p>
          <p className="text-xl font-bold text-gray-900">{price.marketSession}</p>
        </div>
      </section>

      <section className="mt-6 card p-5 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">How We Calculate Premium</h2>
        <p className="mt-3 text-sm text-gray-700">
          Premium (%) = ((Shanghai USD/oz - COMEX USD/oz) / COMEX USD/oz) × 100
        </p>
        <div className="mt-3 text-sm text-gray-700 space-y-1">
          <p>Shanghai: <strong>{formatUsdPrice(price.pricePerOzUsd)}</strong></p>
          <p>COMEX: <strong>{formatUsdPrice(price.comexUsd)}</strong></p>
          <p>Spread: <strong>{formatUsdPrice(spreadUsd)}</strong></p>
        </div>
      </section>

      <section className="mt-6 card p-5 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Related Tracking Pages</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/shanghai-silver-price">
            Main Shanghai Silver Page
          </Link>
          <Link className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/shanghai-silver-price-in-usd">
            Shanghai Silver Price in USD
          </Link>
          <Link className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/shfe-silver-price-today">
            SHFE Silver Price Today
          </Link>
        </div>
      </section>
    </main>
  );
}
