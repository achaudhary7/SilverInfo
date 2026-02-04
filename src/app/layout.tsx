import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

// Explicit viewport configuration for SEO best practices
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1e3a5f",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Improves LCP by showing fallback font immediately
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Silver Rate Today in India | Live Silver Price per Gram - SilverInfo.in",
    template: "%s | SilverInfo.in",
  },
  description:
    "Check live silver rate today in India. Get real-time silver price per gram, per kg, and per 10 grams. Track historical silver prices, use our calculator, and read daily market updates.",
  keywords: [
    "silver rate today",
    "silver price in india",
    "silver price per gram",
    "today silver rate",
    "silver rate today in mumbai",
    "silver rate today in delhi",
    "925 silver price",
    "silver hallmark",
    "silver price calculator",
  ],
  authors: [{ name: "SilverInfo.in" }],
  creator: "SilverInfo.in",
  publisher: "SilverInfo.in",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://silverinfo.in"),
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "en": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Silver Rate Today in India | Live Silver Price - SilverInfo.in",
    description:
      "Check live silver rate today in India. Real-time silver price per gram, historical charts, and daily market updates.",
    url: "https://silverinfo.in",
    siteName: "SilverInfo.in",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SilverInfo.in - Live Silver Prices in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silver Rate Today in India | Live Silver Price - SilverInfo.in",
    description:
      "Check live silver rate today in India. Real-time silver price per gram and daily market updates.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Icons configuration for favicon (Next.js 14+ metadata API)
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon.ico" },
    ],
  },
  // Google Search Console verification - Set NEXT_PUBLIC_GOOGLE_VERIFICATION in .env.local
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Google Analytics 4 Measurement ID
  const GA_MEASUREMENT_ID = "G-2VW3FJ9LRX";

  // Organization and Website Schema for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SilverInfo.in",
    url: "https://silverinfo.in",
    logo: "https://silverinfo.in/icon-512.png",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SilverInfo.in",
    url: "https://silverinfo.in",
    description: "India's trusted source for live silver prices, calculator, and market updates.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://silverinfo.in/city/{search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en-IN">
      <head>
        {/* Structured Data - Organization & Website */}
        {/* suppressHydrationWarning: Google SWG script may modify these schemas client-side */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Favicon & PWA - Multiple formats for maximum compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        {/* theme-color is now set via viewport export above */}

        {/* Preconnect for performance - establishes full connection early */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preconnect to external APIs for faster data fetching */}
        <link rel="preconnect" href="https://query1.finance.yahoo.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.frankfurter.app" crossOrigin="anonymous" />
        
        {/* DNS Prefetch as fallback for browsers that don't support preconnect */}
        <link rel="dns-prefetch" href="https://query1.finance.yahoo.com" />
        <link rel="dns-prefetch" href="https://api.frankfurter.app" />
        
        {/* Preconnect for Google AdSense - faster ad loading */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
        
        {/* Google Analytics 4 (gtag.js) - Deferred loading to reduce Edge Requests */}
        {/* Using afterInteractive strategy equivalent via defer */}
        <script
          defer
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          id="ga-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { 
                send_page_view: true,
                cookie_flags: 'SameSite=None;Secure'
              });
            `,
          }}
        />
        
        {/* Google Reader Revenue Manager - Subscribe with Google Basic */}
        {/* Deferred to not block initial page load */}
        <script
          defer
          src="https://news.google.com/swg/js/v1/swg-basic.js"
        />
        <script
          id="swg-init"
          dangerouslySetInnerHTML={{
            __html: `
              (self.SWG_BASIC = self.SWG_BASIC || []).push(function(basicSubscriptions) {
                basicSubscriptions.init({
                  type: "NewsArticle",
                  isPartOfType: ["Product"],
                  isPartOfProductId: "CAowwo_EDA:openaccess",
                  clientOptions: { theme: "light", lang: "en" },
                });
              });
            `,
          }}
        />
        
        {/* Google AdSense - Auto Ads */}
        {/* Place on every page for automatic ad placement */}
        {/* Ref: https://support.google.com/adsense/answer/9274516 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7457883797698050"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#1e3a5f] focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-grow pb-16 md:pb-0" role="main">{children}</main>
        <Footer />
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
