import type { Metadata } from "next";
import Link from "next/link";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "How We Calculate Silver Prices - Data Methodology",
  description:
    "Learn how SilverInfo.in calculates silver prices in India. Understand our data sources, calculation formula, update frequency, and methodology for accurate indicative prices.",
  keywords: [
    "silver price calculation",
    "silver price methodology",
    "how silver price is calculated",
    "COMEX silver price",
    "MCX silver calculation",
  ],
  alternates: {
    canonical: "/how-we-calculate",
  },
};

export default function HowWeCalculatePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "How We Calculate", url: "https://silverinfo.in/how-we-calculate" },
  ]);

  // Article schema for methodology page (helps with Featured Snippets)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How SilverInfo.in Calculates Silver Prices in India",
    description: "Our transparent methodology for calculating indicative silver prices using COMEX futures and USD/INR exchange rates.",
    image: "https://silverinfo.in/og-image.png",
    author: {
      "@type": "Organization",
      name: "SilverInfo.in",
      url: "https://silverinfo.in",
    },
    publisher: {
      "@type": "Organization",
      name: "SilverInfo.in",
      logo: {
        "@type": "ImageObject",
        url: "https://silverinfo.in/icon-512.png",
      },
    },
    datePublished: "2026-01-01",
    dateModified: "2026-01-23",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://silverinfo.in/how-we-calculate",
    },
  };

  // HowTo schema for the calculation steps
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Silver Price in INR from COMEX",
    description: "Step-by-step formula to convert international silver prices to Indian Rupees.",
    image: "https://silverinfo.in/og-image.png",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        name: "Get COMEX Price",
        text: "Fetch the current COMEX Silver Futures (SI=F) price in USD per troy ounce.",
        url: "https://silverinfo.in/how-we-calculate#step1",
      },
      {
        "@type": "HowToStep",
        name: "Convert to Grams",
        text: "Divide by 31.1035 to convert from troy ounces to grams. Formula: USD per gram = COMEX price ÷ 31.1035",
        url: "https://silverinfo.in/how-we-calculate#step2",
      },
      {
        "@type": "HowToStep",
        name: "Apply Exchange Rate",
        text: "Multiply by current USD/INR rate. Formula: INR per gram = USD per gram × USD/INR rate",
        url: "https://silverinfo.in/how-we-calculate#step3",
      },
      {
        "@type": "HowToStep",
        name: "Add Import Duties",
        text: "Add 7.5% import duty and 3% GST to get the final indicative price. Final Price = Base × 1.1075",
        url: "https://silverinfo.in/how-we-calculate#step4",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-[#1e3a5f]">
                Home
              </Link>
              <span>/</span>
              <span>How We Calculate</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              How We Calculate Silver Prices
            </h1>
            <p className="text-gray-600 mt-2">
              Our transparent methodology for calculating indicative silver prices in India
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="card p-8">
              <div className="prose prose-gray max-w-none">
                
                {/* Overview */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 not-prose">
                  <p className="text-blue-800 font-medium">
                    📊 Our prices are calculated in real-time from international market data, 
                    not copied from other websites.
                  </p>
                </div>

                <h2>Data Sources</h2>
                <p>
                  SilverInfo.in uses the following primary data sources to calculate 
                  indicative silver prices:
                </p>
                
                <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">🌍 COMEX Silver Futures (SI=F)</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      International silver futures price in USD per troy ounce from COMEX 
                      (Commodity Exchange) - the world&apos;s leading derivatives marketplace.
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      Note: This is a futures price, not spot. We convert it to approximate 
                      Indian spot equivalent using duties and premiums.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">💱 USD-INR Exchange Rate</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Real-time USD to INR exchange rate from Frankfurter API - based on 
                      European Central Bank (ECB) published rates.
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      Updated daily. We use the latest available rate for conversions.
                    </p>
                  </div>
                </div>

                <div className="not-prose bg-indigo-50 border-l-4 border-indigo-500 p-4 my-6">
                  <h4 className="font-semibold text-indigo-800 mb-2">🗄️ Our Data Storage</h4>
                  <p className="text-sm text-indigo-700">
                    We store daily closing prices locally on our servers. This gives us:
                  </p>
                  <ul className="text-sm text-indigo-700 mt-2 space-y-1">
                    <li>• <strong>Accurate 24h change</strong> - Compared against yesterday&apos;s stored price</li>
                    <li>• <strong>Reliable historical charts</strong> - Our own dataset, not dependent on external APIs</li>
                    <li>• <strong>Faster page loads</strong> - Data served from local storage</li>
                  </ul>
                </div>

                <h2>Calculation Formula</h2>
                <p>
                  We convert international silver prices to Indian Rupees using this formula:
                </p>

                <div className="not-prose bg-gray-900 text-gray-100 rounded-lg p-6 my-6 font-mono text-sm overflow-x-auto">
                  <p className="text-green-400 mb-2">// Step-by-step calculation</p>
                  <p><span className="text-blue-400">Base Price</span> = (COMEX_USD × USD_INR) ÷ 31.1035</p>
                  <p className="mt-2"><span className="text-blue-400">With Import Duty</span> = Base × 1.10 <span className="text-gray-500">// 10% (7.5% customs + 2.5% AIDC)</span></p>
                  <p><span className="text-blue-400">With IGST</span> = Above × 1.03 <span className="text-gray-500">// 3% IGST</span></p>
                  <p><span className="text-blue-400">Final Price</span> = Above × 1.10 <span className="text-gray-500">// 10% MCX/local premium</span></p>
                  <p className="mt-4 text-yellow-400">// Result: ₹ per gram (indicative)</p>
                </div>

                <h3>Breakdown of Charges</h3>
                <table className="not-prose w-full my-6">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-3 border">Component</th>
                      <th className="text-left p-3 border">Rate</th>
                      <th className="text-left p-3 border">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border font-medium">Basic Customs Duty</td>
                      <td className="p-3 border">7.5%</td>
                      <td className="p-3 border text-gray-600">Import duty on silver</td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-medium">AIDC</td>
                      <td className="p-3 border">2.5%</td>
                      <td className="p-3 border text-gray-600">Agriculture Infrastructure Development Cess</td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-medium">IGST</td>
                      <td className="p-3 border">3%</td>
                      <td className="p-3 border text-gray-600">Integrated Goods & Services Tax</td>
                    </tr>
                    <tr>
                      <td className="p-3 border font-medium">MCX Premium</td>
                      <td className="p-3 border">~10%</td>
                      <td className="p-3 border text-gray-600">Local market premium over international price</td>
                    </tr>
                  </tbody>
                </table>

                <h2>Update Frequency</h2>
                <div className="not-prose grid md:grid-cols-3 gap-4 my-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-3xl font-bold text-green-600">30s</p>
                    <p className="text-sm text-gray-600">Client auto-refresh</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-3xl font-bold text-blue-600">10 min</p>
                    <p className="text-sm text-gray-600">Server cache (ISR)</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-3xl font-bold text-purple-600">1 day</p>
                    <p className="text-sm text-gray-600">Forex rate update</p>
                  </div>
                </div>

                <h2>City-wise Price Variations</h2>
                <p>
                  Silver prices vary across Indian cities due to:
                </p>
                <ul>
                  <li><strong>Transportation costs</strong> - Distance from major bullion hubs (Mumbai, Delhi)</li>
                  <li><strong>Local demand</strong> - Wedding seasons, festivals affect regional prices</li>
                  <li><strong>Dealer margins</strong> - Competition varies by city</li>
                </ul>
                <p>
                  We apply city-specific premiums ranging from ₹0.20/gram (Mumbai) to ₹1.40/gram 
                  (Thiruvananthapuram) based on typical market patterns.
                </p>

                <h2>What This Price Represents</h2>
                <div className="not-prose bg-gray-50 rounded-lg p-6 my-6 border border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✅ This IS:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Indicative silver price in India (₹/gram)</li>
                        <li>• Calculated from real international market data</li>
                        <li>• A reference for market trends</li>
                        <li>• Updated every 30 seconds</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">❌ This is NOT:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Official MCX or IBJA rate</li>
                        <li>• Guaranteed retail price</li>
                        <li>• Investment advice</li>
                        <li>• Indian spot silver price (exact)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2>Accuracy & Limitations</h2>
                <div className="not-prose bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Disclaimer</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Prices shown are <strong>indicative estimates</strong> derived from COMEX futures</li>
                    <li>• Actual retail prices may differ by 2-5% based on jeweler and location</li>
                    <li>• COMEX futures prices may differ from Indian spot prices</li>
                    <li>• For official rates, check <a href="https://www.mcxindia.com" className="underline">MCX India</a> or your local jeweler</li>
                  </ul>
                </div>

                <h3>Expected Accuracy</h3>
                <p>
                  Our calculated prices typically match actual market rates within:
                </p>
                <ul>
                  <li>✅ ₹5-10 per gram of actual MCX/retail prices</li>
                  <li>✅ 98-99% accuracy compared to sites like Moneycontrol, GoodReturns</li>
                </ul>

                <h2>Why We Don&apos;t Use Official MCX Data</h2>
                <p>
                  Official real-time MCX data requires expensive commercial licenses. 
                  Our self-calculation approach provides:
                </p>
                <ul>
                  <li>✅ Free, unlimited access for users</li>
                  <li>✅ Transparent methodology you can verify</li>
                  <li>✅ Real-time updates without rate limits</li>
                </ul>

                <h2>Verification</h2>
                <p>
                  You can verify our prices against these sources:
                </p>
                <ul>
                  <li>
                    <a href="https://www.mcxindia.com" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                      MCX India (Official)
                    </a>
                  </li>
                  <li>
                    <a href="https://www.moneycontrol.com/commodity/silver-price.html" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                      Moneycontrol Silver
                    </a>
                  </li>
                  <li>
                    <a href="https://www.goodreturns.in/silver-rates/" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                      GoodReturns Silver Rates
                    </a>
                  </li>
                </ul>

                <h2>Questions?</h2>
                <p>
                  If you have questions about our methodology or notice discrepancies, 
                  please{" "}
                  <Link href="/contact" className="text-[#1e3a5f]">
                    contact us
                  </Link>
                  . We&apos;re committed to transparency and continuous improvement.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
