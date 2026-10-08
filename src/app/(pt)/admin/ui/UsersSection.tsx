"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "@/lib/schedule";
import type { PanelUser } from "@/lib/campaign";
import { deletePanelUser, savePanelUser, type AdminState } from "../actions";

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

export function UsersSection({ users }: { users: PanelUser[] }) {
  const [state, action, pending] = useActionState(savePanelUser, initial);
  useSaved(state);

  return (
    <div className="stack">
      <form action={action} className="panel stack">
        <h2>Novo acesso</h2>
        <p className="hint">A pessoa entra no painel com este e-mail e esta senha. A senha fica só com ela.</p>
        <div className="grid-2">
          <label className="field">
            E-mail
            <input name="email" type="email" required autoComplete="off" placeholder="nome@empresa.com" />
          </label>
          <label className="field">
            Senha
            <input name="senha" type="password" required minLength={8} maxLength={72} autoComplete="new-password" />
          </label>
          <label className="field">
            Confirmar senha
            <input name="confirmar" type="password" required minLength={8} maxLength={72} autoComplete="new-password" />
          </label>
        </div>
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Salvando..." : "Adicionar acesso"}
        </button>
        <Message state={state} />
      </form>

      <section className="panel stack">
        <h2>Quem pode entrar</h2>
        {users.length === 0 && <p className="hint">Nenhum acesso encontrado.</p>}
        {users.map((user) =>
          user.locked ? (
            <article key={user.id} className="faq-item">
              <header>
                <strong>{user.email}</strong>
                <span className="pill">PRINCIPAL</span>
              </header>
              <p className="hint">Esta conta não pode ser editada nem removida pelo painel.</p>
              <p className="hint">Último acesso: {formatDateTime(user.lastSignInAt)}</p>
            </article>
          ) : (
            <UserCard key={user.id} user={user} />
          ),
        )}
      </section>
    </div>
  );
}

function UserCard({ user }: { user: PanelUser }) {
  const [saveState, saveAction, savePending] = useActionState(savePanelUser, initial);
  const [deleteState, deleteAction, deletePending] = useActionState(deletePanelUser, initial);
  const [confirming, setConfirming] = useState(false);
  useSaved(saveState);
  useSaved(deleteState);

  return (
    <article className="faq-item">
      <form action={saveAction} className="stack">
        <input type="hidden" name="id" value={user.id} />
        <div className="grid-2">
          <label className="field">
            E-mail
            <input name="email" type="email" required defaultValue={user.email} autoComplete="off" />
          </label>
          <label className="field">
            Nova senha
            <input
              name="senha"
              type="password"
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              placeholder="Deixe em branco para manter"
            />
          </label>
          <label className="field">
            Confirmar nova senha
            <input name="confirmar" type="password" minLength={8} maxLength={72} autoComplete="new-password" />
          </label>
        </div>
        <p className="hint">
          Criado em {formatDateTime(user.createdAt)}. Último acesso: {formatDateTime(user.lastSignInAt)}. Trocar a senha
          encerra as sessões dessa conta.
        </p>
        <div className="actions">
          <button className="btn" type="submit" disabled={savePending}>
            {savePending ? "Salvando..." : "Salvar"}
          </button>
          <button className="btn-danger" type="button" onClick={() => setConfirming((value) => !value)}>
            Remover
          </button>
        </div>
        <Message state={saveState} />
      </form>
      {confirming && (
        <form action={deleteAction} className="actions">
          <input type="hidden" name="id" value={user.id} />
          <input type="hidden" name="email" value={user.email} />
          <p className="hint">Remover {user.email}? A pessoa deixa de entrar no painel.</p>
          <button className="btn-danger" type="submit" disabled={deletePending}>
            {deletePending ? "Removendo..." : "Confirmar remoção"}
          </button>
          <Message state={deleteState} />
        </form>
      )}
    </article>
  );
}
