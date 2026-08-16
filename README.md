# mesquita-jp-site

Site do **Centro Islâmico de João Pessoa** (PB) — mesquita, horários de oração,
agenda de aulas, documentos e atividades da comunidade. Português do Brasil,
estático, sem backend.

## Stack

Astro 6 · TypeScript strict · CSS puro (sem framework de UI) · deploy estático.

## Comandos

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # gera ./dist/
npm run preview   # serve o build local
npm run astro check
```

## Onde mexer

| O quê | Arquivo |
|---|---|
| Nome, endereço, telefone, redes, PIX | `src/config.ts` |
| Horário de abertura da mesquita | `openingHours` em `src/config.ts` |
| Envio de livros / estados atendidos | `books` em `src/config.ts` |
| Assuntos do formulário | `requestForm` em `src/config.ts` |
| Documentos para baixar | `documents` em `src/config.ts` + arquivos em `public/docs/` |
| Fotos da galeria | `gallery` em `src/config.ts` + arquivos em `public/galeria/` |
| Faixa de aviso no topo | `announcement` em `src/config.ts` |
| Cores, fontes, espaçamentos | `:root` em `src/layouts/BaseLayout.astro` |
| Logo (menu, hero e rodapé) | `src/components/Logo.astro` → `public/logo.png` |
| Horários de oração / jumu'ah | `src/components/PrayerTimes.astro` + `src/config.ts` |
| Conteúdo da home | `src/pages/index.astro` |

## Imagens da marca

Todas em `public/`, geradas a partir do emblema oficial do centro:

| Arquivo | Uso |
|---|---|
| `logo.png` | Emblema sem texto — menu, hero, rodapé, galeria |
| `icon-64.png` / `icon-256.png` | Favicon e ícone de app |
| `og-image.png` | Prévia em WhatsApp, Facebook e Twitter |
| `emblema-completo.webp` | Emblema com o nome escrito ao redor (impressos, redes) |

## Contato

Enquanto `contact.whatsapp` estiver vazio, **todos** os botões de contato do site
apontam para o Instagram — é o canal confirmado, e é onde a comunidade responde.
Isso está centralizado em `canalPrincipal` (`src/config.ts`): preencher o número
do WhatsApp lá em cima faz o site inteiro passar a apontar para ele, sem tocar em
componente nenhum.

## Formulário de pedidos

O formulário da seção **Livros e pedidos** usa **Netlify Forms** — funciona porque o
site é publicado na Netlify e o formulário existe no HTML estático. Depois do
primeiro deploy, as respostas aparecem em *Netlify → Forms → `pedidos`*; vale
configurar ali a notificação por e-mail, senão ninguém fica sabendo dos pedidos.
O plano gratuito aceita 100 envios por mês.

Um mesmo formulário atende três assuntos (livros, visita, outro) e troca os campos
conforme a escolha — só com CSS, sem JavaScript.

## Pendências

- [ ] Confirmar com a administração o endereço (hoje vem da ficha do Google:
      Av. Santa Catarina, 191 — Estados, CEP 58030-070)
- [ ] Telefone/WhatsApp e e-mail (`contact.phone`, `contact.whatsapp`, `contact.email`)
- [ ] Horário exato da khutbah dentro da janela de sexta (`openingHours.khutbahTime`)
- [ ] Ativar a notificação de e-mail do formulário no painel da Netlify
- [ ] PDFs em `public/docs/` e `file` preenchido em `documents`
- [ ] Fotos da mesquita em `public/galeria/` e listadas em `gallery`
- [ ] Chave PIX para doações
- [ ] `og-image.png` numa versão 1200×630 (hoje é o emblema quadrado)
- [ ] Domínio definitivo em `astro.config.mjs` e `netlify.toml`
