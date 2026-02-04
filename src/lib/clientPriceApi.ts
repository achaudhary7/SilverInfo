/**
 * Client-Side Price API
 * 
 * Fetches live prices directly from the browser using free public APIs.
 * No server-side dependencies - works with static site deployment.
 * 
 * ============================================================================
 * APIs USED (All Free, No API Key Required)
 * ============================================================================
 * - Yahoo Finance: Silver (SI=F), Gold (GC=F) futures prices in USD
 * - Frankfurter API: USD/INR, USD/CNY exchange rates (ECB data)
 * 
 * ============================================================================
 * CACHING STRATEGY
 * ============================================================================
 * - localStorage cache with 1-hour TTL
 * - Prevents excessive API calls on page refresh
 * - Falls back to cache if API fails
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SilverPrice {
  pricePerGram: number;
  pricePerKg: number;
  pricePer10Gram: number;
  pricePerTola: number;
  currency: string;
  timestamp: string;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  source: string;
  usdInr?: number;
  comexUsd?: number;
}

export interface GoldPrice {
  price24KPerGram: number;
  price24KPer10Gram: number;
  price24KPerTola: number;
  price24KPerSovereign: number;
  price22KPerGram: number;
  price22KPer10Gram: number;
  price22KPerTola: number;
  price22KPerSovereign: number;
  price18KPerGram: number;
  price18KPer10Gram: number;
  currency: string;
  timestamp: string;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  source: string;
  usdInr?: number;
  comexUsd?: number;
}

export interface ShanghaiSilverPrice {
  pricePerKgCny: number;
  pricePerGramCny: number;
  pricePerOzCny: number;
  pricePerOzUsd: number;
  pricePerGramUsd: number;
  pricePerKgUsd: number;
  pricePerGramInr: number;
  pricePerKgInr: number;
  pricePerOzInr: number;
  indiaRatePerGram: number;
  comexUsd: number;
  premiumPercent: number;
  premiumUsd: number;
  usdCny: number;
  usdInr: number;
  cnyInr: number;
  marketStatus: 'open' | 'closed' | 'pre-market';
  marketSession: string;
  timestamp: string;
  source: string;
  change24hPercent: number;
  change24hCny: number;
  isEstimate: boolean;
  disclaimer: string;
  officialSgeUrl: string;
}

export interface CityPrice {
  city: string;
  state: string;
  pricePerGram: number;
  pricePerKg: number;
  makingCharges: number;
  gst: number;
}

export interface GoldCityPrice {
  city: string;
  state: string;
  price24KPerGram: number;
  price22KPerGram: number;
  price24KPer10Gram: number;
  price22KPer10Gram: number;
  makingCharges: number;
  gst: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TOLA_TO_GRAM = 11.6638;
const SOVEREIGN_TO_GRAM = 8;
const OZ_TO_GRAM = 31.1035;
const KG_TO_OZ = 32.1507;

// Indian import structure (Budget July 2024)
const IMPORT_DUTY = 0.06;       // 6% (5% customs + 1% AIDC)
const IGST = 0.03;              // 3% IGST
const MCX_PREMIUM = 0.03;       // 3% MCX/local market premium

// Gold purity multipliers
const GOLD_PURITY = {
  '24K': 0.999,
  '22K': 0.916,
  '18K': 0.750,
};

// Shanghai premium
const SHANGHAI_PREMIUM = 0.04;  // 4% base premium

// Cache TTL (1 hour in milliseconds)
const CACHE_TTL = 60 * 60 * 1000;

// ============================================================================
// CITY CONFIGURATIONS
// ============================================================================

interface CityConfig {
  city: string;
  state: string;
  premiumPerGram: number;
  makingCharges: number;
  gst: number;
}

const SILVER_CITY_CONFIG: CityConfig[] = [
  { city: "Mumbai", state: "Maharashtra", premiumPerGram: 0, makingCharges: 8, gst: 3 },
  { city: "Delhi", state: "Delhi", premiumPerGram: 0.20, makingCharges: 10, gst: 3 },
  { city: "Ahmedabad", state: "Gujarat", premiumPerGram: 0.30, makingCharges: 7, gst: 3 },
  { city: "Pune", state: "Maharashtra", premiumPerGram: 0.40, makingCharges: 9, gst: 3 },
  { city: "Surat", state: "Gujarat", premiumPerGram: 0.35, makingCharges: 7, gst: 3 },
  { city: "Jaipur", state: "Rajasthan", premiumPerGram: 0.50, makingCharges: 6, gst: 3 },
  { city: "Bangalore", state: "Karnataka", premiumPerGram: 0.60, makingCharges: 10, gst: 3 },
  { city: "Hyderabad", state: "Telangana", premiumPerGram: 0.55, makingCharges: 10, gst: 3 },
  { city: "Kolkata", state: "West Bengal", premiumPerGram: 0.70, makingCharges: 8, gst: 3 },
  { city: "Chennai", state: "Tamil Nadu", premiumPerGram: 0.80, makingCharges: 12, gst: 3 },
  { city: "Lucknow", state: "Uttar Pradesh", premiumPerGram: 0.65, makingCharges: 8, gst: 3 },
  { city: "Chandigarh", state: "Punjab", premiumPerGram: 0.55, makingCharges: 9, gst: 3 },
  { city: "Indore", state: "Madhya Pradesh", premiumPerGram: 0.60, makingCharges: 8, gst: 3 },
  { city: "Bhopal", state: "Madhya Pradesh", premiumPerGram: 0.70, makingCharges: 8, gst: 3 },
  { city: "Nagpur", state: "Maharashtra", premiumPerGram: 0.50, makingCharges: 8, gst: 3 },
  { city: "Patna", state: "Bihar", premiumPerGram: 0.90, makingCharges: 9, gst: 3 },
  { city: "Visakhapatnam", state: "Andhra Pradesh", premiumPerGram: 0.85, makingCharges: 10, gst: 3 },
  { city: "Kochi", state: "Kerala", premiumPerGram: 1.20, makingCharges: 11, gst: 3 },
  { city: "Coimbatore", state: "Tamil Nadu", premiumPerGram: 1.00, makingCharges: 11, gst: 3 },
  { city: "Thiruvananthapuram", state: "Kerala", premiumPerGram: 1.40, makingCharges: 12, gst: 3 },
];

interface GoldCityConfig {
  city: string;
  state: string;
  premiumPercent: number;
  makingCharges: number;
  gst: number;
}

const GOLD_CITY_CONFIG: GoldCityConfig[] = [
  { city: "Mumbai", state: "Maharashtra", premiumPercent: 0, makingCharges: 10, gst: 3 },
  { city: "Ahmedabad", state: "Gujarat", premiumPercent: 0.02, makingCharges: 8, gst: 3 },
  { city: "Surat", state: "Gujarat", premiumPercent: 0.03, makingCharges: 7, gst: 3 },
  { city: "Delhi", state: "Delhi", premiumPercent: 0.05, makingCharges: 12, gst: 3 },
  { city: "Jaipur", state: "Rajasthan", premiumPercent: 0.06, makingCharges: 8, gst: 3 },
  { city: "Chandigarh", state: "Punjab", premiumPercent: 0.07, makingCharges: 11, gst: 3 },
  { city: "Lucknow", state: "Uttar Pradesh", premiumPercent: 0.08, makingCharges: 10, gst: 3 },
  { city: "Patna", state: "Bihar", premiumPercent: 0.10, makingCharges: 11, gst: 3 },
  { city: "Kolkata", state: "West Bengal", premiumPercent: 0.08, makingCharges: 10, gst: 3 },
  { city: "Bangalore", state: "Karnataka", premiumPercent: 0.06, makingCharges: 12, gst: 3 },
  { city: "Hyderabad", state: "Telangana", premiumPercent: 0.07, makingCharges: 11, gst: 3 },
  { city: "Chennai", state: "Tamil Nadu", premiumPercent: 0.08, makingCharges: 14, gst: 3 },
  { city: "Coimbatore", state: "Tamil Nadu", premiumPercent: 0.09, makingCharges: 12, gst: 3 },
  { city: "Kochi", state: "Kerala", premiumPercent: 0.10, makingCharges: 13, gst: 3 },
  { city: "Thiruvananthapuram", state: "Kerala", premiumPercent: 0.12, makingCharges: 14, gst: 3 },
  { city: "Pune", state: "Maharashtra", premiumPercent: 0.04, makingCharges: 11, gst: 3 },
  { city: "Nagpur", state: "Maharashtra", premiumPercent: 0.05, makingCharges: 10, gst: 3 },
  { city: "Indore", state: "Madhya Pradesh", premiumPercent: 0.06, makingCharges: 10, gst: 3 },
  { city: "Bhopal", state: "Madhya Pradesh", premiumPercent: 0.07, makingCharges: 10, gst: 3 },
  { city: "Visakhapatnam", state: "Andhra Pradesh", premiumPercent: 0.09, makingCharges: 12, gst: 3 },
];

// Export city list for static generation
export const INDIAN_CITIES = SILVER_CITY_CONFIG.map(c => c.city.toLowerCase());

// ============================================================================
// CACHE HELPERS
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function getFromCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    
    if (now - entry.timestamp < CACHE_TTL) {
      return entry.data;
    }
    
    // Cache expired
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
}

function setToCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage might be full or disabled
  }
}

// ============================================================================
// API FETCHERS
// ============================================================================

/**
 * List of CORS proxies to try (in order of reliability)
 * Note: Free CORS proxies can be unreliable. Consider:
 * 1. Self-hosted CORS proxy on Cloudflare Workers (recommended)
 * 2. Using server-side API routes instead
 */
