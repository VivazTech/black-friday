"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { isAdmin, signIn, signOut } from "@/lib/auth";
import { adminCall } from "@/lib/campaign";
import { isSafeHref, isSafeMediaUrl } from "@/lib/media";
import { dateTimeLocalToIso } from "@/lib/schedule";
import { BASE_PATH, isSiteMode } from "@/lib/site";
import { createAuthClient } from "@/lib/supabase/server";

export interface AdminState {
  message: string;
  error: boolean;
  done: boolean;
  stamp: number;
}

const fail = (message: string): AdminState => ({ message, error: true, done: false, stamp: Date.now() });
const ok = (message: string): AdminState => ({ message, error: false, done: true, stamp: Date.now() });

function text(form: FormData, name: string, max: number) {
  const value = form.get(name);
  return (typeof value === "string" ? value : "").trim().slice(0, max);
}

async function gate() {
  return (await isAdmin()) ? null : fail("Sessão expirada. Entre novamente.");
}

function refreshSite() {
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath("/vendas-abertas");
  revalidatePath("/es");
  revalidatePath("/es/vendas-abertas");
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function resetRedirect() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}${BASE_PATH}/admin/auth/callback`;
}

export async function login(_: AdminState, form: FormData): Promise<AdminState> {
  const email = text(form, "email", 160).toLowerCase();
  const password = form.get("senha");
  const remember = form.get("lembrar") === "on";
  if (!EMAIL.test(email) || typeof password !== "string" || password.length < 8) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fail("E-mail ou senha incorretos.");
  }
  try {
    await signIn(email, password, remember);
  } catch (error) {
    console.error("Falha no login:", error);
    await new Promise((resolve) => setTimeout(resolve, 800));
    return fail("E-mail ou senha incorretos.");
  }
  revalidatePath("/admin");
  return ok("");
}

export async function requestReset(_: AdminState, form: FormData): Promise<AdminState> {
  const email = text(form, "email", 160).toLowerCase();
  if (!EMAIL.test(email)) return fail("Informe um e-mail válido.");
  try {
    const supabase = await createAuthClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: await resetRedirect() });
    if (error) throw error;
  } catch (error) {
    console.error("Falha ao enviar a redefinição de senha:", error);
    const message = error instanceof Error ? error.message : "";
    if (/redirect/i.test(message)) {
      return fail("O link de redefinição ainda não está liberado no Supabase. Inclua a URL do painel em Authentication > URL Configuration.");
    }
    return fail("Não foi possível enviar o e-mail agora. Tente de novo em instantes.");
  }
  return ok("Se esse e-mail tiver acesso ao painel, enviamos o link para redefinir a senha.");
}

export async function updatePassword(_: AdminState, form: FormData): Promise<AdminState> {
  const password = form.get("senha");
  const confirm = form.get("confirmar");
  if (typeof password !== "string" || password.length < 8 || password.length > 72) {
    return fail("A senha precisa ter entre 8 e 72 caracteres.");
  }
  if (password !== confirm) return fail("A confirmação da senha não confere.");
  try {
    const supabase = await createAuthClient(true);
    const { data, error: claimsError } = await supabase.auth.getClaims();
    if (claimsError || !data?.claims?.sub) return fail("O link expirou. Peça um novo em Esqueci a senha.");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  } catch (error) {
    console.error("Falha ao redefinir a senha:", error);
    return fail("Não foi possível salvar a nova senha.");
  }
  revalidatePath("/admin");
  return ok("");
}

export async function logout() {
  await signOut();
  revalidatePath("/admin");
}

export async function saveSchedule(_: AdminState, form: FormData): Promise<AdminState> {
  const denied = await gate();
  if (denied) return denied;
  const live = form.get("live");
  if (!isSiteMode(live)) return fail("Escolha a página que fica no ar.");

  const switchRaw = text(form, "switchAt", 40);
  const targetRaw = text(form, "switchTo", 20);
  const switchAt = switchRaw ? dateTimeLocalToIso(switchRaw) : null;
  if (switchRaw && !switchAt) return fail("Data da troca inválida.");
  const hasTarget = targetRaw.length > 0;
  if (switchAt && !hasTarget) return fail("Escolha a página que entra no ar na data marcada.");
  if (!switchAt && hasTarget) return fail("Informe a data e a hora da troca, ou limpe a página de destino.");
  if (hasTarget && !isSiteMode(targetRaw)) return fail("Escolha a página da troca.");

  let livePage = live;
  let when = switchAt;
  let target = hasTarget && isSiteMode(targetRaw) ? targetRaw : null;
  let message =
    livePage === "vendas-abertas"
      ? "Salvo. A página principal mostra as vendas abertas."
      : "Salvo. A página principal mostra a pré-venda.";

  if (when && target && new Date(when).getTime() <= Date.now()) {
    livePage = target;
    when = null;
    target = null;
    message = "O horário já passou. A página foi trocada agora.";
  } else if (when && target) {
    message = `Salvo. Em ${new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(when))} a página passa a ser ${target === "vendas-abertas" ? "vendas abertas" : "pré-venda"}.`;
  }

  try {
    await adminCall("admin_patch_settings", {
      live_page: livePage,
      switch_at: when ?? "",
      switch_to: target ?? "",
    });
  } catch (error) {
    console.error("Falha ao salvar a página no ar:", error);
    return fail("Não foi possível salvar a página no ar.");
  }
  refreshSite();
  return ok(message);
}

export async function saveCountdown(_: AdminState, form: FormData): Promise<AdminState> {
  const denied = await gate();
  if (denied) return denied;
  const start = dateTimeLocalToIso(text(form, "start", 40));
  const end = dateTimeLocalToIso(text(form, "end", 40));
  if (!start || !end) return fail("Informe o início e o fim do contador.");
  if (new Date(end).getTime() <= new Date(start).getTime()) {
    return fail("O fim do contador precisa ser depois do início.");
  }
  try {
    await adminCall("admin_patch_settings", { countdown_start: start, countdown_end: end });
  } catch (error) {
    console.error("Falha ao salvar o contador:", error);
    return fail("Não foi possível salvar o contador.");
  }
  refreshSite();
  return ok("Contador atualizado.");
}

export async function saveVideos(_: AdminState, form: FormData): Promise<AdminState> {
  const denied = await gate();
  if (denied) return denied;
  const names = ["promo_video_url", "promo_poster_url", "aqua_video_url", "aqua_poster_url"] as const;
  const payload: Record<string, string> = {};
  for (const name of names) {
    const value = text(form, name, 500);
    if (!isSafeMediaUrl(value)) return fail("Use um link http(s) ou um caminho que comece com /.");
    payload[name] = value;
  }
  try {
    await adminCall("admin_patch_settings", payload);
  } catch (error) {
    console.error("Falha ao salvar os vídeos:", error);
    return fail("Não foi possível salvar os vídeos.");
  }
  refreshSite();
  return ok("Vídeos atualizados.");
}

function communityLink(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || !url.hostname) return null;
    return value.slice(0, 500);
  } catch {
    return null;
  }
}

export async function saveCommunity(_: AdminState, form: FormData): Promise<AdminState> {
  const denied = await gate();
  if (denied) return denied;
  const portuguese = communityLink(text(form, "whatsapp_community_pt", 500));
  const spanish = communityLink(text(form, "whatsapp_community_es", 500));
  if (portuguese === null || spanish === null) {
    return fail("Use um link https da comunidade, ou deixe o campo em branco.");
  }
  try {
    await adminCall("admin_patch_settings", {
      whatsapp_community_pt: portuguese,
      whatsapp_community_es: spanish,
    });
  } catch (error) {
    console.error("Falha ao salvar a comunidade:", error);
    return fail("Não foi possível salvar os links da comunidade.");
  }
  refreshSite();
  return ok("Links da comunidade atualizados.");
}

export async function saveFooter(_: AdminState, form: FormData): Promise<AdminState> {
  const denied = await gate();
  if (denied) return denied;
  const locale = text(form, "locale", 2);
  if (locale !== "pt" && locale !== "es") return fail("Escolha o idioma.");
  const hrefs = [text(form, "aboutHref", 300), text(form, "privacyHref", 300), text(form, "termsHref", 300)];
  if (hrefs.some((href) => !isSafeHref(href))) return fail("Use links http(s), caminhos internos ou âncoras como #contato.");

  const payload = {
    locale,
    logo_alt: text(form, "logoAlt", 160),
    tagline: text(form, "tagline", 300),
    resort_title: text(form, "resortTitle", 80),
    about_label: text(form, "aboutLabel", 80),
    about_href: hrefs[0],
    privacy_label: text(form, "privacyLabel", 80),
    privacy_href: hrefs[1],
    terms_label: text(form, "termsLabel", 80),
    terms_href: hrefs[2],
    contacts_title: text(form, "contactsTitle", 80),
    phones: text(form, "phones", 400),
    address: text(form, "address", 300),
    service_title: text(form, "serviceTitle", 80),
    hours: text(form, "hours", 400),
  };

  try {
    await adminCall("admin_save_footer", payload);
  } catch (error) {
    console.error("Falha ao salvar o rodapé:", error);
    return fail("Não foi possível salvar o rodapé.");
  }
  refreshSite();
  return ok(locale === "pt" ? "Rodapé em português atualizado." : "Rodapé em espanhol atualizado.");
}

export async function saveFaqs(_: AdminState, form: FormData): Promise<AdminState> {
  const denied = await gate();
  if (denied) return denied;
  const locale = text(form, "locale", 2);
  const variant = text(form, "variant", 20);
  if ((locale !== "pt" && locale !== "es") || (variant !== "pre-venda" && variant !== "vendas-abertas")) {
    return fail("Escolha o idioma e a página.");
  }
  let parsed: unknown;
  try {
    const raw = form.get("items");
    parsed = JSON.parse(typeof raw === "string" ? raw : "");
  } catch {
    return fail("A lista de perguntas está inválida.");
  }
  if (!Array.isArray(parsed) || parsed.length > 40) return fail("Use no máximo 40 perguntas.");

  const items: { question: string; answer: string }[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") return fail("Há uma pergunta inválida na lista.");
    const question = String("question" in item ? item.question : "").trim().slice(0, 300);
    const answer = String("answer" in item ? item.answer : "").trim().slice(0, 2000);
    if (!question || !answer) return fail("Preencha a pergunta e a resposta, ou remova a linha vazia.");
    items.push({ question, answer });
  }

  try {
    await adminCall("admin_save_faqs", { locale, variant, items });
  } catch (error) {
    console.error("Falha ao salvar as dúvidas:", error);
    return fail("Não foi possível salvar as dúvidas.");
  }
  refreshSite();
  return ok("Dúvidas atualizadas.");
}
