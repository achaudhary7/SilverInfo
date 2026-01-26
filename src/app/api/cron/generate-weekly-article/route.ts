/**
 * Cron Job: Generate Weekly Article
 *
 * This endpoint should be called every Sunday at 11 PM IST (5:30 PM UTC)
 * to generate a weekly silver price analysis article.
 *
 * The article includes:
 * - Week's opening and closing prices
 * - Weekly high and low
 * - Percentage change
 * - City-wise price summary
 * - Market analysis
 *
 * Usage:
 * - GET /api/cron/generate-weekly-article - Generate this week's article
 * - POST /api/cron/generate-weekly-article - Same as GET
 */

import { NextRequest, NextResponse } from "next/server";
import { getSilverPrice, getCityPrices, type SilverPrice, type CityPrice } from "@/lib/metalApi";
import { readDailyPrices, type StoredDailyPrice } from "@/lib/priceStorage";

// Force dynamic - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface WeeklyData {
  weekStart: string;
  weekEnd: string;
  weekStartFormatted: string;
  weekEndFormatted: string;
  openingPrice: number;
  closingPrice: number;
  weekHigh: number;
  weekLow: number;
  weekChange: number;
  weekChangePercent: number;
  avgPrice: number;
  dailyPrices: { date: string; price: number }[];
  cities: CityPrice[];
  currentPrice: SilverPrice;
}

/**
 * Get the week's date range (Monday to Sunday)
 */
function getWeekDateRange(date: Date = new Date()): { start: Date; end: Date } {
  const current = new Date(date);
  const dayOfWeek = current.getDay();

  // Adjust to get Monday (day 1) - if Sunday (0), go back 6 days
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(current);
  monday.setDate(current.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);

  // Sunday is 6 days after Monday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return { start: monday, end: sunday };
}

/**
 * Format date as "January 20, 2026"
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format date as "Jan 20"
 */
function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format date as "YYYY-MM-DD"
 */
function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Generate slug from week dates
 */
function generateSlug(weekStart: Date, weekEnd: Date): string {
  const startMonth = weekStart.toLocaleDateString("en-US", { month: "short" }).toLowerCase();
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const year = weekEnd.getFullYear();

  // Handle month boundary
  if (weekStart.getMonth() !== weekEnd.getMonth()) {
    const endMonth = weekEnd.toLocaleDateString("en-US", { month: "short" }).toLowerCase();
    return `silver-weekly-${startMonth}-${startDay}-${endMonth}-${endDay}-${year}`;
  }

  return `silver-weekly-${startMonth}-${startDay}-${endDay}-${year}`;
}

/**
 * Get weekly price data from stored daily prices
 */
async function getWeeklyData(): Promise<WeeklyData> {
  const { start: weekStart, end: weekEnd } = getWeekDateRange();

  // Get stored daily prices
  const allPrices = await readDailyPrices();

  // Filter prices for this week
  const weekPrices: { date: string; price: number }[] = [];
  const startStr = formatDateISO(weekStart);
  const endStr = formatDateISO(weekEnd);

  for (const [dateKey, data] of Object.entries(allPrices)) {
    if (dateKey === "_metadata") continue;
    if (dateKey >= startStr && dateKey <= endStr) {
      const priceData = data as StoredDailyPrice;
      if (priceData.pricePerGram) {
        weekPrices.push({
          date: dateKey,
          price: priceData.pricePerGram,
        });
      }
    }
  }

  // Sort by date
  weekPrices.sort((a, b) => a.date.localeCompare(b.date));

  // Get current live price and city prices
  const [currentPrice, cities] = await Promise.all([
    getSilverPrice(),
    getCityPrices(),
  ]);

  // If we don't have stored prices, use current price
  if (weekPrices.length === 0) {
    weekPrices.push({
      date: formatDateISO(new Date()),
      price: currentPrice.pricePerGram,
    });
  }

  // Calculate week statistics
  const prices = weekPrices.map(p => p.price);
  const openingPrice = prices[0];
  const closingPrice = currentPrice.pricePerGram; // Use live price as closing
  const weekHigh = Math.max(...prices, closingPrice);
  const weekLow = Math.min(...prices, closingPrice);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const weekChange = closingPrice - openingPrice;
  const weekChangePercent = (weekChange / openingPrice) * 100;

  return {
    weekStart: formatDateISO(weekStart),
    weekEnd: formatDateISO(weekEnd),
    weekStartFormatted: formatDate(weekStart),
    weekEndFormatted: formatDate(weekEnd),
    openingPrice: Math.round(openingPrice * 100) / 100,
    closingPrice: Math.round(closingPrice * 100) / 100,
    weekHigh: Math.round(weekHigh * 100) / 100,
    weekLow: Math.round(weekLow * 100) / 100,
    weekChange: Math.round(weekChange * 100) / 100,
    weekChangePercent: Math.round(weekChangePercent * 100) / 100,
    avgPrice: Math.round(avgPrice * 100) / 100,
    dailyPrices: weekPrices,
    cities,
    currentPrice,
  };
}

