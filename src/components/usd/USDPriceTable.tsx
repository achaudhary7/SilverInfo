/**
 * USDPriceTable Component
 *
 * Shows silver prices in various weight units for US market.
 * Primary unit: Troy ounce (US standard)
 *
 * ============================================================================
 * WEIGHTS SHOWN
 * ============================================================================
 * - Per Troy Ounce (31.1035g) - US primary
 * - Per Gram
 * - Per 10 Grams
 * - Per 100 Grams
 * - Per Kilogram
 */

"use client";

import type { CombinedUSDPrices } from "@/lib/metalApi";
import { LiveBadgeInline } from "@/components/ui/LiveBadge";

interface USDPriceTableProps {
  prices: CombinedUSDPrices;
}

export default function USDPriceTable({ prices }: USDPriceTableProps) {
  // Format USD price
  const formatUSD = (price: number, decimals: number = 2): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);
  };

  // Calculate all weight prices
  const silverPerGram = prices.silver.pricePerGram;

  const tableData = [
    {
      weight: "1 Troy Ounce",
      weightShort: "oz",
      grams: 31.1035,
      price: prices.silver.pricePerOz,
      highlight: true, // Primary US unit
    },
    {
      weight: "1 Gram",
      weightShort: "g",
      grams: 1,
      price: silverPerGram,
      decimals: 3,
    },
    {
      weight: "10 Grams",
      weightShort: "10g",
      grams: 10,
      price: silverPerGram * 10,
    },
    {
      weight: "100 Grams",
      weightShort: "100g",
      grams: 100,
      price: silverPerGram * 100,
    },
    {
      weight: "1 Kilogram",
      weightShort: "kg",
      grams: 1000,
      price: prices.silver.pricePerKg,
    },
    {
      weight: "1 Pound (avdp)",
      weightShort: "lb",
      grams: 453.592,
      price: silverPerGram * 453.592,
    },
  ];

  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/20 via-slate-500/10 to-slate-400/10 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>📊</span>
            Silver Price by Weight (USD)
          </h3>
          <LiveBadgeInline />
        </div>
        <p className="text-sm text-gray-400 mt-1">
          COMEX spot price • Last updated {new Date(prices.timestamp).toLocaleTimeString("en-US")}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" itemScope itemType="https://schema.org/Table">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Weight
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                Grams
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-blue-400">
                Price (USD)
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={row.weight}
                className={`border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
                  row.highlight ? "bg-blue-500/10" : ""
                }`}
                itemScope
                itemType="https://schema.org/Offer"
              >
                <td className="px-4 py-3">
                  <span className={`font-medium ${row.highlight ? "text-blue-400" : "text-white"}`}>
                    {row.weight}
                  </span>
                  {row.highlight && (
                    <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                      US Standard
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-400">
                  {row.grams.toFixed(row.grams < 10 ? 4 : 2)}g
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`font-semibold ${row.highlight ? "text-blue-400" : "text-white"}`}
                    itemProp="price"
                  >
                    {formatUSD(row.price, row.decimals || 2)}
                  </span>
                  <meta itemProp="priceCurrency" content="USD" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conversion note */}
      <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-700 text-sm text-gray-400">
        <p>
          <strong className="text-white">Note:</strong> 1 Troy Ounce = 31.1035 grams (precious metals standard).
          1 Avoirdupois Pound = 453.592 grams.
        </p>
      </div>
    </div>
  );
}
