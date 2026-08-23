import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Pagination } from '@/components/articles/Pagination';
import type { ListArticlesParams } from '@/types/article';

const listParams: ListArticlesParams = {
  q: 'ia',
  category: 'tecnologia',
  limit: 20,
};

const meta = {
  page: 2,
  limit: 20,
  total: 25,
  totalPages: 3,
};

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

afterEach(() => {
  cleanup();
  push.mockClear();
});

describe('Pagination', () => {
  it('renders page size selector even when totalPages is 1', () => {
    render(
      <Pagination
        meta={{ ...meta, page: 1, totalPages: 1 }}
        listParams={listParams}
      />,
    );

    expect(screen.getByLabelText('Itens por página')).toHaveValue('20');
    expect(
      screen.queryByRole('link', { name: 'Ir para página 2' }),
    ).not.toBeInTheDocument();
  });

  it('marks the current page with aria-current', () => {
    render(<Pagination meta={meta} listParams={listParams} />);

    expect(
      screen.getByRole('navigation', { name: 'Paginação' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Página 2, página atual')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('builds links preserving active filters and limit', () => {
    render(<Pagination meta={meta} listParams={listParams} />);

    expect(
      screen.getByRole('link', { name: 'Ir para página 1' }),
    ).toHaveAttribute('href', '/?q=ia&category=tecnologia&limit=20');
    expect(
      screen.getByRole('link', { name: 'Ir para página 3' }),
    ).toHaveAttribute('href', '/?q=ia&category=tecnologia&page=3&limit=20');
  });

  it('navigates without browser scroll', () => {
    render(<Pagination meta={meta} listParams={listParams} />);

    fireEvent.click(screen.getByRole('link', { name: 'Ir para página 3' }));

    expect(push).toHaveBeenCalledWith(
      '/?q=ia&category=tecnologia&page=3&limit=20',
      {
        scroll: false,
      },
    );
  });

  it('resets to page 1 when page size changes', () => {
    render(<Pagination meta={meta} listParams={listParams} />);

    fireEvent.change(screen.getByLabelText('Itens por página'), {
      target: { value: '30' },
    });

    expect(push).toHaveBeenCalledWith('/?q=ia&category=tecnologia&limit=30', {
      scroll: false,
    });
  });

  it('renders disabled previous control on the first page', () => {
    render(<Pagination meta={{ ...meta, page: 1 }} listParams={listParams} />);

    expect(screen.getByLabelText('Página anterior')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(
      screen.queryByRole('link', { name: 'Página anterior' }),
    ).not.toBeInTheDocument();
  });

  it('renders disabled next control on the last page', () => {
    render(<Pagination meta={{ ...meta, page: 3 }} listParams={listParams} />);

    expect(screen.getByLabelText('Próxima página')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(
      screen.queryByRole('link', { name: 'Próxima página' }),
    ).not.toBeInTheDocument();
  });
});
