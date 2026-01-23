"use client";

import Link from "next/link";

interface RelatedSearchesProps {
  currentPage?: "home" | "silver-rate" | "city" | "calculator" | "learn";
  cityName?: string;
}

/**
 * RelatedSearches Component
 * 
 * Displays "People also search" links for SEO and internal linking.
 * Content varies based on current page context.
 */
export default function RelatedSearches({ currentPage = "home", cityName }: RelatedSearchesProps) {
  // Define related searches based on context
  const getSearches = () => {
    const baseSearches = [
      { text: "Gold rate today", href: "https://www.goodreturns.in/gold-rates/", external: true },
      { text: "Silver coins price", href: "/learn/silver-vs-gold-investment" },
      { text: "Silver purity check", href: "/learn/how-to-check-silver-purity" },
      { text: "BIS hallmark guide", href: "/learn/silver-hallmark-guide" },
    ];

    const citySearches = [
      { text: "Mumbai silver rate", href: "/city/mumbai" },
      { text: "Delhi silver rate", href: "/city/delhi" },
      { text: "Chennai silver rate", href: "/city/chennai" },
      { text: "Bangalore silver rate", href: "/city/bangalore" },
    ];

    const calculatorSearches = [
      { text: "Silver price calculator", href: "/silver-price-calculator" },
      { text: "Investment calculator", href: "/investment-calculator" },
      { text: "Capital gains tax", href: "/capital-gains-tax-calculator" },
      { text: "Break-even calculator", href: "/break-even-calculator" },
    ];

    switch (currentPage) {
      case "silver-rate":
        return [...baseSearches, ...calculatorSearches.slice(0, 2)];
      case "city":
        return [
          ...citySearches.filter(s => !s.href.includes(cityName?.toLowerCase() || "")),
          ...baseSearches.slice(0, 2),
        ];
      case "calculator":
        return [...calculatorSearches, ...baseSearches.slice(0, 2)];
      case "learn":
        return [...baseSearches, ...citySearches.slice(0, 2)];
      default:
        return [...citySearches.slice(0, 2), ...baseSearches.slice(0, 2), ...calculatorSearches.slice(0, 2)];
    }
  };

  const searches = getSearches().slice(0, 6);

  return (
    <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        People also search
      </h3>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          search.external ? (
            <a
              key={index}
              href={search.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors"
            >
              {search.text}
              <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <Link
              key={index}
              href={search.href}
              className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors"
            >
              {search.text}
            </Link>
          )
        ))}
      </div>
    </div>
  );
}
