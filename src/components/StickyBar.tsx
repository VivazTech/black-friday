"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { getContent, localePath, type Locale } from "@/content";
import { Countdown } from "./Countdown";

interface StickyBarProps {
  locale: Locale;
  variant: "preSale" | "sales";
  route: "home" | "sales";
  opening: number;
  closing: number;
}

export function StickyBar({ locale, variant, route, opening, closing }: StickyBarProps) {
  const t = getContent(locale);
  const sales = variant === "sales";
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = window.scrollY > 72;
        setVisible((current) => (current === next ? current : next));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={`sticky-bar${visible ? " is-visible" : ""}`} aria-hidden={visible ? undefined : true} inert={visible ? undefined : true}>
      <a className="brand" href="#inicio" aria-label={t.topbar.brandLabel} />
      <Countdown locale={locale} variant={variant} opening={opening} closing={closing} />
      <div className="sticky-actions">
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
    </div>,
    document.body,
  );
}
