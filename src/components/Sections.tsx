import { Fragment } from "react";
import Image from "next/image";
import aquaPoster from "@/assets/aqua-poster.webp";
import footerLogo from "@/assets/footer-logo.png";
import promoPoster from "@/assets/promo-poster.webp";
import promoPosterMobile from "@/assets/promo-poster-mobile.webp";
import { getContent, type Locale } from "@/content";
import { getCampaign } from "@/lib/campaign";
import { DEFAULT_AQUA_VIDEO, DEFAULT_PROMO_VIDEO, DEFAULT_PROMO_VIDEO_MOBILE, mediaUrl } from "@/lib/media";
import { LoopVideo, PromoVideo } from "./Videos";

type Variant = "preSale" | "sales";
interface SectionProps {
  locale: Locale;
  variant: Variant;
}

export async function HowSection({ locale }: { locale: Locale }) {
  const t = getContent(locale).how;
  const { settings } = await getCampaign();
  const storedVideo = settings.promoVideoUrl.trim();
  const customVideo =
    storedVideo.length > 0 && storedVideo !== "/videos/black-friday-15s.mp4" && storedVideo !== DEFAULT_PROMO_VIDEO;
  const customPoster = settings.promoPosterUrl.trim().length > 0;
  const poster = customPoster ? mediaUrl(settings.promoPosterUrl) : promoPoster.src;

  return (
    <section className="how-section" id="como-funciona" aria-labelledby="how-title">
      <div className="wrap">
        <p className="eyebrow yellow">{t.eyebrow}</p>
        <h2 id="how-title">{t.title}</h2>
        <p className="section-intro">{t.intro}</p>
        <div className="how-grid">
          <PromoVideo
            src={customVideo ? mediaUrl(storedVideo) : mediaUrl(DEFAULT_PROMO_VIDEO)}
            srcMobile={customVideo ? undefined : mediaUrl(DEFAULT_PROMO_VIDEO_MOBILE)}
            poster={poster}
            posterMobile={customPoster ? undefined : promoPosterMobile.src}
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

export async function AquaSection({ locale, variant }: SectionProps) {
  const t = getContent(locale);
  const sales = variant === "sales";
  const { settings } = await getCampaign();
  const poster = settings.aquaPosterUrl ? mediaUrl(settings.aquaPosterUrl) : aquaPoster.src;

  return (
    <section className="aqua-section" aria-labelledby="aqua-title">
      <div className="aqua-image">
        <LoopVideo
          src={mediaUrl(settings.aquaVideoUrl, DEFAULT_AQUA_VIDEO)}
          poster={poster}
          label={t.aqua.videoLabel}
          fallback={t.how.videoFallback}
        />
      </div>
      <div className="aqua-copy">
        <div className="ticket-icon" aria-hidden="true" />
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

export async function FaqSection({ locale, variant }: SectionProps) {
  const t = getContent(locale).faq;
  const sales = variant === "sales";
  const campaign = await getCampaign();
  const fromDatabase = campaign.faqs.filter(
    (item) => item.locale === locale && item.variant === (sales ? "vendas-abertas" : "pre-venda"),
  );
  const items = campaign.source === "database" ? fromDatabase : sales ? t.sales : t.preSale;

  return (
    <section className="faq-section" id="duvidas" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="faq-title">{t.title}</h2>
          <p>{sales ? t.introSales : t.introPreSale}</p>
        </div>
        <div className="faq-list">
          {items.map((item, index) => (
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

function lines(text: string) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0800")) return `tel:${digits}`;
  return `tel:+${digits}`;
}

const PRIVACY_HREF = "https://vivazcataratas.com.br/politica-de-privacidade/";
const TERMS_HREF = "https://vivazcataratas.com.br/termos-e-condicoes/";

export async function Footer({ locale }: { locale: Locale }) {
  const fallback = getContent(locale).footer;
  const campaign = await getCampaign();
  const custom = campaign.source === "database" ? campaign.footers.find((item) => item.locale === locale) : undefined;
  const t = custom
    ? {
        logoAlt: custom.logoAlt,
        tagline: custom.tagline,
        resort: custom.resortTitle,
        about: custom.aboutLabel,
        aboutHref: custom.aboutHref || "#experiencias",
        privacy: custom.privacyLabel,
        privacyHref: custom.privacyHref || PRIVACY_HREF,
        terms: custom.termsLabel,
        termsHref: custom.termsHref || TERMS_HREF,
        contacts: custom.contactsTitle,
        phones: lines(custom.phones),
        address: custom.address,
        service: custom.serviceTitle,
        hours: lines(custom.hours),
      }
    : {
        logoAlt: fallback.logoAlt,
        tagline: fallback.tagline,
        resort: fallback.resort,
        about: fallback.about,
        aboutHref: "#experiencias",
        privacy: fallback.privacy,
        privacyHref: PRIVACY_HREF,
        terms: fallback.terms,
        termsHref: TERMS_HREF,
        contacts: fallback.contacts,
        phones: ["+55 (45) 99836-0304", "+55 (45) 3026-0470", "0800 45 1221"],
        address: fallback.address,
        service: fallback.service,
        hours: [] as string[],
      };

  return (
    <footer id="contato">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Image src={footerLogo} alt={t.logoAlt} />
          <p>{t.tagline}</p>
        </div>
        <div>
          <h3>{t.resort}</h3>
          <a href={t.aboutHref}>{t.about}</a>
          {t.privacyHref ? <a href={t.privacyHref}>{t.privacy}</a> : <span>{t.privacy}</span>}
          {t.termsHref ? <a href={t.termsHref}>{t.terms}</a> : <span>{t.terms}</span>}
        </div>
        <div>
          <h3>{t.contacts}</h3>
          {t.phones.map((phone) => (
            <a key={phone} href={phoneHref(phone)}>
              {phone}
            </a>
          ))}
          <p>{t.address}</p>
        </div>
        <div>
          <h3>{t.service}</h3>
          <p>
            {custom
              ? t.hours.map((line, index) => (
                <Fragment key={`${index}-${line}`}>
                    {index > 0 && <br />}
                    {line}
                  </Fragment>
                ))
              : fallback.hours}
          </p>
        </div>
      </div>
    </footer>
  );
}
