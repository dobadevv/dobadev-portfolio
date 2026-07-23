# Personal Portfolio Site — Design Spec

Date: 2026-07-23

## Summary

A single-page React (Vite + TypeScript) portfolio site for Nguyễn Duy Anh
("Doba"), replacing the current Vite starter scaffold. Mobile-first,
fully responsive, semantic HTML, WCAG AA contrast, keyboard-navigable.
Plain CSS only (CSS custom properties + CSS Modules) — no UI kit, no
Tailwind, no animation library.

## Goals / non-goals

- Goal: ship a static, content-accurate, accessible one-pager that can be
  deployed as-is and extended later (more project cards) without layout
  breakage.
- Goal: TDD'd structural/accessibility correctness (nav links, landmarks,
  external link safety, CV link) via Vitest + React Testing Library.
- Non-goal: CMS, backend, contact form, analytics, visual regression
  testing, animation library, component library.

## Stack

- Vite + React 19 + TypeScript (existing scaffold, kept).
- Plain CSS: one global stylesheet (`src/index.css`) for tokens/reset/
  typography/layout primitives, plus one CSS Module per component for
  component-specific styling.
- Fonts: Google Fonts **self-hosted** — woff2 files fetched from the
  Google Fonts CSS2 API and saved under `public/fonts/`, loaded via
  `@font-face` in `src/styles/fonts.css`. No runtime request to Google's
  CDN.
  - Space Grotesk 500/600/700 (headings)
  - IBM Plex Sans 400/500/600 (body)
  - IBM Plex Mono 400/500 (labels/metadata/stack tags/section numbers)
- Testing: Vitest + @testing-library/react + @testing-library/jest-dom +
  jsdom (dev dependencies only).
- No new runtime dependencies beyond react/react-dom.

## Theme tokens (`:root` in `src/index.css`)

```
--bg: #0d0d0b
--surface: #16150f
--text: #ece9e0        (primary text)
--text-bright: #f3f1ea (headings / emphasis)
--muted: #918c7f
--border: rgba(255,255,255,.08)
--accent: #d8a548
--accent-dim: rgba(216,165,72,.14)
```

- Links: default `--accent`, hover `--text`.
- `:focus-visible`: 2px `--accent` outline, defined once globally.
- Layout primitives: `--content-max: 1120px`; `--pad-x: clamp(20px,5vw,48px)`;
  `--pad-y: clamp(64px,9vw,116px)`. A `.container` class (max-width +
  centered + `--pad-x`) and a `.section` class (1px top border in
  `--border` + `--pad-y`) are composed into every section component via
  CSS Modules `composes`.
- Contrast check to perform during implementation: confirm `--muted` on
  `--bg`/`--surface` reaches ≥4.5:1 wherever used at body/label text
  sizes. If a specific usage falls short, keep the palette unchanged and
  fall back to `--text` for that usage rather than changing tokens
  globally.

## Component structure

```
src/
  main.tsx
  App.tsx
  index.css                 (tokens, reset, base typography, .container/.section)
  styles/fonts.css           (@font-face declarations)
  hooks/
    useScrollReveal.ts
  components/
    Header/Header.tsx + .module.css
    Hero/Hero.tsx + .module.css
    DomainExpertise/ (section 01) .tsx + .module.css + data.ts
    Projects/        (section 02) .tsx + .module.css + data.ts
    Stack/            (section 03) .tsx + .module.css + data.ts
    HowIWork/         (section 04) .tsx + .module.css
    Experience/       (section 05) .tsx + .module.css + data.ts
    Contact/          (section 06) .tsx + .module.css + data.ts
    Footer/Footer.tsx + .module.css
    shared/
      SectionHeading/ (mono kicker + zero-padded 01-06 number; used by 01-06)
      RevealOnScroll/ (wraps children; applies scroll-reveal via the hook)
```

Content-heavy sections keep their copy in a typed `data.ts` array so that
e.g. adding a project means appending one object, not editing markup.

`App.tsx` composes, in order: `Header`, `Hero`, `main` containing
sections 01–06 (`DomainExpertise`, `Projects`, `Stack`, `HowIWork`,
`Experience`, `Contact`), then `Footer`.

## Accessibility

- Semantic landmarks: `header` (contains `nav`), `main` (contains one
  `section` per numbered block plus hero content), `footer`. Cards are
  `article` elements. Each `section` has `aria-labelledby` pointing at
  its heading id.
- A visually-hidden "Skip to main content" link is the first focusable
  element on the page (appears on focus only).
- All external links (project repos/live links, LinkedIn, GitHub profile)
  get `target="_blank" rel="noopener noreferrer"`.
- Avatar images have descriptive `alt` text; purely decorative elements
  use `alt=""` / `aria-hidden`.
