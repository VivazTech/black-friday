import type { CalendarConfig } from "./calendar";
import type { SiteMode } from "./site";

export interface SiteSettings {
  livePage: SiteMode;
  switchAt: string | null;
  switchTo: SiteMode | null;
  countdownStart: string;
  countdownEnd: string;
  promoVideoUrl: string;
  promoPosterUrl: string;
  aquaVideoUrl: string;
  aquaPosterUrl: string;
  whatsappCommunityPt: string;
  whatsappCommunityEs: string;
  calendar: CalendarConfig;
  updatedAt: string;
}

export interface FooterContent {
  locale: "pt" | "es";
  logoAlt: string;
  tagline: string;
  resortTitle: string;
  aboutLabel: string;
  aboutHref: string;
  privacyLabel: string;
  privacyHref: string;
  termsLabel: string;
  termsHref: string;
  contactsTitle: string;
  phones: string;
  address: string;
  serviceTitle: string;
  hours: string;
}

export interface FaqItem {
  id: string;
  locale: "pt" | "es";
  variant: "pre-venda" | "vendas-abertas";
  question: string;
  answer: string;
  sortOrder: number;
}

export interface LeadRow {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  pais: string;
  whatsapp: string;
  idioma: string;
  createdAt: string;
}

export interface Campaign {
  source: "database" | "fallback";
  settings: SiteSettings;
  footers: FooterContent[];
  faqs: FaqItem[];
}

export const PAGE_LABEL: Record<SiteMode, string> = {
  "pre-venda": "Pré-venda",
  "vendas-abertas": "Vendas abertas",
};

const SAO_PAULO = "America/Sao_Paulo";

/** Página que estaria no ar em um instante. A troca agendada vale a partir da data marcada. */
export function pageAt(
  settings: Pick<SiteSettings, "livePage" | "switchAt" | "switchTo">,
  at: number,
): SiteMode {
  if (settings.switchAt && settings.switchTo && new Date(settings.switchAt).getTime() <= at) {
    return settings.switchTo;
  }
  return settings.livePage;
}

export function isoToDateTimeLocal(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SAO_PAULO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${pick("year")}-${pick("month")}-${pick("day")}T${pick("hour")}:${pick("minute")}`;
}

/** O campo datetime-local não traz fuso: o painel trabalha no horário de Brasília. */
export function dateTimeLocalToIso(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const date = new Date(`${trimmed}:00-03:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: SAO_PAULO,
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
