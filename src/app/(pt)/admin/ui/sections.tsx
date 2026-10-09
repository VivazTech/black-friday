"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, CircleHelp, Clock3, Download, Monitor, Play, Plus, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { DEFAULT_AQUA_VIDEO, DEFAULT_PROMO_VIDEO, mediaUrl } from "@/lib/media";
import {
  PAGE_LABEL,
  formatDateTime,
  isoToDateTimeLocal,
  pageAt,
  type Campaign,
  type FaqItem,
  type FooterContent,
  type LeadRow,
  type SiteSettings,
} from "@/lib/schedule";
import { saveCommunity, saveCountdown, saveFaqs, saveFooter, saveSchedule, saveVideos, type AdminState } from "../actions";

type SectionId = "visao" | "pagina" | "teste" | "contador" | "videos" | "calendario" | "cadastros" | "comunidade" | "duvidas" | "rodape" | "usuarios";

const initial: AdminState = { message: "", error: false, done: false, stamp: 0 };

function useSaved(state: AdminState) {
  const router = useRouter();
  useEffect(() => {
    if (state.done) router.refresh();
  }, [state.done, state.stamp, router]);
}

function Message({ state }: { state: AdminState }) {
  if (!state.message) return null;
  return <p className={`message${state.error ? " error" : ""}`}>{state.message}</p>;
}

function SaveButton({ pending, label = "Salvar" }: { pending: boolean; label?: string }) {
  return (
    <button className="btn" type="submit" disabled={pending}>
      {pending ? "Salvando..." : label}
    </button>
  );
}

const blankFooter = (locale: "pt" | "es"): FooterContent => ({
  locale,
  logoAlt: "Vivaz Cataratas Resort",
  tagline: "",
  resortTitle: locale === "pt" ? "O Resort" : "El Resort",
  aboutLabel: locale === "pt" ? "Sobre o Resort" : "Sobre el Resort",
  aboutHref: "#experiencias",
  privacyLabel: locale === "pt" ? "Política de Privacidade" : "Política de Privacidad",
  privacyHref: "https://vivazcataratas.com.br/politica-de-privacidade/",
  termsLabel: locale === "pt" ? "Termos e Condições" : "Términos y Condiciones",
  termsHref: "https://vivazcataratas.com.br/termos-e-condicoes/",
  contactsTitle: locale === "pt" ? "Contatos" : "Contactos",
  phones: "+55 (45) 99836-0304\n+55 (45) 3026-0470\n0800 45 1221",
  address: "Av. das Cataratas, 6798 — Carimã, Foz do Iguaçu - PR",
  serviceTitle: locale === "pt" ? "Atendimento" : "Atención",
  hours: "",
});

