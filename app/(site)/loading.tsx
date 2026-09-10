import { HomePageSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading homepage">
      <span className="sr-only">Loading…</span>
      <HomePageSkeleton />
    </div>
  );
}
