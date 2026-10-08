import type { Metadata } from "next";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { getCampaign, listLeads } from "@/lib/campaign";
import type { LeadRow } from "@/lib/schedule";
import { LoginForm } from "./AdminForms";
import { AdminShell } from "./ui/AdminShell";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Painel | Black Friday Vivaz Cataratas",
  robots: { index: false, follow: false },
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ secao?: string }> }) {
  if (!adminConfigured()) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <h1>Painel indisponível</h1>
          <p className={styles.lead}>
            Defina SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY para ativar o painel.
          </p>
        </div>
      </main>
    );
  }

  if (!(await isAdmin())) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <h1>Painel Black Friday</h1>
          <p className={styles.lead}>Entre com o e-mail cadastrado no Supabase.</p>
          <LoginForm />
        </div>
      </main>
    );
  }

  const params = await searchParams;
  const campaign = await getCampaign();
  let leads: LeadRow[] = [];
  if (campaign.source === "database") {
    try {
      leads = await listLeads();
    } catch (error) {
      console.error("Falha ao listar cadastros:", error);
    }
  }

  return <AdminShell initialSection={params.secao ?? "visao"} campaign={campaign} leads={leads} />;
}
