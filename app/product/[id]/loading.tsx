export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="h-96 bg-gray-800 rounded-lg"></div>

            {/* Product details skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-800 rounded w-3/4"></div>
              <div className="h-6 bg-gray-800 rounded w-1/2"></div>
              <div className="h-4 bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-800 rounded w-2/3"></div>
              <div className="h-12 bg-gray-800 rounded w-1/3"></div>
              <div className="h-10 bg-gray-800 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
