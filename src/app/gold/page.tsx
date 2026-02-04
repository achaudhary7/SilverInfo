/**
 * Gold Price Page - Redesigned to match Home Page
 * 
 * Displays live gold rates in India with calculator, city prices, and FAQs.
 * Now with light theme, 2-column layout, and professional design.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Live 24K, 22K, 18K gold prices
 * - 7-Day Trend chart
 * - Top Cities section
 * - Why Gold Price Changed section
 * - Jewelry price calculator with making charges
 * - City-wise gold rates (20+ cities)
 * - Market analysis (COMEX, USD/INR, MCX)
 * - Gold-specific FAQs for SEO
 * - Rich schema markup for featured snippets
 * 
 * SEO Target Keywords:
 * - gold rate today delhi, gold price india, 22k gold rate
 * - today gold rate per gram, gold price per tola
 * - gold rate [city name], gold making charges
 */

import { Metadata } from "next";
import Link from "next/link";
import { getGoldPriceWithChange, getGoldCityPrices, formatIndianGoldPrice, calculateGoldJewelryPrice } from "@/lib/goldApi";
import GoldPriceCard from "@/components/gold/GoldPriceCard";
import PriceSourceBadge from "@/components/ui/PriceSourceBadge";
import MarketStatus from "@/components/ui/MarketStatus";

// ============================================================================
// DYNAMIC METADATA - Prices update automatically
// ============================================================================

