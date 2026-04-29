# lumatale

> Stories that read you back. — *一个只在夜里被读到的故事*

An interactive novel platform MVP built in a 4-hour challenge.
Live demo: _填部署后的 Vercel URL_

---

## What this is

A multi-page reading experience for a single short interactive story —
**《午夜图书馆》** — designed as the seed for a larger PGC novel platform.

- **Home** (`/`) — brand hero + grid of one real novel + two
  "即将上线" placeholders to suggest platform scale.
- **Novel detail** (`/novels/midnight-library`) — synopsis, scene
  count, reading-time estimate, primary CTA.
- **Reader** (`/novels/midnight-library/read`) — keyboard-driven scene
  player with persistent progress and an ending takeover.

All novel content lives in **Supabase**. The frontend never hardcodes
the story; it queries `novels` and `scenes` tables on every render
(cached via React `cache()` + ISR `revalidate=3600`).

## Stack

| | |
|---|---|
| Framework | Next.js 16.2.4 (App Router, Turbopack) |
| UI runtime | React 19.2.4 |
| Styling | Tailwind v4 (`@theme` tokens, no config file) |
| Animation | framer-motion 12 (with `useReducedMotion`) |
| Data | @supabase/supabase-js (anon key + RLS public-select) |
| Deploy | Vercel |
| Lang | TypeScript strict |

## Design

Minimalist editorial. Aged-paper palette (`#FAF7F0`/`#1A1A1A`/`#8B6F47`)
and an all-serif type stack: **Cormorant Garamond** (display) +
**Source Serif 4** (latin body) + **Noto Serif SC** (CJK body).
Heavy whitespace, no gradients, near-zero shadow vocabulary, every
clickable element has a `cursor-pointer` and a visible focus ring.

Full design canon (tokens, wireframes, decision log) lives in
[`.omc/plans/lumatale-design-system.md`](.omc/plans/lumatale-design-system.md).

## Reader interactions

- `←` / `→` (or `J` / `K` / `L`) keyboard navigation
- Per-novel reading progress saved to `localStorage` under
  `lumatale.<slug>.scene` and rehydrated on next visit
- Append `?restart=1` to the read URL to reset progress
- Last-page advance triggers an ending takeover (fade + 32px slide)
- **朗读 / 停止** toggle narrates the current scene via the
  Web Speech API (auto-picks a `zh-*` voice when available,
  cancels on scene change)
- **Dark mode** toggle in the top-right corner — respects system
  preference on first load, persisted via `localStorage`, and
  hydrates without theme flash via an inline `<head>` script
- All animations honour `prefers-reduced-motion`

## Run locally

```bash
pnpm install
cp .env.example .env.local   # fill in Supabase URL + anon key
pnpm dev
```

Then in your Supabase project's **SQL Editor**, run the migration and
seed once:

```bash
supabase/migrations/0001_init.sql
supabase/seed.sql
```

(Or paste each file's contents into the SQL Editor and click Run.)

## How AI was used

This project was built collaboratively with **Claude Code (Sonnet)** as
a multi-agent team. The full record lives in the git log — every
commit is `Conventional Commits` + `Co-Authored-By: Claude`. Notable
artefacts:

- `.omc/plans/lumatale-design-system.md` — locked design canon (tokens,
  wireframes, time budget, decision log) produced by a brainstorming +
  ui-ux-pro-max pass before any code was written.
- `.omc/handoffs/team-plan.md` — Next.js 16 conventions reference and
  the 4-worker decomposition shared into every sub-agent's prompt.

The build was decomposed into a staged pipeline coordinated by a
team-lead session:

| Stage | Agents | What |
|---|---|---|
| Plan | analyst, ui-ux-pro-max, designer | Lock product/visual/data/scope decisions |
| Foundation | `worker-foundation` (executor) | Supabase client + types + queries + layout/fonts |
| Design | `worker-design` (designer) | Tailwind v4 tokens + 4 base components |
| Pages | `worker-pages` (executor) | 3 RSC routes |
| Reader | `worker-reader` (executor) | Interactive client component |
| Polish | team-lead | OG image, favicon, README, deploy |

Workers ran in parallel where dependencies allowed (foundation +
design simultaneously; pages + reader simultaneously) and reported back
to the lead via inbox messages. The lead handled all `git` operations
to avoid stage conflicts. Each commit message captures one logical
change.

## Architecture

A layered backend so the database is never touched directly from a
page or component:

```
                              ┌────────────────────────┐
   RSC Pages (app/*/page.tsx) │     External clients   │
                       │      └───────────┬────────────┘
                       │                  │
                       │                  ▼
                       │        ┌─────────────────┐
                       │        │   API Routes    │
                       │        │  (app/api/...)  │
                       │        └────────┬────────┘
                       │                 │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────────┐
                       │   Service layer     │
                       │ (lib/services/*.ts) │  React `cache()`,
                       └──────────┬──────────┘  request-scoped dedup
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │   Repository        │
                       │ (lib/repositories)  │  Pure data access
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │   Supabase client   │
                       │ (lib/supabase)      │  Driver
                       └─────────────────────┘
```

- Pages render via the **service layer** directly — no internal
  HTTP self-roundtrip during build / SSR (faster prerender, fewer
  failure modes).
- The **HTTP API** (`/api/novels`, `/api/novels/[slug]`,
  `/api/novels/[slug]/scenes`) shares the same service so any
  external consumer (mobile app, scraper, third-party reader) sees
  the same contract pages do.
- Only the **repository** ever talks to Supabase. Swap the driver
  (Postgres direct, Drizzle, Prisma) by replacing one file.
- The service layer wraps repo calls in React `cache()` so that
  any single render pass dedups multiple lookups for the same key.

## Architecture decisions

A few choices worth surfacing — full rationale in `.omc/plans/`:

- **Slug URLs (`/novels/midnight-library`)** over numeric IDs — better
  for SEO and OG link previews.
- **RSC + direct Supabase calls** with `cache()` instead of routing
  through `/api/*` Route Handlers — half the surface area.
- **`'use client'` only on `Reader.tsx`**, all other components and
  pages are server-rendered.
- **`localStorage` for progress** rather than syncing to Supabase —
  the challenge has no auth and the story is short.
- **Tailwind v4 `@theme {}`** — no `tailwind.config.ts`, tokens live
  next to the styles they define.
- **No `framer-motion` on `EndingScreen`** — it's a server component
  with an inline keyframe; only `Reader.tsx` (already `'use client'`)
  uses framer-motion.

## What's next (if this were the real platform)

Already shipped from the brief's "multimodal immersive reading":
TTS narration, dark mode, persistent progress, scene transition
animation, typography-driven cover art.

Future:

- Scene-tied ambient music with a global mute control
- Per-scene illustration / character portrait (AI-generated, per
  scene mood)
- A writable last page persisted to an `entries` table — readers
  leave a sentence, see what other readers wrote
- Auth + per-user progress sync (cross-device)
- Scene branching (the seed for true interactive fiction)
- Multiple voice options + reading-speed control for TTS
- i18n for the UI chrome (story content stays in original language)

## License

Personal challenge submission. Story content is the original prompt
from the challenge brief.
