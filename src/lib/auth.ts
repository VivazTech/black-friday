import "server-only";

import { cookies } from "next/headers";
import { BASE_PATH } from "./site";
import { createAuthClient } from "./supabase/server";

export const adminConfigured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);

export async function isAdmin() {
  if (!adminConfigured()) return false;
  try {
    const supabase = await createAuthClient();
    const { data, error } = await supabase.auth.getClaims();
    return !error && Boolean(data?.claims?.sub);
  } catch {
    return false;
  }
}

export async function signIn(email: string, password: string, remember: boolean) {
  const supabase = await createAuthClient(remember);
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  await clearLegacyCookie();
}

export async function signOut() {
  try {
    const supabase = await createAuthClient();
    await supabase.auth.signOut();
  } finally {
    await clearLegacyCookie();
  }
}

async function clearLegacyCookie() {
  try {
    (await cookies()).set("bf_admin", "", { path: `${BASE_PATH}/admin`, maxAge: 0 });
  } catch {
    // A leitura da sessão em Server Component não precisa apagar o cookie antigo.
  }
}
