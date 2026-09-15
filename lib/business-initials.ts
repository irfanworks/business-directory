/**
 * Build avatar initials from a business name.
 * e.g. "Optisio Digital Solutions" → "OD", "Kopi" → "KO"
 */
export function getBusinessInitials(name: string, maxLetters = 2): string {
  const cleaned = name.trim().replace(/\s+/g, " ");
  if (!cleaned) return "?";

  const skip = new Set([
    "dan",
    "and",
    "&",
    "of",
    "the",
    "untuk",
    "di",
    "pt",
    "cv",
    "ud",
    "tbk",
  ]);

  const words = cleaned
    .split(" ")
    .map((w) => w.replace(/^[^a-zA-Z0-9\u00C0-\u024F]+|[^a-zA-Z0-9\u00C0-\u024F]+$/g, ""))
    .filter((w) => w.length > 0 && !skip.has(w.toLowerCase()));

  if (words.length === 0) {
    return cleaned.slice(0, maxLetters).toUpperCase();
  }

  if (words.length === 1) {
    return words[0].slice(0, maxLetters).toUpperCase();
  }

  return words
    .slice(0, maxLetters)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();
}
