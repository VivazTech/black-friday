"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import Script from "next/script";
import { submitLead } from "@/app/actions";
import { getContent, type Locale } from "@/content";
import { ConfettiBurst } from "./ConfettiBurst";
import { formatWhatsapp, isValidWhatsapp, whatsappPlaceholder } from "@/lib/phone";

const CRM_BASE = "https://app-3SMNL3WF4K.marketingautomation.services/webforms/receivePostback/MzY0NjAwtLQwAQA/";
const CRM_ENDPOINT = "afdd2635-e2f2-4f73-a373-1a02243b3211";
const CRM_SCRIPT = "https://koi-3SMNL3WF4K.marketingautomation.services/client/noform.js?ver=1.24";

type CrmQueue = { push: (command: unknown[]) => void };

declare global {
  interface Window {
    __ss_noform?: CrmQueue;
  }
}

function crmQueue(): CrmQueue {
  if (!window.__ss_noform) window.__ss_noform = [] as unknown as CrmQueue;
  return window.__ss_noform;
}

function sendLeadToCrm() {
  const queue = crmQueue();
  queue.push(["baseURI", CRM_BASE]);
  queue.push(["endpoint", CRM_ENDPOINT]);
  queue.push(["submitType", "manual"]);
  queue.push(["form", "signup-form", CRM_ENDPOINT]);
  queue.push(["exclude", "site"]);
  queue.push(["submit", undefined, CRM_ENDPOINT]);
}

function communityUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname ? url.href : "";
  } catch {
    return "";
  }
}

function SignupForm({ locale, communityHref }: { locale: Locale; communityHref: string }) {
  const t = getContent(locale).signup;
  const [country, setCountry] = useState(t.countries[0].value);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!done || !communityHref) return;
    const timer = window.setTimeout(() => {
      window.location.assign(communityHref);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [done, communityHref]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = form.elements as unknown as Record<string, HTMLInputElement>;
    fields.whatsapp.setCustomValidity("");
    if (!form.reportValidity()) {
      setMessage({ text: t.errorRequired, error: true });
      return;
    }
    if (!isValidWhatsapp(fields.whatsapp.value, fields.pais.value)) {
      fields.whatsapp.setCustomValidity(t.errorWhatsapp);
      fields.whatsapp.reportValidity();
      setMessage({ text: t.errorWhatsapp, error: true });
      return;
    }
    setMessage(null);
    startTransition(async () => {
      let ok = false;
      try {
        const result = await submitLead({
          nome: fields.nome.value,
          sobrenome: fields.sobrenome.value,
          email: fields.email.value,
          pais: fields.pais.value,
          whatsapp: fields.whatsapp.value,
          consentimento: fields.consentimento.checked,
          idioma: locale,
          site: fields.site.value,
        });
        ok = result.ok;
      } catch {
        // Falha de rede: tratada como erro de envio.
      }
      if (ok) {
        if (!fields.site.value.trim()) sendLeadToCrm();
        form.reset();
        setCountry(t.countries[0].value);
        setDone(true);
        return;
      }
      setMessage({ text: t.errorServer, error: true });
    });
  };

  if (done) {
    return (
      <div className="signup-thanks" role="status">
        <ConfettiBurst />
        <h3>{t.thanksTitle}</h3>
        <p>{t.success}</p>
      </div>
    );
  }

  return (
    <form id="signup-form" noValidate onSubmit={onSubmit}>
      <h3>{t.formTitle}</h3>
      <p>{t.formText}</p>
      <div className="form-row">
        <label>
          {t.firstName}
          <input name="nome" type="text" placeholder={t.firstNamePlaceholder} autoComplete="given-name" required />
        </label>
        <label>
          {t.lastName}
          <input
            name="sobrenome"
            type="text"
            placeholder={t.lastNamePlaceholder}
            autoComplete="family-name"
            required
          />
        </label>
      </div>
      <label>
        {t.email}
        <input name="email" type="email" placeholder={t.emailPlaceholder} autoComplete="email" required />
      </label>
      <label>
        {t.country}
        <select
          name="pais"
          required
          value={country}
          onChange={(event) => {
            const next = event.currentTarget.value;
            setCountry(next);
            const whatsapp = event.currentTarget.form?.elements.namedItem("whatsapp");
            if (whatsapp instanceof HTMLInputElement) {
              whatsapp.value = formatWhatsapp(whatsapp.value, next);
              whatsapp.setCustomValidity("");
            }
          }}
        >
          {t.countries.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t.whatsapp}
        <input
          name="whatsapp"
          type="tel"
          placeholder={whatsappPlaceholder(country)}
          autoComplete="tel"
          required
          onInput={(event) => {
            const input = event.currentTarget;
            const country = (input.form?.elements.namedItem("pais") as HTMLSelectElement).value;
            input.value = formatWhatsapp(input.value, country);
            input.setCustomValidity("");
          }}
        />
      </label>
      <div className="signup-trap" aria-hidden="true">
        <label>
          Site
          <input name="site" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input name="consentimento" type="checkbox" required />
        <span>{t.consent}</span>
      </label>
      <button className="button button-yellow submit" type="submit" disabled={pending}>
        {pending ? t.sending : getContent(locale).cta.early}
      </button>
      <p className="form-note">{t.note}</p>
      <p
        className={`form-message${message?.error ? " error" : ""}`}
        id="form-message"
        role="status"
        aria-live="polite"
      >
        {message?.text}
      </p>
    </form>
  );
}

export function SignupSection({ locale, communityHref }: { locale: Locale; communityHref: string }) {
  const t = getContent(locale).signup;
  const card = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!card.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(card.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="signup-section" id="cadastro" aria-labelledby="signup-title">
      <Script id="crm-form-init" strategy="afterInteractive">
        {`var __ss_noform = __ss_noform || [];
__ss_noform.push(['baseURI', '${CRM_BASE}']);
__ss_noform.push(['endpoint', '${CRM_ENDPOINT}']);
__ss_noform.push(['submitType', 'manual']);
__ss_noform.push(['form', 'signup-form', '${CRM_ENDPOINT}']);
__ss_noform.push(['exclude', 'site']);`}
      </Script>
      <Script src={CRM_SCRIPT} strategy="afterInteractive" />
      <div ref={card} className={`signup-card wrap reveal${visible ? " visible" : ""}`}>
        <div className="signup-copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="signup-title">{t.title}</h2>
          <p>{t.text}</p>
        </div>
        <SignupForm locale={locale} communityHref={communityUrl(communityHref)} />
      </div>
    </section>
  );
}
