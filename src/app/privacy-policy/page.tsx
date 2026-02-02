import type { Metadata } from "next";
import Link from "next/link";
import { generateBreadcrumbSchema } from "@/lib/schema";

// Force static generation - this page rarely changes
export const dynamic = "force-static";
export const revalidate = 86400; // Revalidate once per day

export const metadata: Metadata = {
  title: "Privacy Policy - SilverInfo.in",
  description:
    "Read SilverInfo.in's privacy policy. Learn how we collect, use, and protect your information when you use our silver price tracking platform.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Privacy Policy", url: "https://silverinfo.in/privacy-policy" },
  ]);

  // WebPage schema for privacy policy
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy - SilverInfo.in",
    description: "Learn how SilverInfo.in collects, uses, and protects your information.",
    url: "https://silverinfo.in/privacy-policy",
    isPartOf: {
      "@type": "WebSite",
      name: "SilverInfo.in",
      url: "https://silverinfo.in",
    },
    about: {
      "@type": "Thing",
      name: "Privacy Policy",
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
            <span>Privacy Policy</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: January 22, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="card p-8">
            <div className="prose prose-gray max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Welcome to SilverInfo.in. We are committed to protecting your
                personal information and your right to privacy. This Privacy Policy
                explains what information we collect, how we use it, and your rights
                regarding your information.
              </p>

              <h2>2. Information We Collect</h2>
              <h3>Automatically Collected Information</h3>
              <p>When you visit our website, we automatically collect:</p>
              <ul>
                <li>
                  Device information (browser type, operating system, device type)
                </li>
                <li>IP address and approximate location</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website or source</li>
              </ul>

              <h3>Information You Provide</h3>
              <p>
                If you contact us or subscribe to our newsletter, we may collect:
              </p>
              <ul>
                <li>Name and email address</li>
                <li>Any message content you send us</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul>
                <li>Provide and maintain our silver price tracking service</li>
                <li>Improve our website and user experience</li>
                <li>Analyze usage patterns and trends</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Send newsletters if you&apos;ve subscribed</li>
                <li>Display relevant advertisements</li>
              </ul>

              <h2>4. Cookies and Tracking</h2>
              <p>We use cookies and similar tracking technologies to:</p>
              <ul>
                <li>Remember your preferences</li>
                <li>Analyze website traffic (Google Analytics)</li>
                <li>Display advertisements (if applicable)</li>
              </ul>
              <p>
                You can control cookie settings through your browser. Disabling
                cookies may affect some website functionality.
              </p>

              <h2>5. Third-Party Services</h2>
              <p>We use the following third-party services that collect information:</p>
              <ul>
                <li>
                  <strong>Google Analytics</strong> - For website analytics and traffic analysis.
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f] ml-1">
                    Google Privacy Policy →
                  </a>
                </li>
                <li>
                  <strong>Google AdSense</strong> - For displaying personalized advertisements. 
                  Google uses cookies to serve ads based on your prior visits to this website 
                  and other sites. You can opt out of personalized advertising by visiting{" "}
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                    Google Ads Settings
                  </a>.
                </li>
                <li>
                  <strong>Third-Party Ad Networks</strong> - Some ads may be served by 
                  third-party vendors who use cookies. You can opt out of third-party 
                  vendor cookies by visiting{" "}
                  <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                    www.aboutads.info/choices
                  </a>.
                </li>
              </ul>
              <p>
                These third parties have their own privacy policies governing data
                collection. We encourage you to review their policies.
              </p>
              
              <h3>Opt-Out Options</h3>
              <p>You can opt out of personalized advertising through:</p>
              <ul>
                <li>
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                    Google Ads Settings
                  </a> - Manage Google ad personalization
                </li>
                <li>
                  <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                    DAA Opt-Out
                  </a> - Digital Advertising Alliance opt-out
                </li>
                <li>
                  <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-[#1e3a5f]">
                    NAI Opt-Out
                  </a> - Network Advertising Initiative opt-out
                </li>
              </ul>

              <h2>6. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your
                information. However, no internet transmission is 100% secure, and we
                cannot guarantee absolute security.
              </p>

              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h2>8. Children&apos;s Privacy</h2>
              <p>
                Our website is not intended for children under 13. We do not
                knowingly collect information from children under 13 years of age.
              </p>

              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. We will notify you of
                significant changes by posting the new policy on this page with an
                updated date.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <ul>
                <li>
                  Email:{" "}
                  <a href="mailto:privacy@silverinfo.in">privacy@silverinfo.in</a>
                </li>
                <li>
                  Contact Form:{" "}
                  <Link href="/contact" className="text-[#1e3a5f]">
                    silverinfo.in/contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
