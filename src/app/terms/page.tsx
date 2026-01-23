import type { Metadata } from "next";
import Link from "next/link";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Terms of Service - SilverInfo.in",
  description:
    "Terms and conditions for using SilverInfo.in. Read our terms of service, user guidelines, and acceptable use policy.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Terms of Service", url: "https://silverinfo.in/terms" },
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
              <span>Terms of Service</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-600 mt-2">Last updated: January 22, 2026</p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="card p-8">
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-gray-600">
                  Please read these Terms of Service (&quot;Terms&quot;) carefully before using 
                  SilverInfo.in (&quot;Website&quot;, &quot;Service&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                </p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing or using our Website, you agree to be bound by these Terms. 
                  If you disagree with any part of the Terms, you may not access the Service.
                </p>

                <h2>2. Description of Service</h2>
                <p>
                  SilverInfo.in provides informational services related to silver prices in India, 
                  including but not limited to:
                </p>
                <ul>
                  <li>Indicative silver price calculations based on international markets</li>
                  <li>Historical price charts and trends</li>
                  <li>Silver price calculators and tools</li>
                  <li>Educational content about silver</li>
                  <li>City-wise price comparisons</li>
                </ul>

                <div className="not-prose bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important</h4>
                  <p className="text-sm text-yellow-800">
                    All prices displayed are <strong>indicative estimates</strong> calculated from 
                    COMEX Silver Futures (SI=F) and are NOT official exchange rates. For accurate 
                    pricing, consult MCX India or your local jeweler.
                  </p>
                </div>

                <h2>3. Data Sources and Accuracy</h2>
                <p>
                  Our price calculations are derived from:
                </p>
                <ul>
                  <li>COMEX Silver Futures (SI=F) via Yahoo Finance</li>
                  <li>USD/INR exchange rates via Frankfurter API</li>
                  <li>Standard import duty and GST calculations</li>
                </ul>
                <p>
                  While we strive for accuracy, we do not guarantee that prices are error-free, 
                  complete, or current. Actual retail prices may vary by 2-5% based on location, 
                  jeweler, and market conditions.
                </p>

                <h2>4. Use of Service</h2>
                <p>You agree to use our Service only for lawful purposes. You agree not to:</p>
                <ul>
                  <li>Use the Service for any fraudulent or unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the Service</li>
                  <li>Scrape, harvest, or extract data without permission</li>
                  <li>Use automated systems to access the Service excessively</li>
                </ul>

                <h2>5. Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are owned 
                  by SilverInfo.in and are protected by international copyright, trademark, 
                  and other intellectual property laws.
                </p>

                <h2>6. No Investment Advice</h2>
                <p>
                  The information provided on this Website is for general informational purposes 
                  only. It should not be considered as financial, investment, or professional advice. 
                  Always consult with qualified financial advisors before making investment decisions.
                </p>

                <h2>7. Limitation of Liability</h2>
                <p>
                  In no event shall SilverInfo.in, its directors, employees, or affiliates be 
                  liable for any indirect, incidental, special, consequential, or punitive damages, 
                  including but not limited to:
                </p>
                <ul>
                  <li>Loss of profits, revenue, or data</li>
                  <li>Financial losses based on price information</li>
                  <li>Business interruption</li>
                  <li>Any other intangible losses</li>
                </ul>

                <h2>8. Third-Party Links</h2>
                <p>
                  Our Website may contain links to third-party websites. We are not responsible 
                  for the content, accuracy, or practices of these external sites. Use third-party 
                  services at your own risk.
                </p>

                <h2>9. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless SilverInfo.in and its affiliates from 
                  any claims, damages, losses, or expenses arising from your use of the Service 
                  or violation of these Terms.
                </p>

                <h2>10. Modifications</h2>
                <p>
                  We reserve the right to modify or replace these Terms at any time. Changes will 
                  be effective immediately upon posting. Your continued use of the Service after 
                  changes constitutes acceptance of the modified Terms.
                </p>

                <h2>11. Termination</h2>
                <p>
                  We may terminate or suspend your access to the Service immediately, without 
                  prior notice, for any reason, including breach of these Terms.
                </p>

                <h2>12. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of 
                  India. Any disputes shall be subject to the exclusive jurisdiction of the 
                  courts in India.
                </p>

                <h2>13. Severability</h2>
                <p>
                  If any provision of these Terms is found to be unenforceable, the remaining 
                  provisions will remain in full force and effect.
                </p>

                <h2>14. Contact</h2>
                <p>
                  If you have any questions about these Terms, please{" "}
                  <Link href="/contact" className="text-[#1e3a5f]">
                    contact us
                  </Link>
                  .
                </p>

                {/* Related Links */}
                <div className="not-prose bg-gray-100 rounded-lg p-6 mt-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Related Documents</h4>
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      href="/privacy-policy" 
                      className="text-[#1e3a5f] hover:underline"
                    >
                      Privacy Policy →
                    </Link>
                    <Link 
                      href="/disclaimer" 
                      className="text-[#1e3a5f] hover:underline"
                    >
                      Disclaimer →
                    </Link>
                    <Link 
                      href="/how-we-calculate" 
                      className="text-[#1e3a5f] hover:underline"
                    >
                      How We Calculate →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
