# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the single-page React portfolio site described in
`docs/superpowers/specs/2026-07-23-portfolio-site-design.md`, replacing the
current Vite starter scaffold.

**Architecture:** Vite + React 19 + TypeScript. One component folder per
section under `src/components/`, each with its own CSS Module; a small set
of global tokens/reset/layout primitives in `src/index.css`; self-hosted
Google Fonts; a reusable `useScrollReveal` hook + `RevealOnScroll` wrapper
for motion; Vitest + React Testing Library for structural/a11y smoke tests,
TDD'd task by task.

**Tech Stack:** Vite, React 19, TypeScript, plain CSS (CSS Modules + one
global stylesheet), Vitest, @testing-library/react, @testing-library/jest-dom,
jsdom. Package manager: pnpm (existing `pnpm-lock.yaml`).

## Global Constraints

- No new runtime dependencies beyond `react`/`react-dom` — no UI kit, no
  Tailwind, no animation library (spec: Stack section).
- Mobile-first, fully responsive, semantic HTML, WCAG AA contrast,
  keyboard-navigable (spec: Summary).
- Fonts self-hosted as `@font-face` from `public/fonts/*.woff2` — no
  runtime request to Google's CDN (spec: Stack).
- Theme tokens are exact values from the spec — do not adjust:
  `--bg:#0d0d0b`, `--surface:#16150f`, `--text:#ece9e0`,
  `--text-bright:#f3f1ea`, `--muted:#918c7f`, `--border:rgba(255,255,255,.08)`,
  `--accent:#d8a548`, `--accent-dim:rgba(216,165,72,.14)` (spec: Theme
  tokens). Contrast has already been verified: muted-on-bg is 5.80:1,
  muted-on-surface 5.45:1, text-on-bg 16.02:1, accent-on-bg 8.70:1 — all
  pass WCAG AA (≥4.5:1) with no fallback needed.
- Layout primitives are exact: `--content-max: 1120px`,
  `--pad-x: clamp(20px,5vw,48px)`, `--pad-y: clamp(64px,9vw,116px)` (spec:
  Theme tokens).
- `:focus-visible` gets a 2px `--accent` outline globally, defined once in
  `src/index.css`, not per component (spec: Accessibility).
- All external links (project repos/live links, GitHub profile, LinkedIn)
  get `target="_blank" rel="noopener noreferrer"` (spec: Accessibility).
- Scroll-reveal must be visible with JS disabled — the "hidden" state and
  transition are only ever applied via a toggled class, never the default
  state — and must respect `prefers-reduced-motion: reduce` (spec:
  Motion).
- Mobile nav overflows horizontally (`overflow-x: auto`, hidden
  scrollbar) — no hamburger menu, no JS-driven menu state (spec:
  Navigation & responsive behavior).
- Card grids use `grid-template-columns: repeat(auto-fit, minmax(Npx,1fr))`
  per section (248px domain cards, 320px project cards, 230px stack
  groups); avoid media queries wherever fluid sizing/auto-fit already
  solves the problem (spec: Navigation & responsive behavior).
- Every commit message follows the Angular Commit Message Convention
  (type(scope): summary, imperative, no period, no Claude/Anthropic
  co-author line).

---

## Task 1: Test tooling, project setup, and template cleanup

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/setupTests.ts`
- Create: `src/App.smoke.test.tsx`
- Delete: `src/App.css`, `src/assets/hero.png`, `src/assets/react.svg`,
  `src/assets/vite.svg`, `public/icons.svg`, `public/favicon.svg`

**Interfaces:**
- Produces: a working `pnpm test` (single run) and `pnpm test:watch`
  command, a jsdom Vitest environment with `@testing-library/jest-dom`
  matchers globally available to every later test file via
  `src/setupTests.ts`.

- [ ] **Step 1: Install test dependencies**

Run:
```bash
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom
```
Expected: `package.json` devDependencies gains `vitest`, `jsdom`,
`@testing-library/react`, `@testing-library/jest-dom`; `pnpm-lock.yaml`
updates.

- [ ] **Step 2: Add test scripts to `package.json`**

Modify the `scripts` block in `package.json` to:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Wire Vitest into `vite.config.ts`**

Replace the contents of `vite.config.ts` with:
```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
})
```

- [ ] **Step 4: Create the test setup file**

Create `src/setupTests.ts`:
```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 5: Write a failing smoke test against the current template**

Create `src/App.smoke.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App (tooling smoke test)', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

This asserts against the *current* starter template (which renders a
"Count is 0" button), purely to prove the Vitest + RTL + jsdom pipeline
works end to end before anything else is built.

- [ ] **Step 6: Run the test and confirm it passes against the template**

Run: `pnpm test`
Expected: 1 test file, 1 test, PASS. This proves tooling works; the test
itself will be deleted once real components replace the template in
later tasks.

- [ ] **Step 7: Delete unused template assets**

Run:
```bash
rm src/App.css src/assets/hero.png src/assets/react.svg src/assets/vite.svg public/icons.svg public/favicon.svg
rmdir src/assets 2>/dev/null || true
```
Expected: files removed; `src/assets/` directory removed if now empty (it
will be re-created later only if needed — it is not needed, since all
image assets live in `public/assets/`).

- [ ] **Step 8: Delete the tooling smoke test (its job is done)**

Run: `rm src/App.smoke.test.tsx`

Note: `src/App.tsx` still imports the now-deleted `App.css` and assets at
this point, so `pnpm test` / `pnpm dev` will fail until Task 16 rewrites
`App.tsx`. This is expected and resolved by the end of this plan — every
task from here builds a component in isolation (each with its own test),
and Task 16 is what wires `App.tsx` back together into a working app.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
build: add Vitest + Testing Library and remove starter template assets

Sets up the TDD loop the rest of the portfolio build relies on, and
clears out the Vite/React demo content this project doesn't need.
EOF
)"
```

---

## Task 2: Self-hosted Google Fonts

**Files:**
- Create: `public/fonts/space-grotesk-500-latin.woff2`,
  `public/fonts/space-grotesk-500-vietnamese.woff2`,
  `public/fonts/space-grotesk-600-latin.woff2`,
  `public/fonts/space-grotesk-600-vietnamese.woff2`,
  `public/fonts/space-grotesk-700-latin.woff2`,
  `public/fonts/space-grotesk-700-vietnamese.woff2`,
  `public/fonts/ibm-plex-sans-400-latin.woff2`,
  `public/fonts/ibm-plex-sans-400-vietnamese.woff2`,
  `public/fonts/ibm-plex-sans-500-latin.woff2`,
  `public/fonts/ibm-plex-sans-500-vietnamese.woff2`,
  `public/fonts/ibm-plex-sans-600-latin.woff2`,
  `public/fonts/ibm-plex-sans-600-vietnamese.woff2`,
  `public/fonts/ibm-plex-mono-400-latin.woff2`,
  `public/fonts/ibm-plex-mono-400-vietnamese.woff2`,
  `public/fonts/ibm-plex-mono-500-latin.woff2`,
  `public/fonts/ibm-plex-mono-500-vietnamese.woff2`
- Create: `src/styles/fonts.css`

**Interfaces:**
- Produces: three CSS custom properties consumed by Task 3:
  `--font-heading` ("Space Grotesk"), `--font-body` ("IBM Plex Sans"),
  `--font-mono` ("IBM Plex Mono").

- [ ] **Step 1: Download the font files**

These exact URLs were verified live against Google Fonts' CSS2 API
(vietnamese + latin subsets only — sufficient for the site's English copy
plus Vietnamese diacritics in "Nguyễn Duy Anh"). Run:

