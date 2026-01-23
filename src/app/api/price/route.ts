import { NextResponse } from "next/server";
import { getSilverPriceWithChange } from "@/lib/metalApi";

// ============================================================================
// NOTE ON EDGE RUNTIME
// ============================================================================
// Cannot use Edge Runtime because metalApi uses:
// - priceStorage.ts which requires Node.js `fs` module
// - Dynamic imports for server-side storage
// 
// To enable Edge Runtime, you would need to:
// 1. Remove file system storage (use external DB like KV/Redis instead)
// 2. OR create a separate lightweight API that only fetches fresh prices
// ============================================================================

// Force dynamic - no caching for real-time prices
export const dynamic = "force-dynamic";
export const revalidate = 0;

// This route returns the current silver price with 24h change
// Called by client-side polling every 30 seconds
export async function GET() {
  try {
    const price = await getSilverPriceWithChange();
    
    return NextResponse.json(price, {
      headers: {
        // Prevent browser/CDN caching for real-time data
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error fetching price:", error);
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
