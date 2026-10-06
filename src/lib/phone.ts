export const onlyDigits = (value: string) => value.replace(/\D/g, "");

// Máscara brasileira: (45) 99999-9999. Outros países ficam só com dígitos, espaços e +.
export function formatWhatsapp(value: string, country: string) {
  if (country !== "Brasil") return value.replace(/[^\d+ ]/g, "").slice(0, 20);
  const digits = onlyDigits(value).slice(0, 11);
  if (!digits) return "";
  const area = digits.slice(0, 2);
  const split = digits.length > 10 ? 7 : 6;
  const first = digits.slice(2, split);
  const last = digits.slice(split);
  return `(${area}${area.length === 2 ? ")" : ""} ${first}${last ? `-${last}` : ""}`.trim();
}

export function isValidWhatsapp(value: string, country: string) {
  const length = onlyDigits(value).length;
  return country === "Brasil" ? length === 10 || length === 11 : length >= 8 && length <= 15;
}
