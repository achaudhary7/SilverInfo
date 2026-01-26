import { NextResponse } from "next/server";
import { getShanghaiSilverPrice } from "@/lib/shanghaiApi";

// Force dynamic - no caching for real-time prices
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        // Prevent browser/CDN caching for real-time data
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
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