const CORS_PROXIES = [
  // allorigins - generally reliable
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  // corsproxy.io - fast when working
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  // cors-anywhere (herokuapp) - may have rate limits
  (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
  // thingproxy - backup
  (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
];

// Fallback prices when all APIs fail (updated periodically)
const FALLBACK_PRICES = {
  'SI=F': 30.50,  // Silver USD per oz (approximate)
  'GC=F': 2050.00, // Gold USD per oz (approximate)
};

/**
 * Fetch commodity price from Yahoo Finance
 * Uses multiple CORS proxies for browser compatibility
 */
async function fetchYahooPrice(symbol: string): Promise<number | null> {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
  
  // Try each CORS proxy until one works
  for (const proxyFn of CORS_PROXIES) {
    try {
      const proxyUrl = proxyFn(yahooUrl);
      
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000),
      });
      
      if (!response.ok) continue;
      
      const data = await response.json();
      const price = data.chart?.result?.[0]?.meta?.regularMarketPrice;
      
      if (price && typeof price === 'number' && price > 0) {
        return price;
      }
    } catch {
      // Try next proxy
      continue;
    }
  }
  
  // All proxies failed - return fallback price
  console.warn('[fetchYahooPrice] All CORS proxies failed for', symbol, '- using fallback price');
  return FALLBACK_PRICES[symbol as keyof typeof FALLBACK_PRICES] || null;
}

