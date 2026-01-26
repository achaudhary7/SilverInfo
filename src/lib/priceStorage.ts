/**
 * Price Storage Module (Server-Side Only)
 * 
 * Handles reading and writing daily silver prices to local JSON storage.
 * This provides:
 * - Reliable 24h change calculation (yesterday vs today)
 * - Historical data independence from Yahoo Finance
 * - Fallback data when APIs fail
 * 
 * Data is stored in /data/daily-prices.json
 * 
 * NOTE: This module uses Node.js fs module and can ONLY be used in:
 * - API routes
 * - Server Components
 * - getServerSideProps / getStaticProps
 * 
 * It will NOT work in client components or browser code.
 */

// Types for stored price data
export interface StoredDailyPrice {
  date: string;              // YYYY-MM-DD
  pricePerGram: number;      // INR per gram
  pricePerKg: number;        // INR per kg
  comexUsdOz: number;        // COMEX price in USD per troy oz
  usdInrRate: number;        // USD to INR exchange rate
  source: string;            // Data source identifier
  timestamp: string;         // ISO timestamp when saved
}

// Today's high/low tracking
export interface DailyExtremes {
  date: string;              // YYYY-MM-DD (IST)
  high: number;              // Highest price seen today (INR per gram)
  highTime: string;          // ISO timestamp when high was recorded
  low: number;               // Lowest price seen today (INR per gram)
  lowTime: string;           // ISO timestamp when low was recorded
  openPrice: number;         // First price of the day
  lastUpdated: string;       // ISO timestamp of last update
}

export interface DailyPricesData {
  _metadata: {
    description: string;
    source: string;
    createdAt: string;
    format: string;
    lastUpdated?: string;
  };
  [date: string]: StoredDailyPrice | { description: string; source: string; createdAt: string; format: string; lastUpdated?: string };
}

// Dynamic import helper to ensure fs is only loaded on server
async function getFs() {
  if (typeof window !== "undefined") {
    throw new Error("priceStorage can only be used on the server side");
  }
  const fs = await import("fs");
  return fs.default;
}

async function getPath() {
  const path = await import("path");
  return path.default;
}

// Get data file path
async function getDataFilePath(): Promise<string> {
  const path = await getPath();
  return path.join(process.cwd(), "data", "daily-prices.json");
}

/**
 * Read all stored daily prices
 */
export async function readDailyPrices(): Promise<DailyPricesData> {
  try {
    const fs = await getFs();
    const dataFilePath = await getDataFilePath();
    
    if (!fs.existsSync(dataFilePath)) {
      console.log("Daily prices file not found, creating new one");
      return await createEmptyDataFile();
    }
    
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data) as DailyPricesData;
  } catch (error) {
    console.error("Error reading daily prices:", error);
    return await createEmptyDataFile();
  }
}

/**
 * Save a daily price entry
 */
export async function saveDailyPrice(price: StoredDailyPrice): Promise<boolean> {
  try {
    const fs = await getFs();
    const path = await getPath();
    const dataFilePath = await getDataFilePath();
    
    const data = await readDailyPrices();
    
    // Add or update the price for the date
    data[price.date] = price;
    
    // Update metadata
    if (data._metadata) {
      data._metadata.lastUpdated = new Date().toISOString();
    }
    
    // Ensure directory exists
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write to file
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    
    console.log(`Saved daily price for ${price.date}: ₹${price.pricePerGram}/gram`);
    return true;
  } catch (error) {
    console.error("Error saving daily price:", error);
    return false;
  }
}

/**
 * Get yesterday's stored price
 */
