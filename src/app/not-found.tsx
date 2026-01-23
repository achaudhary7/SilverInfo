import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full gradient-silver mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-600">404</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been
          moved or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2c5282] transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/silver-rate-today"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Check Silver Prices
          </Link>
        </div>
      </div>
    </div>
  );
}
