/**
 * Cron Job: Save Daily Gold Price
 * 
 * Runs at 11:50 PM IST (18:20 UTC) daily to save closing gold price.
 * MCX closes at 11:30 PM IST, so 11:50 PM captures the closing price.
 * 
 * Schedule: "20 18 * * *" (18:20 UTC = 11:50 PM IST)
 */

import { NextResponse } from "next/server";
import { getGoldPrice } from "@/lib/goldApi";
import { saveDailyGoldPrice } from "@/lib/goldPriceStorage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Verify cron secret (optional security)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log("[CronGold] Unauthorized request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch current gold price
    const price = await getGoldPrice();
    
    if (!price || price.source === "fallback") {
      console.log("[CronGold] Could not fetch real gold price, skipping save");
      return NextResponse.json({ 
        success: false, 
        message: "Could not fetch real price" 
      });
    }

    // Save to storage
    await saveDailyGoldPrice(price);
    
    console.log(`[CronGold] Saved daily gold price: ₹${price.price24KPerGram} (24K), ₹${price.price22KPerGram} (22K)`);
    
    return NextResponse.json({
      success: true,
      message: "Daily gold price saved",
      data: {
        price24K: price.price24KPerGram,
        price22K: price.price22KPerGram,
        timestamp: price.timestamp,
        source: price.source,
      },
    });
  } catch (error) {
    console.error("[CronGold] Error saving daily price:", error);
    return NextResponse.json(
      { error: "Failed to save daily price" },
      { status: 500 }
    );
  }
}
