import { afterEach, describe, expect, it, vi } from 'vitest';

import { handleRevalidateRequest } from '@/lib/revalidate/handle-revalidate-request';

describe('handleRevalidateRequest', () => {
  const secret = 'test-secret';

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 401 when secret header is invalid', async () => {
    const revalidateTag = vi.fn();
    const request = new Request('http://localhost/api/revalidate', {
      method: 'POST',
      headers: { 'x-revalidate-secret': 'wrong' },
      body: JSON.stringify({ tags: ['articles'] }),
    });

    const response = await handleRevalidateRequest(request, {
      secret,
      revalidateTag,
    });

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('returns 503 when REVALIDATE_SECRET is not configured', async () => {
    const revalidateTag = vi.fn();
    const request = new Request('http://localhost/api/revalidate', {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret },
    });

    const response = await handleRevalidateRequest(request, {
      secret: undefined,
      revalidateTag,
    });

    expect(response.status).toBe(503);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('revalidates requested tags when secret is valid', async () => {
    const revalidateTag = vi.fn();
    const request = new Request('http://localhost/api/revalidate', {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret },
      body: JSON.stringify({ tags: ['articles', 'categories'] }),
    });

    const response = await handleRevalidateRequest(request, {
      secret,
      revalidateTag,
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      revalidated: true,
      tags: ['articles', 'categories'],
    });
    expect(revalidateTag).toHaveBeenCalledWith('articles');
    expect(revalidateTag).toHaveBeenCalledWith('categories');
  });

  it('defaults to articles tag when body is empty', async () => {
    const revalidateTag = vi.fn();
    const request = new Request('http://localhost/api/revalidate', {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret },
    });

    const response = await handleRevalidateRequest(request, {
      secret,
      revalidateTag,
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.tags).toEqual(['articles']);
    expect(revalidateTag).toHaveBeenCalledWith('articles');
  });

  it('ignores unknown tags and falls back to articles', async () => {
    const revalidateTag = vi.fn();
    const request = new Request('http://localhost/api/revalidate', {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret },
      body: JSON.stringify({ tags: ['unknown'] }),
    });

    const response = await handleRevalidateRequest(request, {
      secret,
      revalidateTag,
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.tags).toEqual(['articles']);
    expect(revalidateTag).toHaveBeenCalledWith('articles');
  });
});
