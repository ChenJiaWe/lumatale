# Handoff: team-plan → team-exec

## Decided
- **Stack locked**: Next.js 16.2.4 + React 19.2.4 + Tailwind v4 + @supabase/supabase-js (installed). pnpm. App Router.
- **4-worker parallel decomposition** (see Files for owner assignment).
- **Style**: 极简文学 (paper #FAF7F0 / ink #1A1A1A / accent #8B6F47). Fonts via `next/font/google`: Cormorant Garamond (heading) + Source Serif 4 (body-en) + Noto Serif SC (body-zh).
- **Routing**: `/` (home) → `/novels/[slug]` (detail) → `/novels/[slug]/read` (reader). Slug-based, not numeric id.
- **Data layer**: lib/supabase/client.ts (createClient with anon key) + lib/db/queries.ts (typed query functions wrapped in React `cache()` for request-scoped dedup).
- **Reader is the only `'use client'`**. All pages are RSC.
- **revalidate = 3600 on detail/read pages**, force-static on home (data is essentially seed).

## Rejected
- **Numeric IDs in URLs** — slugs win for SEO + sharing.
- **API Route Handlers wrapping Supabase** — RSC direct query is shorter and cacheable.
- **localStorage progress synced to Supabase** — out of scope for 4h challenge.
- **framer-motion / lucide-react / shadcn** — vanilla Tailwind transitions and inline SVG/text symbols are enough.
- **Tailwind v3 config (`tailwind.config.ts`)** — Tailwind v4 uses `@theme {}` in CSS.

## Risks
- **User must manually apply `supabase/migrations/0001_init.sql` + `seed.sql` in Supabase SQL Editor** before pages can render data. Lead will surface this to the user explicitly.
- **Next.js 16 `params: Promise<...>`** — workers must `await params` in async pages and in `generateMetadata`. Stale training data could write the synchronous v14 form.
- **fetch default = uncached** in Next 15+. We're not using fetch (Supabase SDK), so this is moot, but if any worker reaches for fetch, they must set `cache: 'force-cache'` or rely on `unstable_cache`.
- **No `tailwind.config.ts`** — Tailwind v4 reads `@theme {}` directly. Workers must NOT create that file.
- **Worker-pages ↔ worker-design coupling** — pages import components from `@/app/components/*`. Workers agree on component names (BrandWordmark / Button / NovelCard / EndingScreen) up front.

## Files

### Already written by lead (workers MUST NOT overwrite)
- `.env.local` (Supabase URL + anon key)
- `.env.example`
- `supabase/migrations/0001_init.sql` (schema + RLS)
- `supabase/seed.sql` (1 novel, 3 scenes)
- `.omc/plans/lumatale-design-system.md` (design canon)
- This handoff doc

### Worker assignment
| Worker | Files | Blocks | BlockedBy |
|--------|-------|--------|-----------|
| **worker-foundation** | `lib/supabase/client.ts`, `lib/db/queries.ts`, `types/db.ts`, rewrite `app/layout.tsx` | worker-pages, worker-reader | none |
| **worker-design** | `app/globals.css`, `app/components/BrandWordmark.tsx`, `app/components/Button.tsx`, `app/components/NovelCard.tsx`, `app/components/EndingScreen.tsx` | worker-pages | none |
| **worker-pages** | `app/page.tsx` (rewrite), `app/novels/[slug]/page.tsx`, `app/novels/[slug]/read/page.tsx` | worker-reader | worker-foundation, worker-design |
| **worker-reader** | `app/novels/[slug]/read/Reader.tsx` | (lead deploy) | worker-pages |

## Next.js 16 Code Patterns (canonical reference)

### A. Async params in dynamic page
```tsx
// app/novels/[slug]/page.tsx
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

### B. generateMetadata with async params
```tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const novel = await getNovelBySlug(slug);
  if (!novel) return { title: '未找到' };
  return {
    title: `${novel.title} · lumatale`,
    description: novel.synopsis,
    openGraph: {
      title: novel.title,
      description: novel.synopsis,
      type: 'book',
    },
  };
}
```

### C. generateStaticParams
```tsx
export async function generateStaticParams() {
  const novels = await getAllNovels();
  return novels.map((n) => ({ slug: n.slug }));
}
```

### D. React cache() wrapping non-fetch async (Supabase)
```ts
// lib/db/queries.ts
import { cache } from 'react';
import { supabase } from '@/lib/supabase/client';

export const getAllNovels = cache(async () => {
  const { data, error } = await supabase.from('novels').select('*').order('created_at');
  if (error) throw error;
  return data;
});
```

### E. Server Component default; only `'use client'` where needed
```tsx
// app/novels/[slug]/read/Reader.tsx
'use client';
import { useState, useEffect } from 'react';
// keyboard nav, localStorage, etc.
```

### F. next/font/google (in app/layout.tsx)
```tsx
import { Cormorant_Garamond, Source_Serif_4, Noto_Serif_SC } from 'next/font/google';
const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', weight: ['400','500','600','700'] });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif', weight: ['400','600'] });
const notoSerif = Noto_Serif_SC({ subsets: ['latin'], variable: '--font-noto-serif', weight: ['400','500','700'], preload: false });
// apply on <html className={`${cormorant.variable} ${sourceSerif.variable} ${notoSerif.variable}`}>
```

> **Note**: `Noto_Serif_SC` may not have `subsets: ['latin']` since it's CJK. Use `preload: false` to avoid build complaints; let it lazy-load. If the Google Font name in `next/font` differs (it should be `Noto_Serif_SC`), search node_modules/next docs to confirm.

### G. Tailwind v4 globals.css (NO config file)
```css
@import "tailwindcss";

@theme {
  --color-paper: #FAF7F0;
  --color-paper-dark: #F2EDDF;
  --color-ink: #1A1A1A;
  --color-ink-soft: #2E2A24;
  --color-muted: #8B7E66;
  --color-line: #D9CFB8;
  --color-accent: #8B6F47;
  --color-flame: #D97706;

  --font-heading: var(--font-cormorant), 'Noto Serif SC', Georgia, serif;
  --font-body: var(--font-source-serif), 'Noto Serif SC', 'Songti SC', serif;
}

@layer base {
  body { @apply bg-paper text-ink; font-family: var(--font-body); }
  h1, h2, h3 { font-family: var(--font-heading); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### H. opengraph-image.tsx (file convention; lead handles post-team)
File `app/opengraph-image.tsx` exports default `Image` via `ImageResponse` — auto-served at `/opengraph-image`. Lead will write last.

## Database Contract (workers depend on this)

```ts
// types/db.ts
export type Novel = {
  id: number;
  slug: string;
  title: string;
  author: string;
  synopsis: string;
  cover_url: string | null;
  scene_count: number;
  created_at: string;
};

export type Scene = {
  id: number;
  novel_id: number;
  order: number;
  title: string;
  body: string;
  created_at: string;
};
```

## Git protocol
- **Workers DO NOT run `git` commands.** They only edit files. The lead commits all worker output at milestone boundaries.
- Lead commits use **Conventional Commits** prefix (`feat:`, `style:`, `chore:`, `docs:`, `fix:`, `refactor:`) + body explaining what + why, ending with `Co-Authored-By: Claude <noreply@anthropic.com>`.
- Workers MUST report completion via SendMessage to `team-lead` so lead knows when to commit.

## Remaining (lead handles after team-exec passes)
- `app/opengraph-image.tsx` (or static `public/og.png`)
- `app/icon.tsx` (or `public/favicon.ico`)
- README with AI-collab roadmap
- Vercel deploy + env vars
- a11y self-check (manual tab-through)
- Final commit + push