- `:focus-visible` gets a 2px `--accent` outline everywhere (one global
  rule, not per component).

## Motion (scroll-reveal)

- `useScrollReveal` hook: returns a ref + `isVisible` boolean, backed by
  `IntersectionObserver` (`threshold: 0.15`), fires once per element.
- `RevealOnScroll` wrapper toggles a CSS class based on `isVisible`.
- **Progressive enhancement is structural, not just a media query**: the
  default CSS state (no JS, or class never toggled) is fully visible
  (`opacity: 1`, no transform). The "hidden" pre-reveal state and the
  transition are only ever applied via the toggled class, so content is
  always visible without JS.
- `@media (prefers-reduced-motion: reduce)` disables the transition
  entirely (reveal is instant / no-op).
- Applied at section-content level for single-block sections (04 How I
  Work, 06 Contact) and per-card (with index-based stagger delay) for
  grid sections (01 Domain Expertise, 02 Projects, 03 Stack).
- No parallax, no gradient mesh, no blob shapes.

## Navigation & responsive behavior

- Sticky header with backdrop-blur (with a solid semi-transparent
  fallback background for browsers without `backdrop-filter` support).
- Nav: small rounded-square avatar (96px asset) + "Doba." wordmark on the
  left (`flex-shrink: 0`, stays pinned), 5 mono links right-aligned:
  domains (`#domains`), projects (`#projects`), stack (`#stack`),
  experience (`#experience`), contact (`#contact`). Note: section 04
  "How I Work" is numbered but has no nav link, per brief.
- Mobile: nav links row becomes horizontally scrollable
  (`overflow-x: auto`, scrollbar hidden via `scrollbar-width: none` /
  `::-webkit-scrollbar { display: none }`) rather than wrapping or
  collapsing into a hamburger menu. No JS-driven menu state.
- Card grids: `grid-template-columns: repeat(auto-fit, minmax(Npx, 1fr))`
  per section (248px domain cards, 320px project cards, 230px stack
  groups) — no explicit breakpoints for grid reflow.
- Fluid type via `clamp()` throughout; media queries avoided wherever
  fluid sizing/grid auto-fit already solves the problem.

## Assets

- Avatar: `public/assets/avatar-96.png` (nav, 1x), `avatar-320.png` /
  `avatar-640.png` (hero, via `srcset` for retina at ~188px display).
  Rounded-square shape consistent in both places; hero avatar gets a thin
  accent border + accent-dim ring.
- Favicon: `public/assets/favicon.png` (already present) — reference from
  `index.html`, replacing the current placeholder `favicon.svg` link.
- CV: `public/assets/Nguyen-Duy-Anh-CV.pdf` (already present) — linked
  from the hero's "↓ Download CV" button with `download` attribute.

All three asset types already exist in `public/assets/`; no new binary
assets need to be sourced, only the Google Fonts woff2 files.

## Section-by-section content

### Header / nav
Small rounded-square avatar + "Doba." wordmark, left. Right-aligned mono
links: domains, projects, stack, experience, contact. Backdrop-blur,
sticky.

### Hero
Flex-wrap layout: avatar first (stacks above text on mobile, sits left on
desktop), `clamp(130px,20vw,188px)`, rounded-square, thin accent border +
accent-dim ring.

- Mono eyebrow: "Software Engineer · Backend / Fullstack · Ho Chi Minh
  City"
- Headline: "I build the systems behind commerce — multi-tenant
  platforms, distribution pipelines, and message infrastructure." (accent
  color on the second half, from "multi-tenant platforms" onward)
- Subline: "Nguyễn Duy Anh ("Doba") — ~4 years owning end-to-end backend
  architecture for multi-tenant SaaS. I care about correctness under
  concurrency and systems that are boring to operate."
- Pill badge: "● Open to remote & international roles"
- One button: "↓ Download CV" (accent fill, links to CV PDF, `download`
  attribute)

### 01 — Domain expertise
4 cards, grid `minmax(248px,1fr)`. Each: mono code (`D-01`…`D-04`),
title, one-line hard-problem framing, one-line what-I-shipped.

1. **D-01 E-commerce & POS**
2. **D-02 Distribution (DMS)**
3. **D-03 Agriculture SaaS** — race condition solved with row-level
   locking
4. **D-04 Game / Engagement** — SaaS mini-game platform (Lucky Wheel,
   Card Flip) for restaurant giveaway campaigns; NestJS, PostgreSQL,
   RabbitMQ, Redis, WebSocket

(Exact one-line copy for hard-problem/shipped framing on D-01–D-03 to be
drafted during implementation, consistent with the tone of D-04 and the
domain descriptions above — brief gives the topic, not verbatim copy for
all four.)

