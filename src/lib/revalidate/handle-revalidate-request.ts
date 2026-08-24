export const ALLOWED_REVALIDATE_TAGS = [
  'articles',
  'categories',
  'tags',
] as const;

export type RevalidateTag = (typeof ALLOWED_REVALIDATE_TAGS)[number];

export interface RevalidateRequestBody {
  tags?: string[];
}

export function isAllowedRevalidateTag(tag: string): tag is RevalidateTag {
  return (ALLOWED_REVALIDATE_TAGS as readonly string[]).includes(tag);
}

export function normalizeRevalidateTags(
  tags: string[] | undefined,
): RevalidateTag[] {
  const requested = tags ?? ['articles'];
  const unique = [
    ...new Set(requested.filter((tag) => isAllowedRevalidateTag(tag))),
  ];

  return unique.length > 0 ? unique : ['articles'];
}

export interface HandleRevalidateDeps {
  secret: string | undefined;
  revalidateTag: (tag: string) => void;
}

export async function handleRevalidateRequest(
  request: Request,
  deps: HandleRevalidateDeps,
): Promise<Response> {
  if (!deps.secret) {
    return Response.json(
      { error: 'Revalidation not configured' },
      { status: 503 },
    );
  }

  const headerSecret = request.headers.get('x-revalidate-secret');
  if (headerSecret !== deps.secret) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: RevalidateRequestBody = {};

  try {
    body = (await request.json()) as RevalidateRequestBody;
  } catch {
    body = {};
  }

  const tags = normalizeRevalidateTags(body.tags);
  for (const tag of tags) {
    deps.revalidateTag(tag);
  }

  return Response.json({ revalidated: true, tags });
}
