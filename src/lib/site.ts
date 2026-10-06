export const BASE_PATH = "/black-friday";

export const CAMPAIGN_START = new Date("2026-11-23T00:00:00-03:00").getTime();
export const CAMPAIGN_END = new Date("2026-11-30T00:00:00-03:00").getTime();

export type SiteMode = "pre-venda" | "vendas-abertas";

export function isSiteMode(value: unknown): value is SiteMode {
  return value === "pre-venda" || value === "vendas-abertas";
}

// Usado quando a planilha não responde: antes da abertura mostra a pré-venda, depois as vendas.
export function modeByDate(now = Date.now()): SiteMode {
  return now >= CAMPAIGN_START ? "vendas-abertas" : "pre-venda";
}
