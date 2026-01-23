/**
 * Cron Job: Save Daily Price
 * 
 * This endpoint should be called once daily (e.g., at 11:45 PM IST)
 * to save the closing price for the day.
 * 
 * For Vercel: Add to vercel.json crons config
 * For other hosts: Use external cron service (cron-job.org, etc.)
 * 
 * Security: Optionally add CRON_SECRET env var for protection
 * 
 * Usage:
 * - GET /api/cron/save-daily-price - Save today's price
 * - POST /api/cron/save-daily-price - Same as GET
 */

import { NextRequest, NextResponse } from "next/server";
import { getSilverPrice } from "@/lib/metalApi";
import { saveDailyPrice, isTodayPriceStored, type StoredDailyPrice } from "@/lib/priceStorage";

// Force dynamic - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    
    // Check if already saved today
    const alreadyStored = await isTodayPriceStored();
    if (alreadyStored) {
      return NextResponse.json({
        success: true,
        message: "Today's price already stored",
        skipped: true,
      });
    }
    
    // Fetch current price
    const price = await getSilverPrice();
    
    // Prepare storage data
    const today = new Date().toISOString().split("T")[0];
    const storedPrice: StoredDailyPrice = {
      date: today,
      pricePerGram: price.pricePerGram,
      pricePerKg: price.pricePerKg,
      comexUsdOz: 0, // Could be populated if we track this
      usdInrRate: 0, // Could be populated if we track this
      source: price.source,
      timestamp: new Date().toISOString(),
    };
    
    // Save to storage
    const saved = await saveDailyPrice(storedPrice);
    
    if (saved) {
      return NextResponse.json({
        success: true,
        message: `Saved price for ${today}`,
        data: storedPrice,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to save price" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
