/**
 * Google News Sitemap
 * 
 * Generates a news-specific sitemap for Google News discovery.
 * News sitemaps help Google discover and index news content faster.
 * 
 * Format: https://support.google.com/news/publisher-center/answer/9606710
 */

import { getAllUpdates } from "@/lib/markdown";

export async function GET() {
  const baseUrl = "https://silverinfo.in";
  const updates = getAllUpdates();
  const today = new Date();
  
  // Google News only indexes articles from the last 2 days
  // But we include articles from the last 30 days for better coverage
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentUpdates = updates.filter((update) => {
    const updateDate = new Date(update.date);
    return updateDate >= thirtyDaysAgo;
  });

  // Add the daily market analysis page (updated every 5 minutes)
  const marketAnalysisItem = `
    <url>
      <loc>${baseUrl}/silver-market-today</loc>
      <news:news>
        <news:publication>
          <news:name>SilverInfo.in</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${today.toISOString()}</news:publication_date>
        <news:title>Silver Market Analysis - ${today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</news:title>
        <news:keywords>silver market today, silver price analysis, silver rate india, COMEX silver</news:keywords>
      </news:news>
      <image:image>
        <image:loc>${baseUrl}/og-image.png</image:loc>
        <image:title>Silver Market Analysis Today</image:title>
      </image:image>
    </url>`;
  
  // Add gold price page (hourly updates)
  const goldPriceItem = `
    <url>
      <loc>${baseUrl}/gold</loc>
      <news:news>
        <news:publication>
          <news:name>SilverInfo.in</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${today.toISOString()}</news:publication_date>
        <news:title>Gold Rate Today India - Live 24K 22K Prices ${today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</news:title>
        <news:keywords>gold rate today, gold price india, 22k gold rate, 24k gold price, live gold rate</news:keywords>
      </news:news>
      <image:image>
        <image:loc>${baseUrl}/images/gold/og-gold.png</image:loc>
        <image:title>Gold Rate Today India</image:title>
      </image:image>
    </url>`;
  
  const newsItems = recentUpdates.map((update) => {
    const pubDate = new Date(update.date);
    
    return `
    <url>
      <loc>${baseUrl}/updates/${update.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>SilverInfo.in</news:name>
          <news:language>en</news:language>
        </news:publication>
        <news:publication_date>${pubDate.toISOString()}</news:publication_date>
        <news:title>${escapeXml(update.title)}</news:title>
        <news:keywords>${update.tags?.slice(0, 10).map(escapeXml).join(", ") || "silver, silver price, india"}</news:keywords>
      </news:news>
      <image:image>
        <image:loc>${update.image ? `${baseUrl}${update.image}` : `${baseUrl}/og-image.png`}</image:loc>
        <image:title>${escapeXml(update.title)}</image:title>
      </image:image>
    </url>`;
  });
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${marketAnalysisItem}
${goldPriceItem}
${newsItems.join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
