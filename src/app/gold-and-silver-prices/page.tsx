/**
 * Gold and Silver Prices Page
 *
 * Combined precious metals price comparison page - fully optimized for SEO.
 * Target Traffic: 600K-6M/month from India + International
 *
 * Target Keywords:
 * - gold and silver prices today (100K-1M)
 * - current gold and silver prices (100K-1M)
 * - gold silver rate today (100K-1M)
 * - gold silver prices today (100K-1M)
 * - value of gold and silver (10K-100K)
 * - gold and silver rate today (10K-100K)
 * - gold price silver price (10K-100K)
 *
 * ============================================================================
 * PAGE SECTIONS
 * ============================================================================
 * 1. Live Price Cards (Gold + Silver side-by-side with tooltips)
 * 2. International Prices (USD section for global traffic)
 * 3. Gold-Silver Ratio Widget (KEY differentiator)
 * 4. Weight Comparison Table (1g, 10g, 100g, 1kg, 1 tola)
 * 5. Currency Converter (USD/INR/EUR/GBP)
 * 6. Investment Comparison (Gold vs Silver pros/cons)
 * 7. Hindi Section (सोने और चांदी का भाव)
 * 8. FAQ Schema (15+ questions)
 * 9. Share Buttons
 * 10. Related Pages
 */

import { Metadata } from "next";
import Link from "next/link";
import { getCombinedMetalPrices, formatIndianPrice } from "@/lib/metalApi";
import LiveCombinedSection from "@/components/combined/LiveCombinedSection";
import ShareButtons from "@/components/ui/ShareButtons";

// ============================================================================
// DYNAMIC METADATA (SEO OPTIMIZED) - Prices update automatically
// ============================================================================

