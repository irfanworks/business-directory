import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/supabase/middleware";

export type AdminSession = {
  email: string;
};

/** Returns the current user only if they are an allowlisted admin. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !isAdminEmail(user.email)) return null;

  return { email: user.email };
}
