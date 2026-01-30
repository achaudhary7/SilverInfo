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

// ISR: Cache for 60 seconds at Edge
// Data-layer caching via unstable_cache handles external API calls
// Daily extremes tracking still works on cache misses
export const revalidate = 60;

export async function GET() {
  try {
    const price = await getGoldPriceWithChange();
    
    // If API fails, return 503 Service Unavailable
    if (!price) {
      return NextResponse.json(
        {
          error: "Service unavailable",
          message: "Unable to fetch live gold price data from external sources. Please try again later.",
        },
        { status: 503 }
      );
    }
    
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
        // Cache at Edge for 60s, serve stale while revalidating for up to 120s
        // This provides near-real-time data while reducing Edge Requests by ~95%
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
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
