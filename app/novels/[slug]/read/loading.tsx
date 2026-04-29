export default function Loading() {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="px-6 py-5 border-b border-line">
        <div className="h-5 w-24 bg-line rounded-sm opacity-50 animate-pulse" />
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-prose mx-auto w-full space-y-3">
          <div className="h-3 w-40 bg-line/60 rounded-sm mx-auto animate-pulse" />
          <div className="h-px bg-line w-12 mx-auto my-8" />
          <div className="h-5 w-full bg-line/50 rounded-sm animate-pulse" />
          <div className="h-5 w-11/12 bg-line/50 rounded-sm animate-pulse" />
          <div className="h-5 w-10/12 bg-line/50 rounded-sm animate-pulse" />
          <div className="h-5 w-9/12 bg-line/50 rounded-sm animate-pulse" />
        </div>
      </main>
      <div className="sticky bottom-0 bg-paper border-t border-line py-4">
        <div className="max-w-prose mx-auto px-6 flex justify-between">
          <div className="h-4 w-16 bg-line/50 rounded-sm animate-pulse" />
          <div className="h-4 w-12 bg-line/50 rounded-sm animate-pulse" />
          <div className="h-4 w-16 bg-line/50 rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}
