import { z } from 'zod';

export const SlugSchema = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with hyphens');

export type Slug = z.infer<typeof SlugSchema>;

export const PositiveIntSchema = z.number().int().positive();
