"use client";

/**
 * PriceDifferenceExplainer Component
 *
 * Explains why online silver prices differ from local jeweler prices.
 * Targets keywords: "why silver price different", "jeweler vs online silver rate"
 *
 * SEO: Addresses common user query about price discrepancy
 */

interface PriceBreakdownItem {
  factor: string;
  online: string;
  jeweler: string;
  difference: string;
  icon: string;
}

const priceBreakdown: PriceBreakdownItem[] = [
  {
    factor: "Base Silver Price",
    online: "COMEX/MCX spot rate",
    jeweler: "MCX + Local premium",
    difference: "₹0-50/10g",
    icon: "💰",
  },
  {
    factor: "Making Charges",
    online: "0% (bars/coins)",
    jeweler: "8-15% (jewelry)",
    difference: "₹250-500/10g",
    icon: "🔨",
  },
  {
    factor: "Wastage Charges",
    online: "None",
    jeweler: "2-5%",
    difference: "₹70-180/10g",
    icon: "⚖️",
  },
  {
    factor: "Hallmark Premium",
    online: "Included",
    jeweler: "Extra ₹20-50",
    difference: "₹20-50/10g",
    icon: "✓",
  },
  {
    factor: "Shop Overhead",
    online: "Lower (no rent)",
    jeweler: "Higher (rent, staff)",
    difference: "₹30-100/10g",
    icon: "🏪",
  },
  {
    factor: "GST (3%)",
    online: "On base price",
    jeweler: "On total bill",
    difference: "Variable",
    icon: "📋",
  },
];

export default function PriceDifferenceExplainer() {
  return (
    <section className="card p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Why Online Silver Price Differs from Local Jeweler
        </h2>
        <p className="text-sm text-gray-600">
          Online platforms show spot prices, while jewelers add multiple charges.
          Here&apos;s the complete breakdown of <span className="font-medium">chandi ka actual bhav</span> (actual silver rate).
        </p>
      </div>

      {/* Key Insight Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="font-semibold text-amber-900 mb-1">Key Insight</p>
            <p className="text-sm text-amber-800">
              Local jeweler silver prices are typically <strong>10-20% higher</strong> than online spot rates
              due to making charges, wastage, and overhead costs. For investment (bars/coins),
              the difference is smaller (2-5%).
            </p>
          </div>
        </div>
      </div>

      {/* Price Breakdown Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 font-semibold text-gray-900 rounded-tl-lg">Factor</th>
              <th className="text-left p-3 font-semibold text-gray-900">Online Price</th>
              <th className="text-left p-3 font-semibold text-gray-900">Jeweler Price</th>
              <th className="text-left p-3 font-semibold text-gray-900 rounded-tr-lg">Difference</th>
            </tr>
          </thead>
          <tbody>
            {priceBreakdown.map((item, index) => (
              <tr
                key={item.factor}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <td className="p-3 font-medium text-gray-900">
                  <span className="mr-2">{item.icon}</span>
                  {item.factor}
                </td>
                <td className="p-3 text-gray-600">{item.online}</td>
                <td className="p-3 text-gray-600">{item.jeweler}</td>
                <td className="p-3 text-amber-700 font-medium">{item.difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Example Calculation */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>🧮</span> Example: 10 Gram Silver Purchase
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Online Purchase */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-green-700 mb-3">Online (Bar/Coin)</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Silver (10g × ₹95)</span>
                <span>₹950</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Making Charges</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (3%)</span>
                <span>₹29</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span className="text-green-700">₹979</span>
              </div>
            </div>
          </div>

          {/* Jeweler Purchase */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm font-medium text-amber-700 mb-3">Local Jeweler (Jewelry)</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Silver (10g × ₹98)</span>
                <span>₹980</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Making (10%)</span>
                <span>₹98</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wastage (3%)</span>
                <span>₹29</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (3%)</span>
                <span>₹33</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total</span>
                <span className="text-amber-700">₹1,140</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          * Prices are illustrative. Actual rates vary by city and jeweler.
        </p>
      </div>

      {/* Tips Section */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <span>✅</span> When to Buy Online
          </h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Investment purpose (bars, coins)</li>
            <li>• Bulk purchases (1kg+)</li>
            <li>• When you want lowest premium</li>
            <li>• Digital silver/SGB investments</li>
          </ul>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <span>🏪</span> When to Buy from Jeweler
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Custom jewelry designs</li>
            <li>• Wedding/gifting occasions</li>
            <li>• When you need immediate delivery</li>
            <li>• Exchange old silver jewelry</li>
          </ul>
        </div>
      </div>

      {/* Bottom Note */}
      <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100">
        <strong>Note:</strong> Our prices show indicative spot rates based on COMEX + USD/INR conversion.
        Actual jeweler prices will be higher due to making charges and local premiums.
        Always ask for itemized billing before purchase.
      </p>
    </section>
  );
}
