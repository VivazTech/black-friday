"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { galleryPhotos } from "@/content/gallery-photos";
import { getContent, type Locale } from "@/content";

const photoSizes = "(max-width: 700px) 80vw, (max-width: 1050px) 45vw, 25vw";

function cardStep(track: HTMLDivElement) {
  const first = track.firstElementChild;
  if (!first) return 0;
  return first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || "0");
}

function GalleryCard({ locale, index }: { locale: Locale; index: number }) {
  const t = getContent(locale).gallery;
  const card = t.cards[index];
  const slides = galleryPhotos[index];
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const showPhoto = (direction: number) =>
    setActive((current) => (current + direction + slides.length) % slides.length);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (startX.current !== null && Math.abs(event.clientX - startX.current) > 35) {
      showPhoto(event.clientX < startX.current ? 1 : -1);
    }
    startX.current = null;
  };

  return (
    <article className="gallery-card">
      <div
        className="gallery-slides"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          startX.current = null;
        }}
      >
        {slides.map((photo, photoIndex) => (
          <Image
            key={photoIndex}
            src={photo}
            alt={photoIndex === 0 ? card.alt : t.otherPhoto(card.title)}
            className={photoIndex === active ? "active" : undefined}
            aria-hidden={photoIndex !== active}
            sizes={photoSizes}
            draggable={false}
          />
        ))}
      </div>
      <div>
        <h3>{card.title}</h3>
        <p>{card.text}</p>
      </div>
      <div className="card-controls">
        <button
          type="button"
          className="card-arrow"
          aria-label={t.previousPhoto(card.title)}
          onClick={() => showPhoto(-1)}
        >
          ‹
        </button>
        <button
          type="button"
          className="card-arrow"
          aria-label={t.nextPhoto(card.title)}
          onClick={() => showPhoto(1)}
        >
          ›
        </button>
      </div>
    </article>
  );
}

export function Gallery({ locale }: { locale: Locale }) {
  const t = getContent(locale).gallery;
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ nearest: 0, atStart: true, atEnd: false });

  const update = () => {
    const element = track.current;
    const size = element ? cardStep(element) : 0;
    if (!element || !size) return;
    const next = {
      nearest: Math.min(t.cards.length - 1, Math.round(element.scrollLeft / size)),
      atStart: element.scrollLeft < 2,
      atEnd: element.scrollLeft >= element.scrollWidth - element.clientWidth - 2,
    };
    setPosition((previous) =>
      previous.nearest === next.nearest && previous.atStart === next.atStart && previous.atEnd === next.atEnd
        ? previous
        : next,
    );
  };

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    // Recalcula setas e pontos quando o tamanho dos cards muda (inclusive na primeira medição).
    const observer = new ResizeObserver(() => element.dispatchEvent(new Event("scroll")));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const scroll = (direction: number) =>
    track.current?.scrollBy({ left: direction * cardStep(track.current), behavior: "smooth" });

  return (
    <section className="gallery-section" id="experiencias" aria-labelledby="gallery-title">
      <div className="wrap">
        <h2 id="gallery-title">{t.title}</h2>
      </div>
      <div className="gallery-shell">
        <div className="gallery-track" id="gallery-track" ref={track} onScroll={update}>
          {t.cards.map((card, index) => (
            <GalleryCard key={card.title} locale={locale} index={index} />
          ))}
        </div>
      </div>
      <div className="gallery-controls">
        <button
          className="gallery-arrow prev"
          type="button"
          aria-label={t.previous}
          disabled={position.atStart}
          onClick={() => scroll(-1)}
        >
          ‹
        </button>
        <div className="gallery-dots" aria-hidden="true">
          {t.cards.map((card, index) => (
            <span key={card.title} className={index === position.nearest ? "active" : undefined} />
          ))}
        </div>
        <button
          className="gallery-arrow next"
          type="button"
          aria-label={t.next}
          disabled={position.atEnd}
          onClick={() => scroll(1)}
        >
          ›
        </button>
      </div>
    </section>
  );
}
