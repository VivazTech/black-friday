import type { Locale } from "@/content";
import { getContent } from "@/content";
import { getCampaign } from "@/lib/campaign";
import { BASE_PATH } from "@/lib/site";
import { Badges, PatternStrip } from "../Badges";
import { Booking } from "../Booking";
import { Gallery } from "../Gallery";
import { SalesHero } from "../Hero";
import { AquaSection, FaqSection, FinalCta, Footer, Reviews } from "../Sections";

interface SalesPageProps {
  locale: Locale;
  /** Rota em que a página está sendo exibida (a principal ou /vendas-abertas). */
  route: "home" | "sales";
}

/** Página de vendas abertas: calendário de datas e descontos. */
export default async function SalesPage({ locale, route }: SalesPageProps) {
  const { settings } = await getCampaign();
  return (
    <>
      {/* O sales.css altera seções compartilhadas com a pré-venda, por isso fica fora do bundle
          global e só é carregado aqui. A precedência o posiciona depois do styles.css. */}
      <link rel="stylesheet" href={`${BASE_PATH}/css/sales.css?v=1`} precedence="sales" />
      <a className="skip-link" href="#conteudo">
        {getContent(locale).skipLink}
      </a>
      <main id="conteudo">
        <SalesHero locale={locale} route={route} />
        <Booking locale={locale} calendar={settings.calendar} />
        <Badges locale={locale} />
        <PatternStrip />
        <AquaSection locale={locale} variant="sales" />
        <PatternStrip />
        <Gallery locale={locale} />
        <Reviews locale={locale} />
        <FaqSection locale={locale} variant="sales" />
        <FinalCta locale={locale} variant="sales" />
        <Footer locale={locale} />
      </main>
    </>
  );
}
