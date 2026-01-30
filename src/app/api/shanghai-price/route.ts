import { NextResponse } from "next/server";
import { getShanghaiSilverPrice } from "@/lib/shanghaiApi";

// ISR: Cache for 60 seconds, revalidate in background
// This reduces Edge Requests by ~95% while keeping data fresh
export const revalidate = 60;

/**
 * GET /api/shanghai-price
 * 
 * Returns real-time Shanghai silver price with:
 * - CNY prices (SGE standard)
 * - USD prices (international)
 * - INR prices (for Indian users)
 * - COMEX comparison & premium
 * - Market status
 */
export async function GET() {
  try {
    const price = await getShanghaiSilverPrice();
    
    if (!price) {
      return NextResponse.json(
        { error: "Failed to fetch Shanghai silver price" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(price, {
      headers: {
        // Cache at Edge for 60s, serve stale while revalidating for up to 120s
        // This provides near-real-time data while reducing Edge Requests by ~95%
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error in shanghai-price API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
