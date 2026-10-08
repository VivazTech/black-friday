export const onlyDigits = (value: string) => value.replace(/\D/g, "");

function joinParts(parts: string[]) {
  return parts.filter(Boolean).join(" ");
}

function formatBrazil(digits: string) {
  const local = digits.slice(0, 11);
  if (!local) return "";
  const area = local.slice(0, 2);
  const split = local.length > 10 ? 7 : 6;
  const first = local.slice(2, split);
  const last = local.slice(split);
  const closed = area.length === 2 ? ")" : "";
  return `(${area}${closed}${first ? ` ${first}` : ""}${last ? `-${last}` : ""}`;
}

/** Celular paraguaio: 0981 123 456, ou 981 123 456 sem o zero. */
function formatParaguay(digits: string) {
  const local = digits.slice(0, digits.startsWith("0") ? 10 : 9);
  if (!local) return "";
  if (local.startsWith("0")) return joinParts([local.slice(0, 4), local.slice(4, 7), local.slice(7, 10)]);
  return joinParts([local.slice(0, 3), local.slice(3, 6), local.slice(6, 9)]);
}

/** Número nacional argentino, sem 0, 15 nem código do país. */
function formatArgentina(digits: string) {
  const local = digits.slice(0, 10);
  if (!local) return "";
  const areaSize = local.startsWith("11") ? 2 : local.startsWith("375") ? 4 : local.length >= 3 ? 3 : local.length;
  const area = local.slice(0, areaSize);
  const rest = local.slice(areaSize);
  const middle = rest.length > 4 ? rest.slice(0, -4) : rest;
  const end = rest.length > 4 ? rest.slice(-4) : "";
  const subscriber = end ? `${middle}-${end}` : middle;
  if (!subscriber) return area.length < areaSize ? `(${area}` : `(${area})`;
  return `(${area}) ${subscriber}`;
}

function formatOther(value: string) {
  const plus = value.trim().startsWith("+");
  const digits = onlyDigits(value).slice(0, 15);
  if (!digits) return plus ? "+" : "";
  const parts: string[] = [];
  for (let index = 0; index < digits.length; index += 3) parts.push(digits.slice(index, index + 3));
  return `${plus ? "+" : ""}${parts.join(" ")}`;
}

export function whatsappPlaceholder(country: string) {
  if (country === "Brasil") return "(45) 99999-9999";
  if (country === "Paraguai") return "0981 123 456";
  if (country === "Argentina") return "(3757) 43-1234";
  return "+000 000 000 000";
}

export function formatWhatsapp(value: string, country: string) {
  const digits = onlyDigits(value);
  if (country === "Brasil") return formatBrazil(digits);
  if (country === "Paraguai") return formatParaguay(digits);
  if (country === "Argentina") return formatArgentina(digits);
  return formatOther(value);
}

export function isValidWhatsapp(value: string, country: string) {
  const length = onlyDigits(value).length;
  if (country === "Brasil") return length === 10 || length === 11;
  if (country === "Paraguai") return length === 9 || length === 10;
  if (country === "Argentina") return length === 10;
  return length >= 8 && length <= 15;
}
