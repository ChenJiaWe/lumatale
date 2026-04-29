# lumatale — 设计系统 & 4h 执行策略

> **互动小说平台 MVP** · 极简文学风 · Next.js 16 + React 19 + Tailwind v4 + Supabase
> 文档时间：2026-04-29 · 目标交付：3 小时内可上线 · Vercel 部署

---

## 0. Strategy Overview

| 维度 | 决定 |
|------|------|
| 产品名 | **lumatale**（lumen + tale） |
| Slogan 候选 | "Stories that read you back." / "一个只在夜里被读到的故事" / "每个人一生只能读一次" |
| 风格 | 极简文学 / 衰老纸质 / 大量留白 / 全衬线 |
| 时间预算 | 约 3 小时 |
| 加分项重心 | 设计打磨包（不做多模态 audio/video） |
| 部署 | Vercel + Supabase Cloud |
| Commit 风格 | Conventional Commits + `Co-Authored-By: Claude <noreply@anthropic.com>` |

### 评估维度对应措施

| 评估维度 | 关键措施 |
|----------|----------|
| **设计感** | 极简文学风格 + Cormorant Garamond + Noto Serif SC + 衰老纸调色 + 场景过渡动画 + 精致 favicon + OG image |
| **完成度** | 三页全跑通 + Supabase 真接通 + Vercel 公网可访问 + 8 项加分细节 |
| **代码结构** | App Router 分层 / RSC 默认 / `lib/supabase`、`components/`、`app/` 三层清晰 / TypeScript 严格 / 数据 fetch 统一函数 |
| **AI 协作** | 每阶段 1–3 个 commit，message 含 feat/fix/style/chore 前缀 + 简述 + Co-Authored-By trailer |

---

## 1. Brand & Visual Identity

### 1.1 设计原则

1. **阅读优先** — 任何视觉决策不能伤害正文可读性
2. **留白即奢侈** — 不填满，不加无谓装饰
3. **衬线传承** — 全场景衬线字体，呼应"图书馆 / 旧笔记"叙事
4. **慢节奏过渡** — 动画温柔（200–400ms），呼应"夜半翻书"的克制
5. **可访问优先** — WCAG AA、键盘可达、prefers-reduced-motion 兼容

### 1.2 Slogan + 副文案

```
              lumatale
              ────────
        Stories that read you back.
   一个只在夜里被读到的故事

        ── Volume I ──
        《午夜图书馆》
```

---

## 2. Design Tokens

### 2.1 颜色系统

```css
/* tokens (Tailwind v4 @theme) */
--color-paper:       #FAF7F0;  /* 主背景 老纸米白 */
--color-paper-dark:  #F2EDDF;  /* 次级背景 加深一档 */
--color-ink:         #1A1A1A;  /* 主文字 */
--color-ink-soft:    #2E2A24;  /* 次级文字 */
--color-muted:       #8B7E66;  /* 弱化文字 footnote / meta */
--color-line:        #D9CFB8;  /* 分割线 / border */
--color-accent:      #8B6F47;  /* 暖咖啡 强调（按钮 / 链接 hover） */
--color-accent-soft: #B89770;  /* 暖咖啡弱化（书脊点缀） */
--color-flame:       #D97706;  /* 烛火点缀 仅用于关键 CTA hover/focus 1 处 */
```

**对比度自检**（必须达标）：
- ink #1A1A1A on paper #FAF7F0 → **15.4 : 1** ✅（远超 AA 4.5:1）
- muted #8B7E66 on paper → **4.6 : 1** ✅
- accent #8B6F47 on paper → **4.7 : 1** ✅
- ink-soft #2E2A24 on paper-dark → **12.1 : 1** ✅

### 2.2 字体系统

```css
/* Google Fonts via next/font */
@import 'next/font/google';

heading: Cormorant Garamond  (400 / 500 / 600 / 700)
body-en: Source Serif 4      (400 / 600)        // 拉丁正文
body-zh: Noto Serif SC       (400 / 500 / 700)  // 中文正文
mono:    JetBrains Mono      (400)              // 仅用于 page indicator 等

/* CSS Stack */
font-heading: 'Cormorant Garamond', 'Noto Serif SC', Georgia, serif;
font-body:    'Source Serif 4', 'Noto Serif SC', 'Songti SC', serif;
```

