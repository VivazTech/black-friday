import { HomePage, homeMetadata } from "@/components/pages/HomePage";

export const generateMetadata = () => homeMetadata("pt");

export default function Page() {
  return <HomePage locale="pt" />;
}