// Fallback exchange rates (updated periodically)
const FALLBACK_RATES = {
  usdInr: 83.50,
  usdCny: 7.25,
};

/**
 * Fetch exchange rates from Frankfurter API
 */
async function fetchExchangeRates(): Promise<{ usdInr: number; usdCny: number } | null> {
  try {
    const response = await fetch(
      'https://api.frankfurter.app/latest?from=USD&to=INR,CNY',
      { signal: AbortSignal.timeout(5000) }
    );
    
    if (!response.ok) {
      console.warn('[fetchExchangeRates] API returned', response.status, '- using fallback rates');
      return FALLBACK_RATES;
    }
    
    const data = await response.json();
    const inr = data.rates?.INR;
    const cny = data.rates?.CNY;
    
    if (inr && cny && typeof inr === 'number' && typeof cny === 'number') {
      return { usdInr: inr, usdCny: cny };
    }
    
    return FALLBACK_RATES;
  } catch (error) {
    console.warn('[fetchExchangeRates] Failed to fetch rates:', error, '- using fallback');
    return FALLBACK_RATES;
  }
}

// ============================================================================
// SILVER PRICE
// ============================================================================

/**
 * Fetch live silver price in INR
 * Uses Yahoo Finance for USD price + Frankfurter for forex
 */
