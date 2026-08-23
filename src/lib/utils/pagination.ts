export type PageItem = number | 'ellipsis';

export function getVisiblePageNumbers(
  current: number,
  totalPages: number,
  siblingCount = 1,
): PageItem[] {
  if (totalPages <= 1) {
    return [];
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);

  for (let page = current - siblingCount; page <= current + siblingCount; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: PageItem[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index];
    const previous = sorted[index - 1];

    if (index > 0 && page - previous > 1) {
      result.push('ellipsis');
    }

    result.push(page);
  }

  return result;
}
