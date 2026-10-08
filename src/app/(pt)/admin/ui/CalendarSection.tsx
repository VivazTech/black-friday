"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  colorFor,
  discountsToCsv,
  eachDate,
  importDiscounts,
  inPeriod,
  monthsBetween,
  normalizePercentage,
  periodBounds,
  sanitizeCalendar,
  type CalendarConfig,
  type DailyDiscount,
} from "@/lib/calendar";
import { niaraUrl } from "@/lib/niara";
import type { AdminState } from "../actions";
import { saveCalendar } from "../actions";

interface DayRow extends DailyDiscount {
  id: string;
  selected: boolean;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const initial: AdminState = { message: "", error: false, done: false, stamp: 0 };

function rowId() {
  return Math.random().toString(36).slice(2, 10);
}

function monthLabel(key: string, style: "short" | "long") {
  const [year, month] = key.split("-").map(Number);
  const label = new Intl.DateTimeFormat("pt-BR", { month: style, year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function toRows(days: DailyDiscount[]): DayRow[] {
  return days.map((day) => ({ ...day, id: rowId(), selected: false }));
}

function shiftDate(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function CalendarSection({ calendar }: { calendar: CalendarConfig }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, action, pending] = useActionState(saveCalendar, initial);
  const [tab, setTab] = useState<"geral" | "descontos" | "niara">("geral");
  const [draft, setDraft] = useState<CalendarConfig>(calendar);
  const [rows, setRows] = useState<DayRow[]>(() => toRows(calendar.dailyDiscounts));
  const [month, setMonth] = useState("all");
  const [notice, setNotice] = useState("");
  const [range, setRange] = useState({ start: "", end: "", percentage: "" });
  const [sample, setSample] = useState(() => {
    const stay = periodBounds(calendar);
    const checkout = shiftDate(stay.start, 3);
    return {
      checkIn: stay.start,
      checkOut: checkout <= stay.end ? checkout : stay.end > stay.start ? stay.end : shiftDate(stay.start, 1),
      rooms: 1,
      adults: 2,
      children: 0,
      ages: [] as number[],
      promoCode: calendar.promoCode,
    };
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state.done) router.refresh();
  }, [state.done, state.stamp, router]);

  const months = monthsBetween(draft.periodStart, draft.periodEnd);
  const bounds = periodBounds(draft);
  const visible = rows.filter((row) => {
    if (month === "all") return true;
    if (month === "unspecified") return !row.date;
    return row.date.startsWith(month);
  });
  const allVisibleSelected = visible.length > 0 && visible.every((row) => row.selected);
  const outside = rows.filter((row) => row.date && !inPeriod(row.date, draft)).length;

  const previewMonths = useMemo(() => {
    const grouped = new Map<string, DayRow[]>();
    for (const row of rows) {
      if (!row.date || !inPeriod(row.date, draft)) continue;
      const key = row.date.slice(0, 7);
      grouped.set(key, [...(grouped.get(key) ?? []), row]);
    }
    return [...grouped.entries()].sort(([left], [right]) => left.localeCompare(right));
  }, [rows, draft]);

  const payload = sanitizeCalendar({ ...draft, dailyDiscounts: rows });
  const niaraLink =
    sample.checkIn && sample.checkOut && sample.checkOut > sample.checkIn
      ? niaraUrl({
          checkIn: sample.checkIn,
          checkOut: sample.checkOut,
          adults: sample.adults,
          children: sample.children,
          childAges: sample.ages.slice(0, sample.children),
          rooms: sample.rooms,
          promoCode: sample.promoCode.trim(),
        })
      : "";
  const niaraParts = niaraLink
    ? (niaraLink.split("#")[1] ?? "").split("&").map((part) => {
        const index = part.indexOf("=");
        const key = index === -1 ? part : part.slice(0, index);
        const value = index === -1 ? "" : decodeURIComponent(part.slice(index + 1));
        return { key, value };
      })
    : [];

  const updateRow = (id: string, patch: Partial<DayRow>) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addRange = () => {
    const percentage = normalizePercentage(range.percentage);
    if (!range.start || !range.end || !percentage || percentage === "X") {
      setNotice("Informe data inicial, data final e uma porcentagem numérica.");
      return;
    }
    if (range.end < range.start) {
      setNotice("A data final precisa ser igual ou posterior à inicial.");
      return;
    }
    if (!inPeriod(range.start, draft) || !inPeriod(range.end, draft)) {
      setNotice("O intervalo precisa estar dentro do período configurado.");
      return;
    }
    const existing = new Set(rows.map((row) => row.date));
    const fresh = eachDate(range.start, range.end).filter((date) => !existing.has(date));
    if (fresh.length === 0) {
      setNotice("Nenhuma data nova: todas já estavam na lista.");
      return;
    }
    setRows((current) => [...current, ...fresh.map((date) => ({ id: rowId(), date, percentage, selected: false }))]);
    setNotice(`${fresh.length} data(s) adicionada(s). Clique em Salvar para publicar.`);
  };

  const removeSelected = () => {
    const chosen = rows.filter((row) => row.selected);
    if (chosen.length === 0) {
      setNotice("Marque as datas que deseja remover.");
      return;
    }
    const next = rows.filter((row) => !row.selected);
    setRows(next.length > 0 ? next : [{ id: rowId(), date: "", percentage: "", selected: false }]);
    setNotice(`${chosen.length} data(s) removida(s) da lista. Clique em Salvar para publicar.`);
  };

  const exportCsv = () => {
    const blob = new Blob([discountsToCsv(payload.dailyDiscounts)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "descontos-calendario.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = async (file: File) => {
    const result = importDiscounts(rows, await file.text(), draft);
    setRows(toRows(result.rows));
    setNotice(
      `Importação pronta: ${result.added} adicionada(s), ${result.updated} atualizada(s), ${result.skipped} ignorada(s). Clique em Salvar para publicar.`,
    );
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <form action={action} className="stack">
      <input type="hidden" name="calendar" value={JSON.stringify(payload)} />
      <div className="tabs" role="tablist">
        {(
          [
            ["geral", "Geral"],
            ["descontos", "Descontos"],
            ["niara", "Niara"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {tab === "geral" && (
        <section className="panel stack">
          <h2>Período e cupom</h2>
          <p className="hint">
            O mês inicial e o final limitam a navegação do calendário público. O cupom vai na reserva do Motor Niara.
            Deixe o cupom em branco para abrir a reserva sem código.
          </p>
          <div className="grid-2">
            <label className="field">
              Mês inicial
              <input
                type="month"
                required
                value={draft.periodStart}
                onChange={(event) => setDraft({ ...draft, periodStart: event.target.value })}
              />
            </label>
            <label className="field">
              Mês final
              <input
                type="month"
                required
                min={draft.periodStart}
                value={draft.periodEnd}
                onChange={(event) => setDraft({ ...draft, periodEnd: event.target.value })}
              />
            </label>
          </div>
          <label className="field">
            Cupom promocional
            <input
              value={draft.promoCode}
              maxLength={40}
              placeholder="BLACK"
              onChange={(event) => setDraft({ ...draft, promoCode: event.target.value })}
            />
          </label>
          <p className="hint">
            Período visível: {bounds.start.split("-").reverse().join("/")} até {bounds.end.split("-").reverse().join("/")}.
            O intervalo máximo é de 24 meses.
          </p>
        </section>
      )}

      {tab === "descontos" && (
        <>
          <section className="panel stack">
            <h2>Cores por porcentagem</h2>
            <p className="hint">Cada porcentagem ganha uma cor no calendário público e na prévia abaixo.</p>
            {draft.discountColors.map((item, index) => (
              <div key={index} className="color-row">
                <label className="field">
                  Porcentagem (%)
                  <input
                    inputMode="decimal"
                    value={item.percentage}
                    onChange={(event) => {
                      const discountColors = draft.discountColors.map((entry, position) =>
                        position === index ? { ...entry, percentage: event.target.value } : entry,
                      );
                      setDraft({ ...draft, discountColors });
                    }}
                  />
                </label>
                <label className="field color-field">
                  Cor
                  <span className="color-control">
                    <input
                      type="color"
                      value={/^#[0-9a-fA-F]{6}$/.test(item.color) ? item.color : "#ffffff"}
                      onChange={(event) => {
                        const discountColors = draft.discountColors.map((entry, position) =>
                          position === index ? { ...entry, color: event.target.value } : entry,
                        );
                        setDraft({ ...draft, discountColors });
                      }}
                    />
                    <i style={{ background: item.color }} />
                    <span>{item.color.toUpperCase()}</span>
                  </span>
                </label>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => {
                    if (draft.discountColors.length <= 1) {
                      setNotice("Pelo menos uma cor precisa permanecer.");
                      return;
                    }
                    setDraft({
                      ...draft,
                      discountColors: draft.discountColors.filter((_, position) => position !== index),
                    });
                  }}
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                setDraft({ ...draft, discountColors: [...draft.discountColors, { percentage: "", color: "#ffffff" }] })
              }
            >
              Adicionar cor
            </button>
          </section>

          <section className="panel stack">
            <h2>Descontos por dia</h2>
            <p className="hint">
              Use um número de 0 a 100, ou X para esgotar o dia. O calendário de /vendas-abertas mostra este
              período, estas cores e estas datas. Um dia fora da lista fica disponível, sem desconto.
            </p>
            <div className="range-box">
              <h3>Adicionar intervalo de datas</h3>
              <div className="grid-3">
                <label className="field">
                  Data inicial
                  <input
                    type="date"
                    min={bounds.start}
                    max={bounds.end}
                    value={range.start}
                    onChange={(event) => setRange({ ...range, start: event.target.value })}
                  />
                </label>
                <label className="field">
                  Data final
                  <input
                    type="date"
                    min={bounds.start}
                    max={bounds.end}
                    value={range.end}
                    onChange={(event) => setRange({ ...range, end: event.target.value })}
                  />
                </label>
                <label className="field">
                  Porcentagem (%)
                  <input
                    inputMode="decimal"
                    value={range.percentage}
                    onChange={(event) => setRange({ ...range, percentage: event.target.value })}
                  />
                </label>
              </div>
              <button type="button" className="btn-secondary" onClick={addRange}>
                Adicionar intervalo
              </button>
            </div>

            <div className="tabs">
              <button type="button" className={month === "all" ? "active" : ""} onClick={() => setMonth("all")}>
                Todos
              </button>
              {months.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={month === item.key ? "active" : ""}
                  onClick={() => setMonth(item.key)}
                >
                  {monthLabel(item.key, "short")}
                </button>
              ))}
              <button
                type="button"
                className={month === "unspecified" ? "active" : ""}
                onClick={() => setMonth("unspecified")}
              >
                Sem data
              </button>
            </div>

            <div className="actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setRows((current) => [
                    ...current,
                    {
                      id: rowId(),
                      date: month !== "all" && month !== "unspecified" ? `${month}-01` : "",
                      percentage: "",
                      selected: false,
                    },
                  ])
                }
              >
                Adicionar linha vazia
              </button>
              <button type="button" className="btn-secondary" onClick={removeSelected}>
                Remover selecionadas
              </button>
              <span className="hint">Marque a primeira coluna para excluir várias datas de uma vez.</span>
            </div>

            <div className="table-wrap">
              <table className="cal-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        aria-label="Selecionar as datas visíveis"
                        onChange={(event) => {
                          const ids = new Set(visible.map((row) => row.id));
                          setRows((current) =>
                            current.map((row) => (ids.has(row.id) ? { ...row, selected: event.target.checked } : row)),
                          );
                        }}
                      />
                    </th>
                    <th>Data</th>
                    <th>Porcentagem (%)</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={row.selected}
                          aria-label={`Selecionar ${row.date || "linha sem data"}`}
                          onChange={(event) => updateRow(row.id, { selected: event.target.checked })}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          min={bounds.start}
                          max={bounds.end}
                          value={row.date}
                          onChange={(event) => updateRow(row.id, { date: event.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          value={row.percentage}
                          placeholder="0 ou X"
                          onChange={(event) => updateRow(row.id, { percentage: event.target.value })}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                  {visible.length === 0 && (
                    <tr>
                      <td colSpan={4}>Nenhuma data neste filtro.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {outside > 0 && (
              <p className="hint">
                {outside} data(s) estão fora do período e serão removidas ao salvar.
              </p>
            )}
          </section>

          <section className="panel stack">
            <h2>Importar e exportar</h2>
            <div className="actions">
              <button type="button" className="btn-secondary" onClick={exportCsv}>
                Exportar CSV
              </button>
              <label className="btn-secondary file-btn">
                Importar CSV
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void importCsv(file);
                  }}
                />
              </label>
            </div>
            <p className="hint">
              Formato: data, porcentagem. Aceita AAAA-MM-DD, DD/MM/AAAA ou DD-MM-AAAA. A importação junta com as datas
              que já estão na lista e ignora o que estiver fora do período.
            </p>
          </section>

          {previewMonths.length > 0 && (
            <section className="panel stack">
              <h2>Calendário de descontos por mês</h2>
              <div className="month-summary">
                {previewMonths.map(([key, days]) => {
                  const [year, monthNumber] = key.split("-").map(Number);
                  const first = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay();
                  const total = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
                  const byDay = new Map(days.map((day) => [Number(day.date.slice(8)), day.percentage]));
                  return (
                    <article key={key} className="month-card">
                      <h3>{monthLabel(key, "long")}</h3>
                      <div className="mini-cal">
                        {WEEKDAYS.map((day) => (
                          <span key={day} className="mini-head">
                            {day}
                          </span>
                        ))}
                        {Array.from({ length: first }, (_, index) => (
                          <span key={`empty-${index}`} />
                        ))}
                        {Array.from({ length: total }, (_, index) => {
                          const percentage = byDay.get(index + 1);
                          const background = percentage && percentage !== "X" ? colorFor(payload, percentage) : undefined;
                          return (
                            <span key={index + 1} style={{ background }}>
                              <strong>{index + 1}</strong>
                              {percentage === "X" ? "Esgotado" : percentage ? `${percentage}%` : ""}
                            </span>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      {tab === "niara" && (
        <section className="panel stack">
          <h2>Link do Niara</h2>
          <p className="hint">
            O link de teste usa o cupom deste campo. O calendário público continua com o cupom da aba Geral
            {draft.promoCode.trim() ? ` (${draft.promoCode.trim()})` : ", que está em branco"}.
          </p>
          <label className="field">
            Cupom para testar
            <input
              value={sample.promoCode}
              maxLength={40}
              placeholder="BLACK"
              autoComplete="off"
              onChange={(event) => setSample({ ...sample, promoCode: event.target.value })}
            />
          </label>
          <div className="grid-2">
            <label className="field">
              Check-in
              <input
                type="date"
                value={sample.checkIn}
                onChange={(event) => setSample({ ...sample, checkIn: event.target.value })}
              />
            </label>
            <label className="field">
              Check-out
              <input
                type="date"
                value={sample.checkOut}
                onChange={(event) => setSample({ ...sample, checkOut: event.target.value })}
              />
            </label>
            <label className="field">
              Quartos
              <input
                type="number"
                min={1}
                max={4}
                value={sample.rooms}
                onChange={(event) => setSample({ ...sample, rooms: Math.min(4, Math.max(1, Number(event.target.value) || 1)) })}
              />
            </label>
            <label className="field">
              Adultos
              <input
                type="number"
                min={1}
                max={8}
                value={sample.adults}
                onChange={(event) => setSample({ ...sample, adults: Math.min(8, Math.max(1, Number(event.target.value) || 1)) })}
              />
            </label>
            <label className="field">
              Crianças
              <input
                type="number"
                min={0}
                max={8}
                value={sample.children}
                onChange={(event) => {
                  const children = Math.min(8, Math.max(0, Number(event.target.value) || 0));
                  setSample({
                    ...sample,
                    children,
                    ages: Array.from({ length: children }, (_, index) => sample.ages[index] ?? 5),
                  });
                }}
              />
            </label>
          </div>
          {sample.children > 0 && (
            <div className="grid-3">
              {sample.ages.slice(0, sample.children).map((age, index) => (
                <label key={index} className="field">
                  Idade da criança {index + 1}
                  <select
                    value={age}
                    onChange={(event) => {
                      const next = sample.ages.slice();
                      next[index] = Number(event.target.value);
                      setSample({ ...sample, ages: next });
                    }}
                  >
                    {Array.from({ length: 12 }, (_, option) => (
                      <option key={option} value={option}>
                        {option} {option === 1 ? "ano" : "anos"}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}
          {niaraLink ? (
            <>
              <p className="niara-link">{niaraLink}</p>
              <div className="actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(niaraLink);
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    } catch {
                      setCopied(false);
                    }
                  }}
                >
                  {copied ? "Link copiado" : "Copiar link"}
                </button>
                <a className="btn-secondary" href={niaraLink} target="_blank" rel="noopener noreferrer">
                  Abrir no Niara
                </a>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Parâmetro</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {niaraParts.map((part, index) => (
                      <tr key={`${part.key}-${index}`}>
                        <td>{part.key}</td>
                        <td>{part.value || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="hint">O check-out precisa ser depois do check-in para montar o link.</p>
          )}
        </section>
      )}

      {notice && <p className="hint">{notice}</p>}
      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar calendário"}
      </button>
      {state.message && <p className={`message${state.error ? " error" : ""}`}>{state.message}</p>}
    </form>
  );
}
