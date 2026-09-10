import Image, { type ImageProps } from "next/image";

type SafeImageProps = Omit<ImageProps, "alt"> & {
  alt: string;
};

/**
 * next/image wrapper that keeps required alt text and safely handles
 * remote hosts outside the configured remotePatterns via unoptimized.
 */
export default function SafeImage({ alt, src, ...props }: SafeImageProps) {
  const source = typeof src === "string" ? src : null;
  const needsUnoptimized =
    Boolean(source) &&
    !source!.includes("placehold.co") &&
    !source!.includes("supabase.co") &&
    source!.startsWith("http");

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={props.unoptimized ?? needsUnoptimized}
    />
  );
}