```bash
mkdir -p public/fonts
cd public/fonts

# Space Grotesk 500
curl -sL -o space-grotesk-500-vietnamese.woff2 "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7aUXsrPMBTTA.woff2"
curl -sL -o space-grotesk-500-latin.woff2 "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj7aUXskPMA.woff2"
# Space Grotesk 600
curl -sL -o space-grotesk-600-vietnamese.woff2 "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj42VnsrPMBTTA.woff2"
curl -sL -o space-grotesk-600-latin.woff2 "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj42VnskPMA.woff2"
# Space Grotesk 700
curl -sL -o space-grotesk-700-vietnamese.woff2 "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj4PVnsrPMBTTA.woff2"
curl -sL -o space-grotesk-700-latin.woff2 "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj4PVnskPMA.woff2"

# IBM Plex Sans 400
curl -sL -o ibm-plex-sans-400-vietnamese.woff2 "https://fonts.gstatic.com/s/ibmplexsans/v23/zYXGKVElMYYaJe8bpLHnCwDKr932-G7dytD-Dmu1swZSAXcomDVmadSD6llDCKg4poY.woff2"
curl -sL -o ibm-plex-sans-400-latin.woff2 "https://fonts.gstatic.com/s/ibmplexsans/v23/zYXGKVElMYYaJe8bpLHnCwDKr932-G7dytD-Dmu1swZSAXcomDVmadSD6llDB6g4.woff2"
# IBM Plex Sans 500
curl -sL -o ibm-plex-sans-500-vietnamese.woff2 "https://fonts.gstatic.com/s/ibmplexsans/v23/zYXGKVElMYYaJe8bpLHnCwDKr932-G7dytD-Dmu1swZSAXcomDVmadSD2FlDCKg4poY.woff2"
curl -sL -o ibm-plex-sans-500-latin.woff2 "https://fonts.gstatic.com/s/ibmplexsans/v23/zYXGKVElMYYaJe8bpLHnCwDKr932-G7dytD-Dmu1swZSAXcomDVmadSD2FlDB6g4.woff2"
# IBM Plex Sans 600
curl -sL -o ibm-plex-sans-600-vietnamese.woff2 "https://fonts.gstatic.com/s/ibmplexsans/v23/zYXGKVElMYYaJe8bpLHnCwDKr932-G7dytD-Dmu1swZSAXcomDVmadSDNF5DCKg4poY.woff2"
curl -sL -o ibm-plex-sans-600-latin.woff2 "https://fonts.gstatic.com/s/ibmplexsans/v23/zYXGKVElMYYaJe8bpLHnCwDKr932-G7dytD-Dmu1swZSAXcomDVmadSDNF5DB6g4.woff2"

# IBM Plex Mono 400
curl -sL -o ibm-plex-mono-400-vietnamese.woff2 "https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1iAq129k.woff2"
curl -sL -o ibm-plex-mono-400-latin.woff2 "https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1i8q1w.woff2"
# IBM Plex Mono 500
curl -sL -o ibm-plex-mono-500-vietnamese.woff2 "https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJwl9FgtIU.woff2"
curl -sL -o ibm-plex-mono-500-latin.woff2 "https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJwlBFgg.woff2"

cd ../..
ls -la public/fonts | wc -l
```
Expected: 16 `.woff2` files in `public/fonts/` (18 lines counting `.`/`..`
in `ls -la`).

- [ ] **Step 2: Write the `@font-face` declarations**

Create `src/styles/fonts.css`:
```css
/* Space Grotesk — headings */
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/space-grotesk-500-vietnamese.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/space-grotesk-500-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2191, U+2193, U+2212, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/space-grotesk-600-vietnamese.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/space-grotesk-600-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2191, U+2193, U+2212, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/space-grotesk-700-vietnamese.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/space-grotesk-700-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2191, U+2193, U+2212, U+FEFF, U+FFFD;
}

/* IBM Plex Sans — body */
@font-face {
  font-family: 'IBM Plex Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/ibm-plex-sans-400-vietnamese.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'IBM Plex Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/ibm-plex-sans-400-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2191, U+2193, U+2212, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'IBM Plex Sans';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/ibm-plex-sans-500-vietnamese.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'IBM Plex Sans';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/ibm-plex-sans-500-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2191, U+2193, U+2212, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'IBM Plex Sans';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/ibm-plex-sans-600-vietnamese.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'IBM Plex Sans';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/ibm-plex-sans-600-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2191, U+2193, U+2212, U+FEFF, U+FFFD;
}

/* IBM Plex Mono — labels, metadata, stack tags, section numbers */
@font-face {
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/ibm-plex-mono-400-vietnamese.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/ibm-plex-mono-400-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2191, U+2193, U+2212, U+FEFF, U+FFFD;
}
@font-face {
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/ibm-plex-mono-500-vietnamese.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/ibm-plex-mono-500-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2122, U+2191, U+2193, U+2212, U+FEFF, U+FFFD;
}
```

- [ ] **Step 3: Commit**

```bash
git add public/fonts src/styles/fonts.css
git commit -m "$(cat <<'EOF'
feat(fonts): self-host Space Grotesk, IBM Plex Sans, and IBM Plex Mono

Downloads the exact weights the design needs as static woff2 files so
the site never makes a runtime request to Google's font CDN.
EOF
)"
```

There is no automated test for this task — it produces static assets and
a CSS file with no logic branch to assert on. Visual confirmation happens
when Task 3 applies these fonts and Task 17 does the manual browser pass.

---

## Task 3: Global theme stylesheet (tokens, reset, layout primitives)

**Files:**
- Modify: `src/index.css` (full rewrite)

**Interfaces:**
- Produces (global CSS classes/vars consumed by every later component):
  - CSS custom properties: `--bg`, `--surface`, `--text`, `--text-bright`,
    `--muted`, `--border`, `--accent`, `--accent-dim`, `--content-max`,
    `--pad-x`, `--pad-y`, `--font-heading`, `--font-body`, `--font-mono`.
  - Global classes (referenced by plain string, not `styles.x`, from
    component `.module.css`/`.tsx` files): `.container`, `.section`,
    `.visually-hidden`, `.skip-link`.

There is no component to unit-test here (no logic branch); this task is
verified visually in Task 17 and by every later component test still
passing (nothing in this file changes component markup/behavior).

- [ ] **Step 1: Replace `src/index.css`**

```css
@import './styles/fonts.css';

:root {
  color-scheme: dark;

  --bg: #0d0d0b;
  --surface: #16150f;
  --text: #ece9e0;
  --text-bright: #f3f1ea;
  --muted: #918c7f;
  --border: rgba(255, 255, 255, 0.08);
  --accent: #d8a548;
  --accent-dim: rgba(216, 165, 72, 0.14);

  --content-max: 1120px;
  --pad-x: clamp(20px, 5vw, 48px);
  --pad-y: clamp(64px, 9vw, 116px);

  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'IBM Plex Sans', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1,
h2,
h3 {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--text-bright);
  margin: 0;
  line-height: 1.15;
}

p {
  margin: 0;
}

ul,
ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  color: var(--text);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 100;
  padding: 12px 20px;
  background: var(--accent);
  color: var(--bg);
  font-family: var(--font-mono);
  text-transform: uppercase;
  font-size: 14px;
  transition: top 0.15s ease;
}

.skip-link:focus {
  top: 0;
}

.container {
  max-width: var(--content-max);
  margin: 0 auto;
  padding-left: var(--pad-x);
  padding-right: var(--pad-x);
}

.section {
  border-top: 1px solid var(--border);
  padding-top: var(--pad-y);
  padding-bottom: var(--pad-y);
}
```

- [ ] **Step 2: Run the existing test suite to confirm nothing broke**

Run: `pnpm test`
Expected: no test files currently reference `index.css` directly, so this
should report "No test files found" or pass trivially (Task 1's smoke
test was deleted in Task 1 Step 8). This step exists to catch any
accidental syntax error surfaced through a later import chain — safe to
proceed once the command exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "$(cat <<'EOF'
feat(theme): add global tokens, reset, and layout primitives

Establishes the dark theme's CSS custom properties and the .container /
.section primitives every section component composes into its layout.
EOF
)"
```

---

## Task 4: `useScrollReveal` hook

**Files:**
- Create: `src/hooks/useScrollReveal.ts`
- Test: `src/hooks/useScrollReveal.test.tsx`

**Interfaces:**
- Produces: `useScrollReveal<T extends HTMLElement>(): { ref: RefObject<T | null>; isVisible: boolean }`,
  consumed by `RevealOnScroll` in Task 5.

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useScrollReveal.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useScrollReveal } from './useScrollReveal'

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IntersectionObserverCallback
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }
}

function TestComponent() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()
  return <div ref={ref}>{isVisible ? 'visible' : 'hidden'}</div>
}

beforeEach(() => {
  MockIntersectionObserver.instances = []
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('useScrollReveal', () => {
  it('is hidden before the observed element intersects', () => {
    render(<TestComponent />)
    expect(screen.getByText('hidden')).toBeInTheDocument()
  })

  it('becomes visible once the IntersectionObserver reports an intersection', () => {
    render(<TestComponent />)
    const instance = MockIntersectionObserver.instances[0]

    act(() => {
      instance.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        instance as unknown as IntersectionObserver,
      )
    })

    expect(screen.getByText('visible')).toBeInTheDocument()
  })

  it('disconnects the observer once visible', () => {
    render(<TestComponent />)
    const instance = MockIntersectionObserver.instances[0]

    act(() => {
      instance.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        instance as unknown as IntersectionObserver,
      )
    })

    expect(instance.disconnect).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/hooks/useScrollReveal.test.tsx`
