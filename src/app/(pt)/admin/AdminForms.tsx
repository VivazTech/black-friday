"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SUPPORT_WHATSAPP } from "@/lib/support";
import { login, requestReset, updatePassword, type AdminState } from "./actions";
import styles from "./admin.module.css";

const initial: AdminState = { message: "", error: false, done: false, stamp: 0 };

function Message({ state }: { state: AdminState }) {
  if (!state.message) return null;
  return (
    <p className={`${styles.message}${state.error ? ` ${styles.error}` : ""}`} role="status" aria-live="polite">
      {state.message}
    </p>
  );
}

function SupportLink() {
  return (
    <a className={styles.support} href={SUPPORT_WHATSAPP} target="_blank" rel="noopener noreferrer">
      Suporte
    </a>
  );
}

export function LoginForm() {
  const [mode, setMode] = useState<"entrar" | "esqueci">("entrar");
  const [loginState, loginAction, loginPending] = useActionState(login, initial);
  const [resetState, resetAction, resetPending] = useActionState(requestReset, initial);
  const router = useRouter();

  useEffect(() => {
    if (loginState.done) router.refresh();
  }, [loginState.done, loginState.stamp, router]);

  return (
    <>
      {mode === "entrar" && (
        <form action={loginAction}>
          <label className={styles.field}>
            E-mail
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label className={styles.field}>
            Senha
            <input name="senha" type="password" autoComplete="current-password" minLength={8} required />
          </label>
          <div className={styles.row}>
            <label>
              <input className={styles.check} name="lembrar" type="checkbox" />
              Lembrar de mim
            </label>
            <button className={styles.linkish} type="button" onClick={() => setMode("esqueci")}>
              Esqueci a senha
            </button>
          </div>
          <button className="button button-yellow" type="submit" disabled={loginPending}>
            {loginPending ? "ENTRANDO..." : "ENTRAR"}
          </button>
          <Message state={loginState} />
        </form>
      )}

      {mode === "esqueci" && (
        <form action={resetAction}>
          <label className={styles.field}>
            E-mail
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <button className="button button-yellow" type="submit" disabled={resetPending}>
            {resetPending ? "ENVIANDO..." : "ENVIAR LINK"}
          </button>
          <button className={styles.linkish} type="button" onClick={() => setMode("entrar")}>
            Voltar ao login
          </button>
          <Message state={resetState} />
        </form>
      )}

      <SupportLink />
    </>
  );
}

export function ResetForm() {
  const [state, action, pending] = useActionState(updatePassword, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.done) router.push("/admin");
  }, [state.done, state.stamp, router]);

  return (
    <form action={action}>
      <label className={styles.field}>
        Nova senha
        <input name="senha" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      <label className={styles.field}>
        Confirmar senha
        <input name="confirmar" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      <button className="button button-yellow" type="submit" disabled={pending}>
        {pending ? "SALVANDO..." : "SALVAR SENHA"}
      </button>
      <Message state={state} />
      <SupportLink />
    </form>
  );
}
