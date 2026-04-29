import { supabase } from '@/lib/supabase/client';
import type { Novel, Scene } from '@/types/db';
import { logger } from '@/lib/logger';
import { RepositoryError } from '@/lib/errors';

const NOVEL_COLUMNS = 'id, slug, title, author, synopsis, cover_url, scene_count, created_at';
const SCENE_COLUMNS = 'id, novel_id, "order", title, body, created_at';

export async function findAllNovels(): Promise<Novel[]> {
  const { data, error } = await supabase
    .from('novels')
    .select(NOVEL_COLUMNS)
    .order('created_at', { ascending: true });
  if (error) {
    logger.error('repo.findAllNovels failed', {
      code: error.code,
      details: error.message,
    });
    throw new RepositoryError('listNovels');
  }
  return (data ?? []) as Novel[];
}

export async function findNovelBySlug(slug: string): Promise<Novel | null> {
  const { data, error } = await supabase
    .from('novels')
    .select(NOVEL_COLUMNS)
    .eq('slug', slug)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    logger.error('repo.findNovelBySlug failed', {
      slug,
      code: error.code,
      details: error.message,
    });
    throw new RepositoryError('getNovelBySlug');
  }
  return data as Novel;
}

export async function findScenesByNovelId(novelId: number): Promise<Scene[]> {
  const { data, error } = await supabase
    .from('scenes')
    .select(SCENE_COLUMNS)
    .eq('novel_id', novelId)
    .order('order', { ascending: true });
  if (error) {
    logger.error('repo.findScenesByNovelId failed', {
      novelId,
      code: error.code,
      details: error.message,
    });
    throw new RepositoryError('getScenesForNovel');
  }
  return (data ?? []) as Scene[];
}
