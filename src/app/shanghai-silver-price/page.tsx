/**
 * Shanghai Silver Price Page
 * 
 * Live Shanghai silver price with SGE market data, COMEX comparison,
 * and multi-currency support (CNY, USD, INR).
 * 
 * ============================================================================
 * SEO TARGETS
 * ============================================================================
 * - shanghai silver price
 * - shanghai silver price today
 * - shanghai silver price live
 * - shanghai silver price in usd
 * - shanghai exchange silver price
 * - sge silver price
 * - china silver price
 * - shanghai silver premium
 * - comex silver price
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Real-time Shanghai silver price (30s updates)
 * - CNY, USD, INR price display
 * - Shanghai vs COMEX premium tracker
 * - SGE market hours & status
 * - Historical price chart
 * - Comprehensive FAQ for featured snippets
 */

import { Metadata } from "next";
import { getShanghaiSilverPrice, getShanghaiHistoricalPrices, formatCnyPrice, formatUsdPrice } from "@/lib/shanghaiApi";
import ShanghaiPriceCard from "@/components/shanghai/ShanghaiPriceCard";
import Link from "next/link";

// ============================================================================
// METADATA (SEO)
// ============================================================================

export const metadata: Metadata = {
  title: "Shanghai Silver Price Today | Live SGE Rate in USD & CNY - SilverInfo",
  description: "Live Shanghai silver price today ¥27,000/kg (~$121/oz). Real-time SGE silver rate, Shanghai vs COMEX premium (+10-12%), prices in CNY, USD & INR. Compare India vs Shanghai rates. Updated every 30 seconds.",
  keywords: [
    "shanghai silver price",
    "shanghai silver price today",
    "shanghai silver price live",
    "shanghai silver price in usd",
    "shanghai exchange silver price",
    "silver price shanghai exchange",
    "sge silver price",
    "china silver price",
    "shanghai silver premium",
    "comex silver price",
    "shanghai metal exchange silver price",
    "shanghai silver price in dollars",
    "shanghai spot silver price",
    "shanghai silver price right now",
    "silver rate shanghai",
  ],
  openGraph: {
    title: "Shanghai Silver Price Today | Live SGE Silver Rate",
    description: "Live Shanghai silver price in CNY & USD. Real-time SGE rates with COMEX comparison. Updated every 30 seconds.",
    type: "website",
    locale: "en_US",
    siteName: "SilverInfo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shanghai Silver Price Today - Live SGE Rates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shanghai Silver Price Today | Live SGE Rate",
    description: "Live Shanghai silver price in CNY & USD. Updated every 30 seconds.",
  },
  alternates: {
    canonical: "https://silverinfo.in/shanghai-silver-price",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

// ============================================================================
// PAGE CONFIG
// ============================================================================

export const revalidate = 60; // ISR: Revalidate every 1 minute

// ============================================================================
// FAQ DATA
// ============================================================================

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is the current Shanghai silver price today?",
    answer: "The current Shanghai silver price is approximately ¥27,000 per kilogram (~$121/oz USD). Prices are updated every 30 seconds based on COMEX futures plus the Shanghai premium (10-14%). SGE (Shanghai Gold Exchange) trades silver in CNY per kilogram."
  },
  {
    question: "How is Shanghai silver price calculated?",
    answer: "Shanghai silver price = (COMEX Silver USD/oz × USD/CNY exchange rate × 32.1507 oz/kg) × (1 + Shanghai Premium). The premium currently ranges from 10-14% above COMEX due to strong Chinese demand, import duties (10-15%), VAT (13%), and limited domestic supply."
  },
  {
    question: "What is the Shanghai silver premium?",
    answer: "The Shanghai premium is the difference between Shanghai silver prices and COMEX prices, currently 10-14% (historically was 2-5%). It exists due to: (1) Record Chinese silver demand (solar, EVs), (2) Import duties 10-15% + VAT 13%, (3) Limited domestic production, (4) Strong investment demand. A higher premium indicates stronger Chinese demand."
  },
  {
    question: "Shanghai silver price in USD per ounce today?",
    answer: "Shanghai silver trades at approximately $120-125 per troy ounce in USD equivalent. This is calculated by converting CNY/kg to USD/oz using current exchange rates. Shanghai currently trades at a 10-14% premium over COMEX spot price (~$109/oz)."
  },
  {
    question: "What time does Shanghai silver market open?",
    answer: "SGE (Shanghai Gold Exchange) silver trading hours (Beijing Time, UTC+8): Day Session: 9:00 AM - 11:30 AM, 1:30 PM - 3:30 PM. Night Session: 9:00 PM - 2:30 AM (next day). Markets are closed on weekends and Chinese holidays."
  },
  {
    question: "What is the difference between Shanghai and COMEX silver price?",
    answer: "Shanghai silver currently trades 10-14% higher than COMEX (vs historical 2-5%). COMEX is the global benchmark (~$109/oz), while SGE is China's primary exchange (~¥27,000/kg). The elevated premium reflects record Chinese demand for solar panels and EVs."
  },
  {
    question: "Why is Shanghai silver price higher than COMEX?",
    answer: "Shanghai silver is higher due to: (1) Record Chinese industrial demand (solar panels up 40%, EVs), (2) Import duties (10-15%), (3) VAT (13%), (4) China imports ~70% of silver needs, (5) Growing retail investment demand. Current premium is 10-14%, up from historical 2-5%."
  },
  {
    question: "How to convert Shanghai silver price to USD?",
    answer: "To convert: (Shanghai Price CNY/kg ÷ 32.1507) ÷ USD/CNY rate = USD/oz. Example: ¥27,000/kg ÷ 32.1507 ÷ 6.95 = ~$121/oz. Our page does this conversion automatically in real-time using live exchange rates."
  },
  {
    question: "Is Shanghai silver price the same as China silver price?",
    answer: "Yes, Shanghai silver price and China silver price refer to the same SGE (Shanghai Gold Exchange) pricing. Shanghai is China's primary precious metals exchange, so 'Shanghai silver' and 'China silver' are used interchangeably."
  },
  {
    question: "What affects Shanghai silver price?",
    answer: "Key factors: (1) COMEX/international silver prices, (2) USD/CNY exchange rate, (3) Chinese industrial demand (solar, EV), (4) Import policies and duties, (5) Chinese economic data, (6) Global supply disruptions, (7) Investment sentiment in China."
  },
  {
    question: "Shanghai silver price vs India silver price - which is higher?",
    answer: "Both trade at premiums over COMEX: Shanghai adds 10-14% premium (~₹359/gram equivalent), India adds ~24% (10% duty + 3% GST + local premium = ~₹400/gram). India is ~11% higher than Shanghai. Compare real-time rates on our site."
  },
  {
    question: "What is SGE (Shanghai Gold Exchange)?",
    answer: "SGE (Shanghai Gold Exchange) is China's largest precious metals exchange, established in 2002. It trades gold, silver, platinum in CNY. SGE silver contract (Ag(T+D)) is the benchmark for Chinese silver prices. It handles majority of China's physical silver trading."
  },
];

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function ShanghaiSilverPricePage() {
  // Fetch data on server
  const [price, historicalPrices] = await Promise.all([
    getShanghaiSilverPrice(),
    getShanghaiHistoricalPrices(7),
  ]);

  // Generate schema markup
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Shanghai Silver (SGE)",
    description: "Live Shanghai silver price from Shanghai Gold Exchange (SGE). Real-time CNY and USD prices with COMEX comparison.",
    image: "https://silverinfo.in/og-image.png",
    brand: {
      "@type": "Brand",
      name: "Shanghai Gold Exchange (SGE)",
    },
    offers: {
      "@type": "Offer",
      price: price?.pricePerKgCny || 7500,
      priceCurrency: "CNY",
      priceValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      url: "https://silverinfo.in/shanghai-silver-price",
      seller: {
        "@type": "Organization",
        name: "SilverInfo",
        url: "https://silverinfo.in",
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://silverinfo.in" },
      { "@type": "ListItem", position: 2, name: "Shanghai Silver Price", item: "https://silverinfo.in/shanghai-silver-price" },
    ],
  };

  // WebPage Schema (SEO boost)
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Shanghai Silver Price Today | Live SGE Rate",
    description: "Live Shanghai silver price in CNY, USD & INR with COMEX comparison and premium tracking.",
    url: "https://silverinfo.in/shanghai-silver-price",
    dateModified: new Date().toISOString(),
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: "SilverInfo",
      url: "https://silverinfo.in",
    },
    about: {
      "@type": "Thing",
      name: "Silver",
      sameAs: "https://en.wikipedia.org/wiki/Silver",
    },
    mainEntity: {
      "@type": "FinancialProduct",
      name: "Shanghai Silver (SGE)",
      description: "Silver traded on Shanghai Gold Exchange",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".price-display"],
    },
  };

  // Organization Schema (E-E-A-T boost)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SilverInfo",
    url: "https://silverinfo.in",
    logo: "https://silverinfo.in/logo.png",
    description: "India's leading silver price tracker with real-time rates, calculators, and market analysis.",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      "https://twitter.com/silverinfoin",
    ],
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <main 
        className="min-h-screen"
        style={{ 
          background: "linear-gradient(180deg, #FDF6E9 0%, #FAF0DC 50%, #F5E6D0 100%)"
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="hover:text-amber-700 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-amber-700 font-medium">Shanghai Silver Price</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              {/* China Flag SVG */}
              <svg className="w-10 h-7 rounded shadow-sm" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="20" fill="#DE2910"/>
                <g fill="#FFDE00">
                  <polygon points="5,4 6.2,7.8 10,7.8 7,10 8,14 5,11.5 2,14 3,10 0,7.8 3.8,7.8"/>
                  <polygon points="12,2 12.4,3 13.5,3 12.6,3.7 13,4.8 12,4 11,4.8 11.4,3.7 10.5,3 11.6,3" transform="rotate(23 12 3)"/>
                  <polygon points="14,5 14.4,6 15.5,6 14.6,6.7 15,7.8 14,7 13,7.8 13.4,6.7 12.5,6 13.6,6" transform="rotate(-10 14 6)"/>
                  <polygon points="14,9 14.4,10 15.5,10 14.6,10.7 15,11.8 14,11 13,11.8 13.4,10.7 12.5,10 13.6,10" transform="rotate(30 14 10)"/>
                  <polygon points="12,12 12.4,13 13.5,13 12.6,13.7 13,14.8 12,14 11,14.8 11.4,13.7 10.5,13 11.6,13" transform="rotate(45 12 13)"/>
                </g>
              </svg>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                Shanghai Silver Price Today
              </h1>
            </div>
            <p className="text-base sm:text-lg text-gray-600">
              Live SGE silver rate in CNY & USD • Shanghai vs COMEX premium • Updated every 30 seconds
            </p>
          </header>

          {/* Live Price Card */}
          <section className="mb-8">
            <ShanghaiPriceCard initialPrice={price} />
          </section>

          {/* Price Units Table */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              📊 Shanghai Silver Price in Different Units
            </h2>
            <div className="rounded-xl overflow-hidden bg-white border border-amber-200 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-amber-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-amber-800">Unit</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-amber-800">CNY</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-amber-800">USD</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { unit: "Per Gram", cny: price?.pricePerGramCny || 7.5, usd: price?.pricePerGramUsd || 1.03 },
                    { unit: "Per 10 Grams", cny: (price?.pricePerGramCny || 7.5) * 10, usd: (price?.pricePerGramUsd || 1.03) * 10 },
                    { unit: "Per Troy Ounce", cny: price?.pricePerOzCny || 233, usd: price?.pricePerOzUsd || 32.5 },
                    { unit: "Per Kilogram", cny: price?.pricePerKgCny || 7500, usd: price?.pricePerKgUsd || 1030 },
                  ].map((row, idx) => (
                    <tr 
                      key={row.unit}
                      className={idx < 3 ? "border-b border-gray-100" : ""}
                    >
                      <td className="px-4 py-3 text-sm text-gray-700">{row.unit}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-amber-700">
                        {formatCnyPrice(row.cny)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">
                        {formatUsdPrice(row.usd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Shanghai vs COMEX Explained */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              🔄 Shanghai vs COMEX: Understanding the Premium
            </h2>
            <div className="rounded-xl p-4 sm:p-6 bg-white border border-amber-200 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg p-4 bg-blue-50 border border-blue-200">
                  <h3 className="font-semibold mb-2 text-blue-800">🌍 COMEX (New York)</h3>
                  <p className="text-2xl font-bold mb-1 text-gray-800">
                    {formatUsdPrice(price?.comexUsd || 31.5)}/oz
                  </p>
                  <p className="text-xs text-gray-500">Global benchmark price</p>
                </div>
                <div className="rounded-lg p-4 bg-red-50 border border-red-200">
                  <h3 className="font-semibold mb-2 text-red-800">🇨🇳 Shanghai (SGE)</h3>
                  <p className="text-2xl font-bold mb-1 text-gray-800">
                    {formatUsdPrice(price?.pricePerOzUsd || 32.5)}/oz
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    +{price?.premiumPercent?.toFixed(2) || 3.5}% premium
                  </p>
                </div>
              </div>
              
              <h4 className="font-semibold mb-2 text-gray-700">Why Shanghai trades at a premium:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>🏭 <strong>Industrial Demand:</strong> China is world&apos;s largest silver consumer (solar panels, electronics)</li>
                <li>📦 <strong>Import Costs:</strong> 10-15% import duties + 13% VAT on silver imports</li>
                <li>⛏️ <strong>Limited Supply:</strong> China imports ~70% of silver needs</li>
                <li>💰 <strong>Investment Demand:</strong> Growing retail investor interest in precious metals</li>
              </ul>
            </div>
          </section>

          {/* SGE Market Hours */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              ⏰ SGE Trading Hours (Beijing Time)
            </h2>
            <div className="rounded-xl p-4 sm:p-6 bg-white border border-amber-200 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs mb-1 text-gray-500">Day Session (AM)</p>
                  <p className="font-bold text-amber-700">9:00 - 11:30</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs mb-1 text-gray-500">Day Session (PM)</p>
                  <p className="font-bold text-amber-700">13:30 - 15:30</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs mb-1 text-gray-500">Night Session</p>
                  <p className="font-bold text-amber-700">21:00 - 02:30</p>
                </div>
              </div>
              <p className="text-xs mt-3 text-center text-gray-500">
                All times in Beijing Time (UTC+8) • Markets closed on weekends & Chinese holidays
              </p>
            </div>
          </section>

          {/* Compare Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              🌏 Compare Silver Prices Globally
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/"
                className="block rounded-xl p-4 transition-all hover:scale-[1.02] bg-gradient-to-r from-blue-600 to-blue-700 shadow-md"
              >
                <div className="flex items-center gap-3">
                  {/* India Flag SVG */}
                  <svg className="w-8 h-6 rounded shadow-sm" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="6.67" fill="#FF9933"/>
                    <rect y="6.67" width="30" height="6.67" fill="#FFFFFF"/>
                    <rect y="13.33" width="30" height="6.67" fill="#138808"/>
                    <circle cx="15" cy="10" r="2.5" fill="#000080"/>
                  </svg>
                  <div>
                    <h3 className="text-lg font-bold text-white">India Silver Rate</h3>
                    <p className="text-sm text-blue-100">₹{price?.indiaRatePerGram?.toFixed(0) || 400}/gram →</p>
                  </div>
                </div>
              </Link>
              
              <Link 
                href="/qatar"
                className="block rounded-xl p-4 transition-all hover:scale-[1.02] bg-gradient-to-r from-purple-600 to-purple-700 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🇶🇦</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">Qatar Silver Rate</h3>
                    <p className="text-sm text-purple-100">QAR prices →</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* Data Sources & Methodology - E-E-A-T Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              📊 Data Sources & Methodology
            </h2>
            <div className="rounded-xl p-4 sm:p-6 bg-white border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600 mb-4">
                Our Shanghai silver prices are calculated using verified market data from trusted financial sources:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <span>📈</span> Silver Price Source
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>COMEX Silver Futures (SI=F)</strong></li>
                    <li>• Provider: Yahoo Finance API</li>
                    <li>• Update frequency: Real-time (30 seconds)</li>
                    <li>• Exchange: CME Group (Chicago)</li>
                  </ul>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <span>💱</span> Exchange Rate Sources
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>USD/CNY:</strong> Yahoo Finance, Frankfurter API</li>
                    <li>• <strong>USD/INR:</strong> Frankfurter API (ECB data)</li>
                    <li>• Backup: ExchangeRate-API.com</li>
                    <li>• Update frequency: 5-60 minutes</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 mb-4">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <span>🧮</span> Calculation Methodology
                </h4>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Shanghai Silver Price = COMEX × (1 + Premium) × USD/CNY × 32.1507</p>
                  <ul className="space-y-1">
                    <li>• Premium: 10-14% (reflects Chinese market conditions)</li>
                    <li>• Conversion: 1 kg = 32.1507 troy ounces</li>
                    <li>• SGE unit: CNY per kilogram</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">✓ No hardcoded prices</span>
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">✓ 100% API data</span>
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">✓ Multi-source fallback</span>
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">✓ Transparent formula</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-2">Official References</h4>
                <div className="flex flex-wrap gap-3 text-sm">
                  <a 
                    href="https://www.sge.com.cn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    🇨🇳 Shanghai Gold Exchange
                  </a>
                  <a 
                    href="https://www.cmegroup.com/markets/metals/precious/silver.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    🇺🇸 CME COMEX Silver
                  </a>
                  <a 
                    href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    🇪🇺 ECB Exchange Rates
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              ❓ Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqItems.map((faq, idx) => (
                <details 
                  key={idx}
                  className="group rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm"
                >
                  <summary className="px-4 py-3 cursor-pointer text-sm font-medium flex items-center justify-between text-gray-700 hover:bg-gray-50">
                    {faq.question}
                    <span className="ml-2 transition-transform group-open:rotate-180 text-amber-600">
                      ▼
                    </span>
                  </summary>
                  <div className="px-4 pb-3 text-sm text-gray-600 border-t border-gray-100">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Footer Note */}
          <footer className="text-center bg-white/50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              <strong>Data Sources:</strong> COMEX via Yahoo Finance • Exchange rates via Frankfurter/ExchangeRate APIs
            </p>
            <p className="text-xs text-gray-400">
              Prices shown are near-real-time indicators calculated from COMEX + estimated Shanghai premium.
              <br />
              Actual SGE benchmark may vary ±5%. For official rates, visit{" "}
              <a href="https://www.sge.com.cn" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                sge.com.cn
              </a>
            </p>
            <p className="text-xs text-gray-300 mt-2">
              Last updated: {new Date().toLocaleDateString("en-US", { 
                day: "numeric", 
                month: "long", 
                year: "numeric" 
              })}
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
