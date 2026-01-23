export default function SilverRateLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-8 w-80 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Price Card Skeleton */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-12 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart Skeleton */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded animate-pulse"></div>
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
