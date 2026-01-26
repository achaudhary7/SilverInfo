"use client";

import Link from "next/link";

/**
 * SilverPurityGuide Component
 *
 * Explains different silver purity levels (999, 925, 900).
 * Targets keywords: "999 silver price", "925 sterling silver rate", "chandi ki shudhta"
 *
 * SEO: Addresses purity-specific searches
 */

interface PurityLevel {
  purity: string;
  name: string;
  nameHindi: string;
  percentage: string;
  description: string;
  uses: string[];
  priceMultiplier: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

const purityLevels: PurityLevel[] = [
  {
    purity: "999",
    name: "Fine Silver",
    nameHindi: "शुद्ध चांदी",
    percentage: "99.9%",
    description: "Purest form of silver available commercially. Ideal for investment.",
    uses: ["Silver bars", "Bullion coins", "Investment", "Industrial use"],
    priceMultiplier: 1.0,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    purity: "925",
    name: "Sterling Silver",
    nameHindi: "स्टर्लिंग चांदी",
    percentage: "92.5%",
    description: "92.5% silver + 7.5% copper for durability. Most popular for jewelry.",
    uses: ["Jewelry", "Silverware", "Decorative items", "Daily wear"],
    priceMultiplier: 0.925,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    purity: "900",
    name: "Coin Silver",
    nameHindi: "सिक्का चांदी",
    percentage: "90%",
    description: "90% silver + 10% copper. Traditional purity for coins and antiques.",
    uses: ["Collectible coins", "Antique items", "Traditional jewelry"],
    priceMultiplier: 0.9,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    purity: "800",
    name: "European Silver",
    nameHindi: "यूरोपीय चांदी",
    percentage: "80%",
    description: "80% silver content. Common in European antique silverware.",
    uses: ["Antique cutlery", "Vintage items", "Decorative pieces"],
    priceMultiplier: 0.8,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
  },
];

export default function SilverPurityGuide() {
  // Example base price for calculations
  const basePrice = 95; // ₹ per gram for 999 silver

  return (
    <section className="card p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Silver Purity Guide: 999 vs 925 vs 900
        </h2>
        <p className="text-sm text-gray-600">
          Understanding <span className="font-medium">chandi ki shudhta</span> (silver purity)
          is essential before buying. Here&apos;s what each purity level means and when to choose it.
        </p>
      </div>

      {/* Quick Reference Box */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span>📊</span> Quick Price Comparison (per 10 grams)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {purityLevels.map((level) => (
            <div key={level.purity} className="bg-white/10 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">{level.purity}</p>
              <p className="text-xs text-gray-300 mb-1">{level.name}</p>
              <p className="text-lg font-semibold text-green-400">
                ₹{(basePrice * 10 * level.priceMultiplier).toFixed(0)}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          * Indicative prices. Actual rates depend on market conditions.
        </p>
      </div>

      {/* Purity Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {purityLevels.map((level) => (
          <div
            key={level.purity}
            className={`${level.bgColor} ${level.borderColor} border-2 rounded-xl p-4 sm:p-5`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-3xl font-bold ${level.color}`}>{level.purity}</span>
                  <span className="text-xs bg-white px-2 py-0.5 rounded-full font-medium">
                    {level.percentage} pure
                  </span>
                </div>
                <p className={`font-semibold ${level.color}`}>{level.name}</p>
                <p className="text-xs text-gray-500">{level.nameHindi}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Price/gram</p>
                <p className={`text-lg font-bold ${level.color}`}>
                  ₹{(basePrice * level.priceMultiplier).toFixed(0)}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{level.description}</p>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Best For:</p>
              <div className="flex flex-wrap gap-1">
                {level.uses.map((use) => (
                  <span
                    key={use}
                    className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-600"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hallmark Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <span>✓</span> BIS Hallmark - Your Purity Guarantee
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-800 mb-3">
              Always look for <strong>BIS Hallmark</strong> when buying silver jewelry in India.
              It certifies the exact purity of silver.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">
                  BIS
                </span>
                <span className="text-blue-700">Bureau of Indian Standards logo</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">
                  999
                </span>
                <span className="text-blue-700">Purity grade number</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-white rounded flex items-center justify-center text-xs font-bold">
                  ID
                </span>
                <span className="text-blue-700">Jeweler identification</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-2">Common Hallmark Codes:</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">999 / S999</span>
                <span className="font-medium">Fine Silver</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">925 / S925</span>
                <span className="font-medium">Sterling Silver</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">900 / S900</span>
                <span className="font-medium">Coin Silver</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">800 / S800</span>
                <span className="font-medium">European Silver</span>
              </div>
            </div>
          </div>
        </div>
        <Link
          href="/learn/silver-hallmark-guide"
          className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline mt-3 font-medium"
        >
          Read our complete Hallmark Guide →
        </Link>
      </div>

      {/* Which Purity to Choose */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
          <h4 className="font-semibold text-emerald-800 mb-2">Choose 999 Silver</h4>
          <ul className="text-sm text-emerald-700 space-y-1">
            <li>• For investment/wealth storage</li>
            <li>• Buying bars or coins</li>
            <li>• Maximum resale value</li>
            <li>• Industrial applications</li>
          </ul>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h4 className="font-semibold text-blue-800 mb-2">Choose 925 Silver</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• For jewelry & daily wear</li>
            <li>• Better durability</li>
            <li>• International standard</li>
            <li>• Gift purposes</li>
          </ul>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
          <h4 className="font-semibold text-amber-800 mb-2">Choose 900/800</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• For antique collections</li>
            <li>• Traditional designs</li>
            <li>• Budget-friendly</li>
            <li>• Heavy silverware</li>
          </ul>
        </div>
      </div>

      {/* SEO Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          <strong>Related searches:</strong> 999 silver price today, 925 sterling silver price per gram,
          chandi ka bhav 999 purity, pure silver rate, sterling silver vs pure silver price difference
        </p>
      </div>
    </section>
  );
}
