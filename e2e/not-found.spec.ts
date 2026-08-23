import { expect, test } from '@playwright/test';

test.describe('Estados da interface — RF11', () => {
  test('slug inexistente exibe página 404', async ({ page }) => {
    await page.goto('/articles/slug-que-nao-existe');

    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Voltar para a listagem' })).toBeVisible();
  });
});
