import type { Metadata } from "next";
import Link from "next/link";
import { getInternationalSilverPrice, getHistoricalPrices } from "@/lib/metalApi";
import { DynamicPriceChart } from "@/components/DynamicChart";
import FAQ from "@/components/FAQ";
import { generateFAQSchema, generateBreadcrumbSchema, type FAQItem } from "@/lib/schema";

export const revalidate = 600; // ISR: revalidate every 10 minutes

// Dynamic metadata with date for freshness signal (SEO best practice)
export async function generateMetadata(): Promise<Metadata> {
  const qatarPrice = await getInternationalSilverPrice("qatar");
  const priceQar = qatarPrice?.pricePerGram?.toFixed(2) || "4.50";
  
  const dateString = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    title: `Silver Price Qatar Today (${dateString}) | QAR ${priceQar}/g Live - SilverInfo.in`,
    description: `Silver price in Qatar today (${dateString}): QAR ${priceQar}/gram. Live silver rate in QAR & INR for NRIs. 24 carat purity, 10g, kg prices from COMEX.`,
    keywords: [
      "silver price qatar today",
      "silver price qatar today 24 carat",
      "silver price qatar today 24 carat in indian rupees",
      "qatar silver rate today in indian rupees",
      "qatar silver rate today in indian rupees 22k",
      "10 gram silver price in qatar",
      "silver rate in qatar",
      "qatar silver price",
      "silver price doha",
    ],
    alternates: {
      canonical: "/qatar/silver-rate-today",
    },
    openGraph: {
      title: `Silver Price Qatar Today (${dateString}) | QAR ${priceQar}/g`,
      description: `Live silver prices in Qatar for NRIs (${dateString}). Check rates in QAR and INR.`,
      type: "website",
      locale: "en_QA",
    },
    twitter: {
      card: "summary_large_image",
      title: `Silver Price Qatar (${dateString}) | QAR ${priceQar}/g`,
      description: `Live silver rate in Qatar. QAR ${priceQar}/gram. Updated every 30 seconds.`,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

// FAQ items targeting keywords
const faqItems: FAQItem[] = [
  {
    question: "What is the silver price in Qatar today?",
    answer:
      "Silver price in Qatar is calculated from COMEX international rates converted to QAR. Check the live price above which auto-refreshes. Prices shown are indicative and may vary at retail outlets.",
  },
  {
    question: "What is 24 carat silver price in Qatar in Indian Rupees?",
    answer:
      "24 carat (999 purity) silver price in Qatar converted to INR is shown above. This helps NRIs compare prices between Qatar and India. The INR rate uses RBI reference exchange rates.",
  },
  {
    question: "What is the 10 gram silver price in Qatar?",
    answer:
      "10 gram silver price in Qatar is displayed in the price table above in both QAR and INR. The price is calculated from international COMEX rates plus local duties.",
  },
  {
    question: "How is silver price in Qatar calculated?",
    answer:
      "Qatar silver price = (COMEX USD price × USD/QAR rate) ÷ 31.1035 + import duty (5%) + local premium (2%). Qatar has no VAT on precious metals. Prices shown are estimates.",
  },
  {
    question: "Is silver cheaper in Qatar or India?",
    answer:
      "Silver prices vary due to different tax structures. Qatar has 5% import duty and no VAT, while India has 10% import duty + 3% GST. Compare the QAR and INR prices above to see current difference.",
  },
  {
    question: "What is 22K silver price in Qatar?",
    answer:
      "22K refers to gold purity, not silver. For silver, purity is measured as 999 (pure), 925 (sterling), or 900. Check our purity comparison table above for different silver grades.",
  },
];

export default async function QatarSilverRatePage() {
  // Fetch Qatar price data
  const qatarPrice = await getInternationalSilverPrice("qatar");
  const historicalPrices = await getHistoricalPrices(30);

  // Generate schemas
  const faqSchema = generateFAQSchema(faqItems);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Qatar", url: "https://silverinfo.in/qatar" },
    { name: "Silver Rate Today", url: "https://silverinfo.in/qatar/silver-rate-today" },
  ]);

  // Product schema for rich snippets
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Silver in Qatar",
    description: "Live silver price in Qatar in QAR and INR. Real-time rates from COMEX for NRIs.",
    image: "https://silverinfo.in/og-image.png",
    category: "Precious Metals",
    brand: {
      "@type": "Brand",
      name: "COMEX Silver",
    },
    offers: qatarPrice ? {
      "@type": "Offer",
      price: qatarPrice.pricePerGram,
      priceCurrency: "QAR",
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      url: "https://silverinfo.in/qatar/silver-rate-today",
      seller: {
        "@type": "Organization",
        name: "SilverInfo.in",
      },
    } : undefined,
  };

  if (!qatarPrice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to fetch prices</h1>
          <p className="text-gray-600">Please try again later.</p>
          <Link href="/" className="mt-4 inline-block text-[#1e3a5f] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* JSON-LD Schemas */}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1e3a5f] via-[#2d4a6f] to-[#1e3a5f] text-white py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-300 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/qatar/silver-rate-today" className="hover:text-white">Qatar</Link>
              <span>/</span>
              <span className="text-white">Silver Rate</span>
            </nav>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-500 text-white">
                <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                Live Prices
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-white/20 text-white">
                🇶🇦 Qatar
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-500/30 text-white">
                For NRIs
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              Silver Price in Qatar Today - {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mb-2">
              Live silver rates in Qatari Riyal (QAR) and Indian Rupees (INR). 
              Prices derived from COMEX international markets.
            </p>
            <p className="text-[10px] sm:text-xs text-gray-400">
              Last updated: {new Date(qatarPrice.timestamp).toLocaleString("en-IN")} • Auto-refreshes every 10 minutes
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Jump Links */}
            <nav className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-50 rounded-lg border" aria-label="Jump to section">
              <span className="text-xs text-gray-500 font-medium self-center">Jump to:</span>
              <a href="#live-price" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-white rounded border border-gray-200">Live Price</a>
              <a href="#purity" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-white rounded border border-gray-200">Purity Comparison</a>
              <a href="#chart" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-white rounded border border-gray-200">Price Chart</a>
              <a href="#faq" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-white rounded border border-gray-200">FAQ</a>
            </nav>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Live Price Card */}
                <div id="live-price" className="card p-6 scroll-mt-20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      🇶🇦 Silver Price in Qatar
                    </h2>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                      Live
                    </span>
                  </div>

                  {/* Main Price Display */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-[#1e3a5f] to-blue-700 rounded-xl p-4 text-white">
                      <p className="text-xs text-gray-300 mb-1">Per Gram (QAR)</p>
                      <p className="text-3xl sm:text-4xl font-bold">
                        {qatarPrice.currencySymbol} {qatarPrice.pricePerGram.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-300 mt-2">
                        ≈ ₹{qatarPrice.pricePerGramInr.toFixed(2)} INR
                      </p>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Per 10 Gram (QAR)</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {qatarPrice.currencySymbol} {qatarPrice.pricePer10Gram.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        ≈ ₹{(qatarPrice.pricePerGramInr * 10).toFixed(0)} INR
                      </p>
                    </div>
                  </div>

                  {/* Price by Weight Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 font-medium text-gray-600">Weight</th>
                          <th className="text-right py-2 font-medium text-gray-600">Price (QAR)</th>
                          <th className="text-right py-2 font-medium text-gray-600">≈ INR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 10, 50, 100, 500, 1000].map((weight) => (
                          <tr key={weight} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 text-gray-900 font-medium">
                              {weight >= 1000 ? `${weight / 1000} Kg` : `${weight} Gram`}
                            </td>
                            <td className="py-2 text-right font-semibold text-gray-900">
                              {qatarPrice.currencySymbol} {(qatarPrice.pricePerGram * weight).toLocaleString("en-US", { maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-2 text-right text-gray-600">
                              ₹{(qatarPrice.pricePerGramInr * weight).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Data Source */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400">
                      💡 Prices derived from COMEX @ ${qatarPrice.comexUsd}/oz • USD/QAR: {qatarPrice.usdRate} • USD/INR: ₹{qatarPrice.usdInr}
                    </p>
                  </div>
                </div>

                {/* Purity Comparison */}
                <div id="purity" className="card p-6 scroll-mt-20">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Silver Price by Purity in Qatar
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Compare 999, 925, and 900 silver prices. Note: &quot;24 carat&quot; typically refers to gold; silver uses different purity scales.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 font-medium text-gray-600">Purity</th>
                          <th className="text-left py-2 font-medium text-gray-600">Description</th>
                          <th className="text-right py-2 font-medium text-gray-600">Per Gram (QAR)</th>
                          <th className="text-right py-2 font-medium text-gray-600">Per 10g (QAR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 bg-yellow-50">
                          <td className="py-3 font-semibold text-gray-900">999 (Pure)</td>
                          <td className="py-3 text-gray-600">99.9% pure - Investment grade</td>
                          <td className="py-3 text-right font-bold text-gray-900">
                            {qatarPrice.currencySymbol} {(qatarPrice.pricePerGram * 0.999).toFixed(2)}
                          </td>
                          <td className="py-3 text-right text-gray-700">
                            {qatarPrice.currencySymbol} {(qatarPrice.pricePerGram * 10 * 0.999).toFixed(2)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 font-semibold text-gray-900">925 (Sterling)</td>
                          <td className="py-3 text-gray-600">92.5% pure - Jewelry grade</td>
                          <td className="py-3 text-right font-bold text-gray-900">
                            {qatarPrice.currencySymbol} {(qatarPrice.pricePerGram * 0.925).toFixed(2)}
                          </td>
                          <td className="py-3 text-right text-gray-700">
                            {qatarPrice.currencySymbol} {(qatarPrice.pricePerGram * 10 * 0.925).toFixed(2)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 font-semibold text-gray-900">900 (Coin)</td>
                          <td className="py-3 text-gray-600">90% pure - Coin silver</td>
                          <td className="py-3 text-right font-bold text-gray-900">
                            {qatarPrice.currencySymbol} {(qatarPrice.pricePerGram * 0.9).toFixed(2)}
                          </td>
                          <td className="py-3 text-right text-gray-700">
                            {qatarPrice.currencySymbol} {(qatarPrice.pricePerGram * 10 * 0.9).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    💡 &quot;24 carat silver&quot; is a common search term but refers to gold purity. Silver is measured as 999/925/900.
                  </p>
                </div>

                {/* Price Chart */}
                <div id="chart" className="scroll-mt-20">
                  <DynamicPriceChart data={historicalPrices} height={350} />
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    * Chart shows prices in INR for reference. QAR prices follow similar trends.
                  </p>
                </div>

                {/* FAQ */}
                <div id="faq" className="scroll-mt-20">
                  <FAQ items={faqItems} title="Frequently Asked Questions - Silver in Qatar" />
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* INR Comparison Card */}
                <div className="card p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    🇮🇳 For NRIs: INR Equivalent
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-600">Per Gram</span>
                      <span className="font-bold text-gray-900">₹{qatarPrice.pricePerGramInr.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-600">Per 10 Gram</span>
                      <span className="font-bold text-gray-900">₹{(qatarPrice.pricePerGramInr * 10).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-orange-200">
                      <span className="text-gray-600">Per Kg</span>
                      <span className="font-bold text-gray-900">₹{qatarPrice.pricePerKgInr.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Per Tola</span>
                      <span className="font-bold text-gray-900">₹{(qatarPrice.pricePerGramInr * 11.6638).toFixed(0)}</span>
                    </div>
                  </div>
                  <Link
                    href="/silver-rate-today"
                    className="block mt-4 text-center text-sm font-medium text-[#1e3a5f] hover:underline"
                  >
                    Compare with India prices →
                  </Link>
                </div>

                {/* Exchange Rates */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">💱 Exchange Rates</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">USD/QAR</span>
                      <span className="font-semibold">{qatarPrice.usdRate.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">USD/INR</span>
                      <span className="font-semibold">₹{qatarPrice.usdInr}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">COMEX Silver</span>
                      <span className="font-semibold">${qatarPrice.comexUsd}/oz</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3">
                    Rates from ECB via Frankfurter API
                  </p>
                </div>

                {/* Why Prices Differ */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">📊 Why Prices Differ</h3>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span><strong>Qatar:</strong> 5% import duty, No VAT</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-500">✓</span>
                      <span><strong>India:</strong> 10% duty + 3% GST + MCX premium</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">✓</span>
                      <span><strong>Result:</strong> Qatar often ~5-8% cheaper</span>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">🔗 Related</h3>
                  <div className="space-y-2">
                    <Link
                      href="/silver-rate-today"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1e3a5f] py-2"
                    >
                      🇮🇳 Silver Rate in India
                    </Link>
                    <Link
                      href="/silver-price-calculator"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1e3a5f] py-2"
                    >
                      🧮 Silver Calculator
                    </Link>
                    <Link
                      href="/learn/what-is-sterling-silver"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1e3a5f] py-2"
                    >
                      📚 What is Sterling Silver?
                    </Link>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800">
                    <strong>Disclaimer:</strong> Prices shown are indicative estimates based on international COMEX rates. 
                    Actual retail prices in Qatar may vary. This is not financial advice. 
                    Always verify with local dealers before purchasing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
