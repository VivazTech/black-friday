import { salesMetadata } from "@/components/pages/HomePage";
import SalesPage from "@/components/pages/SalesPage";

export const dynamic = "force-dynamic";

export const metadata = salesMetadata("es");

export default function Page() {
  return <SalesPage locale="es" route="sales" />;
}
