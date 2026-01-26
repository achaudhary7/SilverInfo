/**
 * Gold Price API Route
 * 
 * Returns real-time gold prices in INR with daily extremes tracking.
 * 
 * GET /api/gold-price
 * Returns: GoldPrice object with 24K, 22K, 18K prices
 */

import { NextResponse } from "next/server";
import { getGoldPriceWithChange } from "@/lib/goldApi";
import { updateGoldDailyExtremes } from "@/lib/goldPriceStorage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const price = await getGoldPriceWithChange();
    
    // Update daily extremes with the current 24K price
    const extremes = await updateGoldDailyExtremes(price.price24KPerGram);

    // Add daily extremes to the price object
    const priceWithExtremes = {
      ...price,
      todayHigh: extremes.high,
      todayHighTime: extremes.highTime,
      todayLow: extremes.low,
      todayLowTime: extremes.lowTime,
      todayOpen: extremes.openPrice,
    };
    
    return NextResponse.json(priceWithExtremes, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("[GoldPriceAPI] Error fetching price:", error);
    return NextResponse.json(
      { error: "Failed to fetch gold price" },
      { status: 500 }
    );
  }
}
