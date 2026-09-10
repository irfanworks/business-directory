"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

type ShareProfileButtonProps = {
  title: string;
  url: string;
};

export default function ShareProfileButton({
  title,
  url,
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
      className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-teal-600" />
          Copied
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          Share Profile
        </>
      )}
    </button>
  );
}
