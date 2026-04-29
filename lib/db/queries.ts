import { cache } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Novel, Scene } from '@/types/db';

export const getAllNovels = cache(async (): Promise<Novel[]> => {
  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(`db: ${error.message}`);
  return data as Novel[];
});

export const getNovelBySlug = cache(async (slug: string): Promise<Novel | null> => {
  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`db: ${error.message}`);
  }
  return data as Novel;
});

export const getScenesForNovel = cache(async (novelId: number): Promise<Scene[]> => {
  const { data, error } = await supabase
    .from('scenes')
    .select('*')
    .eq('novel_id', novelId)
    .order('order', { ascending: true });
  if (error) throw new Error(`db: ${error.message}`);
  return data as Scene[];
});