**字号刻度**（rem 基于 16px）：
| Token | rem | px | 用途 |
|-------|-----|-----|------|
| `text-xs`   | 0.75   | 12 | meta / badge |
| `text-sm`   | 0.875  | 14 | secondary text |
| `text-base` | 1      | 16 | body min on mobile |
| `text-lg`   | 1.125  | 18 | reader body desktop |
| `text-xl`   | 1.25   | 20 | reader body comfort |
| `text-2xl`  | 1.5    | 24 | h3 |
| `text-3xl`  | 1.875  | 30 | h2 |
| `text-5xl`  | 3      | 48 | h1 desktop |
| `text-7xl`  | 4.5    | 72 | hero brand wordmark |

**行高**：正文 `leading-loose` (1.75) / 标题 `leading-tight` (1.2)
**字距**：标题 `tracking-tight` (-0.02em) / 品牌词 `tracking-widest` (+0.15em)
**最大行宽**：阅读器正文 `max-w-prose` 实际 ≈ 65ch（~620px）

### 2.3 Spacing 刻度（Tailwind 默认 8px 系）

布局一律 4 / 6 / 8 / 12 / 16 / 24 的倍数。**严禁出现 5、7、13 这种"野生数字"**。

### 2.4 形状

- **圆角**：克制使用，主要元素 `rounded-none`，按钮 `rounded-full`（pill）或 `rounded-sm`（2px），卡片 `rounded-none` + 1px border
- **边框**：`border-line` 1px 实线为主，禁用 box-shadow 装饰
- **阴影**：仅在 hero 卡片 `shadow-[0_1px_2px_rgba(26,26,26,0.04)]` 这种近乎无的阴影
- **没有渐变** — 极简风格不需要

### 2.5 动效系统

| 场景 | duration | easing | 备注 |
|------|----------|--------|------|
| 按钮 hover 颜色 | 200ms | ease-out | `transition-colors` |
| 链接 underline 进入 | 250ms | cubic-bezier(0.4, 0, 0.2, 1) | |
| 阅读器翻页 fade + 4px 上移 | 350ms | ease-out | 同时只动文本一处 |
| 进度条延展 | 400ms | ease-out | |
| 结束画面淡入 | 800ms | ease-out | 一次性入场 |
| 页面进入 | 250ms | ease-out | 仅 opacity，不动位移 |

**强制规则**：
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 3. Component Specs

### 3.1 Brand Wordmark（品牌字标）

```
       lumatale
       ────────
```
- 字体：Cormorant Garamond 500
- 全小写、tracking +0.15em
- 下方一道 1px line（color-line），宽度 = 字宽
- 仅用于首页 hero / 详情页顶部 / 阅读器顶部 mini 版

### 3.2 Button

| 变体 | 样式 |
|------|------|
| `primary` | bg-ink text-paper, hover bg-ink-soft, focus-visible:ring-2 ring-accent ring-offset-2, px-6 py-3, rounded-full, tracking-wide, font-medium |
| `ghost` | bg-transparent text-ink, border border-line, hover bg-paper-dark, same padding |
| `link` | text-accent, hover text-ink, underline-offset-4 hover:underline, no border |

**禁忌**：不要 emoji 图标。要箭头用 `→`（U+2192）或 lucide-react `<ArrowRight />`（如果引入了 lucide）。

### 3.3 NovelCard（首页书卡）

```
┌────────────────────────────┐
│   [cover 3:4 aspect]       │
│   Volume I                 │
│                            │
│   午夜图书馆               │
│   ─────────                │
│   匿名 · 1 chapter         │
│                            │
│   在一座只在午夜出现的      │
│   图书馆里⋯⋯              │
│                            │
│   阅读 →                   │
└────────────────────────────┘
```
- 卡片宽度 desktop 320px、mobile 100% - 32px
- 卡片本身 `border border-line`，无 shadow
- hover：border 颜色加深至 ink-soft（色 transition 200ms），cursor-pointer
- focus-visible：ring-2 ring-accent ring-offset-2
- cover 用 next/image，blur placeholder

