import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllUpdates, formatDate } from "@/lib/markdown";
import { generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Silver Market Updates - Daily Price News & Analysis",
  description:
    "Stay updated with daily silver price news, market analysis, and expert insights. Get the latest silver market updates from India and international markets.",
  keywords: [
    "silver price news",
    "silver market updates",
    "silver price today news",
    "silver market analysis",
    "silver investment news",
  ],
  alternates: {
    canonical: "/updates",
  },
};

export default function UpdatesPage() {
  const updates = getAllUpdates();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Updates", url: "https://silverinfo.in/updates" },
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#1e3a5f]">
              Home
            </Link>
            <span>/</span>
            <span>Updates</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Silver Market Updates
          </h1>
          <p className="text-gray-600">
            Daily price updates, market analysis, and silver news from India
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {updates.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {updates.map((post) => (
                <Link
                  key={post.slug}
                  href={`/updates/${post.slug}`}
                  className="card overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  {post.image ? (
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    {/* Meta */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>{formatDate(post.date)}</span>
                      <span>•</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-[#1e3a5f] line-clamp-2 mb-2">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Updates Yet
              </h2>
              <p className="text-gray-600 mb-6">
                We&apos;re working on bringing you the latest silver market
                updates. Check back soon!
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
    </div>
    </>
  );
}
