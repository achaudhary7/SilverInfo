# SilverInfo.in - Live Silver Price Tracker for India

<p align="center">
  <img src="public/icon-512.png" alt="SilverInfo Logo" width="120" height="120">
</p>

<p align="center">
  <strong>Real-time silver prices, investment calculators, and market insights for Indian investors</strong>
</p>

<p align="center">
  <a href="https://silverinfo.in">Live Site</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## 📊 Overview

SilverInfo.in is a comprehensive silver price tracking and investment analysis platform designed specifically for the Indian market. It provides real-time silver prices, historical data, city-wise rates, and professional-grade investment calculators.

### Key Highlights

- **Live Silver Prices** - Real-time rates updated every 30 seconds
- **20+ City Rates** - Localized prices for major Indian cities
- **5 Financial Calculators** - Investment, tax, inflation, break-even tools
- **SEO Optimized** - 95/100 Google 2026 readiness score
- **Mobile First** - Fully responsive across all devices
- **YMYL Compliant** - Finance-grade accuracy and transparency

---

## 🚀 Features

### Price Tracking

| Feature | Description |
|---------|-------------|
| **Live Prices** | Real-time silver rates in INR per gram/kg |
| **24h Change** | Price change tracking with visual indicators |
| **Historical Charts** | 7-day and 30-day price trend visualization |
| **City-wise Rates** | Prices for 20+ major Indian cities |
| **Market Status** | MCX trading hours and market state |

### Investment Calculators

| Calculator | Purpose |
|------------|---------|
| **Silver Price Calculator** | Calculate value based on weight and purity |
| **Investment Calculator** | Track ROI with CAGR calculations |
| **Capital Gains Tax Calculator** | STCG/LTCG tax estimation for India |
| **Inflation-Adjusted Calculator** | Real returns after inflation |
| **Break-Even Calculator** | Calculate break-even selling price |

### Content & Education

- **Learn Section** - Educational guides on silver purity, hallmarks, investing
- **Updates Section** - Market analysis, forecasts, and news
- **How We Calculate** - Transparent methodology documentation

---

## 🛠 Tech Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.4 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |

### Styling & UI

| Technology | Purpose |
|------------|---------|
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Custom CSS** | Prose styling, animations, theming |

### Data Visualization

| Technology | Purpose |
|------------|---------|
| **Recharts** | 3.7.0 | Interactive price charts |

### Content Management

| Technology | Purpose |
|------------|---------|
| **Markdown** | Content authoring for learn/updates |
| **gray-matter** | Frontmatter parsing |
| **remark** | Markdown processing |
| **remark-gfm** | GitHub Flavored Markdown support |

### Analytics & Monitoring

| Technology | Purpose |
|------------|---------|
| **Vercel Analytics** | Traffic and usage analytics |
| **Vercel Speed Insights** | Core Web Vitals monitoring |
| **Google Analytics 4** | User behavior tracking |

### Image Processing

| Technology | Purpose |
|------------|---------|
| **sharp** | Image optimization |
| **Next.js Image** | Automatic image optimization |

---

## 📁 Project Structure

```
silverinfo/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── price/         # Live price endpoint
│   │   │   └── cron/          # Scheduled jobs
│   │   ├── city/[city]/       # Dynamic city pages
│   │   ├── learn/[slug]/      # Educational articles
│   │   ├── updates/[slug]/    # News and updates
│   │   ├── silver-price-calculator/
│   │   ├── investment-calculator/
│   │   ├── capital-gains-tax-calculator/
│   │   ├── inflation-adjusted-calculator/
│   │   ├── break-even-calculator/
│   │   └── ...                # Other pages
│   │
│   ├── components/            # React components
│   │   ├── price/            # Price display components
│   │   ├── Calculator.tsx    # Silver calculator
│   │   ├── InvestmentCalculator.tsx
│   │   ├── CapitalGainsTaxCalculator.tsx
│   │   ├── InflationAdjustedCalculator.tsx
│   │   ├── BreakEvenCalculator.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LivePriceCard.tsx
│   │   └── ...
│   │
│   ├── content/              # Markdown content
│   │   ├── learn/           # Educational articles
│   │   └── updates/         # News posts
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useLivePrice.ts  # Live price polling
│   │
│   └── lib/                 # Utility libraries
│       ├── metalApi.ts      # Price fetching logic
│       ├── priceStorage.ts  # Local JSON storage
│       ├── calculatorConfig.ts # Calculator constants
│       ├── markdown.ts      # Markdown utilities
│       └── schema.ts        # JSON-LD schemas
│
├── data/
│   └── daily-prices.json    # Historical price storage
│
├── public/                  # Static assets
│   ├── images/             # Article images
│   ├── manifest.json       # PWA manifest
│   └── robots.txt          # SEO robots file
│
├── vercel.json             # Vercel configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json            # Dependencies
```

---

