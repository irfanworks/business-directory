"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { saveSiteSettings } from "@/app/admin/settings/actions";
import {
  SETTINGS_FIELDS,
  SETTINGS_GROUPS,
  type SettingsMap,
} from "@/lib/admin/settings";

type SettingsFormProps = {
  initialValues: SettingsMap;
};

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
      toast.success("Pengaturan situs berhasil disimpan");
      router.refresh();
    });
  }

  function patch(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      {SETTINGS_GROUPS.map((group) => {
        const fields = SETTINGS_FIELDS.filter((f) => f.group === group.id);
        return (
          <section
            key={group.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6"
          >
            <h2 className="text-[15px] font-semibold tracking-tight text-slate-950">
              {group.title}
            </h2>
            <p className="mt-1 text-[13px] text-slate-500">{group.description}</p>

            <div className="mt-5 space-y-4">
              {fields.map((field) => {
                const inputType =
                  field.input ||
                  (field.key.includes("email")
                    ? "email"
                    : field.key.includes("url") ||
                        field.key.startsWith("social_") ||
                        field.key === "seo_og_image"
                      ? "url"
                      : "text");
                const isTextarea =
                  inputType === "textarea" ||
                  field.key.includes("subtitle") ||
                  field.key.includes("description") ||
                  field.key.includes("footer");

                return (
                  <div key={field.key}>
                    <label
                      htmlFor={`setting-${field.key}`}
                      className="mb-1.5 block text-[12px] font-medium text-slate-700"
                    >
                      {field.label}
                    </label>
                    {isTextarea ? (
                      <textarea
                        id={`setting-${field.key}`}
                        rows={3}
                        value={values[field.key] || ""}
                        onChange={(e) => patch(field.key, e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-[13px] text-slate-900 outline-none transition focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-400/20"
                      />
                    ) : (
                      <input
                        id={`setting-${field.key}`}
                        type={inputType === "url" ? "url" : inputType === "email" ? "email" : "text"}
                        value={values[field.key] || ""}
                        onChange={(e) => patch(field.key, e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-[13px] text-slate-900 outline-none transition focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-400/20"
                        placeholder={
                          inputType === "url" ? "https://" : undefined
                        }
                      />
                    )}
                    {field.hint ? (
                      <p className="mt-1 text-[11px] text-slate-400">{field.hint}</p>
                    ) : null}
                  </div>
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
        {isPending ? "Menyimpan…" : "Simpan pengaturan"}
      </button>
    </form>
  );
}
