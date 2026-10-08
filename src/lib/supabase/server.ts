import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function credentials() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

/** Cliente com a sessão do painel em cookies. `remember` define se ela sobrevive ao fechar o navegador. */
export async function createAuthClient(remember = true) {
  const keys = credentials();
  if (!keys) throw new Error("Supabase não configurado.");
  const cookieStore = await cookies();

  return createServerClient(keys.url, keys.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            if (remember) {
              cookieStore.set(name, value, options);
              continue;
            }
            const sessionOptions = { ...options };
            delete sessionOptions.maxAge;
            delete sessionOptions.expires;
            cookieStore.set(name, value, sessionOptions);
          }
        } catch {
          // Em Server Component o proxy é quem grava o cookie renovado.
        }
      },
    },
  });
}
