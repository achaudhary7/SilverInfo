"use client";

import { useState } from "react";

interface TOCItem {
  id: string;
  title: string;
  level?: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  title?: string;
}

/**
 * TableOfContents - Jump links for article sections
 * 
 * Collapsible on mobile, shows section links with smooth scroll.
 */
export default function TableOfContents({ items, title = "In This Article" }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsExpanded(false);
  };

  return (
    <nav className="my-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
      {/* Header - Clickable on mobile */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left md:cursor-default"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <span className="md:hidden text-gray-400 transition-transform duration-200" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>
          ▼
        </span>
      </button>

      {/* Links - Always visible on desktop, collapsible on mobile */}
      <ul className={`mt-3 space-y-2 overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 md:max-h-[500px] opacity-0 md:opacity-100"}`}>
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={`w-full text-left text-sm hover:text-[#1e3a5f] hover:bg-white px-3 py-2 rounded-lg transition-colors ${
                item.level === 2 ? "pl-6 text-gray-500" : "text-gray-700 font-medium"
              }`}
            >
              <span className="text-[#1e3a5f] mr-2">{index + 1}.</span>
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
