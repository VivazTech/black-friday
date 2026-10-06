import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { BASE_PATH } from "./site";

const COOKIE = "bf_admin";
const SESSION_HOURS = 8;
const password = () => process.env.ADMIN_PASSWORD ?? "";

export const adminConfigured = () => password().length >= 8;

const sign = (expires: string) => createHmac("sha256", password()).update(expires).digest("hex");

function safeEqual(a: string, b: string) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);
  return first.length === second.length && timingSafeEqual(first, second);
}

export function passwordMatches(candidate: string) {
  // Compara os hashes para não revelar o tamanho da senha pelo tempo de resposta.
  const hash = (value: string) => createHmac("sha256", "bf-admin").update(value).digest("hex");
  return adminConfigured() && safeEqual(hash(candidate), hash(password()));
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const [expires, signature] = ((await cookies()).get(COOKIE)?.value ?? "").split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}

export async function startSession() {
  const expires = String(Date.now() + SESSION_HOURS * 3600 * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: `${BASE_PATH}/admin`,
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function endSession() {
  (await cookies()).set(COOKIE, "", { path: `${BASE_PATH}/admin`, maxAge: 0 });
}
