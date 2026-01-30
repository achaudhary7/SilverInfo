import type { Metadata } from "next";
import Link from "next/link";
import { getSilverPriceWithChange } from "@/lib/metalApi";
import { generateBreadcrumbSchema, generateFAQSchema, type FAQItem } from "@/lib/schema";
import BreakEvenCalculator from "@/components/BreakEvenCalculator";
import FAQ from "@/components/FAQ";
import { LiveRateCard } from "@/components/price";

export const revalidate = 600;

// Page last updated date
const LAST_UPDATED = "2026-01-23";

// Dynamic metadata with live price
export async function generateMetadata(): Promise<Metadata> {
  const price = await getSilverPriceWithChange();
  const pricePerGram = price?.pricePerGram?.toFixed(2) || "95.00";
  
  return {
    title: `Silver Break-Even Calculator | Current Rate ₹${pricePerGram}/g - Jewellery & Bullion - SilverInfo.in`,
    description: `Calculate break-even price for silver jewellery and bullion. Current silver rate: ₹${pricePerGram}/gram. Includes making charges, GST, and fees. Know if you're in profit.`,
    keywords: [
      "silver break even calculator",
      "silver jewellery cost calculator",
      "silver making charges calculator",
      "silver resale value calculator",
      "silver buyback price calculator",
      "silver profit calculator india",
    ],
    alternates: {
      canonical: "/break-even-calculator",
    },
    openGraph: {
      title: `Silver Break-Even Calculator | ₹${pricePerGram}/g - SilverInfo.in`,
      description: `Calculate break-even at ₹${pricePerGram}/gram. Know when you're in profit.`,
    },
  };
}

const faqItems: FAQItem[] = [
  {
    question: "What is the break-even price for silver jewellery?",
    answer:
      "Break-even price is the minimum market price at which you can sell your silver without loss. It includes your purchase price, making charges, GST, and any other fees. For jewellery with 10% making charges and 3% GST, break-even is typically 13-15% above the silver price at purchase.",
  },
  {
    question: "Are making charges recoverable when selling silver jewellery?",
    answer:
      "Generally, no. Jewellers pay only for the silver content when buying back, not for making charges. This is why bullion (bars and coins) has better resale value compared to jewellery — lower or no making charges.",
  },
  {
    question: "What is the typical jeweller buyback discount?",
    answer:
      "Jewellers typically offer 2-10% below market rate when buying back silver. This varies by jeweller, city, and quantity. Getting multiple quotes is recommended before selling.",
  },
  {
    question: "Should I buy silver jewellery or bullion for investment?",
    answer:
      "For pure investment, bullion (bars and coins) is better as it has minimal making charges (1-3% premium) and better resale value. Jewellery is suitable if you also want to wear it, but expect lower returns due to unrecoverable making charges.",
  },
  {
    question: "How much GST is charged on silver in India?",
    answer:
      "GST on silver is 3% on the metal value. Additionally, 5% GST applies on making charges. So for jewellery, you pay 3% on silver + 5% on making charges.",
  },
];

