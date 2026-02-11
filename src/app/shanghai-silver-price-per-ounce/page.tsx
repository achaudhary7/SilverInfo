import type { Metadata } from "next";
import Link from "next/link";
import { formatUsdPrice } from "@/lib/shanghaiApi";
import { getShanghaiSnapshotPrice } from "@/lib/shanghaiSnapshot";

export const revalidate = 28800;

export async function generateMetadata(): Promise<Metadata> {
  const price = getShanghaiSnapshotPrice();
  const perOz = price?.pricePerOzUsd?.toFixed(2) || "0.00";

  return {
    title: `Shanghai Silver Price Per Ounce Today | ${perOz}/oz`,
    description: `Shanghai silver price per ounce in USD today: ${perOz}/oz. Includes COMEX comparison and premium spread for traders.`,
    alternates: {
      canonical: "/shanghai-silver-price-per-ounce",
    },
  };
}

export default function ShanghaiSilverPerOuncePage() {
  const price = getShanghaiSnapshotPrice();

  const spread = price.pricePerOzUsd - price.comexUsd;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shanghai Silver Price Per Ounce</h1>
      <p className="mt-2 text-sm sm:text-base text-gray-600">
        Dedicated ounce-based view for searches like “shanghai silver price per ounce” and “shanghai silver in dollars per ounce”.
      </p>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-5 border border-red-200 bg-red-50">
          <p className="text-xs text-red-700">Shanghai (USD/oz)</p>
          <p className="text-3xl font-bold text-red-900">{formatUsdPrice(price.pricePerOzUsd)}</p>
        </div>
        <div className="card p-5 border border-blue-200 bg-blue-50">
          <p className="text-xs text-blue-700">COMEX (USD/oz)</p>
          <p className="text-3xl font-bold text-blue-900">{formatUsdPrice(price.comexUsd)}</p>
        </div>
      </section>

      <section className="mt-6 card p-5 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Ounce-Level Spread</h2>
        <div className="mt-3 text-sm text-gray-700 space-y-1">
          <p>Shanghai premium: <strong>+{price.premiumPercent.toFixed(2)}%</strong></p>
          <p>Absolute spread: <strong>{formatUsdPrice(spread)}</strong> per ounce</p>
          <p>Shanghai ounces are converted from SGE kg pricing and FX rates.</p>
        </div>
      </section>

      <section className="mt-6 card p-5 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Next Steps</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/shanghai-vs-comex-silver-premium">
            Compare Shanghai vs COMEX Premium
          </Link>
          <Link className="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200" href="/shanghai-silver-price-in-usd">
            Shanghai Silver Price in USD
          </Link>
        </div>
      </section>
    </main>
  );
}
