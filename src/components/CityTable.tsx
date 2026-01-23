"use client";

import Link from "next/link";
import { formatIndianPrice, type CityPrice } from "@/lib/metalApi";

interface CityTableProps {
  cities: CityPrice[];
  limit?: number;
  showViewAll?: boolean;
}

export default function CityTable({ cities, limit = 10, showViewAll = true }: CityTableProps) {
  const displayCities = limit ? cities.slice(0, limit) : cities;
  
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">City-wise Silver Rates</h3>
            <p className="text-xs sm:text-sm text-gray-500">Today&apos;s silver price across major Indian cities</p>
          </div>
          {showViewAll && (
            <Link
              href="/silver-rate-today#cities"
              className="text-xs sm:text-sm font-medium text-[#1e3a5f] hover:underline whitespace-nowrap py-2 px-3 -mr-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 min-h-[44px] flex items-center"
            >
              View All →
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile: Card Layout */}
      <div className="sm:hidden divide-y divide-gray-100">
        {displayCities.map((city) => (
          <Link
            key={city.city}
            href={`/city/${city.city.toLowerCase()}`}
            className="block px-4 py-4 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{city.city}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{city.state}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Per Gram</p>
                <p className="text-sm font-semibold text-gray-900 price-display">
                  {formatIndianPrice(city.pricePerGram)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Per Kg</p>
                <p className="text-sm font-semibold text-gray-600 price-display">
                  {formatIndianPrice(city.pricePerKg)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Making</p>
                <p className="text-sm font-medium text-gray-500">
                  {city.makingCharges}%
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Desktop: Table Layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Per Gram
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Per Kg
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Making Charges
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayCities.map((city) => (
              <tr
                key={city.city}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/city/${city.city.toLowerCase()}`}
                    className="flex items-center gap-2 group py-1"
                  >
                    <span className="font-medium text-gray-900 group-hover:text-[#1e3a5f]">
                      {city.city}
                    </span>
                    <span className="text-xs text-gray-400">{city.state}</span>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm font-medium text-gray-900 price-display">
                    {formatIndianPrice(city.pricePerGram)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm text-gray-600 price-display">
                    {formatIndianPrice(city.pricePerKg)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="text-sm text-gray-500">
                    {city.makingCharges}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer Note */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">
          * Prices vary by city due to transportation, local demand, and dealer margins.
          Making charges vary by jeweller. GST (3%) applies on final price.{" "}
          <Link href="/how-we-calculate" className="text-[#1e3a5f] underline hover:no-underline">
            How we calculate →
          </Link>
        </p>
      </div>
    </div>
  );
}
