import type { ReactNode } from "react";

export type Locale = "pt" | "es";

export interface Faq {
  question: string;
  answer: string;
}

export interface Content {
  locale: Locale;
  htmlLang: string;
  dateLocale: string;
  meta: {
    preSale: { title: string; description: string };
    sales: { title: string; description: string };
  };
  skipLink: string;
  topbar: {
    brandLabel: string;
    contact: string;
    support: string;
    langLabel: string;
  };
  countdown: {
    preSaleLabel: ReactNode;
    beforeSales: string;
    untilEnd: string;
    ariaOpening: string;
    ariaClosing: string;
    units: [string, string, string, string];
  };
  cta: { early: string; dates: string; how: string };
  hero: {
    backgroundAlt: string;
    badgeAlt: string;
    offerLeft: ReactNode;
    offerRight: ReactNode;
    offerRightSales: ReactNode;
    title: ReactNode;
    benefits: string[];
  };
  badges: { label: string; items: string[] };
  signup: {
    eyebrow: string;
    title: ReactNode;
    text: string;
    formTitle: string;
    formText: string;
    firstName: string;
    firstNamePlaceholder: string;
    lastName: string;
    lastNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    country: string;
    countries: { value: string; label: string }[];
    whatsapp: string;
    consent: string;
    note: string;
    sending: string;
    success: string;
    thanksTitle: string;
    community: string;
    errorRequired: string;
    errorWhatsapp: string;
    errorServer: string;
  };
  how: {
    eyebrow: string;
    title: string;
    intro: string;
    videoLabel: string;
    playLabel: string;
    videoFallback: string;
    steps: { title: string; text: string }[];
  };
  aqua: {
    videoLabel: string;
    title: ReactNode;
    textPreSale: ReactNode;
    textSales: ReactNode;
  };
  gallery: {
    title: ReactNode;
    previous: string;
    next: string;
    otherPhoto: (title: string) => string;
    previousPhoto: (title: string) => string;
    nextPhoto: (title: string) => string;
    cards: { title: string; text: string; alt: string }[];
  };
  reviews: {
    title: ReactNode;
    intro: string;
    items: { text: string; author: string }[];
  };
  faq: {
    eyebrow: string;
    title: ReactNode;
    introPreSale: string;
    introSales: string;
    preSale: Faq[];
    sales: Faq[];
  };
  finalCta: {
    preSale: { eyebrow: string; title: string; text: string };
    sales: { title: string };
  };
  footer: {
    logoAlt: string;
    tagline: string;
    resort: string;
    about: string;
    privacy: string;
    terms: string;
    contacts: string;
    address: string;
    service: string;
    hours: ReactNode;
  };
  booking: {
    title: string;
    text: string;
    legendLabel: string;
    period: string;
    checkin: string;
    checkout: string;
    select: string;
    clearCheckin: string;
    clearCheckout: string;
    previousMonth: string;
    nextMonth: string;
    weekdays: string[];
    months: string[];
    monthTitle: (month: string, year: number) => string;
    gridLabel: string;
    dayLabel: (day: number, month: string, year: number) => string;
    available: string;
    unavailable: string;
    discountLabel: (discount: number) => string;
    soldOut: string;
    note: string;
    search: string;
    apply: string;
    tripTitle: string;
    tripText: string;
    rooms: string;
    roomsHint: string;
    adults: string;
    adultsHint: string;
    children: string;
    childrenHint: string;
    decrease: (label: string) => string;
    increase: (label: string) => string;
    childAge: (index: number) => string;
    years: (age: number) => string;
    availabilityNote: string;
    messages: {
      lastDay: string;
      maxNights: string;
      soldOutInRange: string;
      pickDates: string;
      adultsPerRoom: string;
      roomCapacity: string;
      engineMissing: string;
      popupBlocked: string;
    };
  };
}
