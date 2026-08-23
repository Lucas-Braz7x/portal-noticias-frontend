import { Suspense } from 'react';

import { ArticleFiltersSection } from '@/app/_components/ArticleFiltersSection';
import { ArticleListRegion } from '@/app/_components/ArticleListRegion';
import { ArticleListSection } from '@/app/_components/ArticleListSection';
import { HomeHero } from '@/app/_components/HomeHero';
import { Container } from '@/components/layout/Container';
import { ArticleFiltersSkeleton } from '@/components/ui/ArticleFiltersSkeleton';
import { ArticleListSkeleton } from '@/components/ui/ArticleListSkeleton';

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <Container>
      <HomeHero />

      <Suspense fallback={<ArticleFiltersSkeleton />}>
        <ArticleFiltersSection />
      </Suspense>

      <Suspense fallback={<ArticleListSkeleton />}>
        <ArticleListRegion>
          <ArticleListSection searchParams={searchParams} />
        </ArticleListRegion>
      </Suspense>
    </Container>
  );
}
