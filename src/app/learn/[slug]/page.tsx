import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLearnArticleBySlug,
  getAllLearnSlugs,
  formatDate,
  getReadingTime,
  getAllLearnArticles,
} from "@/lib/markdown";
import { LivePriceWidget } from "@/components/price";
import AuthorBio, { ReviewedByBadge } from "@/components/AuthorBio";

export async function generateStaticParams() {
  const slugs = getAllLearnSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getLearnArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    alternates: {
      canonical: `/learn/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getLearnArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = getAllLearnArticles().filter((a) => a.slug !== slug);
  const readingTime = getReadingTime(article.content);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image ? `https://silverinfo.in${article.image}` : "https://silverinfo.in/og-image.png",
    author: {
      "@type": "Person",
      name: article.author,
      url: "https://silverinfo.in/about",
    },
    datePublished: article.date,
    dateModified: article.date, // Content is current as of publish date
    publisher: {
      "@type": "Organization",
      name: "SilverInfo.in",
      logo: {
        "@type": "ImageObject",
        url: "https://silverinfo.in/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://silverinfo.in/learn/${slug}`,
    },
    keywords: article.tags?.join(", "),
  };

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
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://silverinfo.in/learn/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Main Layout with Sidebar starting from top */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Column - Header + Content */}
            <div className="lg:col-span-3 min-w-0">
              {/* Header Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 overflow-hidden min-w-0">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex-wrap">
                  <Link href="/" className="hover:text-[#1e3a5f]">
                    Home
                  </Link>
                  <span>/</span>
                  <Link href="/learn" className="hover:text-[#1e3a5f]">
                    Learn
                  </Link>
                  <span>/</span>
                  <span className="truncate">{article.title}</span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-4 flex-wrap">
                  <span>{formatDate(article.date)}</span>
                  <span>•</span>
                  <span>{readingTime} min read</span>
                  <span>•</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs sm:text-sm">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 break-words">
                  {article.title}
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-600 mb-4">{article.description}</p>
                
                {/* Author Bio with E-E-A-T Signals */}
                <div className="pt-4 border-t border-gray-100">
                  <AuthorBio 
                    author={article.author} 
                    date={article.date} 
                    readingTime={`${readingTime} min read`}
                  />
                </div>
              </div>

              {/* Article Content */}
              <article className="card p-4 sm:p-6 lg:p-8 overflow-hidden min-w-0">
                <div className="article-content min-w-0">
                  <div
                    className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-[#1e3a5f] min-w-0"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Bio - E-E-A-T Signal */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg sm:text-2xl font-bold">SI</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {article.author || "SilverInfo Team"}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        The SilverInfo Team comprises finance researchers and precious metals 
                        analysts with expertise in Indian commodity markets. Our content is 
                        reviewed for accuracy and updated regularly to reflect current market conditions.
                      </p>
                      <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm">
                        <Link 
                          href="/about" 
                          className="text-[#1e3a5f] hover:underline"
                        >
                          About Us
                        </Link>
                        <Link 
                          href="/how-we-calculate" 
                          className="text-[#1e3a5f] hover:underline"
                        >
                          Our Methodology
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Right Column - Sidebar (starts from top) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Live Price Widget */}
              <LivePriceWidget variant="detailed" />

              {/* More Guides */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  More Guides
                </h3>
                <div className="space-y-4">
                  {allArticles.slice(0, 5).map((a) => (
                    <Link
                      key={a.slug}
                      href={`/learn/${a.slug}`}
                      className="block group"
                    >
                      <p className="text-sm font-medium text-gray-900 group-hover:text-[#1e3a5f] line-clamp-2">
                        {a.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Calculator CTA */}
              <div className="card p-6 bg-[#1e3a5f] text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Calculate Silver Price
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Use our calculator to find exact silver costs
                </p>
                <Link
                  href="/silver-price-calculator"
                  className="block w-full text-center py-2 bg-white text-[#1e3a5f] rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Open Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
