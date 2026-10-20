import type { Locale } from "@/content";
import { getContent } from "@/content";
import { BASE_PATH } from "@/lib/site";
import { PatternStrip } from "../Badges";
import { Gallery } from "../Gallery";
import { PreSaleHero } from "../Hero";
import { AquaSection, FaqSection, FinalCta, Footer, HowSection, Reviews } from "../Sections";
import { SignupSection } from "../Signup";

/** Página de pré-venda: cadastro para acesso antecipado. */
export default async function PreSalePage({ locale }: { locale: Locale }) {
  const vipHref = locale === "es" ? `${BASE_PATH}/vip-es` : `${BASE_PATH}/vip-br`;

  return (
    <>
      <a className="skip-link" href="#conteudo">
        {getContent(locale).skipLink}
      </a>
      <main id="conteudo">
        <PreSaleHero locale={locale} />
        <SignupSection locale={locale} vipHref={vipHref} />
        <PatternStrip />
        <HowSection locale={locale} />
        <PatternStrip />
        <AquaSection locale={locale} variant="preSale" />
        <Gallery locale={locale} />
        <Reviews locale={locale} />
        <FaqSection locale={locale} variant="preSale" />
        <FinalCta locale={locale} variant="preSale" />
        <Footer locale={locale} />
      </main>
    </>
  );
}
