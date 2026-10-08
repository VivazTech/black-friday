import { HomePage, homeMetadata } from "@/components/pages/HomePage";

export const dynamic = "force-dynamic";

export const generateMetadata = () => homeMetadata("pt");

export default function Page() {
  return <HomePage locale="pt" />;
}
