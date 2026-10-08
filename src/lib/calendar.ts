export interface DiscountColor {
  percentage: string;
  color: string;
}

export interface DailyDiscount {
  date: string;
  percentage: string;
}

export interface CalendarConfig {
  periodStart: string;
  periodEnd: string;
  promoCode: string;
  reserveButtonBg: string;
  reserveButtonText: string;
  discountColors: DiscountColor[];
  dailyDiscounts: DailyDiscount[];
}

export const DEFAULT_CALENDAR: CalendarConfig = {
  periodStart: "2027-01",
  periodEnd: "2027-10",
  promoCode: "",
  reserveButtonBg: "#d65b17",
  reserveButtonText: "#ffffff",
  discountColors: [
    { percentage: "0", color: "#ffffff" },
    { percentage: "25", color: "#b7e5f8" },
    { percentage: "30", color: "#a1d49e" },
    { percentage: "35", color: "#e9c781" },
    { percentage: "40", color: "#faa404" },
    { percentage: "45", color: "#d65b17" },
  ],
  dailyDiscounts: [],
};

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const HEX = /^#[0-9a-fA-F]{6}$/;
const MAX_DAYS = 800;
const MAX_COLORS = 24;
const MAX_SPAN = 24;

export function normalizePercentage(value: string) {
  const raw = value.trim().replace("%", "").replace(",", ".");
  if (!raw) return "";
  if (raw.toUpperCase() === "X") return "X";
  const number = Number(raw);
  if (!Number.isFinite(number) || number < 0 || number > 100) return "";
  return String(number);
}

export function parseImportDate(value: string) {
  const raw = value.trim().replaceAll("\\", "");
  if (DATE.test(raw)) return raw;
  const match = raw.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);
  if (!match) return "";
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function hex(value: unknown, fallback: string) {
  return typeof value === "string" && HEX.test(value) ? value.toLowerCase() : fallback;
}

function monthIndex(value: string) {
  const [year, month] = value.split("-").map(Number);
  return year * 12 + (month - 1);
}

export function monthsBetween(start: string, end: string) {
  if (!MONTH.test(start) || !MONTH.test(end) || end < start) return [];
  const months: { key: string; year: number; month: number }[] = [];
  let cursor = monthIndex(start);
  const last = monthIndex(end);
  while (cursor <= last && months.length < MAX_SPAN) {
    const year = Math.floor(cursor / 12);
    const month = cursor % 12;
    months.push({ key: `${year}-${String(month + 1).padStart(2, "0")}`, year, month });
    cursor += 1;
  }
  return months;
}

export function periodBounds(config: CalendarConfig) {
  const start = `${config.periodStart}-01`;
  const [year, month] = config.periodEnd.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month, 0, 12)).getUTCDate();
  return { start, end: `${config.periodEnd}-${String(lastDay).padStart(2, "0")}` };
}

export function inPeriod(date: string, config: CalendarConfig) {
  const bounds = periodBounds(config);
  return DATE.test(date) && date >= bounds.start && date <= bounds.end;
}