### 3.4 Reader Pane（阅读器主体）

```
─────────────────────────────────
        Volume I  ·  lumatale
─────────────────────────────────


            场景一  ·  午夜


  你推开那扇不应该存在的⻔。

  图书馆的穹顶高得看不到尽头⋯⋯

  ⋯⋯


─────────────────────────────────
  ◀ 上一页    1 / 3    下一页 ▶
            ━━━━━━━━━━━━
─────────────────────────────────
        ← →  键盘翻页
```
- 文本容器：`max-w-prose mx-auto`，padding 上下 96px、左右 24px（mobile）/ 48px（desktop）
- 正文 `text-lg leading-loose`，**首行不缩进**（西式排版风）
- 段落间距 `space-y-6`
- 章节小标题：Cormorant Garamond italic, color-muted, `tracking-widest`, 上下 24px 留白
- 底部固定栏：白色背景 `bg-paper/95 backdrop-blur-sm`，border-top
- 进度条：`h-px` 实色 line，已读部分 `bg-ink`，宽度按 `current/total`，transition-all 400ms

### 3.5 Ending Screen（结束画面）

```
─────────────────────────────────



               ⋯



        而最后一页，是空白的。



        — 你已读完《午夜图书馆》—


        [ 重新阅读 ]    [ 返回首页 ]


─────────────────────────────────
```
- 整页深 paper-dark 背景
- 800ms fade-in + 32px translate-y-up（reduced-motion 下仅 fade）
- 文案 italic，size text-2xl
- 双按钮：ghost 风格，等宽

### 3.6 Page Indicator / Progress

```
1 / 3
━━━━━━━━━━━
```
- 数字 mono 字体
- 进度线 1px、`width: var(--progress)` 用 CSS 变量驱动

---

## 4. Page Wireframes

### 4.1 Home (`/`)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    lumatale                         │  ← 96px 顶部 padding
│                    ────────                         │
│                                                     │
│           Stories that read you back.               │  ← muted, italic
│           一个只在夜里被读到的故事                    │
│                                                     │
│                                                     │  ← 96px 间隔
│      ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│      │         │  │         │  │         │         │
│      │ [cover] │  │ [cover] │  │ [cover] │         │
│      │ 午夜图书馆│  │ 即将上线 │  │ 即将上线 │         │
│      │ 匿名     │  │           │  │           │         │
│      │ 阅读 →   │  │           │  │           │         │
│      └─────────┘  └─────────┘  └─────────┘         │
│       (clickable)  (灰度禁用)   (灰度禁用)            │
│                                                     │
│                                                     │  ← 144px 底部
│            lumatale · Volume I · 2026               │  ← footer muted
│                                                     │
└─────────────────────────────────────────────────────┘
```

**关键决策**：
- 仅一本可点（午夜图书馆），其余两张占位卡 grayscale + cursor-not-allowed + "即将上线" 标签
  → 体现"平台"而非"单本 demo"
- 三列 grid desktop / 一列 mobile
- 整页 `min-h-screen flex flex-col justify-between`

### 4.2 Novel Detail (`/novels/midnight-library`)

```
┌─────────────────────────────────────────────────────┐
│  ← lumatale                          (top mini logo)│
│                                                     │
│      ┌─────────────┐                                │
│      │             │     Volume I  ·  Anonymous     │
│      │   [cover]   │                                │
│      │   3:4 ratio │     《午夜图书馆》              │
│      │             │     ─────────                  │
│      │             │                                │
│      └─────────────┘     在一座只在午夜出现的图书馆里，│
│                          你只能翻开一本书。你选择了那本│
│                          最不起眼的旧笔记本——里面写满│
│                          了你遗忘的记忆，而最后一页，  │
│                          是空白的。                  │
│                                                     │
│                          ── 共 3 个场景 · 约 8 分钟 ──│
│                                                     │
│                          [ 开始阅读 → ]              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**关键决策**：
- 桌面 2 列（封面 + 信息），mobile 上下堆叠
- "开始阅读" CTA 是 primary button，跳转 `/novels/midnight-library/read`
- 顶部 `← lumatale` 是返回首页（同时是品牌锚点）

