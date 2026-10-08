import Image, { getImageProps } from "next/image";
import heroDesktop from "@/assets/hero-desktop.jpg";
import heroMobile from "@/assets/hero-mobile.webp";
import badgeAnimated from "@/assets/selo-black-friday-animado.webp";
import badgeStatic from "@/assets/selo-black-friday.webp";
import { getContent, type Locale } from "@/content";
import { Badges } from "./Badges";
import { Topbar } from "./Topbar";

function HeroPicture({ className, alt }: { className: string; alt: string }) {
  const common = { alt, sizes: "100vw", loading: "eager" as const, fetchPriority: "high" as const };
  const {
    props: { srcSet: mobile },
  } = getImageProps({ ...common, src: heroMobile });
  const { props: desktop } = getImageProps({ ...common, src: heroDesktop });

  return (
    <picture className={className}>
      <source media="(max-width: 700px)" srcSet={mobile} sizes="100vw" />
      <img {...desktop} alt={alt} />
    </picture>
  );
}

export function PreSaleHero({ locale }: { locale: Locale }) {
  const t = getContent(locale);

  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <HeroPicture className="hero-bg" alt={t.hero.backgroundAlt} />
      <div className="hero-shade" />
      <Topbar locale={locale} variant="preSale" route="home" />
      <div className="hero-main wrap">
        <div className="hero-offer offer-left">{t.hero.offerLeft}</div>
        <Image
          className="black-badge float"
          src={badgeStatic}
          alt={t.hero.badgeAlt}
          sizes="(max-width: 700px) 80vw, 460px"
          loading="eager"
        />
        <div className="hero-offer offer-right">{t.hero.offerRight}</div>
        <div className="hero-main-actions">
          <a className="button button-yellow" href="#cadastro">
            {t.cta.early}
          </a>
          <a className="how-link" href="#como-funciona">
            {t.cta.how}
          </a>
        </div>
      </div>
      <Badges locale={locale} />
      <div className="hero-bottom">
        <h1 id="hero-title">{t.hero.title}</h1>
        <ul className="benefits">
          {t.hero.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SalesHero({ locale, route }: { locale: Locale; route: "home" | "sales" }) {
  const t = getContent(locale);

  return (
    <section className="sales-hero" id="inicio" aria-label="Black Friday Vivaz Cataratas">
      <HeroPicture className="sales-hero-bg" alt={t.hero.backgroundAlt} />
      <div className="sales-hero-shade" />
      <Topbar locale={locale} variant="sales" route={route} />
      <div className="hero-main wrap">
        <div className="hero-offer offer-left">{t.hero.offerLeft}</div>
        <div className="black-badge float">
          {/* Selo animado: o otimizador do Next descartaria os quadros. */}
          <Image src={badgeAnimated} alt={t.hero.badgeAlt} unoptimized loading="eager" />
        </div>
        <div className="hero-offer offer-right">{t.hero.offerRightSales}</div>
        <div className="hero-main-actions">
          <a className="button button-yellow" href="#calendario">
            {t.cta.dates}
          </a>
          <a className="how-link" href="#duvidas">
            {t.cta.how}
          </a>
        </div>
      </div>
    </section>
  );
}
