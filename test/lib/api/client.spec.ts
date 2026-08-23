import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { apiFetch } from '@/lib/api/client';
import { ApiValidationError } from '@/lib/api/parse';
import { ApiClientError } from '@/types/article';

const testSchema = z.object({ id: z.string() });

describe('apiFetch', () => {
  beforeEach(() => {
    process.env.API_URL = 'http://localhost:3000/api/v1';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.API_URL;
  });

  it('throws when API_URL is not configured', async () => {
    delete process.env.API_URL;

    await expect(apiFetch('/items', testSchema)).rejects.toThrow(
      'API_URL is not configured',
    );
  });

  it('normalizes path without leading slash', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: '1' }),
      }),
    );

    await apiFetch('items', testSchema);

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/items',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      }),
    );
  });

  it('returns parsed response on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'abc' }),
      }),
    );

    const result = await apiFetch('/items/abc', testSchema);

    expect(result).toEqual({ id: 'abc' });
  });

  it('throws ApiClientError with parsed API error body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () =>
          Promise.resolve({
            error: { code: 'NOT_FOUND', message: 'Recurso não encontrado' },
          }),
      }),
    );

    await expect(apiFetch('/items/missing', testSchema)).rejects.toBeInstanceOf(
      ApiClientError,
    );
    await expect(apiFetch('/items/missing', testSchema)).rejects.toMatchObject({
      code: 'NOT_FOUND',
      message: 'Recurso não encontrado',
      status: 404,
    });
  });

  it('throws ApiClientError with UNKNOWN_ERROR when error body is invalid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('invalid json')),
      }),
    );

    await expect(apiFetch('/items', testSchema)).rejects.toMatchObject({
      code: 'UNKNOWN_ERROR',
      message: 'Internal Server Error',
      status: 500,
    });
  });

  it('throws ApiValidationError on malformed success response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ wrong: 'shape' }),
      }),
    );

    await expect(apiFetch('/items', testSchema)).rejects.toBeInstanceOf(
      ApiValidationError,
    );
  });
});
