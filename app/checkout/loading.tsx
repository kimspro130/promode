export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form skeleton */}
            <div className="space-y-6">
              <div className="h-6 bg-gray-800 rounded w-1/3"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-800 rounded"></div>
                ))}
              </div>
            </div>

            {/* Order summary skeleton */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="h-6 bg-gray-800 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 bg-gray-800 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-800 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
