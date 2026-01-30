"use client";

import { useState } from "react";
import type { CombinedMetalPrices } from "@/lib/metalApi";
import { LiveBadgeInline } from "@/components/ui/LiveBadge";

interface CombinedPriceTableProps {
  prices: CombinedMetalPrices;
}

type WeightUnit = 'gram' | 'tola' | 'oz';

/**
 * CombinedPriceTable Component
 *
 * Side-by-side comparison of Gold and Silver prices across different weights.
 * Features:
 * - Multiple weight options (1g, 10g, 100g, 1kg, 1 tola)
 * - Mobile-responsive table
 * - Schema markup ready
 * - Featured snippet optimized
 */
export default function CombinedPriceTable({ prices }: CombinedPriceTableProps) {
  const [selectedUnit, setSelectedUnit] = useState<WeightUnit>('gram');

  // Format price in Indian style
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Table data for different weights
  const tableData = [
    {
      weight: '1 gram',
      weightShort: '1g',
      gold: prices.gold.pricePerGram,
      silver: prices.silver.pricePerGram,
    },
    {
      weight: '10 grams',
      weightShort: '10g',
      gold: prices.gold.pricePer10Gram,
      silver: prices.silver.pricePer10Gram,
    },
    {
      weight: '100 grams',
      weightShort: '100g',
      gold: prices.gold.pricePer100Gram,
      silver: prices.silver.pricePer100Gram,
    },
    {
      weight: '1 Kilogram',
      weightShort: '1kg',
      gold: prices.gold.pricePerKg,
      silver: prices.silver.pricePerKg,
    },
    {
      weight: '1 Tola (11.66g)',
      weightShort: '1 tola',
      gold: prices.gold.pricePerTola,
      silver: prices.silver.pricePerTola,
    },
  ];

  // Calculate difference for each row
  const getMultiplier = (gold: number, silver: number): string => {
    const multiplier = gold / silver;
    return `${multiplier.toFixed(0)}x`;
  };

  return (
    <div className="overflow-hidden">
      {/* Compact Table - Light Theme */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" itemScope itemType="https://schema.org/Table">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Weight</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-yellow-700">
                <span className="flex items-center justify-end gap-1">
                  🥇 Gold (24K)
                </span>
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-700">
                <span className="flex items-center justify-end gap-1">
                  🥈 Silver (999)
                </span>
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 hidden sm:table-cell">
                Ratio
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={row.weight}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  index === 0 ? 'bg-gray-50/50' : ''
                }`}
                itemScope
                itemType="https://schema.org/Offer"
              >
                <td className="px-3 py-2">
                  <span className="font-medium text-gray-800 text-xs">{row.weight}</span>
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="font-semibold text-yellow-700 text-xs" itemProp="price">
                    {formatPrice(row.gold)}
                  </span>
                  <meta itemProp="priceCurrency" content="INR" />
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="font-semibold text-gray-700 text-xs" itemProp="price">
                    {formatPrice(row.silver)}
                  </span>
                  <meta itemProp="priceCurrency" content="INR" />
                </td>
                <td className="px-3 py-2 text-right text-gray-500 text-xs hidden sm:table-cell">
                  {getMultiplier(row.gold, row.silver)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compact Footer */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-[10px] text-gray-500 flex flex-wrap justify-between">
        <span>COMEX: Gold ${prices.gold.pricePerOzUsd}/oz • Silver ${prices.silver.pricePerOzUsd}/oz</span>
        <span>USD/INR: ₹{prices.usdInr}</span>
      </div>
    </div>
  );
}

/**
 * Compact version for embedding in other pages
 */
export function CombinedPriceTableCompact({ prices }: CombinedPriceTableProps) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Gold Card */}
      <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl p-4 border border-yellow-500/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🥇</span>
          <span className="font-semibold text-yellow-400">Gold (24K)</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Per Gram</span>
            <span className="text-yellow-400 font-medium">{formatPrice(prices.gold.pricePerGram)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Per 10g</span>
            <span className="text-yellow-300">{formatPrice(prices.gold.pricePer10Gram)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Per Tola</span>
            <span className="text-yellow-300">{formatPrice(prices.gold.pricePerTola)}</span>
          </div>
        </div>
      </div>

      {/* Silver Card */}
      <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 rounded-xl p-4 border border-gray-500/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🥈</span>
          <span className="font-semibold text-gray-300">Silver (999)</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Per Gram</span>
            <span className="text-gray-200 font-medium">{formatPrice(prices.silver.pricePerGram)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Per 10g</span>
            <span className="text-gray-300">{formatPrice(prices.silver.pricePer10Gram)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Per Tola</span>
            <span className="text-gray-300">{formatPrice(prices.silver.pricePerTola)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