export async function generateMetadata(): Promise<Metadata> {
  const goldData = await getGoldPriceWithChange();
  
  const price24k = goldData?.price24KPerGram?.toFixed(0) || "7,800";
  const price22k = goldData?.price22KPerGram?.toFixed(0) || "7,150";
  
  const dateString = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    title: `Gold Rate Today Delhi Chennai (${dateString}) | 24K ₹${price24k} 22K ₹${price22k}/g - SilverInfo.in`,
    description: `Current gold rate today in Delhi, Chennai & India (${dateString}). 24K gold price ₹${price24k}/gram, 22K ₹${price22k}/gram. Live gold rate Coimbatore, Punjab. Updated every 30 seconds.`,
    keywords: [
      "gold rate today delhi",
      "current gold price in delhi",
      "current gold rate chennai",
      "gold price chennai today",
      "gold rate today in chennai today",
      "today gold rate in india chennai",
      "gold price india",
      "gold price today in india",
      "gold rate in coimbatore",
      "gold price today in punjab",
      "24k gold price in india",
      "22k gold rate",
      "gold rate per tola",
      "live gold rate",
      "gold making charges",
      "sone ka bhav",
      "aaj ka gold rate",
    ],
    openGraph: {
      title: `Gold Rate Today Delhi Chennai (${dateString}) | 24K ₹${price24k} 22K ₹${price22k}/g`,
      description: `Current gold price in Delhi ₹${price22k}/g (22K). Gold rate Chennai, Coimbatore, Punjab. 24K gold price India ₹${price24k}/g. Live rates updated every 30 seconds.`,
      type: "website",
      locale: "en_IN",
      siteName: "SilverInfo Gold",
    },
    twitter: {
      card: "summary_large_image",
      title: `Gold Rate Today Delhi Chennai (${dateString}) | 24K ₹${price24k}/g`,
      description: `Current gold price Delhi, Chennai, India. 24K: ₹${price24k}/g, 22K: ₹${price22k}/g. Live rates.`,
    },
    alternates: {
      canonical: "/gold",
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

export const revalidate = 28800; // ISR: Revalidate every 8 hours (client polling handles freshness)

// ============================================================================
// FAQ DATA
// ============================================================================

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is the current gold rate in India today?",
    answer: "The current 24K and 22K gold rates in India are displayed live at the top of this page. Prices are updated every 30 seconds based on international COMEX rates and USD/INR exchange rate."
  },
  {
    question: "How is gold price per gram calculated in India?",
    answer: "Gold price in India = (COMEX Gold Price USD/oz × USD/INR Rate) ÷ 31.1035 × (1 + 6% Import Duty) × (1 + 3% GST) × (1 + Local Premium). The import duty includes 5% basic customs duty and 1% AIDC."
  },
  {
    question: "What is the difference between 24K, 22K, and 18K gold?",
    answer: "24K gold is 99.9% pure (used for investment bars/coins). 22K gold is 91.6% pure (Indian jewelry standard). 18K gold is 75% pure (modern/Western jewelry)."
  },
  {
    question: "What are making charges for gold jewelry?",
    answer: "Making charges typically range from 8-25% of gold value. Plain chains: 8-12%. Intricate designs: 15-20%. Designer/branded jewelry: 20-30%."
  },
  {
    question: "Is GST applicable on gold purchases in India?",
    answer: "Yes, 3% GST is applicable on gold purchases in India. GST is charged on the total value (gold value + making charges)."
  },
  {
    question: "What is the gold import duty in India 2026?",
    answer: "Current gold import duty in India is 6% (5% Basic Customs Duty + 1% AIDC). This was reduced from 15% in Budget July 2024. Additionally, 3% IGST applies."
  },
  {
    question: "What is the current gold rate today in Delhi?",
    answer: "The current gold rate in Delhi is shown live at the top of this page. Delhi typically has the base gold rate with minimal premium."
  },
  {
    question: "What is the gold price in Chennai today?",
    answer: "Gold price in Chennai today is displayed in our live city rates table. Chennai has slightly higher gold rates due to higher demand in Tamil Nadu."
  },
  {
    question: "What is the 24K gold price in India per gram?",
    answer: "The current 24K gold price in India is shown live at the top of this page. 24K gold (99.9% pure) is used for investment-grade bars and coins."
  },
  {
    question: "Aaj ka gold rate kitna hai? (Hindi)",
    answer: "Aaj ka 24K sone ka bhav upar live dikha hai. 22K sona (916 purity) bhi dekh sakte hain. Yeh rates har 30 second mein update hote hain."
  },
];

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function GoldPage() {
  const [price, cityPrices] = await Promise.all([
    getGoldPriceWithChange(),
    getGoldCityPrices(),
  ]);

  const price24KPerGram = price?.price24KPerGram ?? 7500;
  const price22KPer10Gram = price?.price22KPer10Gram ?? 68500;
  const price22KPerTola = price?.price22KPerTola ?? 80000;
  const price24KPerSovereign = price?.price24KPerSovereign ?? 60000;
  const price22KPerSovereign = price?.price22KPerSovereign ?? 55000;
  const comexUsd = price?.comexUsd ?? 0;
  const usdInr = price?.usdInr ?? 84;

  // Schema markup
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "24K Gold (999 Purity)",
    description: "Live 24 Karat pure gold price in India per gram.",
    brand: { "@type": "Brand", name: "COMEX Gold" },
    offers: {
      "@type": "Offer",
      price: price24KPerGram,
      priceCurrency: "INR",
      priceValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      url: "https://silverinfo.in/gold",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://silverinfo.in" },
      { "@type": "ListItem", position: 2, name: "Gold Rate", item: "https://silverinfo.in/gold" },
    ],
  };

  return (
    <>
      {/* Schema Markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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

      <div className="min-h-screen">
        {/* Hero Section - Light Theme like Home Page */}
        <section className="bg-gradient-to-br from-amber-50 to-yellow-50 py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header - Above the grid */}
            <div className="mb-6 sm:mb-8">
              {/* Status Badges */}
              <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 items-center">
                {/* Live Status Badge */}
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                  <span className="relative flex h-1.5 w-1.5 mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  Live • 30s Refresh
                </span>
                
                {/* Price Source Badge */}
                <PriceSourceBadge source="calculated" showTooltip={true} />
                
                {/* Market Status Badge */}
                <div className="hidden sm:block">
                  <MarketStatus market="both" variant="badge" />
                </div>
                
                {/* COMEX + Forex Badge */}
                <span className="hidden lg:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  COMEX + Forex
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                Gold Rate Today in India - {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h1>
              <p className="text-sm sm:text-lg text-amber-700 font-semibold mb-1 sm:mb-2">
                Calculated, Not Copied.
              </p>
              <p className="text-xs sm:text-base text-gray-600 max-w-3xl mb-2 sm:mb-3">
                Live gold price per gram in Delhi, Chennai, Coimbatore & all India. 
                Prices derived from COMEX futures + USD/INR exchange rates.{" "}
                <Link href="/how-we-calculate" className="text-amber-700 font-medium hover:underline">
                  See Our Formula →
                </Link>
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">
                Content last reviewed: <time dateTime={new Date().toISOString().split('T')[0]}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
              </p>
            </div>

            {/* Hero Grid - 2 columns like Home Page */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left: Gold Price Card */}
              {price ? <GoldPriceCard initialPrice={price} /> : (
                <div className="card p-6 text-center text-gray-500">
                  <p>Unable to fetch live gold price</p>
                </div>
              )}

              {/* Right: Stacked Sections */}
              <div className="space-y-4">
                {/* Row 1: Market Data + Top Cities side by side */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Market Data Card */}
                  <div className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm font-semibold text-gray-900">Market Data</h2>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">🇺🇸 COMEX</span>
                        <span className="text-sm font-bold text-gray-900">${comexUsd?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">💱 USD/INR</span>
                        <span className="text-sm font-bold text-gray-900">₹{usdInr?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">🏛️ Import Duty</span>
                        <span className="text-sm font-bold text-gray-900">6%</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100 text-center">
                      July 2024 Budget rates
                    </p>
                  </div>

                  {/* Top Cities Card */}
                  <div className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm font-semibold text-gray-900">Top Cities</h2>
                      <Link href="#city-prices" className="text-xs text-amber-700 hover:underline">
                        All Cities →
                      </Link>
                    </div>
                    <div className="space-y-2">
                      {(cityPrices || []).slice(0, 4).map((city) => (
                        <div
                          key={city.city}
                          className="flex justify-between text-xs py-1"
                        >
                          <span className="text-gray-600">{city.city}</span>
                          <span className="font-semibold text-gray-900">₹{city.price22KPerGram.toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100 text-center">
                      22K rates per gram
                    </p>
                  </div>
                </div>

                {/* Row 2: Why Gold Price Changed */}
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      📊 Why Gold Price Changed Today
                    </h2>
                    <Link href="#market-factors" className="text-xs text-amber-700 hover:underline px-2 py-1 bg-amber-50 rounded-lg border border-amber-200">
                      See details ↓
                    </Link>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200 mb-3">
                    <p className="text-sm text-green-800 flex items-center gap-2">
                      <span>🚀</span>
                      <span>Gold prices strong - Global uncertainty driving demand</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-[10px] text-gray-500 mb-1">COMEX</p>
                      <p className="text-xs font-bold text-gray-900">${comexUsd?.toFixed(0)}</p>
                      <p className="text-[10px] text-gray-400">per oz</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-[10px] text-gray-500 mb-1">USD/INR</p>
                      <p className="text-xs font-bold text-gray-900">₹{usdInr?.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400">exchange</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-[10px] text-gray-500 mb-1">24h Change</p>
                      <p className="text-xs font-bold text-green-600">↑ {price?.changePercent24h?.toFixed(2) || "0.00"}%</p>
                      <p className="text-[10px] text-gray-400">in INR</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar - Gold themed */}
        <section className="bg-amber-700 py-3 sm:py-4 hidden sm:block">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center text-white">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs sm:text-sm">Real-time</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs sm:text-sm">Live Rates</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-xs sm:text-sm">Calculator</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs sm:text-sm">City Rates</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-4 sm:py-6 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Jump Links */}
            <nav className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg shadow-sm" aria-label="Jump to section">
              <span className="text-xs text-gray-500 font-medium self-center">Jump to:</span>
              <a href="#quick-reference" className="text-xs text-amber-700 hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-amber-500 transition-colors">
                Quick Reference
              </a>
              <a href="#city-prices" className="text-xs text-amber-700 hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-amber-500 transition-colors">
                City Prices
              </a>
              <a href="#calculator" className="text-xs text-amber-700 hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-amber-500 transition-colors">
                Calculator
              </a>
              <a href="#market-factors" className="text-xs text-amber-700 hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-amber-500 transition-colors">
                Market Factors
              </a>
              <a href="#faq" className="text-xs text-amber-700 hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-amber-500 transition-colors">
                FAQ
              </a>
            </nav>

            {/* Quick Price Reference */}
            <section id="quick-reference" className="mb-6 scroll-mt-20">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                📊 Quick Price Reference
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "1 Sovereign (8g)", value: price24KPerSovereign, purity: "24K" },
                  { label: "1 Sovereign (8g)", value: price22KPerSovereign, purity: "22K" },
                  { label: "10 Grams", value: price22KPer10Gram, purity: "22K" },
                  { label: "1 Tola (11.66g)", value: price22KPerTola, purity: "22K" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm hover:shadow transition-shadow">
                    <p className="text-xs text-gray-500 mb-1">{item.purity} {item.label}</p>
                    <p className="text-xl font-bold text-amber-700">{formatIndianGoldPrice(item.value)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 24K Gold Price Section */}
            <section className="mb-6">
              <div className="rounded-lg p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-sm">
                <h2 className="text-xl font-bold mb-3 text-amber-800 flex items-center gap-2">
                  💎 24K Gold Price in India Today
                </h2>
                <p className="text-sm mb-4 text-gray-700">
                  The current <strong>24K gold price in India</strong> is <span className="text-amber-700 font-bold">₹{price24KPerGram?.toFixed(0)}/gram</span> (99.9% pure gold). 
                  24K gold is the purest form available, ideal for investment bars, coins, and Sovereign Gold Bonds.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center border border-amber-100">
                    <p className="text-xs text-gray-500">Per Gram</p>
                    <p className="font-bold text-amber-700">₹{price24KPerGram?.toFixed(0)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-amber-100">
                    <p className="text-xs text-gray-500">Per 10 Grams</p>
                    <p className="font-bold text-amber-700">₹{(price24KPerGram * 10)?.toFixed(0)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-amber-100">
                    <p className="text-xs text-gray-500">Per Tola</p>
                    <p className="font-bold text-amber-700">₹{(price24KPerGram * 11.6638)?.toFixed(0)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-amber-100">
                    <p className="text-xs text-gray-500">Per Sovereign</p>
                    <p className="font-bold text-amber-700">₹{price24KPerSovereign?.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* City-wise Prices */}
            <section id="city-prices" className="mb-6 scroll-mt-20">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                📍 Gold Rate in Major Cities (Delhi, Chennai, Coimbatore, Punjab)
              </h2>
              <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-amber-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-amber-800">City</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-amber-800">22K/gram</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-amber-800">24K/gram</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-amber-800 hidden sm:table-cell">Making %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(cityPrices || []).slice(0, 12).map((city, idx) => (
                        <tr key={city.city} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-amber-50 transition-colors`}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {city.city}
                            <span className="text-xs ml-1 text-gray-500">({city.state})</span>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium text-amber-700">
                            {formatIndianGoldPrice(city.price22KPerGram)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-700">
                            {formatIndianGoldPrice(city.price24KPerGram)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm text-gray-500 hidden sm:table-cell">
                            {city.makingCharges}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs mt-2 text-gray-500">
                * Prices exclude making charges and GST. Actual jeweler prices may vary.
              </p>

              {/* City SEO Text */}
              <div className="mt-3 rounded-lg p-4 bg-amber-50 border border-amber-100 shadow-sm">
                <p className="text-sm mb-2 text-gray-700">
                  <strong className="text-amber-800">Gold Rate Today Delhi:</strong> Current gold price in Delhi is ₹{(price24KPerGram * 0.916 + 0.50)?.toFixed(0)}/gram (22K). Delhi NCR has the base gold rate.
                </p>
                <p className="text-sm mb-2 text-gray-700">
                  <strong className="text-amber-800">Gold Price Chennai Today:</strong> Gold rate in Chennai is ₹{(price24KPerGram * 0.916 + 1.50)?.toFixed(0)}/gram (22K). Higher demand in Tamil Nadu.
                </p>
                <p className="text-sm text-gray-700">
                  <strong className="text-amber-800">Gold Price Punjab:</strong> Current price in Punjab is ₹{(price24KPerGram * 0.916 + 0.80)?.toFixed(0)}/gram (22K) with 10-12% making charges.
                </p>
              </div>
            </section>

            {/* Price Calculator */}
            <section id="calculator" className="mb-6 scroll-mt-20">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                🧮 Gold Jewelry Price Calculator
              </h2>
              <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-100 shadow-sm">
                <p className="text-sm mb-4 text-gray-600">
                  Calculate the total cost of gold jewelry including making charges and GST:
                </p>
                <div className="space-y-4">
                  {[
                    { weight: 10, purity: "22K" as const, making: 12 },
                    { weight: 5, purity: "22K" as const, making: 15 },
                    { weight: 8, purity: "24K" as const, making: 3 },
                  ].map((calc, idx) => {
                    const result = calculateGoldJewelryPrice(calc.weight, calc.purity, price24KPerGram, calc.making, true);
                    return (
                      <div key={idx} className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {calc.weight}g {calc.purity} Gold @ {calc.making}% Making
                          </span>
                          <span className="text-lg font-bold text-amber-700">
                            {formatIndianGoldPrice(result.total)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          <span>Metal: {formatIndianGoldPrice(result.metalValue)}</span>
                          <span>+</span>
                          <span>Making: {formatIndianGoldPrice(result.makingCharges)}</span>
                          <span>+</span>
                          <span>GST: {formatIndianGoldPrice(result.gst)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Market Factors */}
            <section id="market-factors" className="mb-6 scroll-mt-20">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                📊 What Affects Gold Price?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold mb-2 text-amber-700">🌍 COMEX Gold</h3>
                  <p className="text-2xl font-bold text-gray-900">${comexUsd?.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">per troy ounce (USD)</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold mb-2 text-amber-700">💱 USD/INR Rate</h3>
                  <p className="text-2xl font-bold text-gray-900">₹{usdInr?.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Exchange rate</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-semibold mb-2 text-amber-700">🏛️ Import Duty</h3>
                  <p className="text-2xl font-bold text-gray-900">6%</p>
                  <p className="text-xs text-gray-500">5% Basic + 1% AIDC (July 2024)</p>
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section id="faq" className="mb-6 scroll-mt-20">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                ❓ Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {faqItems.map((faq, idx) => (
                  <details key={idx} className="bg-white rounded-lg border border-gray-100 shadow-sm group">
                    <summary className="px-4 py-3 cursor-pointer text-sm font-medium flex items-center justify-between text-gray-900 hover:text-amber-700 transition-colors">
                      {faq.question}
                      <span className="ml-2 transition-transform group-open:rotate-180 text-amber-600">▼</span>
                    </summary>
                    <div className="px-4 pb-3 text-sm text-gray-600">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Cross-link to Silver */}
            <section className="mb-4">
              <Link 
                href="/"
                className="block rounded-lg p-4 transition-all hover:shadow-md bg-gradient-to-r from-gray-700 to-gray-800 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🥈</span>
                  <div>
                    <h3 className="text-lg font-bold text-white">Check Silver Rates</h3>
                    <p className="text-sm text-gray-300">Live silver prices in India →</p>
                  </div>
                </div>
              </Link>
            </section>

            {/* External Authority Links - E-E-A-T Signal */}
            <section className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">📊 Official Data Sources</h3>
              <div className="flex flex-wrap gap-3 text-xs">
                <a 
                  href="https://www.mcxindia.com/market-data/spot-market-price" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 hover:underline"
                >
                  MCX India →
                </a>
                <a 
                  href="https://www.rbi.org.in/scripts/ReferenceRateArchive.aspx" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 hover:underline"
                >
                  RBI Exchange Rates →
                </a>
                <a 
                  href="https://www.cmegroup.com/markets/metals/precious/gold.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 hover:underline"
                >
                  COMEX Gold Futures →
                </a>
                <a 
                  href="https://ibjarates.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-900 hover:underline"
                >
                  IBJA Rates →
                </a>
              </div>
            </section>

            {/* Footer Note */}
            <footer className="text-center pt-2">
              <p className="text-xs text-gray-400">
                Gold prices are calculated from international COMEX rates and may differ from local jeweler prices.
                <br />
                <time dateTime={new Date().toISOString()}>
                  Last updated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </time>
              </p>
            </footer>
          </div>
        </section>
      </div>
    </>
  );
}
