/**
 * Homepage Loading Skeleton
 * 
 * Displays immediately while page data is being fetched.
 * Improves perceived performance and prevents layout shift.
 */

export default function HomeLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="h-6 w-48 bg-gray-200 rounded-full" />
              <div className="h-6 w-40 bg-gray-200 rounded-full" />
            </div>
            <div className="h-10 w-80 bg-gray-300 rounded-lg mb-4" />
            <div className="h-5 w-96 bg-gray-200 rounded-lg" />
          </div>

          {/* Cards Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Price Card Skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
                  <div className="h-10 w-40 bg-gray-300 rounded" />
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded-full" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                    <div className="h-6 w-24 bg-gray-300 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Card Skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between mb-4">
                <div>
                  <div className="h-5 w-28 bg-gray-300 rounded mb-1" />
                  <div className="h-4 w-36 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-16 bg-gray-100 rounded-lg" />
              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <div className="h-3 w-12 bg-gray-200 rounded mx-auto mb-2" />
                    <div className="h-4 w-16 bg-gray-300 rounded mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar Skeleton */}
      <section className="bg-[#1e3a5f] py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 bg-white/20 rounded" />
                <div className="h-4 w-24 bg-white/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Chart Skeleton */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between mb-6">
                  <div className="h-6 w-40 bg-gray-300 rounded" />
                  <div className="h-8 w-32 bg-gray-200 rounded" />
                </div>
                <div className="h-72 bg-gray-100 rounded-lg" />
              </div>

              {/* City Table Skeleton */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="h-6 w-48 bg-gray-300 rounded mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Calculator Skeleton */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="h-6 w-32 bg-gray-300 rounded mb-4" />
                <div className="space-y-4">
                  <div className="h-10 w-full bg-gray-200 rounded" />
                  <div className="h-10 w-full bg-gray-200 rounded" />
                  <div className="h-10 w-full bg-gray-200 rounded" />
                  <div className="h-12 w-full bg-gray-300 rounded mt-4" />
                </div>
              </div>

              {/* Updates Skeleton */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="h-6 w-32 bg-gray-300 rounded mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="h-3 w-16 bg-gray-200 rounded mb-1" />
                      <div className="h-4 w-full bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
