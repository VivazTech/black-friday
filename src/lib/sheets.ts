import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { isSiteMode, modeByDate, type SiteMode } from "./site";

// A planilha do Google guarda os cadastros e a configuração do painel admin.
// O acesso é feito pelo Apps Script publicado como app da Web (ver google-apps-script/Code.gs).
const WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.SHEETS_WEBHOOK_SECRET;

export const MODE_TAG = "site-mode";
export const sheetsConfigured = Boolean(WEBHOOK_URL && WEBHOOK_SECRET);

// Sem planilha configurada (desenvolvimento local), os dados ficam em arquivos na pasta .data.
const LOCAL_DIR = path.join(process.cwd(), ".data");
const LOCAL_MODE = path.join(LOCAL_DIR, "mode.json");
const LOCAL_LEADS = path.join(LOCAL_DIR, "leads.jsonl");

export interface Lead {
  nome: string;
  sobrenome: string;
  email: string;
  pais: string;
  whatsapp: string;
  idioma: string;
}

async function post(payload: Record<string, unknown>) {
  const response = await fetch(WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, secret: WEBHOOK_SECRET }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const result: unknown = await response.json();
  if (!response.ok || !result || typeof result !== "object" || !("ok" in result) || !result.ok) {
    throw new Error(`Planilha recusou a operação: ${JSON.stringify(result)}`);
  }
}

export async function appendLead(lead: Lead) {
  if (sheetsConfigured) {
    await post({ action: "lead", ...lead });
    return;
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.appendFile(LOCAL_LEADS, `${JSON.stringify({ data: new Date().toISOString(), ...lead })}\n`);
}

export async function getSiteMode(): Promise<SiteMode> {
  try {
    if (sheetsConfigured) {
      const response = await fetch(`${WEBHOOK_URL}?action=mode`, {
        next: { tags: [MODE_TAG], revalidate: 60 },
        signal: AbortSignal.timeout(10000),
      });
      const result: unknown = await response.json();
      const mode = result && typeof result === "object" && "mode" in result ? result.mode : null;
      if (isSiteMode(mode)) return mode;
      throw new Error(`Resposta inesperada da planilha: ${JSON.stringify(result)}`);
    }
    const saved: unknown = JSON.parse(await fs.readFile(LOCAL_MODE, "utf8"));
    const mode = saved && typeof saved === "object" && "mode" in saved ? saved.mode : null;
    if (isSiteMode(mode)) return mode;
  } catch (error) {
    if (sheetsConfigured) console.error("Falha ao ler o modo do site na planilha:", error);
  }
  return modeByDate();
}

export async function setSiteMode(mode: SiteMode) {
  if (sheetsConfigured) {
    await post({ action: "setMode", mode });
    return;
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(LOCAL_MODE, JSON.stringify({ mode }));
}