## 🔌 API Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Price Data Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Yahoo Finance (SI=F) ──┐                                   │
│                         ├──► calculateIndianSilverPrice()   │
│  Frankfurter (USD/INR) ─┘            │                      │
│                                      ▼                      │
│                         ┌────────────────────┐              │
│                         │ Apply Indian Rates │              │
│                         │ • Import Duty 12.5%│              │
│                         │ • IGST 3%          │              │
│                         │ • MCX Premium      │              │
│                         └────────────────────┘              │
│                                      │                      │
│                                      ▼                      │
│  ┌──────────────┐           ┌───────────────┐              │
│  │ daily-prices │◄──────────│ Cron Job      │              │
│  │    .json     │  (daily)  │ 11:45 PM IST  │              │
│  └──────────────┘           └───────────────┘              │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────────────────────────────────┐              │
│  │           /api/price                      │              │
│  │  Returns: pricePerGram, pricePerKg,      │              │
│  │           change24h, changePercent24h    │              │
│  └──────────────────────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/price` | GET | Live silver price with 24h change |
| `/api/cron/save-daily-price` | GET/POST | Save daily closing price (cron) |

### Price Sources (Priority Order)

1. **Yahoo Finance + Frankfurter** (Primary, FREE, Unlimited)
2. **MetalpriceAPI** (Backup, 100 req/month free)
3. **GoldAPI.io** (Backup, 300 req/month free)
4. **Simulated Price** (Fallback, always works)

---

## 🏃 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/achaudhary7/SilverInfo.git
cd SilverInfo

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables (Optional)

Create a `.env.local` file:

```env
# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Backup APIs (Optional)
METALPRICEAPI_KEY=your_key
GOLDAPI_KEY=your_key

# Cron Security (Optional)
CRON_SECRET=your_secret
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🚀 Deployment

### Vercel (Recommended)

The project is optimized for Vercel deployment:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Configure Domain**
   - Add your domain in Vercel Settings
   - Update DNS records at your registrar

### Vercel Features Used

- **ISR (Incremental Static Regeneration)** - 10-minute revalidation
- **Edge Functions** - Global CDN distribution
- **Cron Jobs** - Daily price saving at 11:45 PM IST
- **Analytics** - Built-in performance monitoring

### Build Output

```
Route (app)                              Revalidate
┌ ○ /                                    10m
├ ○ /silver-rate-today                   10m
├ ● /city/[city]                         10m (20 cities)
├ ○ /silver-price-calculator             10m
├ ○ /investment-calculator               10m
├ ○ /capital-gains-tax-calculator        10m
├ ● /learn/[slug]                        10m (4 articles)
├ ● /updates/[slug]                      10m (3 posts)
└ ƒ /api/price                           dynamic
```

---

## 📱 Mobile Optimization

The site is fully optimized for mobile devices:

- **Responsive Design** - Adapts to all screen sizes (320px to 4K)
- **Touch Targets** - Minimum 44px touch targets
- **Mobile Navigation** - Slide-in menu with backdrop
- **Bottom Navigation** - Sticky mobile nav bar
- **iOS Safe Areas** - Respects notch and home indicator
- **Prevent Zoom** - 16px minimum font size on inputs

---

## 🔍 SEO Features

### Technical SEO

- **Server-Side Rendering** - Full HTML for crawlers
- **Canonical URLs** - Prevent duplicate content
- **Sitemap.xml** - Auto-generated with lastmod
- **Robots.txt** - Proper crawl directives
- **Security Headers** - CSP, X-Frame-Options, etc.

### Structured Data (JSON-LD)

- Organization schema
- Website schema
- WebApplication schema
- Product schema (calculators)
- Article schema (learn/updates)
- BreadcrumbList schema
- FAQPage schema
- LocalBusiness schema (city pages)

### Core Web Vitals

| Metric | Target | Status |
|--------|--------|--------|
| LCP | < 2.5s | ✅ Optimized |
| FID/INP | < 200ms | ✅ Optimized |
| CLS | < 0.1 | ✅ Fixed |

---

## 💰 Calculator Configuration

Financial constants are centralized in `src/lib/calculatorConfig.ts`:

```typescript
// Tax Rates (FY 2025-26)
STCG_RATE: 30,           // Short-term < 3 years
LTCG_RATE: 12.5,         // Long-term ≥ 3 years (with indexation)
SURCHARGE_THRESHOLD: 5000000,

// GST Rates
GST_ON_MAKING_CHARGES: 3,  // 3% GST on making charges
MAKING_CHARGES_PERCENT: 10, // Default 10% making charges

// Investment Defaults
DEFAULT_INFLATION_RATE: 5.5,
MAX_ANNUALIZED_RETURN: 99999,
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 📞 Contact

- **Website**: [silverinfo.in](https://silverinfo.in)
- **Email**: contact@silverinfo.in

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Recharts](https://recharts.org) - Charts
- [Vercel](https://vercel.com) - Hosting
- [Yahoo Finance](https://finance.yahoo.com) - Price data
- [Frankfurter](https://frankfurter.app) - Exchange rates
