/**
 * Image Sitemap for Google Discover & Images
 * 
 * Per Google guidelines: "You can provide the URL of images we might 
 * not have otherwise discovered by submitting an image sitemap."
 * 
 * This helps with:
 * - Google Discover eligibility (1200px+ images)
 * - Google Images indexing
 * - Rich result thumbnails
 */

import { getAllUpdates, getAllLearnArticles } from "@/lib/markdown";

// ISR: Revalidate every hour (images don't change frequently)
export const revalidate = 28800; // ISR: Revalidate every 8 hours

export async function GET() {
  const baseUrl = "https://silverinfo.in";
  
  // Static images
  const staticImages = [
    {
      loc: `${baseUrl}/`,
      images: [
        { url: `${baseUrl}/og-image.png`, title: "SilverInfo.in - Live Silver Prices India", caption: "Real-time silver rates in India" }
      ]
    },
    {
      loc: `${baseUrl}/gold`,
      images: [
        { url: `${baseUrl}/og-image.png`, title: "Gold Price Today India", caption: "Live gold rates in India" }
      ]
    },
    {
      loc: `${baseUrl}/shanghai-silver-price`,
      images: [
        { url: `${baseUrl}/og-image.png`, title: "Shanghai Silver Price Today", caption: "Live SGE silver rates" }
      ]
    }
  ];
  
  // Update/article images
  const updates = getAllUpdates();
  const updateImages = updates.map(update => ({
    loc: `${baseUrl}/updates/${update.slug}`,
    images: update.image ? [
      { 
        url: `${baseUrl}${update.image}`, 
        title: update.title,
        caption: update.description || update.title 
      }
    ] : []
  })).filter(item => item.images.length > 0);
  
  // Learn article images
  const learnArticles = getAllLearnArticles();
  const learnImages = learnArticles.map(article => ({
    loc: `${baseUrl}/learn/${article.slug}`,
    images: article.image ? [
      { 
        url: `${baseUrl}${article.image}`, 
        title: article.title,
        caption: article.description || article.title 
      }
    ] : []
  })).filter(item => item.images.length > 0);
  
  // Combine all
  const allPages = [...staticImages, ...updateImages, ...learnImages];
  
  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${page.loc}</loc>
${page.images.map(img => `    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
    </image:image>`).join('\n')}
  </url>`).join('\n')}
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
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
