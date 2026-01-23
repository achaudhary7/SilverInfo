import Link from "next/link";
import { getSilverPriceWithChange, getHistoricalPrices, getCityPrices } from "@/lib/metalApi";
import { getRecentUpdates } from "@/lib/markdown";
import LivePriceCard from "@/components/LivePriceCard";
import { DynamicPriceChart, DynamicMiniChart } from "@/components/DynamicChart";
import { DynamicCityTable, DynamicCalculator, DynamicFAQ } from "@/components/DynamicComponents";
import WhyPriceChanged from "@/components/WhyPriceChanged";
import { generateFAQSchema, generateBreadcrumbSchema, type FAQItem } from "@/lib/schema";

// Enable ISR - revalidate every 10 minutes (matches Yahoo Finance cache)
export const revalidate = 600;

// FAQ Data
const faqItems: FAQItem[] = [
  {
    question: "What is the current silver rate in India today?",
    answer:
      "Silver rates in India fluctuate daily based on international market prices (COMEX), currency exchange rates (USD/INR), and local demand. The indicative silver rate displayed on this page is calculated from international spot prices and auto-refreshes every 30 seconds. Actual retail prices may vary by 2-5%. For official rates, check with MCX or your local jeweller.",
  },
  {
    question: "How is silver price per gram calculated in India?",
    answer:
      "Silver price per gram in India is calculated by converting the international spot price (in USD per troy ounce) to INR, then dividing by 31.1035 (grams per troy ounce). Import duties, GST (3%), and local taxes are added to arrive at the final retail price.",
  },
  {
    question: "What is the difference between 999 and 925 silver?",
    answer:
      "999 silver (also called fine silver or pure silver) contains 99.9% pure silver. 925 silver (sterling silver) contains 92.5% silver mixed with 7.5% other metals (usually copper) for added durability. 999 is preferred for coins and bars, while 925 is popular for jewelry due to its strength.",
  },
  {
    question: "When is the best time to buy silver in India?",
    answer:
      "Silver prices tend to be lower during periods of economic stability and higher during uncertainty. Many investors buy during price dips. Traditionally, purchases during festivals like Dhanteras and Akshaya Tritiya are considered auspicious. Monitor our price charts to identify favorable buying opportunities.",
  },
  {
    question: "What are making charges for silver jewelry?",
    answer:
      "Making charges are the labor cost for crafting silver into jewelry. They typically range from 6-15% of the silver value, varying by city and complexity. Handcrafted pieces have higher charges. Our calculator includes making charges to give you the total cost.",
  },
  {
    question: "Is GST applicable on silver purchases in India?",
    answer:
      "Yes, GST of 3% is applicable on silver purchases in India. This applies to silver bars, coins, and jewelry. The GST is calculated on the total value (silver + making charges). Our calculator automatically includes GST in the final price.",
  },
  {
    question: "How do silver rates vary across different cities in India?",
    answer:
      "Silver rates can vary by ₹50-200 per 10 grams across cities due to local taxes, transportation costs, and dealer margins. Metro cities like Mumbai and Delhi often have competitive rates, while smaller cities may have slightly higher prices. Check our city-wise price table for current rates.",
  },
  {
    question: "What is a tola in silver measurement?",
    answer:
      "Tola is a traditional Indian unit of weight used for precious metals. 1 tola equals approximately 11.6638 grams. Silver jewelry and coins are often sold by tola in India. Our calculator supports conversion between grams, tola, and other units.",
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
  
  return (
    <>
      {/* JSON-LD Schema */}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
            
            {/* Cards Grid - Stack on mobile, side-by-side on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Left: Price Card */}
              <LivePriceCard initialPrice={price} pollInterval={30000} />
              
              {/* Right: Mini Chart */}
              <div className="card p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">7-Day Trend</h2>
                    <p className="text-xs sm:text-sm text-gray-500">Silver price movement</p>
                  </div>
                  <Link
                    href="/silver-rate-today"
                    className="text-xs sm:text-sm font-medium text-[#1e3a5f] hover:underline py-2 px-3 -mr-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px] flex items-center"
                  >
                    Full Chart →
                  </Link>
                </div>
                <DynamicMiniChart data={historicalPrices} />
                
                {/* Quick Stats - Include current price for accurate High/Low */}
                {(() => {
                  const last7Days = historicalPrices.slice(-7).map((p) => p.price);
                  const allPrices = [...last7Days, price.pricePerGram]; // Include today's live price
                  const weekLow = Math.min(...allPrices);
                  const weekHigh = Math.max(...allPrices);
                  const weekAvg = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
                  
                  return (
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-[10px] sm:text-xs text-gray-500">7D Low</p>
                        <p className="text-xs sm:text-sm font-semibold text-red-600">
                          ₹{weekLow.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] sm:text-xs text-gray-500">7D Avg</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900">
                          ₹{weekAvg.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] sm:text-xs text-gray-500">7D High</p>
                        <p className="text-xs sm:text-sm font-semibold text-green-600">
                          ₹{weekHigh.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })()}
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
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* Full Price Chart */}
                <DynamicPriceChart data={historicalPrices} />
                
                {/* City-wise Prices - Lazy Loaded with content-visibility for performance */}
                <div className="content-auto">
                  <DynamicCityTable cities={cityPrices} limit={10} />
                </div>
                
                {/* FAQ Section - Lazy Loaded with content-visibility for performance */}
                <div className="content-auto">
                  <DynamicFAQ
                    items={faqItems}
                    title="Frequently Asked Questions About Silver"
                    description="Common questions about silver prices, purity, and buying in India"
                  />
                </div>
              </div>
              
              {/* Right Column - 1/3 width */}
              <div className="space-y-6 sm:space-y-8">
                {/* Why Price Changed Today - Key Differentiator */}
                <WhyPriceChanged />
                
                {/* Quick Calculator - Lazy Loaded */}
                <DynamicCalculator currentPrice={price.pricePerGram} compact />
                
                {/* Recent Updates */}
                <div className="card p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Latest Updates</h3>
                    <Link
                      href="/updates"
                      className="text-xs sm:text-sm font-medium text-[#1e3a5f] hover:underline py-2 px-3 -mr-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px] flex items-center"
                    >
                      View All →
                    </Link>
                  </div>
                  
                  {recentUpdates.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {recentUpdates.map((post) => (
                        <Link
                          key={post.slug}
                          href={`/updates/${post.slug}`}
                          className="block group py-2 -mx-2 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-100"
                        >
                          <p className="text-[10px] sm:text-xs text-gray-400 mb-1">
                            {new Date(post.date).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-[#1e3a5f] line-clamp-2">
                            {post.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-500">No updates yet. Check back soon!</p>
                  )}
                </div>
                
                {/* Quick Links */}
                <div className="card p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Links</h3>
                  <div className="space-y-1">
                    <Link
                      href="/silver-rate-today"
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-[#1e3a5f] py-3 sm:py-2 px-2 -mx-2 border-b border-gray-100 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
                    >
                      <span>📊</span> Full Price Dashboard
                    </Link>
                    <Link
                      href="/silver-price-calculator"
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-[#1e3a5f] py-3 sm:py-2 px-2 -mx-2 border-b border-gray-100 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
                    >
                      <span>🧮</span> Advanced Calculator
                    </Link>
                    <Link
                      href="/learn/what-is-sterling-silver"
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-[#1e3a5f] py-3 sm:py-2 px-2 -mx-2 border-b border-gray-100 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
                    >
                      <span>📚</span> Silver Purity Guide
                    </Link>
                    <Link
                      href="/learn/silver-hallmark-guide"
                      className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-[#1e3a5f] py-3 sm:py-2 px-2 -mx-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 min-h-[44px]"
                    >
                      <span>✓</span> Hallmark Verification
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
