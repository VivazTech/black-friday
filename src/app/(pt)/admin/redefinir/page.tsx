import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { ResetForm } from "../AdminForms";
import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nova senha | Black Friday Vivaz Cataratas",
  robots: { index: false, follow: false },
};

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const params = await searchParams;
  const ready = params.erro !== "1" && (await isAdmin());

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1>Nova senha</h1>
        {ready ? (
          <>
            <p className={styles.lead}>Escolha a senha que vai usar para entrar no painel.</p>
            <ResetForm />
          </>
        ) : (
          <>
            <p className={styles.lead}>Esse link expirou ou já foi usado. Peça outro em Esqueci a senha.</p>
            <Link href="/admin">Voltar ao login</Link>
          </>
        )}
      </div>
    </main>
  );
}
