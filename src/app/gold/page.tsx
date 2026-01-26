/**
 * Gold Price Page
 * 
 * Displays live gold rates in India with calculator, city prices, and FAQs.
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Live 24K, 22K, 18K gold prices
 * - Jewelry price calculator with making charges
 * - City-wise gold rates (20+ cities)
 * - Market analysis (COMEX, USD/INR, MCX)
 * - Gold-specific FAQs for SEO
 * - Rich schema markup for featured snippets
 * 
 * SEO Target Keywords:
 * - gold rate today, gold price india, 22k gold rate
 * - today gold rate per gram, gold price per tola
 * - gold rate [city name], gold making charges
 */

import { Metadata } from "next";
import { getGoldPriceWithChange, getGoldCityPrices, formatIndianGoldPrice, calculateGoldJewelryPrice } from "@/lib/goldApi";
import GoldPriceCard from "@/components/gold/GoldPriceCard";
import Link from "next/link";

// ============================================================================
// METADATA
// ============================================================================

export const metadata: Metadata = {
  title: "Gold Rate Today India | Live 22K 24K Gold Price per Gram - GoldInfo",
  description: "Live gold rate today in India ₹7,500/gram (24K). Check 22K gold price ₹6,875/gram, city-wise rates, and calculate jewelry cost with making charges. Updated every 30 seconds.",
  keywords: [
    "gold rate today",
    "gold price india",
    "22k gold rate",
    "24k gold price per gram",
    "gold rate per tola",
    "gold price today",
    "live gold rate",
    "gold making charges",
    "gold rate mumbai",
    "gold rate delhi",
    "gold rate chennai",
    "sone ka bhav",
    "aaj ka gold rate",
  ],
  openGraph: {
    title: "Gold Rate Today India | Live 22K 24K Gold Price",
    description: "Live gold prices in India updated every 30 seconds. Check 24K, 22K rates and calculate jewelry cost.",
    type: "website",
    locale: "en_IN",
    siteName: "SilverInfo Gold",
    images: [
      {
        url: "/images/gold/og-gold.png",
        width: 1200,
        height: 630,
        alt: "Gold Rate Today India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gold Rate Today India | Live 22K 24K Gold Price",
    description: "Live gold prices in India updated every 30 seconds. Check 24K, 22K rates and calculate jewelry cost.",
  },
  alternates: {
    canonical: "https://silverinfo.in/gold",
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

export const revalidate = 300; // ISR: Revalidate every 5 minutes

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
    answer: "The current 24K gold rate in India is approximately ₹7,500 per gram. 22K gold (916 purity) is around ₹6,875 per gram. Prices are updated every 30 seconds based on international COMEX rates and USD/INR exchange rate."
  },
  {
    question: "How is gold price per gram calculated in India?",
    answer: "Gold price in India = (COMEX Gold Price USD/oz × USD/INR Rate) ÷ 31.1035 × (1 + 15% Import Duty) × (1 + 3% GST) × (1 + Local Premium). The import duty includes 10% basic customs duty and 5% AIDC."
  },
  {
    question: "What is the difference between 24K, 22K, and 18K gold?",
    answer: "24K gold is 99.9% pure (used for investment bars/coins). 22K gold is 91.6% pure (Indian jewelry standard). 18K gold is 75% pure (modern/Western jewelry). Lower karat gold is more durable for daily wear."
  },
  {
    question: "What are making charges for gold jewelry?",
    answer: "Making charges typically range from 8-25% of gold value. Plain chains: 8-12%. Intricate designs: 15-20%. Designer/branded jewelry: 20-30%. Chains and simple items have lower charges than elaborate designs."
  },
  {
    question: "Is GST applicable on gold purchases in India?",
    answer: "Yes, 3% GST is applicable on gold purchases in India. GST is charged on the total value (gold value + making charges). For gold jewelry, the invoice shows: Metal value + Making charges + 3% GST."
  },
  {
    question: "How do gold rates vary across different cities?",
    answer: "Gold rates vary by ₹0.50-₹2.00 per gram across Indian cities. Mumbai and Ahmedabad have base rates. Southern cities (Chennai, Kochi) have slightly higher rates due to higher demand and transportation costs."
  },
  {
    question: "What is a tola in gold measurement?",
    answer: "1 Tola = 11.6638 grams. This is a traditional Indian measurement still used in North India and Pakistan. 1 Sovereign = 8 grams (used in South India). 1 Pavan = 8 grams (Kerala term for sovereign)."
  },
  {
    question: "What is BIS hallmarking for gold?",
    answer: "BIS (Bureau of Indian Standards) hallmarking is mandatory for gold jewelry in India since June 2021. It certifies gold purity with a unique HUID (Hallmark Unique ID). Look for the BIS logo, purity mark (916 for 22K), and HUID on jewelry."
  },
  {
    question: "How much gold can I buy without PAN card in India?",
    answer: "You can buy gold worth up to ₹2 lakh in cash without PAN card. For purchases above ₹2 lakh, PAN card is mandatory. Digital payments have no such limit but large transactions may be reported."
  },
  {
    question: "What is MCX gold and how does it affect prices?",
    answer: "MCX (Multi Commodity Exchange) is India's largest commodity exchange. MCX gold prices track international COMEX prices but include Indian import duties and local demand factors. MCX trading hours: 9 AM - 11:30 PM (Mon-Fri)."
  },
  {
    question: "Why is gold price different in Kerala?",
    answer: "Kerala has India's highest gold demand per capita. This high demand, combined with cultural significance of gold in weddings/festivals, creates slightly higher prices (₹1-2/gram more). Making charges are also higher (12-15%)."
  },
  {
    question: "Aaj ka gold rate kitna hai? (Hindi)",
    answer: "Aaj ka 24K sone ka bhav lagbhag ₹7,500 per gram hai. 22K sona (916 purity) lagbhag ₹6,875 per gram hai. Yeh rates har 30 second mein update hote hain."
  },
  {
    question: "Is gold a good investment in 2026?",
    answer: "Gold has historically been a hedge against inflation and currency depreciation. In 2026, with global economic uncertainty, gold remains a safe-haven asset. Consider Sovereign Gold Bonds (SGBs) for tax benefits and 2.5% annual interest."
  },
  {
    question: "What is the gold import duty in India 2026?",
    answer: "Current gold import duty in India is 15% (10% Basic Customs Duty + 5% AIDC). This was reduced from 18.45% in Budget July 2024 to make gold more affordable. Additionally, 3% IGST applies on imported gold."
  },
  {
    question: "How to check if gold is real at home?",
    answer: "Home tests include: Magnet test (gold is not magnetic), nitric acid test (real gold won't react), ceramic plate scratch test (fake gold leaves black marks). Best method: Check BIS hallmark and HUID, or get tested at a certified jeweler."
  },
];

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function GoldPage() {
  // Fetch data on server
  const [price, cityPrices] = await Promise.all([
    getGoldPriceWithChange(),
    getGoldCityPrices(),
  ]);

  // Generate schema markup
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "24K Gold (999 Purity)",
    description: "Live 24 Karat pure gold price in India per gram",
    brand: {
      "@type": "Brand",
      name: "COMEX Gold",
    },
    offers: {
      "@type": "Offer",
      price: price.price24KPerGram,
      priceCurrency: "INR",
      priceValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "SilverInfo",
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
      { "@type": "ListItem", position: 2, name: "Gold Rate", item: "https://silverinfo.in/gold" },
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

      <main className="min-h-screen" style={{ background: "linear-gradient(180deg, #0f0f0a 0%, #1a1a0f 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-yellow-200/60">
              <li>
                <Link href="/" className="hover:text-yellow-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-yellow-400">Gold Rate</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: "#FFD700" }}>
              Gold Rate Today in India
            </h1>
            <p className="text-lg" style={{ color: "#FFE4B5", opacity: 0.8 }}>
              Live 24K & 22K gold prices • Updated every 30 seconds
            </p>
          </header>

          {/* Live Price Card */}
          <section className="mb-8">
            <GoldPriceCard initialPrice={price} />
          </section>

          {/* Quick Stats */}
          <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "1 Sovereign (8g)", value: price.price24KPerSovereign, purity: "24K" },
              { label: "1 Sovereign (8g)", value: price.price22KPerSovereign, purity: "22K" },
              { label: "10 Grams", value: price.price22KPer10Gram, purity: "22K" },
              { label: "1 Tola (11.66g)", value: price.price22KPerTola, purity: "22K" },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="rounded-lg p-3 text-center"
                style={{ 
                  background: "rgba(255, 215, 0, 0.08)", 
                  border: "1px solid rgba(255, 215, 0, 0.2)" 
                }}
              >
                <p className="text-xs mb-1" style={{ color: "#FFE4B5", opacity: 0.6 }}>
                  {item.purity} {item.label}
                </p>
                <p className="text-lg font-bold" style={{ color: "#FFD700" }}>
                  {formatIndianGoldPrice(item.value)}
                </p>
              </div>
            ))}
          </section>

          {/* City-wise Prices */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#FFD700" }}>
              📍 Gold Rate in Major Cities
            </h2>
            <div 
              className="rounded-xl overflow-hidden"
              style={{ 
                background: "rgba(255, 215, 0, 0.05)", 
                border: "1px solid rgba(255, 215, 0, 0.2)" 
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "rgba(255, 215, 0, 0.1)" }}>
                      <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "#FFD700" }}>City</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#FFD700" }}>22K/gram</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold" style={{ color: "#FFD700" }}>24K/gram</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold hidden sm:table-cell" style={{ color: "#FFD700" }}>Making %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cityPrices.slice(0, 12).map((city, idx) => (
                      <tr 
                        key={city.city}
                        style={{ 
                          borderBottom: idx < 11 ? "1px solid rgba(255, 215, 0, 0.1)" : "none" 
                        }}
                      >
                        <td className="px-4 py-3 text-sm" style={{ color: "#FFE4B5" }}>
                          {city.city}
                          <span className="text-xs ml-1" style={{ opacity: 0.5 }}>({city.state})</span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium" style={{ color: "#FFD700" }}>
                          {formatIndianGoldPrice(city.price22KPerGram)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm" style={{ color: "#FFE4B5", opacity: 0.8 }}>
                          {formatIndianGoldPrice(city.price24KPerGram)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm hidden sm:table-cell" style={{ color: "#FFE4B5", opacity: 0.6 }}>
                          {city.makingCharges}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs mt-2" style={{ color: "#FFE4B5", opacity: 0.5 }}>
              * Prices exclude making charges and GST. Actual jeweler prices may vary.
            </p>
          </section>

          {/* Price Calculator */}
          <section id="calculator" className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#FFD700" }}>
              🧮 Gold Jewelry Price Calculator
            </h2>
            <div 
              className="rounded-xl p-4 sm:p-6"
              style={{ 
                background: "rgba(255, 215, 0, 0.05)", 
                border: "1px solid rgba(255, 215, 0, 0.2)" 
              }}
            >
              <p className="text-sm mb-4" style={{ color: "#FFE4B5", opacity: 0.8 }}>
                Calculate the total cost of gold jewelry including making charges and GST:
              </p>
              
              {/* Example Calculations */}
              <div className="space-y-4">
                {[
                  { weight: 10, purity: "22K" as const, making: 12 },
                  { weight: 5, purity: "22K" as const, making: 15 },
                  { weight: 8, purity: "24K" as const, making: 3 },
                ].map((calc, idx) => {
                  const result = calculateGoldJewelryPrice(
                    calc.weight,
                    calc.purity,
                    price.price24KPerGram,
                    calc.making,
                    true
                  );
                  
                  return (
                    <div 
                      key={idx}
                      className="rounded-lg p-3"
                      style={{ background: "rgba(255, 215, 0, 0.08)" }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: "#FFD700" }}>
                          {calc.weight}g {calc.purity} Gold @ {calc.making}% Making
                        </span>
                        <span className="text-lg font-bold" style={{ color: "#FFD700" }}>
                          {formatIndianGoldPrice(result.total)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs" style={{ color: "#FFE4B5", opacity: 0.6 }}>
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
              
              <p className="text-xs mt-4" style={{ color: "#FFE4B5", opacity: 0.5 }}>
                * These are indicative calculations. Actual prices depend on jeweler, design complexity, and brand.
              </p>
            </div>
          </section>

          {/* Market Analysis */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#FFD700" }}>
              📊 What Affects Gold Price?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* COMEX */}
              <div 
                className="rounded-xl p-4"
                style={{ 
                  background: "rgba(255, 215, 0, 0.05)", 
                  border: "1px solid rgba(255, 215, 0, 0.2)" 
                }}
              >
                <h3 className="text-sm font-semibold mb-2" style={{ color: "#FFD700" }}>
                  🌍 COMEX Gold
                </h3>
                <p className="text-2xl font-bold mb-1" style={{ color: "#FFE4B5" }}>
                  ${price.comexUsd?.toFixed(2) || "—"}
                </p>
                <p className="text-xs" style={{ color: "#FFE4B5", opacity: 0.6 }}>
                  per troy ounce (USD)
                </p>
              </div>
              
              {/* USD/INR */}
              <div 
                className="rounded-xl p-4"
                style={{ 
                  background: "rgba(255, 215, 0, 0.05)", 
                  border: "1px solid rgba(255, 215, 0, 0.2)" 
                }}
              >
                <h3 className="text-sm font-semibold mb-2" style={{ color: "#FFD700" }}>
                  💱 USD/INR Rate
                </h3>
                <p className="text-2xl font-bold mb-1" style={{ color: "#FFE4B5" }}>
                  ₹{price.usdInr?.toFixed(2) || "—"}
                </p>
                <p className="text-xs" style={{ color: "#FFE4B5", opacity: 0.6 }}>
                  Exchange rate
                </p>
              </div>
              
              {/* Import Duty */}
              <div 
                className="rounded-xl p-4"
                style={{ 
                  background: "rgba(255, 215, 0, 0.05)", 
                  border: "1px solid rgba(255, 215, 0, 0.2)" 
                }}
              >
                <h3 className="text-sm font-semibold mb-2" style={{ color: "#FFD700" }}>
                  🏛️ Import Duty
                </h3>
                <p className="text-2xl font-bold mb-1" style={{ color: "#FFE4B5" }}>
                  15%
                </p>
                <p className="text-xs" style={{ color: "#FFE4B5", opacity: 0.6 }}>
                  10% Basic + 5% AIDC
                </p>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: "#FFD700" }}>
              ❓ Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqItems.map((faq, idx) => (
                <details 
                  key={idx}
                  className="group rounded-lg overflow-hidden"
                  style={{ 
                    background: "rgba(255, 215, 0, 0.05)", 
                    border: "1px solid rgba(255, 215, 0, 0.2)" 
                  }}
                >
                  <summary 
                    className="px-4 py-3 cursor-pointer text-sm font-medium flex items-center justify-between"
                    style={{ color: "#FFE4B5" }}
                  >
                    {faq.question}
                    <span className="ml-2 transition-transform group-open:rotate-180" style={{ color: "#FFD700" }}>
                      ▼
                    </span>
                  </summary>
                  <div 
                    className="px-4 pb-3 text-sm"
                    style={{ color: "#FFE4B5", opacity: 0.8 }}
                  >
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Cross-link to Silver */}
          <section className="mb-8">
            <Link 
              href="/"
              className="block rounded-xl p-4 transition-all hover:scale-[1.01]"
              style={{ 
                background: "linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
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

          {/* Footer Note */}
          <footer className="text-center">
            <p className="text-xs" style={{ color: "#FFE4B5", opacity: 0.4 }}>
              Gold prices are calculated from international COMEX rates and may differ from local jeweler prices.
              <br />
              Last updated: {new Date().toLocaleDateString("en-IN", { 
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
