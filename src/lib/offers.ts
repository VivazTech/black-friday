// Limite de noites da reserva. Datas, descontos e período vêm do calendário salvo no painel.
export const MAX_NIGHTS = 14;

const DAY_MS = 86400000;

export const toIso = (date: Date) => date.toISOString().slice(0, 10);
export const fromIso = (value: string) => new Date(`${value}T12:00:00Z`);
export const nightsBetween = (start: string, end: string) =>
  Math.round((fromIso(end).getTime() - fromIso(start).getTime()) / DAY_MS);
