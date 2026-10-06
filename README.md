# Black Friday Vivaz Cataratas 2026

Landing page da campanha, em Next.js (App Router) + TypeScript, publicada em
`promo.vivazcataratas.com.br/black-friday`. O layout é o HTML/CSS entregue pelo designer,
portado para componentes React; o CSS dele foi mantido como está.

## Rotas

| Endereço | Conteúdo |
| --- | --- |
| `/black-friday` | Página principal: pré-venda (cadastro) ou vendas abertas, conforme o painel |
| `/black-friday/es` | Página principal em espanhol |
| `/black-friday/vendas-abertas` | Página de vendas com o calendário (sempre disponível, fora dos buscadores) |
| `/black-friday/es/vendas-abertas` | Vendas em espanhol |
| `/black-friday/admin` | Painel para trocar a página principal |

O prefixo `/black-friday` vem do `basePath` em `next.config.ts`.

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # defina ao menos ADMIN_PASSWORD
npm run dev
```

Abra `http://localhost:3000/black-friday`. Sem a planilha configurada, os cadastros e a escolha
do painel ficam em arquivos na pasta `.data/` (ignorada pelo git).

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `ADMIN_PASSWORD` | Senha do painel (mínimo de 8 caracteres) |
| `SHEETS_WEBHOOK_URL` | URL do app da Web do Apps Script (termina em `/exec`) |
| `SHEETS_WEBHOOK_SECRET` | Segredo compartilhado com o Apps Script |

## Google Sheets

A planilha recebe os cadastros (aba `Cadastros`) e guarda a página que está no ar (aba `Config`).
As abas são criadas sozinhas no primeiro uso.

1. Crie a planilha e abra **Extensões > Apps Script**.
2. Cole o conteúdo de `google-apps-script/Code.gs`.
3. Em **Configurações do projeto > Propriedades do script**, crie `SECRET` com um valor longo e
   aleatório. Use o mesmo valor em `SHEETS_WEBHOOK_SECRET`.
4. **Implantar > Nova implantação > App da Web**: executar como **Eu**, acesso **Qualquer pessoa**.
5. Copie a URL terminada em `/exec` para `SHEETS_WEBHOOK_URL`.

Ao alterar o script, publique uma nova versão em **Implantar > Gerenciar implantações**.

Se a planilha não responder, a página principal decide pela data: pré-venda antes de
23/11/2026 e vendas abertas depois.

## Abertura das vendas

Entre em `/black-friday/admin`, escolha **Vendas abertas** e salve. A página principal (em
português e espanhol) passa a mostrar o calendário na hora. Para voltar, escolha **Pré-venda**.

## Estrutura

- `src/styles/styles.css` e `public/css/sales.css`: CSS do designer. O `sales.css` altera seções
  compartilhadas e por isso só é carregado na página de vendas.
- `src/styles/overrides.css`: os poucos ajustes exigidos pela migração.
- `src/content/pt.tsx` e `es.tsx`: todos os textos.
- `src/components/`: uma seção por componente, com as mesmas classes do HTML original.
- `src/lib/offers.ts`: descontos e datas esgotadas do calendário (**ainda demonstrativos**).
- `src/lib/sheets.ts`: leitura e gravação na planilha.
- `scripts/optimize-assets.mjs`: converte as imagens originais do designer para WebP.

## Pendências antes de publicar

- Conectar o calendário ao motor de reservas e aos descontos oficiais (`src/lib/offers.ts` e
  `handoffToBookingEngine` em `src/components/Booking.tsx`).
- Revisar a tradução em espanhol.
- Trocar o logo do topo (hoje é texto) e ligar Política de Privacidade e Termos.
- Link do canal VIP do WhatsApp citado no formulário.
