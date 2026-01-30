import type { Metadata } from "next";
import Link from "next/link";
import { getSilverPriceWithChange } from "@/lib/metalApi";
import { generateBreadcrumbSchema, generateFAQSchema, type FAQItem } from "@/lib/schema";
import InflationAdjustedCalculator from "@/components/InflationAdjustedCalculator";
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
    title: `Inflation-Adjusted Returns Calculator | Silver ₹${pricePerGram}/g - Real Returns - SilverInfo.in`,
    description: `Calculate real returns on silver after inflation. Current rate: ₹${pricePerGram}/gram. Uses official CPI data to show true purchasing power gains on your silver investment.`,
    keywords: [
      "inflation adjusted returns calculator",
      "real return calculator",
      "silver real returns india",
      "CPI adjusted returns",
      "purchasing power calculator",
      "silver inflation calculator",
    ],
    alternates: {
      canonical: "/inflation-adjusted-calculator",
    },
    openGraph: {
      title: `Silver Inflation Calculator | ₹${pricePerGram}/g - Real Returns`,
      description: `Calculate inflation-adjusted returns on silver at ₹${pricePerGram}/gram.`,
    },
  };
}

const faqItems: FAQItem[] = [
  {
    question: "What is the difference between nominal and real returns?",
    answer:
      "Nominal returns show how much your money has grown in absolute terms. Real returns show your actual gain in purchasing power after accounting for inflation. For example, if your investment grew 50% but inflation was 30%, your real return is only about 15%.",
  },
  {
    question: "How is real return calculated?",
    answer:
      "Real return is calculated using the formula: Real Return = (1 + Nominal Return) / (1 + Inflation Rate) - 1. This is more accurate than simply subtracting inflation from nominal return.",
  },
  {
    question: "What is CPI and why is it used?",
    answer:
      "CPI (Consumer Price Index) is an official measure of inflation published by MOSPI. It tracks the average change in prices paid by consumers for goods and services. Using CPI gives a reliable, standardized measure of inflation.",
  },
  {
    question: "Why does my real return show negative even with profit?",
    answer:
      "If your investment grew by 5% but inflation was 7%, your purchasing power actually decreased by about 2%. Even though you have more rupees, those rupees buy less than before. This is why real returns matter.",
  },
  {
    question: "Is silver a good hedge against inflation?",
    answer:
      "Silver historically has been considered an inflation hedge, as commodity prices tend to rise with inflation. However, silver is volatile and may not track inflation perfectly in short periods. Long-term holdings typically show better inflation-adjusted performance.",
  },
];

export default async function InflationAdjustedCalculatorPage() {
  const price = await getSilverPriceWithChange();
  const currentPrice = price?.pricePerGram ?? 100;
  const faqSchema = generateFAQSchema(faqItems);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Inflation-Adjusted Returns Calculator", url: "https://silverinfo.in/inflation-adjusted-calculator" },
  ]);

  // HowTo schema for inflation-adjusted calculations
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Real Returns on Silver After Inflation",
    description: "Step-by-step guide to calculate your true purchasing power gains from silver investment.",
    image: "https://silverinfo.in/og-image.png",
    totalTime: "PT2M",
    step: [
      {
        "@type": "HowToStep",
        name: "Enter Investment Details",
        text: "Enter your purchase price, current value, and investment period in months.",
        url: "https://silverinfo.in/inflation-adjusted-calculator",
      },
      {
        "@type": "HowToStep",
        name: "Select Inflation Source",
        text: "Choose to use official CPI data from MOSPI or enter a custom inflation rate.",
        url: "https://silverinfo.in/inflation-adjusted-calculator",
      },
      {
        "@type": "HowToStep",
        name: "View Results",
        text: "Compare nominal return vs real (inflation-adjusted) return to see your true purchasing power gain.",
        url: "https://silverinfo.in/inflation-adjusted-calculator",
      },
    ],
  };

  // SoftwareApplication Schema
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Silver Inflation-Adjusted Returns Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "url": "https://silverinfo.in/inflation-adjusted-calculator",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Calculate real returns on silver investments after adjusting for inflation using official CPI data.",
    "featureList": [
      "Uses official CPI data from MOSPI",
      "Shows nominal vs real returns comparison",
      "Custom inflation rate option",
      "Purchasing power analysis",
      "Educational explanations"
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
              <span>Inflation-Adjusted Returns Calculator</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Inflation-Adjusted Returns Calculator
            </h1>
            <p className="text-gray-600 mt-2">
              Calculate your real silver returns after accounting for inflation
            </p>
            <p className="text-xs text-gray-400 mt-2">
              CPI data updated: {new Date(LAST_UPDATED).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calculator - 2 columns on Desktop */}
              <div className="lg:col-span-2 space-y-6">
                <InflationAdjustedCalculator currentPrice={currentPrice} />
                
                {/* Educational Content */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    📚 Understanding Real vs Nominal Returns
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Nominal Return</h3>
                      <p className="text-sm text-gray-600">
                        The raw percentage growth of your investment. This is what you typically see — 
                        &quot;my silver went up 40%&quot;. However, it doesn&apos;t tell you how much you can 
                        actually <em>buy</em> with that money.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-medium text-blue-900 mb-2">Real Return</h3>
                      <p className="text-sm text-blue-800">
                        Your actual gain in purchasing power. If prices of goods increased by 30% 
                        during your holding period, a 40% nominal return is really only ~8% real return. 
                        This is the <em>true</em> measure of wealth creation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h3 className="font-medium text-amber-900 mb-2">💡 Example</h3>
                    <div className="text-sm text-amber-800">
                      <p>
                        You invested ₹1,00,000 in silver 5 years ago. Today it&apos;s worth ₹1,50,000.
                      </p>
                      <ul className="mt-2 space-y-1 list-disc list-inside">
                        <li><strong>Nominal Return:</strong> 50% (you have ₹50,000 more)</li>
                        <li><strong>Inflation over 5 years:</strong> ~35% (CPI-based)</li>
                        <li><strong>Real Return:</strong> ~11% (your actual purchasing power gain)</li>
                      </ul>
                      <p className="mt-2">
                        While you have 50% more rupees, those rupees buy only ~11% more goods than before.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Live Silver Rate */}
                {price ? <LiveRateCard price={price} showLink={false} /> : null}

                {/* Inflation Quick Facts */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Inflation Quick Facts
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Average Annual CPI (India)</div>
                      <div className="font-medium text-gray-900">~5-7% per year</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">10-Year Cumulative Inflation</div>
                      <div className="font-medium text-gray-900">~60-80%</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-500">Data Source</div>
                      <a 
                        href="https://mospi.gov.in" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-[#1e3a5f] hover:underline"
                      >
                        MOSPI (India)
                      </a>
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