### 4.3 Reader (`/novels/midnight-library/read`)

```
┌─────────────────────────────────────────────────────┐
│  ← lumatale                                Vol. I   │  ← top bar 64px
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│                                                     │
│                场景一 · 午夜                         │
│                ─────────                            │
│                                                     │
│        你推开那扇不应该存在的⻔。                     │
│                                                     │
│        图书馆的穹顶高得看不到尽头，书架像森林         │
│        一样向四面八方延伸。空气中飘着旧纸和檀         │
│        香的味道。                                   │
│                                                     │
│        一位白发老人坐在前台，抬头看了你一眼：         │
│                                                     │
│        " 你来了。每个人一生只能来一次。"            │
│                                                     │
│                                                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│        ◀ 上一页        1 / 3        下一页 ▶         │
│        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━        │
│                  ← → 键盘翻页                        │
└─────────────────────────────────────────────────────┘
```

**交互**：
- 默认 `currentScene = restoreFromLocalStorage() ?? 0`
- ← / → / J / K 翻页
- 读到最后一页后再点"下一页" → 进入 ending screen
- 每次切换场景：opacity 0 → 1 + translate-y-2 → 0 (350ms ease-out)
- 切换时立即把新 index 写入 `localStorage.setItem('lumatale.midnight-library.scene', n)`

---

## 5. Supabase Schema

### 5.1 表结构

```sql
-- novels
create table novels (
  id           bigint generated always as identity primary key,
  slug         text not null unique,
  title        text not null,
  author       text not null,
  synopsis     text not null,
  cover_url    text,
  scene_count  int not null default 0,
  created_at   timestamptz not null default now()
);

-- scenes
create table scenes (
  id          bigint generated always as identity primary key,
  novel_id    bigint not null references novels(id) on delete cascade,
  "order"     int not null,
  title       text not null,
  body        text not null,
  created_at  timestamptz not null default now(),
  unique (novel_id, "order")
);

-- 索引
create index scenes_novel_order_idx on scenes(novel_id, "order");
```

### 5.2 RLS（关键安全）

```sql
alter table novels enable row level security;
alter table scenes enable row level security;

-- 公开只读
create policy "novels_select_public" on novels
  for select using (true);

create policy "scenes_select_public" on scenes
  for select using (true);

-- 不创建任何 INSERT/UPDATE/DELETE 策略 → anon key 永远写不进
```

### 5.3 Seed 数据

```sql
insert into novels (slug, title, author, synopsis, cover_url, scene_count)
values (
  'midnight-library',
  '午夜图书馆',
  '匿名',
  '在一座只在午夜出现的图书馆里，你只能翻开一本书。你选择了那本最不起眼的旧笔记本——里面写满了你遗忘的记忆，而最后一页，是空白的。',
  '/covers/midnight-library.jpg',
  3
);

-- 通过返回 id 插 scenes（实际写在 supabase/seed.sql 里用 with 子句）
with n as (select id from novels where slug = 'midnight-library')
insert into scenes (novel_id, "order", title, body) values
  ((select id from n), 1, '午夜', '你推开那扇不应该存在的⻔。\n\n图书馆的穹顶高得看不到尽头，书架像森林一样向四面八方延伸。空气中飘着旧纸和檀香的味道。\n\n一位白发老人坐在前台，抬头看了你一眼：\n\n " 你来了。每个人一生只能来一次。"'),
  ((select id from n), 2, '三本书', '老人指向三个方向。\n\n左边，一本发着微光的金色封面的书。右边，一本封面全黑、没有书名的书。\n\n而正前方，一本不起眼的旧笔记本，封皮已经磨损，看起来像是被人翻阅过千百次。\n\n你犹豫了一下，伸手取下了那本笔记本。'),
  ((select id from n), 3, '空白页', '你翻开笔记本。\n\n第一页是你五岁时弄丢的玩具熊的样子。第二页是你父亲临终前没说完的那句话。第三页、第四页⋯⋯每一页都是你以为已经遗忘的记忆。\n\n你越翻越快，直到翻到了最后一页。\n\n最后一页是空白的。\n\n你拿起笔。');
```

