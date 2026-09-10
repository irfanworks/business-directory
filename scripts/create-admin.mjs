/**
 * Bootstrap an admin user in Supabase Auth.
 *
 * Usage (after filling real Supabase keys in .env.local):
 *   ADMIN_PASSWORD='your-password' node --env-file=.env.local scripts/create-admin.mjs
 *
 * Optional overrides:
 *   ADMIN_EMAIL=hi.optisio@gmail.com ADMIN_USERNAME=admin ADMIN_PASSWORD='...' node --env-file=.env.local scripts/create-admin.mjs
 *
 * Prefers SUPABASE_SERVICE_ROLE_KEY (admin API). Falls back to public signup.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const email = process.env.ADMIN_EMAIL || "hi.optisio@gmail.com";
const password = process.env.ADMIN_PASSWORD;
const username = process.env.ADMIN_USERNAME || "admin";

function assertConfig() {
  if (!url || url.includes("your-project")) {
    throw new Error(
      "Set a real NEXT_PUBLIC_SUPABASE_URL in .env.local before creating the admin user.",
    );
  }
  if (!anonKey || anonKey === "your-anon-key") {
    throw new Error(
      "Set a real NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local before creating the admin user.",
    );
  }
  if (!email || !password) {
    throw new Error(
      "Set ADMIN_PASSWORD (and optionally ADMIN_EMAIL) when running this script.",
    );
  }
}

async function createWithServiceRole() {
  const res = await fetch(`${url.replace(/\/$/, "")}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        full_name: "Admin",
      },
    }),
  });

  const body = await res.json().catch(() => ({}));
  return { status: res.status, body, mode: "service_role" };
}

async function createWithSignUp() {
  const res = await fetch(`${url.replace(/\/$/, "")}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      data: {
        username,
        full_name: "Admin",
      },
    }),
  });

  const body = await res.json().catch(() => ({}));
  return { status: res.status, body, mode: "signup" };
}

async function main() {
  assertConfig();

  const result = serviceKey
    ? await createWithServiceRole()
    : await createWithSignUp();

  if (result.status >= 200 && result.status < 300) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: result.mode,
          email,
          username,
          userId: result.body?.id || result.body?.user?.id || null,
          note: serviceKey
            ? "Admin user created and email confirmed."
            : "User signed up. If email confirmation is enabled in Supabase, confirm the inbox before logging in.",
        },
        null,
        2,
      ),
    );
    return;
  }

  const msg =
    result.body?.msg ||
    result.body?.error_description ||
    result.body?.message ||
    JSON.stringify(result.body);

  if (String(msg).toLowerCase().includes("already")) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          alreadyExists: true,
          email,
          username,
          note: "User already exists. Ensure ADMIN_EMAILS includes this email, then login at /admin/login.",
        },
        null,
        2,
      ),
    );
    return;
  }

  console.error(
    JSON.stringify({ ok: false, status: result.status, mode: result.mode, error: msg }, null, 2),
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
