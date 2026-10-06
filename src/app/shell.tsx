import { League_Spartan } from "next/font/google";
import type { ReactNode } from "react";
import "@/styles/styles.css";
import "@/styles/overrides.css";

// O next/font hospeda a fonte com o nome "League Spartan", o mesmo usado no CSS do designer.
const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-league-spartan",
});

export const siteViewport = { themeColor: "#171817" };

/** Documento HTML compartilhado pelos layouts de cada idioma. */
export function Shell({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <html lang={lang} className={leagueSpartan.variable}>
      <body>{children}</body>
    </html>
  );
}
