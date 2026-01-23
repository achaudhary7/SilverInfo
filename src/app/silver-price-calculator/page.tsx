import type { Metadata } from "next";
import Link from "next/link";
import { getSilverPriceWithChange } from "@/lib/metalApi";
import Calculator from "@/components/Calculator";
import FAQ from "@/components/FAQ";
import { generateFAQSchema, generateBreadcrumbSchema, type FAQItem } from "@/lib/schema";
import { LiveRateCard } from "@/components/price";

export const revalidate = 600;

// Page last updated date
const LAST_UPDATED = "2026-01-23";

export const metadata: Metadata = {
  title: "Silver Price Calculator - Calculate Silver Value in INR",
  description:
    "Free silver price calculator for India. Calculate silver value based on weight, purity (999, 925, 800), making charges, and GST. Convert grams to tola and get instant results.",
  keywords: [
    "silver price calculator",
    "silver calculator india",
    "925 silver price calculator",
    "silver weight calculator",
    "silver making charges calculator",
    "tola to gram converter",
  ],
  alternates: {
    canonical: "/silver-price-calculator",
  },
};

const faqItems: FAQItem[] = [
  {
    question: "How do I calculate silver price in India?",
    answer:
      "To calculate silver price: 1) Enter the weight in grams. 2) Select the purity (999 for pure, 925 for sterling). 3) Add making charges percentage if buying jewelry. 4) The calculator will show the base value + GST (3%) automatically.",
  },
  {
    question: "What are typical making charges for silver jewelry?",
    answer:
      "Making charges for silver jewelry in India typically range from 6-15% depending on the complexity of the design, city, and jeweler. Simple items like coins have 0-3% charges, while intricate jewelry can have 10-15% or higher.",
  },
  {
    question: "How many grams are in 1 tola of silver?",
    answer:
      "1 Tola = 11.6638 grams. This is the traditional Indian unit for measuring precious metals. Our calculator supports automatic conversion between grams, tola, kilograms, and troy ounces.",
  },
  {
    question: "Is GST applicable on silver in India?",
    answer:
      "Yes, GST of 3% is applicable on silver purchases in India. This includes silver jewelry, coins, and bars. The GST is calculated on the total value (silver + making charges).",
  },
  {
    question: "What is the difference between 999 and 925 silver price?",
    answer:
      "999 silver (pure silver) is priced at 99.9% of the base rate, while 925 silver (sterling) is 92.5% of the base rate. For example, if pure silver is ₹100/gram, 999 silver = ₹99.90 and 925 silver = ₹92.50 per gram.",
  },
];

export default async function SilverCalculatorPage() {
  const price = await getSilverPriceWithChange();
  const faqSchema = generateFAQSchema(faqItems);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://silverinfo.in" },
    { name: "Silver Calculator", url: "https://silverinfo.in/silver-price-calculator" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Silver Price Calculator",
            url: "https://silverinfo.in/silver-price-calculator",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "INR",
            },
            description:
              "Calculate silver price based on weight, purity, making charges, and GST. Free online silver calculator for India.",
            featureList: [
              "Calculate silver value by weight",
              "Support for 999, 925, 900, 800 purity levels",
              "Making charges calculation",
              "GST (3%) auto-calculation",
              "Unit conversion (gram, tola, kg, troy ounce)"
            ]
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Calculate Silver Price in India",
            description: "Step-by-step guide to calculate the exact cost of silver jewelry or investment.",
            totalTime: "PT1M",
            step: [
              {
                "@type": "HowToStep",
                position: 1,
                name: "Enter Weight",
                text: "Input the silver weight in grams, tola, or kilograms"
              },
              {
                "@type": "HowToStep",
                position: 2,
                name: "Select Purity",
                text: "Choose the silver purity - 999 (pure), 925 (sterling), 900 (coin), or 800"
              },
              {
                "@type": "HowToStep",
                position: 3,
                name: "Add Making Charges",
                text: "Enter making charges percentage if buying jewelry (typically 6-15%)"
              },
              {
                "@type": "HowToStep",
                position: 4,
                name: "View Total with GST",
                text: "See the complete breakdown including silver value, making charges, and 3% GST"
              }
            ]
          }),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-[#1e3a5f]">
                Home
              </a>
              <span>/</span>
              <span>Silver Calculator</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Silver Price Calculator
            </h1>
            <p className="text-gray-600">
              Calculate exact silver price based on weight, purity, and making
              charges
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Last updated: {new Date(LAST_UPDATED).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calculator - Full Width on Mobile, 2 columns on Desktop */}
              <div className="lg:col-span-2">
                <Calculator currentPrice={price.pricePerGram} />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Current Price Reference with Live Indicator */}
                <LiveRateCard price={price} showLink={false} />

                {/* Quick Conversion Table */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Conversions
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">1 Tola</span>
                      <span className="font-medium">11.6638 grams</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">1 Troy Ounce</span>
                      <span className="font-medium">31.1035 grams</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">1 Kg</span>
                      <span className="font-medium">1000 grams</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">1 Kg</span>
                      <span className="font-medium">85.735 tola</span>
                    </div>
                  </div>
                </div>

                {/* Purity Guide */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Silver Purity Guide
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">
                        999 - Pure Silver
                      </div>
                      <p className="text-xs text-gray-500">
                        99.9% pure, used for coins & bars
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">
                        925 - Sterling Silver
                      </div>
                      <p className="text-xs text-gray-500">
                        92.5% pure, ideal for jewelry
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">
                        900 - Coin Silver
                      </div>
                      <p className="text-xs text-gray-500">
                        90% pure, used in some coins
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">
                        800 - European Silver
                      </div>
                      <p className="text-xs text-gray-500">
                        80% pure, antique items
                      </p>
                    </div>
                  </div>
                </div>

                {/* Other Tools */}
                <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    More Tools
                  </h3>
                  <Link
                    href="/investment-calculator"
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors group"
                  >
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-[#1e3a5f]">
                        📈 Investment Calculator
                      </div>
                      <p className="text-xs text-gray-500">
                        Calculate profit/loss on your silver
                      </p>
                    </div>
                    <span className="text-gray-400 group-hover:text-[#1e3a5f]">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8">
              <FAQ
                items={faqItems}
                title="Calculator FAQ"
                description="Common questions about calculating silver prices"
              />
            </div>

            {/* SEO Content */}
            <div className="mt-12 prose prose-gray max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How to Use the Silver Price Calculator
              </h2>
              <p className="text-gray-600 mb-4">
                Our silver price calculator helps you determine the exact cost
                of silver jewelry or investment purchases in India. Simply enter
                the weight, select the purity level, and add any applicable
                making charges to get an accurate price estimate including GST.
              </p>
              <p className="text-gray-600 mb-4">
                The base price is calculated from international spot prices (COMEX) and 
                USD/INR exchange rates.{" "}
                <Link href="/how-we-calculate" className="text-[#1e3a5f] underline hover:no-underline">
                  Learn how we calculate silver prices →
                </Link>
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                Understanding Making Charges
              </h3>
              <p className="text-gray-600 mb-4">
                Making charges are the labor costs charged by jewelers for
                crafting silver into jewelry. These charges vary based on:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>Complexity of the design</li>
                <li>City and jeweler reputation</li>
                <li>Type of jewelry (simple vs intricate)</li>
                <li>Handmade vs machine-made items</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                GST on Silver in India
              </h3>
              <p className="text-gray-600">
                As per current tax regulations, GST of 3% is applicable on
                silver purchases in India. This applies to the total value
                including the silver metal value and making charges. Our
                calculator automatically factors in GST to give you the final
                payable amount.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
