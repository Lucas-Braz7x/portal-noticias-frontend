import type { ZodType } from 'zod';

export class ApiValidationError extends Error {
  constructor(
    public readonly context: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiValidationError';
  }
}

export function parseApiResponse<T>(schema: ZodType<T>, data: unknown, context: string): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('; ');
    throw new ApiValidationError(context, `Invalid API response (${context}): ${issues}`);
  }

  return result.data;
}
