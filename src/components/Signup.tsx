"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { submitLead } from "@/app/actions";
import { getContent, type Locale } from "@/content";
import { formatWhatsapp, isValidWhatsapp } from "@/lib/phone";

function SignupForm({ locale }: { locale: Locale }) {
  const t = getContent(locale).signup;
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [pending, startTransition] = useTransition();

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
      if (ok) form.reset();
      setMessage({ text: ok ? t.success : t.errorServer, error: !ok });
    });
  };

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
          defaultValue={t.countries[0].value}
          onChange={(event) => {
            const whatsapp = event.currentTarget.form?.elements.namedItem("whatsapp");
            if (whatsapp instanceof HTMLInputElement) {
              whatsapp.value = formatWhatsapp(whatsapp.value, event.currentTarget.value);
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
          placeholder={locale === "pt" ? "(45) 99999-9999" : "+595 981 123456"}
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

export function SignupSection({ locale }: { locale: Locale }) {
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
      <div ref={card} className={`signup-card wrap reveal${visible ? " visible" : ""}`}>
        <div className="signup-copy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="signup-title">{t.title}</h2>
          <p>{t.text}</p>
        </div>
        <SignupForm locale={locale} />
      </div>
    </section>
  );
}
