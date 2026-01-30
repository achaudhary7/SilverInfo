/**
 * Silver Price USD Page
 *
 * US/International focused page for silver prices in USD.
 * Target Traffic: 100K-500K/month from US keywords
 *
 * Target Keywords:
 * - silver price usd (10K-100K)
 * - us silver prices (10K-100K)
 * - silver usd (10K-100K)
 * - live silver price (10K-100K)
 * - price of silver per gram (10K-100K)
 * - silver per gram (10K-100K)
 * - comex silver (10K-100K)
 * - silver spot price (10K-100K)
 *
 * ============================================================================
 * PAGE SECTIONS
 * ============================================================================
 * 1. Live USD Price Card (Per Ounce - US standard)
 * 2. Unit Conversion Table (oz, gram, kg)
 * 3. COMEX/Spot Market Info
 * 4. Currency Converter (USD to INR, EUR, GBP)
 * 5. Gold-Silver Ratio (in USD)
 * 6. Live Chart
 * 7. FAQ Schema
 */

import { Metadata } from "next";
import Link from "next/link";
import { getCombinedUSDPrices, formatUSDPrice } from "@/lib/metalApi";
import LiveUSDSection from "@/components/usd/LiveUSDSection";
import ShareButtons from "@/components/ui/ShareButtons";

// ============================================================================
// DYNAMIC METADATA (SEO) - Prices update automatically
// ============================================================================

