import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize package imports to reduce bundle size
  experimental: {
    // Tree-shake recharts to reduce unused JavaScript
    optimizePackageImports: ["recharts", "date-fns"],
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "silverinfo.in",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Headers for security and caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + Google Analytics + AdSense + DoubleClick
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://news.google.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://www.google.com https://tpc.googlesyndication.com https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              // Connect: APIs + Analytics + AdSense
              "connect-src 'self' https://query1.finance.yahoo.com https://api.frankfurter.app https://www.google-analytics.com https://api.metalpriceapi.com https://www.goldapi.io https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
              // Frame-src: Allow AdSense ad iframes
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com https://pagead2.googlesyndication.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
      {
        source: "/(.*)\\.(ico|png|svg|jpg|jpeg|gif|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache Next.js static chunks (JS/CSS) - reduces Edge Requests on repeat visits
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Edge caching for SSR pages with stale-while-revalidate
      // Per Vercel docs: s-maxage for CDN cache, stale-while-revalidate for async updates
      {
        source: "/silver-price-usd",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/gold-and-silver-prices",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      {
        source: "/shanghai-silver-price",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      // Home page - slightly longer cache since it's high traffic
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
      // Gold page - high-volume keywords (Delhi, Chennai, Coimbatore, Punjab)
      {
        source: "/gold",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/price",
        destination: "/silver-rate-today",
        permanent: true,
      },
      {
        source: "/calculator",
        destination: "/silver-price-calculator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
