import { CategoryPageSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading category">
      <span className="sr-only">Loading category…</span>
      <CategoryPageSkeleton />
    </div>
  );
}
