/**
 * Gold Price Storage
 * 
 * Server-side module for storing and retrieving daily gold prices.
 * Uses local JSON files for development and in-memory cache for Vercel.
 * 
 * ============================================================================
 * KEY RESPONSIBILITIES
 * ============================================================================
 * - Save daily gold price at MCX close (11:50 PM IST)
 * - Track daily high/low extremes
 * - Provide yesterday's price for 24h change calculation
 * - Maintain historical price data
 * 
 * Architecture: Storage Layer
 * Used By: /api/gold-price/route.ts, /api/cron/save-daily-gold-price/route.ts
 */

import type { GoldPrice } from "./goldApi";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface StoredGoldPrice {
  date: string;          // YYYY-MM-DD
  price24KPerGram: number;
  price22KPerGram: number;
  timestamp: string;     // ISO timestamp
  source: string;
}

export interface GoldDailyExtremes {
  date: string;          // YYYY-MM-DD (IST)
  high: number;          // 24K high
  highTime: string;      // ISO timestamp
  low: number;           // 24K low
  lowTime: string;       // ISO timestamp
  openPrice: number;     // 24K open
  lastUpdated: string;   // ISO timestamp
}

// ============================================================================
// IN-MEMORY CACHE (for Vercel serverless)
// ============================================================================

declare global {
  var goldDailyExtremesCache: GoldDailyExtremes | undefined;
  var goldPricesCache: StoredGoldPrice[] | undefined;
}

// ============================================================================
// FILE PATHS
// ============================================================================

async function getFs() {
  return (await import("fs")).default;
}

async function getPath() {
  return (await import("path")).default;
}

async function getPricesFilePath(): Promise<string> {
  const path = await getPath();
  return path.join(process.cwd(), "data", "daily-gold-prices.json");
}

async function getExtremesFilePath(): Promise<string> {
  const path = await getPath();
  return path.join(process.cwd(), "data", "gold-daily-extremes.json");
}

// ============================================================================
// TIMEZONE HELPERS
// ============================================================================

/**
 * Get today's date in IST (YYYY-MM-DD)
 */
function getTodayIST(): string {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split('T')[0];
}

// ============================================================================
// DAILY EXTREMES FUNCTIONS
// ============================================================================

/**
 * Read daily extremes from cache or file
 */
export async function readGoldDailyExtremes(): Promise<GoldDailyExtremes | null> {
  // Check in-memory cache first
  if (globalThis.goldDailyExtremesCache) {
    const todayIST = getTodayIST();
    if (globalThis.goldDailyExtremesCache.date === todayIST) {
      return globalThis.goldDailyExtremesCache;
    }
  }

  // Try reading from file (for local development)
  if (process.env.NODE_ENV === 'development') {
    try {
      const fs = await getFs();
      const filePath = await getExtremesFilePath();
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(content) as GoldDailyExtremes;
        
        const todayIST = getTodayIST();
        if (data.date === todayIST) {
          globalThis.goldDailyExtremesCache = data;
          return data;
        }
      }
    } catch (error) {
      console.error("[GoldStorage] Error reading extremes file:", error);
    }
  }

  return null;
}

/**
 * Update daily extremes with current price
 */
export async function updateGoldDailyExtremes(currentPrice: number): Promise<GoldDailyExtremes> {
  const now = new Date().toISOString();
  const todayIST = getTodayIST();

  let extremes = globalThis.goldDailyExtremesCache;

  // If no data for today or cache is for a different day, create new
  if (!extremes || extremes.date !== todayIST) {
    extremes = {
      date: todayIST,
      high: currentPrice,
      highTime: now,
      low: currentPrice,
      lowTime: now,
      openPrice: currentPrice,
      lastUpdated: now,
    };
    console.log(`[GoldStorage] New day started. Open: ₹${currentPrice.toFixed(2)}`);
  } else {
    // Update high if current price is higher
    if (currentPrice > extremes.high) {
      console.log(`[GoldStorage] New high: ₹${currentPrice.toFixed(2)} (was ₹${extremes.high.toFixed(2)})`);
      extremes.high = currentPrice;
      extremes.highTime = now;
    }

    // Update low if current price is lower
    if (currentPrice < extremes.low) {
      console.log(`[GoldStorage] New low: ₹${currentPrice.toFixed(2)} (was ₹${extremes.low.toFixed(2)})`);
      extremes.low = currentPrice;
      extremes.lowTime = now;
    }

    extremes.lastUpdated = now;
  }

  globalThis.goldDailyExtremesCache = extremes;

  // For local development, also write to file system
  if (process.env.NODE_ENV === 'development') {
    try {
      const fs = await getFs();
      const path = await getPath();
      const filePath = await getExtremesFilePath();
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(extremes, null, 2), "utf-8");
    } catch (error) {
      console.error("[GoldStorage] Error writing extremes to file:", error);
    }
  }

  return extremes;
}

