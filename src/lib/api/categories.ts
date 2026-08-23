import type { ReferenceItem } from '@/types/article';

import { categoriesCacheOptions } from './cache';
import { apiFetch, type FetchOptions } from './client';
import { referenceItemListSchema } from './schemas/article';

export async function listCategories(
  options?: FetchOptions,
): Promise<ReferenceItem[]> {
  return apiFetch<ReferenceItem[]>('/categories', referenceItemListSchema, {
    ...categoriesCacheOptions(),
    ...options,
  });
}
