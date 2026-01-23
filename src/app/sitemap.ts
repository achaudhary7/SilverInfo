import { MetadataRoute } from "next";
import { INDIAN_CITIES } from "@/lib/metalApi";
import { getAllUpdateSlugs, getAllLearnSlugs, getAllUpdates, getAllLearnArticles } from "@/lib/markdown";

// Page last modified dates - update these when making significant content changes
const PAGE_DATES: Record<string, string> = {
  "/": "2026-01-23",
  "/silver-rate-today": "2026-01-23",
  "/qatar/silver-rate-today": "2026-01-24",
  "/silver-price-calculator": "2026-01-23",
  "/investment-calculator": "2026-01-23",
  "/capital-gains-tax-calculator": "2026-01-23",
  "/inflation-adjusted-calculator": "2026-01-23",
  "/break-even-calculator": "2026-01-23",
  "/learn": "2026-01-23",
  "/updates": "2026-01-23",
  "/about": "2026-01-23",
  "/contact": "2026-01-20",
  "/privacy-policy": "2026-01-15",
  "/terms": "2026-01-15",
  "/disclaimer": "2026-01-15",
  "/how-we-calculate": "2026-01-20",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://silverinfo.in";
  const currentDate = new Date().toISOString();

  // Static pages with specific last modified dates
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: PAGE_DATES["/"] || currentDate,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${baseUrl}/silver-rate-today`,
      lastModified: PAGE_DATES["/silver-rate-today"] || currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/qatar/silver-rate-today`,
      lastModified: PAGE_DATES["/qatar/silver-rate-today"] || currentDate,
      changeFrequency: "hourly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/silver-price-calculator`,
      lastModified: PAGE_DATES["/silver-price-calculator"] || currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/investment-calculator`,
      lastModified: PAGE_DATES["/investment-calculator"] || currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/capital-gains-tax-calculator`,
      lastModified: PAGE_DATES["/capital-gains-tax-calculator"] || currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/inflation-adjusted-calculator`,
      lastModified: PAGE_DATES["/inflation-adjusted-calculator"] || currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/break-even-calculator`,
      lastModified: PAGE_DATES["/break-even-calculator"] || currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: PAGE_DATES["/learn"] || currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/updates`,
      lastModified: PAGE_DATES["/updates"] || currentDate,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: PAGE_DATES["/about"] || currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: PAGE_DATES["/contact"] || currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: PAGE_DATES["/privacy-policy"] || currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: PAGE_DATES["/terms"] || currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: PAGE_DATES["/disclaimer"] || currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/how-we-calculate`,
      lastModified: PAGE_DATES["/how-we-calculate"] || currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // City pages - prices update hourly
  const cityPages: MetadataRoute.Sitemap = INDIAN_CITIES.map((city) => ({
    url: `${baseUrl}/city/${city.city.toLowerCase()}`,
    lastModified: currentDate, // Cities have live prices, always current
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  // Blog/Update pages - use actual article dates
  const allUpdates = getAllUpdates();
  const updatePages: MetadataRoute.Sitemap = allUpdates.map((update) => ({
    url: `${baseUrl}/updates/${update.slug}`,
    lastModified: update.date, // Use actual article date
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Learn/Education pages - use actual article dates
  const allLearnArticles = getAllLearnArticles();
  const learnPages: MetadataRoute.Sitemap = allLearnArticles.map((article) => ({
    url: `${baseUrl}/learn/${article.slug}`,
    lastModified: article.date, // Use actual article date
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...cityPages, ...updatePages, ...learnPages];
}
