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
import { USFlag, ChinaFlag, UKFlag, IndiaFlag, AustraliaFlag } from "@/components/Flags";
import { LiveTimeDisplay, LiveDateDisplay } from "@/components/shanghai/LiveTimeDisplay";
import ShareButtons from "@/components/ui/ShareButtons";
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
  
  // Fetch real price for dynamic metadata
  const price = await getShanghaiSilverPrice();
  const priceUsd = price?.pricePerOzUsd?.toFixed(0) || "102";
  const priceCny = price?.pricePerKgCny?.toFixed(0) || "22000";
  const premium = price?.premiumPercent?.toFixed(0) || "4";
  const comexUsd = price?.comexUsd?.toFixed(0) || "98";
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return {
    // Title: Answer-first with price and date, optimized for CTR
    title: `Shanghai Silver Price Today ${todayStr} - $${priceUsd}/oz | +${premium}% Premium`,
    // Description: Answer-first, unique value, clear CTA
    description: `Shanghai Silver: $${priceUsd}/oz (¥${priceCny}/kg) vs COMEX $${comexUsd}/oz. Premium +${premium}%. Live 60s updates, 7-day chart, trading hours tracker. Excludes 13% VAT. Compare SGE vs COMEX now.`,
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
      "silberpreis shanghai in dollar",
      "silberpreis shanghai",
      // Polish keywords (38+ impressions)
      "kurs srebra szanghaj",
      // Common misspellings (captures typos)
      "sangai silver price",
      "sangai silver rate",
      "singhai silver price",
      // More variations
      "shanghai silver price per ounce in usd",
      "shanghai silver price per gram",
      "shanghai silver dollar",
      "shanghai silver usd",
      "silver shanghai price usd",
      "sge silver price today usd",
      "shfe silver price today",
      "shanghai silver premium over comex",
      // High-impression keywords
      "shanghai silver price live",
      "shanghai silver spot price",
      "shanghai silver premium",
      "shanghai silver rate",
      "shanghai silver price right now",
      "shanghai spot silver price in usd",
      "shanghai silver price in indian rupees",
      "shanghai physical silver price",
      "comex vs shanghai silver price",
      "shanghai vs comex silver price",
      "shanghai comex silver price",
      "shanghai silver vs comex",
      "silver rate in shanghai",
      "silver rate in shanghai exchange",
      "silver price in shanghai exchange",
      "shanghai exchange silver price today",
      "shanghai live silver price today",
      "shanghai silver price live usd",
      "china silver price today shanghai premium",
    ],
    openGraph: {
      title: `Shanghai Silver $${priceUsd}/oz | COMEX $${comexUsd} +${premium}% Premium`,
      description: `Shanghai Silver: $${priceUsd}/oz vs COMEX $${comexUsd}/oz (+${premium}% premium). Live prices, 7-day chart, trading hours. VAT excluded.`,
      type: "website",
      locale: "en_US",
      siteName: "SilverInfo.in",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Shanghai Silver Price $${priceUsd}/oz vs COMEX $${comexUsd}/oz - ${dateString}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Shanghai Silver $${priceUsd}/oz vs COMEX $${comexUsd}/oz`,
      description: `Premium +${premium}%. Live SGE price: ¥${priceCny}/kg. Compare with COMEX. 60s updates.`,
    },
    alternates: {
      canonical: "/shanghai-silver-price",
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
// FAQ DATA (Enhanced for Featured Snippets)
// ============================================================================

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  // VAT QUESTIONS FIRST - #1 searched queries (52+ impressions)
  {
    question: "Does Shanghai Gold Exchange silver spot price include VAT?",
    answer: "No, Shanghai Gold Exchange (SGE) silver spot prices do NOT include VAT. The Ag(T+D) price is pre-tax. For physical delivery in China, add 13% VAT. So if SGE shows ¥27,000/kg, actual cost with VAT is ¥30,510/kg. Industrial buyers can recover VAT as input tax credit."
  },
  {
    question: "Does SGE silver price include VAT?",
    answer: "No, SGE (Shanghai Gold Exchange) silver prices are quoted WITHOUT VAT. The displayed Ag(T+D) benchmark is a pre-tax price. Physical delivery requires 13% VAT payment. This is why the 'Shanghai premium' calculation should use pre-tax SGE prices for fair COMEX comparison."
  },
  {
    question: "What is the Shanghai silver price today?",
    answer: "Shanghai silver price today is displayed in real-time at the top of this page. The Shanghai Gold Exchange (SGE) quotes silver in CNY per kilogram. Shanghai typically trades 8-15% above COMEX due to Chinese demand and import costs. Prices update every 30 seconds during trading hours: 9 AM-11:30 AM and 1:30-3:30 PM Beijing time."
  },
  {
    question: "What is SGE silver price?",
    answer: "SGE silver price is the benchmark price for silver traded on the Shanghai Gold Exchange, quoted in Chinese Yuan (CNY) per kilogram. Check the live price card above for current SGE rates. SGE is Asia's largest precious metals exchange and sets the reference price for the Chinese silver market with 99.99% (four nines) purity standard."
  },
  {
    question: "Why is Shanghai silver more expensive than COMEX?",
    answer: "Shanghai silver trades 5-15% above COMEX due to: (1) Chinese import duties (0-11% depending on origin) and VAT (13%), (2) China's massive industrial demand (70% global consumption for solar panels and electronics), (3) limited domestic supply forcing imports of 70% of needs, and (4) growing retail investment demand. See the premium tracker above for current spread."
  },
  {
    question: "How to convert Shanghai silver price to USD?",
    answer: "Convert Shanghai silver (CNY/kg) to USD per ounce in 3 steps: (1) Divide CNY/kg by current USD/CNY exchange rate (~7.0), (2) Divide result by 32.15 troy ounces per kilogram. Our page auto-calculates this conversion every 30 seconds - see the USD price displayed above."
  },
  {
    question: "What time does Shanghai silver market open?",
    answer: "Shanghai silver markets open at 9:00 AM Beijing time (CST) for the morning session (9:00-11:30 AM), followed by afternoon session (1:30-3:30 PM). Night trading on Shanghai Futures Exchange (SHFE) runs 9:00 PM-2:30 AM. Markets close weekends and major Chinese holidays. See live status above."
  },
  {
    question: "What is the Shanghai silver benchmark price?",
    answer: "Shanghai silver benchmark price is the official reference rate set by Shanghai Gold Exchange (SGE), quoted as Ag(T+D) contract in CNY per kilogram. Check the live benchmark price at the top of this page. It represents 99.99% pure silver (four nines fineness) and serves as Asia's primary pricing reference, influencing regional premiums and import/export arbitrage opportunities."
  },
  {
    question: "Shanghai vs COMEX silver - which is higher?",
    answer: "Shanghai silver consistently trades 5-15% higher than COMEX (New York) silver. See our live comparison above showing current prices and premium percentage. This premium reflects Chinese import costs, high industrial demand, and supply constraints. The spread fluctuates based on market conditions."
  },
  {
    question: "How accurate is Shanghai silver price data on SilverInfo?",
    answer: "Our Shanghai silver prices are ESTIMATES calculated from COMEX futures + live USD/CNY exchange rates + an estimated premium (2-8%). For official SGE Ag(T+D) prices, visit en.sge.com.cn. We update every 60 seconds. 100% API-driven with no manual adjustments."
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
    answer: "Current Shanghai and COMEX silver prices in USD per troy ounce are displayed live at the top of this page. The difference (8-15% premium) reflects Chinese market conditions including import duties and strong demand. Our page shows real-time USD prices converted from CNY using live exchange rates."
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
    question: "What unit is Shanghai silver price quoted in?",
    answer: "Shanghai Gold Exchange (SGE) quotes silver in Chinese Yuan per kilogram (CNY/kg or ¥/kg). See the current price above. To convert to USD per ounce: divide by USD/CNY exchange rate (~7.0), then divide by 32.15 troy ounces per kg. Our page auto-calculates this for you."
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
    answer: "Shanghai silver price = (COMEX Silver USD/oz × USD/CNY exchange rate × 32.1507 oz/kg) × (1 + Shanghai Premium). We estimate the premium at 2-8% based on market conditions. Actual SGE premium can vary (historical range: 2-30%+) based on Chinese demand, import duties, and VAT. Visit en.sge.com.cn for official prices."
  },
  {
    question: "What is the China silver price today in yuan?",
    answer: "The China silver price today in yuan (CNY) is displayed live at the top of this page. SGE quotes in CNY per kilogram, and we also show per gram prices. Silver prices fluctuate based on global demand and the Shanghai premium. Check our live prices for real-time CNY rates updated every 30 seconds."
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
    answer: "London (LBMA) sets the global silver benchmark in USD/oz, while Shanghai (SGE) trades in CNY/kg with a premium. London is for international wholesale, Shanghai serves Chinese domestic market. The Shanghai premium (typically 2-8%, but can reach 30%+ during high demand) reflects Chinese demand dynamics and import costs."
  },
  {
    question: "Can foreigners buy silver on Shanghai Gold Exchange?",
    answer: "Foreign institutional investors can access SGE through the Shanghai-Hong Kong Stock Connect or SGE International Board (launched 2014). Retail foreigners cannot directly trade SGE. Most international investors use COMEX or London markets instead."
  },
  {
    question: "What is China silver import duty and VAT?",
    answer: "China imposes 0-11% import duty on silver (varies by origin and form) plus 13% VAT. Total import costs add 13-24% to international prices. This tax structure, combined with logistics and demand, creates the persistent Shanghai premium over COMEX/London prices."
  },
  // Additional FAQs for high-impression GSC queries
  {
    question: "Does SHFE silver futures price include VAT?",
    answer: "No, SHFE (Shanghai Futures Exchange) silver futures prices do NOT include VAT. Like SGE Ag(T+D), SHFE AG contracts are quoted pre-tax. For physical delivery, 13% VAT applies. Most futures traders close positions before delivery, avoiding VAT. Check our live prices above for current SHFE-equivalent rates."
  },
  {
    question: "What is the current SHFE silver price in CNY per kg?",
    answer: "Current SHFE silver futures price in CNY per kg is displayed at the top of this page. SHFE trades the AG contract (silver futures) which typically tracks closely with SGE Ag(T+D) spot prices. Prices update every 30 seconds during trading hours. Look for the CNY/kg display in the price card above."
  },
  {
    question: "Shanghai silver price per ounce in dollars - how much?",
    answer: "Current Shanghai silver price in USD per ounce is shown live at the top of this page. We convert from CNY/kg to USD/oz using real-time exchange rates. Today's Shanghai silver trades at a premium to COMEX (shown in our comparison tracker). Check the USD price display above for the latest rate."
  },
  {
    question: "Why is Shanghai silver price so high compared to COMEX?",
    answer: "Shanghai silver is 8-20% higher than COMEX because: (1) China imports 70% of its silver needs, (2) 13% VAT + import duties add costs, (3) World's largest solar panel production drives industrial demand, (4) Limited domestic mining supply, (5) Growing retail investment. Our premium tracker above shows today's exact spread."
  },
  {
    question: "Is Shanghai silver market open right now?",
    answer: "Check the market status indicator at the top of this page for real-time Shanghai market status. SGE trading hours: Morning 9:00-11:30, Afternoon 13:30-15:30 Beijing time. SHFE night session: 21:00-02:30. Markets close weekends and Chinese holidays. We display current Beijing time and session status."
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

      <div className="min-h-screen">
        {/* Hero Section - Compact for more above-fold content */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-3 sm:py-4 lg:py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header - Compact */}
            <div className="mb-3 sm:mb-4">
              {/* Status Badges + Title in same row on desktop */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900" suppressHydrationWarning>
                  Shanghai Silver Price Today - {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                  <span className="relative flex h-1.5 w-1.5 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  Live
                </span>
                <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${marketStatus.isOpen ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                  🇨🇳 SGE {marketStatus.isOpen ? 'Open' : 'Closed'}
                </span>
                <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${comexStatus.isOpen ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-100 text-gray-600'}`}>
                  🇺🇸 COMEX {comexStatus.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="text-[#1e3a5f] font-semibold">Calculated, Not Copied.</span> Live SGE rate • Shanghai vs COMEX premium • 30s updates • 
                <span className="font-semibold text-amber-700">¥{price?.pricePerKgCny?.toLocaleString()}/kg</span>
              </p>
            </div>

            {/* Hero Section - Two Column Layout (side by side on md+) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {/* Left: Shanghai vs COMEX Comparison */}
              <div className="card p-0 overflow-visible flex flex-col" id="comparison">
              {/* Header - Matching ShanghaiPriceCard style */}
              <div 
                className="px-4 py-3 flex items-center justify-between rounded-t-lg"
                style={{ background: "linear-gradient(90deg, #1e293b 0%, #334155 100%)" }}
              >
                <div className="flex items-center gap-2">
                  {/* Both flags for comparison */}
                  <div className="flex -space-x-1">
                    <USFlag size="sm" />
                    <ChinaFlag size="sm" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">Shanghai vs COMEX Silver</h2>
                    <p className="text-[11px] text-white/70">Real-time comparison • Premium tracker</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Market Status Badges */}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${marketStatus.isOpen ? 'bg-emerald-500/90 text-white' : 'bg-white/30 text-white'}`}>
                    SGE {marketStatus.isOpen ? '●' : '○'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${comexStatus.isOpen ? 'bg-emerald-500/90 text-white' : 'bg-white/30 text-white'}`}>
                    CMX {comexStatus.isOpen ? '●' : '○'}
                  </span>
                  
                  {/* Live indicator */}
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 bg-white/20 text-white">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400"></span>
                    </span>
                    LIVE
                  </span>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                {/* Main Comparison Grid - Cleaner Style */}
                <div className="grid grid-cols-3 gap-3 items-stretch">
                  {/* COMEX Card */}
                  <div className="group relative text-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-lg">🇺🇸</span>
                      <span className="text-sm font-semibold text-gray-800">COMEX</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      ${price?.comexUsd?.toFixed(2) || "77.11"}
                    </div>
                    <div className="text-xs text-gray-500">/oz</div>
                    {price?.change24hPercent !== undefined && Math.abs(price.change24hPercent) > 0.01 ? (
                      <div className={`text-xs font-medium mt-1 ${price.change24hPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {price.change24hPercent >= 0 ? '▲' : '▼'} {Math.abs(price.change24hPercent).toFixed(2)}%
                      </div>
                    ) : null}
                    <p className="text-xs text-gray-500 mt-2">Global benchmark (NY)</p>
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-52 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl">
                        <p className="font-bold text-blue-400 mb-1">🇺🇸 COMEX Silver</p>
                        <p>Global benchmark from CME Group. Most liquid futures contract.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Premium Arrow */}
                  <div className="group relative flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                    <div className="text-2xl text-green-600 mb-1">→</div>
                    <div className="text-xl font-bold text-green-700">
                      +{price?.premiumPercent?.toFixed(1) || "5.9"}%
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      +${price?.premiumUsd?.toFixed(2) || "4.57"}/oz
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Shanghai Premium</p>
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-48 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl">
                        <p className="font-bold text-green-400 mb-1">📈 Premium Factors</p>
                        <p>Import duties + 13% VAT + strong demand = 2-8% premium</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shanghai Card */}
                  <div className="group relative text-center p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span className="text-lg">🇨🇳</span>
                      <span className="text-sm font-semibold text-gray-800">Shanghai</span>
                    </div>
                    <div className="text-2xl font-bold text-red-700">
                      ${price?.pricePerOzUsd?.toFixed(2) || "81.68"}
                    </div>
                    <div className="text-xs text-gray-500">/oz</div>
                    <p className="text-xs text-gray-500 mt-2">+{price?.premiumPercent?.toFixed(0) || "6"}% premium (SGE)</p>
                    {/* Tooltip */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-48 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl">
                        <p className="font-bold text-red-400 mb-1">🇨🇳 Shanghai SGE</p>
                        <p>Calculated from COMEX + estimated premium. Ag(T+D) contract.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Key Prices Summary - Cleaner */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-xs text-gray-500">CNY/kg</p>
                      <p className="text-sm font-bold text-gray-800">¥{price?.pricePerKgCny?.toLocaleString() || "22,000"}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-xs text-gray-500">USD/g</p>
                      <p className="text-sm font-bold text-gray-800">${price?.pricePerGramUsd?.toFixed(2) || "2.63"}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-xs text-gray-500">INR/g</p>
                      <p className="text-sm font-bold text-gray-800">₹{price?.pricePerGramInr?.toFixed(0) || "241"}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-xs text-gray-500">USD/CNY</p>
                      <p className="text-sm font-bold text-blue-700">{price?.usdCny?.toFixed(2) || "7.25"}</p>
                    </div>
                  </div>
                </div>
                
                {/* Important Disclaimer Banner */}
                <div className="mt-3 p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-[11px] text-amber-800 text-center">
                    <span className="font-semibold">⚠️ Estimated Price:</span> Calculated from COMEX + {price?.premiumPercent?.toFixed(0) || "4"}% premium. 
                    <a 
                      href="https://en.sge.com.cn/data_SilverBenchmarkPrice" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium underline hover:text-amber-900 ml-1"
                    >
                      Official SGE prices →
                    </a>
                  </p>
                </div>
                
                {/* Share Buttons - Compact (mt-auto pushes to bottom) */}
                <div className="mt-auto pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-400 mb-2 text-center">Share:</p>
                  <ShareButtons 
                    url="https://silverinfo.in/shanghai-silver-price" 
                    title={`Shanghai Silver: $${price?.pricePerOzUsd?.toFixed(2) || "102"}/oz (+${price?.premiumPercent?.toFixed(1) || "4"}% vs COMEX) | SilverInfo.in`}
                    variant="light"
                    size="compact"
                  />
                </div>
              </div>
              </div>

              {/* Right: Shanghai Price Card */}
              <section id="live-price" className="scroll-mt-24 h-full">
                <ShanghaiPriceCard initialPrice={price} />
              </section>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="pb-4 sm:pb-6 bg-gradient-to-br from-gray-50 to-gray-100 -mt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2">

            {/* ================================================================ */}
            {/* BENCHMARK PRICE SECTION */}
            {/* ================================================================ */}
            <section id="benchmark" className="mb-4 scroll-mt-24">
              <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">📊 Shanghai Silver Benchmark</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* Current Benchmark */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-center">
                    <h3 className="text-sm text-gray-300 mb-2">Current SGE Benchmark</h3>
                    <div className="text-3xl font-bold text-white mb-1">
                      ¥{price?.pricePerKgCny?.toFixed(0) || "18,256"}/kg
                    </div>
                    <div className="text-sm text-gray-400">CNY per kilogram</div>
                    <div className="text-sm text-green-400 mt-2">
                      ≈ ${price?.pricePerOzUsd?.toFixed(2) || "81.68"}/oz
                    </div>
                  </div>
                  
                  {/* Benchmark Info */}
                  <div className="p-4 rounded-lg bg-gray-50 border-2 border-gray-400">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">About the Benchmark:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {/* Exchange - with tooltip */}
                      <li className="relative group cursor-help">
                        <span className="flex items-center gap-1">
                          📍 <strong>Exchange:</strong> Shanghai Gold Exchange (SGE)
                          <span className="text-gray-400 text-xs">ⓘ</span>
                        </span>
                        <div className="absolute bottom-full left-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-64 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl">
                            <strong>Shanghai Gold Exchange (SGE)</strong> - China's largest precious metals exchange, established in 2002. Sets official silver benchmark prices for Chinese market. Only exchange for physical silver delivery in China.
                            <div className="absolute bottom-0 left-4 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        </div>
                      </li>
                      {/* Unit - with tooltip */}
                      <li className="relative group cursor-help">
                        <span className="flex items-center gap-1">
                          📏 <strong>Unit:</strong> CNY per kilogram
                          <span className="text-gray-400 text-xs">ⓘ</span>
                        </span>
                        <div className="absolute bottom-full left-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-64 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl">
                            <strong>CNY/kg</strong> - Chinese Yuan per kilogram. Unlike COMEX (USD/oz), SGE quotes in kilograms. 1 kg = 32.15 troy oz. Current rate: ¥{price?.pricePerKgCny?.toLocaleString() || "18,256"}/kg ≈ ${price?.pricePerOzUsd?.toFixed(2) || "81"}/oz
                            <div className="absolute bottom-0 left-4 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        </div>
                      </li>
                      {/* Contract - with tooltip */}
                      <li className="relative group cursor-help">
                        <span className="flex items-center gap-1">
                          ⚖️ <strong>Contract:</strong> Ag(T+D)
                          <span className="text-gray-400 text-xs">ⓘ</span>
                        </span>
                        <div className="absolute bottom-full left-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-64 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl">
                            <strong>Ag(T+D)</strong> - "Silver Today + Deferred". Unique Chinese contract allowing same-day trading with deferred delivery. Combines spot & futures benefits. Highly liquid with physical delivery option. Trade size: 1 kg/lot.
                            <div className="absolute bottom-0 left-4 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        </div>
                      </li>
                      {/* Purity - with tooltip */}
                      <li className="relative group cursor-help">
                        <span className="flex items-center gap-1">
                          🏭 <strong>Purity:</strong> 99.99% (9999)
                          <span className="text-gray-400 text-xs">ⓘ</span>
                        </span>
                        <div className="absolute bottom-full left-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-64 pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl">
                            <strong>99.99% (Four Nines)</strong> - Highest commercial purity. "9999" means 9999 parts per 10,000 are pure silver. Required for SGE delivery. COMEX allows 99.9% (999). Higher purity = slight price premium.
                            <div className="absolute bottom-0 left-4 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Global Benchmarks Comparison */}
                <h3 className="font-semibold text-gray-800 text-sm mb-3">🌍 Global Silver Benchmarks</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* SGE - China */}
                  <div className="relative group p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-center cursor-help">
                    <span className="text-lg">🇨🇳</span>
                    <p className="text-xs text-gray-500">SGE <span className="text-gray-400">ⓘ</span></p>
                    <p className="font-bold text-red-700">¥{(price?.pricePerKgCny ? price.pricePerKgCny / 1000 : 18.3).toFixed(1)}k/kg</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-56 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl text-left">
                        <strong>SGE (Shanghai Gold Exchange)</strong> - China's official precious metals exchange. Prices in CNY/kg. Includes ~6% premium over COMEX due to import duties & VAT. World's largest physical silver market.
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  {/* COMEX - USA */}
                  <div className="relative group p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-center cursor-help">
                    <span className="text-lg">🇺🇸</span>
                    <p className="text-xs text-gray-500">COMEX <span className="text-gray-400">ⓘ</span></p>
                    <p className="font-bold text-blue-700">${price?.comexUsd?.toFixed(2) || "77.11"}/oz</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-56 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl text-left">
                        <strong>COMEX (CME Group)</strong> - World's primary silver futures exchange in New York. Prices in USD/troy oz. Global benchmark for silver pricing. Trades nearly 24/5. Most liquid silver market.
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  {/* MCX - India */}
                  <div className="relative group p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-center cursor-help">
                    <span className="text-lg">🇮🇳</span>
                    <p className="text-xs text-gray-500">MCX <span className="text-gray-400">ⓘ</span></p>
                    <p className="font-bold text-orange-700">₹{((price?.indiaRatePerGram || 262) * 1000 / 1000).toFixed(0)}k/kg</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-56 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl text-left">
                        <strong>MCX (Multi Commodity Exchange)</strong> - India's largest commodity exchange in Mumbai. Prices in INR/kg. Includes import duty (~15%) & GST. Trades Mon-Fri 9AM-11:30PM IST.
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  {/* LBMA - UK */}
                  <div className="relative group p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-center cursor-help">
                    <span className="text-lg">🇬🇧</span>
                    <p className="text-xs text-gray-500">LBMA <span className="text-gray-400">ⓘ</span></p>
                    <p className="font-bold text-purple-700">${((price?.comexUsd || 77.11) * 1.007).toFixed(2)}/oz</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-56 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl text-left">
                        <strong>LBMA (London Bullion Market)</strong> - Sets daily "London Fix" price at 12:00 GMT. OTC wholesale market for physical delivery. Price in USD/oz. Standard for large institutional trades (1000 oz bars).
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================================================================ */}
            {/* SHANGHAI SILVER PRICE IN USD / DOLLARS - SEO Section */}
            {/* ================================================================ */}
            {price && (
            <section id="usd-price" className="mb-4 scroll-mt-24">
              <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">💵 Shanghai Silver Price in USD (Dollars)</h2>
                <p className="text-xs text-gray-500 mb-4">Live Shanghai silver price converted to US Dollars • Updated every 30 seconds</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {/* Per Troy Ounce */}
                  <div className="relative group p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-center cursor-help">
                    <p className="text-xs text-gray-500">Per Troy Ounce <span className="text-gray-400">ⓘ</span></p>
                    <p className="text-2xl font-bold text-green-700">${price.pricePerOzUsd.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400">USD/oz</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-56 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl text-left">
                        <strong>Troy Ounce (oz t)</strong> - Standard unit for precious metals. 1 troy oz = 31.1035 grams. Shanghai price: ${price.pricePerOzUsd.toFixed(2)}/oz includes +{price.premiumPercent.toFixed(1)}% premium over COMEX.
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  {/* Per Gram */}
                  <div className="relative group p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-center cursor-help">
                    <p className="text-xs text-gray-500">Per Gram <span className="text-gray-400">ⓘ</span></p>
                    <p className="text-2xl font-bold text-blue-700">${price.pricePerGramUsd.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400">USD/g</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-56 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl text-left">
                        <strong>Price per Gram</strong> - Common retail unit. 1 oz = 31.1 grams. Formula: ${price.pricePerOzUsd.toFixed(2)} ÷ 31.1035 = ${price.pricePerGramUsd.toFixed(2)}/g. Useful for small purchases.
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  {/* Per Kilogram */}
                  <div className="relative group p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 text-center cursor-help">
                    <p className="text-xs text-gray-500">Per Kilogram <span className="text-gray-400">ⓘ</span></p>
                    <p className="text-2xl font-bold text-purple-700">${price.pricePerKgUsd.toFixed(0)}</p>
                    <p className="text-[10px] text-gray-400">USD/kg</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-56 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl text-left">
                        <strong>Price per Kilogram</strong> - SGE standard unit. 1 kg = 32.15 oz. Formula: ${price.pricePerGramUsd.toFixed(2)} × 1000 = ${price.pricePerKgUsd.toFixed(0)}/kg. Direct comparison with SGE ¥{price.pricePerKgCny.toLocaleString()}/kg.
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                  {/* COMEX Benchmark */}
                  <div className="relative group p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-cyan-100 border border-cyan-200 text-center cursor-help">
                    <p className="text-xs text-gray-500">COMEX Benchmark <span className="text-gray-400">ⓘ</span></p>
                    <p className="text-2xl font-bold text-cyan-700">${price.comexUsd.toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400">USD/oz (NY)</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] w-56 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-2xl text-left">
                        <strong>COMEX (New York)</strong> - Global silver benchmark. Shanghai trades at +{price.premiumPercent.toFixed(1)}% premium (${(price.pricePerOzUsd - price.comexUsd).toFixed(2)}/oz more). Difference due to Chinese import duties & VAT.
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                  <p className="text-gray-700">
                    <strong>Shanghai silver price in dollars:</strong> ${price.pricePerOzUsd.toFixed(2)} per ounce, which is +{price.premiumPercent.toFixed(1)}% above COMEX (${price.comexUsd.toFixed(2)}/oz). 
                    This premium reflects Chinese import duties, VAT, and strong industrial demand. Price converted using USD/CNY rate of {price.usdCny.toFixed(4)}.
                  </p>
                </div>
              </div>
            </section>
            )}

            {/* ================================================================ */}
            {/* MULTI-CURRENCY + PRICE UNITS - Two Column Layout */}
            {/* ================================================================ */}
            {price && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* Left: Multi-Currency Prices */}
              <section id="converter" className="scroll-mt-24">
                <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300 h-full">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">💱 Multi-Currency Prices</h2>
                  <p className="text-xs text-gray-500 mb-3">Shanghai silver per gram in major currencies</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-center">
                      <ChinaFlag size="sm" />
                      <p className="text-xs text-gray-500 mt-1">CNY</p>
                      <p className="text-xl font-bold text-red-700">¥{price.pricePerGramCny.toFixed(2)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-center">
                      <USFlag size="sm" />
                      <p className="text-xs text-gray-500 mt-1">USD</p>
                      <p className="text-xl font-bold text-blue-700">${price.pricePerGramUsd.toFixed(2)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 text-center">
                      <IndiaFlag size="sm" />
                      <p className="text-xs text-gray-500 mt-1">INR</p>
                      <p className="text-xl font-bold text-orange-700">₹{price.pricePerGramInr.toFixed(0)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-200 text-center">
                      <span className="text-lg">🇪🇺</span>
                      <p className="text-xs text-gray-500 mt-1">EUR</p>
                      <p className="text-xl font-bold text-indigo-700">€{(price.pricePerGramUsd * 0.92).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {/* Exchange Rates */}
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-center text-gray-600">
                    <strong>Rates:</strong> USD/CNY: {price.usdCny.toFixed(2)} • USD/INR: ₹{price.usdInr.toFixed(0)} • EUR/USD: ~0.92
                  </div>
                </div>
              </section>

              {/* Right: Price Units Table */}
              <section className="scroll-mt-24">
                <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300 h-full">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">📊 Price in Different Units</h2>
                  <p className="text-xs text-gray-500 mb-3">Shanghai silver converted to various weight units</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <span className="text-sm text-gray-700">Per Gram</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-800">¥{price.pricePerGramCny.toFixed(2)}</span>
                        <span className="text-gray-500 text-xs ml-2">${price.pricePerGramUsd.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <span className="text-sm text-gray-700">Per 10 Grams</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-800">¥{(price.pricePerGramCny * 10).toFixed(2)}</span>
                        <span className="text-gray-500 text-xs ml-2">${(price.pricePerGramUsd * 10).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-200">
                      <span className="text-sm text-gray-700">Per Troy Ounce</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-800">¥{price.pricePerOzCny.toFixed(0)}</span>
                        <span className="text-gray-500 text-xs ml-2">${price.pricePerOzUsd.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 border border-blue-200">
                      <span className="text-sm font-medium text-gray-700">Per Kilogram</span>
                      <div className="text-right">
                        <span className="font-bold text-blue-700">¥{price.pricePerKgCny.toLocaleString()}</span>
                        <span className="text-blue-600 text-xs ml-2">${price.pricePerKgUsd.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            )}

          {/* Why Shanghai Premium */}
          <section className="mb-6">
            <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">💡 Why Shanghai Premium?</h2>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                  +{price?.premiumPercent?.toFixed(0) || "6"}% over COMEX
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Shanghai silver trades at a premium due to China&apos;s unique market conditions:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
                  <span className="text-2xl">🏭</span>
                  <p className="text-sm font-semibold text-gray-800 mt-1">Industrial</p>
                  <p className="text-xs text-gray-500">#1 consumer</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
                  <span className="text-2xl">📦</span>
                  <p className="text-sm font-semibold text-gray-800 mt-1">Import Tax</p>
                  <p className="text-xs text-gray-500">~24% total</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
                  <span className="text-2xl">⛏️</span>
                  <p className="text-sm font-semibold text-gray-800 mt-1">Supply</p>
                  <p className="text-xs text-gray-500">70% imported</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-center">
                  <span className="text-2xl">💰</span>
                  <p className="text-sm font-semibold text-gray-800 mt-1">Demand</p>
                  <p className="text-xs text-gray-500">Solar + EVs</p>
                </div>
              </div>
            </div>
          </section>

          {/* Trading Hours + China Market - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Left: SGE Trading Hours - SEO Optimized for "what time does shanghai silver market open" */}
            <section id="trading-hours" className="scroll-mt-24">
              <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300 h-full">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">🕐 When Does Shanghai Silver Market Open?</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${marketStatus.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {marketStatus.isOpen ? '● Open Now' : '○ Closed'}
                  </span>
                </div>
                
                {/* Direct Answer - SEO Featured Snippet Target */}
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 mb-3">
                  <p className="text-sm text-gray-700">
                    <strong>Shanghai silver market opens at 9:00 AM Beijing Time</strong> (8:00 PM ET / 1:00 AM GMT previous day). 
                    Three trading sessions daily: Morning, Afternoon, and Night.
                  </p>
                </div>
                
                {/* Current Time */}
                <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
                  <ChinaFlag size="sm" />
                  <div>
                    <p className="text-base font-bold text-gray-800">
                      <LiveTimeDisplay timezone="Asia/Shanghai" />
                    </p>
                    <p className="text-[10px] text-gray-500">Current Beijing Time (UTC+8)</p>
                  </div>
                </div>
                
                {/* Trading Sessions - Shanghai Silver Market Opening Time */}
                <h3 className="text-xs font-semibold text-gray-700 mb-2">Shanghai Silver Market Opening Times (Beijing)</h3>
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50 border border-blue-200">
                    <span className="text-xs text-gray-700">☀️ Morning Session</span>
                    <span className="text-sm font-bold text-blue-700">9:00 - 11:30 AM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="text-xs text-gray-700">🌤️ Afternoon Session</span>
                    <span className="text-sm font-bold text-amber-700">1:30 - 3:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-indigo-50 border border-indigo-200">
                    <span className="text-xs text-gray-700">🌙 Night Session</span>
                    <span className="text-sm font-bold text-indigo-700">9:00 PM - 2:30 AM</span>
                  </div>
                </div>
                
                {/* US Time Conversion - for US searchers */}
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 mb-3">
                  <p className="text-[10px] font-semibold text-blue-800 mb-1">🇺🇸 US Eastern Time (ET)</p>
                  <p className="text-[10px] text-gray-600">Morning: 8-10:30 PM (prev day) • Afternoon: 12:30-2:30 AM • Night: 8 AM-1:30 PM</p>
                </div>
                
                {/* Additional Info */}
                <div className="text-[10px] text-gray-500 space-y-0.5">
                  <p>📅 Trading Days: Monday - Friday</p>
                  <p>🚫 Closed: Weekends & Chinese holidays</p>
                </div>
              </div>
            </section>

            {/* Right: China Silver Market */}
            <section id="china-market" className="scroll-mt-24">
              <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <ChinaFlag size="sm" />
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">China Silver Market</h2>
                </div>
                <p className="text-xs text-gray-500 mb-3">World&apos;s largest silver consumer driving global prices</p>
                
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                    <p className="text-2xl font-bold text-red-700">30%</p>
                    <p className="text-xs text-gray-600">Global Consumption</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                    <p className="text-2xl font-bold text-red-700">4,500</p>
                    <p className="text-xs text-gray-600">Tonnes per Year</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                    <p className="text-2xl font-bold text-red-700">70%</p>
                    <p className="text-xs text-gray-600">Import Dependent</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                    <p className="text-2xl font-bold text-red-700">#1</p>
                    <p className="text-xs text-gray-600">Solar PV Producer</p>
                  </div>
                </div>
                
                {/* Demand Breakdown */}
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Silver Demand by Sector</h3>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-yellow-500 h-4 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <span className="text-xs text-gray-600 w-24">☀️ Solar 45%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-blue-500 h-4 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <span className="text-xs text-gray-600 w-24">💻 Tech 25%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-pink-500 h-4 rounded-full" style={{width: '15%'}}></div>
                    </div>
                    <span className="text-xs text-gray-600 w-24">💎 Jewelry 15%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div className="bg-green-500 h-4 rounded-full" style={{width: '15%'}}></div>
                    </div>
                    <span className="text-xs text-gray-600 w-24">📈 Other 15%</span>
                  </div>
                </div>
                
                {/* Import Tax Info */}
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                  <strong>Import Costs:</strong> 0-11% duty + 13% VAT = 13-24% above intl prices
                </div>
              </div>
            </section>
          </div>

          {/* Compare Section */}
          <section className="mb-6">
            <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">🌏 Compare Global Prices</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link 
                  href="/"
                  className="block rounded-lg p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <IndiaFlag size="sm" />
                    <div>
                      <h3 className="font-semibold text-gray-800">India</h3>
                      <p className="text-xl font-bold text-orange-700">₹{price?.indiaRatePerGram?.toFixed(0) || 262}/g</p>
                      <p className="text-xs text-gray-600">+24% over COMEX (duty+GST)</p>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  href="/qatar"
                  className="block rounded-lg p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-4 rounded shadow-sm" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                      <rect width="30" height="20" fill="#8D1B3D"/>
                      <polygon points="0,0 12,0 6,2.22 12,4.44 6,6.67 12,8.89 6,11.11 12,13.33 6,15.56 12,17.78 6,20 0,20" fill="#FFFFFF"/>
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-800">Qatar</h3>
                      <p className="text-xl font-bold text-purple-700">QAR →</p>
                      <p className="text-xs text-gray-600">View Qatar prices</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Data Sources + Related Articles - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Left: Data Sources */}
            <section className="scroll-mt-24">
              <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300 h-full">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">📊 Data Sources & Formula</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-1">📈 Silver Price Source</p>
                    <p className="text-sm text-gray-600">COMEX Futures via Yahoo Finance</p>
                    <p className="text-xs text-gray-400">Real-time • 30 second updates</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-1">💱 Exchange Rate Sources</p>
                    <p className="text-sm text-gray-600">USD/CNY, USD/INR, EUR/USD</p>
                    <p className="text-xs text-gray-400">ECB + Frankfurter + ExchangeRate APIs</p>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                  <p className="text-xs font-bold text-blue-800 mb-1">Price Calculation Formula:</p>
                  <p className="text-sm text-blue-700 font-mono">
                    Shanghai = COMEX × (1 + Premium%) × USD/CNY × 32.15
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  <a href="https://www.sge.com.cn" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors text-xs font-medium">🇨🇳 SGE Official</a>
                  <a href="https://www.cmegroup.com/markets/metals/precious/silver.html" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-xs font-medium">🇺🇸 COMEX</a>
                  <a href="https://www.ecb.europa.eu" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors text-xs font-medium">🇪🇺 ECB</a>
                </div>
              </div>
            </section>

            {/* Right: Related Articles */}
            <section className="scroll-mt-24">
              <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300 h-full">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">📚 Related Articles & Guides</h2>
                
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/" className="block rounded-lg p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-sm text-gray-800">📈 Live Silver Rate</h3>
                    <p className="text-xs text-gray-500">India city-wise prices</p>
                  </Link>

                  <Link href="/learn/what-is-sterling-silver" className="block rounded-lg p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-sm text-gray-800">🥈 Sterling Silver</h3>
                    <p className="text-xs text-gray-500">925 purity guide</p>
                  </Link>

                  <Link href="/learn/silver-vs-gold-investment" className="block rounded-lg p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-sm text-gray-800">⚖️ Silver vs Gold</h3>
                    <p className="text-xs text-gray-500">Investment comparison</p>
                  </Link>

                  <Link href="/investment-calculator" className="block rounded-lg p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-sm text-gray-800">🧮 Calculator</h3>
                    <p className="text-xs text-gray-500">Returns calculator</p>
                  </Link>

                  <Link href="/gold" className="block rounded-lg p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-sm text-gray-800">🥇 Gold Rate</h3>
                    <p className="text-xs text-gray-500">Live gold prices</p>
                  </Link>

                  <Link href="/silver-price-usd" className="block rounded-lg p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all">
                    <h3 className="font-semibold text-sm text-gray-800">🇺🇸 Silver USD</h3>
                    <p className="text-xs text-gray-500">COMEX spot price</p>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Multilingual SEO Section - Enhanced for German "silberpreis shanghai live" */}
          <section className="mb-6">
            <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">🌍 Shanghai Silver Price - International</h3>
              
              {/* German Section - SEO Target: "silberpreis shanghai live" */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🇩🇪</span>
                  <h4 className="text-sm font-bold text-white">Silberpreis Shanghai Live</h4>
                </div>
                <p className="text-xs text-gray-300 mb-2">
                  Aktueller Shanghai Silberpreis: <span className="font-bold text-yellow-400">${price?.pricePerOzUsd?.toFixed(2) || "81"}/oz</span> (¥{price?.pricePerKgCny?.toLocaleString() || "18,256"}/kg CNY). 
                  Shanghai Gold Exchange Silberpreis mit +{price?.premiumPercent?.toFixed(0) || "6"}% Aufschlag über COMEX. Live-Updates alle 30 Sekunden.
                </p>
                <p className="text-[10px] text-gray-400">
                  Silberpreis Shanghai in Dollar • Shanghai Gold Exchange Silberpreis heute • Aktueller Silberpreis Shanghai
                </p>
              </div>
              
              {/* Other Languages */}
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong className="text-gray-700">🇺🇸 English:</strong>{" "}
                  shanghai silver price in usd, shanghai silver price in dollars, shanghai vs comex silver price, 
                  sge silver price today, what time does shanghai silver market open, shanghai silver market opening time
                </p>
                <p>
                  <strong className="text-gray-700">🇵🇱 Polski:</strong>{" "}
                  kurs srebra szanghaj (${price?.pricePerOzUsd?.toFixed(0) || "81"}/oz), cena srebra szanghaj,
                  srebro szanghaj vs comex, kurs srebra shanghai giełda
                </p>
                <p>
                  <strong className="text-gray-700">🇮🇳 हिंदी:</strong>{" "}
                  शंघाई चांदी की कीमत (${price?.pricePerOzUsd?.toFixed(0) || "81"}/oz), शंघाई सिल्वर प्राइस, 
                  चीन में चांदी का भाव, SGE चांदी दर आज
                </p>
                <p>
                  <strong className="text-gray-700">🇨🇳 中文:</strong>{" "}
                  上海白银价格 (¥{price?.pricePerKgCny?.toLocaleString() || "18,256"}/kg), 上海黄金交易所白银, 白银T+D价格,
                  上海期货交易所白银现货价格
                </p>
              </div>
            </div>
          </section>

          {/* FAQs - Card Style */}
          <section id="faq" className="mb-6 scroll-mt-24">
            <div className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">❓ Frequently Asked Questions</h2>
                <div className="space-y-2">
                  {faqItems.map((faq, idx) => (
                    <details 
                      key={idx}
                      className="group rounded-lg bg-gray-50 border border-gray-300"
                    >
                      <summary className="px-4 py-3 cursor-pointer text-sm font-medium flex items-center justify-between text-gray-800 hover:bg-gray-100 rounded-lg">
                        {faq.question}
                        <span className="ml-2 text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="px-4 pb-3 text-sm text-gray-600 border-t border-gray-300">
                        <p className="pt-2">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            {/* Footer Note */}
            <footer className="card p-4 sm:p-6 shadow-2xl border-2 border-gray-300 text-center">
              <p className="text-sm text-gray-500 mb-2">
                <strong>Data Sources:</strong> COMEX via Yahoo Finance • Exchange rates via Frankfurter/ExchangeRate APIs
              </p>
              <p className="text-xs text-gray-400">
                Prices shown are near-real-time indicators calculated from COMEX + estimated Shanghai premium.
                Actual SGE benchmark may vary ±5%. For official rates, visit{" "}
                <a href="https://www.sge.com.cn" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f] hover:underline">
                  sge.com.cn
                </a>
              </p>
            </footer>
          </div>
        </section>
      </div>
    </>
  );
}
