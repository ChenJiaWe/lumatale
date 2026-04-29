import type { MetadataRoute } from 'next';
import { listNovels } from '@/lib/services/novel-service';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lumatale.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let novels: { slug: string }[] = [];
  try {
    novels = await listNovels();
  } catch {
    novels = [];
  }
  const novelEntries = novels.flatMap((n) => [
    { url: `${SITE}/novels/${n.slug}`, lastModified: now, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${SITE}/novels/${n.slug}/read`, lastModified: now, priority: 0.7, changeFrequency: 'weekly' as const },
  ]);
  return [
    { url: SITE, lastModified: now, priority: 1.0, changeFrequency: 'weekly' },
    ...novelEntries,
  ];
}
