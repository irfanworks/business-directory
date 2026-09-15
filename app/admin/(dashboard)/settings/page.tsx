import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "@/components/admin/settings/SettingsForm";
import { getSiteSettings } from "@/lib/data/site-settings";

export const metadata: Metadata = {
  title: "Site Settings",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <AdminShell
      title="Site Settings"
      description="Atur konten homepage, identitas situs, kontak, social, dan SEO dasar."
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Site Settings" },
      ]}
    >
      <SettingsForm initialValues={settings} />
    </AdminShell>
  );
}