export function sanitizeCalendar(input: unknown): CalendarConfig {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const periodStart = typeof source.periodStart === "string" && MONTH.test(source.periodStart) ? source.periodStart : DEFAULT_CALENDAR.periodStart;
  let periodEnd = typeof source.periodEnd === "string" && MONTH.test(source.periodEnd) ? source.periodEnd : DEFAULT_CALENDAR.periodEnd;
  if (periodEnd < periodStart) periodEnd = periodStart;
  const span = monthsBetween(periodStart, periodEnd);
  periodEnd = span.length > 0 ? span[span.length - 1].key : periodStart;

  const colors = Array.isArray(source.discountColors) ? source.discountColors : DEFAULT_CALENDAR.discountColors;
  const discountColors: DiscountColor[] = [];
  for (const row of colors) {
    if (!row || typeof row !== "object" || discountColors.length >= MAX_COLORS) continue;
    const item = row as Record<string, unknown>;
    const percentage = normalizePercentage(typeof item.percentage === "string" || typeof item.percentage === "number" ? String(item.percentage) : "");
    if (percentage === "" || percentage === "X") continue;
    if (discountColors.some((entry) => entry.percentage === percentage)) continue;
    discountColors.push({ percentage, color: hex(item.color, "#ffffff") });
  }
  if (!discountColors.some((item) => item.percentage === "0")) {
    discountColors.unshift({ percentage: "0", color: "#ffffff" });
  }

  const draft: CalendarConfig = {
    periodStart,
    periodEnd,
    promoCode: typeof source.promoCode === "string" ? source.promoCode.trim().slice(0, 40) : "",
    reserveButtonBg: hex(source.reserveButtonBg, DEFAULT_CALENDAR.reserveButtonBg),
    reserveButtonText: hex(source.reserveButtonText, DEFAULT_CALENDAR.reserveButtonText),
    discountColors,
    dailyDiscounts: [],
  };

  const days = Array.isArray(source.dailyDiscounts) ? source.dailyDiscounts : [];
  const seen = new Map<string, string>();
  for (const row of days) {
    if (!row || typeof row !== "object" || seen.size >= MAX_DAYS) continue;
    const item = row as Record<string, unknown>;
    const date = typeof item.date === "string" ? item.date : "";
    const percentage = normalizePercentage(typeof item.percentage === "string" || typeof item.percentage === "number" ? String(item.percentage) : "");
    if (!inPeriod(date, draft) || !percentage) continue;
    seen.set(date, percentage);
  }
  draft.dailyDiscounts = [...seen.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, percentage]) => ({ date, percentage }));
  return draft;
}

export function colorFor(config: CalendarConfig, percentage: string) {
  const match = config.discountColors.find((item) => item.percentage === percentage);
  return match?.color ?? "#ffffff";
}

export function inkFor(color: string) {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return "#121313";
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return red * 0.299 + green * 0.587 + blue * 0.114 > 160 ? "#121313" : "#ffffff";
}

export function eachDate(start: string, end: string) {
  const dates: string[] = [];
  const cursor = new Date(`${start}T12:00:00Z`);
  const last = new Date(`${end}T12:00:00Z`);
  while (cursor.getTime() <= last.getTime() && dates.length <= MAX_DAYS) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

export function discountsToCsv(rows: DailyDiscount[]) {
  const lines = ["date,percentage"];
  for (const row of rows) lines.push(`${row.date},${row.percentage}`);
  return lines.join("\n");
}

export interface ImportResult {
  rows: DailyDiscount[];
  added: number;
  updated: number;
  skipped: number;
}

/** Junta um CSV ao que já está na lista. Datas fora do período são ignoradas. */
export function importDiscounts(current: DailyDiscount[], csv: string, config: CalendarConfig): ImportResult {
  const map = new Map(current.map((row) => [row.date, row.percentage]));
  let added = 0;
  let updated = 0;
  let skipped = 0;
  const lines = csv.replace(/^\uFEFF/, "").split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    const [rawDate, rawPercentage] = line.split(/[;,]/).map((part) => part?.trim().replaceAll('"', "") ?? "");
    if (index === 0 && rawDate.toLowerCase() === "date") return;
    const date = parseImportDate(rawDate);
    const percentage = normalizePercentage(rawPercentage);
    if (!date || !percentage || !inPeriod(date, config)) {
      skipped += 1;
      return;
    }
    if (map.has(date)) updated += map.get(date) === percentage ? 0 : 1;
    else added += 1;
    if (map.get(date) === percentage && map.has(date)) return;
    map.set(date, percentage);
  });
  const rows = [...map.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(0, MAX_DAYS)
    .map(([date, percentage]) => ({ date, percentage }));
  return { rows, added, updated, skipped };
}