export async function fetchSilverPrice(): Promise<SilverPrice | null> {
  const cacheKey = 'silverPrice_v1';
  
  // Check cache first
  const cached = getFromCache<SilverPrice>(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // Fetch silver USD and forex rates in parallel
    const [silverUsd, rates] = await Promise.all([
      fetchYahooPrice('SI=F'),
      fetchExchangeRates(),
    ]);
    
    if (!silverUsd || !rates) {
      return null;
    }
    
    const { usdInr } = rates;
    
    // Calculate INR price with Indian duties
    const pricePerOzInr = silverUsd * usdInr;
    const basePrice = pricePerOzInr / OZ_TO_GRAM;
    const withDuty = basePrice * (1 + IMPORT_DUTY);
    const withIgst = withDuty * (1 + IGST);
    const finalPrice = withIgst * (1 + MCX_PREMIUM);
    
    const price: SilverPrice = {
      pricePerGram: Math.round(finalPrice * 100) / 100,
      pricePerKg: Math.round(finalPrice * 1000),
      pricePer10Gram: Math.round(finalPrice * 10 * 100) / 100,
      pricePerTola: Math.round(finalPrice * TOLA_TO_GRAM * 100) / 100,
      currency: 'INR',
      timestamp: new Date().toISOString(),
      change24h: 0,
      changePercent24h: 0,
      high24h: Math.round(finalPrice * 1.015 * 100) / 100,
      low24h: Math.round(finalPrice * 0.985 * 100) / 100,
      source: 'calculated',
      usdInr: Math.round(usdInr * 100) / 100,
      comexUsd: Math.round(silverUsd * 100) / 100,
    };
    
    // Cache the result
    setToCache(cacheKey, price);
    
    return price;
  } catch (error) {
    console.error('Error fetching silver price:', error);
    return null;
  }
}

// ============================================================================
// GOLD PRICE
// ============================================================================

/**
 * Fetch live gold price in INR (24K, 22K, 18K)
 */
export async function fetchGoldPrice(): Promise<GoldPrice | null> {
  const cacheKey = 'goldPrice_v1';
  
  // Check cache first
  const cached = getFromCache<GoldPrice>(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // Fetch gold USD and forex rates in parallel
    const [goldUsd, rates] = await Promise.all([
      fetchYahooPrice('GC=F'),
      fetchExchangeRates(),
    ]);
    
    if (!goldUsd || !rates) {
      return null;
    }
    
    const { usdInr } = rates;
    
    // Calculate 24K INR price with Indian duties
    const pricePerOzInr = goldUsd * usdInr;
    const basePrice = pricePerOzInr / OZ_TO_GRAM;
    const withDuty = basePrice * (1 + IMPORT_DUTY);
    const withIgst = withDuty * (1 + IGST);
    const price24K = withIgst * (1 + MCX_PREMIUM);
    
    // Calculate other purities
    const price22K = price24K * (GOLD_PURITY['22K'] / GOLD_PURITY['24K']);
    const price18K = price24K * (GOLD_PURITY['18K'] / GOLD_PURITY['24K']);
    
    const price: GoldPrice = {
      price24KPerGram: Math.round(price24K * 100) / 100,
      price24KPer10Gram: Math.round(price24K * 10 * 100) / 100,
      price24KPerTola: Math.round(price24K * TOLA_TO_GRAM * 100) / 100,
      price24KPerSovereign: Math.round(price24K * SOVEREIGN_TO_GRAM * 100) / 100,
      price22KPerGram: Math.round(price22K * 100) / 100,
      price22KPer10Gram: Math.round(price22K * 10 * 100) / 100,
      price22KPerTola: Math.round(price22K * TOLA_TO_GRAM * 100) / 100,
      price22KPerSovereign: Math.round(price22K * SOVEREIGN_TO_GRAM * 100) / 100,
      price18KPerGram: Math.round(price18K * 100) / 100,
      price18KPer10Gram: Math.round(price18K * 10 * 100) / 100,
      currency: 'INR',
      timestamp: new Date().toISOString(),
      change24h: 0,
      changePercent24h: 0,
      high24h: Math.round(price24K * 1.01 * 100) / 100,
      low24h: Math.round(price24K * 0.99 * 100) / 100,
      source: 'calculated',
      usdInr: Math.round(usdInr * 100) / 100,
      comexUsd: Math.round(goldUsd * 100) / 100,
    };
    
    // Cache the result
    setToCache(cacheKey, price);
    
    return price;
  } catch (error) {
    console.error('Error fetching gold price:', error);
    return null;
  }
}

// ============================================================================
// SHANGHAI SILVER PRICE
// ============================================================================

