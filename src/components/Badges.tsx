import Image from "next/image";
import seloCriancas from "@/assets/selo-criancas-gratis.webp";
import seloDesconto from "@/assets/selo-desconto.webp";
import seloIngressos from "@/assets/selo-ingressos.webp";
import seloParcelamento from "@/assets/selo-parcelamento.webp";
import seloParque from "@/assets/selo-parque-aquatico.webp";
import seloVendas from "@/assets/selo-vendas.webp";
import seloVip from "@/assets/selo-vip.webp";
import { getContent, type Locale } from "@/content";
import { Marquee } from "./Marquee";

const seals = [
  seloCriancas,
  seloParcelamento,
  seloDesconto,
  seloParque,
  seloVip,
  seloIngressos,
  seloVendas,
];

export function Badges({ locale }: { locale: Locale }) {
  const t = getContent(locale).badges;
  const group = (hidden: boolean) =>
    seals.map((seal, index) => (
      <Image key={index} src={seal} alt={hidden ? "" : t.items[index]} sizes="300px" loading="eager" />
    ));

  return (
    <Marquee name="badges" containerClass="badges" speed={42} label={t.label} copy={group(true)}>
      {group(false)}
    </Marquee>
  );
}

export function PatternStrip() {
  const text = (
    <>
      BLACK FRIDAY VIVAZ <b>%</b>
    </>
  );
  return (
    <Marquee name="pattern" containerClass="pattern-strip" speed={45} copy={text}>
      {text}
    </Marquee>
  );
}
