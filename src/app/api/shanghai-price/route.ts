import { NextResponse } from "next/server";
import { getShanghaiSilverPrice } from "@/lib/shanghaiApi";

// ISR: Cache for 1 hour (maximized to reduce ISR writes)
// Client-side polling handles freshness, server cache prevents redundant computation
export const revalidate = 3600;

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
        // Cache at Edge for 1 hour, serve stale while revalidating for up to 2 hours
        // Maximized caching to reduce ISR writes - client polling handles freshness
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
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
