import AdminToaster from "@/components/admin/AdminToaster";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AdminToaster />
    </>
  );
}
