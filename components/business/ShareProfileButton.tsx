"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

type ShareProfileButtonProps = {
  title: string;
  url: string;
  compact?: boolean;
};

export default function ShareProfileButton({
  title,
  url,
  compact = false,
}: ShareProfileButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, url, text: title });
        return;
      }
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={
        compact
          ? "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-[12px] font-semibold text-red-950 transition hover:bg-red-50"
          : "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-[13px] font-semibold text-red-950 transition hover:bg-red-50"
      }
    >
      {copied ? (
        <>
          <Check className={compact ? "h-3.5 w-3.5 text-accent" : "h-3.5 w-3.5 text-accent"} />
          Tersalin
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          Bagikan
        </>
      )}
    </button>
  );
}
