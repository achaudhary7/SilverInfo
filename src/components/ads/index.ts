/**
 * Ad Components - Google AdSense Integration
 * 
 * Reusable ad components for SilverInfo.in
 * 
 * ============================================================================
 * SETUP INSTRUCTIONS
 * ============================================================================
 * 
 * 1. Add your AdSense credentials to .env.local:
 * 
 *    ```env
 *    # Google AdSense Publisher ID (from AdSense dashboard)
 *    NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
 *    
 *    # Individual Ad Slot IDs (create in AdSense dashboard)
 *    NEXT_PUBLIC_AD_SLOT_HEADER=1234567890
 *    NEXT_PUBLIC_AD_SLOT_FOOTER=2345678901
 *    NEXT_PUBLIC_AD_SLOT_INCONTENT=3456789012
 *    NEXT_PUBLIC_AD_SLOT_SIDEBAR=4567890123
 *    NEXT_PUBLIC_AD_SLOT_MOBILE=5678901234
 *    ```
 * 
 * 2. Add AdSenseScript to layout.tsx:
 * 
 *    ```tsx
 *    import { AdSenseScript } from "@/components/ads";
 *    
 *    export default function RootLayout({ children }) {
 *      return (
 *        <html>
 *          <body>
 *            {children}
 *            <AdSenseScript />
 *          </body>
 *        </html>
 *      );
 *    }
 *    ```
 * 
 * 3. Use AdBanner or AdSlot in pages:
 * 
 *    ```tsx
 *    import { AdBanner, AdSlot } from "@/components/ads";
 *    
 *    export default function Page() {
 *      return (
 *        <div>
 *          <AdBanner.Header />
 *          <main>
 *            <h1>Content</h1>
 *            <AdBanner.InContent />
 *            <p>More content...</p>
 *          </main>
 *          <AdBanner.Footer />
 *        </div>
 *      );
 *    }
 *    ```
 * 
 * ============================================================================
 * BEST PLACEMENTS FOR SILVERINFO.IN
 * ============================================================================
 * 
 * | Page              | Recommended Placements           |
 * |-------------------|----------------------------------|
 * | Home              | Header, after price card, footer |
 * | Silver Rate       | Header, between sections, footer |
 * | City Pages        | Sidebar, in-content              |
 * | Calculators       | After calculator, sidebar        |
 * | Learn Articles    | In-article, multiplex at end     |
 * | Updates           | In-content, multiplex            |
 * 
 * ============================================================================
 * DEVELOPMENT MODE
 * ============================================================================
 * 
 * In development (NODE_ENV !== "production"), ads show as placeholders.
 * This allows you to:
 * - See ad positions without real ads
 * - Test layouts without AdSense errors
 * - Develop faster without ad loading delays
 * 
 * To force test mode even in production:
 *    <AdBanner.Header testMode={true} />
 */

// Script loader (use in layout.tsx)
export { AdSenseScript } from "./AdSenseScript";

// Base ad slot component
export { AdSlot } from "./AdSlot";
export type { AdSlotProps, AdFormat, AdLayoutKey } from "./AdSlot";

// Pre-configured banner components
export { AdBanner } from "./AdBanner";
