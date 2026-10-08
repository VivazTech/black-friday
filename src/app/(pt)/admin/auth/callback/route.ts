import { NextResponse, type NextRequest } from "next/server";
import { BASE_PATH } from "@/lib/site";
import { createAuthClient } from "@/lib/supabase/server";

/** Recebe o link do e-mail de redefinição e abre a sessão para escolher a nova senha. */
export async function GET(request: NextRequest) {
  const url = new URL(`${BASE_PATH}/admin/redefinir`, request.url);
  url.search = "";

  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");

  try {
    const supabase = await createAuthClient(true);
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    } else if (tokenHash && type === "recovery") {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
      if (error) throw error;
    } else {
      throw new Error("Link incompleto");
    }
  } catch (error) {
    console.error("Falha ao validar o link de redefinição:", error);
    url.search = "?erro=1";
  }

  return NextResponse.redirect(url);
}