export function Dashboard({
  campaign,
  leads,
  onOpen,
}: {
  campaign: Campaign;
  leads: LeadRow[];
  onOpen: (id: SectionId) => void;
}) {
  const { settings } = campaign;
  const scheduled = settings.switchAt && settings.switchTo;

  return (
    <>
      <div className="stats">
        <article className="panel stat">
          <div className="stat-icon">
            <Monitor />
          </div>
          <div className="stat-copy">
            <p className="stat-kicker">Página no ar</p>
            <p className="stat-value">{PAGE_LABEL[settings.livePage]}</p>
            <p className="stat-note">{scheduled ? `Troca em ${formatDateTime(settings.switchAt)}` : "Sem troca agendada"}</p>
          </div>
        </article>
        <article className="panel stat">
          <div className="stat-icon">
            <Users />
          </div>
          <div className="stat-copy">
            <p className="stat-kicker">Cadastrados</p>
            <p className="stat-value">{leads.length}</p>
            <p className="stat-note">Formulário da pré-venda</p>
          </div>
        </article>
        <article className="panel stat">
          <div className="stat-icon">
            <Clock3 />
          </div>
          <div className="stat-copy">
            <p className="stat-kicker">Abertura do contador</p>
            <p className="stat-value">{formatDateTime(settings.countdownStart)}</p>
            <p className="stat-note">Encerra {formatDateTime(settings.countdownEnd)}</p>
          </div>
        </article>
        <article className="panel stat">
          <div className="stat-icon">
            <CircleHelp />
          </div>
          <div className="stat-copy">
            <p className="stat-kicker">Dúvidas publicadas</p>
            <p className="stat-value">{campaign.faqs.length}</p>
            <p className="stat-note">Português e espanhol</p>
          </div>
        </article>
      </div>

      <div className="layout">
        <section className="panel">
          <h2>Cadastros recentes</h2>
          <div className="activity">
            {leads.slice(0, 6).map((lead) => (
              <button key={lead.id} type="button" onClick={() => onOpen("cadastros")}>
                <div className="stat-icon">
                  <Users />
                </div>
                <span className="meta">
                  <strong>
                    {lead.nome} {lead.sobrenome}
                  </strong>
                  <small>{lead.email}</small>
                </span>
                <span className="time">{formatDateTime(lead.createdAt)}</span>
              </button>
            ))}
            {leads.length === 0 && <p className="hint">Nenhum cadastro ainda.</p>}
          </div>
        </section>
        <section className="panel stack">
          <h2>Atalhos</h2>
          <button className="btn-secondary" type="button" onClick={() => onOpen("pagina")}>
            Configurar a página no ar
          </button>
          <button className="btn-secondary" type="button" onClick={() => onOpen("teste")}>
            Testar a troca automática
          </button>
          <button className="btn-secondary" type="button" onClick={() => onOpen("contador")}>
            Ajustar o contador
          </button>
          <button className="btn-secondary" type="button" onClick={() => onOpen("usuarios")}>
            Gerenciar acessos do painel
          </button>
          <button className="btn-secondary" type="button" onClick={() => onOpen("calendario")}>
            Configurar datas e descontos
          </button>
          <Link className="btn-secondary" href="/" target="_blank">
            Abrir a página principal
          </Link>
        </section>
      </div>
    </>
  );
}

