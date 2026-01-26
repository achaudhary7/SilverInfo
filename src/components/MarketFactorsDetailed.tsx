"use client";

import Link from "next/link";

/**
 * MarketFactorsDetailed Component
 *
 * Detailed explanation of market factors affecting silver price in India.
 * Covers: MCX, USD-INR, Import Duty, GST
 *
 * SEO: Targets educational queries about silver pricing factors
 */

interface MarketFactor {
  id: string;
  title: string;
  titleHindi: string;
  icon: string;
  description: string;
  details: string[];
  impact: string;
  currentValue?: string;
  source?: { name: string; url: string };
}

const marketFactors: MarketFactor[] = [
  {
    id: "mcx",
    title: "MCX Silver Futures",
    titleHindi: "MCX चांदी",
    icon: "📊",
    description:
      "Multi Commodity Exchange (MCX) is India's largest commodity exchange where silver futures are traded. MCX prices serve as the benchmark for domestic silver rates.",
    details: [
      "Trading hours: 9:00 AM - 11:30 PM (Mon-Fri)",
      "Contract sizes: 1 kg, 5 kg, 30 kg",
      "Settlement: Physical delivery or cash",
      "MCX price = COMEX + Local premium (8-12%)",
    ],
    impact: "Direct impact - MCX is the primary price discovery mechanism for silver in India.",
    source: {
      name: "MCX India",
      url: "https://www.mcxindia.com/market-data/spot-market-price",
    },
  },
  {
    id: "usdinr",
    title: "USD-INR Exchange Rate",
    titleHindi: "डॉलर-रुपया दर",
    icon: "💱",
    description:
      "Since silver is internationally priced in US Dollars, the USD/INR exchange rate directly affects Indian silver prices. A weaker rupee means higher silver prices.",
    details: [
      "Silver is traded globally in USD per troy ounce",
      "1% rupee depreciation ≈ 1% silver price increase",
      "RBI interventions can stabilize sudden moves",
      "FII flows affect both rupee and silver demand",
    ],
    impact: "High impact - Currency movements can cause 2-5% daily price swings.",
    source: {
      name: "RBI Reference Rate",
      url: "https://www.rbi.org.in/scripts/ReferenceRateArchive.aspx",
    },
  },
  {
    id: "importduty",
    title: "Import Duty Structure",
    titleHindi: "आयात शुल्क",
    icon: "🛃",
    description:
      "India imports 90%+ of its silver. Import duties add to the landed cost, making domestic prices higher than international rates.",
    details: [
      "Basic Customs Duty: 7.5%",
      "Agriculture Infrastructure Development Cess (AIDC): 2.5%",
      "Total Import Duty: 10% (as of 2024)",
      "Duty changes in Union Budget affect prices immediately",
    ],
    impact: "Structural impact - Built into all domestic prices. Budget announcements are key triggers.",
  },
  {
    id: "gst",
    title: "GST on Silver",
    titleHindi: "चांदी पर GST",
    icon: "📋",
    description:
      "Goods and Services Tax (GST) of 3% applies to all silver purchases in India - bars, coins, and jewelry. Making charges attract additional 5% GST.",
    details: [
      "GST on silver: 3% (metal value)",
      "GST on making charges: 5%",
      "Input tax credit available for registered dealers",
      "No GST on old silver exchange (with conditions)",
    ],
    impact: "Fixed cost - Always factor in 3% GST when calculating purchase price.",
  },
];

