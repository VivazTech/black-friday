// Calendário da campanha: estadias de janeiro a outubro de 2027.
// ATENÇÃO: descontos e datas esgotadas abaixo são demonstrativos (herdados da prévia do designer).
// Substituir `offerFor` pelos dados oficiais antes da abertura das vendas.
export const STAY_YEAR = 2027;
export const LAST_MONTH = 9;
export const LAST_STAY_DAY = "2027-10-31";
export const MAX_NIGHTS = 14;
export const DISCOUNTS = [25, 30, 35, 40, 45] as const;

const DAY_MS = 86400000;

export const toIso = (date: Date) => date.toISOString().slice(0, 10);
export const fromIso = (value: string) => new Date(`${value}T12:00:00Z`);
export const dateAt = (month: number, day: number) => new Date(Date.UTC(STAY_YEAR, month, day, 12));
export const nightsBetween = (start: string, end: string) =>
  Math.round((fromIso(end).getTime() - fromIso(start).getTime()) / DAY_MS);

// Sequência estável: a mesma data sempre apresenta a mesma faixa na prévia.
export function offerFor(value: string) {
  const date = fromIso(value);
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const key = (month * 37 + day * 17 + Math.floor(day / 5) * 11) % 19;
  return {
    unavailable: key === 0 || key === 11,
    discount: DISCOUNTS[(month * 3 + day * 7 + Math.floor(day / 3)) % 5],
  };
}

export function rangeAvailable(start: string, end: string) {
  for (let time = fromIso(start).getTime(); time < fromIso(end).getTime(); time += DAY_MS) {
    if (offerFor(toIso(new Date(time))).unavailable) return false;
  }
  return true;
}
