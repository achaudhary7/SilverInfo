"use client";

/**
 * PriceTable - Quick price table showing different units
 * 
 * Usage:
 * <PriceTable />
 * <PriceTable showSterling={true} />
 * <PriceTable variant="compact" />
 */

import { formatIndianPrice, type SilverPrice } from "@/lib/metalApi";

interface PriceTableProps {
  price: SilverPrice;
  variant?: "default" | "compact" | "full";
  showSterling?: boolean;
  className?: string;
}

export default function PriceTable({
  price,
  variant = "default",
  showSterling = false,
  className = "",
}: PriceTableProps) {
  const sterlingMultiplier = 0.925;

  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-2 gap-2 text-sm ${className}`}>
        <div className="bg-gray-50 rounded p-2">
          <span className="text-gray-500">1g:</span>{" "}
          <span className="font-medium">{formatIndianPrice(price.pricePerGram)}</span>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <span className="text-gray-500">10g:</span>{" "}
          <span className="font-medium">{formatIndianPrice(price.pricePer10Gram)}</span>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <span className="text-gray-500">1kg:</span>{" "}
          <span className="font-medium">{formatIndianPrice(price.pricePerKg)}</span>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <span className="text-gray-500">Tola:</span>{" "}
          <span className="font-medium">{formatIndianPrice(price.pricePerTola)}</span>
        </div>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-2 px-3 font-medium text-gray-600">Unit</th>
              <th className="text-right py-2 px-3 font-medium text-gray-600">Pure (999)</th>
              {showSterling && (
                <th className="text-right py-2 px-3 font-medium text-gray-600">Sterling (925)</th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 text-gray-700">1 Gram</td>
              <td className="py-2 px-3 text-right font-medium">{formatIndianPrice(price.pricePerGram)}</td>
              {showSterling && (
                <td className="py-2 px-3 text-right">{formatIndianPrice(price.pricePerGram * sterlingMultiplier)}</td>
              )}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 text-gray-700">10 Gram</td>
              <td className="py-2 px-3 text-right font-medium">{formatIndianPrice(price.pricePer10Gram)}</td>
              {showSterling && (
                <td className="py-2 px-3 text-right">{formatIndianPrice(price.pricePer10Gram * sterlingMultiplier)}</td>
              )}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 text-gray-700">100 Gram</td>
              <td className="py-2 px-3 text-right font-medium">{formatIndianPrice(price.pricePerGram * 100)}</td>
              {showSterling && (
                <td className="py-2 px-3 text-right">{formatIndianPrice(price.pricePerGram * 100 * sterlingMultiplier)}</td>
              )}
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 px-3 text-gray-700">1 Kg</td>
              <td className="py-2 px-3 text-right font-medium">{formatIndianPrice(price.pricePerKg)}</td>
              {showSterling && (
                <td className="py-2 px-3 text-right">{formatIndianPrice(price.pricePerKg * sterlingMultiplier)}</td>
              )}
            </tr>
            <tr>
              <td className="py-2 px-3 text-gray-700">1 Tola</td>
              <td className="py-2 px-3 text-right font-medium">{formatIndianPrice(price.pricePerTola)}</td>
              {showSterling && (
                <td className="py-2 px-3 text-right">{formatIndianPrice(price.pricePerTola * sterlingMultiplier)}</td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between py-2 border-b border-gray-100">
        <span className="text-gray-600">Per Gram</span>
        <span className="font-semibold text-gray-900">{formatIndianPrice(price.pricePerGram)}</span>
      </div>
      <div className="flex justify-between py-2 border-b border-gray-100">
        <span className="text-gray-600">Per 10 Gram</span>
        <span className="font-semibold text-gray-900">{formatIndianPrice(price.pricePer10Gram)}</span>
      </div>
      <div className="flex justify-between py-2 border-b border-gray-100">
        <span className="text-gray-600">Per Kg</span>
        <span className="font-semibold text-gray-900">{formatIndianPrice(price.pricePerKg)}</span>
      </div>
      <div className="flex justify-between py-2">
        <span className="text-gray-600">Per Tola</span>
        <span className="font-semibold text-gray-900">{formatIndianPrice(price.pricePerTola)}</span>
      </div>
    </div>
  );
}
