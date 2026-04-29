export type Novel = {
  id: number;
  slug: string;
  title: string;
  author: string;
  synopsis: string;
  cover_url: string | null;
  scene_count: number;
  created_at: string;
};

export type Scene = {
  id: number;
  novel_id: number;
  order: number;
  title: string;
  body: string;
  created_at: string;
};
