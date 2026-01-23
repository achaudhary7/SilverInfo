export default function UpdatesLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