export function PageSection({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveSchedule, initial);
  useSaved(state);

  return (
    <form action={action} className="stack">
      <fieldset className="choices">
        {(
          [
            ["pre-venda", "Página de cadastro para acesso antecipado."],
            ["vendas-abertas", "Página com o calendário de datas e descontos."],
          ] as const
        ).map(([value, text]) => (
          <label key={value} className="choice">
            <input type="radio" name="live" value={value} defaultChecked={settings.livePage === value} />
            <span>
              <strong>
                {PAGE_LABEL[value]}
                {settings.livePage === value && <span className="pill">NO AR</span>}
              </strong>
              <small>{text}</small>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="panel stack">
        <h2>Troca automática</h2>
        <p className="hint">
          Defina a data e a hora, no fuso de Brasília. Quando esse momento chegar, a página principal muda sozinha.
          Deixe a data vazia para não agendar nada.
        </p>
        <div className="grid-2">
          <label className="field">
            Data e hora da troca
            <input type="datetime-local" name="switchAt" defaultValue={isoToDateTimeLocal(settings.switchAt)} />
          </label>
          <label className="field">
            Página que entra no ar
            <select name="switchTo" defaultValue={settings.switchTo ?? ""}>
              <option value="">Não trocar</option>
              <option value="pre-venda">Pré-venda</option>
              <option value="vendas-abertas">Vendas abertas</option>
            </select>
          </label>
        </div>
        {settings.switchAt && settings.switchTo && (
          <p className="hint">
            Agendado: em {formatDateTime(settings.switchAt)} a página passa a ser {PAGE_LABEL[settings.switchTo]}.
          </p>
        )}
      </div>

      <div className="actions">
        <SaveButton pending={pending} />
        <Link className="btn-secondary" href="/vendas-abertas" target="_blank">
          Ver vendas abertas
        </Link>
      </div>
      <Message state={state} />
    </form>
  );
}

export function TestSection({ settings, onConfigure }: { settings: SiteSettings; onConfigure: () => void }) {
  const [value, setValue] = useState("");
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!playing || !settings.switchAt) return;
    const origin = performance.now();
    const start = new Date(settings.switchAt).getTime() - 8000;
    const timer = setInterval(() => {
      const at = start + (performance.now() - origin);
      setValue(isoToDateTimeLocal(new Date(at).toISOString()));
      if (at > new Date(settings.switchAt!).getTime() + 3000) setPlaying(false);
    }, 200);
    return () => clearInterval(timer);
  }, [playing, settings.switchAt]);

  const clock = now ?? Date.now();
  const simulated = value ? new Date(`${value}:00-03:00`).getTime() : clock;
  const simulatedOk = !value || !Number.isNaN(simulated);
  const preview = simulatedOk ? pageAt(settings, simulated) : settings.livePage;
  const real = pageAt(settings, clock);

  return (
    <div className="stack">
      <div className="grid-2">
        <article className={`result-card ${real === "vendas-abertas" ? "sales" : "presale"}`}>
          <p className="hint">Agora, no site</p>
          <strong>{PAGE_LABEL[real]}</strong>
          <p className="hint">
            {settings.switchAt && settings.switchTo
              ? `Troca real em ${formatDateTime(settings.switchAt)} para ${PAGE_LABEL[settings.switchTo]}.`
              : "Não há troca automática configurada."}
          </p>
        </article>
        <article className={`result-card ${preview === "vendas-abertas" ? "sales" : "presale"}`}>
          <p className="hint">No horário simulado</p>
          <strong>{PAGE_LABEL[preview]}</strong>
          <p className="hint">Esta simulação não altera a página que os visitantes veem.</p>
        </article>
      </div>

      <section className="panel stack">
        <h2>Simular data e hora</h2>
        <label className="field">
          Fingir que agora é
          <input type="datetime-local" value={value} onChange={(event) => setValue(event.target.value)} />
        </label>
        <div className="actions">
          <button
            className="btn"
            type="button"
            disabled={!settings.switchAt || playing}
            onClick={() => setPlaying(true)}
          >
            <Play size={16} />
            Reproduzir a troca
          </button>
          <button className="btn-secondary" type="button" onClick={() => setValue("")}>
            Usar o horário real
          </button>
          <button className="btn-secondary" type="button" onClick={onConfigure}>
            Configurar a troca
          </button>
        </div>
        {!settings.switchAt && (
          <p className="hint">Defina uma data na seção Página no ar para reproduzir a virada do relógio.</p>
        )}
      </section>

      <div className="actions">
        <Link className="btn-secondary" href="/" target="_blank">
          Abrir página principal
        </Link>
        <Link className="btn-secondary" href="/vendas-abertas" target="_blank">
          Abrir vendas abertas
        </Link>
      </div>
    </div>
  );
}

export function CounterSection({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveCountdown, initial);
  useSaved(state);

  return (
    <form action={action} className="panel stack">
      <p className="hint">
        Antes da abertura, o relógio conta até o início das vendas. Depois disso, conta até o encerramento. Horário de
        Brasília.
      </p>
      <div className="grid-2">
        <label className="field">
          Início das vendas
          <input type="datetime-local" name="start" required defaultValue={isoToDateTimeLocal(settings.countdownStart)} />
        </label>
        <label className="field">
          Fim da campanha
          <input type="datetime-local" name="end" required defaultValue={isoToDateTimeLocal(settings.countdownEnd)} />
        </label>
      </div>
      <SaveButton pending={pending} />
      <Message state={state} />
    </form>
  );
}

