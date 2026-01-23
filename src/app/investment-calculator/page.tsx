import type { Metadata } from "next";
import Link from "next/link";
import { getSilverPriceWithChange } from "@/lib/metalApi";
import { generateBreadcrumbSchema, generateFAQSchema, type FAQItem } from "@/lib/schema";
import InvestmentCalculator from "@/components/InvestmentCalculator";
import FAQ from "@/components/FAQ";
import { LiveRateCard } from "@/components/price";

export const revalidate = 600;

// Page last updated date (update when making significant changes)
const LAST_UPDATED = "2026-01-23";

export const metadata: Metadata = {
  title: "Silver Investment Calculator - Calculate Profit & Loss",
  description:
    "Free silver investment calculator for India. Calculate your silver investment returns, profit/loss, and compare with current market prices. Track your silver portfolio gains.",
  keywords: [
    "silver investment calculator",
    "silver profit calculator",
    "silver gain loss calculator",
    "silver roi calculator",
    "silver return calculator india",
  ],
  alternates: {
    canonical: "/investment-calculator",
  },
};

const faqItems: FAQItem[] = [
  {
    question: "How do I calculate profit on my silver investment?",
    answer:
      "To calculate profit: Profit = (Current Price × Weight) - (Purchase Price × Weight). Our calculator does this automatically - just enter your purchase price, current price, and weight to see your gains or losses instantly.",
  },
  {
    question: "Should I include making charges in my investment calculation?",
    answer:
      "If you bought silver jewelry, you should NOT include making charges in your resale calculation, as jewelers typically don't pay for making charges when buying back. For bars and coins, the purchase price is usually the full investment amount.",
  },
  {
    question: "What is a good return on silver investment in India?",
    answer:
      "Silver has historically provided 8-12% annual returns in India over long periods, though it can be volatile short-term. Compare your returns against inflation (5-6%) and fixed deposits (6-7%) to evaluate performance.",
  },
  {
    question: "How do I track my silver investment portfolio?",
    answer:
      "Use our investment calculator to track individual purchases. Enter your buy date, purchase price, and quantity. The calculator will show current value, absolute gain/loss, and percentage return.",
  },
];

export default async function InvestmentCalculatorPage() {
  const price = await getSilverPriceWithChange();
  const faqSchema = generateFAQSchema(faqItems);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Investment Calculator", url: "https://silverinfo.in/investment-calculator" },
  ]);

  // SoftwareApplication Schema for calculator
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Silver Investment Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": "https://silverinfo.in/investment-calculator",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Free online calculator to track silver investment returns, profit/loss, and percentage gains in India.",
    "featureList": [
      "Calculate absolute profit/loss",
      "Percentage return calculation",
      "Annualized returns (CAGR) for holdings over 1 year",
      "Real-time silver price integration",
      "Holding period analysis"
    ]
  };

  // HowTo Schema for calculator instructions
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Silver Investment Returns",
    "description": "Step-by-step guide to calculate your silver investment profit or loss using our free calculator.",
    "totalTime": "PT2M",
    "tool": {
      "@type": "HowToTool",
      "name": "Silver Investment Calculator"
    },
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Enter Purchase Details",
        "text": "Input your purchase price per gram and total weight in grams",
        "url": "https://silverinfo.in/investment-calculator#step1"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "See Current Value",
        "text": "Calculator fetches live market price and shows current value of your silver",
        "url": "https://silverinfo.in/investment-calculator#step2"
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "View Profit/Loss",
        "text": "Instantly see your absolute gain/loss and percentage return",
        "url": "https://silverinfo.in/investment-calculator#step3"
      }
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
              <span>Investment Calculator</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Silver Investment Calculator
            </h1>
            <p className="text-gray-600 mt-2">
              Calculate your silver investment returns, track profit/loss, and compare with current market prices
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Last updated: {new Date(LAST_UPDATED).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calculator - 2 columns on Desktop */}
              <div className="lg:col-span-2 space-y-6">
                <InvestmentCalculator currentPrice={price.pricePerGram} />
                
                {/* How It Works */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    How to Use This Calculator
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Enter Purchase Details</h3>
                      <p className="text-sm text-gray-500">
                        Input your purchase price per gram and total weight in grams
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">See Current Value</h3>
                      <p className="text-sm text-gray-500">
                        Calculator fetches live market price and shows current value
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-600 font-bold">3</span>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">View Profit/Loss</h3>
                      <p className="text-sm text-gray-500">
                        Instantly see your absolute gain/loss and percentage return
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Tips */}
                <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    💡 Silver Investment Tips
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      <p className="text-sm text-gray-700">
                        <strong>Buy physical silver</strong> (coins, bars) for long-term investment - avoid high making charges on jewelry
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      <p className="text-sm text-gray-700">
                        <strong>Compare premiums</strong> - Some dealers charge lower premiums over spot price
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      <p className="text-sm text-gray-700">
                        <strong>Check purity</strong> - Always buy BIS hallmarked 999 silver for investment
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      <p className="text-sm text-gray-700">
                        <strong>Store safely</strong> - Keep purchase receipts and store in a secure location
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Live Silver Rate */}
                <LiveRateCard price={price} showLink={false} />

                {/* Historical Returns Reference */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Historical Silver Returns
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Long-term Average</div>
                      <div className="font-medium text-gray-900">8-12% per year</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Inflation (India)</div>
                      <div className="font-medium text-gray-900">5-7% per year</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">FD Returns</div>
                      <div className="font-medium text-gray-900">6-7% per year</div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      * Past performance doesn&apos;t guarantee future returns. Silver is volatile in short term.
                    </p>
                  </div>
                </div>

                {/* Related Tools */}
                <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    More Tools
                  </h3>
                  <div className="space-y-2">
                    <Link
                      href="/silver-price-calculator"
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-[#1e3a5f]">
                          🧮 Silver Calculator
                        </div>
                        <p className="text-xs text-gray-500">
                          Calculate by weight & purity
                        </p>
                      </div>
                      <span className="text-gray-400 group-hover:text-[#1e3a5f]">→</span>
                    </Link>
                    <Link
                      href="/capital-gains-tax-calculator"
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-[#1e3a5f]">
                          🏛️ Capital Gains Tax
                        </div>
                        <p className="text-xs text-gray-500">
                          Calculate tax on silver gains
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
