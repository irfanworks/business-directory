export function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`}
    />
  );
}

export function HomePageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <Skeleton className="h-7 w-40 rounded-full" />
        <Skeleton className="mt-6 h-12 w-full max-w-2xl" />
        <Skeleton className="mt-3 h-12 w-full max-w-xl" />
        <Skeleton className="mt-5 h-5 w-full max-w-md" />
        <Skeleton className="mt-9 h-14 w-full max-w-2xl rounded-2xl" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-14 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>

      <div className="mt-20">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-8 w-72" />
        <Skeleton className="mt-2 h-4 w-80" />
        <div className="mt-8 flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-[300px] shrink-0 rounded-2xl border border-slate-200/80 bg-white p-5"
            >
              <div className="flex gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <Skeleton className="mt-5 h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-8 w-56" />
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/80 bg-white p-4"
            >
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
      <Skeleton className="mb-6 h-4 w-48" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-3 h-10 w-72" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />

      <div className="mt-8 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-full" />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/80 bg-white p-5"
            >
              <div className="flex gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <Skeleton className="mt-5 h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BusinessPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="mb-6 h-4 w-72" />

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
        <Skeleton className="h-44 w-full rounded-none sm:h-56 lg:h-64" />
        <div className="relative px-5 pb-6 sm:px-8 sm:pb-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
            <Skeleton className="h-24 w-24 rounded-2xl border-4 border-white sm:h-28 sm:w-28" />
            <div className="flex-1 space-y-3 pb-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full max-w-md" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 lg:col-span-8 sm:p-8">
          <Skeleton className="h-3 w-16" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="mt-6 h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <Skeleton className="mt-4 h-48 w-full" />
            <Skeleton className="mt-5 h-4 w-32" />
            <Skeleton className="mt-2 h-4 w-40" />
            <Skeleton className="mt-2 h-4 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}
