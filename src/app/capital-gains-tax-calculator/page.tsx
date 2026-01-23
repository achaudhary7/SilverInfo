import type { Metadata } from "next";
import Link from "next/link";
import { getSilverPriceWithChange } from "@/lib/metalApi";
import { generateBreadcrumbSchema, generateFAQSchema, type FAQItem } from "@/lib/schema";
import CapitalGainsTaxCalculator from "@/components/CapitalGainsTaxCalculator";
import FAQ from "@/components/FAQ";
import { LiveRateCard } from "@/components/price";

export const revalidate = 600;

// Page last updated date
const LAST_UPDATED = "2026-01-23";

export const metadata: Metadata = {
  title: "Silver Capital Gains Tax Calculator India - STCG & LTCG",
  description:
    "Free capital gains tax calculator for silver in India. Calculate STCG and LTCG on silver investments, jewellery, and ETFs. Understand tax implications before selling.",
  keywords: [
    "silver capital gains tax india",
    "silver tax calculator",
    "LTCG on silver india",
    "STCG on silver",
    "silver jewellery tax",
    "silver investment tax",
  ],
  alternates: {
    canonical: "/capital-gains-tax-calculator",
  },
};

const faqItems: FAQItem[] = [
  {
    question: "What is the capital gains tax on silver in India?",
    answer:
      "For silver held more than 24 months (LTCG), tax is 12.5% flat (post July 2024 budget). For silver sold within 24 months (STCG), gains are added to your income and taxed at your slab rate. A 4% health & education cess applies on top.",
  },
  {
    question: "How long should I hold silver for LTCG benefits?",
    answer:
      "Silver must be held for more than 24 months (2 years) to qualify for Long-Term Capital Gains (LTCG) treatment. Anything sold within 24 months is treated as Short-Term Capital Gains (STCG).",
  },
  {
    question: "Is indexation available on silver capital gains?",
    answer:
      "No, indexation benefit has been removed for silver and other non-equity assets post the July 2024 Union Budget. LTCG is now taxed at a flat 12.5% without indexation.",
  },
  {
    question: "How is STCG on silver taxed in India?",
    answer:
      "Short-Term Capital Gains on silver are added to your total income and taxed at your applicable income tax slab rate. For example, if you're in the 30% bracket, STCG will be taxed at 30% + 4% cess.",
  },
  {
    question: "Is there tax on inherited silver jewellery if I sell it?",
    answer:
      "Yes, when you sell inherited silver, you pay capital gains tax. The purchase date is considered as the date the original owner acquired it, and the purchase price is the price at that time. This may qualify for LTCG if the total holding period exceeds 24 months.",
  },
];

export default async function CapitalGainsTaxCalculatorPage() {
  const price = await getSilverPriceWithChange();
  const faqSchema = generateFAQSchema(faqItems);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Capital Gains Tax Calculator", url: "https://silverinfo.in/capital-gains-tax-calculator" },
  ]);

  // SoftwareApplication Schema
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Silver Capital Gains Tax Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": "https://silverinfo.in/capital-gains-tax-calculator",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Calculate estimated capital gains tax on silver investments in India. Supports STCG and LTCG calculations.",
    "featureList": [
      "STCG vs LTCG classification",
      "Multiple asset types (physical, jewellery, ETF)",
      "Tax slab selection",
      "Health & Education Cess calculation",
      "Net proceeds calculation"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-[#1e3a5f]">
                Home
              </Link>
              <span>/</span>
              <span>Capital Gains Tax Calculator</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Silver Capital Gains Tax Calculator
            </h1>
            <p className="text-gray-600 mt-2">
              Calculate estimated STCG and LTCG tax on your silver investments in India
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Tax rules updated: {new Date(LAST_UPDATED).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calculator - 2 columns on Desktop */}
              <div className="lg:col-span-2 space-y-6">
                <CapitalGainsTaxCalculator currentPrice={price.pricePerGram} />
                
                {/* Tax Summary */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    📋 Silver Capital Gains Tax Summary (FY 2024-25)
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 font-semibold text-gray-700">Type</th>
                          <th className="text-left py-3 font-semibold text-gray-700">Holding Period</th>
                          <th className="text-left py-3 font-semibold text-gray-700">Tax Rate</th>
                          <th className="text-left py-3 font-semibold text-gray-700">Indexation</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 font-medium">LTCG</td>
                          <td className="py-3">&gt;24 months</td>
                          <td className="py-3">12.5% flat + 4% cess</td>
                          <td className="py-3 text-red-600">Not available</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 font-medium">STCG</td>
                          <td className="py-3">≤24 months</td>
                          <td className="py-3">As per income slab + 4% cess</td>
                          <td className="py-3">N/A</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    * Post July 2024 Union Budget changes. Surcharge may apply for high-value gains.
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Live Silver Rate */}
                <LiveRateCard price={price} showLink={false} />

                {/* Tax Info */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tax Quick Reference
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="font-medium text-gray-900">
                        LTCG (&gt;24 months)
                      </div>
                      <p className="text-sm text-gray-600">
                        12.5% flat + 4% cess
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="font-medium text-gray-900">
                        STCG (≤24 months)
                      </div>
                      <p className="text-sm text-gray-600">
                        As per income slab + 4% cess
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="font-medium text-gray-900">
                        Indexation
                      </div>
                      <p className="text-sm text-gray-600">
                        Not available (post July 2024)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Related Tools */}
                <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    More Tools
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/investment-calculator"
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-[#1e3a5f]">
                          📈 Investment Calculator
                        </div>
                        <p className="text-xs text-gray-500">
                          Calculate profit/loss on silver
                        </p>
                      </div>
                      <span className="text-gray-400 group-hover:text-[#1e3a5f]">→</span>
                    </Link>
                    <Link
                      href="/break-even-calculator"
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-[#1e3a5f]">
                          ⚖️ Break-Even Calculator
                        </div>
                        <p className="text-xs text-gray-500">
                          Find your break-even price
                        </p>
                      </div>
                      <span className="text-gray-400 group-hover:text-[#1e3a5f]">→</span>
                    </Link>
                    <Link
                      href="/inflation-adjusted-calculator"
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-[#1e3a5f]">
                          📊 Real Returns Calculator
                        </div>
                        <p className="text-xs text-gray-500">
                          Inflation-adjusted returns
                        </p>
                      </div>
                      <span className="text-gray-400 group-hover:text-[#1e3a5f]">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ - Full Width */}
            <div className="mt-8">
              <FAQ items={faqItems} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
