import type { Metadata } from "next";
import { VipRedirect } from "@/components/VipRedirect";
import { getCampaign } from "@/lib/campaign";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "VIP — Vivaz Cataratas",
  robots: { index: false, follow: false },
};

export default async function VipBrPage() {
  const { settings } = await getCampaign();
  return <VipRedirect locale="pt" destination={settings.whatsappFormPt} />;
}