export function VideosSection({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveVideos, initial);
  useSaved(state);
  const promo = mediaUrl(settings.promoVideoUrl, DEFAULT_PROMO_VIDEO);
  const aqua = mediaUrl(settings.aquaVideoUrl, DEFAULT_AQUA_VIDEO);

  return (
    <form action={action} className="stack">
      <section className="panel stack">
        <h2>Vídeo da promoção</h2>
        <p className="hint">Aparece em “Como funciona”, com o botão de play. Caminho do site ou link http(s).</p>
        <label className="field">
          Arquivo
          <input name="promo_video_url" defaultValue={settings.promoVideoUrl} placeholder={DEFAULT_PROMO_VIDEO} />
        </label>
        <label className="field">
          Poster (opcional)
          <input name="promo_poster_url" defaultValue={settings.promoPosterUrl} placeholder="Imagem de capa" />
        </label>
        <video className="preview-video" controls preload="metadata" src={promo} />
      </section>
      <section className="panel stack">
        <h2>Vídeo do Aquafoz</h2>
        <p className="hint">Roda em loop, sem som, ao lado do texto do parque.</p>
        <label className="field">
          Arquivo
          <input name="aqua_video_url" defaultValue={settings.aquaVideoUrl} placeholder={DEFAULT_AQUA_VIDEO} />
        </label>
        <label className="field">
          Poster (opcional)
          <input name="aqua_poster_url" defaultValue={settings.aquaPosterUrl} placeholder="Imagem de capa" />
        </label>
        <video className="preview-video" controls muted preload="metadata" src={aqua} />
      </section>
      <SaveButton pending={pending} />
      <Message state={state} />
    </form>
  );
}

