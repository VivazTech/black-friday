"use client";

import { useEffect } from "react";
import type { Locale } from "@/content";
import { getContent } from "@/content";

function safeHttps(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname ? url.href : "";
  } catch {
    return "";
  }
}

/** Página intermediária para o GTM rastrear o formulário antes de abrir o WhatsApp. */
export function VipRedirect({ locale, destination }: { locale: Locale; destination: string }) {
  const href = safeHttps(destination);
  const t = getContent(locale).signup;

  useEffect(() => {
    if (!href) return;
    const timer = window.setTimeout(() => {
      window.location.replace(href);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [href]);

  return (
    <main className="vip-redirect" id="conteudo">
      <div className="vip-redirect-card">
        <h1>{t.thanksTitle}</h1>
        <p>{t.success}</p>
        {href ? (
          <p>
            <a className="button button-yellow" href={href}>
              {t.community}
            </a>
          </p>
        ) : null}
      </div>
    </main>
  );
}
