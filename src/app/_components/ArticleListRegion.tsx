'use client';

import { useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect, useRef } from 'react';

import { DEFAULT_PAGE_LIMIT } from '@/lib/constants/pagination';
import {
  ARTICLE_LIST_REGION_ID,
  scrollToArticleList,
} from '@/lib/utils/article-list-region';

import styles from './ArticleListRegion.module.scss';

interface ArticleListRegionProps {
  children: ReactNode;
}

function getListSignature(searchParams: URLSearchParams): string {
  const page = searchParams.get('page') ?? '1';
  const limit = searchParams.get('limit') ?? String(DEFAULT_PAGE_LIMIT);
  return `${page}|${limit}`;
}

export function ArticleListRegion({ children }: ArticleListRegionProps) {
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const previousSignature = useRef(getListSignature(searchParams));

  useEffect(() => {
    const signature = getListSignature(searchParams);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousSignature.current = signature;
      return;
    }

    if (signature === previousSignature.current) {
      return;
    }

    previousSignature.current = signature;
    scrollToArticleList();
  }, [searchParams]);

  return (
    <section id={ARTICLE_LIST_REGION_ID} className={styles.region}>
      {children}
    </section>
  );
}
