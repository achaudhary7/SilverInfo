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
