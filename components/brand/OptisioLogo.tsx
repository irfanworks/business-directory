import Image from "next/image";
import Link from "next/link";

type OptisioLogoProps = {
  href?: string | null;
  className?: string;
  /** Visual height of the logo lockup in px */
  height?: number;
  /**
   * `onDark` places the logo on a light plate so the black wordmark
   * stays readable on black/dark surfaces (e.g. footer).
   */
  variant?: "default" | "onDark";
  onClick?: () => void;
};

export default function OptisioLogo({
  href = "/",
  className = "",
  height = 28,
  variant = "default",
  onClick,
}: OptisioLogoProps) {
  // Source asset: 250×75
  const width = Math.round(height * (250 / 75));
  const onDark = variant === "onDark";

  const image = (
    <Image
      src="/optisio-logo.png"
      alt="Optisio"
      width={width}
      height={height}
      priority
      className="h-full w-auto max-w-none object-contain object-left"
    />
  );

  const inner = (
    <span
      className={
        onDark
          ? "inline-flex items-center rounded-md bg-white px-2.5 py-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
          : "inline-flex items-center"
      }
      style={onDark ? undefined : { height }}
    >
      <span className="inline-flex items-center" style={{ height }}>
        {image}
      </span>
    </span>
  );

  if (!href) {
    return <span className={className}>{inner}</span>;
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center ${className}`}
      aria-label="Optisio — Home"
    >
      {inner}
    </Link>
  );
}
