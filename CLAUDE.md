# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Project

Static site for a mosque / Islamic centre in **João Pessoa, Paraíba, Brazil**. All
user-facing copy is Brazilian Portuguese (`pt-BR`), with short Qur'anic and liturgical
phrases in Arabic. Built with **Astro 6**, TypeScript strict, no UI framework, plain CSS.
Node `>= 22.12.0`.

The site is in **template stage**: the real address, phone and prayer/iqamah times have
not been supplied yet. Everything provisional is marked `TODO` in `src/config.ts` — do
not present placeholder values as confirmed facts. The logo *has* arrived (see below).

## Commands

- `npm run dev` — dev server at `localhost:4321`
- `npm run build` — static build to `./dist/`
- `npm run preview` — serve the build
- `npm run astro check` — type-check (no test runner configured)

## Architecture

**All content lives in `src/config.ts`.** Pages and components only read from it — name,
address, contacts, `openingHours`, activities, `books`, `requestForm`, `documents`,
`gallery`, `announcement`, donation info, coordinates and iqamah. Changing copy or data
should not require touching a layout.

**`BaseLayout.astro` owns the design tokens.** The whole palette is CSS custom properties
in one `:root` block, and every value is sampled from the emblem itself:

| Token | Hex | Where it comes from / use |
|---|---|---|
| `--verde` | `#044504` | The emblem's disc (`#004400`) — primary: buttons, headings |
| `--verde-medio` / `--verde-claro` | `#175517` / `#23701F` | Emblem's outer ring; gradients and hover |
| `--verde-escuro` | `#002B00` | Footer, announcement bar |
| `--dourado` | `#C69D13` | The gold of the Qur'an in the emblem — fills, borders, rings |
| `--dourado-claro` | `#E9C64B` | Gold **text on dark** (footer, hero) |
| `--dourado-escuro` | `#8A6B08` | Gold **text on light** — the only gold that passes AA on `--areia` |
| `--prata` / `--prata-claro` | `#B3B3B3` / `#E7E7E7` | The silver monument; subtle dividers |
| `--areia` / `--areia-escura` | `#FAF8F1` / `#F0ECDF` | Page and section backgrounds |
| `--texto` / `--texto-suave` | `#1A2118` / `#5C665A` | Text |

The gold split matters: `--dourado` on a sand background is only ~2.4:1, so any gold
**text** on light must use `--dourado-escuro`. Don't "fix" a low-contrast eyebrow by
lightening the background.

Sections alternate `--branco` → `--areia` → `--areia-escura` so neighbours never share a
background; check the run of sections in `index.astro` before inserting a new one.

**Fonts** come from Google Fonts: *Plus Jakarta Sans* (Latin) and *Amiri* (Arabic). Any
Arabic snippet must carry `class="ar"`, which sets the Amiri family plus `direction: rtl`
and `unicode-bidi: isolate` — without it the mixed-direction line renders wrong.

**Prayer times are fetched client-side** in `PrayerTimes.astro` from the public Aladhan
API (`api.aladhan.com`), not at build time — a static build would freeze the times on the
deploy date. Notes on that script:

- The day, the "next prayer" countdown and the highlight are all computed in the mosque's
  timezone (`America/Fortaleza`) via `Intl.DateTimeFormat`, not in the visitor's — a
  visitor abroad must see the time until the adhan *in João Pessoa*.
- One day's response is cached in `localStorage` under `pt_<dd-mm-yyyy>_<method>`.
- If the fetch fails the markup keeps its `--:--` placeholders and `#pt-error` is shown;
  never let a failure blank the section.
- **Adhan ≠ iqamah.** The API gives the astronomical adhan time; iqamah is the mosque's
  own decision and comes from `iqamah` in `src/config.ts` (`null` = not announced yet).

**Logo indirection:** `src/components/Logo.astro` renders `public/logo.png` (the emblem
without the surrounding text, which is the version that stays legible at 40px). Header,
hero, footer and the empty gallery all go through this component — it is the only place
that names the file. `tone="branco"` is for placing it on the dark green: the disc is
nearly the same colour as the background, so that variant adds a thin gold ring to
separate it. `public/emblema-completo.webp` is the version *with* the name written around
the ring — for print and social, not for the UI.

