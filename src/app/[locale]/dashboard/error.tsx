"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full border-2 border-black p-8 text-center">
        <span className="label-mono block mb-4 text-red-600">ERROR // DASHBOARD</span>
        <h2 className="text-3xl font-black tracking-tight mb-4">
          Something Went Wrong
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {error.message || "An unexpected error occurred while loading your dashboard."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="border border-black bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-150"
          >
            Try Again
          </button>
          <a
            href="/"
            className="border border-black px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