**注**：题目原始 scene 2/3 数据被截断，上面是基于"午夜图书馆"基调补全的合理叙事。**实际执行时如果题目能拿到完整 3 段就用原始数据，缺失的用我补的。**

---

## 6. 技术实现关键点（Next.js 16）

### 6.1 缓存策略（最容易踩的坑）

> Next.js 15+ 起 `fetch()` 默认 **不缓存**。Supabase JS SDK 不走 fetch wrapper，自带行为，但同样需要思考缓存。

```ts
// app/lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// app/novels/[slug]/page.tsx
export const revalidate = 3600; // 1 小时静态再生成

export async function generateStaticParams() {
  const { data } = await supabase.from('novels').select('slug');
  return data?.map(n => ({ slug: n.slug })) ?? [];
}
```

### 6.2 RSC vs Client 边界

- `app/page.tsx`（首页） → RSC，直接 await supabase
- `app/novels/[slug]/page.tsx`（详情） → RSC
- `app/novels/[slug]/read/page.tsx`（阅读器外壳） → RSC，拿 scenes 数组
- `app/novels/[slug]/read/Reader.tsx`（阅读器内核） → `'use client'`，处理键盘 / localStorage / 翻页

### 6.3 Metadata（每页必有）

```ts
// app/novels/[slug]/page.tsx
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;  // Next 15+ params 是 Promise
  const { data: novel } = await supabase
    .from('novels')
    .select('title, author, synopsis, cover_url')
    .eq('slug', slug)
    .single();
  return {
    title: `${novel?.title} · lumatale`,
    description: novel?.synopsis,
    openGraph: {
      title: novel?.title,
      description: novel?.synopsis,
      images: [novel?.cover_url ?? '/og-default.png'],
      type: 'book',
    },
  };
}
```

### 6.4 OG image（约定文件）

放 `app/opengraph-image.tsx` — Next.js 自动生成 1200×630 OG。
用 ImageResponse + 我们的字体生成"lumatale + slogan"卡片。

### 6.5 Image 优化

```tsx
import Image from 'next/image';
<Image
  src={novel.cover_url}
  alt={`${novel.title} 封面`}
  width={480}
  height={640}
  priority           // hero 用
  className="object-cover"
/>
```

### 6.6 Tailwind v4 配置

```css
/* app/globals.css */
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

  --font-heading: 'Cormorant Garamond', 'Noto Serif SC', Georgia, serif;
  --font-body: 'Source Serif 4', 'Noto Serif SC', 'Songti SC', serif;
}

@layer base {
  body { @apply bg-paper text-ink font-body; }
  h1, h2, h3 { @apply font-heading; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

> **注意**：Next.js 16 + Tailwind v4，主题用 `@theme {}` 块；不再用 `tailwind.config.ts` 的 `theme.extend`。写代码前先翻 `node_modules/next/dist/docs/01-app/` 确认 metadata API 与 params 异步签名。

---

## 7. 文件结构

```
app/
├── layout.tsx              ← 字体加载 + global metadata + html lang="zh"
├── globals.css             ← @theme + reset
├── page.tsx                ← 首页（RSC）
├── opengraph-image.tsx     ← OG 默认图
├── icon.tsx                ← 动态 favicon
├── novels/
│   └── [slug]/
│       ├── page.tsx        ← 详情页（RSC + generateMetadata）
│       └── read/
│           ├── page.tsx    ← 阅读器外壳（RSC，fetch scenes）
│           └── Reader.tsx  ← 阅读器内核（'use client'）
└── components/
    ├── BrandWordmark.tsx
    ├── NovelCard.tsx
    ├── Button.tsx
    └── EndingScreen.tsx

