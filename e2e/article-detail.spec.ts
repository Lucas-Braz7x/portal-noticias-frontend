import { expect, test } from '@playwright/test';

test.describe('Detalhe do artigo — RF06', () => {
  test('navega do card para a página de detalhe', async ({ page }) => {
    await page.goto('/');

    const articleTitle = 'Cultura paranaense é destaque em feira internacional';
    const articleSlug = 'cultura-paranaense-e-destaque-em-feira-internacional';

    const articleCard = page.getByRole('article').filter({ hasText: articleTitle });
    await articleCard.getByRole('link', { name: 'Ver mais' }).click();

    await expect(page).toHaveURL(`/articles/${articleSlug}`);
    await expect(page.getByRole('heading', { name: articleTitle, level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Voltar para a home' })).toBeVisible();
  });
});
