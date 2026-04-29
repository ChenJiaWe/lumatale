import type { Metadata } from 'next';
import type { Novel } from '@/types/db';
import { listNovels } from '@/lib/services/novel-service';
import BrandWordmark from '@/app/components/BrandWordmark';
import NovelCard from '@/app/components/NovelCard';

export const metadata: Metadata = {
  title: 'lumatale — Stories that read you back.',
  description: '一个只在夜里被读到的故事',
};

const placeholders: Novel[] = [
  {
    id: -1,
    slug: 'inkletter',
    title: '墨色信笺',
    author: '即将上线',
    synopsis: '一封无法寄出的信，跨越了三十年。',
    cover_url: null,
    scene_count: 0,
    created_at: '',
  },
  {
    id: -2,
    slug: 'wanderer',
    title: '无名旅人',
    author: '即将上线',
    synopsis: '当你忘记了自己是谁，地图就开始反向折叠。',
    cover_url: null,
    scene_count: 0,
    created_at: '',
  },
];

export default async function HomePage() {
  let novels: Novel[] = [];
  try {
    novels = await listNovels();
  } catch {
    // DB not seeded yet — fall through to show placeholders only
  }

  const featured = novels[0] ?? null;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-paper">
      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-4 pt-24 pb-16">
        <div className="flex flex-col items-center gap-4 mb-24">
          <BrandWordmark size="hero" href="/" />
          <p className="text-muted italic text-base text-center leading-relaxed">
            Stories that read you back.
          </p>
          <p className="text-muted text-sm text-center leading-relaxed">
            一个只在夜里被读到的故事
          </p>
        </div>

        {novels.length === 0 && (
          <p className="text-muted text-xs tracking-widest mb-8 text-center">数据加载中</p>
        )}

        {/* Novel grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
          role="list"
          aria-label="小说列表"
        >
          {featured && (
            <div role="listitem">
              <NovelCard novel={featured} />
            </div>
          )}
          {placeholders.map((p) => (
            <div key={p.id} role="listitem">
              <NovelCard novel={p} disabled />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-muted text-xs tracking-widest border-t border-line">
        lumatale &middot; Volume I &middot; 2026
      </footer>
    </div>
  );
}
