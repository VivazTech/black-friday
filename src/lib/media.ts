import { BASE_PATH } from "./site";

export const DEFAULT_PROMO_VIDEO = "/videos/piloto-cadastro-horizontal.mp4";
export const DEFAULT_PROMO_VIDEO_MOBILE = "/videos/piloto-cadastro-vertical.mp4";
export const DEFAULT_AQUA_VIDEO = "/videos/aquafoz-compilado.mp4";

export function mediaUrl(value: string, fallback = ""): string {
  const raw = value.trim() || fallback;
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith(`${BASE_PATH}/`)) return raw;
  return `${BASE_PATH}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

export function isSafeMediaUrl(value: string): boolean {
  const raw = value.trim();
  if (!raw) return true;
  if (raw.startsWith("/") && !raw.startsWith("//")) return !raw.includes("..");
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isSafeHref(value: string): boolean {
  const raw = value.trim();
  if (!raw) return true;
  if (raw.startsWith("#")) return !raw.includes("\\");
  if (raw.startsWith("/") && !raw.startsWith("//")) return !raw.includes("..");
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