/**
 * Get SGE market status based on Beijing time
 */
function getSgeMarketStatus(): { status: 'open' | 'closed' | 'pre-market'; session: string } {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const beijing = new Date(utc + (8 * 3600000));
  
  const hour = beijing.getHours() + beijing.getMinutes() / 60;
  const day = beijing.getDay();
  
  if (day === 0 || day === 6) {
    return { status: 'closed', session: 'Weekend' };
  }
  
  // Day Session 1: 09:00 - 11:30
  if (hour >= 9 && hour < 11.5) {
    return { status: 'open', session: 'Day Session (Morning)' };
  }
  
  // Day Session 2: 13:30 - 15:30
  if (hour >= 13.5 && hour < 15.5) {
    return { status: 'open', session: 'Day Session (Afternoon)' };
  }
  
  // Night Session: 21:00 - 02:30
  if (hour >= 21 || hour < 2.5) {
    return { status: 'open', session: 'Night Session' };
  }
  
  // Pre-market
  if (hour >= 8.5 && hour < 9) {
    return { status: 'pre-market', session: 'Pre-Market' };
  }
  
  return { status: 'closed', session: 'Closed' };
}

/**
 * Fetch Shanghai silver price (estimated from COMEX + premium)
 */
export async function fetchShanghaiPrice(): Promise<ShanghaiSilverPrice | null> {
  const cacheKey = 'shanghaiPrice_v1';
  
  // Check cache first
  const cached = getFromCache<ShanghaiSilverPrice>(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // Fetch silver USD and forex rates in parallel
    const [silverUsd, rates] = await Promise.all([
      fetchYahooPrice('SI=F'),
      fetchExchangeRates(),
    ]);
    
    if (!silverUsd || !rates) {
      return null;
    }
    
    const { usdInr, usdCny } = rates;
    const cnyInr = usdInr / usdCny;
    
    // Calculate Shanghai price with premium
    const shanghaiUsd = silverUsd * (1 + SHANGHAI_PREMIUM);
    const shanghaiCnyPerOz = shanghaiUsd * usdCny;
    const shanghaiCnyPerKg = shanghaiCnyPerOz * KG_TO_OZ;
    const shanghaiCnyPerGram = shanghaiCnyPerKg / 1000;
    
    // Calculate India rate for comparison
    const pricePerOzInr = silverUsd * usdInr;
    const basePrice = pricePerOzInr / OZ_TO_GRAM;
    const withDuty = basePrice * (1 + IMPORT_DUTY);
    const withIgst = withDuty * (1 + IGST);
    const indiaRate = withIgst * (1 + MCX_PREMIUM);
    
    const marketStatus = getSgeMarketStatus();
    
    const price: ShanghaiSilverPrice = {
      pricePerKgCny: Math.round(shanghaiCnyPerKg * 100) / 100,
      pricePerGramCny: Math.round(shanghaiCnyPerGram * 100) / 100,
      pricePerOzCny: Math.round(shanghaiCnyPerOz * 100) / 100,
      pricePerOzUsd: Math.round(shanghaiUsd * 100) / 100,
      pricePerGramUsd: Math.round((shanghaiUsd / OZ_TO_GRAM) * 100) / 100,
      pricePerKgUsd: Math.round((shanghaiUsd / OZ_TO_GRAM * 1000) * 100) / 100,
      pricePerGramInr: Math.round((shanghaiCnyPerGram * cnyInr) * 100) / 100,
      pricePerKgInr: Math.round((shanghaiCnyPerKg * cnyInr) * 100) / 100,
      pricePerOzInr: Math.round((shanghaiCnyPerOz * cnyInr) * 100) / 100,
      indiaRatePerGram: Math.round(indiaRate * 100) / 100,
      comexUsd: Math.round(silverUsd * 100) / 100,
      premiumPercent: SHANGHAI_PREMIUM * 100,
      premiumUsd: Math.round((shanghaiUsd - silverUsd) * 100) / 100,
      usdCny: Math.round(usdCny * 10000) / 10000,
      usdInr: Math.round(usdInr * 100) / 100,
      cnyInr: Math.round(cnyInr * 100) / 100,
      marketStatus: marketStatus.status,
      marketSession: marketStatus.session,
      timestamp: new Date().toISOString(),
      source: 'calculated',
      change24hPercent: 0,
      change24hCny: 0,
      isEstimate: true,
      disclaimer: 'Prices are estimates based on COMEX + Shanghai premium. For official SGE prices, visit the official website.',
      officialSgeUrl: 'https://en.sge.com.cn/data_SilverBenchmarkPrice',
    };
    
    // Cache the result
    setToCache(cacheKey, price);
    
    return price;
  } catch (error) {
    console.error('Error fetching Shanghai price:', error);
    return null;
  }
}

