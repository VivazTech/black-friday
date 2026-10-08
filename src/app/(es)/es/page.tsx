import { HomePage, homeMetadata } from "@/components/pages/HomePage";

export const dynamic = "force-dynamic";

export const generateMetadata = () => homeMetadata("es");

export default function Page() {
  return <HomePage locale="es" />;
}
