import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

type PageProps = {
  params: { slug: string };
};

/** Resolve public business slug → admin edit page. */
export default async function EditListingBySlugPage({ params }: PageProps) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/listings");
  }

  const supabase = createClient();
  if (!supabase) {
    redirect("/admin/listings");
  }

  const { data } = await supabase
    .from("listings")
    .select("id")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!data?.id) {
    redirect("/admin/listings");
  }

  redirect(`/admin/listings/${data.id}`);
}