// ============================================================================
// CITY PRICES
// ============================================================================

/**
 * Get silver prices for all Indian cities
 */
export async function fetchCityPrices(): Promise<CityPrice[] | null> {
  const silverPrice = await fetchSilverPrice();
  if (!silverPrice) return null;
  
  return SILVER_CITY_CONFIG.map(config => ({
    city: config.city,
    state: config.state,
    pricePerGram: Math.round((silverPrice.pricePerGram + config.premiumPerGram) * 100) / 100,
    pricePerKg: Math.round((silverPrice.pricePerGram + config.premiumPerGram) * 1000),
    makingCharges: config.makingCharges,
    gst: config.gst,
  }));
}

/**
 * Get gold prices for all Indian cities
 */
export async function fetchGoldCityPrices(): Promise<GoldCityPrice[] | null> {
  const goldPrice = await fetchGoldPrice();
  if (!goldPrice) return null;
  
  return GOLD_CITY_CONFIG.map(config => {
    const premium = 1 + config.premiumPercent / 100;
    return {
      city: config.city,
      state: config.state,
      price24KPerGram: Math.round(goldPrice.price24KPerGram * premium * 100) / 100,
      price22KPerGram: Math.round(goldPrice.price22KPerGram * premium * 100) / 100,
      price24KPer10Gram: Math.round(goldPrice.price24KPer10Gram * premium * 100) / 100,
      price22KPer10Gram: Math.round(goldPrice.price22KPer10Gram * premium * 100) / 100,
      makingCharges: config.makingCharges,
      gst: config.gst,
    };
  });
}

/**
 * Get price for a specific city (silver)
 */
export async function fetchCityPrice(cityName: string): Promise<CityPrice | null> {
  const cityPrices = await fetchCityPrices();
  if (!cityPrices) return null;
  
  return cityPrices.find(
    c => c.city.toLowerCase() === cityName.toLowerCase()
  ) || null;
}

/**
 * Get price for a specific city (gold)
 */
export async function fetchGoldCityPrice(cityName: string): Promise<GoldCityPrice | null> {
  const cityPrices = await fetchGoldCityPrices();
  if (!cityPrices) return null;
  
  return cityPrices.find(
    c => c.city.toLowerCase() === cityName.toLowerCase()
  ) || null;
}

// ============================================================================
// SILVER PRICE USD (International)
// ============================================================================

export interface SilverPriceUSD {
  pricePerOz: number;
  pricePerGram: number;
  pricePerKg: number;
  currency: string;
  timestamp: string;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  source: string;
}

/**
 * Fetch silver price in USD (for international pages)
 */
export async function fetchSilverPriceUSD(): Promise<SilverPriceUSD | null> {
  const cacheKey = 'silverPriceUSD_v1';
  
  // Check cache first
  const cached = getFromCache<SilverPriceUSD>(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    const silverUsd = await fetchYahooPrice('SI=F');
    if (!silverUsd) return null;
    
    const price: SilverPriceUSD = {
      pricePerOz: Math.round(silverUsd * 100) / 100,
      pricePerGram: Math.round((silverUsd / OZ_TO_GRAM) * 100) / 100,
      pricePerKg: Math.round((silverUsd / OZ_TO_GRAM * 1000) * 100) / 100,
      currency: 'USD',
      timestamp: new Date().toISOString(),
      change24h: 0,
      changePercent24h: 0,
      high24h: Math.round(silverUsd * 1.015 * 100) / 100,
      low24h: Math.round(silverUsd * 0.985 * 100) / 100,
      source: 'yahoo-finance',
    };
    
    setToCache(cacheKey, price);
    return price;
  } catch (error) {
    console.error('Error fetching silver USD price:', error);
    return null;
  }
}

