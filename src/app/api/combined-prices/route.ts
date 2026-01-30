/**
 * Combined Metal Prices API
 *
 * Returns live gold and silver prices for the /gold-and-silver-prices page.
 * Used for client-side polling to keep prices updated.
 *
 * GET /api/combined-prices
 */

import { NextResponse } from "next/server";
import { getCombinedMetalPrices } from "@/lib/metalApi";

// Cache for 60 seconds (balances freshness vs Edge Request reduction)
export const revalidate = 60;

export async function GET() {
  try {
    const prices = await getCombinedMetalPrices();

    // If API fails, return 503 Service Unavailable
    if (!prices) {
      return NextResponse.json(
        {
          error: "Service unavailable",
          message: "Unable to fetch live price data from external sources. Please try again later.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(prices, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("[API] Combined prices error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch price data",
      },
      { status: 500 }
    );
  }
}
