"use client";

import { useState, useEffect } from "react";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  title?: string;
}

/**
 * TableOfContents Component
 * 
 * Displays a sticky table of contents for long pages.
 * Highlights current section based on scroll position.
 * Critical for SEO (passage indexing) and UX.
 */
export default function TableOfContents({ items, title = "On this page" }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0,
      }
    );

    // Observe all section headings
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className="card p-4 sticky top-20">
      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={`block w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${
                item.level === 3 ? "pl-4" : ""
              } ${
                activeId === item.id
                  ? "bg-[#1e3a5f]/10 text-[#1e3a5f] font-medium"
                  : "text-gray-600 hover:text-[#1e3a5f] hover:bg-gray-50"
              }`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Inline Jump Links Component
 * For use at top of long sections
 */
export function JumpLinks({ items }: { items: TOCItem[] }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
      <span className="text-xs text-gray-500 font-medium">Jump to:</span>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="text-xs text-[#1e3a5f] hover:underline px-2 py-1 bg-white rounded border border-gray-200 hover:border-[#1e3a5f] transition-colors"
        >
          {item.title}
        </a>
      ))}
    </div>
  );
}
