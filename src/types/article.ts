export type {
  ArticleDetail,
  ArticleSummary,
  PaginationMeta,
  ReferenceItem,
} from '@/lib/api/schemas/article';

export interface PaginatedResponse<T> {
  data: T[];
  meta: import('@/lib/api/schemas/article').PaginationMeta;
}

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export interface ListArticlesParams {
  q?: string;
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
}