export function CommunitySection({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(saveCommunity, initial);
  useSaved(state);

  return (
    <form action={action} className="stack">
      <section className="panel stack">
        <h2>Comunidades do WhatsApp</h2>
        <p className="hint">
          Depois do cadastro, o confete continua e a pessoa é levada ao link deste idioma. Português usa o primeiro.
          Espanhol usa o segundo. Deixe em branco para não redirecionar.
        </p>
        <label className="field">
          Link em português
          <input
            name="whatsapp_community_pt"
            type="url"
            inputMode="url"
            defaultValue={settings.whatsappCommunityPt}
            placeholder="https://chat.whatsapp.com/..."
          />
        </label>
        <label className="field">
          Link em espanhol
          <input
            name="whatsapp_community_es"
            type="url"
            inputMode="url"
            defaultValue={settings.whatsappCommunityEs}
            placeholder="https://chat.whatsapp.com/..."
          />
        </label>
      </section>
      <SaveButton pending={pending} />
      <Message state={state} />
    </form>
  );
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function LeadsSection({ leads }: { leads: LeadRow[] }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const visible = leads.filter((lead) =>
    `${lead.nome} ${lead.sobrenome} ${lead.email} ${lead.whatsapp} ${lead.pais}`.toLowerCase().includes(needle),
  );

  const download = () => {
    const header = ["data", "nome", "sobrenome", "email", "pais", "whatsapp", "idioma"];
    const lines = visible.map((lead) =>
      [formatDateTime(lead.createdAt), lead.nome, lead.sobrenome, lead.email, lead.pais, lead.whatsapp, lead.idioma]
        .map(csvCell)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cadastrados-black-friday.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="panel stack">
      <div className="actions">
        <label className="field" style={{ flex: 1 }}>
          Buscar
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nome, e-mail ou WhatsApp" />
        </label>
        <button className="btn-secondary" type="button" onClick={download} disabled={visible.length === 0}>
          <Download size={16} />
          Exportar CSV
        </button>
      </div>
      <p className="hint">{visible.length} cadastro(s)</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>País</th>
              <th>WhatsApp</th>
              <th>Idioma</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((lead) => (
              <tr key={lead.id}>
                <td>{formatDateTime(lead.createdAt)}</td>
                <td>
                  {lead.nome} {lead.sobrenome}
                </td>
                <td>{lead.email}</td>
                <td>{lead.pais}</td>
                <td>{lead.whatsapp}</td>
                <td>{lead.idioma.toUpperCase()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visible.length === 0 && <p className="hint">Nenhum cadastro encontrado.</p>}
    </section>
  );
}

function faqKey(locale: FaqItem["locale"], variant: FaqItem["variant"]) {
  return `${locale}:${variant}`;
}

export function FaqAdmin({ faqs }: { faqs: FaqItem[] }) {
  const [state, action, pending] = useActionState(saveFaqs, initial);
  useSaved(state);
  const [locale, setLocale] = useState<FaqItem["locale"]>("pt");
  const [variant, setVariant] = useState<FaqItem["variant"]>("pre-venda");
  const [groups, setGroups] = useState<Record<string, { question: string; answer: string }[]>>(() => {
    const next: Record<string, { question: string; answer: string }[]> = {};
    for (const item of faqs) {
      const key = faqKey(item.locale, item.variant);
      next[key] ??= [];
      next[key].push({ question: item.question, answer: item.answer });
    }
    return next;
  });
  const current = groups[faqKey(locale, variant)] ?? [];

  const update = (items: { question: string; answer: string }[]) => {
    setGroups((prev) => ({ ...prev, [faqKey(locale, variant)]: items }));
  };

  return (
    <form action={action} className="stack">
      <div className="tabs">
        {(["pt", "es"] as const).map((item) => (
          <button key={item} type="button" className={item === locale ? "active" : ""} onClick={() => setLocale(item)}>
            {item === "pt" ? "Português" : "Espanhol"}
          </button>
        ))}
        {(["pre-venda", "vendas-abertas"] as const).map((item) => (
          <button key={item} type="button" className={item === variant ? "active" : ""} onClick={() => setVariant(item)}>
            {PAGE_LABEL[item]}
          </button>
        ))}
      </div>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="variant" value={variant} />
      <input type="hidden" name="items" value={JSON.stringify(current)} />

      {current.map((item, index) => (
        <article key={`${locale}-${variant}-${index}`} className="faq-item">
          <header>
            <strong>Pergunta {index + 1}</strong>
            <span className="actions">
              <button
                className="btn-secondary"
                type="button"
                aria-label="Subir"
                disabled={index === 0}
                onClick={() => {
                  const next = [...current];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  update(next);
                }}
              >
                <ChevronUp size={16} />
              </button>
              <button
                className="btn-secondary"
                type="button"
                aria-label="Descer"
                disabled={index === current.length - 1}
                onClick={() => {
                  const next = [...current];
                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                  update(next);
                }}
              >
                <ChevronDown size={16} />
              </button>
              <button
                className="btn-danger"
                type="button"
                onClick={() => update(current.filter((_, itemIndex) => itemIndex !== index))}
              >
                <Trash2 size={16} />
                Remover
              </button>
            </span>
          </header>
          <label className="field">
            Pergunta
            <input
              value={item.question}
              onChange={(event) => {
                const next = [...current];
                next[index] = { ...item, question: event.target.value };
                update(next);
              }}
            />
          </label>
          <label className="field">
            Resposta
            <textarea
              value={item.answer}
              onChange={(event) => {
                const next = [...current];
                next[index] = { ...item, answer: event.target.value };
                update(next);
              }}
            />
          </label>
        </article>
      ))}

      <div className="actions">
        <button
          className="btn-secondary"
          type="button"
          onClick={() => update([...current, { question: "", answer: "" }])}
        >
          <Plus size={16} />
          Nova pergunta
        </button>
        <SaveButton pending={pending} />
      </div>
      <p className="hint">Salve este idioma e esta página antes de trocar de aba, se tiver alterado a lista.</p>
      <Message state={state} />
    </form>
  );
}

export function FooterAdmin({ footers }: { footers: FooterContent[] }) {
  const [state, action, pending] = useActionState(saveFooter, initial);
  useSaved(state);
  const [locale, setLocale] = useState<"pt" | "es">("pt");
  const [drafts, setDrafts] = useState<Record<"pt" | "es", FooterContent>>(() => ({
    pt: footers.find((item) => item.locale === "pt") ?? blankFooter("pt"),
    es: footers.find((item) => item.locale === "es") ?? blankFooter("es"),
  }));
  const draft = drafts[locale];
  const set = (patch: Partial<FooterContent>) => setDrafts((prev) => ({ ...prev, [locale]: { ...prev[locale], ...patch } }));

  return (
    <form action={action} className="stack">
      <div className="tabs">
        {(["pt", "es"] as const).map((item) => (
          <button key={item} type="button" className={item === locale ? "active" : ""} onClick={() => setLocale(item)}>
            {item === "pt" ? "Português" : "Espanhol"}
          </button>
        ))}
      </div>
      <input type="hidden" name="locale" value={draft.locale} />
      <input type="hidden" name="logoAlt" value={draft.logoAlt} />
      <input type="hidden" name="tagline" value={draft.tagline} />
      <input type="hidden" name="resortTitle" value={draft.resortTitle} />
      <input type="hidden" name="aboutLabel" value={draft.aboutLabel} />
      <input type="hidden" name="aboutHref" value={draft.aboutHref} />
      <input type="hidden" name="privacyLabel" value={draft.privacyLabel} />
      <input type="hidden" name="privacyHref" value={draft.privacyHref} />
      <input type="hidden" name="termsLabel" value={draft.termsLabel} />
      <input type="hidden" name="termsHref" value={draft.termsHref} />
      <input type="hidden" name="contactsTitle" value={draft.contactsTitle} />
      <input type="hidden" name="phones" value={draft.phones} />
      <input type="hidden" name="address" value={draft.address} />
      <input type="hidden" name="serviceTitle" value={draft.serviceTitle} />
      <input type="hidden" name="hours" value={draft.hours} />

      <section className="panel stack">
        <h2>Marca</h2>
        <label className="field">
          Texto alternativo do logo
          <input value={draft.logoAlt} onChange={(event) => set({ logoAlt: event.target.value })} />
        </label>
        <label className="field">
          Frase
          <input value={draft.tagline} onChange={(event) => set({ tagline: event.target.value })} />
        </label>
      </section>

      <section className="panel stack">
        <h2>O resort</h2>
        <div className="grid-2">
          <label className="field">
            Título
            <input value={draft.resortTitle} onChange={(event) => set({ resortTitle: event.target.value })} />
          </label>
          <label className="field">
            Link “sobre”
            <input value={draft.aboutLabel} onChange={(event) => set({ aboutLabel: event.target.value })} />
          </label>
          <label className="field">
            Endereço do link
            <input value={draft.aboutHref} onChange={(event) => set({ aboutHref: event.target.value })} />
          </label>
        </div>
        <div className="grid-2">
          <label className="field">
            Privacidade
            <input value={draft.privacyLabel} onChange={(event) => set({ privacyLabel: event.target.value })} />
          </label>
          <label className="field">
            Link de privacidade
            <input value={draft.privacyHref} onChange={(event) => set({ privacyHref: event.target.value })} placeholder="Opcional" />
          </label>
          <label className="field">
            Termos
            <input value={draft.termsLabel} onChange={(event) => set({ termsLabel: event.target.value })} />
          </label>
          <label className="field">
            Link dos termos
            <input value={draft.termsHref} onChange={(event) => set({ termsHref: event.target.value })} placeholder="Opcional" />
          </label>
        </div>
      </section>

      <section className="panel stack">
        <h2>Contato e atendimento</h2>
        <div className="grid-2">
          <label className="field">
            Título dos contatos
            <input value={draft.contactsTitle} onChange={(event) => set({ contactsTitle: event.target.value })} />
          </label>
          <label className="field">
            Título do atendimento
            <input value={draft.serviceTitle} onChange={(event) => set({ serviceTitle: event.target.value })} />
          </label>
        </div>
        <label className="field">
          Telefones (um por linha)
          <textarea value={draft.phones} onChange={(event) => set({ phones: event.target.value })} />
        </label>
        <label className="field">
          Endereço
          <textarea value={draft.address} onChange={(event) => set({ address: event.target.value })} />
        </label>
        <label className="field">
          Horário (uma linha por período)
          <textarea value={draft.hours} onChange={(event) => set({ hours: event.target.value })} />
        </label>
      </section>
      <SaveButton pending={pending} />
      <Message state={state} />
    </form>
  );
}
