import { es } from "./es";
import { pt } from "./pt";
import type { Content, Locale } from "./types";

export type { Content, Locale } from "./types";

const dictionaries: Record<Locale, Content> = { pt, es };

export function getContent(locale: Locale): Content {
  return dictionaries[locale];
}

// Caminhos relativos ao basePath (/black-friday).
export function localePath(locale: Locale, page: "home" | "sales" = "home"): string {
  const prefix = locale === "es" ? "/es" : "";
  return page === "sales" ? `${prefix}/vendas-abertas` : prefix || "/";
}