export async function getYesterdayPrice(): Promise<StoredDailyPrice | null> {
  try {
    const data = await readDailyPrices();
    
    // Get yesterday's date in YYYY-MM-DD format
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    const price = data[yesterdayStr];
    if (price && typeof price === "object" && "pricePerGram" in price) {
      return price as StoredDailyPrice;
    }
    
    // If yesterday not found, try the most recent date
    const dates = Object.keys(data)
      .filter(key => key !== "_metadata" && key.match(/^\d{4}-\d{2}-\d{2}$/))
      .sort()
      .reverse();
    
    if (dates.length > 0) {
      const mostRecent = data[dates[0]];
      if (mostRecent && typeof mostRecent === "object" && "pricePerGram" in mostRecent) {
        console.log(`Using most recent stored price from ${dates[0]} as yesterday reference`);
        return mostRecent as StoredDailyPrice;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting yesterday price:", error);
    return null;
  }
}

/**
 * Get stored historical prices for a given number of days
 */
export async function getStoredHistoricalPrices(days: number): Promise<StoredDailyPrice[]> {
  try {
    const data = await readDailyPrices();
    
    // Get all date keys, excluding metadata
    const dates = Object.keys(data)
      .filter(key => key !== "_metadata" && key.match(/^\d{4}-\d{2}-\d{2}$/))
      .sort()
      .reverse()
      .slice(0, days);
    
    // Map to StoredDailyPrice objects
    const prices: StoredDailyPrice[] = [];
    for (const date of dates) {
      const price = data[date];
      if (price && typeof price === "object" && "pricePerGram" in price) {
        prices.push(price as StoredDailyPrice);
      }
    }
    
    // Return in chronological order (oldest first)
    return prices.reverse();
  } catch (error) {
    console.error("Error getting stored historical prices:", error);
    return [];
  }
}

/**
 * Get the count of stored days
 */
export async function getStoredDaysCount(): Promise<number> {
  try {
    const data = await readDailyPrices();
    return Object.keys(data).filter(key => key !== "_metadata" && key.match(/^\d{4}-\d{2}-\d{2}$/)).length;
  } catch (error) {
    return 0;
  }
}

/**
 * Create empty data file
 */
async function createEmptyDataFile(): Promise<DailyPricesData> {
  const emptyData: DailyPricesData = {
    _metadata: {
      description: "Daily silver prices stored for historical reference",
      source: "COMEX Silver Futures (SI=F) + USD/INR conversion",
      createdAt: new Date().toISOString().split("T")[0],
      format: "YYYY-MM-DD as keys",
    },
  };
  
  try {
    const fs = await getFs();
    const path = await getPath();
    const dataFilePath = await getDataFilePath();
    
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(emptyData, null, 2), "utf-8");
  } catch (error) {
    console.error("Error creating empty data file:", error);
  }
  
  return emptyData;
}

/**
 * Check if today's price is already stored
 */
export async function isTodayPriceStored(): Promise<boolean> {
  try {
    const data = await readDailyPrices();
    const today = new Date().toISOString().split("T")[0];
    return today in data && typeof data[today] === "object" && "pricePerGram" in (data[today] as object);
  } catch (error) {
    return false;
  }
}

// ============================================================================
// DAILY EXTREMES (HIGH/LOW) TRACKING
// ============================================================================
// 
// Uses in-memory cache for serverless environments (Vercel)
// File storage as backup for local development
// 
// Strategy:
// 1. Check in-memory cache first (fast, works across requests in same instance)
// 2. Fall back to file storage (works in local dev)
// 3. If both fail, create new from current price
// ============================================================================

// Global in-memory cache (persists across requests in same serverless instance)
// This is the key fix for Vercel - globalThis persists between requests
const EXTREMES_CACHE_KEY = 'silverinfo_daily_extremes';

interface GlobalCache {
  [EXTREMES_CACHE_KEY]?: DailyExtremes;
}

// Use globalThis for persistence across serverless invocations
const globalCache = globalThis as unknown as GlobalCache;

/**
 * Get today's date in IST timezone (YYYY-MM-DD)
 */
function getTodayIST(): string {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split("T")[0];
}

/**
 * Get the file path for daily extremes (backup storage)
 */
async function getExtremesFilePath(): Promise<string> {
  const path = await getPath();
  return path.join(process.cwd(), "data", "daily-extremes.json");
}

/**
 * Read daily extremes from memory cache or file storage
 * 
 * Priority:
 * 1. In-memory globalThis cache (fastest, per-instance)
 * 2. Committed JSON file (read-only on Vercel, serves as baseline seed)
 * 3. Return null (will create new from current price)
 */
export async function readDailyExtremes(): Promise<DailyExtremes | null> {
  const todayIST = getTodayIST();
  
  // 1. Check in-memory cache first (fastest)
  const cached = globalCache[EXTREMES_CACHE_KEY];
  if (cached && cached.date === todayIST) {
    return cached;
  }
  
  // 2. Try file storage (committed file works on Vercel as read-only seed)
  try {
    const fs = await getFs();
    const filePath = await getExtremesFilePath();
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const extremes = JSON.parse(data) as DailyExtremes;
      
      if (extremes.date === todayIST) {
        console.log(`[DailyExtremes] Loaded from file: High=₹${extremes.high}, Low=₹${extremes.low}`);
        // Update memory cache from file
        globalCache[EXTREMES_CACHE_KEY] = extremes;
        return extremes;
      } else {
        console.log(`[DailyExtremes] File has old date (${extremes.date}), ignoring`);
      }
    }
  } catch (error) {
    console.log("[DailyExtremes] File read failed, will create new:", error);
  }
  
  return null;
}

