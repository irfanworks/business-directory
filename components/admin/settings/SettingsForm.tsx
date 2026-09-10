"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { saveSiteSettings } from "@/app/admin/settings/actions";
import { SETTINGS_FIELDS, type SettingsMap } from "@/lib/admin/settings";

type SettingsFormProps = {
  initialValues: SettingsMap;
};

const GROUPS = [
  {
    id: "general",
    title: "General",
    description: "Identitas utama website.",
  },
  {
    id: "hero",
    title: "Hero section",
    description: "Judul, subtitle, dan banner homepage.",
  },
  {
    id: "contact",
    title: "Contact",
    description: "Email admin dan teks footer.",
  },
  {
    id: "social",
    title: "Social media Optisio",
    description: "Link resmi akun sosial Optisio.",
  },
] as const;

export default function SettingsForm({ initialValues }: SettingsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<SettingsMap>(initialValues);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await saveSiteSettings(values);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Site settings berhasil disimpan");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      {GROUPS.map((group) => {
        const fields = SETTINGS_FIELDS.filter((f) => f.group === group.id);
        return (
          <section
            key={group.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6"
          >
            <h2 className="text-[14px] font-semibold text-slate-950">
              {group.title}
            </h2>
            <p className="mt-1 text-[12px] text-slate-500">{group.description}</p>

            <div className="mt-4 space-y-4">
              {fields.map((field) => {
                const isLong =
                  field.key.includes("subtitle") ||
                  field.key.includes("footer") ||
                  (values[field.key] || "").length > 80;

                return (
                  <label key={field.key} className="block">
                    <span className="mb-1.5 block text-[12px] font-medium text-slate-700">
                      {field.label}
                    </span>
                    {isLong ? (
                      <textarea
                        rows={3}
                        value={values[field.key] || ""}
                        onChange={(e) =>
                          setValues((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-[13px] text-slate-900 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                      />
                    ) : (
                      <input
                        type={
                          field.key.includes("email")
                            ? "email"
                            : field.key.includes("url") ||
                                field.key.startsWith("social_")
                              ? "url"
                              : "text"
                        }
                        value={values[field.key] || ""}
                        onChange={(e) =>
                          setValues((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-[13px] text-slate-900 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-400/20"
                        placeholder={
                          field.key.startsWith("social_") ||
                          field.key.includes("url")
                            ? "https://"
                            : undefined
                        }
                      />
                    )}
                    <span className="mt-1 block text-[11px] text-slate-400">
                      key: {field.key}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        );
      })}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-[13px] font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        {isPending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
