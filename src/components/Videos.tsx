"use client";

import { useEffect, useRef, useState } from "react";

interface VideoProps {
  src: string;
  poster: string;
  label: string;
  fallback: string;
}

/** Vídeo da promoção: começa parado, com botão de play próprio do layout. */
export function PromoVideo({
  src,
  srcMobile,
  poster,
  posterMobile,
  label,
  fallback,
  playLabel,
}: VideoProps & { playLabel: string; srcMobile?: string; posterMobile?: string }) {
  const wide = useRef<HTMLVideoElement>(null);
  const tall = useRef<HTMLVideoElement>(null);
  const [controls, setControls] = useState(false);
  const [playing, setPlaying] = useState(false);
  const mobileSrc = srcMobile || src;
  const mobilePoster = posterMobile || poster;

  const play = async () => {
    const narrow = window.matchMedia("(max-width: 700px)").matches;
    const element = narrow ? tall.current : wide.current;
    try {
      await element?.play();
      setPlaying(true);
    } catch {
      // Reprodução bloqueada pelo navegador: os controles nativos ficam disponíveis.
    }
    setControls(true);
  };

  return (
    <div className="video-preview">
      <video
        ref={wide}
        className="promo-wide"
        id="promo-video"
        preload="metadata"
        playsInline
        controls={controls}
        poster={poster}
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
        {fallback}
      </video>
      <video
        ref={tall}
        className="promo-tall"
        preload="metadata"
        playsInline
        controls={controls}
        poster={mobilePoster}
        aria-label={label}
      >
        <source src={mobileSrc} type="video/mp4" />
        {fallback}
      </video>
      <button className="play-button" type="button" aria-label={playLabel} hidden={playing} onClick={play}>
        ▶
      </button>
    </div>
  );
}

/** Vídeo em loop sem som. O React não emite o atributo `muted` no HTML, então o autoplay é iniciado aqui. */
export function LoopVideo({ src, poster, label, fallback }: VideoProps) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    element.muted = true;
    element.play().catch(() => {});
  }, []);

  return (
    <video
      ref={video}
      id="aqua-video"
      controls
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
      {fallback}
    </video>
  );
}
