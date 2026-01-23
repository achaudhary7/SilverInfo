import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  prices: [
    { name: "Silver Rate Today", href: "/silver-rate-today" },
    { name: "Mumbai Silver Rate", href: "/city/mumbai" },
    { name: "Delhi Silver Rate", href: "/city/delhi" },
    { name: "Chennai Silver Rate", href: "/city/chennai" },
    { name: "Bangalore Silver Rate", href: "/city/bangalore" },
  ],
  tools: [
    { name: "Silver Calculator", href: "/silver-price-calculator" },
    { name: "Investment Calculator", href: "/investment-calculator" },
    { name: "Capital Gains Tax", href: "/capital-gains-tax-calculator" },
    { name: "Break-Even Calculator", href: "/break-even-calculator" },
    { name: "Real Returns Calculator", href: "/inflation-adjusted-calculator" },
  ],
  learn: [
    { name: "What is Sterling Silver?", href: "/learn/what-is-sterling-silver" },
    { name: "Silver Hallmark Guide", href: "/learn/silver-hallmark-guide" },
    { name: "Silver vs Gold Investment", href: "/learn/silver-vs-gold-investment" },
    { name: "How We Calculate Prices", href: "/how-we-calculate" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Disclaimer", href: "/disclaimer" },
    { name: "Updates", href: "/updates" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Tagline Banner */}
      <div className="bg-[#1e3a5f] py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white text-base sm:text-lg font-semibold">
            Calculated, Not Copied.
          </p>
          <p className="text-blue-200 text-xs sm:text-sm mt-1">
            Prices derived from COMEX futures + USD/INR exchange rates.{" "}
            <Link href="/how-we-calculate" className="underline hover:text-white">
              See Our Formula →
            </Link>
          </p>
        </div>
      </div>

      {/* Add extra padding at bottom for mobile nav bar (height ~64px + safe area) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-32 sm:pb-12">
        {/* Mobile: Stacked layout with better touch targets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Prices */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              Silver Prices
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.prices.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block text-sm hover:text-white transition-colors py-2 sm:py-1 -mx-2 px-2 rounded-lg hover:bg-gray-800 active:bg-gray-700 min-h-[44px] sm:min-h-0 flex items-center"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              Tools
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block text-sm hover:text-white transition-colors py-2 sm:py-1 -mx-2 px-2 rounded-lg hover:bg-gray-800 active:bg-gray-700 min-h-[44px] sm:min-h-0 flex items-center"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              Learn
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block text-sm hover:text-white transition-colors py-2 sm:py-1 -mx-2 px-2 rounded-lg hover:bg-gray-800 active:bg-gray-700 min-h-[44px] sm:min-h-0 flex items-center"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider mb-3 sm:mb-4">
              Company
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block text-sm hover:text-white transition-colors py-2 sm:py-1 -mx-2 px-2 rounded-lg hover:bg-gray-800 active:bg-gray-700 min-h-[44px] sm:min-h-0 flex items-center"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo & Description */}
            <div className="flex items-center gap-3">
              <Image
                src="/icon-192.png"
                alt="SilverInfo.in Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <div>
                <span className="text-lg font-bold text-white">
                  Silver<span className="text-gray-400">Info</span>.in
                </span>
                <p className="text-xs text-gray-400">
                  Transparent • Fast • Explanatory
                </p>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © {currentYear} SilverInfo.in. All rights reserved.
            </p>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="bg-gray-800/50 rounded-lg p-4 text-xs text-gray-500">
              <p className="font-semibold text-gray-400 mb-2">Important Disclaimer</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>
                  Prices shown are <strong className="text-gray-400">indicative estimates</strong> calculated 
                  from international spot prices (COMEX) and USD/INR exchange rates. These are 
                  <strong className="text-gray-400"> not official exchange rates</strong> from MCX, IBJA, or any commodity exchange.
                </li>
                <li>
                  Silver prices auto-refresh every <strong className="text-gray-400">30 seconds</strong> and 
                  may differ from actual retail prices by 2-5% due to local demand, dealer margins, and market timing.
                </li>
                <li>
                  Actual prices vary by city, dealer, purity, and making charges. Always verify with your 
                  local jeweller before making any purchase.
                </li>
                <li>
                  This website is for <strong className="text-gray-400">informational purposes only</strong> and 
                  does not constitute financial, investment, or trading advice.
                </li>
              </ul>
              <p className="mt-3 text-gray-600">
                Data sources: International spot prices, ECB forex rates. Official references:{" "}
                <a href="https://www.mcxindia.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white underline">MCX India</a>
                {" • "}
                <a href="https://www.rbi.org.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white underline">RBI</a>
                {" • "}
                <a href="https://ibjarates.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white underline">IBJA</a>
                {" • "}
                <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white underline">BIS Hallmarking</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
