import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getUpdateBySlug,
  getAllUpdateSlugs,
  formatDate,
  getReadingTime,
  getRecentUpdates,
} from "@/lib/markdown";
import { LivePriceWidget } from "@/components/price";
import AuthorBio from "@/components/AuthorBio";
import { AdArticle, AdSidebar, AdMultiplex, AdFooter } from "@/components/ads";

// ISR: Revalidate articles every hour (content rarely changes after publish)
export const revalidate = 28800; // ISR: Revalidate every 8 hours (content doesn't change frequently)

// Generate static paths for all posts
export async function generateStaticParams() {
  const slugs = getAllUpdateSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getUpdateBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: {
      canonical: `/updates/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: post.image ? [post.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function UpdatePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getUpdateBySlug(slug);

  if (!post) {
    notFound();
  }

  const recentPosts = getRecentUpdates(5).filter((p) => p.slug !== slug);
  const readingTime = getReadingTime(post.content);

  // NewsArticle Schema - Optimized for Google Discover & News 2026
  // Using NewsArticle type for timely updates (better for News/Discover)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.description,
    image: {
      "@type": "ImageObject",
      url: post.image ? `https://silverinfo.in${post.image}` : "https://silverinfo.in/og-image.png",
      width: 1200,
      height: 630,
    },
    author: {
      "@type": "Person",
      name: post.author,
      url: "https://silverinfo.in/about/team",
      jobTitle: "Silver Market Analyst",
      worksFor: {
        "@type": "Organization",
        name: "SilverInfo.in",
      },
    },
    datePublished: post.date,
    dateModified: post.lastModified || post.date,
    publisher: {
      "@type": "Organization",
      name: "SilverInfo.in",
      url: "https://silverinfo.in",
      logo: {
        "@type": "ImageObject",
        url: "https://silverinfo.in/icon-192.png",
        width: 192,
        height: 192,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://silverinfo.in/updates/${slug}`,
    },
    articleSection: post.category,
    keywords: post.tags?.join(", "),
    isAccessibleForFree: true,
    copyrightHolder: {
      "@type": "Organization",
      name: "SilverInfo.in",
    },
  };

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
        name: "Updates",
        item: "https://silverinfo.in/updates",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://silverinfo.in/updates/${slug}`,
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
                  <Link href="/updates" className="hover:text-[#1e3a5f]">
                    Updates
                  </Link>
                  <span>/</span>
                  <span className="truncate">{post.title}</span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-4 flex-wrap">
                  <span>{formatDate(post.date)}</span>
                  <span>•</span>
                  <span>{readingTime} min read</span>
                  <span>•</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs sm:text-sm">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 break-words">
                  {post.title}
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-600 mb-4">{post.description}</p>

                {/* Author Bio with E-E-A-T Signals */}
                <div className="pt-4 border-t border-gray-100">
                  <AuthorBio 
                    author={post.author} 
                    date={post.date} 
                    readingTime={`${readingTime} min read`}
                  />
                </div>
              </div>

              {/* Article Content */}
              <article className="card p-4 sm:p-6 lg:p-8 overflow-hidden min-w-0">
                {/* Featured Image */}
                {post.image && (
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-6 sm:mb-8 relative">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
                      priority
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="article-content min-w-0">
                  <div
                    className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-[#1e3a5f] prose-a:no-underline hover:prose-a:underline min-w-0"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>

                {/* Ad: In-Article (after content, before tags) */}
                <AdArticle />
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
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
                        {post.author || "SilverInfo Team"}
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

              {/* Share Section */}
              <div className="card p-4 sm:p-6 mt-4 sm:mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3 sm:mb-4">
                  Share this article
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      post.title
                    )}&url=${encodeURIComponent(
                      `https://silverinfo.in/updates/${slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors text-xs sm:text-sm"
                  >
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Share on X
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `${post.title} - https://silverinfo.in/updates/${slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-colors text-xs sm:text-sm"
                  >
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar (starts from top) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Live Price Widget */}
              <LivePriceWidget variant="detailed" />

              {/* Recent Posts */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Updates
                </h3>
                <div className="space-y-4">
                  {recentPosts.slice(0, 4).map((recentPost) => (
                    <Link
                      key={recentPost.slug}
                      href={`/updates/${recentPost.slug}`}
                      className="block group"
                    >
                      <p className="text-xs text-gray-400 mb-1">
                        {formatDate(recentPost.date)}
                      </p>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-[#1e3a5f] line-clamp-2">
                        {recentPost.title}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/updates"
                  className="block text-sm font-medium text-[#1e3a5f] mt-4 hover:underline"
                >
                  View All Updates →
                </Link>
              </div>
              
              {/* Ad: Sidebar */}
              <AdSidebar />
            </div>
          </div>
          
          {/* Ad: Multiplex (Related Content Style) */}
          <div className="mt-8">
            <AdMultiplex />
          </div>
        </div>
        
        {/* Ad: Footer */}
        <AdFooter />
      </div>
    </>
  );
}