export async function generateMetadata(): Promise<Metadata> {
  // Fetch real prices for dynamic metadata
  const prices = await getCombinedMetalPrices();
  
  // API returns: { gold: { pricePerGram }, silver: { pricePerGram }, ratio: { ratio } }
  const goldPrice = prices?.gold?.pricePerGram?.toFixed(0) || "7,800";
  const silverPrice = prices?.silver?.pricePerGram?.toFixed(0) || "100";
  const ratio = prices?.ratio?.ratio?.toFixed(0) || "78";
  
  const dateString = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    // SEO Optimized: Primary keyword first, includes modifiers, unique, descriptive
    // Per SEO IMPs: Avoid keyword stuffing, brand at end, concise
    title: `Gold and Silver Prices Today (${dateString}) | Live ₹${goldPrice} & ₹${silverPrice}/g - SilverInfo.in`,
    // SEO Optimized: Includes primary + secondary keywords, compelling details, under 160 chars
    // Per SEO IMPs: Include relevant info (prices, date), human-readable, unique per page
    description: `Live gold and silver prices today in India (${dateString}). Gold ₹${goldPrice}/gram (24K), Silver ₹${silverPrice}/gram (999). Gold-silver ratio ${ratio}x. Updated every 30 seconds from COMEX.`,
    keywords: [
      // Primary keywords (high volume 100K-1M)
      "gold and silver prices today",
      "current gold and silver prices",
      "gold silver rate today",
      "gold silver prices today",
      // Secondary keywords (10K-100K)
      "value of gold and silver",
      "gold and silver rate today",
      "gold price silver price",
      "gold and silver rate",
      // Hindi keywords
      "sone chandi ka bhav",
      "aaj ka sona chandi rate",
      // Ratio & comparison
      "gold silver ratio",
      "gold vs silver investment",
      "precious metals prices india",
      // Long-tail
      "1 kg silver price",
      "10 gram gold price today",
      "gold price per gram india",
      "silver rate per kg",
    ],
    openGraph: {
      title: `Gold and Silver Prices Today (${dateString}) | Live COMEX Rates`,
      description: `Compare live gold (₹${goldPrice}/g) and silver (₹${silverPrice}/g) prices in India. Gold-silver ratio ${ratio}x. Updated every 30 seconds from COMEX.`,
      type: "website",
      locale: "en_IN",
      siteName: "SilverInfo",
      url: "https://silverinfo.in/gold-and-silver-prices",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Gold and Silver Prices Today ${dateString} - Live COMEX Rates Comparison`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@silverinfoin",
      creator: "@silverinfoin",
      title: `Gold & Silver Prices Today India (${dateString}) [LIVE]`,
      description: `Gold ₹${goldPrice}/g • Silver ₹${silverPrice}/g • Ratio ${ratio}x • COMEX Live`,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: "/gold-and-silver-prices",
      languages: {
        "en-IN": "https://silverinfo.in/gold-and-silver-prices",
        "en-US": "https://silverinfo.in/silver-price-usd",
      },
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

// ============================================================================
// PAGE CONFIG
// ============================================================================

export const revalidate = 28800; // ISR: Revalidate every 8 hours (client polling handles freshness, SSR provides initial data)

// ============================================================================
// FAQ DATA (Expanded for better SEO)
// ============================================================================

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is the current gold and silver price today in India?",
    answer:
      "Today's live gold and silver rates are displayed at the top of this page. Prices are updated every 30 seconds based on international COMEX rates and USD/INR exchange rate. Check the live price cards above for exact current rates in INR per gram.",
  },
  {
    question: "How is the gold-silver ratio calculated?",
    answer:
      "The gold-silver ratio is calculated by dividing the gold price by the silver price (both in the same unit). For example, if gold is $2,700/oz and silver is $30/oz, the ratio is 90. This means 90 ounces of silver equals 1 ounce of gold in value. Check the live ratio displayed above.",
  },
  {
    question: "What does the gold-silver ratio indicate for investors?",
    answer:
      "A high ratio (above 80) suggests silver is undervalued relative to gold - potentially a good time to buy silver. A low ratio (below 60) suggests silver is overvalued and gold may offer better value. The historical average is 65-70. During COVID (March 2020), the ratio reached an extreme of 125, after which silver significantly outperformed gold.",
  },
  {
    question: "Should I invest in gold or silver in 2026?",
    answer:
      "Both metals have merits: Gold is more stable (lower volatility) and preferred during uncertainty, offering steady 8-10% annual returns. Silver has higher industrial demand (solar panels, EVs, electronics) and may offer higher returns but with more volatility. The current gold-silver ratio can guide your decision - if above 80, silver may offer better value.",
  },
  {
    question: "Why are gold and silver prices different across cities in India?",
    answer:
      "Prices vary due to: (1) Transportation costs from bullion hubs (Mumbai, Delhi), (2) Local demand-supply dynamics, (3) Making charges (6-15%), and (4) State taxes. Southern cities like Chennai and Kochi typically have slightly higher rates due to higher cultural demand for gold jewelry.",
  },
  {
    question: "How do I convert gold price to silver price?",
    answer:
      "Divide gold price by the gold-silver ratio. For example, if gold is ₹8,000/gram and the ratio is 80, silver should be ₹8,000 ÷ 80 = ₹100/gram. Check the live ratio above to verify if current prices are in a normal range.",
  },
  {
    question: "आज सोने और चांदी का भाव क्या है? (Today's Gold & Silver Rate in Hindi)",
    answer:
      "आज के लाइव सोने और चांदी के भाव इस पेज के ऊपर दिखाए गए हैं। ये रेट हर 30 सेकंड में अपडेट होते हैं और इसमें आयात शुल्क (10%), IGST (3%), और MCX प्रीमियम शामिल है। सटीक रेट के लिए ऊपर देखें।",
  },
  {
    question: "Which is better for long-term investment: gold or silver?",
    answer:
      "Gold is traditionally safer with steady 8-10% annual returns and lower volatility. Silver is more volatile but has historically outperformed gold in bull markets. Many financial advisors suggest a balanced 70% gold + 30% silver allocation for precious metals portfolios.",
  },
  {
    question: "How much gold and silver can I buy for ₹1 lakh?",
    answer:
      "Use the live prices above to calculate. Divide ₹1,00,000 by the current gold rate for grams of gold, or by silver rate for grams of silver. Silver gives you significantly more physical metal, but gold has higher value density which is better for storage.",
  },
  {
    question: "What factors affect both gold and silver prices?",
    answer:
      "Common factors: USD strength (inverse relationship), inflation expectations, central bank policies, and geopolitical tensions. Silver-specific: industrial demand (50% of silver is industrial use). Gold-specific: central bank gold purchases and jewelry demand from India and China.",
  },
  {
    question: "What is the difference between 24K, 22K, and 18K gold?",
    answer:
      "24K gold is 99.9% pure gold (used for investment). 22K gold is 91.6% pure (common for Indian jewelry, mixed with copper/silver for durability). 18K gold is 75% pure (used in western jewelry). For investment, always buy 24K (also called 999 purity).",
  },
  {
    question: "What is 999 silver vs 925 silver?",
    answer:
      "999 silver is 99.9% pure (also called fine silver) - used for investment bullion. 925 silver is 92.5% pure (also called sterling silver) - used for jewelry as it's more durable. The prices shown on this page are for 999 fine silver, the investment-grade standard.",
  },
  {
    question: "How are Indian gold and silver prices calculated from international rates?",
    answer:
      "Indian prices = COMEX USD price × USD/INR exchange rate × (1 + Import Duty 10%) × (1 + GST 3%) × (1 + MCX Premium ~10%). This formula explains why Indian prices are 25-30% higher than international spot prices.",
  },
  {
    question: "What is the best time to buy gold and silver in India?",
    answer:
      "Historically, prices dip during low-demand periods like July-August. Avoid buying during wedding season (October-February) when demand and prices are higher. For investment timing, consider the gold-silver ratio and global economic conditions rather than seasonal factors.",
  },
  {
    question: "Is it better to buy physical gold/silver or ETFs?",
    answer:
      "Physical metal offers tangible ownership but has storage costs and making charges (6-15%). ETFs (like Gold BeES, Silver BeES) offer paper ownership with lower costs and easy trading. For small investments, ETFs are more practical. For large amounts or cultural purposes, physical is preferred.",
  },
];

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function GoldAndSilverPricesPage() {
  // Fetch combined prices on server
  const prices = await getCombinedMetalPrices();

  // Handle API failure
  if (!prices) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-white mb-4">
              Gold and Silver Prices Today
            </h1>
            <div className="p-8 rounded-xl bg-red-500/10 border border-red-500/30 max-w-lg mx-auto">
              <p className="text-red-400 text-lg mb-4">
                ⚠️ Unable to fetch live prices
              </p>
              <p className="text-gray-400 mb-4">
                We&apos;re having trouble connecting to our price sources. Please refresh the page or try again later.
              </p>
              <Link 
                href="/gold-and-silver-prices"
                className="inline-block px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Refresh Page
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Generate schema markup
  const productSchemaGold = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "24K Gold",
    description: "Live 24 Karat pure gold price in India per gram",
    image: "https://silverinfo.in/og-image.png",
    brand: { "@type": "Brand", name: "COMEX Gold" },
    offers: {
      "@type": "Offer",
      price: prices.gold.pricePerGram,
      priceCurrency: "INR",
      priceValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      url: "https://silverinfo.in/gold-and-silver-prices",
    },
  };

  const productSchemaSilver = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "999 Silver",
    description: "Live 999 purity silver price in India per gram",
    image: "https://silverinfo.in/og-image.png",
    brand: { "@type": "Brand", name: "COMEX Silver" },
    offers: {
      "@type": "Offer",
      price: prices.silver.pricePerGram,
      priceCurrency: "INR",
      priceValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      url: "https://silverinfo.in/gold-and-silver-prices",
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
      { "@type": "ListItem", position: 2, name: "Gold & Silver Prices", item: "https://silverinfo.in/gold-and-silver-prices" },
    ],
  };

  // HowTo Schema - Helps with Featured Snippets
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Track Gold and Silver Prices in India",
    description: "Learn how to monitor live gold and silver prices, understand the gold-silver ratio, and make informed investment decisions.",
    image: "https://silverinfo.in/og-image.png",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Check Live Prices",
        text: "View real-time gold and silver prices updated every 30 seconds from COMEX international market data.",
        url: "https://silverinfo.in/gold-and-silver-prices#live-prices"
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Analyze the Gold-Silver Ratio",
        text: "Compare the gold-silver ratio (currently ~48) to historical average (65-70) to identify relative value.",
        url: "https://silverinfo.in/gold-and-silver-prices#ratio-analysis"
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Compare Prices by Weight",
        text: "Use the price table to see rates per gram, 10g, 100g, 1kg, and per tola for accurate quantity planning.",
        url: "https://silverinfo.in/gold-and-silver-prices#price-table"
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Convert to Your Currency",
        text: "Use the currency converter to see prices in USD, EUR, GBP with spot and market price breakdowns.",
        url: "https://silverinfo.in/gold-and-silver-prices#converter"
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Make Investment Decision",
        text: "Based on ratio analysis and price comparison, decide optimal gold-silver allocation (commonly 70-30 split).",
        url: "https://silverinfo.in/gold-and-silver-prices#investment"
      }
    ]
  };

  // ItemList Schema - For price table rich results
  const priceListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Gold and Silver Prices by Weight",
    description: "Live prices for gold and silver in different weight units",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "Gold 1 Gram (24K)",
          offers: { "@type": "Offer", price: prices.gold.pricePerGram, priceCurrency: "INR" }
        }
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Product",
          name: "Gold 10 Grams (24K)",
          offers: { "@type": "Offer", price: prices.gold.pricePer10Gram, priceCurrency: "INR" }
        }
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "Product",
          name: "Silver 1 Gram (999)",
          offers: { "@type": "Offer", price: prices.silver.pricePerGram, priceCurrency: "INR" }
        }
      },
      {
        "@type": "ListItem",
        position: 4,
        item: {
          "@type": "Product",
          name: "Silver 1 Kilogram (999)",
          offers: { "@type": "Offer", price: prices.silver.pricePerKg, priceCurrency: "INR" }
        }
      }
    ]
  };

  // WebPage schema for AI Overviews
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Gold and Silver Prices Today India | Live Rates Comparison",
    description: "Live gold and silver prices today in India with gold-silver ratio analysis and investment comparison. Updated every 30 seconds.",
    url: "https://silverinfo.in/gold-and-silver-prices",
    dateModified: prices.timestamp,
    isPartOf: {
      "@type": "WebSite",
      name: "SilverInfo",
      url: "https://silverinfo.in"
    },
    about: [
      {
        "@type": "Thing",
        name: "Gold",
        description: "A precious metal used for investment and jewelry",
        sameAs: "https://en.wikipedia.org/wiki/Gold"
      },
      {
        "@type": "Thing",
        name: "Silver",
        description: "A precious metal used for investment and industry",
        sameAs: "https://en.wikipedia.org/wiki/Silver"
      }
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".price-display"]
    },
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchemaGold) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchemaSilver) }}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(priceListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "SilverInfo.in",
            url: "https://silverinfo.in",
            logo: "https://silverinfo.in/logo.png",
            description: "India's trusted source for live gold and silver prices with transparent COMEX-based calculations.",
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer service",
              url: "https://silverinfo.in/contact",
            },
          }),
        }}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section - Compact */}
        <section className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            {/* Breadcrumb */}
            <nav className="mb-2">
              <ol className="flex items-center gap-2 text-sm text-gray-500">
                <li>
                  <Link href="/" className="hover:text-[#1e3a5f] transition-colors">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="text-gray-900 font-medium">Gold & Silver Prices</li>
              </ol>
            </nav>

            {/* Header with Date */}
            <div className="text-center mb-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                Gold and Silver Prices Today - {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Live precious metals rates in India • Compare Gold vs Silver • Updated every 30 seconds
              </p>
            </div>

            {/* Status Badges + Tagline - Combined Row */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Live
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                🥇 Gold 24K
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                🥈 Silver 999
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                🇺🇸 COMEX
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full border border-gray-200 text-xs">
                <span className="text-[#1e3a5f] font-medium">✨ Calculated, Not Copied</span>
              </span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-3 sm:py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Live Price Section - Most Important Content */}
            <LiveCombinedSection initialPrices={prices} />

            {/* Jump Links - Matching Home Page Style */}
            <nav className="flex flex-wrap gap-2 my-6 p-3 bg-white rounded-lg border border-gray-200 shadow-sm" aria-label="Jump to section">
              <span className="text-xs text-gray-500 font-medium self-center">Jump to:</span>
              <a href="#live-prices" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-gray-50 rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">🥇🥈 Live Prices</a>
              <a href="#ratio-analysis" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-gray-50 rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">⚖️ Ratio</a>
              <a href="#price-table" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-gray-50 rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">📊 Prices</a>
              <a href="#converter" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-gray-50 rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">💱 Converter</a>
              <a href="#historical-ratio" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-gray-50 rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">📈 History</a>
              <a href="#why-prices-change" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-gray-50 rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">🔄 Factors</a>
              <a href="#key-facts" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-gray-50 rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">📋 Facts</a>
              <a href="#investment" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-gray-50 rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">💰 Investment</a>
              <a href="#hindi" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-gray-50 rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">🇮🇳 हिंदी</a>
              <a href="#faq" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-gray-50 rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">❓ FAQs</a>
            </nav>

            {/* Section: Historical Gold-Silver Ratio - VALUABLE SEO CONTENT */}
            <section id="historical-ratio" className="mb-6 scroll-mt-20">
              <div className="card p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📈</span> Historical Gold-Silver Ratio Data
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  The gold-silver ratio measures how many ounces of silver it takes to buy one ounce of gold. 
                  This metric helps investors identify relative value between the two metals.
                </p>
                
                {/* Historical Data Table */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-2 px-3 text-gray-600 font-medium">Period</th>
                        <th className="text-center py-2 px-3 text-gray-600 font-medium">Ratio</th>
                        <th className="text-left py-2 px-3 text-gray-600 font-medium">Market Context</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-800">January 2026</td>
                        <td className="py-2 px-3 text-center font-bold text-purple-600">~48</td>
                        <td className="py-2 px-3 text-gray-500">Silver rally, record highs</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-800">2024 Average</td>
                        <td className="py-2 px-3 text-center font-bold text-blue-600">85</td>
                        <td className="py-2 px-3 text-gray-500">Normal range, slight gold preference</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-800">March 2020 (COVID)</td>
                        <td className="py-2 px-3 text-center font-bold text-red-600">125</td>
                        <td className="py-2 px-3 text-gray-500">Extreme silver undervaluation</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-800">2011 (Silver Peak)</td>
                        <td className="py-2 px-3 text-center font-bold text-green-600">32</td>
                        <td className="py-2 px-3 text-gray-500">Silver at $50/oz, major rally</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-800">Historical Average</td>
                        <td className="py-2 px-3 text-center font-bold text-gray-700">65-70</td>
                        <td className="py-2 px-3 text-gray-500">Long-term equilibrium range</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-600">📊 What This Means:</span> The current ratio of ~48 
                    is historically low, suggesting silver may be relatively expensive compared to gold. 
                    When the ratio drops below 50, it often indicates a silver bull market.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Why Prices Change + Key Facts - 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Left: Why Prices Change */}
              <section id="why-prices-change" className="card p-4 scroll-mt-20">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🔄 What Affects Prices?
                </h2>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {/* Economic Factors */}
                  <div className="p-2 rounded bg-green-50 border border-green-100">
                    <h3 className="font-bold text-green-700 mb-1 text-xs">💵 Economic</h3>
                    <ul className="space-y-1 text-[10px] text-gray-600">
                      <li>• USD: Inverse relationship</li>
                      <li>• Inflation hedge</li>
                      <li>• Central bank buying</li>
                    </ul>
                  </div>
                  {/* Supply & Demand */}
                  <div className="p-2 rounded bg-amber-50 border border-amber-100">
                    <h3 className="font-bold text-amber-700 mb-1 text-xs">⚡ Supply/Demand</h3>
                    <ul className="space-y-1 text-[10px] text-gray-600">
                      <li>• Industrial: Solar, EVs</li>
                      <li>• Jewelry demand</li>
                      <li>• ETF flows</li>
                    </ul>
                  </div>
                </div>
                {/* India Factors */}
                <div className="p-2 rounded bg-orange-50 border border-orange-100">
                  <h3 className="font-bold text-orange-700 mb-1 text-xs flex items-center gap-1">
                    🇮🇳 India Factors
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-500">Import</p>
                      <p className="font-bold text-gray-800">10%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">GST</p>
                      <p className="font-bold text-gray-800">3%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Premium</p>
                      <p className="font-bold text-gray-800">~10%</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Right: Key Facts */}
              <section id="key-facts" className="card p-4 scroll-mt-20">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  📋 Key Facts: Gold vs Silver
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-yellow-50 border border-yellow-100 text-center">
                    <p className="text-lg mb-0.5">🥇</p>
                    <p className="text-[10px] text-gray-500">Gold Purity</p>
                    <p className="text-sm font-bold text-yellow-700">24K (99.9%)</p>
                  </div>
                  <div className="p-2 rounded bg-gray-50 border border-gray-200 text-center">
                    <p className="text-lg mb-0.5">🥈</p>
                    <p className="text-[10px] text-gray-500">Silver Purity</p>
                    <p className="text-sm font-bold text-gray-700">999 Fine</p>
                  </div>
                  <div className="p-2 rounded bg-blue-50 border border-blue-100 text-center">
                    <p className="text-lg mb-0.5">⚖️</p>
                    <p className="text-[10px] text-gray-500">Troy Ounce</p>
                    <p className="text-sm font-bold text-blue-700">31.1g</p>
                  </div>
                  <div className="p-2 rounded bg-orange-50 border border-orange-100 text-center">
                    <p className="text-lg mb-0.5">🪙</p>
                    <p className="text-[10px] text-gray-500">1 Tola</p>
                    <p className="text-sm font-bold text-orange-700">11.66g</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Section: Investment Comparison - 2 Column */}
            <section id="investment" className="mb-6 scroll-mt-20">
              <div className="card p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  💰 Gold vs Silver: Investment Comparison
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Gold Pros/Cons */}
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                    <h3 className="font-bold text-yellow-700 mb-2 flex items-center gap-1 text-sm">
                      🥇 Why Gold?
                    </h3>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start gap-1.5 text-gray-700">
                        <span className="text-green-600">✓</span>
                        <span>Stable, 8-10% annual returns</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-gray-700">
                        <span className="text-green-600">✓</span>
                        <span>Universal store of value</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-gray-700">
                        <span className="text-green-600">✓</span>
                        <span>Central bank reserve asset</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-gray-500">
                        <span className="text-red-500">✗</span>
                        <span>Higher entry cost</span>
                      </li>
                    </ul>
                  </div>

                  {/* Silver Pros/Cons */}
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-1 text-sm">
                      🥈 Why Silver?
                    </h3>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-start gap-1.5 text-gray-700">
                        <span className="text-green-600">✓</span>
                        <span>Higher growth potential</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-gray-700">
                        <span className="text-green-600">✓</span>
                        <span>Industrial demand (solar, EVs)</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-gray-700">
                        <span className="text-green-600">✓</span>
                        <span>Lower entry point</span>
                      </li>
                      <li className="flex items-start gap-1.5 text-gray-500">
                        <span className="text-red-500">✗</span>
                        <span>More volatile</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Investment Calculator Teaser */}
                <div className="mt-3 p-3 rounded-lg bg-purple-50 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold text-purple-700">Expert Tip:</span> 70% Gold + 30% Silver allocation recommended.
                  </p>
                  <Link
                    href="/investment-calculator"
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs font-medium whitespace-nowrap transition-colors"
                  >
                    Calculator →
                  </Link>
                </div>
              </div>
            </section>

            {/* Hindi + FAQ - 2 Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Left: Hindi Section */}
              <section id="hindi" className="card p-4 bg-gradient-to-br from-orange-50 to-green-50 border-orange-200 scroll-mt-20">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🇮🇳 सोने और चांदी का भाव
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-2 rounded bg-white border border-orange-100">
                    <p className="text-orange-600 font-semibold text-xs">सोना (24K)</p>
                    <p className="text-lg font-bold text-gray-800">{formatIndianPrice(prices.gold.pricePerGram)}</p>
                    <p className="text-[10px] text-gray-500">प्रति ग्राम</p>
                  </div>
                  <div className="p-2 rounded bg-white border border-gray-200">
                    <p className="text-gray-600 font-semibold text-xs">चांदी (999)</p>
                    <p className="text-lg font-bold text-gray-800">{formatIndianPrice(prices.silver.pricePerGram)}</p>
                    <p className="text-[10px] text-gray-500">प्रति ग्राम</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-600">
                  ये भाव हर 30 सेकंड में अपडेट होते हैं। आयात शुल्क (10%), GST (3%), MCX प्रीमियम शामिल है।
                </p>
              </section>

              {/* Right: FAQ Teaser */}
              <section id="faq" className="card p-4 scroll-mt-20">
                <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  ❓ FAQs ({faqItems.length})
                </h2>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {faqItems.slice(0, 5).map((faq, idx) => (
                    <details
                      key={idx}
                      className="group rounded overflow-hidden bg-gray-50 border border-gray-200"
                      {...(idx === 0 ? { open: true } : {})}
                    >
                      <summary className="px-3 py-2 cursor-pointer text-xs font-medium text-gray-800 flex items-center justify-between hover:bg-gray-100">
                        {faq.question.length > 50 ? faq.question.substring(0, 50) + '...' : faq.question}
                        <span className="ml-2 transition-transform group-open:rotate-180 text-gray-400 text-[10px]">
                          ▼
                        </span>
                      </summary>
                      <div className="px-3 pb-2 text-[10px] text-gray-600">{faq.answer.substring(0, 150)}...</div>
                    </details>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-center">
                  + {faqItems.length - 5} more questions below
                </p>
              </section>
            </div>

            {/* Full FAQ Section */}
            <section className="mb-6 scroll-mt-20">
              <div className="card p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  ❓ All Frequently Asked Questions ({faqItems.length})
                </h2>
                <div className="space-y-2">
                  {faqItems.map((faq, idx) => (
                    <details
                      key={idx}
                      className="group rounded-lg overflow-hidden bg-gray-50 border border-gray-200"
                    >
                      <summary className="px-4 py-2.5 cursor-pointer text-sm font-medium text-gray-800 flex items-center justify-between hover:bg-gray-100">
                        {faq.question}
                        <span className="ml-2 transition-transform group-open:rotate-180 text-gray-400">
                          ▼
                        </span>
                      </summary>
                      <div className="px-4 pb-3 text-sm text-gray-600">{faq.answer}</div>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            {/* Share + Related Pages - 2 Column */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Left: Share Section */}
              <section className="card p-4">
                <h2 className="text-sm font-bold text-gray-900 mb-3">📤 Share Prices</h2>
                <p className="text-xs text-gray-600 mb-3">Share with friends & family</p>
                <ShareButtons 
                  url="https://silverinfo.in/gold-and-silver-prices"
                  title={`Gold: ₹${Math.round(prices.gold.pricePerGram)}/g • Silver: ₹${Math.round(prices.silver.pricePerGram)}/g - Live prices on SilverInfo.in`}
                  variant="light"
                  size="compact"
                />
              </section>

              {/* Right: Related Pages */}
              <section id="related" className="card p-4 scroll-mt-20">
                <h2 className="text-sm font-bold text-gray-900 mb-3">🔗 Related Pages</h2>
                <div className="grid grid-cols-4 gap-2">
                  <Link
                    href="/gold"
                    className="p-2 rounded bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 transition-colors text-center"
                  >
                    <span className="text-lg block">🥇</span>
                    <span className="text-[10px] text-yellow-700">Gold</span>
                  </Link>
                  <Link
                    href="/"
                    className="p-2 rounded bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors text-center"
                  >
                    <span className="text-lg block">🥈</span>
                    <span className="text-[10px] text-gray-700">Silver</span>
                  </Link>
                  <Link
                    href="/silver-price-usd"
                    className="p-2 rounded bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors text-center"
                  >
                    <span className="text-lg block">🇺🇸</span>
                    <span className="text-[10px] text-blue-700">USD</span>
                  </Link>
                  <Link
                    href="/silver-price-calculator"
                    className="p-2 rounded bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors text-center"
                  >
                    <span className="text-lg block">🧮</span>
                    <span className="text-[10px] text-purple-700">Calc</span>
                  </Link>
                </div>
              </section>
            </div>

            {/* Footer Note */}
            <footer className="card p-4 text-center">
              <p className="text-xs text-gray-500">
                Prices calculated from COMEX (${prices.gold.pricePerOzUsd}/oz gold, ${prices.silver.pricePerOzUsd}/oz silver) 
                with USD/INR ₹{prices.usdInr}.
                <br />
                Last updated: <time dateTime={new Date(prices.timestamp).toISOString()}>{new Date(prices.timestamp).toLocaleString("en-IN", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}</time>
              </p>
            </footer>
          </div>
        </section>
      </main>
    </>
  );
}
