import type { Metadata } from "next";
import { getSilverPriceWithChange, getHistoricalPrices, getCityPrices } from "@/lib/metalApi";
import LivePriceCard from "@/components/LivePriceCard";
import { DynamicPriceChart } from "@/components/DynamicChart";
import CityTable from "@/components/CityTable";
import FAQ from "@/components/FAQ";
import MarketStatus from "@/components/MarketStatus";
import WhyPriceChanged from "@/components/WhyPriceChanged";
import { generateFAQSchema, generateBreadcrumbSchema, type FAQItem } from "@/lib/schema";

export const revalidate = 600;

// Page content last reviewed date
const LAST_UPDATED = "2026-01-23";

export const metadata: Metadata = {
  title: "Silver Rate Today - Live Silver Price per Gram in India",
  description:
    "Check indicative silver rate today in India. Get silver price per gram, per kg, per 10 grams with historical charts and city-wise prices. Calculated from COMEX, auto-refreshes every 30 seconds.",
  keywords: [
    "silver rate today",
    "silver price per gram",
    "silver rate today in india",
    "today silver rate",
    "silver price chart",
    "silver price history",
  ],
  alternates: {
    canonical: "/silver-rate-today",
  },
};

const faqItems: FAQItem[] = [
  {
    question: "What is today's silver rate per gram in India?",
    answer:
      "Today's indicative silver rate is calculated from international spot prices (COMEX) and USD/INR exchange rates. Prices auto-refresh every 30 seconds. These are estimates and may differ from actual retail rates by 2-5%. For accurate pricing, verify with your local jeweller or MCX.",
  },
  {
    question: "Why do silver prices change daily?",
    answer:
      "Silver prices change due to multiple factors: international market demand, USD/INR exchange rates, geopolitical events, industrial demand, and investor sentiment. During market hours, prices can fluctuate every few minutes.",
  },
  {
    question: "Is silver a good investment in India?",
    answer:
      "Silver can be a good investment for portfolio diversification. It's more affordable than gold and has industrial applications. However, it's more volatile. Consider your risk tolerance and investment horizon before investing. Silver ETFs and coins are popular investment options in India.",
  },
  {
    question: "What time do silver prices update in India?",
    answer:
      "International silver markets operate 24/5. Indian MCX (Multi Commodity Exchange) trading hours are Monday to Friday, 9:00 AM to 11:30 PM IST. Our indicative prices are calculated from COMEX and auto-refresh every 30 seconds. For official MCX rates, visit mcxindia.com.",
  },
];

export default async function SilverRateTodayPage() {
  const [price, historicalPrices, cityPrices] = await Promise.all([
    getSilverPriceWithChange(),
    getHistoricalPrices(365), // Full year of data
    getCityPrices(),
  ]);

  const faqSchema = generateFAQSchema(faqItems);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Silver Rate Today", url: "https://silverinfo.in/silver-rate-today" },
  ]);

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Silver",
            description: "Live silver price in India per gram",
            offers: {
              "@type": "Offer",
              price: price.pricePerGram,
              priceCurrency: "INR",
              priceValidUntil: new Date(
                Date.now() + 5 * 60 * 1000
              ).toISOString(),
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200 py-6 sm:py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-[#1e3a5f]">
                Home
              </a>
              <span>/</span>
              <span>Silver Rate Today</span>
            </div>
            
            {/* Badges - Matching Homepage */}
            <div className="mb-3 sm:mb-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                <span className="relative flex h-1.5 w-1.5 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                Live • 30s Refresh
              </span>
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800">
                COMEX + Forex
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              Silver Rate Today in India
            </h1>
            <p className="text-sm sm:text-lg text-[#1e3a5f] font-semibold mb-1 sm:mb-2">
              Calculated, Not Copied.
            </p>
            <p className="text-xs sm:text-base text-gray-600 max-w-3xl mb-2 sm:mb-3">
              Live silver price per gram, per kg with historical charts and city-wise prices. 
              Prices derived from COMEX futures + USD/INR exchange rates.{" "}
              <a href="/how-we-calculate" className="text-[#1e3a5f] font-medium hover:underline">
                See Our Formula →
              </a>
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400">
              Content last reviewed: {new Date(LAST_UPDATED).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Price Card */}
                <LivePriceCard initialPrice={price} pollInterval={30000} />

                {/* Full Chart */}
                <DynamicPriceChart data={historicalPrices} height={400} />

                {/* Price Comparison Table */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Silver Price Comparison
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 font-medium text-gray-600">
                            Weight
                          </th>
                          <th className="text-right py-3 font-medium text-gray-600">
                            999 Silver
                          </th>
                          <th className="text-right py-3 font-medium text-gray-600">
                            925 Silver
                          </th>
                          <th className="text-right py-3 font-medium text-gray-600">
                            900 Silver
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 10, 100, 500, 1000].map((weight) => (
                          <tr
                            key={weight}
                            className="border-b border-gray-100"
                          >
                            <td className="py-3 text-gray-900">
                              {weight >= 1000
                                ? `${weight / 1000} Kg`
                                : `${weight} Gram`}
                            </td>
                            <td className="py-3 text-right font-medium">
                              ₹
                              {(price.pricePerGram * weight * 0.999).toLocaleString(
                                "en-IN",
                                { maximumFractionDigits: 0 }
                              )}
                            </td>
                            <td className="py-3 text-right">
                              ₹
                              {(price.pricePerGram * weight * 0.925).toLocaleString(
                                "en-IN",
                                { maximumFractionDigits: 0 }
                              )}
                            </td>
                            <td className="py-3 text-right">
                              ₹
                              {(price.pricePerGram * weight * 0.9).toLocaleString(
                                "en-IN",
                                { maximumFractionDigits: 0 }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Why Price Changed Today - Key Differentiator */}
                <WhyPriceChanged />
                
                {/* Price Units Card */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Silver Price in Different Units
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Per Gram",
                        value: price.pricePerGram,
                      },
                      {
                        label: "Per 10 Gram",
                        value: price.pricePer10Gram,
                      },
                      {
                        label: "Per 100 Gram",
                        value: price.pricePerGram * 100,
                      },
                      {
                        label: "Per Tola (11.66g)",
                        value: price.pricePerTola,
                      },
                      {
                        label: "Per Kg",
                        value: price.pricePerKg,
                      },
                      {
                        label: "Per Troy Ounce",
                        value: price.pricePerGram * 31.1035,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-semibold text-gray-900">
                          ₹{item.value.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Status - Dynamic */}
                <MarketStatus />
              </div>
            </div>

            {/* City Prices Section */}
            <div className="mt-8" id="cities">
              <CityTable cities={cityPrices} showViewAll={false} />
            </div>

            {/* FAQ Section */}
            <div className="mt-8">
              <FAQ items={faqItems} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
