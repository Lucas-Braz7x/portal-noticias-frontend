import { z } from 'zod';

export const referenceItemSchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export const articleSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  publishedAt: z.string(),
  author: z.string(),
  category: referenceItemSchema,
  tags: z.array(referenceItemSchema),
});

export const articleDetailSchema = articleSummarySchema.extend({
  content: z.string(),
});

export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const paginatedArticlesSchema = z.object({
  data: z.array(articleSummarySchema),
  meta: paginationMetaSchema,
});

export const referenceItemListSchema = z.array(referenceItemSchema);

export const apiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export type ReferenceItem = z.infer<typeof referenceItemSchema>;
export type ArticleSummary = z.infer<typeof articleSummarySchema>;
export type ArticleDetail = z.infer<typeof articleDetailSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