export default function MarketFactorsDetailed() {
  return (
    <section className="card p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          What Affects Silver Price in India?
        </h2>
        <p className="text-sm text-gray-600">
          Understanding <span className="font-medium">chandi ki keemat</span> (silver price) requires
          knowing these 4 key factors that move prices daily.
        </p>
      </div>

      {/* Price Formula Box */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5282] text-white rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span>🧮</span> Indian Silver Price Formula
        </h3>
        <div className="bg-white/10 rounded-lg p-4 font-mono text-sm sm:text-base overflow-x-auto">
          <p className="whitespace-nowrap">
            <span className="text-green-300">Silver (₹/gram)</span> ={" "}
            <span className="text-yellow-300">(COMEX USD/oz × USD/INR)</span> ÷ 31.1035
          </p>
          <p className="whitespace-nowrap mt-1 pl-8 sm:pl-12">
            × <span className="text-blue-300">(1 + Import Duty)</span> ×{" "}
            <span className="text-pink-300">(1 + MCX Premium)</span>
          </p>
        </div>
        <p className="text-xs text-white/70 mt-3">
          Example: ($30/oz × ₹84) ÷ 31.1 × 1.10 × 1.10 = ₹98/gram
        </p>
        <Link
          href="/how-we-calculate"
          className="inline-flex items-center gap-1 text-sm text-white/90 hover:text-white mt-3"
        >
          See our detailed methodology →
        </Link>
      </div>

      {/* Factor Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {marketFactors.map((factor) => (
          <div
            key={factor.id}
            id={`factor-${factor.id}`}
            className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{factor.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{factor.title}</h3>
                <p className="text-xs text-gray-500">{factor.titleHindi}</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{factor.description}</p>

            <div className="bg-white rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Key Points:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {factor.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-2 text-xs">
              <span className="font-medium text-amber-700">Impact:</span>
              <span className="text-gray-600">{factor.impact}</span>
            </div>

            {factor.source && (
              <a
                href={factor.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#1e3a5f] hover:underline mt-3"
              >
                {factor.source.name} →
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Import Duty Breakdown */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <span>🛃</span> Current Import Duty Breakdown (2024-25)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="pb-2 text-amber-800">Component</th>
                <th className="pb-2 text-amber-800">Rate</th>
                <th className="pb-2 text-amber-800">Applied On</th>
              </tr>
            </thead>
            <tbody className="text-amber-900">
              <tr className="border-t border-amber-200">
                <td className="py-2">Basic Customs Duty (BCD)</td>
                <td className="py-2 font-medium">7.5%</td>
                <td className="py-2 text-xs">CIF Value</td>
              </tr>
              <tr className="border-t border-amber-200">
                <td className="py-2">AIDC (Agri Infra Cess)</td>
                <td className="py-2 font-medium">2.5%</td>
                <td className="py-2 text-xs">CIF Value</td>
              </tr>
              <tr className="border-t border-amber-200">
                <td className="py-2">IGST</td>
                <td className="py-2 font-medium">3%</td>
                <td className="py-2 text-xs">Assessable Value + Duties</td>
              </tr>
              <tr className="border-t-2 border-amber-300 font-semibold">
                <td className="py-2">Effective Total</td>
                <td className="py-2">~13-14%</td>
                <td className="py-2 text-xs">Over International Price</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-amber-700 mt-3">
          <strong>Note:</strong> Duty structure may change in Union Budget. Last updated: July 2024.
        </p>
      </div>

      {/* GST Calculation Example */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
          <span>📋</span> GST Calculation Example
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-green-800 font-medium mb-2">Buying Silver Bar (100g)</p>
            <div className="bg-white rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Silver value (100g × ₹95)</span>
                <span>₹9,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST @ 3%</span>
                <span>₹285</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                <span>Total</span>
                <span className="text-green-700">₹9,785</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm text-green-800 font-medium mb-2">Buying Silver Jewelry (50g)</p>
            <div className="bg-white rounded-lg p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Silver value (50g × ₹95)</span>
                <span>₹4,750</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Making @ 10%</span>
                <span>₹475</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST on silver @ 3%</span>
                <span>₹143</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST on making @ 5%</span>
                <span>₹24</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                <span>Total</span>
                <span className="text-green-700">₹5,392</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          <strong>Related searches:</strong> MCX silver rate today, import duty on silver India,
          GST on silver jewelry, USD INR impact on silver, chandi par GST kitna hai,
          silver price factors India, why silver price changes daily
        </p>
      </div>
    </section>
  );
}
