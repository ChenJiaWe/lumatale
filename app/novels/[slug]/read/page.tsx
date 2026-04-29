import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getReadingForNovel, getNovelBySlug } from '@/lib/services/novel-service';
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

  let reading = null;
  try {
    reading = await getReadingForNovel(slug);
  } catch {
    notFound();
  }
  if (!reading) notFound();

  return (
    <Reader
      scenes={reading.scenes}
      novelTitle={reading.novel.title}
      novelSlug={reading.novel.slug}
    />
  );
}
