import type { Metadata } from "next";
import Link from "next/link";
import { formatUsdPrice, formatCnyPrice } from "@/lib/shanghaiApi";
import { getShanghaiSnapshotPrice } from "@/lib/shanghaiSnapshot";

export const revalidate = 28800;

export async function generateMetadata(): Promise<Metadata> {
  const price = getShanghaiSnapshotPrice();
  const usdPerOz = price?.pricePerOzUsd?.toFixed(2) || "0.00";
  const cnyPerKg = price?.pricePerKgCny?.toLocaleString() || "0";

  return {
    title: `Shanghai Silver Price in USD Today | ${usdPerOz}/oz`,
    description: `Shanghai silver price in USD today: ${usdPerOz}/oz. Includes CNY/kg conversion, COMEX benchmark comparison, and premium context for global traders.`,
    alternates: {
      canonical: "/shanghai-silver-price-in-usd",
    },
    openGraph: {
      title: `Shanghai Silver Price in USD: ${usdPerOz}/oz`,
      description: `Current Shanghai silver in dollars with CNY/kg equivalent (${cnyPerKg}).`,
      type: "website",
    },
  };
}

export default function ShanghaiSilverPriceInUsdPage() {
  const price = getShanghaiSnapshotPrice();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shanghai Silver Price in USD Today</h1>
      <p className="mt-2 text-sm sm:text-base text-gray-600">
        Current Shanghai silver in US dollars with direct comparison against COMEX and CNY benchmark values.
      </p>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 border border-blue-200 bg-blue-50">
          <p className="text-xs text-blue-700">Shanghai (USD/oz)</p>
          <p className="text-2xl font-bold text-blue-900">{formatUsdPrice(price.pricePerOzUsd)}</p>
        </div>
        <div className="card p-4 border border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600">COMEX (USD/oz)</p>
          <p className="text-2xl font-bold text-gray-900">{formatUsdPrice(price.comexUsd)}</p>
        </div>
        <div className="card p-4 border border-emerald-200 bg-emerald-50">
          <p className="text-xs text-emerald-700">Premium vs COMEX</p>
          <p className="text-2xl font-bold text-emerald-900">+{price.premiumPercent.toFixed(2)}%</p>
        </div>
      </section>

      <section className="mt-6 card p-5 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">USD and CNY Conversion Snapshot</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <p className="text-gray-700">Shanghai silver (CNY/kg): <strong>{formatCnyPrice(price.pricePerKgCny, 0)}</strong></p>
          <p className="text-gray-700">USD/CNY rate used: <strong>{price.usdCny.toFixed(4)}</strong></p>
          <p className="text-gray-700">Shanghai silver (USD/g): <strong>{formatUsdPrice(price.pricePerGramUsd)}</strong></p>
          <p className="text-gray-700">Last update: <strong>{new Date(price.timestamp).toLocaleString("en-US")}</strong></p>
        </div>
      </section>

      <section className="mt-6 card p-5 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Related Shanghai Silver Pages</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/shanghai-silver-price-per-ounce">
            Shanghai Silver Price Per Ounce
          </Link>
          <Link className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/shanghai-vs-comex-silver-premium">
            Shanghai vs COMEX Premium
          </Link>
          <Link className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/shfe-silver-price-today">
            SHFE Silver Price Today
          </Link>
        </div>
      </section>
    </main>
  );
}
