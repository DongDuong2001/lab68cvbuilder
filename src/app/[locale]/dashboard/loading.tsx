export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header skeleton */}
      <header className="border-b border-black p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gray-200 animate-pulse" />
            <div>
              <div className="h-3 w-20 bg-gray-200 animate-pulse mb-1" />
              <div className="h-4 w-36 bg-gray-200 animate-pulse" />
            </div>
          </div>
          <div className="h-9 w-24 border border-gray-200 animate-pulse" />
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="max-w-7xl mx-auto p-6 flex-1 w-full">
        <div className="mb-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="h-3 w-32 bg-gray-200 animate-pulse mb-2" />
              <div className="h-10 w-48 bg-gray-200 animate-pulse" />
            </div>
            <div className="h-10 w-36 border border-gray-200 animate-pulse" />
          </div>
          <div className="w-full border-t border-gray-200" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-gray-200 p-6 space-y-4">
              <div className="h-3 w-16 bg-gray-200 animate-pulse" />
              <div className="h-6 w-3/4 bg-gray-200 animate-pulse" />
              <div className="h-32 bg-gray-100 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-gray-200 animate-pulse" />
                <div className="h-8 w-20 bg-gray-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