/**
 * Generate market analysis based on price movements
 */
function generateAnalysis(data: WeeklyData): string {
  const { weekChangePercent, weekHigh, weekLow, closingPrice, openingPrice } = data;

  let trend = "";
  let outlook = "";

  if (weekChangePercent > 3) {
    trend = "Silver showed **strong bullish momentum** this week, gaining over " +
      Math.abs(weekChangePercent).toFixed(1) + "%. The rally was supported by " +
      "favorable global market conditions and strong domestic demand.";
    outlook = "The bullish trend may continue into next week, though some profit-booking " +
      "could lead to minor corrections. Support lies at the weekly low of ₹" + weekLow + "/gram.";
  } else if (weekChangePercent > 0) {
    trend = "Silver registered **modest gains** this week, climbing " +
      weekChangePercent.toFixed(1) + "%. The metal traded in a relatively tight range, " +
      "showing stability amid mixed global cues.";
    outlook = "Expect range-bound trading next week with support at ₹" + weekLow +
      " and resistance near ₹" + (closingPrice * 1.02).toFixed(0) + ".";
  } else if (weekChangePercent > -3) {
    trend = "Silver experienced **minor weakness** this week, declining " +
      Math.abs(weekChangePercent).toFixed(1) + "%. The dip was primarily due to " +
      "profit-booking after recent gains and a stronger dollar.";
    outlook = "Look for support at ₹" + weekLow + "/gram. A bounce from these levels " +
      "could push prices back toward ₹" + openingPrice + " next week.";
  } else {
    trend = "Silver faced **significant selling pressure** this week, dropping " +
      Math.abs(weekChangePercent).toFixed(1) + "%. Global risk-off sentiment and " +
      "strengthening dollar weighed on precious metals.";
    outlook = "Watch for stabilization near ₹" + weekLow + "/gram. A break below this " +
      "could extend losses, while support holding may trigger a recovery.";
  }

  return `### Market Trend\n\n${trend}\n\n### Outlook for Next Week\n\n${outlook}`;
}

/**
 * Generate the weekly article markdown content
 */
