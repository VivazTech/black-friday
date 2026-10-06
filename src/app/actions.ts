"use server";

import { isValidWhatsapp } from "@/lib/phone";
import { appendLead } from "@/lib/sheets";

export interface LeadInput {
  nome: string;
  sobrenome: string;
  email: string;
  pais: string;
  whatsapp: string;
  consentimento: boolean;
  idioma: string;
  /** Campo isca: visitantes reais deixam vazio. */
  site: string;
}

export type LeadResult = { ok: true } | { ok: false; error: "invalid" | "server" };

const COUNTRIES = ["Brasil", "Paraguai", "Argentina", "Outro"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  if (clean(input?.site, 100)) return { ok: true };

  const lead = {
    nome: clean(input?.nome, 80),
    sobrenome: clean(input?.sobrenome, 80),
    email: clean(input?.email, 160).toLowerCase(),
    pais: clean(input?.pais, 20),
    whatsapp: clean(input?.whatsapp, 25),
    idioma: input?.idioma === "es" ? "es" : "pt",
  };
  const valid =
    lead.nome &&
    lead.sobrenome &&
    EMAIL.test(lead.email) &&
    COUNTRIES.includes(lead.pais) &&
    isValidWhatsapp(lead.whatsapp, lead.pais) &&
    input?.consentimento === true;
  if (!valid) return { ok: false, error: "invalid" };

  try {
    await appendLead(lead);
    return { ok: true };
  } catch (error) {
    console.error("Falha ao gravar cadastro na planilha:", error);
    return { ok: false, error: "server" };
  }
}
