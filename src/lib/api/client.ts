import type { ZodType } from 'zod';

import { ApiClientError } from '@/types/article';

import { parseApiResponse } from './parse';
import { apiErrorBodySchema } from './schemas/article';

export interface FetchOptions {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export async function apiFetch<T>(
  path: string,
  schema: ZodType<T>,
  options?: FetchOptions,
): Promise<T> {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) {
    throw new Error('API_URL is not configured');
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const parsed = apiErrorBodySchema.safeParse(body);
    const code = parsed.success ? parsed.data.error.code : 'UNKNOWN_ERROR';
    const message = parsed.success
      ? parsed.data.error.message
      : response.statusText;
    throw new ApiClientError(code, message, response.status);
  }

  const json: unknown = await response.json();
  return parseApiResponse(schema, json, path);
}
