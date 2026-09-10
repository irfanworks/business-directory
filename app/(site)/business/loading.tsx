import { BusinessPageSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading business profile">
      <span className="sr-only">Loading business profile…</span>
      <BusinessPageSkeleton />
    </div>
  );
}
