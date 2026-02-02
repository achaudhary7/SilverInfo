/**
 * Google AdSense Script Loader
 * 
 * Loads the AdSense script globally in the application.
 * Should be placed in the root layout.tsx file.
 * 
 * Features:
 * - Only loads in production environment
 * - Uses Next.js Script component for optimal loading
 * - Lazy loads after page becomes interactive
 * 
 * Usage in layout.tsx:
 * ```tsx
 * import { AdSenseScript } from "@/components/ads";
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <AdSenseScript />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

import Script from "next/script";

// ============================================================================
// CONFIGURATION
// ============================================================================

// Your AdSense Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
// Set this in .env.local as NEXT_PUBLIC_ADSENSE_ID
// Or use the hardcoded value below if approved
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-7457883797698050";

// Only show ads in production
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ============================================================================
// COMPONENT
// ============================================================================

export function AdSenseScript() {
  // Don't load in development or if no AdSense ID
  if (!IS_PRODUCTION || !ADSENSE_ID) {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
      crossOrigin="anonymous"
      strategy="lazyOnload" // Load after page is interactive
    />
  );
}

export default AdSenseScript;
