import SafeImage from "@/components/ui/SafeImage";
import { getBusinessInitials } from "@/lib/business-initials";

type BusinessLogoProps = {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
};

const SIZE = {
  sm: {
    box: "h-10 w-10",
    text: "text-[11px]",
    sizes: "40px",
  },
  md: {
    box: "h-12 w-12",
    text: "text-[13px]",
    sizes: "48px",
  },
  lg: {
    box: "h-14 w-14",
    text: "text-base",
    sizes: "56px",
  },
  xl: {
    box: "h-24 w-24 sm:h-28 sm:w-28",
    text: "text-2xl sm:text-3xl",
    sizes: "112px",
  },
} as const;

export default function BusinessLogo({
  name,
  logoUrl,
  size = "md",
  className = "",
  priority = false,
}: BusinessLogoProps) {
  const s = SIZE[size];
  const initials = getBusinessInitials(name);

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${s.box} ${className}`}
      aria-hidden={logoUrl ? undefined : true}
    >
      {logoUrl ? (
        <SafeImage
          src={logoUrl}
          alt={`Logo ${name}`}
          fill
          sizes={s.sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-red-100 via-rose-50 to-amber-50 font-bold tracking-tight text-red-800 ${s.text}`}
          title={name}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