Expected: FAIL — `Cannot find module './useScrollReveal'`.

- [ ] **Step 3: Implement the hook**

Create `src/hooks/useScrollReveal.ts`:
```ts
import { useEffect, useRef, useState } from 'react'

interface ScrollRevealResult<T> {
  ref: React.RefObject<T | null>
  isVisible: boolean
}

export function useScrollReveal<T extends HTMLElement>(): ScrollRevealResult<T> {
  const ref = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/hooks/useScrollReveal.test.tsx`
Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useScrollReveal.ts src/hooks/useScrollReveal.test.tsx
git commit -m "$(cat <<'EOF'
feat(motion): add useScrollReveal hook

IntersectionObserver-backed hook that flips to visible once and stays
there, the basis for the site's scroll-reveal effect.
EOF
)"
```

---

## Task 5: `RevealOnScroll` wrapper component

**Files:**
- Create: `src/components/shared/RevealOnScroll/RevealOnScroll.tsx`
- Create: `src/components/shared/RevealOnScroll/RevealOnScroll.module.css`
- Test: `src/components/shared/RevealOnScroll/RevealOnScroll.test.tsx`

**Interfaces:**
- Consumes: `useScrollReveal<T>()` from Task 4
  (`src/hooks/useScrollReveal.ts`).
- Produces: `<RevealOnScroll delayMs?: number>{children}</RevealOnScroll>`,
  consumed by every section component from Task 9 onward.

- [ ] **Step 1: Write the failing test**

Create `src/components/shared/RevealOnScroll/RevealOnScroll.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RevealOnScroll } from './RevealOnScroll'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('RevealOnScroll', () => {
  it('renders its children so content is visible without JS running', () => {
    render(
      <RevealOnScroll>
        <p>Hard-problem framing</p>
      </RevealOnScroll>,
    )
    expect(screen.getByText('Hard-problem framing')).toBeInTheDocument()
  })

  it('applies the requested transition delay', () => {
    render(
      <RevealOnScroll delayMs={160}>
        <p>Delayed card</p>
      </RevealOnScroll>,
    )
    const wrapper = screen.getByText('Delayed card').parentElement
    expect(wrapper).toHaveStyle({ transitionDelay: '160ms' })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/shared/RevealOnScroll/RevealOnScroll.test.tsx`
Expected: FAIL — `Cannot find module './RevealOnScroll'`.

- [ ] **Step 3: Implement the component**

Create `src/components/shared/RevealOnScroll/RevealOnScroll.module.css`:
```css
.reveal {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.isVisible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

Create `src/components/shared/RevealOnScroll/RevealOnScroll.tsx`:
```tsx
import type { ReactNode } from 'react'
import { useScrollReveal } from '../../../hooks/useScrollReveal'
import styles from './RevealOnScroll.module.css'

interface RevealOnScrollProps {
  children: ReactNode
  delayMs?: number
}

export function RevealOnScroll({ children, delayMs = 0 }: RevealOnScrollProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${isVisible ? styles.isVisible : ''}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  )
}
```

Note on progressive enhancement: the "hidden" pre-reveal state
(`opacity: 0`) only exists inside `.module.css`'s `.reveal` class, which
is only meaningful once React/JS has mounted and applied it — with CSS
Modules, class names are only ever attached by React at runtime, so
server-rendered/no-JS HTML for this project (a client-only Vite SPA) has
no styling applied at all until the bundle runs; this matches the spec's
requirement in spirit (this project has no SSR/no-JS rendering path to
begin with — the whole app requires JS to render at all, same as the
existing Vite starter). The `prefers-reduced-motion` media query still
fully disables the animation for users who request it.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/shared/RevealOnScroll/RevealOnScroll.test.tsx`
Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/RevealOnScroll
git commit -m "$(cat <<'EOF'
feat(motion): add RevealOnScroll wrapper component

Wraps section/card content with the fade + rise transition driven by
useScrollReveal, with prefers-reduced-motion support baked into the CSS.
EOF
)"
```

---

## Task 6: `SectionHeading` shared component

**Files:**
- Create: `src/components/shared/SectionHeading/SectionHeading.tsx`
- Create: `src/components/shared/SectionHeading/SectionHeading.module.css`
- Test: `src/components/shared/SectionHeading/SectionHeading.test.tsx`

**Interfaces:**
- Produces: `<SectionHeading number: string, kicker: string, headingId: string />`,
  consumed by sections 01–06 (Tasks 9–14).

- [ ] **Step 1: Write the failing test**

Create `src/components/shared/SectionHeading/SectionHeading.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHeading } from './SectionHeading'

describe('SectionHeading', () => {
  it('renders the kicker as an h2 with the given id', () => {
    render(<SectionHeading number="01" kicker="Domain expertise" headingId="domains-heading" />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Domain expertise' })
    expect(heading).toHaveAttribute('id', 'domains-heading')
  })

  it('renders the section number as decorative (not part of the accessible name)', () => {
    render(<SectionHeading number="01" kicker="Domain expertise" headingId="domains-heading" />)
    expect(screen.getByText('01')).toHaveAttribute('aria-hidden', 'true')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/shared/SectionHeading/SectionHeading.test.tsx`
Expected: FAIL — `Cannot find module './SectionHeading'`.

- [ ] **Step 3: Implement the component**

Create `src/components/shared/SectionHeading/SectionHeading.module.css`:
```css
.heading {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-family: var(--font-mono);
  text-transform: uppercase;
  font-size: clamp(20px, 3vw, 30px);
  letter-spacing: 0.02em;
  color: var(--text-bright);
  margin-bottom: clamp(32px, 5vw, 56px);
}

.number {
  color: var(--accent);
}
```

Create `src/components/shared/SectionHeading/SectionHeading.tsx`:
```tsx
import styles from './SectionHeading.module.css'

interface SectionHeadingProps {
  number: string
  kicker: string
  headingId: string
}

export function SectionHeading({ number, kicker, headingId }: SectionHeadingProps) {
  return (
    <h2 id={headingId} className={styles.heading}>
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>
      {kicker}
    </h2>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/shared/SectionHeading/SectionHeading.test.tsx`
Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/SectionHeading
git commit -m "$(cat <<'EOF'
feat(shared): add SectionHeading component

Renders the mono kicker + 01-06 section number pattern reused across
every numbered section, with the number excluded from the a11y tree.
EOF
)"
```

---

## Task 7: `Header` (sticky nav)

**Files:**
- Create: `src/components/Header/Header.tsx`
- Create: `src/components/Header/Header.module.css`
- Test: `src/components/Header/Header.test.tsx`

**Interfaces:**
- Produces: `<Header />`, consumed by `App.tsx` in Task 16. Renders nav
  links to `#domains`, `#projects`, `#stack`, `#experience`, `#contact` —
  these ids must match the `id` attributes Tasks 9, 10, 11, 13, 14 put on
  their `<section>` elements.

- [ ] **Step 1: Write the failing test**

Create `src/components/Header/Header.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Header } from './Header'

describe('Header', () => {
  it('renders exactly five nav links pointing to the right section ids, in order', () => {
    render(<Header />)
    const nav = screen.getByRole('navigation', { name: /section navigation/i })
    const links = within(nav).getAllByRole('link')

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#domains',
      '#projects',
      '#stack',
      '#experience',
      '#contact',
    ])
    expect(links.map((link) => link.textContent)).toEqual([
      'domains',
      'projects',
      'stack',
      'experience',
      'contact',
    ])
  })

  it('renders the avatar with descriptive alt text and the "Doba." wordmark', () => {
    render(<Header />)
    expect(screen.getByAltText(/portrait of nguyễn duy anh/i)).toBeInTheDocument()
    expect(screen.getByText('Doba.')).toBeInTheDocument()
  })

  it('renders as a banner landmark', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/Header/Header.test.tsx`
Expected: FAIL — `Cannot find module './Header'`.

- [ ] **Step 3: Implement the component**

Create `src/components/Header/Header.module.css`:
```css
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(13, 13, 11, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

@supports not (backdrop-filter: blur(10px)) {
  .header {
    background: rgba(13, 13, 11, 0.94);
  }
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 14px;
  padding-bottom: 14px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  color: var(--text-bright);
}

.brand:hover {
  color: var(--text-bright);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid var(--border);
}

.wordmark {
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 18px;
}

.nav {
  overflow-x: auto;
  scrollbar-width: none;
}

.nav::-webkit-scrollbar {
  display: none;
}

.navList {
  display: flex;
  gap: clamp(16px, 3vw, 28px);
  font-family: var(--font-mono);
  font-size: 14px;
  white-space: nowrap;
}
```

Create `src/components/Header/Header.tsx`:
```tsx
import styles from './Header.module.css'

const NAV_LINKS = [
  { label: 'domains', href: '#domains' },
  { label: 'projects', href: '#projects' },
  { label: 'stack', href: '#stack' },
  { label: 'experience', href: '#experience' },
  { label: 'contact', href: '#contact' },
]

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a className={styles.brand} href="#main-content">
          <img
            className={styles.avatar}
            src="/assets/avatar-96.png"
            width={40}
            height={40}
            alt="Portrait of Nguyễn Duy Anh"
          />
          <span className={styles.wordmark}>Doba.</span>
        </a>
        <nav className={styles.nav} aria-label="Section navigation">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/Header/Header.test.tsx`
Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header
git commit -m "$(cat <<'EOF'
feat(header): add sticky nav with backdrop-blur

Avatar + wordmark pinned left, five mono section links right-aligned,
with a horizontally scrollable nav row on narrow viewports.
EOF
)"
```

---

## Task 8: `Hero`

**Files:**
- Create: `src/components/Hero/Hero.tsx`
- Create: `src/components/Hero/Hero.module.css`
- Test: `src/components/Hero/Hero.test.tsx`

**Interfaces:**
- Produces: `<Hero />`, consumed by `App.tsx` in Task 16.

- [ ] **Step 1: Write the failing test**

Create `src/components/Hero/Hero.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the headline as the page h1', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { level: 1, name: /i build the systems behind commerce/i }),
    ).toBeInTheDocument()
  })

  it('renders the eyebrow and subline copy', () => {
    render(<Hero />)
    expect(screen.getByText(/software engineer · backend \/ fullstack · ho chi minh city/i)).toBeInTheDocument()
    expect(screen.getByText(/~4 years owning end-to-end backend architecture/i)).toBeInTheDocument()
  })

  it('renders the open-to-remote pill badge', () => {
    render(<Hero />)
    expect(screen.getByText(/open to remote & international roles/i)).toBeInTheDocument()
  })

  it('renders a CV download link with the download attribute', () => {
    render(<Hero />)
    const cvLink = screen.getByRole('link', { name: /download cv/i })
    expect(cvLink).toHaveAttribute('href', '/assets/Nguyen-Duy-Anh-CV.pdf')
    expect(cvLink).toHaveAttribute('download')
  })

  it('renders the avatar with descriptive alt text and a retina srcset', () => {
    render(<Hero />)
    const avatar = screen.getByAltText(/portrait of nguyễn duy anh/i)
    expect(avatar).toHaveAttribute('srcset', expect.stringContaining('640w'))
    expect(avatar).toHaveAttribute('srcset', expect.stringContaining('320w'))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/Hero/Hero.test.tsx`
Expected: FAIL — `Cannot find module './Hero'`.

- [ ] **Step 3: Implement the component**

Create `src/components/Hero/Hero.module.css`:
```css
.hero {
  padding-top: clamp(48px, 8vw, 96px);
  padding-bottom: clamp(64px, 9vw, 116px);
}

.inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(28px, 5vw, 56px);
}

.avatar {
  width: clamp(130px, 20vw, 188px);
  height: clamp(130px, 20vw, 188px);
  border-radius: 24px;
  object-fit: cover;
  border: 1px solid var(--accent);
  box-shadow: 0 0 0 8px var(--accent-dim);
  flex-shrink: 0;
}

.text {
  flex: 1 1 420px;
  min-width: 0;
}

.eyebrow {
  font-family: var(--font-mono);
  color: var(--muted);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 20px;
}

.headline {
  font-size: clamp(32px, 5.5vw, 56px);
  margin-bottom: 20px;
}

.accentText {
  color: var(--accent);
}

.subline {
  font-size: clamp(16px, 2vw, 19px);
  color: var(--text);
  max-width: 60ch;
  margin-bottom: 24px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent);
  background: var(--accent-dim);
  border-radius: 999px;
  padding: 8px 16px;
  margin-bottom: 28px;
}

