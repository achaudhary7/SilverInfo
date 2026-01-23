import type { Metadata } from "next";
import Link from "next/link";
import { generateBreadcrumbSchema } from "@/lib/schema";

// Page content last reviewed date
const LAST_UPDATED = "2026-01-23";

export const metadata: Metadata = {
  title: "About Us - SilverInfo.in",
  description:
    "Learn about SilverInfo.in - India's trusted source for live silver prices, market analysis, and silver education. Our mission is to provide accurate, real-time silver information.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "About", url: "https://silverinfo.in/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#1e3a5f]">
              Home
            </Link>
            <span>/</span>
            <span>About</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">About SilverInfo.in</h1>
          <p className="text-xs text-gray-400 mt-2">
            Last updated: {new Date(LAST_UPDATED).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="card p-8">
            <div className="prose prose-gray max-w-none">
              <h2>Our Mission</h2>
              <div className="bg-blue-50 border-l-4 border-[#1e3a5f] p-4 mb-6 not-prose">
                <p className="text-[#1e3a5f] font-bold text-xl mb-1">
                  Calculated, Not Copied.
                </p>
                <p className="text-[#1e3a5f] text-sm">
                  Prices derived from COMEX futures + USD/INR exchange rates — not scraped from other websites.
                </p>
                <Link href="/how-we-calculate" className="text-sm text-[#1e3a5f] underline hover:no-underline mt-2 inline-block">
                  See Our Formula →
                </Link>
              </div>
              <p>
                SilverInfo.in is India&apos;s dedicated platform for silver price
                tracking and education. We don&apos;t just show you prices — we explain 
                <em> why</em> they change. Our mission is to provide accurate, transparent, 
                and real-time silver price information to help consumers, investors,
                and jewelry buyers make informed decisions.
              </p>

              <h2>What We Offer</h2>
              <ul>
                <li>
                  <strong>Live Silver Prices</strong> - Real-time silver rates
                  calculated from international markets and auto-refreshed every 30 seconds
                </li>
                <li>
                  <strong>City-wise Prices</strong> - Silver rates across 20+ major
                  Indian cities
                </li>
                <li>
                  <strong>Price Calculator</strong> - Calculate exact silver costs
                  with purity and making charges
                </li>
                <li>
                  <strong>Historical Charts</strong> - Track silver price trends
                  over days, months, and years
                </li>
                <li>
                  <strong>Educational Content</strong> - Learn about silver purity,
                  hallmarks, and investment
                </li>
                <li>
                  <strong>Daily Updates</strong> - Market analysis and news
                  affecting silver prices
                </li>
              </ul>

              <h2>Why Trust Us</h2>
              <p>
                Our prices are sourced from reliable international market feeds and
                are verified against multiple sources for accuracy. We follow
                transparent methodologies and clearly explain how prices are
                calculated.
              </p>

              <h2>Data Sources</h2>
              <p>
                Silver prices on SilverInfo.in are derived from international spot
                markets (COMEX) and converted to INR using live exchange rates from ECB. 
                City-wise variations account for local taxes and average making charges in
                each region.
              </p>
              <p className="mt-4">
                <strong>Official References:</strong>
              </p>
              <ul>
                <li>
                  <a href="https://www.mcxindia.com" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                    MCX India
                  </a> - Multi Commodity Exchange of India (Official silver futures)
                </li>
                <li>
                  <a href="https://www.rbi.org.in" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                    Reserve Bank of India
                  </a> - Official exchange rates
                </li>
                <li>
                  <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                    Bureau of Indian Standards (BIS)
                  </a> - Hallmarking and purity standards
                </li>
                <li>
                  <a href="https://ibjarates.com" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                    IBJA
                  </a> - India Bullion and Jewellers Association rates
                </li>
              </ul>

              <h2>Disclaimer</h2>
              <p>
                While we strive for accuracy, all prices shown are indicative and
                for informational purposes only. Actual prices may vary based on
                dealer, location, and market conditions. Always verify prices with
                your jeweler before making purchases.
              </p>

              <h2>Contact Us</h2>
              <p>
                Have questions or feedback? We&apos;d love to hear from you. Visit our{" "}
                <Link href="/contact" className="text-[#1e3a5f]">
                  Contact page
                </Link>{" "}
                to get in touch.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
