export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-64 bg-neutral-800/50 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <div className="h-6 w-2/3 bg-neutral-800/50 rounded animate-pulse" />
            <div className="h-4 w-full bg-neutral-800/50 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-neutral-800/50 rounded animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="h-20 bg-neutral-800/50 rounded animate-pulse" />
            <div className="h-20 bg-neutral-800/50 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}