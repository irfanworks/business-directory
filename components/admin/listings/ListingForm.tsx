"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  createListing,
  updateListing,
} from "@/app/admin/listings/actions";
import ImageUploadField from "@/components/admin/listings/ImageUploadField";
import RichTextEditor from "@/components/admin/listings/RichTextEditor";
import {
  slugify,
  type CategoryOption,
  type ListingFormValues,
} from "@/lib/admin/listings";

type ListingFormProps = {
  mode: "create" | "edit";
  listingId?: string;
  initialValues: ListingFormValues;
  categories: CategoryOption[];
};

export default function ListingForm({
  mode,
  listingId,
  initialValues,
  categories,
}: ListingFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ListingFormValues>(initialValues);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [isPending, startTransition] = useTransition();

  const subcategories = useMemo(() => {
    const selectedId = String(values.category_id || "");
    const category = categories.find((c) => String(c.id) === selectedId);
    return category?.subcategories ?? [];
  }, [categories, values.category_id]);

  function patch<K extends keyof ListingFormValues>(
    key: K,
    value: ListingFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onTitleChange(title: string) {
    setValues((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title),
    }));
  }

  function onCategoryChange(categoryId: string) {
    setValues((prev) => ({
      ...prev,
      category_id: categoryId,
      subcategory_id: "",
    }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createListing(values)
          : await updateListing(listingId!, values);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      toast.success(
        mode === "create"
          ? "Listing berhasil dibuat"
          : "Listing berhasil diperbarui",
      );
      router.push("/admin/listings");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="relative overflow-visible rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500">
          Basic info
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 overflow-visible md:grid-cols-2">
          <Field label="Nama resmi bisnis *" className="md:col-span-2">
            <input
              required
              value={values.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className={inputClass}
              placeholder="Optisio Digital Solutions"
            />
          </Field>

          <Field label="Slug *">
            <input
              required
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                patch("slug", slugify(e.target.value));
              }}
              className={inputClass}
              placeholder="optisio-digital-solutions"
            />
          </Field>

          <Field label="Short tagline">
            <input
              value={values.short_tagline}
              onChange={(e) => patch("short_tagline", e.target.value)}
              className={inputClass}
              placeholder="Solusi digital untuk bisnis Indonesia"
            />
          </Field>

          <Field label="Kategori *">
            <AdminSelect
              required
              value={values.category_id}
              placeholder="Pilih kategori"
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
              onChange={onCategoryChange}
            />
          </Field>

          <Field
            label="Subkategori"
            hint={
              values.category_id && subcategories.length === 0
                ? "Opsional. Kategori ini belum punya subkategori — listing tetap bisa disimpan."
                : "Opsional. Boleh dikosongkan."
            }
          >
            <AdminSelect
              value={values.subcategory_id}
              placeholder="Tanpa subkategori"
              disabled={!values.category_id}
              allowEmpty
              emptyChoiceLabel="Tanpa subkategori"
              emptyLabel={
                values.category_id
                  ? "Tidak ada subkategori"
                  : "Pilih kategori dulu"
              }
              options={subcategories.map((sub) => ({
                value: sub.id,
                label: sub.name,
              }))}
              onChange={(id) => patch("subcategory_id", id)}
            />
          </Field>

          <Field label="Status">
            <select
              value={values.status}
              onChange={(e) =>
                patch("status", e.target.value as ListingFormValues["status"])
              }
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
            </select>
          </Field>

          <Field label="Tier">
            <select
              value={values.tier}
              onChange={(e) =>
                patch("tier", e.target.value as ListingFormValues["tier"])
              }
              className={inputClass}
            >
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </Field>

          <Toggle
            label="Featured listing"
            checked={values.is_featured}
            onChange={(checked) => patch("is_featured", checked)}
          />
          <Toggle
            label="Verified badge"
            checked={values.verified_badge}
            onChange={(checked) => patch("verified_badge", checked)}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500">
          Images
        </h2>
        <div className="mt-4">
          <ImageUploadField
            label="Logo"
            folder="logo"
            value={values.logo_url}
            onChange={(url) => patch("logo_url", url)}
            hint="PNG/JPG, max 5MB. Direkomendasikan 400×400."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500">
          Deskripsi & sejarah
        </h2>
        <div className="mt-4">
          <RichTextEditor
            value={values.content}
            onChange={(html) => patch("content", html)}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500">
          Contact & address
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Alamat" className="md:col-span-2">
            <input
              value={values.address}
              onChange={(e) => patch("address", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Kota">
            <input
              value={values.city}
              onChange={(e) => patch("city", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field
            label="Google Maps / Business Profile URL"
            className="md:col-span-2"
            hint="Tempel link share dari Google Business Profile (maps.app.goo.gl, share.google, atau URL /maps/place/…). Embed memakai pin bisnis (CID/koordinat), bukan teks alamat. Bisa juga tempel HTML iframe dari Share → Embed a map."
          >
            <input
              value={values.maps_url}
              onChange={(e) => patch("maps_url", e.target.value)}
              className={inputClass}
              placeholder="https://maps.app.goo.gl/… atau https://share.google/…"
            />
          </Field>
          <Field label="Phone">
            <input
              value={values.phone}
              onChange={(e) => patch("phone", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="WhatsApp">
            <input
              value={values.whatsapp}
              onChange={(e) => patch("whatsapp", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={values.email}
              onChange={(e) => patch("email", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Website URL">
            <input
              type="url"
              value={values.website_url}
              onChange={(e) => patch("website_url", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate-500">
          Social media
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {(
            [
              ["instagram", "Instagram"],
              ["linkedin", "LinkedIn"],
              ["facebook", "Facebook"],
              ["twitter", "Twitter / X"],
              ["tiktok", "TikTok"],
              ["youtube", "YouTube"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label}>
              <input
                type="url"
                value={values[key]}
                onChange={(e) => patch(key, e.target.value)}
                className={inputClass}
                placeholder="https://"
              />
            </Field>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-[13px] font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {isPending
            ? "Saving…"
            : mode === "create"
              ? "Save listing"
              : "Update listing"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/listings")}
          className="inline-flex h-11 items-center rounded-full border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 transition hover:border-slate-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 text-[13px] text-slate-900 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-400/20 disabled:opacity-60";

function Field({
  label,
  children,
  className = "",
  hint,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <div className={`block ${className}`}>
      <span className="mb-1.5 block text-[12px] font-medium text-slate-700">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="mt-1.5 block text-[11px] leading-relaxed text-slate-500">
          {hint}
        </span>
      ) : null}
    </div>
  );
}

type AdminSelectOption = { value: string; label: string };

function AdminSelect({
  value,
  options,
  onChange,
  placeholder,
  disabled,
  required,
  allowEmpty,
  emptyChoiceLabel = "Tidak dipilih",
  emptyLabel = "Tidak ada pilihan",
}: {
  value: string;
  options: AdminSelectOption[];
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  allowEmpty?: boolean;
  emptyChoiceLabel?: string;
  emptyLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((opt) => String(opt.value) === String(value));

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${open ? "z-30" : "z-10"}`}>
      <input type="hidden" value={value} required={required && !disabled} />
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${inputClass} flex items-center justify-between gap-2 text-left`}
      >
        <span className={selected ? "truncate" : "truncate text-slate-400"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>
      {open && !disabled ? (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-[80] mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-[0_12px_40px_rgba(15,23,42,0.16)]"
        >
          {allowEmpty ? (
            <li>
              <button
                type="button"
                role="option"
                aria-selected={!value}
                className={`w-full px-3 py-2.5 text-left text-[13px] transition hover:bg-slate-50 ${
                  !value ? "font-semibold text-slate-950" : "text-slate-500"
                }`}
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                {emptyChoiceLabel}
              </button>
            </li>
          ) : null}
          {options.length === 0 ? (
            <li className="px-3 py-2.5 text-[13px] text-slate-500">
              {emptyLabel}
            </li>
          ) : (
            options.map((opt) => {
              const active = String(opt.value) === String(value);
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`w-full px-3 py-2.5 text-left text-[13px] transition hover:bg-slate-50 ${
                      active
                        ? "font-semibold text-slate-950"
                        : "text-slate-700"
                    }`}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex h-10 cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-3">
      <span className="text-[13px] font-medium text-slate-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-teal-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}
