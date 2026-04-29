import 'server-only';
import { cache } from 'react';
import * as repo from '@/lib/repositories/novel-repository';
import type { Novel, Scene } from '@/types/db';
import { SlugSchema } from '@/lib/validation/schemas';
import { ValidationError } from '@/lib/errors';

export type NovelReading = {
  novel: Novel;
  scenes: Scene[];
};

function parseSlug(input: string): string {
  const result = SlugSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(result.error.issues[0]?.message ?? 'invalid slug');
  }
  return result.data;
}

export const listNovels = cache(async (): Promise<Novel[]> => {
  return repo.findAllNovels();
});

export const getNovelBySlug = cache(async (rawSlug: string): Promise<Novel | null> => {
  const slug = parseSlug(rawSlug);
  return repo.findNovelBySlug(slug);
});

export const getReadingForNovel = cache(async (rawSlug: string): Promise<NovelReading | null> => {
  const slug = parseSlug(rawSlug);
  const novel = await repo.findNovelBySlug(slug);
  if (!novel) return null;
  const scenes = await repo.findScenesByNovelId(novel.id);
  return { novel, scenes };
});
