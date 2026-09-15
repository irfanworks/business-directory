import { Check } from "lucide-react";

type VerifiedBadgeProps = {
  size?: "sm" | "md";
  className?: string;
};

export default function VerifiedBadge({
  size = "sm",
  className = "",
}: VerifiedBadgeProps) {
  const isSm = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 font-medium text-emerald-700 ${
        isSm ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-0.5 text-[12px]"
      } ${className}`}
    >
      <Check
        className={isSm ? "h-3 w-3" : "h-3.5 w-3.5"}
        strokeWidth={2.5}
        aria-hidden
      />
      Terverifikasi
    </span>
  );
}
