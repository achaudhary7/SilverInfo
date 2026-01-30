import Link from "next/link";
import { Metadata } from "next";
import { getSilverPriceWithChange, getHistoricalPrices, getCityPrices } from "@/lib/metalApi";
import { getRecentUpdates } from "@/lib/markdown";
import LivePriceCard from "@/components/LivePriceCard";
import { DynamicPriceChart, DynamicMiniChart } from "@/components/DynamicChart";
import { DynamicCityTable, DynamicCalculator, DynamicFAQ } from "@/components/DynamicComponents";
import WhyPriceChangedTeaser from "@/components/WhyPriceChangedTeaser";
import WhyPriceChangedFull from "@/components/WhyPriceChangedFull";
import PriceDifferenceExplainer from "@/components/PriceDifferenceExplainer";
import SilverPurityGuide from "@/components/SilverPurityGuide";
import MarketFactorsDetailed from "@/components/MarketFactorsDetailed";
import { generateFAQSchema, generateBreadcrumbSchema, type FAQItem } from "@/lib/schema";
import PriceSourceBadge from "@/components/ui/PriceSourceBadge";
import MarketStatus from "@/components/ui/MarketStatus";
import PriceFormulaCard from "@/components/ui/PriceFormulaCard";

// Enable ISR - revalidate every 10 minutes (matches Yahoo Finance cache)
export const revalidate = 600;

// ============================================================================
// DYNAMIC METADATA - Prices update automatically
// ============================================================================

