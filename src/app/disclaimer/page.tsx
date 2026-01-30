import type { Metadata } from "next";
import Link from "next/link";
import { generateBreadcrumbSchema } from "@/lib/schema";

// Force static generation - this page rarely changes
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once per day

export const metadata: Metadata = {
  title: "Disclaimer - SilverInfo.in",
  description:
    "Important disclaimer about silver price information on SilverInfo.in. Understand the limitations of indicative prices and investment considerations.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Disclaimer", url: "https://silverinfo.in/disclaimer" },
  ]);

  // WebPage schema for legal content
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Disclaimer - SilverInfo.in",
    description: "Important disclaimer about silver price information on SilverInfo.in. Understand the limitations of indicative prices.",
    url: "https://silverinfo.in/disclaimer",
    isPartOf: {
      "@type": "WebSite",
      name: "SilverInfo.in",
      url: "https://silverinfo.in",
    },
    about: {
      "@type": "Thing",
      name: "Legal Disclaimer",
    },
    dateModified: "2026-01-22",
    inLanguage: "en-IN",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
              <span>Disclaimer</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Disclaimer</h1>
            <p className="text-gray-600 mt-2">Last updated: January 22, 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="card p-8">
              <div className="prose prose-gray max-w-none">
                
                {/* Important Notice */}
                <div className="not-prose bg-red-50 border-l-4 border-red-500 p-4 mb-8">
                  <h3 className="font-bold text-red-800 mb-2">⚠️ Important Notice</h3>
                  <p className="text-red-700">
                    All silver prices displayed on SilverInfo.in are <strong>indicative estimates</strong> 
                    for informational purposes only. They are NOT official market rates and should 
                    NOT be used as the sole basis for financial decisions.
                  </p>
                </div>

                <h2>1. Price Information Disclaimer</h2>
                <p>
                  The silver prices, rates, and related information displayed on SilverInfo.in 
                  are calculated from international market data and are provided for general 
                  informational purposes only. These prices:
                </p>
                <ul>
                  <li>Are <strong>indicative estimates</strong>, not official exchange rates</li>
                  <li>May differ from actual retail prices by 2-5% or more</li>
                  <li>Do not represent quotes or offers to buy or sell silver</li>
                  <li>Should not be relied upon for trading or investment decisions</li>
                  <li>May be delayed, inaccurate, or incomplete</li>
                </ul>

                <h2>2. No Financial Advice</h2>
                <p>
                  The content on SilverInfo.in, including prices, articles, calculators, and 
                  educational materials:
                </p>
                <ul>
                  <li>Does <strong>NOT</strong> constitute financial, investment, or trading advice</li>
                  <li>Does <strong>NOT</strong> constitute a recommendation to buy, sell, or hold silver</li>
                  <li>Should <strong>NOT</strong> be the basis for any investment decision</li>
                </ul>
                <p>
                  Always consult with a qualified financial advisor before making investment 
                  decisions. Past performance of silver prices does not guarantee future results.
                </p>

                <h2>3. No Guarantees</h2>
                <p>
                  SilverInfo.in makes no representations or warranties about:
                </p>
                <ul>
                  <li>The accuracy, completeness, or timeliness of price information</li>
                  <li>The reliability of data sources used</li>
                  <li>The availability of the website or its features</li>
                  <li>The results of any calculations or tools</li>
                </ul>
                <p>
                  We provide this service on an &quot;as is&quot; and &quot;as available&quot; basis without 
                  warranties of any kind, either express or implied.
                </p>

                <h2>4. Data Sources</h2>
                <p>
                  Silver prices on SilverInfo.in are derived from:
                </p>
                <ul>
                  <li>International spot prices (COMEX via Yahoo Finance)</li>
                  <li>Currency exchange rates (Frankfurter API / ECB)</li>
                  <li>Estimated import duties and local market premiums</li>
                </ul>
                <p>
                  For details on our calculation methodology, please visit our{" "}
                  <Link href="/how-we-calculate" className="text-[#1e3a5f]">
                    How We Calculate
                  </Link>{" "}
                  page.
                </p>

                <h2>5. For Official Rates</h2>
                <p>
                  For official silver prices and rates, please refer to:
                </p>
                <ul>
                  <li>
                    <strong>MCX India</strong> -{" "}
                    <a 
                      href="https://www.mcxindia.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#1e3a5f]"
                    >
                      mcxindia.com
                    </a>
                  </li>
                  <li>
                    <strong>India Bullion and Jewellers Association (IBJA)</strong>
                  </li>
                  <li>Your local authorized jeweler or bullion dealer</li>
                </ul>

                <h2>6. Limitation of Liability</h2>
                <p>
                  SilverInfo.in, its owners, operators, and affiliates shall not be liable for:
                </p>
                <ul>
                  <li>Any losses or damages arising from the use of price information</li>
                  <li>Decisions made based on content from this website</li>
                  <li>Inaccuracies, errors, or omissions in the data</li>
                  <li>Technical issues, downtime, or interruptions</li>
                  <li>Third-party content or external links</li>
                </ul>
                <p>
                  By using this website, you agree to hold SilverInfo.in harmless from any 
                  claims arising from your use of the information provided.
                </p>

                <h2>7. Third-Party Links</h2>
                <p>
                  This website may contain links to third-party websites. We are not 
                  responsible for the content, accuracy, or practices of these external sites. 
                  Links are provided for convenience and do not constitute endorsement.
                </p>

                <h2>8. Changes to Disclaimer</h2>
                <p>
                  We reserve the right to modify this disclaimer at any time. Changes will 
                  be effective immediately upon posting. Your continued use of the website 
                  constitutes acceptance of the modified disclaimer.
                </p>

                <h2>9. Governing Law</h2>
                <p>
                  This disclaimer is governed by the laws of India. Any disputes shall be 
                  subject to the exclusive jurisdiction of the courts in India.
                </p>

                <h2>10. Contact</h2>
                <p>
                  If you have questions about this disclaimer or our practices, please{" "}
                  <Link href="/contact" className="text-[#1e3a5f]">
                    contact us
                  </Link>
                  .
                </p>

                {/* Final Notice */}
                <div className="not-prose bg-gray-100 rounded-lg p-6 mt-8 text-center">
                  <p className="text-gray-600 text-sm">
                    By using SilverInfo.in, you acknowledge that you have read, understood, 
                    and agree to this disclaimer.
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
