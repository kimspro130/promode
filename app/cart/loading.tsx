export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/4 mb-8"></div>

          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-gray-900 rounded-lg">
                <div className="h-20 w-20 bg-gray-800 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-800 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
