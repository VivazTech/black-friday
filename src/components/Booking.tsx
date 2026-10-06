"use client";

import { useRef, useState } from "react";
import { getContent, type Content, type Locale } from "@/content";
import {
  DISCOUNTS,
  LAST_MONTH,
  LAST_STAY_DAY,
  MAX_NIGHTS,
  STAY_YEAR,
  dateAt,
  fromIso,
  nightsBetween,
  offerFor,
  rangeAvailable,
  toIso,
} from "@/lib/offers";

type GuestKey = "rooms" | "adults" | "children";
type Guests = Record<GuestKey, number>;
const LIMITS: Record<GuestKey, [number, number]> = { rooms: [1, 4], adults: [1, 8], children: [0, 8] };

interface PeriodProps {
  t: Content["booking"];
  className: string;
  checkin: string | null;
  checkout: string | null;
  format: (value: string | null) => string;
  onClear: (field: "checkin" | "checkout") => void;
}

function PeriodCard({ t, className, checkin, checkout, format, onClear }: PeriodProps) {
  const fields = [
    { key: "checkin" as const, label: t.checkin, value: checkin, clear: t.clearCheckin },
    { key: "checkout" as const, label: t.checkout, value: checkout, clear: t.clearCheckout },
  ];
  return (
    <div className={`period-card ${className}`}>
      <span className="period-label">{t.period}</span>
      <div className="period-values">
        {fields.map((field) => (
          <div key={field.key}>
            <small>{field.label}</small>
            <span className="period-choice">
              <strong>{format(field.value)}</strong>
              <button type="button" aria-label={field.clear} hidden={!field.value} onClick={() => onClear(field.key)}>
                ×
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Booking({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const t = content.booking;
  const tripPanel = useRef<HTMLElement>(null);
  const [month, setMonth] = useState(0);
  const [checkin, setCheckin] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<string | null>(null);
  const [guests, setGuests] = useState<Guests>({ rooms: 1, adults: 2, children: 2 });
  const [ages, setAges] = useState([5, 8]);
  const [calendarMessage, setCalendarMessage] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const format = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat(content.dateLocale, { day: "2-digit", month: "short", timeZone: "UTC" })
          .format(fromIso(value))
          .replace(".", "")
      : t.select;

  const clearMessages = () => {
    setBookingMessage("");
    setCalendarMessage("");
    setFiltersOpen(false);
  };

  const selectDate = (value: string) => {
    clearMessages();
    const startsNewPeriod = !checkin || checkout !== null || value <= checkin;
    if (value === LAST_STAY_DAY && startsNewPeriod) {
      setCalendarMessage(t.messages.lastDay);
      return;
    }
    if (startsNewPeriod) {
      setCheckin(value);
      setCheckout(null);
    } else if (nightsBetween(checkin, value) > MAX_NIGHTS) {
      setCalendarMessage(t.messages.maxNights);
      setCheckin(value);
    } else if (!rangeAvailable(checkin, value)) {
      setCalendarMessage(t.messages.soldOutInRange);
      setCheckin(value);
    } else {
      setCheckout(value);
    }
  };

  const clearDate = (field: "checkin" | "checkout") => {
    if (field === "checkin") setCheckin(null);
    setCheckout(null);
    clearMessages();
  };

  const changeGuests = (key: GuestKey, amount: number) => {
    const next = { ...guests, [key]: guests[key] + amount };
    if (key === "rooms" && next.adults < next.rooms) next.adults = next.rooms;
    setGuests(next);
    if (key === "children") {
      setAges((current) => Array.from({ length: next.children }, (_, index) => current[index] ?? 5));
    }
    setBookingMessage("");
  };

  const datesReady = (report: (message: string) => void) => {
    if (checkin && checkout) return true;
    report(t.messages.pickDates);
    return false;
  };
  const occupationReady = () => {
    setBookingMessage("");
    if (guests.adults < guests.rooms) {
      setBookingMessage(t.messages.adultsPerRoom);
      return false;
    }
    if (guests.adults + guests.children > guests.rooms * 4) {
      setBookingMessage(t.messages.roomCapacity);
      return false;
    }
    return true;
  };
  // O endereço e os parâmetros oficiais do motor de reservas serão configurados depois.
  const handoffToBookingEngine = () => setBookingMessage(t.messages.engineMissing);

  const firstWeekday = dateAt(month, 1).getUTCDay();
  const daysInMonth = dateAt(month + 1, 0).getUTCDate();
  const monthName = t.months[month];
  const guestRows = [
    { key: "rooms" as const, label: t.rooms, hint: t.roomsHint },
    { key: "adults" as const, label: t.adults, hint: t.adultsHint },
    { key: "children" as const, label: t.children, hint: t.childrenHint },
  ];
  const period = { t, checkin, checkout, format, onClear: clearDate };

  return (
    <section className="booking-section" id="calendario" aria-labelledby="booking-title">
      <div className={`booking-card wrap${filtersOpen ? " mobile-filters-open" : ""}`}>
        <div className="booking-heading">
          <div>
            <h1 id="booking-title">{t.title}</h1>
            <p>{t.text}</p>
          </div>
          <div className="discount-legend" aria-label={t.legendLabel}>
            {DISCOUNTS.map((discount) => (
              <span key={discount} className={`discount-${discount}`}>
                {discount}% OFF
              </span>
            ))}
          </div>
        </div>
        <div className="booking-body">
          <div className="calendar-panel">
            <PeriodCard className="mobile-period" {...period} />
            <div className="calendar-toolbar">
              <button
                type="button"
                id="prev-month"
                className="month-arrow"
                aria-label={t.previousMonth}
                disabled={month === 0}
                onClick={() => setMonth(month - 1)}
              >
                ←
              </button>
              <h2 id="month-title" aria-live="polite">
                {t.monthTitle(monthName, STAY_YEAR)}
              </h2>
              <button
                type="button"
                id="next-month"
                className="month-arrow"
                aria-label={t.nextMonth}
                disabled={month === LAST_MONTH}
                onClick={() => setMonth(month + 1)}
              >
                →
              </button>
            </div>
            <div className="weekday-grid" aria-hidden="true">
              {t.weekdays.map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>
            <div id="calendar-grid" className="calendar-grid" role="grid" aria-label={t.gridLabel}>
              {Array.from({ length: firstWeekday }, (_, index) => (
                <span key={`empty-${index}`} className="calendar-day is-empty" aria-hidden="true" />
              ))}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const value = toIso(dateAt(month, day));
                const offer = offerFor(value);
                const classes = ["calendar-day"];
                if (offer.unavailable) classes.push("is-unavailable");
                if (value === checkin) classes.push("is-selected");
                if (value === checkout) classes.push("is-range-end");
                if (checkin && checkout && value > checkin && value < checkout) classes.push("in-range");
                if ((checkin && value < checkin) || (checkout && value > checkout)) {
                  classes.push("is-outside-period");
                }
                return (
                  <button
                    key={value}
                    type="button"
                    className={classes.join(" ")}
                    data-date={value}
                    role="gridcell"
                    aria-label={`${t.dayLabel(day, monthName, STAY_YEAR)}, ${
                      offer.unavailable ? t.unavailable : t.discountLabel(offer.discount)
                    }`}
                    aria-selected={value === checkin || value === checkout ? true : undefined}
                    disabled={offer.unavailable}
                    onClick={() => selectDate(value)}
                  >
                    <span>{day}</span>
                    {offer.unavailable ? (
                      <small>{t.soldOut}</small>
                    ) : (
                      <span className={`discount-chip discount-${offer.discount}`}>{offer.discount}%</span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="calendar-note">{t.note}</p>
            <p id="calendar-message" className="booking-message" role="status" aria-live="polite">
              {calendarMessage}
            </p>
            <button
              type="button"
              className="availability-button mobile-search"
              id="mobile-search"
              aria-expanded={filtersOpen}
              aria-controls="trip-panel"
              onClick={() => {
                setCalendarMessage("");
                if (!datesReady(setCalendarMessage)) return;
                setFiltersOpen(true);
                // Aguarda o painel aparecer (display:flex) antes de rolar até ele.
                requestAnimationFrame(() =>
                  tripPanel.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
                );
              }}
            >
              {t.search}
            </button>
          </div>
          <aside className="trip-panel" id="trip-panel" ref={tripPanel} aria-labelledby="trip-title">
            <h2 id="trip-title">{t.tripTitle}</h2>
            <p className="trip-instruction">{t.tripText}</p>
            <PeriodCard className="desktop-period" {...period} />
            {guestRows.map((row) => (
              <div key={row.key} className="guest-row">
                <div>
                  <strong>{row.label}</strong>
                  <small>{row.hint}</small>
                </div>
                <div className="stepper">
                  <button
                    type="button"
                    aria-label={t.decrease(row.label)}
                    disabled={guests[row.key] - 1 < LIMITS[row.key][0]}
                    onClick={() => changeGuests(row.key, -1)}
                  >
                    −
                  </button>
                  <output id={`${row.key}-count`}>{guests[row.key]}</output>
                  <button
                    type="button"
                    aria-label={t.increase(row.label)}
                    disabled={guests[row.key] + 1 > LIMITS[row.key][1]}
                    onClick={() => changeGuests(row.key, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div id="child-ages" className="child-ages">
              {ages.map((age, index) => (
                <label key={index}>
                  {t.childAge(index + 1)}
                  <select
                    aria-label={t.childAge(index + 1)}
                    value={age}
                    onChange={(event) => {
                      const value = Number(event.currentTarget.value);
                      setAges((current) => current.map((item, position) => (position === index ? value : item)));
                      setBookingMessage("");
                    }}
                  >
                    {Array.from({ length: 12 }, (_, option) => (
                      <option key={option} value={option}>
                        {t.years(option)}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <p id="booking-message" className="booking-message" role="status" aria-live="polite">
              {bookingMessage}
            </p>
            <button
              type="button"
              className="availability-button desktop-search"
              id="search-availability"
              onClick={() => {
                if (!datesReady(setCalendarMessage) || !occupationReady()) return;
                handoffToBookingEngine();
              }}
            >
              {t.search}
            </button>
            <button
              type="button"
              className="availability-button mobile-apply"
              id="apply-filters"
              onClick={() => {
                if (!datesReady(setBookingMessage) || !occupationReady()) return;
                handoffToBookingEngine();
              }}
            >
              {t.apply}
            </button>
            <p className="availability-note">{t.availabilityNote}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
