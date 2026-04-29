import 'server-only';
import { cache } from 'react';
import * as repo from '@/lib/repositories/novel-repository';
import type { Novel, Scene } from '@/types/db';

export type NovelReading = {
  novel: Novel;
  scenes: Scene[];
};

export const listNovels = cache(async (): Promise<Novel[]> => {
  return repo.findAllNovels();
});

export const getNovelBySlug = cache(async (slug: string): Promise<Novel | null> => {
  return repo.findNovelBySlug(slug);
});

export const getReadingForNovel = cache(async (slug: string): Promise<NovelReading | null> => {
  const novel = await repo.findNovelBySlug(slug);
  if (!novel) return null;
  const scenes = await repo.findScenesByNovelId(novel.id);
  return { novel, scenes };
});
