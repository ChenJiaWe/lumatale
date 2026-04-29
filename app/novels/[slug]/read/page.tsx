import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNovelBySlug, getScenesForNovel } from '@/lib/db/queries';
import Reader from './Reader';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const novel = await getNovelBySlug(slug);
    if (!novel) return { title: '阅读 · lumatale' };
    return {
      title: `阅读《${novel.title}》· lumatale`,
      description: novel.synopsis,
    };
  } catch {
    return { title: 'lumatale' };
  }
}

export default async function ReadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let novel = null;
  let scenes = [];
  try {
    novel = await getNovelBySlug(slug);
    if (!novel) notFound();
    scenes = await getScenesForNovel(novel.id);
  } catch {
    notFound();
  }
  if (!novel) notFound();

  return (
    <Reader
      scenes={scenes}
      novelTitle={novel.title}
      novelSlug={novel.slug}
    />
  );
}
