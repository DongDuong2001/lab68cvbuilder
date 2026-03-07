export default function BuilderLoading() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header skeleton */}
      <header className="border-b border-black p-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-7 h-7 bg-gray-200 animate-pulse" />
            <div className="h-8 w-48 bg-gray-200 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-28 bg-gray-200 animate-pulse" />
            <div className="h-8 w-28 bg-gray-200 animate-pulse" />
            <div className="h-8 w-24 border border-gray-200 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Body skeleton — two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: form */}
        <div className="w-1/2 border-r border-gray-200 p-8 space-y-6 overflow-hidden">
          {/* Tab bar */}
          <div className="flex gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 animate-pulse" />
            ))}
          </div>
          {/* Form fields */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 animate-pulse" />
              <div className="h-10 w-full bg-gray-100 animate-pulse border border-gray-200" />
            </div>
          ))}
          <div className="space-y-2">
            <div className="h-3 w-32 bg-gray-200 animate-pulse" />
            <div className="h-28 w-full bg-gray-100 animate-pulse border border-gray-200" />
          </div>
        </div>

        {/* Right panel: preview */}
        <div className="w-1/2 bg-gray-50 flex items-start justify-center p-8">
          <div className="w-153 h-198 bg-white border border-gray-200 animate-pulse shadow-sm" />
        </div>
      </div>
    </div>
  );
}
