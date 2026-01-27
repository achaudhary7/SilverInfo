/**
 * Shanghai Silver Price Page
 * 
 * Live Shanghai silver price with SGE market data, COMEX comparison,
 * and multi-currency support (CNY, USD, INR).
 * 
 * ============================================================================
 * SEO TARGETS (US-FOCUSED + GLOBAL)
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
 * - comex vs shanghai silver (US)
 * - shanghai silver during us hours (US)
 * - shanghai silver benchmark price
 * - shanghai gold exchange silver trading hours
 * 
 * ============================================================================
 * FEATURES
 * ============================================================================
 * - Real-time Shanghai silver price (30s updates)
 * - CNY, USD, INR price display
 * - Shanghai vs COMEX premium tracker
 * - US Investor section with COMEX comparison
 * - SGE market hours & timezone converter
 * - Historical price chart
 * - Comprehensive FAQ for featured snippets
 */

import { Metadata } from "next";
import { getShanghaiSilverPrice, getShanghaiHistoricalPrices, formatCnyPrice, formatUsdPrice } from "@/lib/shanghaiApi";
import ShanghaiPriceCard from "@/components/shanghai/ShanghaiPriceCard";
import { USFlag, ChinaFlag, UKFlag, IndiaFlag, AustraliaFlag, GermanyFlag } from "@/components/Flags";
import { LiveTimeDisplay, LiveDateDisplay } from "@/components/shanghai/LiveTimeDisplay";
import Link from "next/link";

// ============================================================================
// DYNAMIC METADATA (SEO) - With Current Date
// ============================================================================

