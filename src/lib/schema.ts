/**
 * JSON-LD Schema Generators for SEO
 * 
 * Server-safe schema generation functions for structured data.
 */

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generate FAQ Page schema
 */
export function generateFAQSchema(items: FAQItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Generate Article schema
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  date: string;
  url: string;
  image?: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.date,
    dateModified: article.date,
    publisher: {
      "@type": "Organization",
      name: "SilverInfo.in",
      logo: {
        "@type": "ImageObject",
        url: "https://silverinfo.in/icon-512.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    image: article.image || "https://silverinfo.in/og-image.png",
  };
}

/**
 * Generate Product schema for silver prices
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  currency: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      priceValidUntil: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      availability: "https://schema.org/InStock",
    },
  };
}

/**
 * Generate LocalBusiness schema for city pages
 */
export function generateLocalBusinessSchema(business: {
  name: string;
  description: string;
  city: string;
  state: string;
  priceRange: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.city,
      addressRegion: business.state,
      addressCountry: "IN",
    },
    priceRange: business.priceRange,
  };
}

/**
 * Generate WebApplication schema
 */
export function generateWebAppSchema(app: {
  name: string;
  url: string;
  description: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: app.name,
    url: app.url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description: app.description,
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