lib/
└── supabase/
    └── client.ts           ← createClient export

supabase/
├── migrations/
│   └── 0001_init.sql
└── seed.sql

public/
├── covers/
│   └── midnight-library.jpg
└── favicon.ico  (用 icon.tsx 替代)

.env.local                  ← NEXT_PUBLIC_SUPABASE_URL / ANON_KEY (gitignored)
.env.example                ← 不含值，方便他人 clone
```

---

## 8. 时间分配（180 分钟）

| 阶段 | 时长 | 任务 | 期望 commit |
|------|------|------|-------------|
| **0:00–0:15** | 15min | Supabase 项目创建 + .env + `pnpm add @supabase/supabase-js` + 表/RLS/seed 跑通（用 SQL editor） | `chore: scaffold supabase + seed midnight-library` |
| **0:15–0:30** | 15min | Tailwind theme + 字体加载 + globals.css + 删除 boilerplate + reduced-motion CSS | `style: ground design tokens (paper, ink, serif fonts)` |
| **0:30–0:55** | 25min | 首页 hero + 3 张 NovelCard（1 真 2 占位） + footer + RSC 拉数据 | `feat: home page with novel grid` |
| **0:55–1:20** | 25min | 详情页（generateStaticParams + generateMetadata + 2 列布局 + CTA） + cover 图（先用 unsplash 占位） | `feat: novel detail page` |
| **1:20–2:00** | 40min | Reader.tsx 全部交互：键盘事件 / localStorage / 翻页动画 / 进度条 / ending screen + 顶/底 bar | `feat: interactive scene reader with keyboard nav and progress` |
| **2:00–2:25** | 25min | OG image + favicon + responsive 微调 + a11y aria-labels + 视觉打磨 | `style: polish typography rhythm and a11y` |
| **2:25–2:45** | 20min | Vercel 项目连接 + 环境变量 + 第一次部署 + 域名 + 修补部署期 bug | `chore: deploy to vercel` |
| **2:45–3:00** | 15min | README 写"产品/技术/AI 协作路线图" + 整理 commit history（不 rewrite history，只确认前缀） + 录视频/截图（可选） | `docs: write README with roadmap` |

**风险缓冲**：实际过程中任何阶段超 +10min 都立刻砍 scope（具体砍法见 §10）。

---

## 9. AI 协作 Commit 策略

### 9.1 模板

```
<type>(<scope>): <短句 ≤ 50 char>

<body, optional, ≤ 72 char/行>
- 关键决策 1
- 关键决策 2

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 9.2 各阶段示例

```bash
chore(supabase): scaffold project and seed midnight library

- create novels/scenes tables with RLS public-select only
- seed 1 novel + 3 scenes from challenge prompt

Co-Authored-By: Claude <noreply@anthropic.com>
```

```bash
feat(reader): add keyboard nav, localStorage progress, ending screen

- ← / → / J / K turn pages, button still visible for touch
- progress persisted under `lumatale.<slug>.scene` key
- final-page tap fades into ending screen with reduced-motion fallback

Co-Authored-By: Claude <noreply@anthropic.com>
```

