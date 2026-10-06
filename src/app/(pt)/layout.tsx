import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Shell, siteViewport } from "../shell";

export const metadata: Metadata = { metadataBase: new URL("https://promo.vivazcataratas.com.br") };
export const viewport: Viewport = siteViewport;

export default function Layout({ children }: { children: ReactNode }) {
  return <Shell lang="pt-BR">{children}</Shell>;
}
