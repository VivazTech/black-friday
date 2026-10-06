"use client";

import { useActionState } from "react";
import type { SiteMode } from "@/lib/site";
import { login, saveMode, type AdminState } from "./actions";
import styles from "./admin.module.css";

const initial: AdminState = { message: "", error: false };

function Message({ state }: { state: AdminState }) {
  return (
    <p className={`${styles.message}${state.error ? ` ${styles.error}` : ""}`} role="status" aria-live="polite">
      {state.message}
    </p>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action}>
      <label className={styles.field}>
        Senha
        <input name="senha" type="password" autoComplete="current-password" required />
      </label>
      <button className="button button-yellow" type="submit" disabled={pending}>
        {pending ? "ENTRANDO..." : "ENTRAR"}
      </button>
      <Message state={state} />
    </form>
  );
}

const options: { value: SiteMode; title: string; text: string }[] = [
  {
    value: "pre-venda",
    title: "Pré-venda",
    text: "Página de cadastro para acesso antecipado. Use até a abertura das vendas.",
  },
  {
    value: "vendas-abertas",
    title: "Vendas abertas",
    text: "Página com o calendário de datas e descontos. Use a partir da abertura das vendas.",
  },
];

export function ModeForm({ current }: { current: SiteMode }) {
  const [state, action, pending] = useActionState(saveMode, initial);

  return (
    <form action={action}>
      <fieldset className={styles.options}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input type="radio" name="modo" value={option.value} defaultChecked={option.value === current} />
            <span>
              <strong>
                {option.title}
                {option.value === current && <span className={styles.current}>NO AR</span>}
              </strong>
              <small>{option.text}</small>
            </span>
          </label>
        ))}
      </fieldset>
      <button className="button button-yellow" type="submit" disabled={pending}>
        {pending ? "SALVANDO..." : "SALVAR"}
      </button>
      <Message state={state} />
    </form>
  );
}
