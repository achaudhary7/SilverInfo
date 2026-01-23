import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSilverPriceWithChange, INDIAN_CITIES, formatIndianPrice, calculateSilverPrice } from "@/lib/metalApi";
import LivePriceCard from "@/components/LivePriceCard";
import Calculator from "@/components/Calculator";
import FAQ from "@/components/FAQ";
import WhyPriceChanged from "@/components/WhyPriceChanged";
import { generateFAQSchema, type FAQItem } from "@/lib/schema";

// Generate static paths for all cities
export async function generateStaticParams() {
  return INDIAN_CITIES.map((city) => ({
    city: city.city.toLowerCase(),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityData = INDIAN_CITIES.find(
    (c) => c.city.toLowerCase() === city.toLowerCase()
  );

  if (!cityData) {
    return { title: "City Not Found" };
  }

  return {
    title: `Silver Rate Today in ${cityData.city} - Live Price per Gram`,
    description: `Check indicative silver rate today in ${cityData.city}, ${cityData.state}. Get silver price per gram with making charges (${cityData.makingCharges}%) and GST. Calculated from COMEX, auto-refreshes every 30 seconds.`,
    keywords: [
      `silver rate today in ${cityData.city.toLowerCase()}`,
      `${cityData.city.toLowerCase()} silver price`,
      `silver price in ${cityData.city.toLowerCase()}`,
      `today silver rate ${cityData.city.toLowerCase()}`,
    ],
    alternates: {
      canonical: `/city/${city}`,
    },
  };
}

export const revalidate = 600;

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityData = INDIAN_CITIES.find(
    (c) => c.city.toLowerCase() === city.toLowerCase()
  );

  if (!cityData) {
    notFound();
  }

  const price = await getSilverPriceWithChange();

  // Update city prices with current rate
  const cityPrice = {
    ...cityData,
    pricePerGram: price.pricePerGram,
    pricePerKg: price.pricePerKg,
  };

  // Calculate jewelry price with making charges
  const jewelryPrice = calculateSilverPrice(
    10, // 10 grams
    999,
    price.pricePerGram,
    cityData.makingCharges,
    true
  );

  // City-specific FAQ
  const faqItems: FAQItem[] = [
    {
      question: `What is the silver rate today in ${cityData.city}?`,
      answer: `Today's silver rate in ${cityData.city} is ₹${price.pricePerGram.toFixed(
        2
      )} per gram for pure silver (999). This indicative rate is calculated from COMEX and auto-refreshes every 30 seconds. Actual retail prices may vary.`,
    },
    {
      question: `What are the typical making charges for silver jewelry in ${cityData.city}?`,
      answer: `Making charges for silver jewelry in ${cityData.city} typically range from ${
        cityData.makingCharges - 2
      }% to ${
        cityData.makingCharges + 5
      }%. The average is around ${
        cityData.makingCharges
      }%. Intricate designs and handcrafted pieces may have higher charges.`,
    },
    {
      question: `How do ${cityData.city} silver prices compare to other cities?`,
      answer: `Silver base prices are similar across India as they follow international rates. However, ${cityData.city}'s final jewelry prices may vary due to local making charges (${cityData.makingCharges}%), transportation costs, and jeweler margins. Metro cities often have competitive rates due to higher competition.`,
    },
    {
      question: `Where can I buy genuine silver in ${cityData.city}?`,
      answer: `You can buy genuine silver in ${cityData.city} from BIS hallmarked jewelers, branded showrooms, and authorized dealers. Always check for the 925 or 999 hallmark and ask for a proper invoice with GST. Reputed jewelers in ${cityData.state} are registered with the Bureau of Indian Standards.`,
    },
  ];

  const faqSchema = generateFAQSchema(faqItems);

  // LocalBusiness schema for city page
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Silver Price in ${cityData.city}`,
    description: `Live silver prices and rates in ${cityData.city}, ${cityData.state}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: cityData.city,
      addressRegion: cityData.state,
      addressCountry: "IN",
    },
    priceRange: `₹${price.pricePerGram.toFixed(2)}/gram`,
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://silverinfo.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Silver Rate Today",
        item: "https://silverinfo.in/silver-rate-today",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${cityData.city} Silver Rate`,
        item: `https://silverinfo.in/city/${city}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-[#1e3a5f]">
                Home
              </Link>
              <span>/</span>
              <Link href="/silver-rate-today#cities" className="hover:text-[#1e3a5f]">
                Cities
              </Link>
              <span>/</span>
              <span>{cityData.city}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Silver Rate Today in {cityData.city}
            </h1>
            <p className="text-gray-600">
              Live silver price per gram in {cityData.city}, {cityData.state} with
              making charges and GST
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Live Price Card */}
                <LivePriceCard initialPrice={price} pollInterval={30000} />

                {/* City-specific Price Table */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Silver Price in {cityData.city} - All Units
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 font-medium text-gray-600">
                            Unit
                          </th>
                          <th className="text-right py-3 font-medium text-gray-600">
                            Pure Silver (999)
                          </th>
                          <th className="text-right py-3 font-medium text-gray-600">
                            Sterling (925)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 text-gray-900">1 Gram</td>
                          <td className="py-3 text-right font-medium">
                            {formatIndianPrice(cityPrice.pricePerGram)}
                          </td>
                          <td className="py-3 text-right">
                            {formatIndianPrice(cityPrice.pricePerGram * 0.925)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 text-gray-900">10 Gram</td>
                          <td className="py-3 text-right font-medium">
                            {formatIndianPrice(cityPrice.pricePerGram * 10)}
                          </td>
                          <td className="py-3 text-right">
                            {formatIndianPrice(cityPrice.pricePerGram * 10 * 0.925)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 text-gray-900">100 Gram</td>
                          <td className="py-3 text-right font-medium">
                            {formatIndianPrice(cityPrice.pricePerGram * 100)}
                          </td>
                          <td className="py-3 text-right">
                            {formatIndianPrice(cityPrice.pricePerGram * 100 * 0.925)}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 text-gray-900">1 Kg</td>
                          <td className="py-3 text-right font-medium">
                            {formatIndianPrice(cityPrice.pricePerKg)}
                          </td>
                          <td className="py-3 text-right">
                            {formatIndianPrice(cityPrice.pricePerKg * 0.925)}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-900">1 Tola</td>
                          <td className="py-3 text-right font-medium">
                            {formatIndianPrice(cityPrice.pricePerGram * 11.6638)}
                          </td>
                          <td className="py-3 text-right">
                            {formatIndianPrice(
                              cityPrice.pricePerGram * 11.6638 * 0.925
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Jewelry Cost Example */}
                <div className="card p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Sample Jewelry Cost in {cityData.city}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Example calculation for 10 grams of 999 silver jewelry with
                    average making charges in {cityData.city}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Silver Value (10g × ₹{price.pricePerGram.toFixed(2)})</span>
                      <span className="font-medium">{formatIndianPrice(jewelryPrice.metalValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Making Charges ({cityData.makingCharges}%)</span>
                      <span className="font-medium">{formatIndianPrice(jewelryPrice.makingCharges)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (3%)</span>
                      <span className="font-medium">{formatIndianPrice(jewelryPrice.gst)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Total Cost</span>
                      <span className="font-bold text-[#1e3a5f] text-xl">
                        {formatIndianPrice(jewelryPrice.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <FAQ items={faqItems} />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Why Price Changed Today */}
                <WhyPriceChanged />
                
                {/* City Info Card */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {cityData.city} Silver Market Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">City</span>
                      <span className="font-medium">{cityData.city}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">State</span>
                      <span className="font-medium">{cityData.state}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Avg. Making Charges</span>
                      <span className="font-medium">{cityData.makingCharges}%</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">GST Rate</span>
                      <span className="font-medium">3%</span>
                    </div>
                  </div>
                </div>

                {/* Quick Calculator */}
                <Calculator currentPrice={price.pricePerGram} compact />

                {/* Other Cities */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Other Cities
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {INDIAN_CITIES.filter((c) => c.city !== cityData.city)
                      .slice(0, 8)
                      .map((otherCity) => (
                        <Link
                          key={otherCity.city}
                          href={`/city/${otherCity.city.toLowerCase()}`}
                          className="text-sm text-gray-600 hover:text-[#1e3a5f] py-1"
                        >
                          {otherCity.city}
                        </Link>
                      ))}
                  </div>
                  <Link
                    href="/silver-rate-today#cities"
                    className="block text-sm font-medium text-[#1e3a5f] mt-4 hover:underline"
                  >
                    View All Cities →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-gray max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About Silver Prices in {cityData.city}
              </h2>
              <p className="text-gray-600 mb-4">
                {cityData.city} is one of India&apos;s major markets for silver jewelry and
                artifacts. The city&apos;s silver prices follow international spot rates,
                with additional costs for making charges (typically {cityData.makingCharges}%)
                and GST (3%).
              </p>
              <p className="text-gray-600">
                When buying silver in {cityData.city}, always check for BIS hallmark
                certification and compare prices across multiple jewelers. The making
                charges can vary significantly based on the complexity of the design
                and the reputation of the jeweler.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
