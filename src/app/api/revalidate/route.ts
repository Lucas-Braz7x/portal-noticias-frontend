import { revalidateTag } from 'next/cache';

import { handleRevalidateRequest } from '@/lib/revalidate/handle-revalidate-request';

export async function POST(request: Request) {
  return handleRevalidateRequest(request, {
    secret: process.env.REVALIDATE_SECRET,
    revalidateTag: (tag) => {
      revalidateTag(tag, 'max');
    },
  });
}
