import type { Metadata } from "next";
import { getContent, localePath, type Locale } from "@/content";
import { getLivePage } from "@/lib/campaign";
import { BASE_PATH } from "@/lib/site";
import PreSalePage from "./PreSalePage";
import SalesPage from "./SalesPage";

type PageKey = "home" | "sales";
const url = (locale: Locale, page: PageKey) => `${BASE_PATH}${localePath(locale, page)}`.replace(/\/$/, "");
const languages = (page: PageKey) => ({ "pt-BR": url("pt", page), es: url("es", page) });

/** Página principal: mostra a pré-venda ou as vendas conforme o painel admin. */
export async function HomePage({ locale }: { locale: Locale }) {
  if ((await getLivePage()) === "vendas-abertas") return <SalesPage locale={locale} route="home" />;
  return <PreSalePage locale={locale} />;
}

export async function homeMetadata(locale: Locale): Promise<Metadata> {
  const meta = getContent(locale).meta;
  const sales = (await getLivePage()) === "vendas-abertas";
  return {
    ...(sales ? meta.sales : meta.preSale),
    alternates: { canonical: url(locale, "home"), languages: languages("home") },
  };
}

// /vendas-abertas fica fora dos buscadores: a página oficial é sempre a principal.
export function salesMetadata(locale: Locale): Metadata {
  return {
    ...getContent(locale).meta.sales,
    robots: { index: false, follow: false },
    alternates: { languages: languages("sales") },
  };
}
