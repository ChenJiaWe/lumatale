import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllNovels, getNovelBySlug } from '@/lib/db/queries';
import BrandWordmark from '@/app/components/BrandWordmark';
import Button from '@/app/components/Button';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const novels = await getAllNovels();
    if (novels.length > 0) {
      return novels.map((n) => ({ slug: n.slug }));
    }
  } catch {
    // DB not seeded
  }
  return [{ slug: 'midnight-library' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const novel = await getNovelBySlug(slug);
    if (!novel) return { title: '未找到 · lumatale' };
    return {
      title: `${novel.title} · lumatale`,
      description: novel.synopsis,
      openGraph: {
        title: novel.title,
        description: novel.synopsis,
        type: 'book',
      },
    };
  } catch {
    return { title: 'lumatale' };
  }
}

export default async function NovelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let novel = null;
  try {
    novel = await getNovelBySlug(slug);
  } catch {
    notFound();
  }
  if (!novel) notFound();

  const readingTime = Math.max(1, Math.round((novel.scene_count * 8) / 3));

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      {/* Top bar */}
      <header className="flex items-center px-6 py-5 border-b border-line">
        <BrandWordmark size="mini" href="/" />
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-16">
        <div className="w-full max-w-4xl flex flex-col md:flex-row gap-12 md:gap-16">
          {/* Cover */}
          <div className="flex-shrink-0 w-full max-w-xs mx-auto md:mx-0">
            <div className="relative w-full border border-line" style={{ aspectRatio: '3 / 4' }}>
              {novel.cover_url ? (
                <Image
                  src={novel.cover_url}
                  alt={`${novel.title} 封面`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) calc(100vw - 32px), 320px"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-paper-dark"
                  aria-hidden="true"
                >
                  <span
                    className="text-muted text-sm tracking-widest"
                    style={{ fontFamily: 'var(--font-heading)', writingMode: 'vertical-rl' }}
                  >
                    {novel.title}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 flex-1">
            <div className="text-muted text-xs tracking-widest uppercase">
              Volume I &middot; {novel.author}
            </div>

            <div>
              <h1
                className="text-3xl md:text-5xl leading-tight tracking-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {novel.title}
              </h1>
              <div className="mt-3 h-px bg-line" aria-hidden="true" />
            </div>

            <p className="text-ink-soft text-base leading-loose">{novel.synopsis}</p>

            <p className="text-muted text-sm tracking-widest">
              &mdash; 共 {novel.scene_count} 个场景 &middot; 约 {readingTime} 分钟 &mdash;
            </p>

            <div className="mt-2">
              <Button variant="primary" href={`/novels/${novel.slug}/read`}>
                开始阅读 &rarr;
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-muted text-xs tracking-widest border-t border-line">
        lumatale &middot; Volume I &middot; 2026
      </footer>
    </div>
  );
}
