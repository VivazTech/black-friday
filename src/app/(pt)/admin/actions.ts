"use server";

import { revalidatePath, updateTag } from "next/cache";
import { endSession, isAdmin, passwordMatches, startSession } from "@/lib/auth";
import { MODE_TAG, setSiteMode } from "@/lib/sheets";
import { isSiteMode } from "@/lib/site";

export interface AdminState {
  message: string;
  error: boolean;
}

export async function login(_: AdminState, form: FormData): Promise<AdminState> {
  const candidate = form.get("senha");
  if (typeof candidate !== "string" || !passwordMatches(candidate)) {
    // Atraso fixo para desencorajar tentativas em série.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { message: "Senha incorreta.", error: true };
  }
  await startSession();
  revalidatePath("/admin");
  return { message: "", error: false };
}

export async function logout() {
  await endSession();
  revalidatePath("/admin");
}

export async function saveMode(_: AdminState, form: FormData): Promise<AdminState> {
  if (!(await isAdmin())) return { message: "Sessão expirada. Entre novamente.", error: true };
  const mode = form.get("modo");
  if (!isSiteMode(mode)) return { message: "Escolha uma das opções.", error: true };
  try {
    await setSiteMode(mode);
  } catch (error) {
    console.error("Falha ao salvar o modo do site:", error);
    return { message: "Não foi possível salvar. Verifique a conexão com a planilha.", error: true };
  }
  updateTag(MODE_TAG);
  revalidatePath("/", "layout");
  return {
    message:
      mode === "vendas-abertas"
        ? "Salvo. A página principal agora mostra as vendas abertas."
        : "Salvo. A página principal agora mostra a pré-venda.",
    error: false,
  };
}
