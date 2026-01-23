import Link from "next/link";

interface AuthorBioProps {
  author: string;
  date: string;
  readingTime?: string;
  showFullBio?: boolean;
}

/**
 * AuthorBio Component
 * 
 * Displays author information for E-E-A-T (Experience, Expertise, Authoritativeness, Trust).
 * Critical for YMYL (Your Money Your Life) content like financial information.
 */
export default function AuthorBio({ author, date, readingTime, showFullBio = false }: AuthorBioProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`${showFullBio ? "p-4 bg-gray-50 rounded-lg border border-gray-200" : ""}`}>
      <div className="flex items-start gap-3">
        {/* Author Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a5f] to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {author.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link 
              href="/about" 
              className="font-medium text-gray-900 hover:text-[#1e3a5f] transition-colors"
            >
              {author}
            </Link>
            <span className="text-gray-300">•</span>
            <time dateTime={date} className="text-sm text-gray-500">
              {formattedDate}
            </time>
            {readingTime && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-500">{readingTime}</span>
              </>
            )}
          </div>
          
          {showFullBio && (
            <p className="text-sm text-gray-600 mt-2">
              The SilverInfo Team provides accurate silver price information derived from 
              international market data. Our methodology uses COMEX futures and RBI exchange rates.{" "}
              <Link href="/how-we-calculate" className="text-[#1e3a5f] hover:underline">
                See our methodology →
              </Link>
            </p>
          )}
          
          {/* Trust Signals */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded text-[10px] text-green-700">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Verified Data
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-[10px] text-blue-700">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Updated Daily
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact author byline for article headers
 */
export function AuthorByline({ author, date }: { author: string; date: string }) {
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <span>By</span>
      <Link href="/about" className="text-[#1e3a5f] hover:underline font-medium">
        {author}
      </Link>
      <span>•</span>
      <time dateTime={date}>{formattedDate}</time>
    </div>
  );
}

/**
 * "Reviewed by" badge for extra E-E-A-T
 */
export function ReviewedByBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      <div>
        <p className="text-xs font-medium text-amber-800">Fact-Checked</p>
        <p className="text-[10px] text-amber-600">Data verified from COMEX & RBI</p>
      </div>
    </div>
  );
}