export default async function BreakEvenCalculatorPage() {
  const price = await getSilverPriceWithChange();
  
  // Handle API failure with default price
  const currentPrice = price?.pricePerGram ?? 100; // Fallback for display
  
  const faqSchema = generateFAQSchema(faqItems);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Break-Even Calculator", url: "https://silverinfo.in/break-even-calculator" },
  ]);

  // HowTo schema for break-even calculations
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Break-Even Price for Silver Jewelry",
    description: "Calculate the minimum selling price needed to recover your silver jewelry investment.",
    image: "https://silverinfo.in/og-image.png",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter Purchase Price",
        text: "Enter the silver price per gram at the time of purchase.",
        url: "https://silverinfo.in/break-even-calculator",
      },
      {
        "@type": "HowToStep",
        name: "Enter Making Charges",
        text: "Enter the making charges percentage you paid (typically 6-15% for jewelry, 0-3% for bullion).",
        url: "https://silverinfo.in/break-even-calculator",
      },
      {
        "@type": "HowToStep",
        name: "Enter Buyback Discount",
        text: "Enter the expected jeweller buyback discount (typically 2-10% below market rate).",
        url: "https://silverinfo.in/break-even-calculator",
      },
      {
        "@type": "HowToStep",
        name: "View Break-Even Price",
        text: "See the minimum market price at which you can sell without loss, and compare with current rates.",
        url: "https://silverinfo.in/break-even-calculator",
      },
    ],
  };

  // SoftwareApplication Schema
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Silver Break-Even Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": "https://silverinfo.in/break-even-calculator",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Calculate break-even price for silver jewellery and bullion including making charges, GST, and other fees.",
    "featureList": [
      "Making charges calculation (% or flat)",
      "GST on silver and making charges",
      "Market vs jeweller buyback scenarios",
      "Clear profit/loss indicators",
      "Detailed cost breakdown"
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
              <span>Break-Even Calculator</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Silver Break-Even Calculator
            </h1>
            <p className="text-gray-600 mt-2">
              Calculate your break-even price including making charges, GST, and all costs
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
                <BreakEvenCalculator currentPrice={currentPrice} />
                
                {/* Jewellery vs Bullion Comparison */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    📊 Jewellery vs Bullion: Break-Even Comparison
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 font-semibold text-gray-700">Factor</th>
                          <th className="text-left py-3 font-semibold text-gray-700">Silver Jewellery</th>
                          <th className="text-left py-3 font-semibold text-gray-700">Silver Bullion</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 font-medium">Making Charges</td>
                          <td className="py-3 text-amber-600">6-15%</td>
                          <td className="py-3 text-green-600">1-3%</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 font-medium">GST on Making</td>
                          <td className="py-3">5%</td>
                          <td className="py-3">Minimal</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 font-medium">Resale Value</td>
                          <td className="py-3 text-amber-600">Lower (making charges lost)</td>
                          <td className="py-3 text-green-600">Higher (near spot price)</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 font-medium">Break-Even Gap</td>
                          <td className="py-3 text-amber-600">13-20% above purchase</td>
                          <td className="py-3 text-green-600">4-6% above purchase</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-medium">Best For</td>
                          <td className="py-3">Wearing + Long-term holding</td>
                          <td className="py-3">Pure investment</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Tips */}
                <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    💡 Tips to Improve Your Break-Even
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex gap-3">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      <div>
                        <p className="font-medium text-gray-900">Negotiate making charges</p>
                        <p className="text-sm text-gray-600">
                          Ask for lower rates, especially on larger purchases
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      <div>
                        <p className="font-medium text-gray-900">Buy during festivals</p>
                        <p className="text-sm text-gray-600">
                          Many jewellers offer discounts on making charges
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      <div>
                        <p className="font-medium text-gray-900">Consider bullion for investment</p>
                        <p className="text-sm text-gray-600">
                          Lower break-even gap means faster path to profit
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-green-500 flex-shrink-0">✓</span>
                      <div>
                        <p className="font-medium text-gray-900">Get multiple buyback quotes</p>
                        <p className="text-sm text-gray-600">
                          Prices vary significantly between dealers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Live Silver Rate */}
                {price ? (
                  <LiveRateCard price={price} showLink={false} />
                ) : (
                  <div className="card p-6 text-center text-gray-500">
                    <p>Unable to fetch live price</p>
                  </div>
                )}

                {/* Typical Costs Reference */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Typical Cost Reference
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">
                        Making Charges
                      </div>
                      <p className="text-sm text-gray-600">
                        Jewellery: 6-15% | Bullion: 1-3%
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">
                        GST on Silver
                      </div>
                      <p className="text-sm text-gray-600">
                        3% on metal value
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">
                        GST on Making
                      </div>
                      <p className="text-sm text-gray-600">
                        5% on making charges
                      </p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="font-medium text-amber-900">
                        Jeweller Buyback
                      </div>
                      <p className="text-sm text-amber-800">
                        Typically 2-10% below market
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
                      href="/capital-gains-tax-calculator"
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors group"
                    >
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-[#1e3a5f]">
                          🏛️ Capital Gains Tax
                        </div>
                        <p className="text-xs text-gray-500">
                          Calculate tax on silver profits
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