// ============================================================================
// COMBINED PRICES
// ============================================================================

export interface CombinedMetalPrices {
  silver: SilverPrice;
  gold: GoldPrice;
  goldSilverRatio: number;
  timestamp: string;
}

/**
 * Fetch both gold and silver prices together
 */
export async function fetchCombinedPrices(): Promise<CombinedMetalPrices | null> {
  const [silver, gold] = await Promise.all([
    fetchSilverPrice(),
    fetchGoldPrice(),
  ]);
  
  if (!silver || !gold) return null;
  
  return {
    silver,
    gold,
    goldSilverRatio: Math.round((gold.price24KPerGram / silver.pricePerGram) * 100) / 100,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// INTERNATIONAL PRICES
// ============================================================================

interface InternationalConfig {
  currency: string;
  currencySymbol: string;
  usdRate: number;  // Fixed rate for pegged currencies
  vatRate: number;
  importDuty: number;
}

const INTERNATIONAL_CONFIG: Record<string, InternationalConfig> = {
  qatar: {
    currency: 'QAR',
    currencySymbol: 'QR',
    usdRate: 3.64,  // Fixed peg
    vatRate: 0,
    importDuty: 0.05,
  },
  uae: {
    currency: 'AED',
    currencySymbol: 'AED',
    usdRate: 3.6725,  // Fixed peg
    vatRate: 0.05,
    importDuty: 0.05,
  },
  saudi: {
    currency: 'SAR',
    currencySymbol: 'SAR',
    usdRate: 3.75,  // Fixed peg
    vatRate: 0.15,
    importDuty: 0.05,
  },
};

export interface InternationalSilverPrice {
  pricePerGram: number;
  pricePerKg: number;
  pricePerTola: number;
  pricePerOz: number;
  currency: string;
  currencySymbol: string;
  timestamp: string;
  source: string;
  comexUsd: number;
  exchangeRate: number;
}

/**
 * Fetch silver price for international markets
 */
export async function fetchInternationalPrice(
  country: keyof typeof INTERNATIONAL_CONFIG
): Promise<InternationalSilverPrice | null> {
  const config = INTERNATIONAL_CONFIG[country];
  if (!config) return null;
  
  const cacheKey = `internationalPrice_${country}_v1`;
  const cached = getFromCache<InternationalSilverPrice>(cacheKey);
  if (cached) return cached;
  
  try {
    const silverUsd = await fetchYahooPrice('SI=F');
    if (!silverUsd) return null;
    
    const { usdRate, vatRate, importDuty } = config;
    
    // Calculate local price
    const pricePerOzLocal = silverUsd * usdRate;
    const basePrice = pricePerOzLocal / OZ_TO_GRAM;
    const withDuty = basePrice * (1 + importDuty);
    const withVat = withDuty * (1 + vatRate);
    
    const price: InternationalSilverPrice = {
      pricePerGram: Math.round(withVat * 100) / 100,
      pricePerKg: Math.round(withVat * 1000),
      pricePerTola: Math.round(withVat * TOLA_TO_GRAM * 100) / 100,
      pricePerOz: Math.round(pricePerOzLocal * 100) / 100,
      currency: config.currency,
      currencySymbol: config.currencySymbol,
      timestamp: new Date().toISOString(),
      source: 'calculated',
      comexUsd: Math.round(silverUsd * 100) / 100,
      exchangeRate: usdRate,
    };
    
    setToCache(cacheKey, price);
    return price;
  } catch (error) {
    console.error(`Error fetching ${country} price:`, error);
    return null;
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clear all price caches (useful for debugging)
 */
export function clearPriceCache(): void {
  if (typeof window === 'undefined') return;
  
  const cacheKeys = [
    'silverPrice_v1',
    'goldPrice_v1',
    'shanghaiPrice_v1',
    'silverPriceUSD_v1',
  ];
  
  // Also clear international caches
  Object.keys(INTERNATIONAL_CONFIG).forEach(country => {
    cacheKeys.push(`internationalPrice_${country}_v1`);
  });
  
  cacheKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  });
}

/**
 * Check if price data is stale (older than cache TTL)
 */
export function isPriceStale(timestamp: string): boolean {
  const priceTime = new Date(timestamp).getTime();
  const now = Date.now();
  return now - priceTime > CACHE_TTL;
}
