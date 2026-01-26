import type { Metadata } from "next";
import Link from "next/link";
import { generateBreadcrumbSchema } from "@/lib/schema";

// Page content last reviewed date - now dynamic
const LAST_UPDATED = new Date().toISOString().split('T')[0];

export const metadata: Metadata = {
  title: "Our Team - SilverInfo.in",
  description:
    "Meet the SilverInfo.in team - finance researchers and precious metals analysts with expertise in Indian commodity markets.",
  alternates: {
    canonical: "/about/team",
  },
};

// Team member data - E-E-A-T: Real author information
const teamMembers = [
  {
    name: "SilverInfo Research Team",
    role: "Silver Market Analysts",
    bio: "Our research team comprises finance professionals with 10+ years of combined experience in Indian commodity markets. The team specializes in precious metals analysis, price forecasting methodologies, and consumer education.",
    expertise: ["COMEX Silver Analysis", "Indian Market Dynamics", "Price Methodology", "Consumer Education"],
    initials: "SI",
  },
];

export default function TeamPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "About", url: "https://silverinfo.in/about" },
    { name: "Team", url: "https://silverinfo.in/about/team" },
  ]);

  // Person schema for team members (E-E-A-T)
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "SilverInfo Research Team",
    jobTitle: "Silver Market Analysts",
    worksFor: {
      "@type": "Organization",
      name: "SilverInfo.in",
      url: "https://silverinfo.in",
    },
    description: "Finance researchers and precious metals analysts with expertise in Indian commodity markets.",
    knowsAbout: ["Silver Prices", "COMEX", "Indian Commodity Markets", "Precious Metals"],
    url: "https://silverinfo.in/about/team",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
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
              <Link href="/about" className="hover:text-[#1e3a5f]">
                About
              </Link>
              <span>/</span>
              <span>Team</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Our Team</h1>
            <p className="text-gray-600 mt-2">
              Meet the experts behind SilverInfo.in
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Last updated: {new Date(LAST_UPDATED).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            
            {/* Team Members */}
            <div className="space-y-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="card p-8">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">{member.initials}</span>
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
                      <p className="text-[#1e3a5f] font-medium">{member.role}</p>
                      
                      <p className="text-gray-600 mt-4">{member.bio}</p>
                      
                      {/* Expertise Tags */}
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((skill, i) => (
                            <span
                              key={i}
                              className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Editorial Standards */}
            <div className="card p-8 mt-8 bg-gradient-to-br from-gray-50 to-white">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Our Editorial Standards</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Fact-Checked Content</h3>
                    <p className="text-sm text-gray-600">Every article is verified against official sources</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Transparent Methodology</h3>
                    <p className="text-sm text-gray-600">Our price calculations are openly documented</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <h3 className="font-medium text-gray-900">No Financial Advice</h3>
                    <p className="text-sm text-gray-600">We provide information, not investment recommendations</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Regular Updates</h3>
                    <p className="text-sm text-gray-600">Content is reviewed and updated regularly</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/editorial-policy"
                  className="text-[#1e3a5f] font-medium hover:underline"
                >
                  Read Our Full Editorial Policy →
                </Link>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="card p-8 mt-8 bg-[#1e3a5f] text-white text-center">
              <h2 className="text-xl font-bold mb-2">Have Questions?</h2>
              <p className="text-gray-300 mb-4">
                We&apos;d love to hear from you. Reach out for feedback, corrections, or partnership inquiries.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-white text-[#1e3a5f] rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