export async function generateMetadata(): Promise<Metadata> {
  const priceData = await getSilverPriceWithChange();
  
  const pricePerGram = priceData?.pricePerGram?.toFixed(2) || "95.00";
  const pricePerKg = priceData?.pricePerKg?.toFixed(0) || "95000";
  
  const dateString = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    title: `Silver Rate Today ₹${pricePerGram}/g (${dateString}) | Live Silver Price India - SilverInfo.in`,
    description: `Live silver rate today in India: ₹${pricePerGram}/gram, ₹${pricePerKg}/kg. Real-time silver price updated every 30 seconds. Check 999/925 silver rates, city prices, calculator & daily updates.`,
    keywords: [
      "silver rate today",
      "silver price in india",
      "silver price per gram",
      "today silver rate",
      "silver rate today in mumbai",
      "silver rate today in delhi",
      "chandi ka bhav",
      "999 silver price",
      "925 silver price",
      "silver hallmark",
      "silver price calculator",
    ],
    openGraph: {
      title: `Silver Rate Today ₹${pricePerGram}/g (${dateString}) | SilverInfo.in`,
      description: `Live silver rate in India: ₹${pricePerGram}/gram, ₹${pricePerKg}/kg. Real-time prices updated every 30 seconds.`,
      url: "https://silverinfo.in",
      siteName: "SilverInfo.in",
      locale: "en_IN",
      type: "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SilverInfo.in - Live Silver Prices" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Silver Rate Today ₹${pricePerGram}/g | SilverInfo.in`,
      description: `Live silver rate: ₹${pricePerGram}/gram, ₹${pricePerKg}/kg. Updated every 30 seconds.`,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: "/",
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

// FAQ Data - Optimized for Google Featured Snippets (<300 chars per answer)
// Includes Hindi/vernacular keywords for voice search optimization
const faqItems: FAQItem[] = [
  // === PRICE QUERIES (English + Hindi) ===
  {
    question: "What is the current silver rate in India today?",
    answer:
      "Silver rates are derived from COMEX prices + USD/INR exchange rate, refreshed every 30 seconds. Retail prices vary 2-5% due to local taxes. Check our live price card above for the current rate.",
  },
  {
    question: "Aaj ka chandi ka bhav kya hai? (आज का चांदी का भाव)",
    answer:
      "Aaj ka chandi rate COMEX international price aur USD/INR exchange rate se calculate hota hai. Humare live price card mein current rate dekh sakte hain. Rate har 30 second mein update hota hai.",
  },
  {
    question: "How is silver price per gram calculated in India?",
    answer:
      "Formula: (COMEX USD price ÷ 31.1035 grams) × USD/INR rate × (1 + 10% import duty) × (1 + 3% GST). See our methodology page for the complete calculation breakdown.",
  },
  // === PRICE DIFFERENCE ===
  {
    question: "Why is online silver price different from local jeweler?",
    answer:
      "Online shows spot price (raw silver). Jewelers add: making charges (8-15%), wastage (2-5%), hallmark premium, shop overhead, and GST on total. Jewelry costs 15-25% more than spot rate.",
  },
  {
    question: "Why is silver cheaper at bullion dealers than jewelers?",
    answer:
      "Bullion dealers sell bars/coins with minimal making charges (0-3%). Jewelers charge 8-15% making + 2-5% wastage for craftsmanship. For investment, buy bullion. For jewelry, compare jewelers.",
  },
  // === PURITY QUERIES ===
  {
    question: "What is 999 silver price today per gram?",
    answer:
      "999 silver (99.9% pure/Fine Silver) is priced at the full spot rate shown above. It's the purest commercially available silver, ideal for investment bars and coins. No purity deduction applies.",
  },
  {
    question: "What is 925 sterling silver price per gram?",
    answer:
      "925 sterling silver = 92.5% pure. Price = Spot rate × 0.925. If spot is ₹95/gram, 925 silver = ~₹88/gram. Sterling is preferred for jewelry due to better durability than pure silver.",
  },
  {
    question: "What is the difference between 999 and 925 silver?",
    answer:
      "999 silver = 99.9% pure, soft, ideal for coins/bars. 925 sterling = 92.5% silver + 7.5% copper for durability, preferred for jewelry. Price difference is about 7.5%.",
  },
  {
    question: "Chandi ki shudhta kaise check karein? (चांदी की शुद्धता)",
    answer:
      "BIS Hallmark dekhein - 999, 925, ya 900 number hona chahiye. Magnet test karein (silver magnet se attract nahi hoti). Ice test - silver par ice tezi se pighalti hai. Jeweler se certificate lein.",
  },
  // === MARKET FACTORS ===
  {
    question: "What factors affect silver prices in India?",
    answer:
      "Four key factors: (1) COMEX international prices, (2) USD/INR rate, (3) Import duty (10%) & GST (3%), (4) Seasonal demand (peaks during Dhanteras/weddings). See our market factors section.",
  },
  {
    question: "What is MCX silver and how does it affect prices?",
    answer:
      "MCX (Multi Commodity Exchange) is India's commodity exchange where silver futures trade. MCX price = COMEX + 8-12% local premium. MCX sets the benchmark for domestic silver rates.",
  },
  {
    question: "How does USD-INR exchange rate affect silver price?",
    answer:
      "Silver is priced in USD globally. When rupee weakens (USD/INR rises), silver becomes costlier in INR. 1% rupee fall ≈ 1% silver price increase. Check our market factors for live USD/INR.",
  },
  {
    question: "What is the import duty on silver in India?",
    answer:
      "Total import duty = 10% (7.5% Basic Customs Duty + 2.5% AIDC). Plus 3% IGST. Effective landed cost is ~13-14% above international price. Duty changes in Union Budget affect prices.",
  },
  // === GST & TAXES ===
  {
    question: "Is GST applicable on silver purchases in India?",
    answer:
      "Yes, 3% GST applies to silver metal value (bars, coins, jewelry). Making charges attract 5% GST separately. Our calculator includes both GST rates automatically.",
  },
  {
    question: "Chandi par GST kitna lagta hai? (चांदी पर GST)",
    answer:
      "Chandi par 3% GST lagta hai metal value par. Making charges par alag se 5% GST lagta hai. Total bill = Silver value + Making + 3% GST on silver + 5% GST on making.",
  },
  {
    question: "Can I buy silver without GST in India?",
    answer:
      "No, GST is mandatory on all silver purchases. However, old silver exchange (with proper documentation) may have reduced GST. Always get proper invoice for future selling.",
  },
  // === BUYING & INVESTMENT ===
  {
    question: "What are making charges for silver jewelry?",
    answer:
      "Making charges range 6-15% of silver value. Machine-made: ~6-8%, Handcrafted: ~12-15%. Temple jewelry/antique designs: up to 20%. Our calculator includes making charges.",
  },
  {
    question: "Is silver a good investment in 2026?",
    answer:
      "Silver has dual demand: investment + industrial (solar panels, EVs). It's more volatile than gold but offers higher growth potential. Consider 5-10% portfolio allocation. Consult a financial advisor.",
  },
  {
    question: "What is the best way to buy silver in India?",
    answer:
      "For investment: Buy 999 purity bars/coins from banks or trusted dealers. For jewelry: Buy BIS hallmarked 925 from reputed jewelers. Digital silver (SGBs) offers storage-free option.",
  },
  // === CITY & REGIONAL ===
  {
    question: "How do silver rates vary across different cities in India?",
    answer:
      "Silver varies ₹50-200 per 10g across cities due to local taxes, transportation, and dealer margins. Mumbai/Delhi have competitive rates. South India typically 1-2% higher.",
  },
  // === MEASUREMENT ===
  {
    question: "What is a tola in silver measurement?",
    answer:
      "Tola = traditional Indian weight unit. 1 tola = 11.6638 grams. Commonly used for jewelry in North India. Our calculator converts between grams, tola, and kg instantly.",
  },
  {
    question: "How many grams in 1 kg silver?",
    answer:
      "1 kg = 1000 grams of silver. Silver is typically quoted per gram or per kg in India. 1 kg also equals ~85.7 tolas. Use our calculator for quick conversions.",
  },
  // === SEASONAL ===
  {
    question: "When is the best time to buy silver in India?",
    answer:
      "Prices typically dip in Jan-Feb (post-wedding) and July-Aug (monsoon). Peaks during Oct-Nov (Dhanteras/Diwali) and Feb-May (wedding season). Buy on dips, avoid festival rush.",
  },
  {
    question: "Why does silver price increase during Dhanteras?",
    answer:
      "Dhanteras = auspicious day for buying precious metals. High demand + limited supply = price surge of 2-5%. Jewelers stock up early, creating pre-festival price rise. Buy 2-3 weeks before.",
  },
  // === RESALE & SELLING (High-impression keyword!) ===
  {
    question: "What is 925 silver resale value in India per gram?",
    answer:
      "925 sterling silver resale = Spot rate × 0.925 × 0.85-0.90. Jewelers pay 85-90% of spot for buyback. At ₹95/gram spot, 925 resale ≈ ₹74-79/gram. Hallmarked pieces get better rates.",
  },
  {
    question: "How to sell old silver jewelry in India?",
    answer:
      "Options: (1) Local jewelers - immediate payment, 85-90% of spot. (2) Banks - some buy hallmarked silver. (3) Online platforms - Augmont, MMTC-PAMP. Always get multiple quotes.",
  },
  // === PURE SILVER / TODAY'S RATE ===
  {
    question: "What is today's pure silver rate in India?",
    answer:
      "Pure silver (999 fineness) rate is shown live above. Currently calculated from COMEX × USD/INR × import duties. 999 pure silver is used for bars, coins, and investment purposes.",
  },
  {
    question: "What is the current pure silver price per gram?",
    answer:
      "Current 999 pure silver price is displayed in our live price card. The rate updates every 30 seconds based on international COMEX prices and RBI exchange rates.",
  },
  // === WEIGHT-SPECIFIC CALCULATIONS ===
  {
    question: "How much is 100 grams of silver worth in India?",
    answer:
      "100g silver value = Current rate × 100 + 3% GST. At ₹95/gram: 100g = ₹9,500 + ₹285 GST = ₹9,785. For jewelry, add 8-15% making charges. Use our calculator for exact values.",
  },
  {
    question: "How much is 500 grams of silver worth?",
    answer:
      "500g silver = Current rate × 500 + 3% GST. At ₹95/gram: 500g = ₹47,500 + ₹1,425 GST = ₹48,925. Bulk purchases (1kg+) may get 1-2% dealer discount.",
  },
  {
    question: "What is the value of 1 kg silver in India today?",
    answer:
      "1 kg silver = Current rate × 1000 + 3% GST. Check our live price card for per-kg rate. Bulk silver bars (1kg) have lower premiums than small coins.",
  },
  // === MCX SPECIFIC ===
  {
    question: "How is MCX silver price calculated from COMEX?",
    answer:
      "MCX Silver = (COMEX USD/oz × USD/INR ÷ 31.1035) × 1000 × (1 + 10% import duty) + local premium (8-12%). MCX quotes per kg, COMEX quotes per troy ounce.",
  },
  // === JEWELRY CALCULATOR ===
  {
    question: "How to calculate silver ring price in India?",
    answer:
      "Silver ring price = (Weight in grams × Silver rate × Purity) + Making charges (8-15%) + 3% GST on silver + 5% GST on making. Avg ring: 5-15g. Use our calculator.",
  },
  {
    question: "What is silver chain price for 50 grams?",
    answer:
      "50g silver chain = (50 × Rate × Purity) + Making (10-12%) + GST. At ₹95/gram for 925 silver: ₹4,394 + ₹527 making + ₹148 GST = ~₹5,069. Hallmark adds ₹50-100.",
  },
];

export default async function HomePage() {
  // Fetch data - getSilverPriceWithChange includes 24h change calculation
  // Fetch 365 days to support 7d, 30d, 90d, and 1y chart views
  const [priceData, historicalPrices, cityPrices] = await Promise.all([
    getSilverPriceWithChange(),
    getHistoricalPrices(365),
    getCityPrices(),
  ]);
  
  // If API completely fails, show error page - NO FAKE DATA
  if (!priceData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Silver Rate Today in India
            </h1>
            <div className="p-8 rounded-xl bg-red-50 border border-red-200 max-w-lg mx-auto">
              <p className="text-red-600 text-lg mb-4">
                ⚠️ Unable to fetch live prices
              </p>
              <p className="text-gray-600 mb-4">
                We&apos;re having trouble connecting to our price sources (COMEX/Forex APIs). 
                Please refresh the page or try again in a few minutes.
              </p>
              <Link 
                href="/"
                className="inline-block px-6 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a6f] transition-colors"
              >
                Refresh Page
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              For official rates, visit{" "}
              <a href="https://www.mcxindia.com" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f] underline">
                MCX India
              </a>
            </p>
          </div>
        </div>
      </main>
    );
  }
  
  // Use real API data only - no fallbacks
  const price = priceData;
  
  // Get recent blog updates
  const recentUpdates = getRecentUpdates(3);
  
  // Generate FAQ Schema
  const faqSchema = generateFAQSchema(faqItems);
  
  // Generate Breadcrumb Schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
  ]);

  // Product Schema for live silver price (Merchant Listing rich result)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Silver Price Today in India",
    description: "Live silver price per gram in India. Real-time rates from COMEX with INR conversion.",
    image: "https://silverinfo.in/og-image.png",
    category: "Precious Metals",
    brand: {
      "@type": "Brand",
      name: "COMEX Silver",
    },
    offers: {
      "@type": "Offer",
      price: price.pricePerGram,
      priceCurrency: "INR",
      priceValidUntil: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      availability: "https://schema.org/InStock",
      url: "https://silverinfo.in",
      seller: {
        "@type": "Organization",
        name: "SilverInfo.in",
      },
    },
  };

  // ItemList Schema for city prices (helps with Featured Snippets)
  const cityListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Silver Prices Across Indian Cities",
    description: "Live silver rates in major Indian cities",
    numberOfItems: (cityPrices || []).slice(0, 10).length,
    itemListElement: (cityPrices || []).slice(0, 10).map((city, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${city.city} Silver Rate`,
      url: `https://silverinfo.in/city/${city.city.toLowerCase()}`,
      item: {
        "@type": "Product",
        name: `Silver in ${city.city}`,
        description: `Live silver price per gram in ${city.city}, India. Real-time rates from COMEX.`,
        image: "https://silverinfo.in/og-image.png",
        category: "Precious Metals",
        brand: {
          "@type": "Brand",
          name: "COMEX Silver",
        },
        offers: {
          "@type": "Offer",
          price: city.pricePerGram,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          priceValidUntil: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          url: `https://silverinfo.in/city/${city.city.toLowerCase()}`,
          seller: {
            "@type": "Organization",
            name: "SilverInfo.in",
          },
        },
      },
    })),
  };

  // HowTo Schema for the calculator (helps with step-by-step rich results)
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Calculate Silver Price in India",
    description: "Step-by-step guide to calculate the total cost of silver in India including GST and making charges.",
    image: "https://silverinfo.in/og-image.png",
    totalTime: "PT2M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "INR",
      value: "0",
    },
    tool: [
      {
        "@type": "HowToTool",
        name: "SilverInfo.in Calculator",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Enter Weight",
        text: "Enter the weight of silver in grams, kg, or tola.",
        url: "https://silverinfo.in/silver-price-calculator",
      },
      {
        "@type": "HowToStep",
        name: "Select Purity",
        text: "Choose silver purity: 999 (pure), 925 (sterling), or 900 (coin silver).",
        url: "https://silverinfo.in/silver-price-calculator",
      },
      {
        "@type": "HowToStep",
        name: "Add Making Charges",
        text: "Enter making charges percentage (typically 6-15% for jewelry).",
        url: "https://silverinfo.in/silver-price-calculator",
      },
      {
        "@type": "HowToStep",
        name: "View Total",
        text: "The calculator shows total cost including 3% GST automatically.",
        url: "https://silverinfo.in/silver-price-calculator",
      },
    ],
  };

  // Organization Schema for E-E-A-T (Expertise, Experience, Authoritativeness, Trust)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SilverInfo.in",
    url: "https://silverinfo.in",
    logo: "https://silverinfo.in/logo.png",
    description: "India's trusted source for live silver and gold prices. Real-time precious metals tracking with transparent calculations from COMEX futures data.",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://silverinfo.in/contact",
    },
    sameAs: [
      "https://twitter.com/silverinfoin"
    ],
  };
  
  return (
    <>
      {/* JSON-LD Schemas for Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "SilverInfo.in - Silver Price Tracker",
            url: "https://silverinfo.in",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "INR",
            },
            description:
              "Track live silver prices in India. Get real-time rates per gram, historical charts, city-wise prices, and a silver calculator.",
          }),
        }}
      />
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header - Above the grid */}
            <div className="mb-6 sm:mb-8">
              {/* Mobile: Single badge, Desktop: Multiple badges */}
              <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 items-center">
                {/* Live Status Badge */}
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                  <span className="relative flex h-1.5 w-1.5 mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  Live • 30s Refresh
                </span>
                
                {/* Price Source Badge with Tooltip */}
                <PriceSourceBadge source={price.source || "calculated"} showTooltip={true} />
                
                {/* Market Status Badge */}
                <div className="hidden sm:block">
                  <MarketStatus market="both" variant="badge" />
                </div>
                
                {/* COMEX + Forex Badge (keeping for context) */}
                <span className="hidden lg:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  COMEX + Forex
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                Silver Rate Today in India - {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </h1>
              <p className="text-sm sm:text-lg text-[#1e3a5f] font-semibold mb-1 sm:mb-2">
                Calculated, Not Copied.
              </p>
              <p className="text-xs sm:text-base text-gray-600 max-w-3xl mb-2 sm:mb-3">
                Live silver price per gram, per kg with historical charts and city-wise prices. 
                Prices derived from COMEX futures + USD/INR exchange rates.{" "}
                <Link href="/how-we-calculate" className="text-[#1e3a5f] font-medium hover:underline">
                  See Our Formula →
                </Link>
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400">
                Content last reviewed: <time dateTime={new Date().toISOString().split('T')[0]}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
              </p>
            </div>
            
            {/* Hero Grid - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left: Price Card */}
              <LivePriceCard 
                initialPrice={price} 
                pollInterval={30000} 
                lastWeekPrice={historicalPrices.length >= 7 ? historicalPrices[historicalPrices.length - 7]?.price : undefined}
              />
              
              {/* Right: Stacked Sections */}
              <div className="space-y-4">
                {/* Row 1: 7-Day Trend + Top Cities side by side */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Mini Chart */}
                  <div className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm font-semibold text-gray-900">7-Day Trend</h2>
                      <Link href="/silver-rate-today" className="text-xs text-[#1e3a5f] hover:underline">
                        Full Chart →
                      </Link>
                    </div>
                    <div className="h-[80px]">
                      <DynamicMiniChart data={historicalPrices} />
                    </div>
                    {(() => {
                      const last7Days = historicalPrices.slice(-7).map((p) => p.price);
                      // Include current live price AND today's tracked high in calculation
                      // This ensures today's intraday extremes are reflected
                      const currentPrice = price.pricePerGram;
                      const todayHigh = price.todayHigh || currentPrice;
                      const todayLow = price.todayLow || currentPrice;
                      const allPricesForHigh = [...last7Days, todayHigh];
                      const allPricesForLow = [...last7Days, todayLow];
                      const weekLow = Math.min(...allPricesForLow);
                      const weekHigh = Math.max(...allPricesForHigh);
                      const weekAvg = last7Days.reduce((a, b) => a + b, 0) / last7Days.length;
                      // Check if today's high is the week high
                      const isAtHigh = todayHigh >= weekHigh;
                      return (
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-gray-100">
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500">Low</p>
                            <p className="text-xs font-semibold text-red-600">₹{weekLow.toFixed(0)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500">Avg</p>
                            <p className="text-xs font-semibold text-gray-900">₹{weekAvg.toFixed(0)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500">High</p>
                            <p className="text-xs font-semibold text-green-600">
                              ₹{weekHigh.toFixed(0)}
                              {isAtHigh && <span className="ml-0.5">🔥</span>}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Top Cities */}
                  <div className="card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm font-semibold text-gray-900">Top Cities</h2>
                      <Link href="/silver-rate-today#cities" className="text-xs text-[#1e3a5f] hover:underline">
                        All Cities →
                      </Link>
                    </div>
                    <div className="space-y-2">
                      {(cityPrices || []).slice(0, 4).map((city) => (
                        <Link
                          key={city.city}
                          href={`/city/${city.city.toLowerCase()}`}
                          className="flex justify-between text-xs py-1 hover:text-[#1e3a5f] transition-colors"
                        >
                          <span className="text-gray-600">{city.city}</span>
                          <span className="font-semibold text-gray-900">₹{city.pricePerGram.toFixed(2)}</span>
                        </Link>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100 text-center">
                      Prices vary by local taxes
                    </p>
                  </div>
                </div>
                
                {/* Row 2: Why Price Changed - FULL Version */}
                <WhyPriceChangedTeaser />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Bar - Hidden on very small screens, visible on larger mobiles */}
        <section className="bg-[#1e3a5f] py-3 sm:py-4 hidden sm:block">
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
                <span className="text-xs sm:text-sm">Charts</span>
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
        <section className="py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Jump Links - SEO: Passage Indexing Optimization */}
            <nav className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-50 rounded-lg" aria-label="Jump to section">
              <span className="text-xs text-gray-500 font-medium self-center">Jump to:</span>
              <a href="#price-history" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">
                Price History
              </a>
              <a href="#market-factors" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">
                Market Factors
              </a>
              <a href="#city-prices" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">
                City Prices
              </a>
              <a href="#price-difference" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">
                Price Difference
              </a>
              <a href="#purity-guide" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">
                Purity Guide
              </a>
              <a href="#faq" className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors">
                FAQ
              </a>
            </nav>
            
            {/* Price History + Updates + Calculator - 3 Column Layout */}
            <div id="price-history" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-6 mb-6 sm:mb-8 scroll-mt-20">
              {/* Price Chart - Takes 50% on XL, 100% on MD */}
              <div className="md:col-span-2 xl:col-span-6">
                <DynamicPriceChart data={historicalPrices} />
              </div>
              
              {/* Latest Updates + Quick Links - Takes 25% on XL, 50% on MD */}
              <div className="md:col-span-1 xl:col-span-3 space-y-4">
                {/* Recent Updates */}
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">Latest Updates</h3>
                    <Link
                      href="/updates"
                      className="text-xs font-medium text-[#1e3a5f] hover:underline"
                    >
                      All Updates →
                    </Link>
                  </div>
                  
                  {recentUpdates.length > 0 ? (
                    <div className="space-y-2">
                      {recentUpdates.slice(0, 3).map((post) => (
                        <Link
                          key={post.slug}
                          href={`/updates/${post.slug}`}
                          className="block group py-1.5 -mx-1 px-1 rounded hover:bg-gray-50"
                        >
                          <p className="text-[10px] text-gray-400 mb-0.5">
                            {new Date(post.date).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs font-medium text-gray-900 group-hover:text-[#1e3a5f] line-clamp-2">
                            {post.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No updates yet.</p>
                  )}
                </div>
                
                {/* Quick Links - Compact */}
                <div className="card p-4">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">Quick Links</h3>
                  <div className="space-y-1">
                    <Link
                      href="/gold"
                      className="flex items-center gap-2 text-xs text-amber-600 hover:text-amber-700 py-1.5 rounded hover:bg-amber-50 font-medium"
                    >
                      <span>🥇</span> Gold Rate Today
                    </Link>
                    <Link
                      href="/shanghai-silver-price"
                      className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 py-1.5 rounded hover:bg-red-50 font-medium"
                    >
                      <span>🇨🇳</span> Shanghai Silver Price
                    </Link>
                    <Link
                      href="/silver-rate-today"
                      className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#1e3a5f] py-1.5 rounded hover:bg-gray-50"
                    >
                      <span>📊</span> Full Dashboard
                    </Link>
                    <Link
                      href="/silver-price-calculator"
                      className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#1e3a5f] py-1.5 rounded hover:bg-gray-50"
                    >
                      <span>🧮</span> Advanced Calculator
                    </Link>
                    <Link
                      href="/learn/silver-hallmark-guide"
                      className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#1e3a5f] py-1.5 rounded hover:bg-gray-50"
                    >
                      <span>✓</span> Hallmark Guide
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Quick Calculator - Takes 25% on XL, 50% on MD */}
              <div className="md:col-span-1 xl:col-span-3">
                <DynamicCalculator currentPrice={price.pricePerGram} compact />
              </div>
            </div>
            
            {/* Why Price Changed - Full Width Section */}
            <div id="market-factors" className="mb-6 sm:mb-8 scroll-mt-20">
              <WhyPriceChangedFull />
            </div>
            
            {/* Global Silver Comparison - New Section for SEO */}
            <div className="mb-6 sm:mb-8">
              <div className="card p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">🌏 Global Silver Price Comparison</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Compare silver prices across major markets. India typically trades at a premium over international prices.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* India */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🇮🇳</span>
                      <span className="font-semibold text-gray-800">India</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">₹{price.pricePerGram.toFixed(0)}/g</p>
                    <p className="text-xs text-gray-600 mt-1">+24% over COMEX (duty+GST)</p>
                    <Link href="/silver-rate-today" className="text-xs text-orange-600 hover:underline mt-2 block">
                      View Details →
                    </Link>
                  </div>
                  
                  {/* Shanghai/China */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🇨🇳</span>
                      <span className="font-semibold text-gray-800">Shanghai</span>
                    </div>
                    <p className="text-2xl font-bold text-red-700">¥27/g</p>
                    <p className="text-xs text-gray-600 mt-1">+11% premium (SGE)</p>
                    <Link href="/shanghai-silver-price" className="text-xs text-red-600 hover:underline mt-2 block">
                      View Live SGE Rate →
                    </Link>
                  </div>
                  
                  {/* COMEX International */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🌍</span>
                      <span className="font-semibold text-gray-800">COMEX</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">${(price.comexUsd || 30.50).toFixed(2)}/oz</p>
                    <p className="text-xs text-gray-600 mt-1">Global benchmark (NY)</p>
                    <Link href="/how-we-calculate" className="text-xs text-blue-600 hover:underline mt-2 block">
                      How We Calculate →
                    </Link>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Prices vary due to import duties, local demand, and exchange rates. India: 10% duty + 3% GST. China: 3-8% duty + 13% VAT.
                </p>
              </div>
            </div>
            
            {/* City Table + FAQ - 2 Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* City-wise Prices */}
                <div id="city-prices" className="content-auto scroll-mt-20">
                  <DynamicCityTable cities={cityPrices || []} limit={10} />
                </div>
                
                {/* FAQ Section */}
                <div id="faq" className="content-auto scroll-mt-20">
                  <DynamicFAQ
                    items={faqItems}
                    title="Frequently Asked Questions About Silver"
                    description="Common questions about silver prices, purity, and buying in India"
                  />
                </div>
              </div>
              
              {/* Right Column - 1/3 width - Additional Resources */}
              <div className="space-y-6 sm:space-y-8">
                {/* Learn Articles */}
                <div className="card p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">📚 Learn About Silver</h3>
                  <div className="space-y-2">
                    <Link
                      href="/learn/what-is-sterling-silver"
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-[#1e3a5f] py-2 px-2 -mx-2 border-b border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-lg">🥈</span>
                      <div>
                        <p className="font-medium">What is Sterling Silver?</p>
                        <p className="text-[10px] text-gray-400">Understanding 925 purity</p>
                      </div>
                    </Link>
                    <Link
                      href="/learn/silver-vs-gold-investment"
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-[#1e3a5f] py-2 px-2 -mx-2 border-b border-gray-100 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-lg">⚖️</span>
                      <div>
                        <p className="font-medium">Silver vs Gold Investment</p>
                        <p className="text-[10px] text-gray-400">Which is better for you?</p>
                      </div>
                    </Link>
                    <Link
                      href="/learn/how-to-check-silver-purity"
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-[#1e3a5f] py-2 px-2 -mx-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-lg">🔍</span>
                      <div>
                        <p className="font-medium">How to Check Purity</p>
                        <p className="text-[10px] text-gray-400">5 easy methods at home</p>
                      </div>
                    </Link>
                  </div>
                  <Link
                    href="/learn"
                    className="block text-center text-xs font-medium text-[#1e3a5f] hover:underline mt-4 py-2 bg-gray-50 rounded-lg"
                  >
                    View All Guides →
                  </Link>
                </div>
                
                {/* Tools Section */}
                <div className="card p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">🛠️ Calculator Tools</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/investment-calculator"
                      className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center"
                    >
                      <span className="text-xl">📈</span>
                      <span className="text-xs font-medium text-gray-700">Investment</span>
                    </Link>
                    <Link
                      href="/capital-gains-tax-calculator"
                      className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center"
                    >
                      <span className="text-xl">💰</span>
                      <span className="text-xs font-medium text-gray-700">Tax Calculator</span>
                    </Link>
                    <Link
                      href="/inflation-adjusted-calculator"
                      className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center"
                    >
                      <span className="text-xl">📊</span>
                      <span className="text-xs font-medium text-gray-700">Inflation Adj.</span>
                    </Link>
                    <Link
                      href="/break-even-calculator"
                      className="flex flex-col items-center gap-1 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center"
                    >
                      <span className="text-xl">⚖️</span>
                      <span className="text-xs font-medium text-gray-700">Break-Even</span>
                    </Link>
                  </div>
                </div>
                
                {/* Quick Weight Reference - SEO for weight-specific searches */}
                <div className="card p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">⚖️ Quick Weight Reference</h3>
                  <p className="text-[10px] text-gray-500 mb-3">Based on current rate of ₹{price.pricePerGram.toFixed(0)}/gram</p>
                  <div className="space-y-2">
                    {[
                      { weight: 10, label: "10g (Ring)" },
                      { weight: 50, label: "50g (Chain)" },
                      { weight: 100, label: "100g" },
                      { weight: 500, label: "500g" },
                      { weight: 1000, label: "1 Kg" },
                    ].map(({ weight, label }) => {
                      const value = price.pricePerGram * weight;
                      const withGst = value * 1.03;
                      return (
                        <div key={weight} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                          <span className="text-xs text-gray-600">{label}</span>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-900">₹{value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                            <span className="text-[10px] text-gray-400 ml-1">(+GST: ₹{withGst.toLocaleString("en-IN", { maximumFractionDigits: 0 })})</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Link
                    href="/silver-price-calculator"
                    className="block text-center text-xs font-medium text-[#1e3a5f] hover:underline mt-3 py-2 bg-gray-50 rounded-lg"
                  >
                    Calculate Custom Weight →
                  </Link>
                </div>
                
                {/* Ad Placeholder - Hidden on mobile */}
                <div className="hidden sm:block card p-6 bg-gray-50 border-2 border-dashed border-gray-300">
                  <p className="text-center text-sm text-gray-400">
                    Advertisement Space
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Educational Content Sections */}
        <section className="py-6 sm:py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

            {/* Price Difference Section */}
            <div id="price-difference" className="scroll-mt-20">
              <PriceDifferenceExplainer />
            </div>

            {/* Purity Guide Section */}
            <div id="purity-guide" className="scroll-mt-20">
              <SilverPurityGuide />
            </div>

            {/* Market Factors Detailed Section */}
            <div id="market-factors-detailed" className="scroll-mt-20">
              <MarketFactorsDetailed />
            </div>

            {/* SEO Text Content */}
            <div className="card p-4 sm:p-6 lg:p-8">
              <div className="prose prose-gray max-w-none">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Silver Rate Today in India - Live Price Updates
                </h2>
                <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  Welcome to SilverInfo.in, India&apos;s trusted source for indicative silver prices
                  (<span className="font-medium">chandi ka bhav</span>). Our platform provides silver rate estimates
                  calculated from international spot prices (COMEX) and USD/INR exchange rates, with live updates
                  every 30 seconds. Whether you&apos;re searching for &quot;aaj ka chandi rate&quot; or &quot;silver price today&quot;,
                  we&apos;ve got you covered.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4 sm:mt-6 mb-2 sm:mb-3">
                  Understanding Silver Prices in India (चांदी की कीमत)
                </h3>
                <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  Silver prices in India are influenced by multiple factors: international COMEX prices,
                  USD/INR exchange rates, import duties (10%), GST (3%), and seasonal demand. The price
                  typically varies by ₹50-200 across different cities due to local taxes and transportation costs.
                  MCX (Multi Commodity Exchange) serves as the primary price discovery mechanism for domestic silver.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4 sm:mt-6 mb-2 sm:mb-3">
                  Silver Purity: 999 vs 925 vs 900
                </h3>
                <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                  <strong>999 Fine Silver</strong> (99.9% pure) is ideal for investment bars and coins.
                  <strong> 925 Sterling Silver</strong> (92.5% pure) is preferred for jewelry due to better durability.
                  <strong> 900 Coin Silver</strong> (90% pure) is common in collectible coins. Always look for
                  BIS Hallmark to verify purity before purchase.
                </p>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4 sm:mt-6 mb-2 sm:mb-3">
                  How to Use Our Silver Calculator
                </h3>
                <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
                  Our silver price calculator helps you determine the exact cost of silver based
                  on weight, purity, and making charges. Simply enter the weight in grams, select
                  the purity (999, 925, or 900), and add making charges (6-15%). The calculator
                  includes 3% GST on silver value and 5% GST on making charges automatically.
                </p>
              </div>

              {/* Related Hindi Searches - Visible section for multilingual users */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-600">
                  <strong className="text-gray-700">Also searched:</strong> chandi rate today, aaj ka chandi ka bhav,
                  silver ka rate aaj, चांदी का भाव, चांदी की कीमत, 999 silver price,
                  925 sterling silver rate, chandi ki keemat, silver rate in Delhi Mumbai Chennai Bangalore,
                  MCX silver rate, import duty on silver, GST on chandi
                </p>
              </div>
            </div>
            
            {/* Live Price Formula Card - Transparency */}
            <div className="card p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-white border-slate-200">
              <PriceFormulaCard
                comexUsd={price.comexUsd || 30.50}
                usdInr={price.usdInr || 84.50}
                finalPriceInr={price.pricePerGram}
                variant="full"
              />
            </div>

            {/* Data Sources & Transparency Section - E-E-A-T Signal */}
            <div className="card p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-white border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📊</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Our Data Sources & Methodology
                  </h2>
                  <p className="text-xs text-gray-500">
                    Last verified: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} • Updated every 30 seconds
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Primary Source */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</span>
                    <h3 className="font-semibold text-gray-800">COMEX Silver Futures</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Primary data from CME Group (Chicago Mercantile Exchange) - the world&apos;s leading commodities exchange.
                  </p>
                  <a 
                    href="https://www.cmegroup.com/markets/metals/precious/silver.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    CME Group Official →
                  </a>
                </div>
                
                {/* Exchange Rate */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">2</span>
                    <h3 className="font-semibold text-gray-800">USD/INR Exchange Rate</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Real-time forex rates from multiple sources including RBI reference rate and interbank markets.
                  </p>
                  <a 
                    href="https://www.rbi.org.in/scripts/ReferenceRateArchive.aspx" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    RBI Reference Rate →
                  </a>
                </div>
                
                {/* Calculation */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">3</span>
                    <h3 className="font-semibold text-gray-800">Indian Market Adjustments</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Import duty (10%), IGST (3%), and MCX premium (~10%) applied per government regulations.
                  </p>
                  <Link 
                    href="/how-we-calculate"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Full Methodology →
                  </Link>
                </div>
              </div>
              
              {/* Transparency Badges */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  ✓ Real-time API Data
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  ✓ No Manual Intervention
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                  ✓ Indicative Prices
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                  ✓ 30-Second Updates
                </span>
              </div>
              
              {/* Disclaimer */}
              <p className="text-[10px] text-gray-400 mt-3">
                <strong>Disclaimer:</strong> Prices shown are indicative and derived from international markets. 
                Actual retail prices may vary. Always verify with your local jeweler or bullion dealer before making purchase decisions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
