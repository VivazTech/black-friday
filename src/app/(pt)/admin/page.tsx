import type { Metadata } from "next";
import Link from "next/link";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { getSiteMode, sheetsConfigured } from "@/lib/sheets";
import { LoginForm, ModeForm } from "./AdminForms";
import { logout } from "./actions";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Painel | Black Friday Vivaz Cataratas",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>
          <h1>Painel indisponível</h1>
          <p className={styles.lead}>
            Defina a variável de ambiente ADMIN_PASSWORD (mínimo de 8 caracteres) para ativar o painel.
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
          <p className={styles.lead}>Entre para escolher a página que fica no endereço principal.</p>
          <LoginForm />
        </div>
      </main>
    );
  }

  const mode = await getSiteMode();

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Página principal</h1>
        <p className={styles.lead}>
          Escolha o que aparece em promo.vivazcataratas.com.br/black-friday (e em /es).
        </p>
        {!sheetsConfigured && (
          <p className={styles.warning}>
            Planilha não configurada: a escolha fica salva só neste servidor e os cadastros não são
            enviados ao Google Sheets.
          </p>
        )}
        <ModeForm current={mode} />
        <div className={styles.links}>
          <Link href="/" target="_blank">
            Ver página principal
          </Link>
          <Link href="/vendas-abertas" target="_blank">
            Ver vendas abertas
          </Link>
          <form action={logout} className={styles.logout}>
            <button type="submit">Sair</button>
          </form>
        </div>
      </div>
    </main>
  );
}
