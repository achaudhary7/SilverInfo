/**
 * Ad Components - Google AdSense Integration
 * 
 * Reusable ad components for SilverInfo.in
 * Publisher ID: ca-pub-7457883797698050
 * 
 * ============================================================================
 * AD SLOT IDS (Configured in AdBanner.tsx)
 * ============================================================================
 * 
 * | Slot Name       | Slot ID      | Format      | Best Placement         |
 * |-----------------|--------------|-------------|------------------------|
 * | Horizontal      | 7333542685   | Auto        | Header, In-Content     |
 * | Footer          | 7551626964   | Auto        | Before footer          |
 * | Vertical        | 7368630887   | Auto        | Tall sidebars          |
 * | Square          | 4798878684   | Auto        | Sidebar, Multiplex     |
 * | In-Article      | 9115990072   | Fluid       | Within articles        |
 * | In-Article 2    | 1406428581   | Fluid       | Second article ad      |
 * 
 * ============================================================================
 * AVAILABLE COMPONENTS
 * ============================================================================
 * 
 * | Component            | Description                        |
 * |----------------------|------------------------------------|
 * | AdBanner.Header      | Horizontal ad after navigation     |
 * | AdBanner.Footer      | Horizontal ad before footer        |
 * | AdBanner.InContent   | Responsive ad between sections     |
 * | AdBanner.Sidebar     | Square ad for desktop sidebars     |
 * | AdBanner.Article     | In-article native ad               |
 * | AdBanner.Article2    | Second in-article placement        |
 * | AdBanner.Multiplex   | Related content style grid         |
 * | AdBanner.Vertical    | Tall skyscraper for sidebars       |
 * | AdBanner.MobileAnchor| Sticky bottom on mobile            |
 * 
 * ============================================================================
 * USAGE
 * ============================================================================
 * 
 * ```tsx
 * import { AdBanner } from "@/components/ads";
 * 
 * export default function Page() {
 *   return (
 *     <div>
 *       <AdBanner.Header />
 *       <main>
 *         <h1>Content</h1>
 *         <AdBanner.InContent />
 *         <article>
 *           <p>Article content...</p>
 *           <AdBanner.Article />
 *           <p>More content...</p>
 *         </article>
 *       </main>
 *       <AdBanner.Footer />
 *     </div>
 *   );
 * }
 * ```
 * 
 * ============================================================================
 * CURRENT PLACEMENTS
 * ============================================================================
 * 
 * | Page              | Placements                              |
 * |-------------------|-----------------------------------------|
 * | Home (/)          | Header, InContent x2, Sidebar, Footer   |
 * | Silver Rate       | Header, Sidebar, InContent, Footer      |
 * | Updates/[slug]    | Article, Sidebar, Multiplex, Footer     |
 * | Learn/[slug]      | Article, Sidebar, Footer                |
 * 
 * ============================================================================
 * DEVELOPMENT MODE
 * ============================================================================
 * 
 * On localhost, ads show as placeholders (gray dashed boxes).
 * In production (silverinfo.in), real AdSense ads load.
 * 
 * To force test mode in production:
 *    <AdBanner.Header testMode={true} />
 */

// Script loader (use in layout.tsx)
export { AdSenseScript } from "./AdSenseScript";

// Base ad slot component
export { AdSlot } from "./AdSlot";
export type { AdSlotProps, AdFormat, AdLayoutKey } from "./AdSlot";

// Pre-configured banner components
export { AdBanner } from "./AdBanner";
