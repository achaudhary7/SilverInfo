"use client";

import Link from "next/link";
import type { SnapshotPrice } from "@/lib/priceSnapshot";

interface WhyPriceChangedFullStaticProps {
  price: SnapshotPrice;
}

interface Driver {
  factor: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
  value: string;
  icon: string;
}

function buildDrivers(price: SnapshotPrice): Driver[] {
  const change = price.changePercent24h;

  const usdDriver: Driver = {
    factor: "USD/INR Exchange Rate",
    impact: change > 0.3 ? "positive" : change < -0.3 ? "negative" : "neutral",
    description:
      change > 0.3
        ? "A weaker rupee increases imported silver cost in INR terms."
        : change < -0.3
        ? "A stronger rupee softens silver cost in INR terms."
        : "Rupee movement is not a major driver in this snapshot.",
    value: `₹${price.usdInr.toFixed(2)}`,
    icon: "💱",
  };

  const comexDriver: Driver = {
    factor: "COMEX Silver",
    impact: change > 0.5 ? "positive" : change < -0.5 ? "negative" : "neutral",
    description:
      change > 0.5
        ? "International silver strength contributed to higher local prices."
        : change < -0.5
        ? "International silver weakness pressured local prices."
        : "COMEX remained mostly range-bound in this snapshot window.",
    value: `$${price.comexUsd.toFixed(2)}/oz`,
    icon: "🌍",
  };

  const structureDriver: Driver = {
    factor: "India Duty + IGST + Premium",
    impact: "neutral",
    description: "Base price is adjusted with 6% import duty, 3% IGST, and 3% local market premium.",
    value: "1.06 × 1.03 × 1.03",
    icon: "🧮",
  };

  return [usdDriver, comexDriver, structureDriver];
}

export default function WhyPriceChangedFullStatic({ price }: WhyPriceChangedFullStaticProps) {
  const drivers = buildDrivers(price);
  const overallChange = price.changePercent24h;
  const sentimentText = overallChange > 0.5
    ? "Silver is up vs previous snapshot"
    : overallChange < -0.5
    ? "Silver is down vs previous snapshot"
    : "Silver is stable vs previous snapshot";
  const sentimentEmoji = overallChange > 0.5 ? "📈" : overallChange < -0.5 ? "📉" : "➡️";

  return (
    <div id="why-price-changed" className="card overflow-hidden border-2 border-[#1e3a5f]/10 scroll-mt-20">
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📊</span>
              <h2 className="text-xl sm:text-2xl font-bold">Why Silver Price Changed (Snapshot)</h2>
            </div>
            <p className="text-sm text-white/80">Static snapshot analysis • No runtime API calls</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{sentimentEmoji}</span>
            <div className="text-right">
              <p className="text-2xl font-bold">{overallChange > 0 ? "+" : ""}{overallChange.toFixed(2)}%</p>
              <p className="text-xs text-white/70">24-hour change</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <MetricCard title="COMEX Silver" value={`$${price.comexUsd.toFixed(2)}`} subtitle="per troy ounce" icon="🌍" />
          <MetricCard title="USD/INR Rate" value={`₹${price.usdInr.toFixed(2)}`} subtitle="per US Dollar" icon="💱" />
          <MetricCard title="Market Sentiment" value={sentimentText} subtitle="based on 24h movement" icon={sentimentEmoji} compact />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>🔍</span> Snapshot Price Drivers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {drivers.map((driver) => (
            <div
              key={driver.factor}
              className={`p-4 rounded-xl border-2 ${
                driver.impact === "positive"
                  ? "bg-green-50/50 border-green-200"
                  : driver.impact === "negative"
                  ? "bg-red-50/50 border-red-200"
                  : "bg-gray-50/50 border-gray-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{driver.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900">{driver.factor}</span>
                    <span className="text-xs font-mono bg-white px-2 py-0.5 rounded shadow-sm">{driver.value}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{driver.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">Analysis shown from local snapshot values.</p>
              <p className="text-xs text-gray-400 mt-1">For true live feeds, a paid/hosted data path is required.</p>
            </div>
            <Link
              href="/how-we-calculate"
              className="text-xs px-3 py-1.5 bg-[#1e3a5f] hover:bg-[#2c5282] rounded-lg text-white transition-colors font-medium"
            >
              How We Calculate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  compact = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  compact?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <p className={`${compact ? "text-lg" : "text-2xl"} font-bold text-gray-900`}>{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}
