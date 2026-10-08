import { League_Spartan } from "next/font/google";
import type { ReactNode } from "react";
import { BASE_PATH } from "@/lib/site";
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
      <head>
        <link rel="icon" href={`${BASE_PATH}/favicon.png`} type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href={`${BASE_PATH}/apple-touch-icon.png`} />
      </head>
      <body>{children}</body>
    </html>
  );
}
