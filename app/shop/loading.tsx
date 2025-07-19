export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>

          {/* Filter skeleton */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-800 rounded w-24"></div>
            ))}
          </div>

          {/* Product grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="h-64 bg-gray-800"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-800 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