export async function generateMetadata(): Promise<Metadata> {
  // Fetch real prices for dynamic metadata
  const prices = await getCombinedUSDPrices();
  
  // API returns: { silver: { pricePerOz, pricePerGram }, gold: {...}, goldSilverRatio }
  const pricePerOz = prices?.silver?.pricePerOz?.toFixed(2) || "30.00";
  const pricePerGram = prices?.silver?.pricePerGram?.toFixed(2) || "0.96";
  const ratio = prices?.goldSilverRatio?.toFixed(1) || "80.0";
  
  const dateString = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    // SEO Optimized: Primary keyword "silver spot price" + "per ounce" for 10M volume
    title: `Silver Spot Price Today $${pricePerOz}/oz | Live COMEX (${dateString}) - SilverInfo.in`,
    // SEO Optimized: "silver spot price" + "silver price today per ounce" (10M volume keywords)
    description: `Silver spot price today: $${pricePerOz} per ounce (${dateString}). Live COMEX silver price per ounce & gram ($${pricePerGram}/g). Gold-silver ratio ${ratio}x. Updated every 30 seconds.`,
    keywords: [
      // Primary keywords (10M+ volume - MUST BE FIRST)
      "silver spot price",
      "silver price today per ounce",
      "today silver price",
      "silver price today",
      // Secondary keywords (100K-1M)
      "live silver price",
      "comex silver price",
      "silver price usd",
      // Long-tail keywords
      "silver price per ounce today",
      "silver price per gram usd",
      "current silver price",
      "what is silver trading at",
      "silver price right now",
      // Comparison keywords
      "gold silver ratio",
      "silver vs gold price",
      // Brand alternatives
      "kitco silver price",
      "apmex silver price",
      "jm bullion silver",
      // Intent keywords
      "silver futures price",
      "silver bullion price",
      "buy silver price",
      "silver value today",
    ],
    openGraph: {
      title: `Silver Spot Price Today $${pricePerOz}/oz | Live COMEX`,
      description: `Silver spot price today: $${pricePerOz} per ounce. Real-time COMEX silver price per ounce ($${pricePerOz}), per gram ($${pricePerGram}), ratio ${ratio}x. Updated every 30s.`,
      type: "website",
      locale: "en_US",
      siteName: "SilverInfo",
      url: "https://silverinfo.in/silver-price-usd",
      images: [
        {
          url: "/us-og-image.jpeg",
          width: 1200,
          height: 630,
          alt: `Live Silver Price USD Today ${dateString} - COMEX Spot Price`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Silver Spot Price Today: $${pricePerOz}/oz [LIVE]`,
      description: `Silver price today per ounce: $${pricePerOz}. COMEX spot price updated every 30s. Per gram: $${pricePerGram}. Ratio: ${ratio}x.`,
    },
    alternates: {
      canonical: "/silver-price-usd",
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
    question: "What is the silver spot price today?",
    answer:
      "The current silver spot price is shown live above, sourced from COMEX futures. The spot price represents the price for immediate delivery of silver and updates every 30 seconds during market hours.",
  },
  {
    question: "What is the silver price today per ounce?",
    answer:
      "Today's silver price per ounce is displayed in the live price card above. COMEX silver is quoted in US dollars per troy ounce (31.1035 grams). Check the card for the exact current rate updated in real-time.",
  },
  {
    question: "How is the silver spot price determined?",
    answer:
      "The silver spot price is determined by trading on commodity exchanges like COMEX (New York) and LBMA (London). It reflects the price for immediate delivery of 1 troy ounce of .999 fine silver.",
  },
  {
    question: "What is the difference between spot price and futures price?",
    answer:
      "Spot price is for immediate delivery, while futures price is for delivery at a future date. Futures typically trade at a small premium (contango) or discount (backwardation) to spot depending on market conditions.",
  },
  {
    question: "How much is silver per gram in USD?",
    answer:
      "Silver price per gram = spot price per troy ounce ÷ 31.1035. Check our live price table above for the current per-gram rate in USD. The calculation updates automatically with market prices.",
  },
  {
    question: "What is the gold-silver ratio and why does it matter?",
    answer:
      "The gold-silver ratio shows how many ounces of silver equal one ounce of gold in value. Check the live ratio displayed above. A ratio above 80 suggests silver may be undervalued relative to gold. The historical average is 65-70.",
  },
  {
    question: "What are COMEX silver trading hours?",
    answer:
      "COMEX silver futures trade nearly 24 hours: Sunday 6:00 PM to Friday 5:00 PM ET, with a 60-minute break each day. The most active trading is during US market hours (8:00 AM - 1:30 PM ET).",
  },
  {
    question: "How does silver price in the US compare to India?",
    answer:
      "Silver in India costs approximately 12-15% more than the US spot price due to import duties (6% as of July 2024), IGST (3%), and local market premiums (3%). Check the US vs India comparison section above for current rates.",
  },
  {
    question: "What factors affect silver prices in USD?",
    answer:
      "Key factors: USD strength (inverse relationship), industrial demand (solar panels, electronics), investment demand (ETFs, coins), inflation expectations, interest rates, and geopolitical events.",
  },
  {
    question: "Is silver a good investment in 2026?",
    answer:
      "Silver offers both industrial utility and investment appeal. With growing demand from solar energy and EVs, plus its historical role as a hedge against inflation, many analysts see potential. However, it's volatile - suitable for diversified portfolios.",
  },
  {
    question: "How can I buy silver at spot price?",
    answer:
      "Physical silver (coins, bars) always includes a premium over spot (typically 5-15%). To get closest to spot: buy larger bars (lower premium), trade silver ETFs (SLV, SIVR), or trade COMEX futures directly.",
  },
];

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function SilverPriceUSDPage() {
  // Fetch USD prices on server
  const prices = await getCombinedUSDPrices();

  // Handle API failure
  if (!prices) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-black">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-white mb-4">
              Silver Price USD
            </h1>
            <div className="p-8 rounded-xl bg-red-500/10 border border-red-500/30 max-w-lg mx-auto">
              <p className="text-red-400 text-lg mb-4">
                ⚠️ Unable to fetch live prices
              </p>
              <p className="text-gray-400 mb-4">
                We&apos;re having trouble connecting to our price sources. Please refresh the page or try again later.
              </p>
              <Link 
                href="/silver-price-usd"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Silver Spot Price (XAG)",
    description: "Silver spot price today - live COMEX silver price per ounce in US dollars",
    image: "https://silverinfo.in/us-og-image.jpeg",
    brand: { "@type": "Brand", name: "COMEX Silver" },
    offers: {
      "@type": "Offer",
      price: prices.silver.pricePerOz,
      priceCurrency: "USD",
      priceValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      url: "https://silverinfo.in/silver-price-usd",
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
      { "@type": "ListItem", position: 2, name: "Silver Spot Price", item: "https://silverinfo.in/silver-price-usd" },
    ],
  };

  // WebPage schema for richer context
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Silver Spot Price Today | Live Silver Price per Ounce",
    description: "Silver spot price today - live COMEX silver price per ounce & gram. Gold-silver ratio, currency converter, 30-sec updates.",
    url: "https://silverinfo.in/silver-price-usd",
    dateModified: prices.timestamp,
    isPartOf: {
      "@type": "WebSite",
      name: "SilverInfo",
      url: "https://silverinfo.in"
    },
    about: {
      "@type": "Thing",
      name: "Silver",
      description: "A precious metal traded on commodity exchanges",
      sameAs: "https://en.wikipedia.org/wiki/Silver"
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".price-display"]
    },
    mainEntity: productSchema
  };

  // Organization schema for E-E-A-T (Expertise, Experience, Authoritativeness, Trust)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SilverInfo",
    url: "https://silverinfo.in",
    logo: "https://silverinfo.in/logo.png",
    description: "Real-time silver and gold price tracking with transparent calculations from COMEX futures data.",
    sameAs: [
      "https://twitter.com/silverinfoin"
    ]
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

      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-black">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
          {/* Breadcrumb */}
          <nav className="mb-3">
            <ol className="flex items-center gap-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-white">Silver Spot Price</li>
            </ol>
          </nav>

          {/* Hero Section - Compact to keep price visible */}
          <header className="mb-4 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Silver Spot Price Today - {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h1>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mb-2">
              Live COMEX silver price today per ounce • Updated every 30 seconds • Also in grams & kilograms
            </p>
            {/* Catchy Tagline - Compact inline */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 border border-blue-500/20 text-xs sm:text-sm">
              <span className="text-blue-400 font-medium">✨ Calculated, Not Copied</span>
              <span className="text-gray-500 hidden sm:inline">•</span>
              <span className="text-gray-400 hidden sm:inline">Direct from COMEX futures</span>
            </div>
          </header>

          {/* Live Price Section FIRST - Most Important Content Above Fold */}
          <div id="live-price">
            <LiveUSDSection initialPrices={prices} />
          </div>

          {/* Jump To Navigation - AFTER main content so price is visible first */}
          <nav className="mb-8 sticky top-0 z-40 -mx-4 px-4 py-3 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 md:relative md:mx-0 md:px-0 md:py-0 md:bg-transparent md:backdrop-blur-none md:border-0" aria-label="Page sections">
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">⬇ Jump to Section</p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <a 
                  href="#price-table" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/20 text-slate-300 text-xs whitespace-nowrap transition-colors"
                >
                  <span>📊</span> Price Table
                </a>
                <a 
                  href="#converter" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 text-xs whitespace-nowrap transition-colors"
                >
                  <span>💱</span> Converter
                </a>
                <a 
                  href="#comex-market" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs whitespace-nowrap transition-colors"
                >
                  <span>🏛️</span> COMEX
                </a>
                <a 
                  href="#gold-vs-silver" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-400 text-xs whitespace-nowrap transition-colors"
                >
                  <span>⚖️</span> Gold vs Silver
                </a>
                <a 
                  href="#us-vs-india" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-400 text-xs whitespace-nowrap transition-colors"
                >
                  <span>🌍</span> US vs India
                </a>
                <a 
                  href="#faq" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 text-xs whitespace-nowrap transition-colors"
                >
                  <span>❓</span> FAQs
                </a>
                <a 
                  href="#related" 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-400 text-xs whitespace-nowrap transition-colors"
                >
                  <span>🔗</span> Related
                </a>
              </div>
            </div>
          </nav>

          {/* Section 4: COMEX Market Info */}
          <section id="comex-market" className="mb-8 scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🏛️</span> COMEX Silver Market
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-xs text-gray-400 mb-1">Spot Price</p>
                <p className="text-xl font-bold text-blue-400">{formatUSDPrice(prices.silver.pricePerOz)}</p>
                <p className="text-xs text-gray-500">per troy oz</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-xs text-gray-400 mb-1">Gold/Silver Ratio</p>
                <p className="text-xl font-bold text-amber-400">{prices.goldSilverRatio.toFixed(1)}</p>
                <p className="text-xs text-gray-500">oz silver per oz gold</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-xs text-gray-400 mb-1">Gold Price</p>
                <p className="text-xl font-bold text-yellow-400">{formatUSDPrice(prices.gold.pricePerOz)}</p>
                <p className="text-xs text-gray-500">per troy oz</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <p className="text-xs text-gray-400 mb-1">Market Status</p>
                <p className="text-xl font-bold text-emerald-400">Open</p>
                <p className="text-xs text-gray-500">COMEX trading</p>
              </div>
            </div>
            {/* External Authority Links for E-E-A-T */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs">
              <a 
                href="https://www.cmegroup.com/markets/metals/precious/silver.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                CME Group (COMEX)
              </a>
              <span className="text-gray-600">•</span>
              <a 
                href="https://www.lbma.org.uk/prices-and-data/precious-metal-prices" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                LBMA Silver Price
              </a>
              <span className="text-gray-600">•</span>
              <a 
                href="https://en.wikipedia.org/wiki/Silver_as_an_investment" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Wikipedia: Silver Investment
              </a>
            </div>
          </section>

          {/* Section 5: Gold vs Silver Comparison */}
          <section id="gold-vs-silver" className="mb-8 scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>⚖️</span> Gold vs Silver (USD)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Gold Card */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/5 rounded-xl p-5 border border-yellow-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🥇</span>
                  <div>
                    <h3 className="font-bold text-yellow-400">Gold (XAU)</h3>
                    <p className="text-xs text-yellow-400/60">COMEX Spot</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {formatUSDPrice(prices.gold.pricePerOz)}<span className="text-sm font-normal">/oz</span>
                </div>
                <div className="text-sm text-gray-400">
                  Per gram: {formatUSDPrice(prices.gold.pricePerGram)}
                </div>
              </div>

              {/* Silver Card */}
              <div className="bg-gradient-to-br from-slate-500/10 to-slate-600/5 rounded-xl p-5 border border-slate-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🥈</span>
                  <div>
                    <h3 className="font-bold text-slate-300">Silver (XAG)</h3>
                    <p className="text-xs text-slate-400">COMEX Spot</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-200 mb-2">
                  {formatUSDPrice(prices.silver.pricePerOz)}<span className="text-sm font-normal">/oz</span>
                </div>
                <div className="text-sm text-gray-400">
                  Per gram: {formatUSDPrice(prices.silver.pricePerGram, 3)}
                </div>
              </div>
            </div>

            {/* Ratio Insight */}
            <div className="mt-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-blue-400">Gold-Silver Ratio: {prices.goldSilverRatio.toFixed(1)}</span>
                {" "}— {prices.goldSilverRatio > 80 
                  ? "Silver appears undervalued relative to gold. Historically, ratios above 80 have preceded silver outperformance." 
                  : prices.goldSilverRatio < 60 
                    ? "Silver appears overvalued relative to gold. Consider gold for better value."
                    : "Ratio is in the normal historical range (60-80). Both metals fairly valued."}
              </p>
            </div>
          </section>

          {/* Section 6: US vs India Price Comparison */}
          <section id="us-vs-india" className="mb-8 scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🌍</span> US vs India Silver Price
            </h2>
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span>🇺🇸</span>
                    <span className="text-sm font-medium text-gray-300">United States</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400">{formatUSDPrice(prices.silver.pricePerGram, 3)}/gram</p>
                  <p className="text-sm text-gray-500">COMEX spot price</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span>🇮🇳</span>
                    <span className="text-sm font-medium text-gray-300">India</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-400">₹{prices.silver.pricePerGramInr.toFixed(2)}/gram</p>
                  <p className="text-sm text-gray-500">Includes import duty + GST</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-600">
                <p className="text-sm text-gray-400">
                  <span className="text-white font-medium">Why the difference?</span> Indian silver prices include 6% import duty (July 2024 Budget), 3% IGST, and ~3% local market premium. 
                  Current exchange rate: $1 = ₹{prices.silver.usdInr}
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: FAQs */}
          <section id="faq" className="mb-8 scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>❓</span> Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqItems.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700"
                >
                  <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-200 flex items-center justify-between hover:bg-slate-700/30">
                    {faq.question}
                    <span className="ml-2 transition-transform group-open:rotate-180 text-gray-500">
                      ▼
                    </span>
                  </summary>
                  <div className="px-4 pb-3 text-sm text-gray-400">{faq.answer}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Cross-links */}
          <section id="related" className="mb-8 scroll-mt-20">
            <h2 className="text-xl font-bold text-white mb-4">Related Pages</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link
                href="/"
                className="bg-slate-500/10 hover:bg-slate-500/20 rounded-lg p-4 border border-slate-500/20 transition-colors text-center"
              >
                <span className="text-2xl mb-2 block">🇮🇳</span>
                <span className="text-sm text-slate-300">Silver Price India</span>
              </Link>
              <Link
                href="/gold-and-silver-prices"
                className="bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/20 transition-colors text-center"
              >
                <span className="text-2xl mb-2 block">🥇🥈</span>
                <span className="text-sm text-yellow-400">Gold & Silver</span>
              </Link>
              <Link
                href="/silver-price-calculator"
                className="bg-blue-500/10 hover:bg-blue-500/20 rounded-lg p-4 border border-blue-500/20 transition-colors text-center"
              >
                <span className="text-2xl mb-2 block">🧮</span>
                <span className="text-sm text-blue-400">Price Calculator</span>
              </Link>
              <Link
                href="/investment-calculator"
                className="bg-green-500/10 hover:bg-green-500/20 rounded-lg p-4 border border-green-500/20 transition-colors text-center"
              >
                <span className="text-2xl mb-2 block">📈</span>
                <span className="text-sm text-green-400">Investment Calculator</span>
              </Link>
            </div>
          </section>

          {/* Share Buttons */}
          <section className="mb-8">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 text-center">
              <p className="text-gray-400 mb-3">Share live silver prices with friends & family</p>
              <ShareButtons 
                url="https://silverinfo.in/silver-price-usd"
                title={`Silver Spot Price: ${formatUSDPrice(prices.silver.pricePerOz)}/oz - Live COMEX prices on SilverInfo.in`}
              />
            </div>
          </section>

          {/* Footer Note */}
          <footer className="text-center pt-6 border-t border-slate-800">
            <p className="text-xs text-gray-500">
              Prices sourced from COMEX (New York Mercantile Exchange). Spot price for immediate delivery.
              <br />
              Last updated: <time dateTime={new Date(prices.timestamp).toISOString()}>{new Date(prices.timestamp).toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
                timeZone: "America/New_York",
              })} ET</time>
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