function generateArticleContent(data: WeeklyData): string {
  const { start: weekStart, end: weekEnd } = getWeekDateRange();
  const slug = generateSlug(weekStart, weekEnd);

  const changeIcon = data.weekChange >= 0 ? "↑" : "↓";
  const changeColor = data.weekChange >= 0 ? "green" : "red";

  // Format week range for title
  const titleRange = `${formatShortDate(weekStart)}-${weekEnd.getDate()}, ${weekEnd.getFullYear()}`;

  // Get top 5 cities for the table
  const topCities = data.cities.slice(0, 5);

  const content = `---
title: "Silver Weekly Wrap: ${titleRange} - Price Analysis & Outlook"
description: "Silver ranged ₹${data.weekLow}-${data.weekHigh}/gram this week. Weekly high: ₹${data.weekHigh}, Weekly low: ₹${data.weekLow}. ${data.weekChange >= 0 ? "Gained" : "Lost"} ${Math.abs(data.weekChangePercent).toFixed(1)}%. Complete analysis."
date: "${data.weekEnd}"
lastModified: "${data.weekEnd}"
author: "SilverInfo Team"
category: "Weekly Analysis"
tags: ["silver weekly", "silver ${weekEnd.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toLowerCase()}", "silver price analysis", "silver weekly wrap", "silver market update"]
image: "/images/updates/${slug}.svg"
featured: false
---

## Week at a Glance

| Metric | Value |
|--------|-------|
| **Week** | ${titleRange} |
| **Opening (Mon)** | ₹${data.openingPrice}/gram |
| **Closing (Sun)** | ₹${data.closingPrice}/gram |
| **Weekly High** | ₹${data.weekHigh}/gram |
| **Weekly Low** | ₹${data.weekLow}/gram |
| **Week Change** | ${changeIcon} ${data.weekChange >= 0 ? "+" : ""}₹${data.weekChange} (${data.weekChange >= 0 ? "+" : ""}${data.weekChangePercent}%) |
| **Average Price** | ₹${data.avgPrice}/gram |

---

## What Happened This Week

${generateAnalysis(data)}

---

## Daily Price Movement

| Day | Date | Price (₹/gram) |
|-----|------|---------------|
${data.dailyPrices.map((p, i) => {
  const date = new Date(p.date);
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  return `| ${dayName} | ${formatShortDate(date)} | ₹${p.price} |`;
}).join("\n")}
| **Today** | ${formatShortDate(weekEnd)} | **₹${data.closingPrice}** |

---

## City-Wise Weekly Closing Prices

| City | Price/Gram | Price/Kg | Making Charges |
|------|-----------|----------|----------------|
${topCities.map(city =>
  `| ${city.city} | ₹${city.pricePerGram} | ₹${city.pricePerKg.toLocaleString("en-IN")} | ${city.makingCharges}% |`
).join("\n")}

[View all 20 city prices →](/silver-rate-today)

---

## Key Market Factors

### Global Influences
- **COMEX Silver**: ${data.currentPrice.comexUsd ? `$${data.currentPrice.comexUsd}/oz` : "Tracking COMEX futures"}
- **USD/INR**: ${data.currentPrice.usdInr ? `₹${data.currentPrice.usdInr}` : "Exchange rate impact on imports"}
- International market movements directly impact Indian prices

### Domestic Factors
- MCX silver futures trading
- Import duty structure (10% customs + 3% GST)
- Local demand from jewelry and industrial sectors

---

## What Should You Do?

### For Buyers
${data.weekChange < 0
  ? "- **Good opportunity**: Prices have corrected this week\n- Consider buying on dips toward ₹" + data.weekLow + "/gram"
  : "- **Wait for pullback**: Prices have rallied this week\n- Consider accumulating if prices correct to ₹" + data.weekLow + "/gram"}
- Use our [Silver Calculator](/silver-price-calculator) to estimate costs

### For Investors
- Track weekly trends for better entry points
- Use [Investment Calculator](/investment-calculator) for ROI analysis
- Consider SIP approach for long-term investing

### For Sellers
${data.weekChange > 0
  ? "- **Favorable time**: Weekly highs offer good exit points\n- Compare buyback rates across jewelers"
  : "- **Hold if possible**: Wait for recovery toward ₹" + data.openingPrice + "/gram\n- Use [Break-Even Calculator](/break-even-calculator) to check minimum selling price"}

---

## Related Tools

| Tool | Purpose |
|------|---------|
| [Live Dashboard](/silver-rate-today) | Real-time prices & charts |
| [Silver Calculator](/silver-price-calculator) | Calculate purchase cost with GST |
| [Investment Calculator](/investment-calculator) | Track your profit/loss |
| [Tax Calculator](/capital-gains-tax-calculator) | Estimate capital gains tax |

---

## Looking Ahead

Next week's key events to watch:
- Global economic data releases
- Dollar index movements
- Domestic demand patterns
- Any policy announcements

[Check live prices](/silver-rate-today) for real-time updates throughout the week.

---

*This weekly wrap is auto-generated every Sunday at 11 PM IST based on actual market data. For the most current prices, always check our [live dashboard](/silver-rate-today).*
`;

  return content;
}

/**
 * Main handler - Generate weekly article
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Verify cron secret for security
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    // Get weekly data
    const weeklyData = await getWeeklyData();

    // Generate article content
    const articleContent = generateArticleContent(weeklyData);

    // Generate filename
    const { start: weekStart, end: weekEnd } = getWeekDateRange();
    const slug = generateSlug(weekStart, weekEnd);
    const filename = `${slug}.md`;

    // Write to file system
    const fs = await import("fs");
    const path = await import("path");

    const contentDir = path.default.join(process.cwd(), "src", "content", "updates");
    const filePath = path.default.join(contentDir, filename);

    // Ensure directory exists
    if (!fs.default.existsSync(contentDir)) {
      fs.default.mkdirSync(contentDir, { recursive: true });
    }

    // Check if article already exists
    if (fs.default.existsSync(filePath)) {
      return NextResponse.json({
        success: true,
        message: `Weekly article already exists: ${filename}`,
        skipped: true,
        filename,
        slug,
      });
    }

    // Write article
    fs.default.writeFileSync(filePath, articleContent, "utf-8");

    console.log(`Generated weekly article: ${filename}`);

    return NextResponse.json({
      success: true,
      message: `Generated weekly article: ${filename}`,
      filename,
      slug,
      data: {
        weekStart: weeklyData.weekStart,
        weekEnd: weeklyData.weekEnd,
        openingPrice: weeklyData.openingPrice,
        closingPrice: weeklyData.closingPrice,
        weekHigh: weeklyData.weekHigh,
        weekLow: weeklyData.weekLow,
        weekChange: weeklyData.weekChange,
        weekChangePercent: weeklyData.weekChangePercent,
      },
    });
  } catch (error) {
    console.error("Weekly article generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