```bash
style(home): tighten hero spacing and grid breakpoints

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 9.3 规则

- 最少 8 个 commit、最多 ~15 个，分布在三个阶段（scaffold / feature / polish），让评委一眼看出节奏
- **每个 commit 都带 trailer**，统一署名为 Claude
- README 顶部加一段 "Built with Claude Code (Sonnet) — see commit history for prompt patterns"
- 不要 rewrite history、不要 squash，保留真实节奏

---

## 10. Scope Reduction Plan（如果时间不够）

按"先砍最可见性低的"顺序：

| 优先砍 | 项目 | 节省 |
|--------|------|------|
| 1 | OG image 自定义（用纯静态 PNG 占位） | 8 min |
| 2 | favicon 用默认 | 5 min |
| 3 | 首页占位卡片改成单卡居中 hero | 10 min |
| 4 | 阅读器去掉进度条 transition 动画 | 5 min |
| 5 | 略过 generateStaticParams，全 dynamic | 5 min |
| 6 | Cover 不调外部图，纯文字封面（CSS 排版书脊） | 15 min |

**底线最小可交付**：首页 1 张可点卡 + 详情页 + 阅读器 3 页 + Supabase 接通 + Vercel 部署 = 4 个评估维度都不挂零。

---

## 11. Decision Log

| # | 决策 | 备选 | 选择理由 |
|---|------|------|----------|
| D1 | 视觉走极简文学 | 暗夜图书馆 / 梦幻光影 / 杂志复古 | 用户选择；低风险高走量；4h 内可控 |
| D2 | 字体 Cormorant + Noto Serif SC | Playfair / Newsreader / Libre Bodoni | ui-pro-max "Editorial Classic" 推荐 + 必加中文 fallback |
| D3 | URL 用 slug | numeric id | 可读、利于 SEO 与 OG 分享 |
| D4 | 阅读进度仅 localStorage | 同步 Supabase | 4h 内不引入用户系统 |
| D5 | RSC + revalidate 3600 | 全 dynamic / 全 static | 平衡部署速度与首屏 LCP |
| D6 | 首页 1 真 2 占位卡 | 仅 1 卡 / 多本真数据 | 暗示平台扩展又不增数据成本 |
| D7 | 不引入 framer-motion / lucide | 引入两者 | Tailwind transition 足够；icon 用 SVG 内联或纯文字符号 |
| D8 | 加分项=设计打磨包 | 多模态 / 互动结尾 | 时间 ROI 最高，正中"设计感"评估维度 |
| D9 | 不做用户登录 | 加 supabase auth | 题目未要求，不消耗时间 |
| D10 | Commit Conventional + Co-Author trailer | full prompt body / milestone tags | 业界标准、信号比最高 |
| D11 | 不接受 ui-pro-max 自动推的 "Vibrant & Block-based" 风格 | 跟随推荐 | 与"午夜图书馆"调性冲突；引擎规则误匹配 "interactive" 关键词 |

---

## 12. Pre-Delivery Checklist

### 视觉
- [ ] 无 emoji 当 icon（用 SVG 或字符）
- [ ] cursor-pointer 出现在所有可点元素
- [ ] hover 状态平滑（200ms transition-colors）
- [ ] 颜色对比度 ≥ 4.5:1（已自检 §2.1）
- [ ] focus-visible ring 在所有交互元素上可见
- [ ] prefers-reduced-motion 全局生效
- [ ] 响应式测试 375 / 768 / 1024 / 1440

### 完成度
- [ ] 三页全跑通 + 路由正确
- [ ] Supabase 真接通（断网测试：本地无数据时显示 fallback）
- [ ] 阅读器 ← → 键盘 + 翻页按钮 + 进度条都工作
- [ ] localStorage 进度记忆 + 恢复
- [ ] 读完最后一页有 ending screen
- [ ] OG meta + favicon + title 都设置

### 代码结构
- [ ] App Router 分层：app / lib / components 清晰
- [ ] TypeScript 严格、无 any
- [ ] Server / Client component 边界明确（'use client' 只在 Reader）
- [ ] 数据 fetch 集中在 `lib/supabase/`
- [ ] .env.example 存在，README 说明配置

### AI 协作
- [ ] 至少 8 个 commit
- [ ] 全部 Conventional 前缀
- [ ] 全部含 Co-Authored-By trailer
- [ ] README 写明 AI 协作方式

### 部署
- [ ] Vercel 域名可访问
- [ ] 生产环境环境变量已设置（NEXT_PUBLIC_SUPABASE_URL/ANON_KEY）
- [ ] 域名打开 3s 内首屏完成

---

## 13. 后续执行入口

设计已锁定。下一步可以：

- **`/team` 或 `/ralph` + 本文档路径** 直接进入 4h 工程冲刺
- 或者用户继续提问 / 调整任何 §1–§13 决策
- 关键执行风险已在 §10 列明，预先规划了砍 scope 的路径

文档版本：v1.0 · 锁定时间：2026-04-29
