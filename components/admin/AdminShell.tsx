import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar, {
  type AdminBreadcrumbItem,
} from "@/components/admin/AdminTopbar";
import { createClient } from "@/lib/supabase/server";

type AdminShellProps = {
  children: ReactNode;
  breadcrumb: AdminBreadcrumbItem[];
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default async function AdminShell({
  children,
  breadcrumb,
  title,
  description,
  actions,
}: AdminShellProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = supabase
    ? await supabase.auth.getUser()
    : { data: { user: null } };

  return (
    <div className="flex min-h-screen bg-[#F4F7FB] text-slate-900">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          breadcrumb={breadcrumb}
          userEmail={user?.email}
          userName={
            (user?.user_metadata?.full_name as string | undefined) ||
            (user?.user_metadata?.name as string | undefined) ||
            null
          }
        />
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-[14px] text-slate-500">{description}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
