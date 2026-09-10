import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import SettingsForm from "@/components/admin/settings/SettingsForm";
import { getAdminSiteSettings } from "@/lib/data/admin-taxonomy";

export const metadata: Metadata = {
  title: "Site Settings",
};

export default async function AdminSettingsPage() {
  const settings = await getAdminSiteSettings();

  return (
    <AdminShell
      title="Site Settings"
      description="Atur informasi global situs: nama, hero, kontak admin, dan social Optisio."
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: "Site Settings" },
      ]}
    >
      <SettingsForm initialValues={settings} />
    </AdminShell>
  );
}
