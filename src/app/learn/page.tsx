import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllLearnArticles, formatDate } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Learn About Silver - Guides & Education",
  description:
    "Comprehensive guides about silver - sterling silver, hallmarks, purity testing, investment comparisons, and more. Learn everything about buying and investing in silver in India.",
  keywords: [
    "silver guide",
    "sterling silver",
    "silver hallmark",
    "silver purity",
    "silver vs gold",
    "silver investment",
    "925 silver",
  ],
  alternates: {
    canonical: "/learn",
  },
};

export default function LearnPage() {
  const articles = getAllLearnArticles();

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://silverinfo.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn",
        item: "https://silverinfo.in/learn",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#1e3a5f]">
              Home
            </Link>
            <span>/</span>
            <span>Learn</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Silver Guides & Education
          </h1>
          <p className="text-gray-600">
            Comprehensive guides to help you understand silver - from purity and
            hallmarks to investment strategies. Everything you need to make
            informed decisions.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/learn/${article.slug}`}
                  className="card overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  {article.image ? (
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-blue-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(article.date)}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-[#1e3a5f] transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {article.description}
                    </p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Guides Yet
              </h2>
              <p className="text-gray-600 mb-6">
                We&apos;re working on creating comprehensive silver guides.
                Check back soon!
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2c5282] transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-[#1e3a5f]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Check Silver Prices?
          </h2>
          <p className="text-gray-300 mb-6">
            Use our live price tracker and calculator to make informed decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/silver-rate-today"
              className="px-6 py-3 bg-white text-[#1e3a5f] rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              View Live Prices
            </Link>
            <Link
              href="/silver-price-calculator"
              className="px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Open Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
