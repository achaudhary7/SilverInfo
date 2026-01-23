import Link from "next/link";
import { getSilverPriceWithChange, getHistoricalPrices, getCityPrices } from "@/lib/metalApi";
import { getRecentUpdates } from "@/lib/markdown";
import LivePriceCard from "@/components/LivePriceCard";
import { DynamicPriceChart, DynamicMiniChart } from "@/components/DynamicChart";
import { DynamicCityTable, DynamicCalculator, DynamicFAQ } from "@/components/DynamicComponents";
import WhyPriceChangedTeaser from "@/components/WhyPriceChangedTeaser";
import WhyPriceChangedFull from "@/components/WhyPriceChangedFull";
import { generateFAQSchema, generateBreadcrumbSchema, type FAQItem } from "@/lib/schema";

// Enable ISR - revalidate every 10 minutes (matches Yahoo Finance cache)
export const revalidate = 600;

// FAQ Data - Optimized for Google Featured Snippets (<300 chars per answer)
const faqItems: FAQItem[] = [
  {
    question: "What is the current silver rate in India today?",
    answer:
      "Silver rates are derived from COMEX prices + USD/INR exchange rate, refreshed every 30 seconds. Retail prices vary 2-5% due to local taxes. Check our live price card above for the current rate.",
  },
  {
    question: "How is silver price per gram calculated in India?",
    answer:
      "Formula: (COMEX USD price ÷ 31.1035 grams) × USD/INR rate + Import duty (7.5%) + GST (3%). See our methodology page for the complete calculation breakdown.",
  },
  {
    question: "What is the difference between 999 and 925 silver?",
    answer:
      "999 silver = 99.9% pure, ideal for coins/bars. 925 sterling = 92.5% silver + 7.5% copper for durability, preferred for jewelry. Price difference is about 7.5%.",
  },
  {
    question: "What factors affect silver prices in India?",
    answer:
      "Four key factors: (1) COMEX international prices, (2) USD/INR rate, (3) Import duty & GST, (4) Seasonal demand (peaks during Dhanteras/weddings). See our charts for trends.",
  },
  {
    question: "What are making charges for silver jewelry?",
    answer:
      "Making charges range 6-15% of silver value. Machine-made: ~6-8%, Handcrafted: ~12-15%. Our calculator includes making charges in the total cost estimate.",
  },
  {
    question: "Is GST applicable on silver purchases in India?",
    answer:
      "Yes, 3% GST applies to all silver purchases (bars, coins, jewelry). Calculated on: Silver value + Making charges. Our calculator includes GST automatically.",
  },
  {
    question: "How do silver rates vary across different cities in India?",
    answer:
      "Silver varies ₹50-200 per 10g across cities due to local taxes and dealer margins. Metro cities typically have competitive rates. Check our city-wise table above.",
  },
  {
    question: "What is a tola in silver measurement?",
    answer:
      "Tola = traditional Indian weight unit. 1 tola = 11.6638 grams. Commonly used for jewelry in India. Our calculator converts between grams, tola, and kg instantly.",
  },
];

export default async function HomePage() {
  // Fetch data - getSilverPriceWithChange includes 24h change calculation
  // Fetch 365 days to support 7d, 30d, 90d, and 1y chart views
  const [price, historicalPrices, cityPrices] = await Promise.all([
    getSilverPriceWithChange(),
    getHistoricalPrices(365),
    getCityPrices(),
  ]);
  
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
    numberOfItems: cityPrices.slice(0, 10).length,
    itemListElement: cityPrices.slice(0, 10).map((city, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${city.city} Silver Rate`,
      url: `https://silverinfo.in/city/${city.city.toLowerCase()}`,
      item: {
        "@type": "Product",
        name: `Silver in ${city.city}`,
        offers: {
          "@type": "Offer",
          price: city.pricePerGram,
          priceCurrency: "INR",
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
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header - Above the grid */}
            <div className="mb-6 sm:mb-8">
              {/* Mobile: Single badge, Desktop: Multiple badges */}
              <div className="mb-3 sm:mb-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                  <span className="relative flex h-1.5 w-1.5 mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  Live • 30s Refresh
                </span>
                <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  COMEX + Forex
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                Silver Rate Today in India
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
                Content last reviewed: 23 January 2026
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
                      const weekLow = Math.min(...last7Days);
                      const weekHigh = Math.max(...last7Days);
                      const weekAvg = last7Days.reduce((a, b) => a + b, 0) / last7Days.length;
                      const isNewHigh = price.pricePerGram > weekHigh;
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
                              {isNewHigh && <span className="ml-0.5">🔥</span>}
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
                      {cityPrices.slice(0, 4).map((city) => (
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
                      All →
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
            
            {/* City Table + FAQ - 2 Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* City-wise Prices */}
                <div id="city-prices" className="content-auto scroll-mt-20">
                  <DynamicCityTable cities={cityPrices} limit={10} />
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
        
        {/* SEO Content Section - Collapsible on mobile */}
        <section className="py-6 sm:py-12 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-gray max-w-none">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Silver Rate Today in India - Live Price Updates
              </h2>
              <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Welcome to SilverInfo.in, India&apos;s trusted source for indicative silver prices.
                Our platform provides silver rate estimates calculated from international spot prices 
                (COMEX) and USD/INR exchange rates, with live updates every 30 seconds.
              </p>
              
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4 sm:mt-6 mb-2 sm:mb-3">
                Understanding Silver Prices in India
              </h3>
              <p className="text-xs sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                Silver prices in India are influenced by multiple factors including international
                spot prices, USD/INR exchange rates, import duties, and local demand. The price
                typically varies by ₹50-200 across different cities.
              </p>
              
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4 sm:mt-6 mb-2 sm:mb-3">
                How to Use Our Silver Calculator
              </h3>
              <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
                Our silver price calculator helps you determine the exact cost of silver based
                on weight, purity, and making charges. Simply enter the weight in grams, select
                the purity, and add making charges. The calculator includes 3% GST automatically.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
