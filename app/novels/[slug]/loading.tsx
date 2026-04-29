export default function Loading() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="px-6 py-5 border-b border-line">
        <div className="h-5 w-24 bg-line rounded-sm opacity-50 animate-pulse" />
      </header>
      <main className="flex-1 flex items-start justify-center px-4 py-16">
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-12">
          <div className="flex-shrink-0 w-full max-w-xs">
            <div className="aspect-[3/4] w-full bg-line/60 animate-pulse" />
          </div>
          <div className="flex flex-col gap-6 flex-1">
            <div className="h-3 w-32 bg-line rounded-sm opacity-50 animate-pulse" />
            <div className="h-12 w-3/4 bg-line/70 rounded-sm animate-pulse" />
            <div className="h-px bg-line w-full" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-line/60 rounded-sm animate-pulse" />
              <div className="h-4 w-5/6 bg-line/60 rounded-sm animate-pulse" />
              <div className="h-4 w-4/6 bg-line/60 rounded-sm animate-pulse" />
            </div>
            <div className="h-12 w-32 bg-line/70 rounded-full animate-pulse mt-4" />
          </div>
        </div>
      </main>
    </div>
  );
}