/**
 * Update daily extremes with a new price
 * 
 * Strategy:
 * 1. Read from memory cache or file seed
 * 2. Compare current price with extremes - NEVER reduce high, NEVER increase low
 * 3. Update memory cache (file updates only work locally)
 */
export async function updateDailyExtremes(currentPrice: number): Promise<DailyExtremes> {
  const now = new Date().toISOString();
  const todayIST = getTodayIST();
  
  // Read existing data (from memory or file seed)
  let extremes = await readDailyExtremes();
  
  // If no data for today, create new
  if (!extremes) {
    extremes = {
      date: todayIST,
      high: currentPrice,
      highTime: now,
      low: currentPrice,
      lowTime: now,
      openPrice: currentPrice,
      lastUpdated: now,
    };
    console.log(`[DailyExtremes] New day started. Open: ₹${currentPrice.toFixed(2)}`);
  } else {
    // IMPORTANT: Use Math.max/min to NEVER lose data
    // This protects against stale data from cold instances
    const existingHigh = extremes.high;
    const existingLow = extremes.low;
    
    // Update high: take the maximum of existing and current
    const newHigh = Math.max(existingHigh, currentPrice);
    if (newHigh > existingHigh) {
      console.log(`[DailyExtremes] New HIGH: ₹${currentPrice.toFixed(2)} (was ₹${existingHigh.toFixed(2)})`);
      extremes.high = newHigh;
      extremes.highTime = now;
    }
    
    // Update low: take the minimum of existing and current
    const newLow = Math.min(existingLow, currentPrice);
    if (newLow < existingLow) {
      console.log(`[DailyExtremes] New LOW: ₹${currentPrice.toFixed(2)} (was ₹${existingLow.toFixed(2)})`);
      extremes.low = newLow;
      extremes.lowTime = now;
    }
    
    extremes.lastUpdated = now;
  }
  
  // 1. Always update memory cache (primary storage for Vercel)
  globalCache[EXTREMES_CACHE_KEY] = extremes;
  
  // 2. Try to update file storage (works locally, fails silently on Vercel)
  try {
    const fs = await getFs();
    const path = await getPath();
    const filePath = await getExtremesFilePath();
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(extremes, null, 2), "utf-8");
  } catch {
    // File write failed (expected on Vercel read-only FS), memory cache is still updated
  }
  
  return extremes;
}

/**
 * Get daily extremes (for client consumption)
 */
export async function getDailyExtremes(): Promise<DailyExtremes | null> {
  return await readDailyExtremes();
}
