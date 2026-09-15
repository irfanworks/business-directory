"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import SafeImage from "@/components/ui/SafeImage";
import { createClient, isBrowserSupabaseConfigured } from "@/lib/supabase/browser";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: "logo";
  hint?: string;
};

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = "logo",
  hint,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFileChange(file: File | undefined) {
    if (!file) return;

    if (!isBrowserSupabaseConfigured()) {
      toast.error("Supabase belum dikonfigurasi untuk upload.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran maksimal 5MB.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      const { error } = await supabase.storage
        .from("listings")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (error) {
        toast.error(error.message);
        return;
      }

      const { data } = supabase.storage.from("listings").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success(`${label} berhasil diupload`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-medium text-slate-700">{label}</span>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700"
          >
            <Trash2 className="h-3 w-3" />
            Hapus
          </button>
        )}
      </div>

      <div className="flex items-start gap-3">
        <div
          className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
        >
          {value ? (
            <SafeImage
              src={value}
              alt={`${label} preview`}
              fill
              sizes="144px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <ImagePlus className="h-5 w-5" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… atau upload file"
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-400/20"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-700 transition hover:border-slate-300 disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {uploading ? "Uploading…" : "Upload"}
            </button>
            {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files?.[0])}
          />
        </div>
      </div>
    </div>
  );
}
