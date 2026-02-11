"use client";

import Link from "next/link";
import type { SnapshotPrice } from "@/lib/priceSnapshot";

interface SnapshotPriceCardProps {
  price: SnapshotPrice;
}

function formatIndianPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

function formatSnapshotTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SnapshotPriceCard({ price }: SnapshotPriceCardProps) {
  const isUp = price.change24h > 0;
  const isDown = price.change24h < 0;
  const changeIcon = isUp ? "↑" : isDown ? "↓" : "→";
  const changeColor = isUp ? "text-green-600" : isDown ? "text-red-600" : "text-gray-600";
  const changeBg = isUp ? "bg-green-50 border-green-200" : isDown ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200";

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <p className="text-xs sm:text-sm text-gray-500">Silver Rate Snapshot</p>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-medium text-blue-700">SNAPSHOT</span>
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gray-50 border border-gray-200">
              <span className="text-[10px] font-medium text-gray-700">Calculated</span>
            </span>
          </div>

          <p className="text-2xl sm:text-4xl font-bold text-gray-900">
            {formatIndianPrice(price.pricePerGram)}
            <span className="text-xs sm:text-lg font-normal text-gray-500">/gram</span>
          </p>
        </div>

        <div className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border ${changeBg}`}>
          <span className={`text-[10px] sm:text-xs font-bold ${changeColor}`}>
            {changeIcon}{Math.abs(price.changePercent24h).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-gray-100">
        <div className="text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Per 10g</p>
          <p className="text-sm sm:text-lg font-semibold text-gray-900">{formatIndianPrice(price.pricePer10Gram)}</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Per Kg</p>
          <p className="text-sm sm:text-lg font-semibold text-gray-900">{formatIndianPrice(price.pricePerKg)}</p>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Per Tola</p>
          <p className="text-sm sm:text-lg font-semibold text-gray-900">{formatIndianPrice(price.pricePerTola)}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[10px] text-gray-400">Snapshot Inputs:</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-medium text-blue-700">
            🌍 COMEX ${price.comexUsd.toFixed(2)}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full text-[10px] font-medium text-green-700">
            💱 USD/INR ₹{price.usdInr.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Last updated: <span className="font-medium text-gray-700">{formatSnapshotTime(price.timestamp)}</span>
        </p>
      </div>

      <div className="mt-3 text-center text-[10px] text-gray-400 leading-relaxed">
        Indicative snapshot • Not official MCX rate •{" "}
        <Link href="/how-we-calculate" className="underline hover:text-gray-600">
          See methodology
        </Link>
      </div>
    </div>
  );
}
