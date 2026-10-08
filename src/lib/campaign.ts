import "server-only";

import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { sanitizeCalendar } from "./calendar";
import { CAMPAIGN_END, CAMPAIGN_START, isSiteMode, type SiteMode } from "./site";
import { getSiteMode as getSheetsMode } from "./sheets";
import type { Campaign, FaqItem, FooterContent, LeadRow, SiteSettings } from "./schedule";

export type { Campaign };

export const supabaseConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);

function client(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

function fallbackSettings(): SiteSettings {
  return {
    livePage: "pre-venda",
    switchAt: null,
    switchTo: null,
    countdownStart: new Date(CAMPAIGN_START).toISOString(),
    countdownEnd: new Date(CAMPAIGN_END).toISOString(),
    promoVideoUrl: "",
    promoPosterUrl: "",
    aquaVideoUrl: "",
    aquaPosterUrl: "",
    whatsappCommunityPt: "",
    whatsappCommunityEs: "",
    calendar: sanitizeCalendar({}),
    updatedAt: "",
  };
}

function mapSettings(row: Record<string, unknown>): SiteSettings {
  const live = row.live_page;
  const target = row.switch_to;
  return {
    livePage: isSiteMode(live) ? live : "pre-venda",
    switchAt: typeof row.switch_at === "string" ? row.switch_at : null,
    switchTo: isSiteMode(target) ? target : null,
    countdownStart: String(row.countdown_start),
    countdownEnd: String(row.countdown_end),
    promoVideoUrl: String(row.promo_video_url ?? ""),
    promoPosterUrl: String(row.promo_poster_url ?? ""),
    aquaVideoUrl: String(row.aqua_video_url ?? ""),
    aquaPosterUrl: String(row.aqua_poster_url ?? ""),
    whatsappCommunityPt: String(row.whatsapp_community_pt ?? ""),
    whatsappCommunityEs: String(row.whatsapp_community_es ?? ""),
    calendar: sanitizeCalendar(row.calendar),
    updatedAt: String(row.updated_at ?? ""),
  };
}

function mapFooter(row: Record<string, unknown>): FooterContent | null {
  if (row.locale !== "pt" && row.locale !== "es") return null;
  return {
    locale: row.locale,
    logoAlt: String(row.logo_alt ?? ""),
    tagline: String(row.tagline ?? ""),
    resortTitle: String(row.resort_title ?? ""),
    aboutLabel: String(row.about_label ?? ""),
    aboutHref: String(row.about_href ?? ""),
    privacyLabel: String(row.privacy_label ?? ""),
    privacyHref: String(row.privacy_href ?? ""),
    termsLabel: String(row.terms_label ?? ""),
    termsHref: String(row.terms_href ?? ""),
    contactsTitle: String(row.contacts_title ?? ""),
    phones: String(row.phones ?? ""),
    address: String(row.address ?? ""),
    serviceTitle: String(row.service_title ?? ""),
    hours: String(row.hours ?? ""),
  };
}

function mapFaq(row: Record<string, unknown>): FaqItem | null {
  if ((row.locale !== "pt" && row.locale !== "es") || (row.variant !== "pre-venda" && row.variant !== "vendas-abertas")) {
    return null;
  }
  return {
    id: String(row.id),
    locale: row.locale,
    variant: row.variant,
    question: String(row.question ?? ""),
    answer: String(row.answer ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

export const getCampaign = cache(async (): Promise<Campaign> => {
  const db = client();
  if (!db) return { source: "fallback", settings: fallbackSettings(), footers: [], faqs: [] };

  try {
    const applied = await db.rpc("apply_due_switch");
    if (applied.error) console.error("Falha ao aplicar a troca agendada:", applied.error.message);

    const [settingsRes, footerRes, faqRes] = await Promise.all([
      db.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      db.from("footer_content").select("*"),
      db.from("faqs").select("*").order("sort_order", { ascending: true }),
    ]);

    if (settingsRes.error || !settingsRes.data) {
      console.error("Falha ao ler a configuração:", settingsRes.error?.message);
      return { source: "fallback", settings: fallbackSettings(), footers: [], faqs: [] };
    }

    return {
      source: "database",
      settings: mapSettings(settingsRes.data),
      footers: (footerRes.data ?? []).map((row) => mapFooter(row)).filter((row): row is FooterContent => row !== null),
      faqs: (faqRes.data ?? []).map((row) => mapFaq(row)).filter((row): row is FaqItem => row !== null),
    };
  } catch (error) {
    console.error("Falha ao ler a campanha no Supabase:", error);
    return { source: "fallback", settings: fallbackSettings(), footers: [], faqs: [] };
  }
});

/** Página no ar. Com o Supabase configurado, a troca agendada já foi aplicada. */
export async function getLivePage(): Promise<SiteMode> {
  const campaign = await getCampaign();
  if (campaign.source === "database") return campaign.settings.livePage;
  return getSheetsMode();
}

export async function insertLead(lead: {
  nome: string;
  sobrenome: string;
  email: string;
  pais: string;
  whatsapp: string;
  idioma: string;
}) {
  const db = client();
  if (!db) throw new Error("Supabase indisponível");
  const { error } = await db.from("leads").insert(lead);
  if (error) throw error;
}

export async function listLeads(): Promise<LeadRow[]> {
  const data = await adminCall("admin_list_leads");
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const item = row as Record<string, unknown>;
    return {
      id: String(item.id),
      nome: String(item.nome ?? ""),
      sobrenome: String(item.sobrenome ?? ""),
      email: String(item.email ?? ""),
      pais: String(item.pais ?? ""),
      whatsapp: String(item.whatsapp ?? ""),
      idioma: String(item.idioma ?? ""),
      createdAt: String(item.created_at ?? ""),
    };
  });
}

export interface PanelUser {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  locked: boolean;
}

export async function listPanelUsers(): Promise<PanelUser[]> {
  const data = await adminCall("admin_list_users");
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const item = row as Record<string, unknown>;
    return {
      id: String(item.id),
      email: String(item.email ?? ""),
      createdAt: String(item.created_at ?? ""),
      lastSignInAt: typeof item.last_sign_in_at === "string" ? item.last_sign_in_at : null,
      locked: item.locked === true,
    };
  });
}

export async function adminCall(
  fn: "admin_list_leads" | "admin_list_users" | "admin_patch_settings" | "admin_save_footer" | "admin_save_faqs" | "admin_save_user" | "admin_delete_user",
  payload?: unknown,
) {
  const db = client();
  const token = process.env.SUPABASE_ADMIN_TOKEN ?? "";
  if (!db || !token) throw new Error("Supabase não configurado.");
  const args = payload === undefined ? { p_token: token } : { p_token: token, p_payload: payload };
  const { data, error } = await db.rpc(fn, args);
  if (error) throw new Error(error.message);
  return data;
}
