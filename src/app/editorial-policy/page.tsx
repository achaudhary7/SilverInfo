import type { Metadata } from "next";
import Link from "next/link";
import { generateBreadcrumbSchema } from "@/lib/schema";

// Page content last reviewed date - now dynamic
const LAST_UPDATED = new Date().toISOString().split('T')[0];

export const metadata: Metadata = {
  title: "Editorial Policy - SilverInfo.in",
  description:
    "Our editorial policy outlines our commitment to accuracy, transparency, and reader trust. Learn how we create, review, and update our silver market content.",
  alternates: {
    canonical: "/editorial-policy",
  },
};

export default function EditorialPolicyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Editorial Policy", url: "https://silverinfo.in/editorial-policy" },
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
              <span>Editorial Policy</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Editorial Policy</h1>
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
                
                <h2>Our Commitment to Accuracy</h2>
                <p>
                  At SilverInfo.in, we are committed to providing accurate, timely, and 
                  transparent information about silver prices and the precious metals market. 
                  Our editorial standards ensure that every piece of content meets high 
                  quality benchmarks before publication.
                </p>

                <h2>Content Creation Process</h2>
                
                <h3>1. Research & Data Collection</h3>
                <ul>
                  <li>Silver prices are sourced from COMEX (international benchmark) and converted using live USD/INR exchange rates</li>
                  <li>We cross-reference data from multiple sources including MCX India, RBI, and IBJA</li>
                  <li>All market analysis is based on publicly available data and official sources</li>
                </ul>

                <h3>2. Writing & Review</h3>
                <ul>
                  <li>Content is written by our team of silver market analysts with expertise in Indian commodity markets</li>
                  <li>Every article undergoes editorial review for accuracy, clarity, and factual correctness</li>
                  <li>Technical claims are verified against authoritative sources</li>
                </ul>

                <h3>3. Publication & Updates</h3>
                <ul>
                  <li>All articles display clear publication and last-modified dates</li>
                  <li>Content is reviewed and updated regularly to reflect current market conditions</li>
                  <li>Outdated information is either updated or clearly marked as historical</li>
                </ul>

                <h2>Editorial Independence</h2>
                <p>
                  Our editorial content is independent of any commercial interests. We do not:
                </p>
                <ul>
                  <li>Accept payment for favorable coverage</li>
                  <li>Allow advertisers to influence our editorial content</li>
                  <li>Publish sponsored content without clear disclosure</li>
                  <li>Provide financial advice or investment recommendations</li>
                </ul>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-6 not-prose">
                  <p className="text-amber-800 font-medium">Important Disclaimer</p>
                  <p className="text-amber-700 text-sm mt-1">
                    SilverInfo.in provides indicative prices for informational purposes only. 
                    We are not a trading platform and do not provide investment advice. 
                    Always verify prices with authorized dealers before making purchases.
                  </p>
                </div>

                <h2>Source Attribution</h2>
                <p>
                  We clearly attribute our data sources:
                </p>
                <ul>
                  <li><strong>Price Data:</strong> COMEX Silver Futures via Yahoo Finance</li>
                  <li><strong>Exchange Rates:</strong> European Central Bank via Frankfurter API</li>
                  <li><strong>Regulatory Info:</strong> BIS (Bureau of Indian Standards), RBI</li>
                  <li><strong>Market Data:</strong> MCX India, IBJA</li>
                </ul>

                <h2>Corrections Policy</h2>
                <p>
                  We take errors seriously and correct them promptly:
                </p>
                <ul>
                  <li><strong>Minor errors</strong> (typos, formatting): Corrected silently</li>
                  <li><strong>Factual errors</strong>: Corrected with a visible correction note</li>
                  <li><strong>Significant errors</strong>: Corrected with an editor&apos;s note explaining the change</li>
                </ul>
                <p>
                  To report an error, please <Link href="/contact" className="text-[#1e3a5f]">contact us</Link>.
                </p>

                <h2>Author Credentials</h2>
                <p>
                  Our content is created by the SilverInfo Team, comprising:
                </p>
                <ul>
                  <li>Finance researchers with expertise in commodity markets</li>
                  <li>Precious metals analysts familiar with Indian market dynamics</li>
                  <li>Technical writers specializing in financial education</li>
                </ul>
                <p>
                  Learn more about our team on the <Link href="/about/team" className="text-[#1e3a5f]">Team page</Link>.
                </p>

                <h2>AI-Assisted Content</h2>
                <p>
                  We may use AI tools to assist with:
                </p>
                <ul>
                  <li>Grammar and style improvements</li>
                  <li>Data formatting and calculations</li>
                  <li>Initial research summaries</li>
                </ul>
                <p>
                  All AI-assisted content is reviewed and edited by human analysts before 
                  publication. We do not publish AI-generated content without human oversight 
                  and verification.
                </p>

                <h2>Contact</h2>
                <p>
                  For questions about our editorial policy or to report concerns, 
                  please <Link href="/contact" className="text-[#1e3a5f]">contact us</Link>.
                </p>

              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