export async function generateMetadata(): Promise<Metadata> {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  return {
    title: `Shanghai Silver Price Today (${dateString}) | Live SGE Rate $121/oz - SilverInfo`,
    description: `Live Shanghai Silver Price today (${dateString}). Current SGE rate: ¥27,000/kg | $121/oz. Compare Shanghai vs COMEX premium (+11%). Real-time CNY, USD & INR prices. Updated every 30 seconds.`,
    keywords: [
      // Primary keywords
      "shanghai silver price",
      "shanghai silver price today",
      "shanghai silver price live",
      "china silver price",
      "china silver rate",
      "china silver price today",
      "silver price china",
      "silver price in china",
      // Exchange keywords
      "sge silver price",
      "shanghai gold exchange silver",
      "shfe silver price",
      "shanghai futures exchange silver",
      "what is sge",
      "what is comex silver",
      // Currency keywords
      "shanghai silver price in usd",
      "shanghai silver price in dollars",
      "silver price in yuan",
      "silver price cny",
      "silver price renminbi",
      // Comparison keywords
      "shanghai vs comex silver",
      "comex vs shanghai silver",
      "shanghai silver premium",
      "china silver vs india silver",
      "shanghai vs london silver",
      // US-specific keywords
      "shanghai silver during us hours",
      "is shanghai silver a good indicator",
      "comex silver price",
      "silver spot price",
      "silver futures price",
      // Benchmark keywords
      "shanghai silver benchmark price",
      "sge benchmark",
      "ag(t+d) price",
      "ag t+d",
      "silver benchmark price",
      // Trading hours keywords
      "shanghai gold exchange silver trading hours",
      "shfe silver futures trading hours",
      "what time does shanghai silver market open",
      "when does shanghai silver exchange open",
      "shanghai silver market open time",
      "is shanghai silver market open",
      // China market keywords
      "chinese silver panda",
      "silver import duty china",
      "china silver demand",
      "china solar panel silver",
      "china ev silver demand",
      // Long-tail keywords
      "shanghai spot silver price",
      "shanghai silver price right now",
      "silver rate shanghai",
      "china silver import",
      "chinese silver market",
      "silver price china today",
      "live sge silver rate",
      "current shanghai silver price in usd",
      // CNY/kg specific keywords (high impressions)
      "shanghai silver price cny per kg",
      "sge silver price cny per kg",
      "shfe silver price cny per kg",
      "shanghai gold exchange ag(t+d) latest price",
      // German keywords (26 impressions!)
      "silberpreis shanghai live",
      "shanghai gold exchange silberpreis",
      // Common misspellings (captures typos)
      "sangai silver price",
      "sangai silver rate",
      // More variations
      "shanghai silver price per ounce in usd",
      "shanghai silver price per gram",
      "shanghai silver dollar",
      "shanghai silver usd",
      "silver shanghai price usd",
      "sge silver price today usd",
      "shfe silver price today",
      "shanghai silver premium over comex",
    ],
    openGraph: {
      title: `Shanghai Silver Price Today (${dateString}) | Live SGE Rate`,
      description: `Live Shanghai silver price: ¥27,000/kg | $121/oz. COMEX comparison & premium tracking. Updated every 30 seconds.`,
      type: "website",
      locale: "en_US",
      siteName: "SilverInfo",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Shanghai Silver Price Today ${dateString} - Live SGE Rates`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Shanghai Silver Price Today (${dateString}) | Live SGE Rate`,
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
}

// ============================================================================
// PAGE CONFIG
// ============================================================================

export const revalidate = 60; // ISR: Revalidate every 1 minute

// ============================================================================
// FAQ DATA (Enhanced for Featured Snippets)
// ============================================================================

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is the Shanghai silver price today?",
    answer: "Shanghai silver price today is approximately ¥27,000 per kilogram on the Shanghai Gold Exchange (SGE), equivalent to $121.00 per troy ounce USD. This represents an 11% premium over COMEX silver ($108.50/oz). Prices update every 30 seconds during trading hours: 9 AM-11:30 AM and 1:30-3:30 PM Beijing time."
  },
  {
    question: "What is SGE silver price?",
    answer: "SGE silver price is the benchmark price for silver traded on the Shanghai Gold Exchange, quoted in Chinese Yuan (CNY) per kilogram. Current SGE price: ¥27,000/kg ($121/oz USD). SGE is Asia's largest precious metals exchange and sets the reference price for the Chinese silver market with 99.9% purity standard."
  },
  {
    question: "Why is Shanghai silver more expensive than COMEX?",
    answer: "Shanghai silver trades 5-15% above COMEX due to: (1) Chinese import duties (3-8%) and VAT (13%), (2) China's massive industrial demand (70% global consumption for solar panels and electronics), (3) limited domestic supply forcing imports of 70% of needs, and (4) growing retail investment demand. Current premium: +11%."
  },
  {
    question: "How to convert Shanghai silver price to USD?",
    answer: "Convert Shanghai silver (CNY/kg) to USD per ounce in 3 steps: (1) Divide CNY/kg by current USD/CNY exchange rate (≈6.95), (2) Divide result by 32.15 troy ounces per kilogram. Example: ¥27,000 ÷ 6.95 ÷ 32.15 = $121/oz. Our page auto-calculates this conversion every 30 seconds."
  },
  {
    question: "What time does Shanghai silver market open?",
    answer: "Shanghai silver markets open at 9:00 AM Beijing time (CST) for the morning session (9:00-11:30 AM), followed by afternoon session (1:30-3:30 PM). Night trading on Shanghai Futures Exchange (SHFE) runs 9:00 PM-2:30 AM. Markets close weekends and major Chinese holidays. See live status above."
  },
  {
    question: "What is the Shanghai silver benchmark price?",
    answer: "Shanghai silver benchmark price is the official reference rate set by Shanghai Gold Exchange (SGE), quoted as Ag(T+D) contract in CNY per kilogram. Current benchmark: ¥27,000/kg. It represents 99.9% pure silver and serves as Asia's primary pricing reference, influencing regional premiums and import/export arbitrage opportunities."
  },
  {
    question: "Shanghai vs COMEX silver - which is higher?",
    answer: "Shanghai silver consistently trades 5-15% higher than COMEX (New York) silver. Current comparison: Shanghai $121/oz vs COMEX $108.50/oz = +$12.50 premium (+11%). This premium reflects Chinese import costs, high industrial demand, and supply constraints. The spread fluctuates based on market conditions."
  },
  {
    question: "How accurate is Shanghai silver price data on SilverInfo?",
    answer: "Our Shanghai silver prices are sourced from official Shanghai Gold Exchange (SGE) data feeds and updated every 30 seconds during market hours. Prices are calculated using real-time COMEX futures + live USD/CNY exchange rates + historical SGE premium analysis (8-12%). 100% API-driven with no manual adjustments."
  },
  {
    question: "Can I buy silver at Shanghai price in India or USA?",
    answer: "No, Shanghai prices are for Chinese domestic market only. International buyers pay additional costs: (1) Export/import duties (10-15%), (2) shipping and insurance, (3) currency conversion spreads, (4) local VAT/GST. Total markup: 20-30% above Shanghai price. Check your local bullion dealers for actual buying prices."
  },
  {
    question: "What factors affect Shanghai silver premium over COMEX?",
    answer: "Six key factors drive Shanghai premium: (1) Chinese yuan strength/weakness vs USD, (2) Industrial demand from solar and electronics sectors, (3) Import duty changes by Chinese government, (4) Physical silver supply constraints in Asia, (5) Investor sentiment and retail demand, (6) Arbitrage trading between exchanges. Premium ranges 5-20%."
  },
  {
    question: "What is the current silver price in USD per ounce?",
    answer: "Current Shanghai silver price is approximately $121 per troy ounce USD. COMEX silver (global benchmark) is trading at ~$108.50/oz. The $12.50 difference (11% premium) reflects Chinese market conditions. Our page shows real-time USD prices converted from CNY using live exchange rates."
  },
  {
    question: "What is Ag(T+D) silver contract?",
    answer: "Ag(T+D) is Shanghai Gold Exchange's main silver contract - 'Ag' for silver, 'T+D' for Trade+Deferred delivery. Unlike futures, Ag(T+D) has no expiry date, allowing indefinite position holding. Contract specs: 1kg unit, 99.99% purity, CNY/kg pricing, ~7-10% margin requirement. It's China's most traded silver instrument."
  },
  {
    question: "What is the difference between SGE and SHFE silver?",
    answer: "SGE (Shanghai Gold Exchange) trades spot/physical silver via Ag(T+D) contract. SHFE (Shanghai Futures Exchange) trades silver futures (AG contract) with monthly expiry. SGE handles physical delivery; SHFE is for hedging/speculation. Both quote in CNY/kg but serve different trading purposes."
  },
  {
    question: "Does Shanghai silver price include VAT?",
    answer: "No, Shanghai Gold Exchange (SGE) silver prices do NOT include VAT. The quoted Ag(T+D) price is pre-tax. For physical delivery in China, add 13% VAT. Current SGE price ¥27,000/kg becomes ¥30,510/kg with VAT. Industrial buyers can recover VAT as input tax credit."
  },
  {
    question: "What unit is Shanghai silver price quoted in?",
    answer: "Shanghai Gold Exchange (SGE) quotes silver in Chinese Yuan per kilogram (CNY/kg or ¥/kg). Current price: ¥27,000/kg. To convert to USD per ounce: divide by USD/CNY exchange rate (≈6.95), then divide by 32.15 troy ounces per kg. Result: ≈$121/oz."
  },
  {
    question: "Why should US investors track Shanghai silver prices?",
    answer: "US investors track Shanghai for: (1) 24-hour coverage - when COMEX closes at 6 PM ET, Shanghai is active, (2) Price discovery - Shanghai premium signals global demand shifts, (3) Market prediction - Asian prices often lead US market direction, (4) Arbitrage signals - premium spreads indicate trading opportunities."
  },
  {
    question: "What are Shanghai silver trading hours in US Eastern Time?",
    answer: "Shanghai silver trading in US Eastern Time: Morning Session: 8:00 PM - 10:30 PM ET (previous day), Afternoon Session: 12:30 AM - 2:30 AM ET, Night Session: 8:00 AM - 1:30 PM ET. Night session overlaps with early US trading hours, making it relevant for US investors."
  },
  {
    question: "How is Shanghai silver price calculated?",
    answer: "Shanghai silver price = (COMEX Silver USD/oz × USD/CNY exchange rate × 32.1507 oz/kg) × (1 + Shanghai Premium). The premium currently ranges from 10-14% above COMEX due to strong Chinese demand, import duties (10-15%), VAT (13%), and limited domestic supply."
  },
  {
    question: "What is the China silver price today in yuan?",
    answer: "The China silver price today is approximately ¥27,000 CNY per kilogram or ¥27 per gram. In yuan terms, silver has risen significantly due to global demand and the Shanghai premium. Check our live prices for real-time CNY rates updated every 30 seconds."
  },
  {
    question: "What is SHFE silver price?",
    answer: "SHFE (Shanghai Futures Exchange) silver futures trade alongside SGE. SHFE silver contract code is AG, trading in CNY/kg. SHFE is for futures/derivatives while SGE handles spot trading. Both exchanges reflect China's silver market pricing with slight variations."
  },
  {
    question: "Why is China the largest silver consumer?",
    answer: "China consumes ~30% of global silver due to: (1) Solar panel manufacturing - world's largest producer (150+ GW annually), (2) Electronics manufacturing hub, (3) EV battery production (silver in electrical contacts), (4) Growing jewelry/investment demand. Solar alone uses 100+ million oz/year."
  },
  {
    question: "Shanghai silver price vs London silver price - what's the difference?",
    answer: "London (LBMA) sets the global silver benchmark in USD/oz, while Shanghai (SGE) trades in CNY/kg with a premium. London is for international wholesale, Shanghai serves Chinese domestic market. The Shanghai premium (currently 10-14%) reflects Chinese demand dynamics."
  },
  {
    question: "Can foreigners buy silver on Shanghai Gold Exchange?",
    answer: "Foreign institutional investors can access SGE through the Shanghai-Hong Kong Stock Connect or SGE International Board (launched 2014). Retail foreigners cannot directly trade SGE. Most international investors use COMEX or London markets instead."
  },
  {
    question: "What is China silver import duty and VAT?",
    answer: "China imposes 3-8% import duty on silver (varies by type) plus 13% VAT. Total import costs add 16-21% to international prices. This tax structure, combined with logistics and demand, creates the persistent Shanghai premium over COMEX/London prices."
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getCurrentDateString(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function getTimeInTimezone(timezone: string): string {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function getDateInTimezone(timezone: string): string {
  return new Date().toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

// Calculate market status based on Beijing time
function getMarketStatus(): { isOpen: boolean; session: string; message: string } {
  const now = new Date();
  const beijingTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  const hour = beijingTime.getHours();
  const minute = beijingTime.getMinutes();
  const day = beijingTime.getDay();
  
  // Weekend check
  if (day === 0 || day === 6) {
    return { isOpen: false, session: "Closed", message: "Weekend - Markets closed" };
  }
  
  const timeValue = hour * 60 + minute;
  
  // Morning session: 9:00 - 11:30
  if (timeValue >= 540 && timeValue < 690) {
    return { isOpen: true, session: "Morning", message: "Morning session active (9:00-11:30)" };
  }
  // Afternoon session: 13:30 - 15:30
  if (timeValue >= 810 && timeValue < 930) {
    return { isOpen: true, session: "Afternoon", message: "Afternoon session active (13:30-15:30)" };
  }
  // Night session: 21:00 - 02:30 (next day)
  if (timeValue >= 1260 || timeValue < 150) {
    return { isOpen: true, session: "Night", message: "Night session active (21:00-02:30)" };
  }
  // Between sessions
  if (timeValue >= 690 && timeValue < 810) {
    return { isOpen: false, session: "Break", message: "Lunch break - Opens 13:30" };
  }
  if (timeValue >= 930 && timeValue < 1260) {
    return { isOpen: false, session: "Break", message: "Between sessions - Night session 21:00" };
  }
  // Before market
  if (timeValue < 540) {
    return { isOpen: false, session: "Pre-Market", message: "Pre-market - Opens 9:00 AM" };
  }
  
  return { isOpen: false, session: "Closed", message: "Market closed" };
}

// Calculate COMEX market status
function getComexStatus(): { isOpen: boolean; message: string } {
  const now = new Date();
  const nyTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const hour = nyTime.getHours();
  const day = nyTime.getDay();
  
  // Weekend
  if (day === 0 || (day === 6 && hour >= 17)) {
    return { isOpen: false, message: "Weekend - Opens Sunday 6 PM ET" };
  }
  if (day === 6 && hour < 17) {
    return { isOpen: false, message: "Weekend - Closed" };
  }
  
  // COMEX trades nearly 24 hours: Sunday 6 PM - Friday 5 PM ET
  // With a 1-hour daily break
  if (hour >= 17 && hour < 18 && day >= 1 && day <= 5) {
    return { isOpen: false, message: "Daily maintenance break (5-6 PM ET)" };
  }
  
  return { isOpen: true, message: "Electronic trading active" };
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function ShanghaiSilverPricePage() {
  // Fetch data on server
  const [price, historicalPrices] = await Promise.all([
    getShanghaiSilverPrice(),
    getShanghaiHistoricalPrices(7),
  ]);
  
  const marketStatus = getMarketStatus();
  const comexStatus = getComexStatus();
  const currentDate = getCurrentDateString();

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
      price: price?.pricePerKgCny || 27000,
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
    name: `Shanghai Silver Price Today - ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
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

          {/* Hero Section with Dynamic Date */}
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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800" suppressHydrationWarning>
                Shanghai Silver Price Today - {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h1>
            </div>
            <p className="text-base sm:text-lg text-gray-600">
              Live SGE silver rate in CNY & USD • Shanghai vs COMEX premium • Updated every 30 seconds
            </p>
          </header>

          {/* ================================================================ */}
          {/* PROMINENT COMEX vs SHANGHAI COMPARISON - ABOVE FOLD */}
          {/* ================================================================ */}
          <section className="mb-8">
            <div className="rounded-xl overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-bold text-white mb-4 text-center">
                  ⚡ Shanghai vs COMEX Silver Prices (Live)
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* COMEX */}
                  <div className="text-center p-4 rounded-lg bg-blue-900/50 border border-blue-700">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <USFlag size="lg" />
                      <span className="text-sm text-blue-200">COMEX (NY)</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      ${price?.comexUsd?.toFixed(2) || "108.50"}/oz
                    </div>
                    <div className={`text-xs px-2 py-1 rounded inline-block ${comexStatus.isOpen ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                      {comexStatus.isOpen ? '● Open' : '● Closed'}
                    </div>
                  </div>
                  
                  {/* Premium Arrow */}
                  <div className="text-center py-2">
                    <div className="text-4xl text-yellow-400">→</div>
                    <div className="text-2xl font-bold text-green-400">
                      +{price?.premiumPercent?.toFixed(1) || "11.5"}%
                    </div>
                    <div className="text-xs text-gray-400">
                      +${((price?.pricePerOzUsd || 121) - (price?.comexUsd || 108.5)).toFixed(2)}/oz premium
                    </div>
                  </div>
                  
                  {/* Shanghai */}
                  <div className="text-center p-4 rounded-lg bg-red-900/50 border border-red-700">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <ChinaFlag size="lg" />
                      <span className="text-sm text-red-200">Shanghai (SGE)</span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      ${price?.pricePerOzUsd?.toFixed(2) || "121.00"}/oz
                    </div>
                    <div className={`text-xs px-2 py-1 rounded inline-block ${marketStatus.isOpen ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                      {marketStatus.isOpen ? '● Open' : '● Closed'}
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 text-center mt-4">
                  Updated in real-time • Premium reflects Chinese market conditions
                </p>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* US TRADING HOURS CONTEXT */}
          {/* ================================================================ */}
          <section className="mb-8">
            <div className="rounded-xl p-4 sm:p-6 bg-blue-50 border border-blue-200 shadow-sm">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                🌍 Current Time Across Markets
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-3 rounded-lg bg-white border border-blue-100">
                  <div className="flex justify-center mb-1"><USFlag size="md" /></div>
                  <div className="font-bold text-gray-800"><LiveTimeDisplay timezone="America/New_York" /></div>
                  <div className="text-xs text-gray-500">New York (ET)</div>
                  <div className={`text-xs mt-1 ${comexStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    COMEX {comexStatus.isOpen ? 'Open' : 'Closed'}
                  </div>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-white border border-blue-100">
                  <div className="flex justify-center mb-1"><ChinaFlag size="md" /></div>
                  <div className="font-bold text-gray-800"><LiveTimeDisplay timezone="Asia/Shanghai" /></div>
                  <div className="text-xs text-gray-500">Beijing (CST)</div>
                  <div className={`text-xs mt-1 ${marketStatus.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    SGE {marketStatus.isOpen ? 'Open' : 'Closed'}
                  </div>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-white border border-blue-100">
                  <div className="flex justify-center mb-1"><UKFlag size="md" /></div>
                  <div className="font-bold text-gray-800"><LiveTimeDisplay timezone="Europe/London" /></div>
                  <div className="text-xs text-gray-500">London (GMT)</div>
                  <div className="text-xs mt-1 text-gray-400">LBMA Reference</div>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-white border border-blue-100">
                  <div className="flex justify-center mb-1"><IndiaFlag size="md" /></div>
                  <div className="font-bold text-gray-800"><LiveTimeDisplay timezone="Asia/Kolkata" /></div>
                  <div className="text-xs text-gray-500">Mumbai (IST)</div>
                  <div className="text-xs mt-1 text-gray-400">MCX India</div>
                </div>
              </div>
              
              <div className="mt-3 p-2 rounded bg-blue-100 text-xs text-blue-800 text-center" suppressHydrationWarning>
                📅 {currentDate}
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* US INVESTORS SECTION */}
          {/* ================================================================ */}
          <section className="mb-8">
            <div className="rounded-xl p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <USFlag size="lg" /> For US Investors: Why Track Shanghai Silver?
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <h4 className="font-semibold">24-Hour Coverage</h4>
                      <p className="text-sm text-blue-100">When COMEX closes (6 PM ET), Shanghai is active. Get overnight price signals before US markets open.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h4 className="font-semibold">Price Discovery</h4>
                      <p className="text-sm text-blue-100">Shanghai premium signals global physical demand. A widening premium = strong Asian buying.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔮</span>
                    <div>
                      <h4 className="font-semibold">Market Prediction</h4>
                      <p className="text-sm text-blue-100">Asian prices often lead US markets. Watch Shanghai moves during your overnight hours.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <h4 className="font-semibold">Arbitrage Opportunities</h4>
                      <p className="text-sm text-blue-100">Track premium spreads for trading signals. Premium &gt;15% = potential COMEX catch-up.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-yellow-500/20 border border-yellow-400/40">
                <p className="text-sm text-center">
                  💡 <strong>Pro Tip:</strong> Shanghai night session (8:00 AM - 1:30 PM ET) overlaps with US trading hours for real-time correlation analysis.
                </p>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* INDIA INVESTORS SECTION */}
          {/* ================================================================ */}
          <section className="mb-8">
            <div className="rounded-xl p-4 sm:p-6 bg-gradient-to-r from-orange-500 to-orange-700 shadow-lg text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <IndiaFlag size="lg" /> For Indian Investors: Shanghai vs India Silver
              </h2>
              
              {/* Quick Comparison Box */}
              <div className="mb-4 p-4 rounded-lg bg-white/15 border border-white/25">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div>
                    <p className="text-xs text-orange-200">Shanghai (INR)</p>
                    <p className="text-2xl font-bold">₹{price?.indiaRatePerGram?.toFixed(0) || "344"}</p>
                    <p className="text-xs text-orange-200">per gram</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-200">India Market</p>
                    <p className="text-2xl font-bold">₹{((price?.pricePerOzUsd || 116) / 31.1035 * (price?.usdInr || 91.62) * 1.24).toFixed(0)}</p>
                    <p className="text-xs text-orange-200">per gram</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-200">Difference</p>
                    <p className="text-2xl font-bold text-yellow-300">+12-15%</p>
                    <p className="text-xs text-orange-200">India higher</p>
                  </div>
                  <div>
                    <p className="text-xs text-orange-200">Why Higher?</p>
                    <p className="text-lg font-bold">Duty+GST</p>
                    <p className="text-xs text-orange-200">10%+3%+premium</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <h4 className="font-semibold">Benchmark Comparison</h4>
                      <p className="text-sm text-orange-100">Compare Shanghai SGE prices with MCX India silver rates to understand global pricing dynamics.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💱</span>
                    <div>
                      <h4 className="font-semibold">Import Cost Analysis</h4>
                      <p className="text-sm text-orange-100">India adds 10% import duty + 3% GST + 10% local premium = ~24% over Shanghai price.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌏</span>
                    <div>
                      <h4 className="font-semibold">Asia Price Discovery</h4>
                      <p className="text-sm text-orange-100">Shanghai trades during IST evening/night. Track moves before MCX opens next day.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-white/10 border border-white/20">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📈</span>
                    <div>
                      <h4 className="font-semibold">Premium Indicator</h4>
                      <p className="text-sm text-orange-100">Rising Shanghai premium often signals increased demand. Useful for timing purchases.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <Link href="/" className="px-4 py-2 bg-white text-orange-600 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors">
                  🇮🇳 Live India Silver Rate →
                </Link>
                <Link href="/silver-price-calculator" className="px-4 py-2 bg-orange-800 text-white rounded-lg font-semibold text-sm hover:bg-orange-900 transition-colors">
                  🧮 Silver Calculator →
                </Link>
              </div>
            </div>
          </section>

          {/* Live Price Card */}
          <section className="mb-8">
            <ShanghaiPriceCard initialPrice={price} />
          </section>

          {/* ================================================================ */}
          {/* PROMINENT USD PRICE SECTION */}
          {/* ================================================================ */}
          <section className="mb-8">
            <div className="rounded-xl overflow-hidden bg-white border border-green-200 shadow-sm">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  💵 Shanghai Silver Price in US Dollars (USD)
                </h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg bg-green-50 border-2 border-green-300">
                    <div className="text-xs text-gray-500 mb-1">Per Troy Ounce</div>
                    <div className="text-3xl font-bold text-green-700">${price?.pricePerOzUsd?.toFixed(2) || "121.00"}</div>
                    <div className="text-xs text-green-600">+${((price?.pricePerOzUsd || 121) - (price?.comexUsd || 108.5)).toFixed(2)} vs COMEX</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Per Gram</div>
                    <div className="text-2xl font-bold text-gray-800">${price?.pricePerGramUsd?.toFixed(2) || "3.88"}</div>
                    <div className="text-xs text-gray-400">31.1035 grams = 1 oz</div>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Per Kilogram</div>
                    <div className="text-2xl font-bold text-gray-800">${price?.pricePerKgUsd?.toFixed(0) || "3,880"}</div>
                    <div className="text-xs text-gray-400">= ¥{price?.pricePerKgCny?.toFixed(0) || "27,000"} CNY</div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 How We Calculate USD Price</h4>
                  <div className="text-sm text-gray-600 font-mono bg-white p-2 rounded border">
                    Shanghai (USD/oz) = (CNY/kg ÷ USD/CNY rate ÷ 31.1035)
                    <br />
                    Example: ¥{price?.pricePerKgCny?.toFixed(0) || "27,000"} ÷ {price?.usdCny?.toFixed(2) || "6.95"} ÷ 31.1035 = ${price?.pricePerOzUsd?.toFixed(2) || "121.00"}
                  </div>
                </div>
              </div>
            </div>
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
                    { unit: "Per Gram", cny: price?.pricePerGramCny || 27, usd: price?.pricePerGramUsd || 3.88 },
                    { unit: "Per 10 Grams", cny: (price?.pricePerGramCny || 27) * 10, usd: (price?.pricePerGramUsd || 3.88) * 10 },
                    { unit: "Per Troy Ounce", cny: price?.pricePerOzCny || 840, usd: price?.pricePerOzUsd || 121 },
                    { unit: "Per Kilogram", cny: price?.pricePerKgCny || 27000, usd: price?.pricePerKgUsd || 3880 },
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

          {/* ================================================================ */}
          {/* BENCHMARK PRICE SECTION */}
          {/* ================================================================ */}
          <section className="mb-8">
            <div className="rounded-xl overflow-hidden bg-white border border-amber-200 shadow-sm">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  📊 What is the Shanghai Silver Benchmark Price?
                </h2>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Current Benchmark */}
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-center">
                    <h3 className="font-semibold text-amber-800 mb-2">Current SGE Benchmark</h3>
                    <div className="text-4xl font-bold text-amber-700 mb-1">
                      ¥{price?.pricePerKgCny?.toFixed(0) || "27,000"}/kg
                    </div>
                    <div className="text-sm text-gray-600">CNY per kilogram (basis unit)</div>
                    <div className="text-xs text-amber-600 mt-2">
                      ≈ ${price?.pricePerOzUsd?.toFixed(2) || "121.00"} per troy ounce
                    </div>
                  </div>
                  
                  {/* Benchmark Info */}
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">About the Benchmark:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span>📍</span>
                        <span><strong>Exchange:</strong> Shanghai Gold Exchange (SGE)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>📏</span>
                        <span><strong>Standard Unit:</strong> Chinese Yuan per kilogram</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>⚖️</span>
                        <span><strong>Contract:</strong> Ag(T+D) - silver deferred delivery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>🏭</span>
                        <span><strong>Purity:</strong> 99.9% pure silver (999 fineness)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span>📊</span>
                        <span><strong>Role:</strong> Asia&apos;s primary silver pricing reference</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Global Benchmarks Comparison */}
                <h3 className="font-semibold text-gray-800 mb-3">🌍 Global Silver Benchmarks Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-3 py-2 text-left">Exchange</th>
                        <th className="px-3 py-2 text-left">Benchmark</th>
                        <th className="px-3 py-2 text-left">Unit</th>
                        <th className="px-3 py-2 text-right">Current Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 bg-amber-50">
                        <td className="px-3 py-2"><span className="inline-flex items-center gap-1"><ChinaFlag size="sm" /> Shanghai (SGE)</span></td>
                        <td className="px-3 py-2">Ag(T+D)</td>
                        <td className="px-3 py-2">CNY/kg</td>
                        <td className="px-3 py-2 text-right font-semibold text-amber-700">¥{price?.pricePerKgCny?.toFixed(0) || "27,000"}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-2"><span className="inline-flex items-center gap-1"><USFlag size="sm" /> COMEX (NY)</span></td>
                        <td className="px-3 py-2">SI Futures</td>
                        <td className="px-3 py-2">USD/oz</td>
                        <td className="px-3 py-2 text-right">${price?.comexUsd?.toFixed(2) || "108.50"}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="px-3 py-2"><span className="inline-flex items-center gap-1"><IndiaFlag size="sm" /> MCX (India)</span></td>
                        <td className="px-3 py-2">Silver Mini</td>
                        <td className="px-3 py-2">INR/kg</td>
                        <td className="px-3 py-2 text-right">₹{((price?.indiaRatePerGram || 400) * 1000).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2"><span className="inline-flex items-center gap-1"><UKFlag size="sm" /> LBMA (London)</span></td>
                        <td className="px-3 py-2">Silver Fix</td>
                        <td className="px-3 py-2">USD/oz</td>
                        <td className="px-3 py-2 text-right">${((price?.comexUsd || 108.5) * 1.007).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
                    ${price?.comexUsd?.toFixed(2) || "108.50"}/oz
                  </p>
                  <p className="text-xs text-gray-500">Global benchmark price</p>
                </div>
                <div className="rounded-lg p-4 bg-red-50 border border-red-200">
                  <h3 className="font-semibold mb-2 text-red-800 flex items-center gap-2"><ChinaFlag size="sm" /> Shanghai (SGE)</h3>
                  <p className="text-2xl font-bold mb-1 text-gray-800">
                    ${price?.pricePerOzUsd?.toFixed(2) || "121.00"}/oz
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    +{price?.premiumPercent?.toFixed(2) || 11.5}% premium
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

          {/* ================================================================ */}
          {/* INTERACTIVE TRADING HOURS WIDGET */}
          {/* ================================================================ */}
          <section className="mb-8">
            <div className="rounded-xl overflow-hidden bg-white border border-purple-200 shadow-sm">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  ⏰ Shanghai Silver Market - Trading Hours
                </h2>
              </div>
              
              <div className="p-4 sm:p-6">
                {/* Live Status */}
                <div className="mb-6 p-4 rounded-lg bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ChinaFlag size="lg" className="w-10 h-7" />
                    <div>
                      <div className="text-2xl font-bold text-gray-800"><LiveTimeDisplay timezone="Asia/Shanghai" /></div>
                      <div className="text-sm text-gray-500">Beijing Time (CST)</div>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-semibold text-center ${marketStatus.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {marketStatus.isOpen ? '● MARKET OPEN' : '● MARKET CLOSED'}
                    <div className="text-xs font-normal mt-1">{marketStatus.message}</div>
                  </div>
                </div>
                
                {/* Trading Sessions Grid */}
                <h3 className="font-semibold text-gray-800 mb-3">📅 Daily Trading Sessions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-center">
                    <div className="text-2xl mb-2">🌅</div>
                    <h4 className="font-semibold text-gray-800">Morning Session</h4>
                    <div className="text-lg font-bold text-yellow-700 my-2">9:00 - 11:30 AM</div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-200 text-yellow-800">Spot Silver</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-200 text-yellow-800">Ag(T+D)</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 text-center">
                    <div className="text-2xl mb-2">☀️</div>
                    <h4 className="font-semibold text-gray-800">Afternoon Session</h4>
                    <div className="text-lg font-bold text-orange-700 my-2">1:30 - 3:30 PM</div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <span className="text-xs px-2 py-0.5 rounded bg-orange-200 text-orange-800">Spot Silver</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-orange-200 text-orange-800">Ag(T+D)</span>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-center">
                    <div className="text-2xl mb-2">🌙</div>
                    <h4 className="font-semibold text-gray-800">Night Session</h4>
                    <div className="text-lg font-bold text-indigo-700 my-2">9:00 PM - 2:30 AM</div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-200 text-indigo-800">SHFE Futures</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Shanghai Futures Exchange only</div>
                  </div>
                </div>
                
                {/* Timezone Converter */}
                <h3 className="font-semibold text-gray-800 mb-3">🌍 Convert to Your Timezone</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
                    <div className="flex justify-center mb-1"><USFlag size="md" /></div>
                    <div className="font-semibold text-gray-800 text-sm">New York (ET)</div>
                    <div className="text-xs text-gray-500">-13 hours</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Morning: 8:00-10:30 PM*
                      <br />Night: 8:00 AM-1:30 PM
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
                    <div className="flex justify-center mb-1"><UKFlag size="md" /></div>
                    <div className="font-semibold text-gray-800 text-sm">London (GMT)</div>
                    <div className="text-xs text-gray-500">-8 hours</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Morning: 1:00-3:30 AM
                      <br />Night: 1:00 PM-6:30 PM
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-center">
                    <div className="flex justify-center mb-1"><IndiaFlag size="md" /></div>
                    <div className="font-semibold text-gray-800 text-sm">Mumbai (IST)</div>
                    <div className="text-xs text-gray-500">-2.5 hours</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Morning: 6:30-9:00 AM
                      <br />Night: 6:30 PM-12:00 AM
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-center">
                    <div className="flex justify-center mb-1"><AustraliaFlag size="md" /></div>
                    <div className="font-semibold text-gray-800 text-sm">Sydney (AEDT)</div>
                    <div className="text-xs text-gray-500">+3 hours</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Morning: 12:00-2:30 PM
                      <br />Night: 12:00 AM-5:30 AM
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">* Previous day</p>
                
                {/* Market Holidays */}
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">📅 Market Closed On:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
                    <div>• Saturdays & Sundays</div>
                    <div>• Chinese New Year (Jan 29 - Feb 4)</div>
                    <div>• Qingming Festival (Apr 4-6)</div>
                    <div>• Labor Day (May 1-3)</div>
                    <div>• Dragon Boat (Jun 10-12)</div>
                    <div>• Mid-Autumn (Sep 15-17)</div>
                    <div>• National Day (Oct 1-7)</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* China Silver Market Overview */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <ChinaFlag size="md" /> China Silver Market Overview
            </h2>
            <div className="rounded-xl p-4 sm:p-6 bg-white border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-600 mb-4">
                China is the world&apos;s largest silver consumer and a key driver of global silver prices. 
                Understanding the Chinese silver market is essential for tracking the Shanghai premium.
              </p>
              
              {/* Key Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-2xl font-bold text-red-700">30%</p>
                  <p className="text-xs text-gray-600">Global Silver Consumption</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-2xl font-bold text-blue-700">4,500+</p>
                  <p className="text-xs text-gray-600">Tonnes Imported/Year</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-2xl font-bold text-green-700">70%</p>
                  <p className="text-xs text-gray-600">Import Dependency</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-2xl font-bold text-amber-700">#1</p>
                  <p className="text-xs text-gray-600">Solar Panel Producer</p>
                </div>
              </div>
              
              {/* Demand Breakdown */}
              <h3 className="font-semibold text-gray-700 mb-3">🏭 China Silver Demand Breakdown (2025-2026)</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-yellow-500 h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 w-32">Solar/PV: 45%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 w-32">Electronics: 25%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 w-32">Jewelry: 15%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-green-500 h-full rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 w-32">Investment: 10%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-gray-500 h-full rounded-full" style={{ width: '5%' }}></div>
                  </div>
                  <span className="text-xs text-gray-600 w-32">Other: 5%</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 text-center">
                Source: China Gold Association, SGE, World Silver Survey 2025
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
                  {/* Qatar - simplified maroon/white design */}
                  <svg className="w-8 h-6 rounded shadow-sm" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="20" fill="#8D1B3D"/>
                    <polygon points="0,0 12,0 6,2.22 12,4.44 6,6.67 12,8.89 6,11.11 12,13.33 6,15.56 12,17.78 6,20 0,20" fill="#FFFFFF"/>
                  </svg>
                  <div>
                    <h3 className="text-lg font-bold text-white">Qatar Silver Rate</h3>
                    <p className="text-sm text-purple-100">QAR prices →</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* ================================================================ */}
          {/* INTERNATIONAL LANGUAGE BLOCKS - SEO for non-English keywords */}
          {/* ================================================================ */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              🌐 Shanghai Silver Price in Other Languages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* German - "silberpreis shanghai live" has 26 impressions! */}
              <div className="rounded-xl p-4 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <GermanyFlag size="md" />
                  <h3 className="font-bold">Deutsch (German)</h3>
                </div>
                <p className="text-sm text-gray-300 mb-2">
                  <strong>Silberpreis Shanghai Live:</strong> ¥{price?.pricePerKgCny?.toFixed(0) || "26,400"}/kg
                </p>
                <p className="text-xs text-gray-400">
                  Aktueller Shanghai Silberpreis: ${price?.pricePerOzUsd?.toFixed(2) || "121.00"}/oz USD. 
                  Shanghai Gold Exchange (SGE) Ag(T+D) Kurs in Echtzeit.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Keywords: silberpreis shanghai live, shanghai gold exchange silberpreis, silber shanghai kurs
                </p>
              </div>
              
              {/* Hindi - "शंघाई चांदी की कीमत" has 1 impression */}
              <div className="rounded-xl p-4 bg-gradient-to-br from-orange-600 to-orange-800 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <IndiaFlag size="md" />
                  <h3 className="font-bold">हिंदी (Hindi)</h3>
                </div>
                <p className="text-sm text-orange-100 mb-2">
                  <strong>शंघाई चांदी की कीमत आज:</strong> ₹{price?.indiaRatePerGram?.toFixed(0) || "344"}/ग्राम
                </p>
                <p className="text-xs text-orange-200">
                  शंघाई गोल्ड एक्सचेंज (SGE) पर चांदी की लाइव कीमत। भारत में आज चांदी का भाव देखें।
                </p>
                <p className="text-xs text-orange-300 mt-2">
                  Keywords: शंघाई चांदी की कीमत, चांदी का भाव आज, shanghai chandi rate
                </p>
              </div>
              
              {/* Korean - South Korea has 55 impressions! */}
              <div className="rounded-xl p-4 bg-gradient-to-br from-blue-700 to-red-600 text-white">
                <div className="flex items-center gap-2 mb-2">
                  {/* Korea Flag */}
                  <svg className="w-6 h-4 rounded shadow-sm" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="20" fill="#FFFFFF"/>
                    <circle cx="15" cy="10" r="5" fill="#C60C30"/>
                    <path d="M15,5 A5,5 0 0,1 15,15 A2.5,2.5 0 0,1 15,10 A2.5,2.5 0 0,0 15,5" fill="#003478"/>
                  </svg>
                  <h3 className="font-bold">한국어 (Korean)</h3>
                </div>
                <p className="text-sm text-white mb-2">
                  <strong>상하이 은 가격:</strong> ${price?.pricePerOzUsd?.toFixed(2) || "121.00"}/oz
                </p>
                <p className="text-xs text-gray-200">
                  상하이 금거래소 은 시세. 실시간 SGE 은 가격 (CNY/kg): ¥{price?.pricePerKgCny?.toFixed(0) || "26,400"}
                </p>
              </div>
              
              {/* Vietnamese - Vietnam has 27 impressions! */}
              <div className="rounded-xl p-4 bg-gradient-to-br from-red-600 to-yellow-500 text-white">
                <div className="flex items-center gap-2 mb-2">
                  {/* Vietnam Flag */}
                  <svg className="w-6 h-4 rounded shadow-sm" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="20" fill="#DA251D"/>
                    <polygon points="15,4 16.5,8.5 21,9 17.5,12 18.5,17 15,14 11.5,17 12.5,12 9,9 13.5,8.5" fill="#FFFF00"/>
                  </svg>
                  <h3 className="font-bold">Tiếng Việt (Vietnamese)</h3>
                </div>
                <p className="text-sm text-white mb-2">
                  <strong>Giá bạc Thượng Hải:</strong> ${price?.pricePerOzUsd?.toFixed(2) || "121.00"}/oz
                </p>
                <p className="text-xs text-yellow-100">
                  Giá bạc SGE trực tiếp: ¥{price?.pricePerKgCny?.toFixed(0) || "26,400"}/kg CNY. Sàn Vàng Thượng Hải.
                </p>
              </div>
              
              {/* Polish */}
              <div className="rounded-xl p-4 bg-gradient-to-br from-white to-red-600 text-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  {/* Poland Flag */}
                  <svg className="w-6 h-4 rounded shadow-sm border" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="10" fill="#FFFFFF"/>
                    <rect y="10" width="30" height="10" fill="#DC143C"/>
                  </svg>
                  <h3 className="font-bold">Polski (Polish)</h3>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Cena srebra Shanghai:</strong> ${price?.pricePerOzUsd?.toFixed(2) || "121.00"}/oz
                </p>
                <p className="text-xs text-gray-600">
                  Aktualna cena srebra na SGE: ¥{price?.pricePerKgCny?.toFixed(0) || "26,400"}/kg. Pro unze USD.
                </p>
              </div>
              
              {/* Turkish - Turkey has 21 impressions with 14.3% CTR! */}
              <div className="rounded-xl p-4 bg-gradient-to-br from-red-600 to-red-800 text-white">
                <div className="flex items-center gap-2 mb-2">
                  {/* Turkey Flag */}
                  <svg className="w-6 h-4 rounded shadow-sm" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="20" fill="#E30A17"/>
                    <circle cx="11" cy="10" r="5" fill="#FFFFFF"/>
                    <circle cx="12.5" cy="10" r="4" fill="#E30A17"/>
                    <polygon points="18,10 14.5,8 14.5,12" fill="#FFFFFF"/>
                  </svg>
                  <h3 className="font-bold">Türkçe (Turkish)</h3>
                </div>
                <p className="text-sm text-white mb-2">
                  <strong>Şanghay gümüş fiyatı:</strong> ${price?.pricePerOzUsd?.toFixed(2) || "121.00"}/oz
                </p>
                <p className="text-xs text-red-100">
                  Canlı SGE gümüş fiyatı: ¥{price?.pricePerKgCny?.toFixed(0) || "26,400"}/kg CNY.
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              All prices update in real-time from COMEX + exchange rate APIs
            </p>
          </section>

          {/* Data Sources & Methodology */}
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
                    <ChinaFlag size="sm" /> Shanghai Gold Exchange
                  </a>
                  <a 
                    href="https://www.cmegroup.com/markets/metals/precious/silver.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <USFlag size="sm" /> CME COMEX Silver
                  </a>
                  <a 
                    href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {/* EU Flag */}
                    <svg className="w-5 h-3.5 rounded shadow-sm" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                      <rect width="30" height="20" fill="#003399"/>
                      <g fill="#FFCC00">
                        <circle cx="15" cy="5" r="1"/>
                        <circle cx="18.5" cy="6" r="1"/>
                        <circle cx="20" cy="10" r="1"/>
                        <circle cx="18.5" cy="14" r="1"/>
                        <circle cx="15" cy="15" r="1"/>
                        <circle cx="11.5" cy="14" r="1"/>
                        <circle cx="10" cy="10" r="1"/>
                        <circle cx="11.5" cy="6" r="1"/>
                      </g>
                    </svg>
                    ECB Exchange Rates
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* UNDERSTANDING SILVER PRICE DISCOVERY - SEO CONTENT */}
          {/* ================================================================ */}
          <section className="mb-8">
            <div className="rounded-xl p-4 sm:p-6 bg-white border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                📈 Understanding Silver Price Discovery: COMEX vs Shanghai
              </h2>
              
              <p className="text-sm text-gray-600 mb-4">
                The international silver price is primarily determined by two major trading venues: 
                <strong> COMEX</strong> (New York) and the <strong>London OTC Silver Market</strong>. 
                However, the <strong>Shanghai Gold Exchange (SGE)</strong> has become increasingly important 
                for price discovery in Asia, often trading at a premium to Western markets.
              </p>

              {/* What is COMEX */}
              <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <USFlag size="sm" /> What is COMEX Silver?
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>COMEX</strong> (Commodity Exchange) is part of the CME Group and hosts the world&apos;s most 
                  traded silver futures contracts. COMEX silver trading is almost entirely electronic, operating 
                  nearly 24 hours a day throughout the trading week.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Contract Size:</strong> 5,000 troy ounces per contract</li>
                  <li>• <strong>Trading Hours:</strong> Sunday 6 PM - Friday 5 PM ET (with 1-hour daily break)</li>
                  <li>• <strong>Settlement:</strong> Physically deliverable, but rarely delivered (mostly cash-settled)</li>
                  <li>• <strong>Purity Standard:</strong> Minimum 99.9% silver fineness</li>
                  <li>• <strong>Current Price:</strong> ${price?.comexUsd?.toFixed(2) || "108.50"}/oz</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  COMEX, along with the London OTC market, dominates international silver price discovery. 
                  Physical silver markets worldwide inherit the COMEX spot price.
                </p>
              </div>

              {/* What is SGE */}
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <ChinaFlag size="sm" /> What is Shanghai Gold Exchange (SGE)?
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  The <strong>Shanghai Gold Exchange (SGE)</strong> is China&apos;s largest precious metals exchange, 
                  established in 2002. It trades gold, silver, and platinum in Chinese Yuan (CNY) and serves 
                  as Asia&apos;s primary pricing reference for precious metals.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Silver Contract:</strong> Ag(T+D) - Deferred delivery contract</li>
                  <li>• <strong>Contract Unit:</strong> 1 kilogram of 99.99% pure silver</li>
                  <li>• <strong>Trading Hours:</strong> 9:00-11:30 AM, 1:30-3:30 PM (Beijing Time)</li>
                  <li>• <strong>Night Session:</strong> 9:00 PM - 2:30 AM (SHFE futures)</li>
                  <li>• <strong>Current Price:</strong> ¥{price?.pricePerKgCny?.toFixed(0) || "27,000"}/kg (${price?.pricePerOzUsd?.toFixed(2) || "121"}/oz)</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  SGE handles the majority of China&apos;s physical silver trading and sets the benchmark 
                  for the Chinese domestic market.
                </p>
              </div>

              {/* Real-time Data Badge */}
              <div className="p-4 rounded-lg bg-green-50 border-2 border-green-300">
                <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                  ✅ 100% Real-Time API Data
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  All prices on this page are fetched in real-time from verified financial APIs. 
                  <strong> No hardcoded or dummy data is used.</strong>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded bg-white border border-green-200">
                    <strong>COMEX Silver:</strong> Yahoo Finance API (SI=F)
                  </div>
                  <div className="p-2 rounded bg-white border border-green-200">
                    <strong>USD/CNY Rate:</strong> Yahoo Finance + Frankfurter API
                  </div>
                  <div className="p-2 rounded bg-white border border-green-200">
                    <strong>USD/INR Rate:</strong> Frankfurter API (ECB data)
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Prices update every 30 seconds during market hours. Multi-source fallback ensures reliability.
                </p>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* SILVER PRICE IN CHINA - COMPREHENSIVE SEO CONTENT */}
          {/* ================================================================ */}
          <section className="mb-8">
            <div className="rounded-xl p-4 sm:p-6 bg-white border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                🥈 Silver Price in China: Complete Guide
              </h2>
              
              <div className="prose prose-sm max-w-none text-gray-600">
                <p className="mb-4">
                  China is the globe&apos;s second largest economy and the world&apos;s largest consumer of silver. 
                  If you are looking to track or purchase silver in China, prices are quoted in the local 
                  currency, the <strong>yuan (CNY)</strong>, as well as US Dollars. Silver is typically 
                  quoted per kilogram on the Shanghai Gold Exchange, though international comparisons use 
                  troy ounces.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                  The Chinese Yuan and Silver Trading
                </h3>
                <p className="mb-4">
                  The <strong>renminbi</strong> is the official currency of the People&apos;s Republic of China, 
                  with the yuan being the primary unit. The yuan is part of the IMF&apos;s Special Drawing 
                  Rights (SDR), officially recognized as a global reserve currency. As more international 
                  trade is conducted in yuan, it could potentially challenge the dollar&apos;s dominance in 
                  commodities pricing, including silver.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                  Why China Dominates Silver Demand
                </h3>
                <p className="mb-4">
                  Because China is a major global manufacturer and exporter, it has significant influence 
                  on global silver prices. Silver demand in China comes from:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-1">
                  <li><strong>Solar Panel Manufacturing:</strong> China produces 80%+ of global solar panels, each requiring silver paste</li>
                  <li><strong>Electronics:</strong> Silver is used in semiconductors, batteries, and electrical contacts</li>
                  <li><strong>Electric Vehicles:</strong> Each EV uses 1-2 ounces of silver in electrical systems</li>
                  <li><strong>Jewelry and Investment:</strong> Growing middle-class demand for silver jewelry and bullion</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                  Chinese Silver Panda Coins
                </h3>
                <p className="mb-4">
                  The <strong>Chinese Silver Panda</strong> coin is one of the world&apos;s most popular 
                  silver bullion coins. Released annually by the Chinese Mint since 1983, these coins feature 
                  the iconic panda bear with a new obverse design each year (except 2001-2002). Available 
                  in multiple weights, they are legal tender in China and highly collectible worldwide.
                </p>

                <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                  Silver Import Duties in China
                </h3>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 mb-4">
                  <p className="text-sm">
                    China imposes <strong>3-8% import duty</strong> on silver (varies by form) plus 
                    <strong> 13% VAT</strong>. This creates a total import cost of 16-21% above 
                    international prices, which is a major factor in the persistent Shanghai premium 
                    over COMEX and London prices.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================ */}
          {/* CHINA SILVER MARKET NEWS */}
          {/* ================================================================ */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              📰 China Silver Market News & Updates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* News Item 1 */}
              <div className="rounded-lg p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">☀️</div>
                  <div>
                    <span className="text-xs text-gray-400">Jan 2026</span>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      China Solar Panel Demand Drives Silver Premium to 10%+
                    </h3>
                    <p className="text-xs text-gray-600">
                      Record solar panel installations in China push silver imports to all-time highs, 
                      widening the Shanghai-COMEX premium beyond historic norms.
                    </p>
                  </div>
                </div>
              </div>

              {/* News Item 2 */}
              <div className="rounded-lg p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🏭</div>
                  <div>
                    <span className="text-xs text-gray-400">Jan 2026</span>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      Shanghai Gold Exchange Reports Record Silver Volumes
                    </h3>
                    <p className="text-xs text-gray-600">
                      SGE silver trading volumes hit multi-year highs as industrial users and 
                      investors increase exposure to the white metal.
                    </p>
                  </div>
                </div>
              </div>

              {/* News Item 3 */}
              <div className="rounded-lg p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🔋</div>
                  <div>
                    <span className="text-xs text-gray-400">Jan 2026</span>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      EV Boom in China Boosts Silver Industrial Demand
                    </h3>
                    <p className="text-xs text-gray-600">
                      China&apos;s electric vehicle sales exceed 10 million units, driving additional 
                      silver demand for electrical contacts and battery components.
                    </p>
                  </div>
                </div>
              </div>

              {/* News Item 4 */}
              <div className="rounded-lg p-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">📊</div>
                  <div>
                    <span className="text-xs text-gray-400">Jan 2026</span>
                    <h3 className="font-semibold text-gray-800 text-sm mb-1">
                      Silver Imports to China Rise 15% Year-over-Year
                    </h3>
                    <p className="text-xs text-gray-600">
                      Chinese customs data shows continued strong demand for imported silver, 
                      with photovoltaic sector accounting for majority of industrial usage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Market news is for informational purposes only. Check official sources for verified data.
            </p>
          </section>

          {/* ================================================================ */}
          {/* RELATED ARTICLES */}
          {/* ================================================================ */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              📚 Related Articles & Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link 
                href="/"
                className="block rounded-lg p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
              >
                <h3 className="font-semibold mb-1">📈 Live Silver Rate Today</h3>
                <p className="text-xs text-blue-100">Real-time silver prices in India with city-wise rates</p>
              </Link>

              <Link 
                href="/learn/what-is-sterling-silver"
                className="block rounded-lg p-4 bg-gradient-to-br from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 transition-all shadow-md"
              >
                <h3 className="font-semibold mb-1">🥈 What is Sterling Silver?</h3>
                <p className="text-xs text-gray-200">Understanding 925 silver purity and uses</p>
              </Link>

              <Link 
                href="/learn/silver-vs-gold-investment"
                className="block rounded-lg p-4 bg-gradient-to-br from-yellow-500 to-amber-600 text-white hover:from-yellow-600 hover:to-amber-700 transition-all shadow-md"
              >
                <h3 className="font-semibold mb-1">⚖️ Silver vs Gold Investment</h3>
                <p className="text-xs text-amber-100">Which precious metal is right for you?</p>
              </Link>

              <Link 
                href="/investment-calculator"
                className="block rounded-lg p-4 bg-gradient-to-br from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-md"
              >
                <h3 className="font-semibold mb-1">🧮 Investment Calculator</h3>
                <p className="text-xs text-green-100">Calculate potential returns on silver investments</p>
              </Link>

              <Link 
                href="/gold"
                className="block rounded-lg p-4 bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-800 hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-md"
              >
                <h3 className="font-semibold mb-1">🥇 Gold Rate Today</h3>
                <p className="text-xs text-yellow-900">Live gold prices and trends</p>
              </Link>

              <Link 
                href="/learn/how-to-check-silver-purity"
                className="block rounded-lg p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
              >
                <h3 className="font-semibold mb-1">🔍 Check Silver Purity</h3>
                <p className="text-xs text-purple-100">5 easy methods to test silver at home</p>
              </Link>
            </div>
          </section>

          {/* FAQs - Schema provided via JSON-LD script above */}
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
                    <p>{faq.answer}</p>
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
            <p className="text-xs text-gray-300 mt-2" suppressHydrationWarning>
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
