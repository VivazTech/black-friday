import Link from "next/link";
import { getContent, localePath, type Locale } from "@/content";
import { getCampaign } from "@/lib/campaign";
import { Countdown } from "./Countdown";

interface TopbarProps {
  locale: Locale;
  /** Conteúdo exibido: pré-venda (cadastro) ou vendas (calendário). */
  variant: "preSale" | "sales";
  /** Rota atual, para o seletor de idioma apontar para a página equivalente. */
  route: "home" | "sales";
}

export async function Topbar({ locale, variant, route }: TopbarProps) {
  const t = getContent(locale);
  const sales = variant === "sales";
  const { settings } = await getCampaign();
  const opening = new Date(settings.countdownStart).getTime();
  const closing = new Date(settings.countdownEnd).getTime();

  return (
    <header className="topbar wrap">
      <a className="brand" href="#inicio" aria-label={t.topbar.brandLabel} />
      <Countdown locale={locale} variant={variant} opening={opening} closing={closing} />
      <div className="header-actions">
        <a className="button button-yellow header-cta" href={sales ? "#calendario" : "#cadastro"}>
          {sales ? t.cta.dates : t.cta.early}
        </a>
        <a className="button button-white contact-link" href="#contato">
          {sales ? t.topbar.support : t.topbar.contact}
        </a>
        <nav className="lang" aria-label={t.topbar.langLabel}>
          {(["pt", "es"] as const).map((language) => (
            <Link
              key={language}
              href={localePath(language, route)}
              className={language === locale ? "active" : undefined}
              aria-current={language === locale ? "page" : undefined}
              hrefLang={language === "pt" ? "pt-BR" : "es"}
              prefetch={false}
            >
              {language.toUpperCase()}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
