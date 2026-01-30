/**
 * Silver Price USD API
 *
 * Returns live silver prices in USD for US/international users.
 * Used for client-side polling on the /silver-price-usd page.
 *
 * GET /api/silver-price-usd
 */

import { NextResponse } from "next/server";
import { getCombinedUSDPrices } from "@/lib/metalApi";

// Cache for 60 seconds (balances freshness vs Edge Request reduction)
export const revalidate = 60;

export async function GET() {
  try {
    const prices = await getCombinedUSDPrices();

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
    console.error("[API] USD prices error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch USD price data",
      },
      { status: 500 }
    );
  }
}
