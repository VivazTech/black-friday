import Link from "next/link";
import { getContent, localePath, type Locale } from "@/content";
import { Countdown } from "./Countdown";

interface TopbarProps {
  locale: Locale;
  /** Conteúdo exibido: pré-venda (cadastro) ou vendas (calendário). */
  variant: "preSale" | "sales";
  /** Rota atual, para o seletor de idioma apontar para a página equivalente. */
  route: "home" | "sales";
}

export function Topbar({ locale, variant, route }: TopbarProps) {
  const t = getContent(locale);
  const sales = variant === "sales";

  return (
    <header className="topbar wrap">
      <a className="brand" href="#inicio" aria-label={t.topbar.brandLabel}>
        <span className="brand-leaf">◈</span>
        <span>
          <strong>VIVAZ</strong>
          <small>CATARATAS</small>
        </span>
      </a>
      <Countdown locale={locale} variant={variant} />
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