// ============================================================================
// HISTORICAL PRICE FUNCTIONS
// ============================================================================

/**
 * Save daily gold price (called by cron job at 11:50 PM IST)
 */
export async function saveDailyGoldPrice(price: GoldPrice): Promise<void> {
  const todayIST = getTodayIST();
  
  const storedPrice: StoredGoldPrice = {
    date: todayIST,
    price24KPerGram: price.price24KPerGram,
    price22KPerGram: price.price22KPerGram,
    timestamp: price.timestamp,
    source: price.source,
  };

  // Read existing prices
  let prices: StoredGoldPrice[] = [];
  
  if (globalThis.goldPricesCache) {
    prices = [...globalThis.goldPricesCache];
  } else if (process.env.NODE_ENV === 'development') {
    try {
      const fs = await getFs();
      const filePath = await getPricesFilePath();
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        prices = JSON.parse(content);
      }
    } catch (error) {
      console.error("[GoldStorage] Error reading prices file:", error);
    }
  }

  // Remove existing entry for today (if any)
  prices = prices.filter(p => p.date !== todayIST);
  
  // Add new price
  prices.push(storedPrice);
  
  // Keep only last 365 days
  prices.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  if (prices.length > 365) {
    prices = prices.slice(-365);
  }

  // Update cache
  globalThis.goldPricesCache = prices;

  // Save to file (for local development)
  if (process.env.NODE_ENV === 'development') {
    try {
      const fs = await getFs();
      const path = await getPath();
      const filePath = await getPricesFilePath();
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(prices, null, 2), "utf-8");
      console.log(`[GoldStorage] Saved daily price for ${todayIST}: ₹${storedPrice.price24KPerGram}`);
    } catch (error) {
      console.error("[GoldStorage] Error saving daily price:", error);
    }
  }
}

/**
 * Get yesterday's gold price for 24h change calculation
 */
export async function getYesterdayGoldPrice(): Promise<StoredGoldPrice | null> {
  const todayIST = getTodayIST();
  const yesterday = new Date(todayIST);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Check cache first
  if (globalThis.goldPricesCache) {
    const found = globalThis.goldPricesCache.find(p => p.date === yesterdayStr);
    if (found) return found;
  }

  // Try reading from file (for local development)
  if (process.env.NODE_ENV === 'development') {
    try {
      const fs = await getFs();
      const filePath = await getPricesFilePath();
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const prices: StoredGoldPrice[] = JSON.parse(content);
        
        globalThis.goldPricesCache = prices;
        
        const found = prices.find(p => p.date === yesterdayStr);
        if (found) return found;
      }
    } catch (error) {
      console.error("[GoldStorage] Error reading prices file:", error);
    }
  }

  return null;
}

/**
 * Get stored historical prices
 */
export async function getStoredGoldHistoricalPrices(days: number): Promise<StoredGoldPrice[]> {
  let prices: StoredGoldPrice[] = [];

  // Check cache first
  if (globalThis.goldPricesCache) {
    prices = globalThis.goldPricesCache;
  } else if (process.env.NODE_ENV === 'development') {
    try {
      const fs = await getFs();
      const filePath = await getPricesFilePath();
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        prices = JSON.parse(content);
        globalThis.goldPricesCache = prices;
      }
    } catch (error) {
      console.error("[GoldStorage] Error reading prices file:", error);
    }
  }

  // Sort by date and return last N days
  prices.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return prices.slice(-days);
}

/**
 * Get count of stored days
 */
export async function getStoredGoldDaysCount(): Promise<number> {
  if (globalThis.goldPricesCache) {
    return globalThis.goldPricesCache.length;
  }

  if (process.env.NODE_ENV === 'development') {
    try {
      const fs = await getFs();
      const filePath = await getPricesFilePath();
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const prices: StoredGoldPrice[] = JSON.parse(content);
        globalThis.goldPricesCache = prices;
        return prices.length;
      }
    } catch (error) {
      console.error("[GoldStorage] Error reading prices file:", error);
    }
  }

  return 0;
}
