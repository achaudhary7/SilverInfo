/**
 * Gold-Silver Ratio API
 *
 * Returns the current gold-silver ratio with interpretation.
 * Used by the GoldSilverRatioCard component for live updates.
 *
 * GET /api/gold-silver-ratio
 */

import { NextResponse } from "next/server";
import { calculateGoldSilverRatio } from "@/lib/metalApi";

// Cache for 5 minutes (ISR)
export const revalidate = 300;

export async function GET() {
  try {
    const ratio = await calculateGoldSilverRatio();

    if (!ratio) {
      return NextResponse.json(
        {
          error: "Unable to calculate gold-silver ratio",
          message: "Price data temporarily unavailable. Please try again.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(ratio, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[API] Gold-Silver Ratio error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch price data",
      },
      { status: 500 }
    );
  }
}
