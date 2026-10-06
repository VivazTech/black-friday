"use client";

import { Fragment, useSyncExternalStore } from "react";
import { getContent, type Locale } from "@/content";
import { CAMPAIGN_END, CAMPAIGN_START } from "@/lib/site";

function subscribe(onTick: () => void) {
  const timer = setInterval(onTick, 1000);
  return () => clearInterval(timer);
}
const currentSecond = () => Math.floor(Date.now() / 1000);
const noSecond = () => null;

export function Countdown({ locale, variant }: { locale: Locale; variant: "preSale" | "sales" }) {
  const t = getContent(locale).countdown;
  // No servidor não há relógio do visitante; os números aparecem após a hidratação.
  const now = useSyncExternalStore(subscribe, currentSecond, noSecond);
  const beforeSales = now === null || now * 1000 < CAMPAIGN_START;
  const target = variant === "preSale" || beforeSales ? CAMPAIGN_START : CAMPAIGN_END;

  let parts = ["--", "--", "--", "--"];
  if (now !== null) {
    let seconds = Math.max(0, Math.floor(target / 1000) - now);
    const days = Math.floor(seconds / 86400);
    seconds %= 86400;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    parts = [days, hours, minutes, seconds].map((value) => String(value).padStart(2, "0"));
  }

  const label = variant === "preSale" ? t.preSaleLabel : beforeSales ? t.beforeSales : t.untilEnd;
  const closing = variant === "sales" && !beforeSales;

  return (
    <div className="countdown">
      <span className="countdown-label">{label}</span>
      <div className="clock" aria-label={closing ? t.ariaClosing : t.ariaOpening}>
        {parts.map((value, index) => (
          <Fragment key={t.units[index]}>
            {index > 0 && <i>·</i>}
            <span>
              <b>{value}</b>
              <small>{t.units[index]}</small>
            </span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