**One contact channel, decided in config.** Every "fale com a gente" button reads
`canalPrincipal` from `src/config.ts`, never `contact.whatsapp` directly. While the
WhatsApp number is unconfirmed (`whatsapp: ''`) it resolves to the centre's Instagram
(`@centro.islamico.jp`) — the channel the community actually answers on. Filling in the
number switches the whole site over; adding a new CTA means reading `canalPrincipal.href`
/ `.nome` / `.acao` / `.icon`, not hardcoding a channel.

Unconfirmed contact details are empty strings, not example values — a published fake
phone number is worse than none, and each block (`contact.phone`, `email`, `address.street`)
is rendered conditionally so an empty value degrades instead of printing a placeholder.

**The mosque is not open at prayer time.** It opens Friday and Saturday, 11h30–13h00,
and that is all (`openingHours` in `src/config.ts`). The prayer times the site shows are
the calculated adhan *for the city of João Pessoa* — a convenience for whoever is reading,
not a schedule of when the doors are unlocked. Never write copy that implies the mosque is
open for the five daily prayers; the opening-hours block is deliberately rendered above the
prayer grid, and a disclaimer sits below it.

There are **no classes** at the moment. An earlier version of this repo listed Arabic and
Qur'an lessons with invented times — they were removed. Do not reintroduce any activity,
class or service into `activities` until the administration confirms it exists.

**The request form** (`Formulario.astro`, section `#pedidos`) is one form serving three
subjects — books, visit, other — and its fields swap with **CSS only**: three radios sit as
direct children of `<form>`, and each conditional block is matched by
`#tipo-x:checked ~ .campos .so-x`. Two traps, both already hit once:

- the show/hide rules must come *after* `.campo { display: flex }` and use two classes
  (`.campos .so-x`), or `.campo` wins on source order and every field stays visible;
- no conditional field may be `required` — browsers refuse to submit a form with a hidden
  required control, and the failure is silent to the user.

Form ids are prefixed `f-` because the page's section anchors already own the plain names
(`#contato` was both a section and an input before the prefix).

Submission goes to **Netlify Forms** (the site deploys to Netlify): `data-netlify="true"`,
a matching hidden `form-name`, a `bot-field` honeypot, and `action="/obrigado"`. Changing
host means replacing that mechanism.

**Empty states are content, not bugs.** `documents` entries with `file: null`, an empty
`gallery` and an agenda with nothing upcoming each render a deliberate "em breve" notice
with a way to ask by WhatsApp. Never fill these with stock photos or invented documents —
the honest placeholder is the correct output until the administration supplies the real
thing.

Anything toggled with the `hidden` attribute needs the global `[hidden] { display: none
!important }` rule in `BaseLayout.astro`, because these components set `display: flex` in
a class, which otherwise wins over the browser default.

**Icons** are inline SVG paths in `src/components/Icon.astro` (lucide style, 24×24,
stroke 1.75). No icon library; add new icons to the `paths` map.

**Mobile nav is CSS-only** — a hidden checkbox (`#nav-toggle`) plus a sibling selector in
`Header.astro`. There is no JavaScript in the header; keep it that way if possible.

## Conventions

- Portuguese (pt-BR) for all copy. Keep it that way.
- Religious content must be accurate and sober. Do not invent hadith, Qur'anic verses,
  translations, prayer times, or facts about the community; ask instead.
- Qur'an quotations carry surah:ayah (e.g. `Alcorão 9:18`).
- Section ids are Portuguese and referenced by the header links: `#horarios`, `#sobre`,
  `#atividades`, `#pedidos`, `#documentos`, `#galeria`, `#localizacao`, `#doacoes`,
  `#contato`. Adding a section means adding it to `Header.astro` and `Footer.astro` too.
- Dates that decide what a visitor sees (an event that has passed, today's prayer times)
  are compared in `America/Fortaleza` **in the browser**, never at build time — a static
  build would freeze that judgement on the deploy date.
- Component styles stay in the component's own `<style>` block; only shared tokens,
  reset and utility classes (`.container`, `.section`, `.btn`, `.eyebrow`, `.ar`) live in
  `BaseLayout.astro`.
