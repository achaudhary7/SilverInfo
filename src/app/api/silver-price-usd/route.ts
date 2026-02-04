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

// Cache for 1 hour (maximized to reduce ISR writes - client polling handles freshness)
export const revalidate = 3600;

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
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
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