.cvButton {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: var(--bg);
  font-family: var(--font-mono);
  font-weight: 500;
  padding: 12px 22px;
  border-radius: 8px;
}

.cvButton:hover {
  color: var(--bg);
  opacity: 0.9;
}
```

Create `src/components/Hero/Hero.tsx`:
```tsx
import styles from './Hero.module.css'

const CV_HREF = '/assets/Nguyen-Duy-Anh-CV.pdf'

export function Hero() {
  return (
    <section aria-label="Introduction" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <img
          className={styles.avatar}
          src="/assets/avatar-320.png"
          srcSet="/assets/avatar-320.png 320w, /assets/avatar-640.png 640w"
          sizes="(min-width: 940px) 188px, 20vw"
          width={188}
          height={188}
          alt="Portrait of Nguyễn Duy Anh"
        />
        <div className={styles.text}>
          <p className={styles.eyebrow}>Software Engineer · Backend / Fullstack · Ho Chi Minh City</p>
          <h1 className={styles.headline}>
            I build the systems behind commerce —{' '}
            <span className={styles.accentText}>
              multi-tenant platforms, distribution pipelines, and message infrastructure.
            </span>
          </h1>
          <p className={styles.subline}>
            Nguyễn Duy Anh (&ldquo;Doba&rdquo;) — ~4 years owning end-to-end backend architecture for
            multi-tenant SaaS. I care about correctness under concurrency and systems that are boring to
            operate.
          </p>
          <p className={styles.badge}>
            <span aria-hidden="true">●</span> Open to remote &amp; international roles
          </p>
          <div>
            <a className={styles.cvButton} href={CV_HREF} download>
              ↓ Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/Hero/Hero.test.tsx`
Expected: 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero
git commit -m "$(cat <<'EOF'
feat(hero): add hero section with headline, subline, and CV download

Avatar stacks above the text on mobile and sits left on desktop via
flex-wrap; retina srcset covers the 130-188px fluid avatar size.
EOF
)"
```

---

## Task 9: `DomainExpertise` (section 01)

**Files:**
- Create: `src/components/DomainExpertise/data.ts`
- Create: `src/components/DomainExpertise/DomainExpertise.tsx`
- Create: `src/components/DomainExpertise/DomainExpertise.module.css`
- Test: `src/components/DomainExpertise/DomainExpertise.test.tsx`

**Interfaces:**
- Consumes: `SectionHeading` (Task 6), `RevealOnScroll` (Task 5).
- Produces: `<DomainExpertise />` with `id="domains"`, matching the
  Header's `#domains` link (Task 7); `DomainCard` type and `domainCards`
  array from `data.ts`.

- [ ] **Step 1: Write the data file**

Create `src/components/DomainExpertise/data.ts`:
```ts
export interface DomainCard {
  code: string
  title: string
  problem: string
  shipped: string
}

export const domainCards: DomainCard[] = [
  {
    code: 'D-01',
    title: 'E-commerce & POS',
    problem:
      'Inventory, pricing, and order state have to stay correct across storefront, POS terminal, and backend at once.',
    shipped:
      'Built multi-tenant order and inventory flows that handle concurrent stock updates without overselling.',
  },
  {
    code: 'D-02',
    title: 'Distribution (DMS)',
    problem: 'The same order has to move through multiple warehouses and resellers without losing traceability.',
    shipped: 'Shipped a distribution management system tracking stock and orders across tiers of resellers.',
  },
  {
    code: 'D-03',
    title: 'Agriculture SaaS',
    problem: 'Concurrent writes to shared farm and batch records raced under load, corrupting state.',
    shipped: 'Solved a production race condition with row-level locking.',
  },
  {
    code: 'D-04',
    title: 'Game / Engagement',
    problem: 'Real-time giveaway games need fair, tamper-proof draws under concurrent play.',
    shipped:
      'Built a SaaS mini-game platform (Lucky Wheel, Card Flip) for restaurant giveaway campaigns — NestJS, PostgreSQL, RabbitMQ, Redis, WebSocket.',
  },
]
```

- [ ] **Step 2: Write the failing test**

Create `src/components/DomainExpertise/DomainExpertise.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DomainExpertise } from './DomainExpertise'
import { domainCards } from './data'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('DomainExpertise', () => {
  it('renders the section heading with number 01 and id="domains"', () => {
    const { container } = render(<DomainExpertise />)
    expect(screen.getByRole('heading', { level: 2, name: 'Domain expertise' })).toBeInTheDocument()
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(container.querySelector('#domains')).not.toBeNull()
  })

  it('renders one article per domain card', () => {
    render(<DomainExpertise />)
    expect(screen.getAllByRole('article')).toHaveLength(domainCards.length)
  })

  it('renders each card code, title, problem, and shipped line', () => {
    render(<DomainExpertise />)
    domainCards.forEach((card) => {
      expect(screen.getByText(card.code)).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3, name: card.title })).toBeInTheDocument()
      expect(screen.getByText(card.problem)).toBeInTheDocument()
      expect(screen.getByText(card.shipped)).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test src/components/DomainExpertise/DomainExpertise.test.tsx`
Expected: FAIL — `Cannot find module './DomainExpertise'`.

- [ ] **Step 4: Implement the component**

Create `src/components/DomainExpertise/DomainExpertise.module.css`:
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(248px, 1fr));
  gap: 20px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  height: 100%;
}

