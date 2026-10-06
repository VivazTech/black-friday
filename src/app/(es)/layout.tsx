import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Shell, siteViewport } from "../shell";

export const metadata: Metadata = { metadataBase: new URL("https://ofertas.vivazcataratas.com.br") };
export const viewport: Viewport = siteViewport;

export default function Layout({ children }: { children: ReactNode }) {
  return <Shell lang="es">{children}</Shell>;
}
