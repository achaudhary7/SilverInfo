"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/", prefetch: true, icon: "🏠" },
  { name: "Silver Rate", href: "/silver-rate-today", prefetch: true, icon: "📊" },
  { name: "Gold Rate", href: "/gold", prefetch: true, icon: "🥇" },
  { name: "Qatar", href: "/qatar/silver-rate-today", prefetch: false, icon: "🇶🇦" },
  { name: "Learn", href: "/learn", prefetch: false, icon: "📚" },
  { name: "How We Calculate", href: "/how-we-calculate", prefetch: false, icon: "🔍" },
  { name: "Updates", href: "/updates", prefetch: false, icon: "📰" },
];

const toolsDropdown = [
  { name: "Silver Calculator", href: "/silver-price-calculator", description: "Calculate silver price with purity & GST", icon: "🧮" },
  { name: "Investment Calculator", href: "/investment-calculator", description: "Track your profit/loss on silver", icon: "📈" },
  { name: "Capital Gains Tax", href: "/capital-gains-tax-calculator", description: "Calculate STCG/LTCG tax on silver", icon: "🏛️" },
  { name: "Break-Even Calculator", href: "/break-even-calculator", description: "Find your break-even selling price", icon: "⚖️" },
  { name: "Real Returns Calculator", href: "/inflation-adjusted-calculator", description: "Inflation-adjusted returns", icon: "📊" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileToolsOpen(false);
  }, [pathname]);
  
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);
  
  // Close mobile menu on escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setMobileMenuOpen(false);
  }, []);
  
  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  // Check if link is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Check if Tools section is active
  const isToolsActive = () => {
    return toolsDropdown.some(tool => pathname.startsWith(tool.href));
  };

  // Prefetch key pages on mount for faster navigation
  useEffect(() => {
    navigation
      .filter((item) => item.prefetch)
      .forEach((item) => {
        router.prefetch(item.href);
      });
    // Prefetch tool pages
    toolsDropdown.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setToolsOpen(false);
    if (toolsOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [toolsOpen]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon-192.png"
                alt="SilverInfo.in Logo"
                width={40}
                height={40}
                className="rounded-lg shadow-sm"
                priority
              />
              {/* Mobile: Compact name, Desktop: Full name with tagline */}
              <div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  Silver<span className="text-[#1e3a5f]">Info</span>
                </span>
                <span className="text-[10px] sm:text-xs text-gray-500 block -mt-1">.in</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-x-6">
            {/* Regular nav items before Tools */}
            {navigation.slice(0, 2).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-[#1e3a5f] font-semibold"
                    : "text-gray-700 hover:text-[#1e3a5f]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setToolsOpen(!toolsOpen);
                }}
                onMouseEnter={() => setToolsOpen(true)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isToolsActive()
                    ? "text-[#1e3a5f] font-semibold"
                    : "text-gray-700 hover:text-[#1e3a5f]"
                }`}
              >
                Tools
                <svg
                  className={`w-4 h-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {toolsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  onMouseEnter={() => setToolsOpen(true)}
                  onMouseLeave={() => setToolsOpen(false)}
                >
                  {toolsDropdown.map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${
                        isActive(tool.href) ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setToolsOpen(false)}
                    >
                      <span className={`block text-sm font-medium ${
                        isActive(tool.href) ? "text-[#1e3a5f]" : "text-gray-900"
                      }`}>
                        {tool.name}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {tool.description}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Regular nav items after Tools */}
            {navigation.slice(2).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-[#1e3a5f] font-semibold"
                    : "text-gray-700 hover:text-[#1e3a5f]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Live Price Badge */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-gray-600">Live Prices</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-3 text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors min-h-[48px] min-w-[48px]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">{mobileMenuOpen ? "Close" : "Open"} main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu - Full screen slide-in */}
      <div 
        id="mobile-menu"
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <Image src="/icon-192.png" alt="SilverInfo.in" width={32} height={32} className="rounded-lg" />
              <span className="font-bold text-gray-900">SilverInfo<span className="text-gray-400">.in</span></span>
            </Link>
            <button
              type="button"
              className="p-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 min-h-[48px] min-w-[48px]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Menu Content */}
          <div className="overflow-y-auto h-[calc(100%-80px)] pb-safe">
            <nav className="px-2 py-4 space-y-1">
              {/* Main nav items */}
              {navigation.slice(0, 2).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center gap-3 px-4 py-4 text-base font-medium rounded-xl transition-colors min-h-[56px] ${
                    isActive(item.href)
                      ? "bg-[#1e3a5f]/10 text-[#1e3a5f]"
                      : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              ))}

              {/* Tools Section - Accordion */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
                  className={`w-full flex items-center justify-between px-4 py-4 text-base font-medium rounded-xl transition-colors min-h-[56px] ${
                    isToolsActive()
                      ? "bg-[#1e3a5f]/10 text-[#1e3a5f]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">🛠️</span>
                    Tools
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${mobileToolsOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Tools submenu */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  mobileToolsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-1 py-2">
                    {toolsDropdown.map((tool) => (
                      <Link
                        key={tool.name}
                        href={tool.href}
                        className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors min-h-[48px] ${
                          isActive(tool.href)
                            ? "bg-blue-50 text-[#1e3a5f]"
                            : "text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{tool.icon}</span>
                        <div>
                          <div>{tool.name}</div>
                          <div className="text-xs text-gray-400 font-normal">{tool.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rest of nav items */}
              {navigation.slice(2).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center gap-3 px-4 py-4 text-base font-medium rounded-xl transition-colors min-h-[56px] ${
                    isActive(item.href)
                      ? "bg-[#1e3a5f]/10 text-[#1e3a5f]"
                      : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Live Price Badge - Mobile */}
            <div className="px-4 pt-4 mt-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 bg-gray-50 px-4 py-3 rounded-xl">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-600">Live Prices Updated Every 30s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
