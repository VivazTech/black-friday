import { ptFaqs } from "./faq-items";
import type { Content } from "./types";

export const pt: Content = {
  locale: "pt",
  htmlLang: "pt-BR",
  dateLocale: "pt-BR",
  meta: {
    preSale: {
      title: "Black Friday Vivaz Cataratas 2026",
      description: "Acesso antecipado à Black Friday Vivaz Cataratas 2026.",
    },
    sales: {
      title: "Black Friday Vivaz Cataratas 2026 | Vendas",
      description: "Escolha as datas da sua viagem na Black Friday Vivaz Cataratas 2026.",
    },
  },
  skipLink: "Pular para o conteúdo",
  topbar: {
    brandLabel: "Vivaz Cataratas, início",
    contact: "Contato",
    support: "Atendimento",
    langLabel: "Idioma",
  },
  countdown: {
    preSaleLabel: (
      <>
        As vendas abertas
        <br />
        começam em:
      </>
    ),
    beforeSales: "A campanha começa em:",
    untilEnd: "As vendas abertas terminam em:",
    ariaOpening: "Contagem regressiva para abertura",
    ariaClosing: "Contagem regressiva para o fim das vendas",
    units: ["dias", "horas", "min", "seg"],
  },
  cta: {
    early: "QUERO ACESSO ANTECIPADO",
    dates: "VER DATAS E DESCONTOS",
    how: "Entender como funciona ↓",
  },
  hero: {
    backgroundAlt: "Piscina do Vivaz Cataratas em um dia ensolarado",
    badgeAlt: "Black Friday Vivaz Cataratas 2026, até 45% OFF",
    offerLeft: (
      <>
        <strong>Semana de Vendas:</strong>
        <span>
          Ofertas disponíveis do dia <b>23 a 29 de novembro</b>
        </span>
      </>
    ),
    offerRight: (
      <>
        <strong>Hospedagens:</strong>
        <span>De janeiro a outubro de 2027 em datas selecionadas</span>
      </>
    ),
    offerRightSales: (
      <>
        <strong>Hospedagens:</strong>
        <span>
          De <b>janeiro a outubro</b> de 2027 em datas selecionadas
        </span>
      </>
    ),
    title: (
      <>
        Garanta suas férias em Foz do Iguaçu com até <em>45% OFF!</em>
      </>
    ),
    benefits: [
      "Café da manhã incluso",
      "Até 2 crianças cortesia*",
      "Aquamania na temporada*",
      "2 ingressos infantis*",
    ],
  },
  badges: {
    label: "Benefícios da campanha",
    items: [
      "Crianças grátis",
      "Parcele em até 10 vezes",
      "Reservas com até 45% OFF",
      "Parque aquático incluso",
      "Benefícios exclusivos VIP",
      "Dois ingressos infantis Aquafoz cortesia",
      "Vendas de 23 a 29 de novembro",
    ],
  },
  signup: {
    eyebrow: "CADASTRE-SE",
    title: (
      <>
        Receba <b>2 dias de acesso antecipado</b> para reservar as melhores datas.
      </>
    ),
    text: "Cadastre-se e tenha a chance de escolher as melhores datas antes de todo mundo. Seu próximo momento especial pode começar por aqui! ✨",
    formTitle: "Quero receber acesso antecipado",
    formText: "Preencha seus dados. Após o cadastro, você poderá entrar no canal VIP do WhatsApp.",
    firstName: "Nome",
    firstNamePlaceholder: "Seu nome",
    lastName: "Sobrenome",
    lastNamePlaceholder: "Seu sobrenome",
    email: "E-mail",
    emailPlaceholder: "voce@email.com",
    country: "País",
    countries: [
      { value: "Brasil", label: "Brasil" },
      { value: "Paraguai", label: "Paraguai" },
      { value: "Argentina", label: "Argentina" },
      { value: "Outro", label: "Outro" },
    ],
    whatsapp: "WhatsApp",
    consent:
      "Aceito receber comunicações sobre promoções, novidades e ofertas do Vivaz Cataratas, conforme a Política de Privacidade.",
    note: "Sem spam. Você pode sair da lista quando quiser.",
    sending: "ENVIANDO...",
    success: "Seu acesso antecipado está garantido.",
    thanksTitle: "Obrigado!",
    community: "ENTRAR NA COMUNIDADE",
    errorRequired: "Confira os campos obrigatórios e aceite os termos.",
    errorWhatsapp: "Informe um WhatsApp válido.",
    errorServer: "Não foi possível enviar seu cadastro agora. Tente novamente em instantes.",
  },
  how: {
    eyebrow: "SIMPLES E TRANSPARENTE",
    title: "A promoção em poucos segundos",
    intro:
      "Uma jornada curta para você chegar à semana de vendas já sabendo como aproveitar a melhor oportunidade.",
    videoLabel: "Vídeo de 15 segundos da Black Friday Vivaz",
    playLabel: "Reproduzir vídeo da promoção",
    videoFallback: "Seu navegador não suporta vídeo.",
    steps: [
      {
        title: "Cadastre-se",
        text: "Deixe seus dados para receber as comunicações e o aviso de abertura.",
      },
      {
        title: "Acompanhe a abertura",
        text: "Quando as vendas começarem, as datas promocionais e percentuais ficarão visíveis no calendário.",
      },
      {
        title: "Escolha sua viagem",
        text: "Selecione período, hóspedes e acomodação para consultar disponibilidade e finalizar a reserva.",
      },
    ],
  },
  aqua: {
    videoLabel: "Vídeo das atrações do Aquafoz",
    title: (
      <>
        Garanta sua reserva e ganhe <b>dois ingressos infantis exclusivos!</b>
      </>
    ),
    textPreSale: (
      <>
        Na Black Friday Vivaz Cataratas, quem reserva ganha mais:{" "}
        <b>2 ingressos cortesia para o Aquafoz e 10% off em todos os serviços do Spa Vivaz Cataratas.</b>{" "}
        Aproveite este benefício exclusivo para duas crianças de até 10 anos e transforme sua estadia em
        uma experiência completa em Foz do Iguaçu.
      </>
    ),
    textSales: (
      <>
        Na Black Friday Vivaz Cataratas, quem reserva ganha mais:{" "}
        <b>2 ingressos cortesia para o Aquafoz e 10% off em todos os serviços do Spa Vivaz Cataratas.</b>{" "}
        Aproveite este benefício exclusivo para duas crianças de até 10 anos e transforme sua estadia em
        uma experiência completa em Foz do Iguaçu.
      </>
    ),
  },
  gallery: {
    title: (
      <>
        A melhor chance de aproveitar
        <br /> as férias dos seus <b>sonhos!</b>
      </>
    ),
    previous: "Fotos anteriores",
    next: "Próximas fotos",
    otherPhoto: (title) => `Outra foto de ${title.toLowerCase()}`,
    previousPhoto: (title) => `Ver foto anterior de ${title}`,
    nextPhoto: (title) => `Ver foto próxima de ${title}`,
    cards: [
      { title: "Piscina Aquecida", text: "Perfeita para qualquer estação.", alt: "Piscina aquecida" },
      {
        title: "Piscina ao Ar Livre",
        text: "Aproveite o verão com uma vista paradisíaca.",
        alt: "Piscina ao ar livre",
      },
      { title: "Parque Aquático", text: "Aquamania incluso na estadia", alt: "Parque aquático" },
      { title: "Acomodações", text: "Opções para você e sua família", alt: "Acomodações do resort" },
      { title: "Allegro", text: "O restaurante do resort.", alt: "Restaurante Allegro" },
      { title: "Spa", text: "Massagens e momentos de cuidado.", alt: "Spa Vivaz Cataratas" },
      { title: "La Terrazza", text: "Sabores intensos e pratos refinados.", alt: "Gastronomia La Terrazza" },
      { title: "Natureza", text: "Trilhas e paisagens ao redor do resort.", alt: "Natureza ao redor do resort" },
      {
        title: "Destino",
        text: "Localizado a 10 minutos das Cataratas do Iguaçu",
        alt: "Destino Cataratas do Iguaçu",
      },
    ],
  },
  reviews: {
    title: (
      <>
        Avaliações dos hóspedes que
        <br /> aproveitaram a <em>Black Friday Vivaz.</em>
      </>
    ),
    intro:
      "Comentários de hóspedes destacam a estrutura, a gastronomia e o atendimento como pontos marcantes da estadia.",
    items: [
      {
        text: "“Já me hospedei no Vivaz Cataratas várias vezes e é sempre uma experiência maravilhosa! Aproveitei uma das hospedagens pela promoção de Black Friday e posso dizer que vale muito a pena pelo excelente custo-benefício. O ambiente é tranquilo, acolhedor e perfeito para descansar e curtir momentos especiais, seja em família ou com amigos. Além de toda a estrutura do resort, adoramos a sala de jogos, com fliperamas, mesa de sinuca, pebolim, PlayStation e várias opções de diversão.\nÉ aquele lugar onde conseguimos realmente desacelerar, aproveitar e criar boas lembranças juntos. Com certeza, voltaremos!”",
        author: "@Regina Costa",
      },
      {
        text: "“Morando na região, eu escolho o Vivaz Cataratas Resort para descanso. Seus quartos são confortáveis e o café da manhã é maravilhoso. Adoro passar o final de semana relaxando na piscina aquecida ou, nos dias de calor, na piscina normal, curtindo a jacuzzi e a área de lazer sem pressa. É o lugar perfeito para desligar, recarregar as energias e se sentir em casa, com todo o conforto e tranquilidade que procuro.”",
        author: "@Gilberto Brum",
      },
    ],
  },
  faq: {
    eyebrow: "SEM LETRAS MIÚDAS ESCONDIDAS",
    title: (
      <>
        Dúvidas
        <br />
        frequentes
      </>
    ),
    introPreSale: "As regras mais importantes ficam acessíveis antes do cadastro e antes da reserva.",
    introSales: "Consulte as regras antes de escolher suas datas e acomodação.",
    preSale: ptFaqs,
    sales: ptFaqs,
  },
  finalCta: {
    preSale: {
      eyebrow: "CADASTRE-SE AGORA",
      title: "Chegue à semana de vendas pronto para escolher sua melhor data.",
      text: "Receba o acesso antecipado às ofertas da Black Friday Vivaz Cataratas.",
    },
    sales: { title: "Escolha suas datas e encontre a melhor oportunidade para suas férias." },
  },
  footer: {
    logoAlt: "Vivaz Cataratas Resort",
    tagline: "Todos os detalhes para uma experiência única.",
    resort: "O Resort",
    about: "Sobre o Resort",
    privacy: "Política de Privacidade",
    terms: "Termos e Condições",
    contacts: "Contatos",
    address: "Av. das Cataratas, 6798 — Carimã, Foz do Iguaçu - PR",
    service: "Atendimento",
    hours: (
      <>
        Segunda a sexta das 8:00 às 21:00
        <br />
        Sábado das 08h às 18h
        <br />
        Domingo e feriados das 08h às 16h.
      </>
    ),
  },
  booking: {
    title: "Quando você quer se hospedar?",
    text: "Escolha entrada e saída. O desconto aparece diretamente no dia.",
    legendLabel: "Legenda dos descontos",
    period: "P E R Í O D O",
    checkin: "Entrada",
    checkout: "Saída",
    select: "Selecione",
    clearCheckin: "Remover data de entrada",
    clearCheckout: "Remover data de saída",
    previousMonth: "Mês anterior",
    nextMonth: "Próximo mês",
    weekdays: ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"],
    months: [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
    ],
    monthTitle: (month, year) => `${month[0].toUpperCase()}${month.slice(1)} de ${year}`,
    gridLabel: "Datas disponíveis para hospedagem",
    dayLabel: (day, month, year) => `${day} de ${month} de ${year}`,
    available: "disponível",
    unavailable: "indisponível",
    discountLabel: (discount) => `${discount}% de desconto`,
    soldOut: "Esgotado",
    note: "Prévia demonstrativa: descontos e disponibilidade serão substituídos pelos dados oficiais antes da publicação comercial.",
    search: "BUSCAR DISPONIBILIDADE",
    apply: "APLICAR",
    tripTitle: "Sua viagem",
    tripText: "Selecione as datas e informe a ocupação.",
    rooms: "Quartos",
    roomsHint: "Quantidade",
    adults: "Adultos",
    adultsHint: "A partir de 12 anos",
    children: "Crianças",
    childrenHint: "Informe a idade",
    decrease: (label) => `Diminuir ${label.toLowerCase()}`,
    increase: (label) => `Aumentar ${label.toLowerCase()}`,
    childAge: (index) => `Idade da criança ${index}`,
    years: (age) => `${age} ${age === 1 ? "ano" : "anos"}`,
    availabilityNote: "Valores sujeitos à disponibilidade e alterações.",
    messages: {
      lastDay: "Escolha uma entrada até 30 de outubro para ter uma saída dentro da campanha.",
      maxNights: "Selecione uma estadia de até 14 noites.",
      soldOutInRange: "Há uma data esgotada nesse intervalo. Escolha outro período.",
      pickDates: "Escolha uma data de entrada e uma data de saída no calendário.",
      adultsPerRoom: "Informe ao menos um adulto por quarto.",
      roomCapacity: "Cada quarto acomoda até quatro hóspedes nesta prévia.",
      engineMissing: "Prévia demonstrativa: o motor de reservas ainda não foi conectado.",
      popupBlocked: "O navegador bloqueou a nova aba. Libere pop-ups e tente de novo.",
    },
  },
};
