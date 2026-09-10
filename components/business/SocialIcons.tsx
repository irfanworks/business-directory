type IconProps = { className?: string };

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.5 9.5H3.7V20h2.8V9.5zM5.1 4a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3zM20.3 20h-2.8v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.86V20h-2.8V9.5h2.69v1.43h.04c.37-.71 1.29-1.46 2.65-1.46 2.83 0 3.36 1.86 3.36 4.28V20z" />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14.5 20v-7.2h2.4l.36-2.8h-2.76V8.2c0-.81.22-1.36 1.39-1.36H17.4V4.14C17.1 4.1 16.1 4 14.94 4 12.5 4 10.86 5.5 10.86 8v1.99H8.5v2.8h2.36V20h3.64z" />
    </svg>
  );
}

function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23 12.2s0-3.1-.4-4.5c-.2-.8-.9-1.4-1.7-1.6C19.5 5.7 12 5.7 12 5.7s-7.5 0-8.9.4c-.8.2-1.5.8-1.7 1.6C1 9.1 1 12.2 1 12.2s0 3.1.4 4.5c.2.8.9 1.4 1.7 1.6 1.4.4 8.9.4 8.9.4s7.5 0 8.9-.4c.8-.2 1.5-.8 1.7-1.6.4-1.4.4-4.5.4-4.5zM9.8 15.3V9.1l6.2 3.1-6.2 3.1z" />
    </svg>
  );
}

function TwitterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.9 3H21l-6.3 7.2L22 21h-5.7l-4.5-5.9L6.6 21H4.5l6.8-7.7L2.5 3h5.8l4 5.4L18.9 3zm-1 16.2h1.6L7.2 4.7H5.5l12.4 14.5z" />
    </svg>
  );
}

function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.8a4.84 4.84 0 0 1-1-.11z" />
    </svg>
  );
}

export const socialIcons = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  twitter: TwitterIcon,
  tiktok: TikTokIcon,
} as const;
