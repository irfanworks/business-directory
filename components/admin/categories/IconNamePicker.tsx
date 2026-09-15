"use client";

import { CATEGORY_ICON_OPTIONS, getCategoryIcon } from "@/lib/icons";

type IconNamePickerProps = {
  value: string;
  onChange: (iconName: string) => void;
  disabled?: boolean;
};

export default function IconNamePicker({
  value,
  onChange,
  disabled = false,
}: IconNamePickerProps) {
  const selectedKey = value.replace(/[-_\s]/g, "").toLowerCase();
  const SelectedIcon = getCategoryIcon(value);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {CATEGORY_ICON_OPTIONS.map(({ name, label, Icon }) => {
          const active = selectedKey === name;
          return (
            <button
              key={name}
              type="button"
              disabled={disabled}
              onClick={() => onChange(active ? "" : name)}
              title={`${label} (${name})`}
              aria-pressed={active}
              className={`inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl border px-2.5 text-[11px] font-medium transition ${
                active
                  ? "border-slate-900 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              } disabled:opacity-60`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{name}</span>
            </button>
          );
        })}
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
        {value ? (
          <>
            <SelectedIcon className="h-3.5 w-3.5 text-slate-500" />
            Terpilih: <span className="font-medium text-slate-600">{value}</span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onChange("")}
              className="ml-1 underline underline-offset-2 hover:text-slate-700"
            >
              Hapus
            </button>
          </>
        ) : (
          "Pilih salah satu ikon di atas (opsional)."
        )}
      </p>
    </div>
  );
}
