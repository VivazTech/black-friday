import Image from "next/image";
import aquaPoster from "@/assets/aqua-poster.webp";
import footerLogo from "@/assets/footer-logo.png";
import promoPoster from "@/assets/promo-poster.webp";
import { getContent, type Locale } from "@/content";
import { BASE_PATH } from "@/lib/site";
import { LoopVideo, PromoVideo } from "./Videos";

type Variant = "preSale" | "sales";
interface SectionProps {
  locale: Locale;
  variant: Variant;
}

export function HowSection({ locale }: { locale: Locale }) {
  const t = getContent(locale).how;

  return (
    <section className="how-section" id="como-funciona" aria-labelledby="how-title">
      <div className="wrap">
        <p className="eyebrow yellow">{t.eyebrow}</p>
        <h2 id="how-title">{t.title}</h2>
        <p className="section-intro">{t.intro}</p>
        <div className="how-grid">
          <PromoVideo
            src={`${BASE_PATH}/videos/black-friday-15s.mp4`}
            poster={promoPoster.src}
            label={t.videoLabel}
            playLabel={t.playLabel}
            fallback={t.videoFallback}
          />
          <div className="steps">
            {t.steps.map((step, index) => (
              <article key={step.title}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AquaSection({ locale, variant }: SectionProps) {
  const t = getContent(locale);
  const sales = variant === "sales";

  return (
    <section className="aqua-section" aria-labelledby="aqua-title">
      <div className="aqua-image">
        <LoopVideo
          src={`${BASE_PATH}/videos/aquafoz-compilado.mp4`}
          poster={aquaPoster.src}
          label={t.aqua.videoLabel}
          fallback={t.how.videoFallback}
        />
      </div>
      <div className="aqua-copy">
        <div className="ticket-icon" aria-hidden="true">
          ♧
        </div>
        <h2 id="aqua-title">{t.aqua.title}</h2>
        <p>{sales ? t.aqua.textSales : t.aqua.textPreSale}</p>
        <a className="button button-white" href={sales ? "#calendario" : "#cadastro"}>
          {sales ? t.cta.dates : t.cta.early}
        </a>
      </div>
    </section>
  );
}

export function Reviews({ locale }: { locale: Locale }) {
  const t = getContent(locale).reviews;

  return (
    <section className="reviews-section" aria-labelledby="reviews-title">
      <div className="wrap">
        <h2 id="reviews-title">{t.title}</h2>
        <p>{t.intro}</p>
        <div className="review-grid">
          {t.items.map((review) => (
            <blockquote key={review.author}>
              <span>“</span>
              <p>{review.text}</p>
              <cite>{review.author}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ locale, variant }: SectionProps) {
  const t = getContent(locale).faq;
  const sales = variant === "sales";

  return (
    <section className="faq-section" id="duvidas" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="faq-title">{t.title}</h2>
          <p>{sales ? t.introSales : t.introPreSale}</p>
        </div>
        <div className="faq-list">
          {(sales ? t.sales : t.preSale).map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ locale, variant }: SectionProps) {
  const t = getContent(locale);

  return (
    <section className="final-cta">
      <div className="wrap">
        {variant === "sales" ? (
          <>
            <div>
              <h2>{t.finalCta.sales.title}</h2>
            </div>
            <a className="button button-yellow" href="#calendario">
              {t.cta.dates}
            </a>
          </>
        ) : (
          <>
            <div>
              <p className="eyebrow">{t.finalCta.preSale.eyebrow}</p>
              <h2>{t.finalCta.preSale.title}</h2>
              <p>{t.finalCta.preSale.text}</p>
            </div>
            <a className="button button-yellow" href="#cadastro">
              {t.cta.early}
            </a>
          </>
        )}
      </div>
    </section>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const t = getContent(locale).footer;

  return (
    <footer id="contato">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Image src={footerLogo} alt={t.logoAlt} />
          <p>{t.tagline}</p>
        </div>
        <div>
          <h3>{t.resort}</h3>
          <a href="#experiencias">{t.about}</a>
          <span>{t.privacy}</span>
          <span>{t.terms}</span>
        </div>
        <div>
          <h3>{t.contacts}</h3>
          <a href="tel:+5545998360304">+55 (45) 99836-0304</a>
          <a href="tel:+554530260470">+55 (45) 3026-0470</a>
          <a href="tel:0800451221">0800 45 1221</a>
          <p>{t.address}</p>
        </div>
        <div>
          <h3>{t.service}</h3>
          <p>{t.hours}</p>
        </div>
      </div>
    </footer>
  );
}
