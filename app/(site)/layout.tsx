import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import AdminBar from "@/components/layout/AdminBar";
import { getAdminSession } from "@/lib/admin/session";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();

  return (
    <div className={`flex min-h-screen flex-col ${admin ? "pt-9" : ""}`}>
      {admin ? <AdminBar email={admin.email} /> : null}
      <Navbar adminBar={Boolean(admin)} />
      <main className="flex-1 pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
