"use client";

/**
 * MobileBottomNav - Sticky bottom navigation for mobile users
 * 
 * Provides quick access to key features without scrolling.
 * Only visible on mobile devices (< md breakpoint).
 * 
 * Features:
 * - Fixed bottom position with safe area inset support
 * - 4 key actions: Home, Calculator, Rates, More
 * - Active state highlighting
 * - Smooth transitions
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-[#1e3a5f]" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Calculator",
    href: "/silver-price-calculator",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-[#1e3a5f]" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Rates",
    href: "/silver-rate-today",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-[#1e3a5f]" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: "Learn",
    href: "/learn",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-[#1e3a5f]" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  
  // Check if the current path matches
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };
  
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active 
                  ? "text-[#1e3a5f] bg-blue-50/50" 
                  : "text-gray-500 active:bg-gray-100"
              }`}
            >
              {item.icon(active)}
              <span className={`text-[10px] font-medium ${active ? "text-[#1e3a5f]" : "text-gray-500"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
