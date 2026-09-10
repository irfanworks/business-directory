"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FolderPlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  createCategory,
  createSubcategory,
  deleteCategory,
  deleteSubcategory,
  updateCategory,
  updateSubcategory,
} from "@/app/admin/categories/actions";
import { slugify } from "@/lib/admin/listings";
import type { AdminCategory } from "@/lib/data/admin-taxonomy";

type CategoriesManagerProps = {
  categories: AdminCategory[];
};

type CategoryDraft = {
  name: string;
  slug: string;
  description: string;
  icon_name: string;
};

type SubDraft = {
  name: string;
  slug: string;
  description: string;
};

const emptyCategory = (): CategoryDraft => ({
  name: "",
  slug: "",
  description: "",
  icon_name: "",
});

const emptySub = (): SubDraft => ({
  name: "",
  slug: "",
  description: "",
});

export default function CategoriesManager({
  categories,
}: CategoriesManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [newCategory, setNewCategory] = useState<CategoryDraft>(emptyCategory());
  const [slugTouched, setSlugTouched] = useState(false);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryEdit, setCategoryEdit] = useState<CategoryDraft>(emptyCategory());

  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [subDraft, setSubDraft] = useState<SubDraft>(emptySub());
  const [subSlugTouched, setSubSlugTouched] = useState(false);

  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [subEdit, setSubEdit] = useState<SubDraft>(emptySub());

  function refresh() {
    router.refresh();
  }

  function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error || "Terjadi kesalahan");
        return;
      }
      toast.success(success);
      refresh();
    });
  }

  function onCreateCategory(e: FormEvent) {
    e.preventDefault();
    run(
      () => createCategory(newCategory),
      "Kategori berhasil ditambahkan",
    );
    setNewCategory(emptyCategory());
    setSlugTouched(false);
  }

  function startEditCategory(category: AdminCategory) {
    setEditingCategoryId(category.id);
    setCategoryEdit({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon_name: category.icon_name || "",
    });
  }

  function onSaveCategory(e: FormEvent) {
    e.preventDefault();
    if (!editingCategoryId) return;
    run(
      () => updateCategory({ id: editingCategoryId, ...categoryEdit }),
      "Kategori berhasil diperbarui",
    );
    setEditingCategoryId(null);
  }

  function onDeleteCategory(category: AdminCategory) {
    const ok = window.confirm(
      `Hapus kategori "${category.name}" beserta subkategorinya?`,
    );
    if (!ok) return;
    run(() => deleteCategory(category.id), "Kategori berhasil dihapus");
  }

  function onCreateSub(e: FormEvent, categoryId: string) {
    e.preventDefault();
    run(
      () => createSubcategory({ category_id: categoryId, ...subDraft }),
      "Subkategori berhasil ditambahkan",
    );
    setSubDraft(emptySub());
    setSubSlugTouched(false);
    setAddingSubFor(null);
  }

  function startEditSub(sub: AdminCategory["subcategories"][number]) {
    setEditingSubId(sub.id);
    setSubEdit({
      name: sub.name,
      slug: sub.slug,
      description: sub.description || "",
    });
  }

  function onSaveSub(e: FormEvent) {
    e.preventDefault();
    if (!editingSubId) return;
    run(
      () => updateSubcategory({ id: editingSubId, ...subEdit }),
      "Subkategori berhasil diperbarui",
    );
    setEditingSubId(null);
  }

  function onDeleteSub(sub: AdminCategory["subcategories"][number]) {
    const ok = window.confirm(`Hapus subkategori "${sub.name}"?`);
    if (!ok) return;
    run(() => deleteSubcategory(sub.id), "Subkategori berhasil dihapus");
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={onCreateCategory}
        className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
      >
        <div className="mb-4 flex items-center gap-2">
          <FolderPlus className="h-4 w-4 text-teal-700" />
          <h2 className="text-[14px] font-semibold text-slate-950">
            Tambah kategori utama
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Nama *">
            <input
              required
              value={newCategory.name}
              onChange={(e) => {
                const name = e.target.value;
                setNewCategory((prev) => ({
                  ...prev,
                  name,
                  slug: slugTouched ? prev.slug : slugify(name),
                }));
              }}
              className={inputClass}
              placeholder="Teknologi & IT"
            />
          </Field>
          <Field label="Slug *">
            <input
              required
              value={newCategory.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setNewCategory((prev) => ({
                  ...prev,
                  slug: slugify(e.target.value),
                }));
              }}
              className={inputClass}
            />
          </Field>
          <Field label="Icon name">
            <input
              value={newCategory.icon_name}
              onChange={(e) =>
                setNewCategory((prev) => ({
                  ...prev,
                  icon_name: e.target.value,
                }))
              }
              className={inputClass}
              placeholder="cpu, landmark, briefcase…"
            />
          </Field>
          <Field label="Deskripsi">
            <input
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className={inputClass}
            />
          </Field>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-950 px-4 text-[13px] font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Add category
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
          >
            {editingCategoryId === category.id ? (
              <form onSubmit={onSaveCategory} className="space-y-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Nama">
                    <input
                      required
                      value={categoryEdit.name}
                      onChange={(e) =>
                        setCategoryEdit((prev) => ({
                          ...prev,
                          name: e.target.value,
                          slug: slugify(e.target.value),
                        }))
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Slug">
                    <input
                      required
                      value={categoryEdit.slug}
                      onChange={(e) =>
                        setCategoryEdit((prev) => ({
                          ...prev,
                          slug: slugify(e.target.value),
                        }))
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Icon">
                    <input
                      value={categoryEdit.icon_name}
                      onChange={(e) =>
                        setCategoryEdit((prev) => ({
                          ...prev,
                          icon_name: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Deskripsi">
                    <input
                      value={categoryEdit.description}
                      onChange={(e) =>
                        setCategoryEdit((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-9 items-center rounded-full bg-slate-950 px-3 text-[12px] font-medium text-white"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCategoryId(null)}
                    className="inline-flex h-9 items-center rounded-full border border-slate-200 px-3 text-[12px] font-medium text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-950">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-slate-400">
                    /{category.slug}
                    {category.icon_name ? ` · ${category.icon_name}` : ""}
                  </p>
                  {category.description && (
                    <p className="mt-2 text-[13px] text-slate-500">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => startEditCategory(category)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-slate-300"
                    aria-label="Edit category"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCategory(category)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                    aria-label="Delete category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                  Subcategories ({category.subcategories.length})
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAddingSubFor(
                      addingSubFor === category.id ? null : category.id,
                    );
                    setSubDraft(emptySub());
                    setSubSlugTouched(false);
                  }}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-teal-700 hover:text-teal-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add sub
                </button>
              </div>

              {addingSubFor === category.id && (
                <form
                  onSubmit={(e) => onCreateSub(e, category.id)}
                  className="mb-3 space-y-2 rounded-xl border border-teal-100 bg-teal-50/40 p-3"
                >
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      required
                      value={subDraft.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setSubDraft((prev) => ({
                          ...prev,
                          name,
                          slug: subSlugTouched ? prev.slug : slugify(name),
                        }));
                      }}
                      placeholder="Nama subkategori"
                      className={inputClass}
                    />
                    <input
                      required
                      value={subDraft.slug}
                      onChange={(e) => {
                        setSubSlugTouched(true);
                        setSubDraft((prev) => ({
                          ...prev,
                          slug: slugify(e.target.value),
                        }));
                      }}
                      placeholder="slug"
                      className={inputClass}
                    />
                  </div>
                  <input
                    value={subDraft.description}
                    onChange={(e) =>
                      setSubDraft((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Deskripsi (opsional)"
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex h-8 items-center rounded-full bg-slate-950 px-3 text-[12px] font-medium text-white"
                    >
                      Save sub
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingSubFor(null)}
                      className="inline-flex h-8 items-center gap-1 rounded-full border border-slate-200 px-3 text-[12px] text-slate-600"
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <ul className="space-y-2">
                {category.subcategories.map((sub) => (
                  <li
                    key={sub.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2"
                  >
                    {editingSubId === sub.id ? (
                      <form onSubmit={onSaveSub} className="space-y-2">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <input
                            required
                            value={subEdit.name}
                            onChange={(e) =>
                              setSubEdit((prev) => ({
                                ...prev,
                                name: e.target.value,
                                slug: slugify(e.target.value),
                              }))
                            }
                            className={inputClass}
                          />
                          <input
                            required
                            value={subEdit.slug}
                            onChange={(e) =>
                              setSubEdit((prev) => ({
                                ...prev,
                                slug: slugify(e.target.value),
                              }))
                            }
                            className={inputClass}
                          />
                        </div>
                        <input
                          value={subEdit.description}
                          onChange={(e) =>
                            setSubEdit((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className={inputClass}
                          placeholder="Deskripsi"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="inline-flex h-8 items-center rounded-full bg-slate-950 px-3 text-[12px] font-medium text-white"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSubId(null)}
                            className="inline-flex h-8 items-center rounded-full border border-slate-200 px-3 text-[12px] text-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[13px] font-medium text-slate-800">
                            {sub.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            /{sub.slug}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => startEditSub(sub)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500"
                            aria-label="Edit subcategory"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteSub(sub)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-rose-200 text-rose-600"
                            aria-label="Delete subcategory"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
                {category.subcategories.length === 0 && (
                  <li className="text-[13px] text-slate-400">
                    Belum ada subkategori.
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputClass =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none transition focus:border-teal-300 focus:ring-2 focus:ring-teal-400/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