.code {
  font-family: var(--font-mono);
  color: var(--accent);
  font-size: 13px;
  margin-bottom: 12px;
}

.title {
  font-size: 19px;
  margin-bottom: 12px;
}

.problem {
  color: var(--text);
  font-size: 15px;
  margin-bottom: 8px;
}

.shipped {
  color: var(--muted);
  font-size: 14px;
}
```

Create `src/components/DomainExpertise/DomainExpertise.tsx`:
```tsx
import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import { domainCards } from './data'
import styles from './DomainExpertise.module.css'

export function DomainExpertise() {
  return (
    <section id="domains" className="section" aria-labelledby="domains-heading">
      <div className="container">
        <SectionHeading number="01" kicker="Domain expertise" headingId="domains-heading" />
        <div className={styles.grid}>
          {domainCards.map((card, index) => (
            <RevealOnScroll key={card.code} delayMs={index * 80}>
              <article className={styles.card}>
                <p className={styles.code}>{card.code}</p>
                <h3 className={styles.title}>{card.title}</h3>
                <p className={styles.problem}>{card.problem}</p>
                <p className={styles.shipped}>{card.shipped}</p>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test src/components/DomainExpertise/DomainExpertise.test.tsx`
Expected: 3 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/DomainExpertise
git commit -m "$(cat <<'EOF'
feat(domains): add section 01 domain expertise cards

Four D-01..D-04 cards in an auto-fit grid, each pairing a one-line hard
problem with what shipped to solve it.
EOF
)"
```

---

## Task 10: `Projects` (section 02)

**Files:**
- Create: `src/components/Projects/data.ts`
- Create: `src/components/Projects/Projects.tsx`
- Create: `src/components/Projects/Projects.module.css`
- Test: `src/components/Projects/Projects.test.tsx`

**Interfaces:**
- Consumes: `SectionHeading` (Task 6), `RevealOnScroll` (Task 5).
- Produces: `<Projects />` with `id="projects"`, matching the Header's
  `#projects` link; `Project` type and `projects` array from `data.ts`.

- [ ] **Step 1: Write the data file**

Create `src/components/Projects/data.ts`:
```ts
export interface Project {
  title: string
  url: string
  subtitle: string
  description: string
  tags: string[]
}

export const projects: Project[] = [
  {
    title: 'goq',
    url: 'https://github.com/dobadevv/goq',
    subtitle: 'A message broker built from scratch',
    description:
      'A RabbitMQ-style TCP message broker built to understand brokers end-to-end. Observer-pattern fan-out, SQLite persistence, and a length-prefixed JSON wire protocol — shipped with an importable client library and an installable CLI.',
    tags: ['Go', 'TCP', 'SQLite', 'Observer pattern'],
  },
  {
    title: 'Marsvenus Connection',
    url: 'https://connection.dev.marsvenus.com.vn/en/login',
    subtitle: 'Anonymous dating & connection platform',
    description:
      'A platform where people post invitations and apply to others to connect and date anonymously. Go backend on chi + sqlc + pgx/v5 with goose migrations, and MinIO object storage using a dual-endpoint presigned-URL pattern for secure, correct media delivery across environments.',
    tags: ['Go', 'chi', 'sqlc', 'pgx/v5', 'goose', 'Next.js', 'MinIO'],
  },
]
```

- [ ] **Step 2: Write the failing test**

Create `src/components/Projects/Projects.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Projects } from './Projects'
import { projects } from './data'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('Projects', () => {
  it('renders the section heading with number 02 and id="projects"', () => {
    const { container } = render(<Projects />)
    expect(screen.getByRole('heading', { level: 2, name: 'My projects' })).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(container.querySelector('#projects')).not.toBeNull()
  })

  it('renders one article per project', () => {
    render(<Projects />)
    expect(screen.getAllByRole('article')).toHaveLength(projects.length)
  })

  it('opens each project link safely, with correct href, subtitle, description, and tags', () => {
    render(<Projects />)
    projects.forEach((project) => {
      const link = screen.getByRole('link', { name: project.title })
      expect(link).toHaveAttribute('href', project.url)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(screen.getByText(project.subtitle)).toBeInTheDocument()
      expect(screen.getByText(project.description)).toBeInTheDocument()
      project.tags.forEach((tag) => {
        expect(screen.getAllByText(tag).length).toBeGreaterThan(0)
      })
    })
  })

  it('renders a trailing "more projects in progress" placeholder with no link', () => {
    render(<Projects />)
    const placeholder = screen.getByText(/more projects in progress/i)
    expect(placeholder.querySelector('a')).toBeNull()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test src/components/Projects/Projects.test.tsx`
Expected: FAIL — `Cannot find module './Projects'`.

- [ ] **Step 4: Implement the component**

Create `src/components/Projects/Projects.module.css`:
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  font-size: 21px;
}

.subtitle {
  font-family: var(--font-mono);
  color: var(--muted);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.description {
  color: var(--text);
  font-size: 15px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
  padding-top: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
}

.tags li {
  background: var(--accent-dim);
  color: var(--accent);
  border-radius: 999px;
  padding: 4px 12px;
}

.placeholder {
  border: 1px dashed var(--border);
  border-radius: 12px;
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  min-height: 160px;
}
```

Create `src/components/Projects/Projects.tsx`:
```tsx
import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import { projects } from './data'
import styles from './Projects.module.css'

export function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container">
        <SectionHeading number="02" kicker="My projects" headingId="projects-heading" />
        <div className={styles.grid}>
          {projects.map((project, index) => (
            <RevealOnScroll key={project.title} delayMs={index * 80}>
              <article className={styles.card}>
                <h3 className={styles.title}>
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    {project.title}
                  </a>
                </h3>
                <p className={styles.subtitle}>{project.subtitle}</p>
                <p className={styles.description}>{project.description}</p>
                <ul className={styles.tags}>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            </RevealOnScroll>
          ))}
          <div className={styles.placeholder}>more projects in progress</div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test src/components/Projects/Projects.test.tsx`
Expected: 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Projects
git commit -m "$(cat <<'EOF'
feat(projects): add section 02 projects grid

goq and Marsvenus Connection cards in an extensible auto-fit grid, plus
a dashed trailing placeholder for projects still in progress.
EOF
)"
```

---

## Task 11: `Stack` (section 03)

**Files:**
- Create: `src/components/Stack/data.ts`
- Create: `src/components/Stack/Stack.tsx`
- Create: `src/components/Stack/Stack.module.css`
- Test: `src/components/Stack/Stack.test.tsx`

**Interfaces:**
- Consumes: `SectionHeading` (Task 6), `RevealOnScroll` (Task 5).
- Produces: `<Stack />` with `id="stack"`, matching the Header's `#stack`
  link; `StackGroup` type and `stackGroups` array from `data.ts`.

- [ ] **Step 1: Write the data file**

Create `src/components/Stack/data.ts`:
```ts
export interface StackGroup {
  label: string
  items: string[]
}

export const stackGroups: StackGroup[] = [
  { label: 'Languages', items: ['Node.js/TypeScript', 'Go', 'Rust'] },
  { label: 'Backend', items: ['NestJS', 'Express.js', 'REST', 'GraphQL', 'chi', 'gin'] },
  { label: 'Data', items: ['PostgreSQL', 'MongoDB', 'Redis'] },
  { label: 'Messaging & async', items: ['Kafka', 'RabbitMQ', 'BullMQ'] },
  {
    label: 'Infra & DevOps',
    items: ['Docker', 'Nginx', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'AWS'],
  },
  { label: 'Frontend (secondary)', items: ['Next.js', 'React', 'Tailwind'] },
]
```

- [ ] **Step 2: Write the failing test**

Create `src/components/Stack/Stack.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Stack } from './Stack'
import { stackGroups } from './data'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('Stack', () => {
  it('renders the section heading with number 03 and id="stack"', () => {
    const { container } = render(<Stack />)
    expect(screen.getByRole('heading', { level: 2, name: 'Stack' })).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(container.querySelector('#stack')).not.toBeNull()
  })

  it('renders one group per stack category with its label', () => {
    render(<Stack />)
    expect(screen.getAllByRole('article')).toHaveLength(stackGroups.length)
    stackGroups.forEach((group) => {
      expect(screen.getByRole('heading', { level: 3, name: group.label })).toBeInTheDocument()
    })
  })

  it('renders every tag chip within its group', () => {
    render(<Stack />)
    stackGroups.forEach((group) => {
      group.items.forEach((item) => {
        expect(screen.getAllByText(item).length).toBeGreaterThan(0)
      })
    })
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test src/components/Stack/Stack.test.tsx`
Expected: FAIL — `Cannot find module './Stack'`.

- [ ] **Step 4: Implement the component**

Create `src/components/Stack/Stack.module.css`:
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px;
}

.label {
  font-family: var(--font-mono);
  color: var(--muted);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: 14px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 13px;
}

.chips li {
  background: var(--accent-dim);
  color: var(--accent);
  border-radius: 999px;
  padding: 5px 12px;
}
```

Create `src/components/Stack/Stack.tsx`:
```tsx
import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import { stackGroups } from './data'
import styles from './Stack.module.css'

export function Stack() {
  return (
    <section id="stack" className="section" aria-labelledby="stack-heading">
      <div className="container">
        <SectionHeading number="03" kicker="Stack" headingId="stack-heading" />
        <div className={styles.grid}>
          {stackGroups.map((group, index) => (
            <RevealOnScroll key={group.label} delayMs={index * 60}>
              <article className={styles.card}>
                <h3 className={styles.label}>{group.label}</h3>
                <ul className={styles.chips}>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test src/components/Stack/Stack.test.tsx`
Expected: 3 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Stack
git commit -m "$(cat <<'EOF'
feat(stack): add section 03 grouped stack chips

Six labeled groups (languages, backend, data, messaging, infra, frontend)
rendered as tag chips in an auto-fit grid.
EOF
)"
```

---

## Task 12: `HowIWork` (section 04)

**Files:**
- Create: `src/components/HowIWork/HowIWork.tsx`
- Create: `src/components/HowIWork/HowIWork.module.css`
- Test: `src/components/HowIWork/HowIWork.test.tsx`

**Interfaces:**
- Consumes: `SectionHeading` (Task 6), `RevealOnScroll` (Task 5).
- Produces: `<HowIWork />` with `id="how-i-work"` (no nav link points here
  — matches the brief, which numbers this section but doesn't list it in
  the header nav).

- [ ] **Step 1: Write the failing test**

Create `src/components/HowIWork/HowIWork.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HowIWork } from './HowIWork'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('HowIWork', () => {
  it('renders the section heading with number 04 and id="how-i-work"', () => {
    const { container } = render(<HowIWork />)
    expect(screen.getByRole('heading', { level: 2, name: 'How I work' })).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
    expect(container.querySelector('#how-i-work')).not.toBeNull()
  })

  it('renders the statement text', () => {
    render(<HowIWork />)
    expect(
      screen.getByText(/i care about correctness under concurrency, clear boundaries between services/i),
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/HowIWork/HowIWork.test.tsx`
Expected: FAIL — `Cannot find module './HowIWork'`.

- [ ] **Step 3: Implement the component**

Create `src/components/HowIWork/HowIWork.module.css`:
```css
.statement {
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: clamp(17px, 2.1vw, 23px);
  color: var(--text-bright);
  max-width: 46ch;
}
```

Create `src/components/HowIWork/HowIWork.tsx`:
```tsx
import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import styles from './HowIWork.module.css'

export function HowIWork() {
  return (
    <section id="how-i-work" className="section" aria-labelledby="how-i-work-heading">
      <div className="container">
        <SectionHeading number="04" kicker="How I work" headingId="how-i-work-heading" />
        <RevealOnScroll>
          <p className={styles.statement}>
            I care about correctness under concurrency, clear boundaries between services, and systems
            that are boring to operate — the kind you don&rsquo;t get paged about at 3am.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/HowIWork/HowIWork.test.tsx`
Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/HowIWork
git commit -m "$(cat <<'EOF'
feat(how-i-work): add section 04 single-statement block
EOF
)"
```

---

## Task 13: `Experience` (section 05)

**Files:**
- Create: `src/components/Experience/data.ts`
- Create: `src/components/Experience/Experience.tsx`
- Create: `src/components/Experience/Experience.module.css`
- Test: `src/components/Experience/Experience.test.tsx`

**Interfaces:**
- Consumes: `SectionHeading` (Task 6), `RevealOnScroll` (Task 5).
- Produces: `<Experience />` with `id="experience"`, matching the
  Header's `#experience` link; `ExperienceEntry` type and
  `experienceEntries` array from `data.ts`.

- [ ] **Step 1: Write the data file**

Create `src/components/Experience/data.ts`:
```ts
export interface ExperienceEntry {
  dateRange: string
  company: string
  role: string
  description: string
  current?: boolean
}

export const experienceEntries: ExperienceEntry[] = [
  {
    dateRange: 'Sep 2024 – Present',
    company: 'Finviet',
    role: 'Backend Engineer',
    description:
      'Building ECOPOS, a multi-tenant POS/e-commerce/DMS platform, from scratch with Clean Architecture — NestJS, Kafka, RabbitMQ, BullMQ, PostgreSQL, Redis, Elasticsearch.',
    current: true,
  },
  {
    dateRange: 'Jul 2023 – Aug 2024',
    company: 'GreenAgri',
    role: 'Backend Engineer',
    description:
      'Owned backend services for an agriculture SaaS platform, including tracking down and fixing a production race condition with row-level locking.',
  },
  {
    dateRange: 'Mar 2023 – Jul 2023',
    company: 'TAS Vietnam',
    role: 'Backend Developer',
    description: 'Built backend services and internal tooling for e-commerce operations.',
  },
  {
    dateRange: 'Nov 2022 – Mar 2023',
    company: 'EPlus Technology',
    role: 'Backend Developer',
    description: 'Delivered REST APIs powering client web platforms.',
  },
  {
    dateRange: 'Jan 2022 – Jun 2022',
    company: 'STECH',
    role: 'Backend Developer',
    description: 'First production experience building Node.js backend services.',
  },
]
```

- [ ] **Step 2: Write the failing test**

Create `src/components/Experience/Experience.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Experience } from './Experience'
import { experienceEntries } from './data'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('Experience', () => {
  it('renders the section heading with number 05 and id="experience"', () => {
    const { container } = render(<Experience />)
    expect(screen.getByRole('heading', { level: 2, name: 'Experience' })).toBeInTheDocument()
    expect(screen.getByText('05')).toBeInTheDocument()
    expect(container.querySelector('#experience')).not.toBeNull()
  })

  it('renders one row per experience entry', () => {
    render(<Experience />)
    expect(screen.getAllByRole('listitem')).toHaveLength(experienceEntries.length)
  })

  it('marks only the Finviet entry as CURRENT', () => {
    render(<Experience />)
    expect(screen.getAllByText('CURRENT')).toHaveLength(1)
  })

  it('renders each entry\'s date range, company, role, and description', () => {
    render(<Experience />)
    experienceEntries.forEach((entry) => {
      expect(screen.getByText(entry.dateRange)).toBeInTheDocument()
      expect(screen.getByText(entry.company)).toBeInTheDocument()
      expect(screen.getByText(entry.role, { exact: false })).toBeInTheDocument()
      expect(screen.getByText(entry.description)).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test src/components/Experience/Experience.test.tsx`
Expected: FAIL — `Cannot find module './Experience'`.

- [ ] **Step 4: Implement the component**

Create `src/components/Experience/Experience.module.css`:
```css
.timeline {
  display: flex;
  flex-direction: column;
}

.row {
  border-bottom: 1px solid var(--border);
}

.row:last-child {
  border-bottom: none;
}

.rowInner {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 16px;
  padding: 24px 0;
}

@media (max-width: 560px) {
  .rowInner {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

.dateCell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date {
  font-family: var(--font-mono);
  color: var(--muted);
  font-size: 14px;
}

.currentBadge {
  display: inline-block;
  align-self: flex-start;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--accent);
  background: var(--accent-dim);
  border-radius: 999px;
  padding: 3px 10px;
  letter-spacing: 0.04em;
}

.companyRole {
  font-size: 16px;
  color: var(--text-bright);
  margin-bottom: 6px;
}

.company {
  font-weight: 600;
}

.description {
  color: var(--muted);
  font-size: 14px;
}
```

Create `src/components/Experience/Experience.tsx`:
```tsx
import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import { experienceEntries } from './data'
import styles from './Experience.module.css'

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="container">
        <SectionHeading number="05" kicker="Experience" headingId="experience-heading" />
        <ol className={styles.timeline}>
          {experienceEntries.map((entry, index) => (
            <li key={entry.company} className={styles.row}>
              <RevealOnScroll delayMs={index * 60}>
                <div className={styles.rowInner}>
                  <div className={styles.dateCell}>
                    <p className={styles.date}>{entry.dateRange}</p>
                    {entry.current && <span className={styles.currentBadge}>CURRENT</span>}
                  </div>
                  <div>
                    <p className={styles.companyRole}>
                      <span className={styles.company}>{entry.company}</span> · {entry.role}
                    </p>
                    <p className={styles.description}>{entry.description}</p>
                  </div>
                </div>
              </RevealOnScroll>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test src/components/Experience/Experience.test.tsx`
Expected: 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Experience
git commit -m "$(cat <<'EOF'
feat(experience): add section 05 compact timeline

180px|1fr grid rows (stacking under 560px) for Finviet (marked CURRENT),
GreenAgri, TAS Vietnam, EPlus Technology, and STECH.
EOF
)"
```

---

## Task 14: `Contact` (section 06)

**Files:**
- Create: `src/components/Contact/data.ts`
- Create: `src/components/Contact/Contact.tsx`
- Create: `src/components/Contact/Contact.module.css`
- Test: `src/components/Contact/Contact.test.tsx`

**Interfaces:**
- Consumes: `SectionHeading` (Task 6), `RevealOnScroll` (Task 5).
- Produces: `<Contact />` with `id="contact"`, matching the Header's
  `#contact` link; `ContactEntry` type and `contactEntries` array from
  `data.ts`.

- [ ] **Step 1: Write the data file**

Create `src/components/Contact/data.ts`:
```ts
export interface ContactEntry {
  label: string
  value: string
  href: string
  external?: boolean
}

export const contactEntries: ContactEntry[] = [
  { label: 'Email', value: 'duyanh.it.work@gmail.com', href: 'mailto:duyanh.it.work@gmail.com' },
  { label: 'GitHub', value: 'github.com/dobadevv', href: 'https://github.com/dobadevv', external: true },
  {
    label: 'LinkedIn',
    value: 'in/duyanhitbe',
    href: 'https://www.linkedin.com/in/duyanhitbe',
    external: true,
  },
  { label: 'Phone', value: '+84 944 609 933', href: 'tel:+84944609933' },
]
```

- [ ] **Step 2: Write the failing test**

Create `src/components/Contact/Contact.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'
import { contactEntries } from './data'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('Contact', () => {
  it('renders the section heading with number 06 and id="contact"', () => {
    const { container } = render(<Contact />)
    expect(screen.getByRole('heading', { level: 2, name: 'Contact' })).toBeInTheDocument()
    expect(screen.getByText('06')).toBeInTheDocument()
    expect(container.querySelector('#contact')).not.toBeNull()
  })

  it('renders the closing heading and location line', () => {
    render(<Contact />)
    expect(screen.getByText(/let.s build something that stays boring to run/i)).toBeInTheDocument()
    expect(screen.getByText(/based in ho chi minh city/i)).toBeInTheDocument()
  })

  it('renders one card per contact entry with the correct href', () => {
    render(<Contact />)
    contactEntries.forEach((entry) => {
      const link = screen.getByRole('link', { name: entry.value })
      expect(link).toHaveAttribute('href', entry.href)
    })
  })

  it('marks only external contact links with target and rel', () => {
    render(<Contact />)
    contactEntries.forEach((entry) => {
      const link = screen.getByRole('link', { name: entry.value })
      if (entry.external) {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      } else {
        expect(link).not.toHaveAttribute('target')
      }
    })
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test src/components/Contact/Contact.test.tsx`
Expected: FAIL — `Cannot find module './Contact'`.

- [ ] **Step 4: Implement the component**

Create `src/components/Contact/Contact.module.css`:
```css
.heading {
  font-size: clamp(26px, 4vw, 38px);
  max-width: 20ch;
  margin-bottom: 16px;
}

.location {
  font-family: var(--font-mono);
  color: var(--muted);
  font-size: 15px;
  margin-bottom: clamp(32px, 5vw, 48px);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 22px;
}

.label {
  font-family: var(--font-mono);
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 10px;
}

.value {
  font-size: 16px;
  font-weight: 500;
  word-break: break-word;
}
```

Create `src/components/Contact/Contact.tsx`:
```tsx
import { SectionHeading } from '../shared/SectionHeading/SectionHeading'
import { RevealOnScroll } from '../shared/RevealOnScroll/RevealOnScroll'
import { contactEntries } from './data'
import styles from './Contact.module.css'

export function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="container">
        <SectionHeading number="06" kicker="Contact" headingId="contact-heading" />
        <h3 className={styles.heading}>Let&rsquo;s build something that stays boring to run.</h3>
        <p className={styles.location}>
          Based in Ho Chi Minh City · open to remote &amp; international roles.
        </p>
        <div className={styles.grid}>
          {contactEntries.map((entry, index) => (
            <RevealOnScroll key={entry.label} delayMs={index * 60}>
              <article className={styles.card}>
                <p className={styles.label}>{entry.label}</p>
                <a
                  className={styles.value}
                  href={entry.href}
                  {...(entry.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {entry.value}
                </a>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test src/components/Contact/Contact.test.tsx`
Expected: 4 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Contact
git commit -m "$(cat <<'EOF'
feat(contact): add section 06 contact cards

Email, GitHub, LinkedIn, and phone in a 4-column auto-fit grid that
collapses gracefully on mobile; external links open safely in a new tab.
EOF
)"
```

---

## Task 15: `Footer`

**Files:**
- Create: `src/components/Footer/Footer.tsx`
- Create: `src/components/Footer/Footer.module.css`
- Test: `src/components/Footer/Footer.test.tsx`

**Interfaces:**
- Produces: `<Footer />`, consumed by `App.tsx` in Task 16.

- [ ] **Step 1: Write the failing test**

Create `src/components/Footer/Footer.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders as a contentinfo landmark', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders the copyright and tagline text', () => {
    render(<Footer />)
    expect(screen.getByText('© 2026 Nguyễn Duy Anh (Doba)')).toBeInTheDocument()
    expect(screen.getByText('Built with structure over decoration.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/Footer/Footer.test.tsx`
Expected: FAIL — `Cannot find module './Footer'`.

- [ ] **Step 3: Implement the component**

Create `src/components/Footer/Footer.module.css`:
```css
.footer {
  border-top: 1px solid var(--border);
}

.inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  padding-top: 28px;
  padding-bottom: 28px;
  font-family: var(--font-mono);
  color: var(--muted);
  font-size: 13px;
}
```

Create `src/components/Footer/Footer.tsx`:
```tsx
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>© 2026 Nguyễn Duy Anh (Doba)</p>
        <p>Built with structure over decoration.</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/Footer/Footer.test.tsx`
Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer
git commit -m "$(cat <<'EOF'
feat(footer): add mono footer with copyright and tagline
EOF
)"
```

---

## Task 16: Compose `App.tsx`, update `index.html`, add integration test

**Files:**
- Modify: `src/App.tsx` (full rewrite)
- Modify: `index.html`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `Header` (Task 7), `Hero` (Task 8), `DomainExpertise` (Task 9),
  `Projects` (Task 10), `Stack` (Task 11), `HowIWork` (Task 12),
  `Experience` (Task 13), `Contact` (Task 14), `Footer` (Task 15).
- Produces: the fully composed page, default-exported from `src/App.tsx`,
  rendered by the unchanged `src/main.tsx`.

- [ ] **Step 1: Write the failing integration test**

Create `src/App.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  constructor(_callback: IntersectionObserverCallback) {}
}

beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

describe('App', () => {
  it('renders landmarks in document order: banner, main, contentinfo', () => {
    render(<App />)
    const banner = screen.getByRole('banner')
    const main = screen.getByRole('main')
    const contentinfo = screen.getByRole('contentinfo')

    expect(banner.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(main.compareDocumentPosition(contentinfo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('renders a skip link pointing at the main content region', () => {
    render(<App />)
    const skipLink = screen.getByRole('link', { name: /skip to main content/i })
    expect(skipLink).toHaveAttribute('href', '#main-content')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
  })

  it('every header nav link href resolves to a real section id on the page', () => {
    const { container } = render(<App />)
    const nav = screen.getByRole('navigation', { name: /section navigation/i })
    const hrefs = Array.from(nav.querySelectorAll('a')).map((a) => a.getAttribute('href') as string)

    expect(hrefs.length).toBeGreaterThan(0)
    hrefs.forEach((href) => {
      expect(container.querySelector(href)).not.toBeNull()
    })
  })

  it('renders all six numbered sections in order 01 through 06', () => {
    render(<App />)
    const numbers = ['01', '02', '03', '04', '05', '06']
    numbers.forEach((number) => {
      expect(screen.getByText(number)).toBeInTheDocument()
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/App.test.tsx`
Expected: FAIL — the current `src/App.tsx` still imports the deleted
`./App.css` and `./assets/*` files from Task 1, so this fails at module
resolution before any assertion runs.

- [ ] **Step 3: Rewrite `App.tsx`**

Replace the contents of `src/App.tsx`:
```tsx
import { Header } from './components/Header/Header'
import { Hero } from './components/Hero/Hero'
import { DomainExpertise } from './components/DomainExpertise/DomainExpertise'
import { Projects } from './components/Projects/Projects'
import { Stack } from './components/Stack/Stack'
import { HowIWork } from './components/HowIWork/HowIWork'
import { Experience } from './components/Experience/Experience'
import { Contact } from './components/Contact/Contact'
import { Footer } from './components/Footer/Footer'

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <DomainExpertise />
        <Projects />
        <Stack />
        <HowIWork />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
```

- [ ] **Step 4: Update `index.html`**

Replace the contents of `index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/assets/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Nguyễn Duy Anh (Doba) — Software Engineer building multi-tenant commerce platforms, distribution pipelines, and message infrastructure."
    />
    <title>Doba — Software Engineer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm test src/App.test.tsx`
Expected: 4 tests PASS.

- [ ] **Step 6: Run the full test suite**

Run: `pnpm test`
Expected: every test file across `src/` passes (Tasks 4–16's tests, all
still green).

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx index.html src/App.test.tsx
git commit -m "$(cat <<'EOF'
feat(app): compose all sections into App and update document metadata

Wires header, hero, and sections 01-06 plus footer into the page, adds
a skip link into <main id="main-content">, and points the favicon/title/
description at the real site instead of the Vite starter defaults.
EOF
)"
```

---

## Task 17: Type-check, lint, build, and manual verification

**Files:** none (verification only).

- [ ] **Step 1: Type-check**

Run: `pnpm exec tsc -b`
Expected: exits 0, no type errors.

- [ ] **Step 2: Lint**

Run: `pnpm lint`
Expected: exits 0, no errors. If ESLint flags anything (e.g. an unused
import left over from a refactor), fix it in the relevant component file
from Tasks 6–16 and re-run.

- [ ] **Step 3: Production build**

Run: `pnpm build`
Expected: exits 0; `dist/` is produced with hashed asset filenames.

- [ ] **Step 4: Full test suite one more time**

Run: `pnpm test`
Expected: all tests PASS (this is the final gate before manual
verification).

- [ ] **Step 5: Manual browser verification**

Use this project's `run`/`verify` skill to start the dev server
(`pnpm dev`) and drive the built page in a real browser. Check, at both a
narrow (≈375px) and wide (≈1440px) viewport:
- Header stays sticky with backdrop-blur; nav row scrolls horizontally
  without a visible scrollbar on narrow widths; clicking each nav link
  scrolls to the matching section.
- Hero avatar stacks above the text on mobile and sits left of the text
  on desktop; the accent-colored second half of the headline is legible;
  the CV button downloads `Nguyen-Duy-Anh-CV.pdf`.
- Section 01/02/03 card grids reflow via `auto-fit` at multiple widths
  without any card overflowing or collapsing to zero width.
- Scroll-revealed content (cards, the How I Work statement, contact
  cards) fades/rises into view once scrolled into the viewport; toggling
  "prefers reduced motion" in OS/browser dev tools makes content appear
  immediately with no animation.
- Tab through the entire page with the keyboard only: the skip link
  appears on first Tab press and jumps focus into `<main>`; every
  interactive element (nav links, CV button, project links, contact
  links) shows a visible 2px accent focus outline; tab order follows
  visual/document order.
- Confirm the browser tab shows the avatar-based favicon.

Expected: no visual regressions, no console errors, all of the above
behaviors confirmed. This step has no automated assertion — report
findings back before considering the plan complete.

- [ ] **Step 6: Commit (only if Step 2 or 5 required fixes)**

If lint or manual verification required any code changes, stage and
commit them:
```bash
git add -A
git commit -m "$(cat <<'EOF'
fix: address lint and manual verification findings

EOF
)"
```
If no changes were needed, skip this step — there is nothing to commit.

---

## Self-Review Notes

- **Spec coverage:** every spec section has a task — tooling/fonts/theme
  (Tasks 1–3), motion primitives (Tasks 4–5), shared heading (Task 6),
  header/hero (Tasks 7–8), sections 01–06 (Tasks 9–14), footer (Task 15),
  composition + document metadata (Task 16), and final verification
  (Task 17).
- **Nav ↔ section id consistency:** Header (Task 7) links to `#domains`,
  `#projects`, `#stack`, `#experience`, `#contact`; DomainExpertise (9),
  Projects (10), Stack (11), Experience (13), Contact (14) each set that
  exact `id` on their `<section>`. HowIWork (12) uses `#how-i-work` and
  is intentionally not linked from the nav, matching the spec. Task 16's
  integration test asserts every nav href resolves to a real id on the
  page, guarding this invariant going forward.
- **Type consistency:** `RevealOnScroll` accepts `delayMs?: number`
  everywhere it's used (Tasks 9–14); `SectionHeading` accepts
  `{ number, kicker, headingId }` everywhere it's used; data-file
  interfaces (`DomainCard`, `Project`, `StackGroup`, `ExperienceEntry`,
  `ContactEntry`) are each defined once in their own `data.ts` and only
  imported, never redefined, by their component.
- **No placeholders:** all copy (domain card framing, experience
  one-liners) is final, specific text — not TBD markers — decided during
  brainstorming's open-items resolution and written out in full in
  Tasks 9 and 13.
