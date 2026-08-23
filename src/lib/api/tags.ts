import type { ReferenceItem } from '@/types/article';

import { tagsCacheOptions } from './cache';
import { apiFetch, type FetchOptions } from './client';
import { referenceItemListSchema } from './schemas/article';

export async function listTags(options?: FetchOptions): Promise<ReferenceItem[]> {
  return apiFetch<ReferenceItem[]>('/tags', referenceItemListSchema, {
    ...tagsCacheOptions(),
    ...options,
  });
}
