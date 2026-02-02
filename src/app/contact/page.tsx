import type { Metadata } from "next";
import Link from "next/link";
import { generateBreadcrumbSchema } from "@/lib/schema";
import ContactForm from "@/components/ContactForm";

// Revalidate daily
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Contact Us - SilverInfo.in",
  description:
    "Get in touch with SilverInfo.in for questions about silver prices, feedback, or partnership inquiries. We're here to help.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Contact", url: "https://silverinfo.in/contact" },
  ]);

  // ContactPage schema for rich results
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact SilverInfo.in",
    description: "Get in touch with SilverInfo.in for questions about silver prices, feedback, or partnership inquiries.",
    url: "https://silverinfo.in/contact",
    mainEntity: {
      "@type": "Organization",
      name: "SilverInfo.in",
      url: "https://silverinfo.in",
      logo: "https://silverinfo.in/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        url: "https://silverinfo.in/contact",
        availableLanguage: ["English", "Hindi"],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
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
            <span>Contact</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="text-gray-600 mt-2">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Contact
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#1e3a5f]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">contact@silverinfo.in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-[#1e3a5f]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Response Time</p>
                      <p className="text-gray-600">Within 24-48 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  FAQs
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">
                      How accurate are your prices?
                    </p>
                    <p className="text-gray-600">
                      Our indicative prices are calculated from COMEX and auto-refresh every 30 seconds from international
                      market feeds.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Do you sell silver?
                    </p>
                    <p className="text-gray-600">
                      No, we are an information platform. We don&apos;t sell silver
                      directly.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Can I advertise on your site?
                    </p>
                    <p className="text-gray-600">
                      Yes! Contact us for advertising and partnership
                      opportunities.
                    </p>
                  </div>
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
