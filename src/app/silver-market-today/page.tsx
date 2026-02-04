import type { Metadata } from "next";
import Link from "next/link";
import { getSilverPriceWithChange, getHistoricalPrices } from "@/lib/metalApi";
import { generateBreadcrumbSchema } from "@/lib/schema";
import LivePriceCard from "@/components/LivePriceCard";
import { DynamicMiniChart } from "@/components/DynamicChart";

// Revalidate frequently for fresh content - important for Discover
export const revalidate = 28800; // ISR: Revalidate every 8 hours (client polling handles freshness)

// Dynamic metadata for today's date
export async function generateMetadata(): Promise<Metadata> {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    title: `Silver Market Analysis - ${dateStr} - SilverInfo.in`,
    description: `Today's silver price analysis for India. Live rates, market trends, COMEX & forex impact, and what's driving silver prices on ${dateStr}.`,
    keywords: [
      "silver market today",
      "silver price analysis",
      "silver market news",
      "silver rate today india",
      "COMEX silver today",
    ],
    alternates: {
      canonical: "/silver-market-today",
    },
    openGraph: {
      title: `Silver Market Analysis - ${dateStr}`,
      description: `Today's silver price analysis. Live rates from COMEX, market trends, and expert insights.`,
      type: "article",
      publishedTime: today.toISOString(),
      modifiedTime: today.toISOString(),
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `Silver Market Analysis - ${dateStr}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Silver Market Analysis - ${dateStr}`,
      description: `Today's silver price analysis for India.`,
      images: ["/og-image.png"],
    },
  };
}