### 02 — My projects
Grid `minmax(320px,1fr)`, extensible without breaking layout. Each card:
title + link, mono subtitle, short paragraph, mono stack tags. Trailing
dashed placeholder card: "more projects in progress".

1. **goq** — https://github.com/dobadevv/goq
   "A RabbitMQ-style TCP message broker built to understand brokers
   end-to-end. Observer-pattern fan-out, SQLite persistence, and a
   length-prefixed JSON wire protocol — shipped with an importable client
   library and an installable CLI."
   Tags: Go, TCP, SQLite, Observer pattern.

2. **Marsvenus Connection** — https://connection.dev.marsvenus.com.vn/en/login
   Subtitle: "Anonymous dating & connection platform"
   "A platform where people post invitations and apply to others to
   connect and date anonymously. Go backend on chi + sqlc + pgx/v5 with
   goose migrations, and MinIO object storage using a dual-endpoint
   presigned-URL pattern for secure, correct media delivery across
   environments."
   Tags: Go, chi, sqlc, pgx/v5, goose, Next.js, MinIO.
   (No mention of an admin panel.)

3. Dashed placeholder card: "more projects in progress" (non-interactive,
   no link).

### 03 — Stack
Grouped cards, grid `minmax(230px,1fr)`. Each group = mono label + tag
chips:
- **Languages**: Node.js/TypeScript, Go, Rust
- **Backend**: NestJS, Express.js, REST, GraphQL, chi, gin
- **Data**: PostgreSQL, MongoDB, Redis
- **Messaging & async**: Kafka, RabbitMQ, BullMQ
- **Infra & DevOps**: Docker, Nginx, Kubernetes, CI/CD, Jenkins, GitLab
  CI, GitHub Actions, AWS
- **Frontend (secondary)**: Next.js, React, Tailwind

### 04 — How I work
Single statement, `clamp(17px,2.1vw,23px)`:
"I care about correctness under concurrency, clear boundaries between
services, and systems that are boring to operate — the kind you don't
get paged about at 3am."
(Numbered/kickered like other sections; no nav link.)

### 05 — Experience
Compact timeline, `180px | 1fr` grid rows (stacks on mobile). Date +
company · role + one line, most recent first:

1. **Finviet** — Sep 2024–Present (mark **CURRENT**): ECOPOS
   multi-tenant POS/e-commerce/DMS from scratch, Clean Architecture,
   NestJS, Kafka, RabbitMQ, BullMQ, PostgreSQL, Redis, Elasticsearch.
2. **GreenAgri** — Jul 2023–Aug 2024
3. **TAS Vietnam** — Mar–Jul 2023
4. **EPlus Technology** — Nov 2022–Mar 2023
5. **STECH** — Jan–Jun 2022

(One-line role/description for entries 2–5 to be drafted during
implementation from the domain-expertise context above — brief specifies
dates/companies but not verbatim one-liners for these four.)

### 06 — Contact
Heading: "Let's build something that stays boring to run."
Line: "Based in Ho Chi Minh City · open to remote & international
roles."
4-column card grid (collapses gracefully on mobile):
- Email: duyanh.it.work@gmail.com
- GitHub: github.com/dobadevv
- LinkedIn: in/duyanhitbe
- Phone: +84 944 609 933

### Footer
Mono: "© 2026 Nguyễn Duy Anh (Doba)" and "Built with structure over
decoration."

## Testing plan (TDD, Vitest + RTL)

Written before each component, one test file per section:

- Each section renders its heading text and correct `01`–`06` number
  (via `SectionHeading`).
- Nav renders exactly 5 links, each pointing to the correct section id
  (`#domains`, `#projects`, `#stack`, `#experience`, `#contact`).
- External links (project links, LinkedIn, GitHub profile) have
  `target="_blank"` and `rel="noopener noreferrer"`.
- CV button has the correct `href` into `/assets/...pdf` and a `download`
  attribute.
- Projects section renders one card per `data.ts` entry plus the
  trailing dashed placeholder (non-card, no link).
- Avatar images have non-empty, descriptive `alt` text; decorative
  elements are `alt=""` / `aria-hidden`.

No visual regression testing. Visual/contrast/keyboard verification is
done manually in a real browser (via the project's `run`/`verify`
tooling) before considering implementation complete.

## Open items resolved during implementation

- Exact one-line "hard problem" / "what I shipped" copy for domain cards
  D-01–D-03, and one-line role descriptions for Experience entries 2–5,
  will be drafted to match the tone of the brief's existing copy (D-04,
  Finviet) — not invented facts, just consistent phrasing of the
  domains/dates already specified.
- Precise contrast pass for `--muted` at each font-size it's used.
