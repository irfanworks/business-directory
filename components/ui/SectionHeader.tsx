import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
        centered ? "items-center text-center sm:flex-col sm:items-center" : ""
      }`}
    >
      <div className={centered ? "mx-auto max-w-xl" : "max-w-xl"}>
        {eyebrow && <p className="label-eyebrow">{eyebrow}</p>}
        <h2 className={`text-h2 text-ink-950 ${eyebrow ? "mt-2" : ""}`}>
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
