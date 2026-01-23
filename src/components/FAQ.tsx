"use client";

import { useState } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
}

export default function FAQ({ items, title = "Frequently Asked Questions", description }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <div className="card p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      
      {/* FAQ Items */}
      <div className="space-y-2 sm:space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 py-4 sm:py-4 flex items-start sm:items-center justify-between text-left hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[56px]"
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-gray-900 pr-4 text-sm sm:text-base leading-snug">{item.question}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 mt-0.5 sm:mt-0 ${
                  openIndex === index ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-4 pb-4 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 pt-3">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