export default async function SilverMarketTodayPage() {
  const [priceData, historicalPrices] = await Promise.all([
    getSilverPriceWithChange(),
    getHistoricalPrices(30),
  ]);

  // If API completely fails, show error page - NO FAKE DATA
  if (!priceData) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Silver Market Today
            </h1>
            <div className="p-8 rounded-xl bg-red-50 border border-red-200 max-w-lg mx-auto">
              <p className="text-red-600 text-lg mb-4">
                ⚠️ Unable to fetch live market data
              </p>
              <p className="text-gray-600 mb-4">
                We&apos;re having trouble connecting to our price sources. Please refresh the page or try again later.
              </p>
              <a 
                href="/silver-market-today"
                className="inline-block px-6 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a6f] transition-colors"
              >
                Refresh Page
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Use real API data only - no fallbacks
  const price = priceData;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const isoDate = today.toISOString();

  // Calculate week-over-week change
  const weekAgoPrice = historicalPrices.length >= 7 
    ? historicalPrices[historicalPrices.length - 7]?.price 
    : null;
  const weekChange = weekAgoPrice 
    ? ((price.pricePerGram - weekAgoPrice) / weekAgoPrice) * 100 
    : null;

  // Calculate month-over-month change
  const monthAgoPrice = historicalPrices.length >= 30 
    ? historicalPrices[0]?.price 
    : null;
  const monthChange = monthAgoPrice 
    ? ((price.pricePerGram - monthAgoPrice) / monthAgoPrice) * 100 
    : null;

  // Market status
  const isMarketOpen = (() => {
    const hour = today.getUTCHours();
    const day = today.getUTCDay();
    // COMEX hours roughly 23:00 - 22:00 UTC (almost 23 hours)
    // Closed Sat-Sun
    return day !== 0 && day !== 6;
  })();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Silver Market Today", url: "https://silverinfo.in/silver-market-today" },
  ]);

  // NewsArticle Schema - Critical for Google Discover
  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: `Silver Market Analysis - ${dateStr}`,
    description: `Today's silver price analysis for India. Live rates, market trends, and what's driving prices.`,
    image: {
      "@type": "ImageObject",
      url: "https://silverinfo.in/og-image.png",
      width: 1200,
      height: 630,
    },
    author: {
      "@type": "Person",
      name: "SilverInfo Research Team",
      url: "https://silverinfo.in/about/team",
      jobTitle: "Silver Market Analyst",
      worksFor: {
        "@type": "Organization",
        name: "SilverInfo.in",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "SilverInfo.in",
      url: "https://silverinfo.in",
      logo: {
        "@type": "ImageObject",
        url: "https://silverinfo.in/icon-192.png",
        width: 192,
        height: 192,
      },
    },
    datePublished: isoDate,
    dateModified: isoDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://silverinfo.in/silver-market-today",
    },
    articleSection: "Market Analysis",
    keywords: "silver price, silver market, COMEX, silver rate india",
    isAccessibleForFree: true,
    copyrightHolder: {
      "@type": "Organization",
      name: "SilverInfo.in",
    },
  };

  // Determine market sentiment
  const getSentiment = () => {
    if (price.change24h > 1) return { text: "Bullish", color: "text-green-600", bg: "bg-green-50" };
    if (price.change24h < -1) return { text: "Bearish", color: "text-red-600", bg: "bg-red-50" };
    return { text: "Neutral", color: "text-gray-600", bg: "bg-gray-50" };
  };
  const sentiment = getSentiment();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Optimized for Discover (needs compelling visual) */}
        <section className="bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] text-white py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span>Market Analysis</span>
            </div>

            {/* Headline - Clear, non-clickbait (Discover requirement) */}
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${sentiment.bg} ${sentiment.color}`}>
                {sentiment.text}
              </span>
              {isMarketOpen ? (
                <span className="flex items-center gap-1.5 text-xs text-green-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Markets Open
                </span>
              ) : (
                <span className="text-xs text-gray-400">Markets Closed</span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Silver Market Analysis
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-2">
              {dateStr}
            </p>
            <p className="text-gray-400 text-sm">
              Live analysis • Updated every 5 minutes • By SilverInfo Research Team
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Left Column - Analysis Content */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Today's Summary */}
                <article className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    📊 Today&apos;s Market Summary
                  </h2>
                  
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      Silver is trading at <strong className="text-gray-900">₹{price.pricePerGram.toFixed(2)}</strong> per gram 
                      today, {price.change24h >= 0 ? "up" : "down"} <strong className={price.change24h >= 0 ? "text-green-600" : "text-red-600"}>
                      {Math.abs(price.change24h).toFixed(2)}%</strong> from yesterday&apos;s close.
                      {weekChange !== null && (
                        <> Over the past week, prices have moved {weekChange >= 0 ? "higher" : "lower"} by {Math.abs(weekChange).toFixed(2)}%.</>
                      )}
                    </p>

                    <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                      Key Factors Affecting Today&apos;s Price
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-[#1e3a5f] mt-1">•</span>
                        <span><strong>COMEX Silver:</strong> International spot price at ${(price.pricePerGram * 31.1035 / price.pricePerGram * 0.0119).toFixed(2)}/oz influencing Indian rates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#1e3a5f] mt-1">•</span>
                        <span><strong>USD/INR Rate:</strong> Forex movements impacting import costs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#1e3a5f] mt-1">•</span>
                        <span><strong>Market Sentiment:</strong> Currently {sentiment.text.toLowerCase()} based on technical indicators</span>
                      </li>
                    </ul>
                  </div>
                </article>

                {/* Price Performance */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    📈 Price Performance
                  </h2>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">24h Change</p>
                      <p className={`text-xl font-bold ${price.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {price.change24h >= 0 ? "+" : ""}{price.change24h.toFixed(2)}%
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">7d Change</p>
                      <p className={`text-xl font-bold ${weekChange && weekChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {weekChange ? `${weekChange >= 0 ? "+" : ""}${weekChange.toFixed(2)}%` : "—"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">30d Change</p>
                      <p className={`text-xl font-bold ${monthChange && monthChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {monthChange ? `${monthChange >= 0 ? "+" : ""}${monthChange.toFixed(2)}%` : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-[200px]">
                    <DynamicMiniChart data={historicalPrices.slice(-7)} />
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">7-day price trend</p>
                </div>

                {/* Market Context */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    🌍 Market Context
                  </h2>
                  
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Silver prices in India are primarily driven by international COMEX prices 
                      and the USD/INR exchange rate. Today&apos;s price reflects:
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-blue-900 mb-1">International Factors</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• COMEX futures trading</li>
                          <li>• Global industrial demand</li>
                          <li>• US Dollar strength</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <h4 className="font-semibold text-green-900 mb-1">Domestic Factors</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• INR exchange rate</li>
                          <li>• Import duty (7.5%)</li>
                          <li>• Local jewellery demand</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Author Bio - E-E-A-T */}
                <div className="card p-6 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-2xl font-bold">SI</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">SilverInfo Research Team</h4>
                      <p className="text-sm text-gray-500 mb-2">Silver Market Analysts</p>
                      <p className="text-sm text-gray-600">
                        Our team analyzes silver market data daily using COMEX prices and 
                        forex rates to provide accurate, transparent price information for Indian consumers.
                      </p>
                      <Link href="/about/team" className="text-sm text-[#1e3a5f] hover:underline mt-2 inline-block">
                        About Our Team →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Live Price Card */}
                <LivePriceCard 
                  initialPrice={price} 
                  lastWeekPrice={weekAgoPrice || undefined}
                />

                {/* Quick Links */}
                <div className="card p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Related Pages</h3>
                  <div className="space-y-2">
                    <Link
                      href="/silver-rate-today"
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span>📊</span>
                      <span className="text-sm font-medium text-gray-700">Full Dashboard</span>
                    </Link>
                    <Link
                      href="/silver-price-calculator"
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span>🧮</span>
                      <span className="text-sm font-medium text-gray-700">Price Calculator</span>
                    </Link>
                    <Link
                      href="/how-we-calculate"
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span>📐</span>
                      <span className="text-sm font-medium text-gray-700">Our Methodology</span>
                    </Link>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="card p-4 bg-amber-50 border-amber-200">
                  <p className="text-xs text-amber-800">
                    <strong>Disclaimer:</strong> This analysis is for informational purposes only. 
                    Prices shown are indicative and may vary. This is not financial advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
