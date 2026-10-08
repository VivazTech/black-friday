"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CircleHelp,
  Clock3,
  Clapperboard,
  ChevronsRight,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Monitor,
  Moon,
  PanelBottom,
  Sun,
  Timer,
  Users,
  MessageCircle,
} from "lucide-react";
import type { Campaign, LeadRow } from "@/lib/schedule";
import { logout } from "../actions";
import {
  CounterSection,
  Dashboard,
  FaqAdmin,
  FooterAdmin,
  LeadsSection,
  PageSection,
  TestSection,
  VideosSection,
  CommunitySection,
} from "./sections";
import "../admin-ui.css";

const NAV = [
  { id: "visao", title: "Visão geral", icon: LayoutDashboard },
  { id: "pagina", title: "Página no ar", icon: Monitor },
  { id: "teste", title: "Testar troca", icon: Timer },
  { id: "contador", title: "Contador", icon: Clock3 },
  { id: "videos", title: "Vídeos", icon: Clapperboard },
  { id: "cadastros", title: "Cadastrados", icon: Users },
  { id: "comunidade", title: "Comunidade", icon: MessageCircle },
  { id: "duvidas", title: "Dúvidas", icon: CircleHelp },
  { id: "rodape", title: "Rodapé", icon: PanelBottom },
] as const;

export type SectionId = (typeof NAV)[number]["id"];

const COPY: Record<SectionId, { title: string; text: string }> = {
  visao: { title: "Visão geral", text: "O que está no ar e o que entrou pelos formulários." },
  pagina: { title: "Página no ar", text: "Escolha a página principal e a data em que ela troca sozinha." },
  teste: { title: "Testar troca", text: "Simule um horário para ver qual página estaria no ar, sem alterar o site." },
  contador: { title: "Contador", text: "Datas de abertura e encerramento usadas no relógio do topo." },
  videos: { title: "Vídeos", text: "Vídeo da promoção e vídeo em loop do Aquafoz." },
  cadastros: { title: "Cadastrados", text: "Pessoas que enviaram o formulário da pré-venda." },
  comunidade: {
    title: "Comunidade",
    text: "Links do botão que aparece depois do cadastro. Um para o português e outro para o espanhol.",
  },
  duvidas: { title: "Dúvidas frequentes", text: "Perguntas e respostas de cada idioma e de cada página." },
  rodape: { title: "Rodapé", text: "Textos, telefones, endereço e horário de atendimento." },
};

function isSection(value: string): value is SectionId {
  return NAV.some((item) => item.id === value);
}

export function AdminShell({
  initialSection,
  campaign,
  leads,
}: {
  initialSection: string;
  campaign: Campaign;
  leads: LeadRow[];
}) {
  const [open, setOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const [selected, setSelected] = useState<SectionId>(isSection(initialSection) ? initialSection : "visao");
  const copy = COPY[selected];
  const faqKey = useMemo(() => campaign.faqs.map((item) => item.id).join(","), [campaign.faqs]);

  const choose = (id: SectionId) => {
    setSelected(id);
    const url = new URL(window.location.href);
    url.searchParams.set("secao", id);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  };

  useEffect(() => {
    if (isSection(initialSection)) setSelected(initialSection);
  }, [initialSection]);

  return (
    <div className={`admin-root${dark ? " dark" : ""}`}>
      <nav className={`sidebar${open ? " open" : " closed"}`}>
        <div className="brand">
          <div className="brand-id">
            <div className="logo">V</div>
            {open && (
              <div>
                <strong>Vivaz Cataratas</strong>
                <small>Black Friday</small>
              </div>
            )}
          </div>
        </div>

        <div className="nav-group">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item${selected === item.id ? " active" : ""}`}
              onClick={() => choose(item.id)}
            >
              <span className="nav-icon">
                <item.icon />
              </span>
              {open && <span className="nav-text">{item.title}</span>}
              {item.id === "cadastros" && open && leads.length > 0 && (
                <span className="nav-badge">{leads.length > 99 ? "99+" : leads.length}</span>
              )}
            </button>
          ))}
        </div>

        {open && (
          <div className="nav-label-block">Conta</div>
        )}
        <div className="nav-group">
          <Link className="nav-item" href="/" target="_blank">
            <span className="nav-icon">
              <ExternalLink />
            </span>
            {open && <span className="nav-text">Ver o site</span>}
          </Link>
          <form action={logout} className="logout-form">
            <button className="nav-item" type="submit">
              <span className="nav-icon">
                <LogOut />
              </span>
              {open && <span className="nav-text">Sair</span>}
            </button>
          </form>
        </div>

        <button type="button" className="sidebar-toggle" onClick={() => setOpen((value) => !value)}>
          <span>
            <span className="nav-icon">
              <ChevronsRight />
            </span>
            {open && "Ocultar"}
          </span>
        </button>
      </nav>

      <div className="content">
        <header className="content-head">
          <div>
            <h1>{copy.title}</h1>
            <p>{copy.text}</p>
          </div>
          <div className="head-actions">
            <Link className="ghost-link" href="/" target="_blank" aria-label="Abrir o site">
              <ExternalLink />
            </Link>
            <button type="button" className="icon-btn" onClick={() => setDark((value) => !value)} aria-label="Alternar tema">
              {dark ? <Sun /> : <Moon />}
            </button>
          </div>
        </header>

        {campaign.source === "fallback" && (
          <p className="banner">
            Supabase indisponível. O site continua com o conteúdo fixo e a planilha, e os salvamentos deste painel
            não vão gravar até a conexão voltar.
          </p>
        )}

        {selected === "visao" && <Dashboard campaign={campaign} leads={leads} onOpen={choose} />}
        {selected === "pagina" && <PageSection key={campaign.settings.updatedAt} settings={campaign.settings} />}
        {selected === "teste" && <TestSection settings={campaign.settings} onConfigure={() => choose("pagina")} />}
        {selected === "contador" && <CounterSection key={campaign.settings.updatedAt} settings={campaign.settings} />}
        {selected === "videos" && <VideosSection key={campaign.settings.updatedAt} settings={campaign.settings} />}
        {selected === "cadastros" && <LeadsSection leads={leads} />}
        {selected === "comunidade" && (
          <CommunitySection key={campaign.settings.updatedAt} settings={campaign.settings} />
        )}
        {selected === "duvidas" && <FaqAdmin key={faqKey} faqs={campaign.faqs} />}
        {selected === "rodape" && (
          <FooterAdmin key={campaign.footers.map((item) => item.locale + item.tagline).join("|")} footers={campaign.footers} />
        )}
      </div>
    </div>
  );
}
