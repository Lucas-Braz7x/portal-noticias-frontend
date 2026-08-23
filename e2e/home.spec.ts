import { expect, test } from '@playwright/test';

const FIRST_PAGE_ARTICLE = {
  title: 'Cultura paranaense é destaque em feira internacional',
  slug: 'cultura-paranaense-e-destaque-em-feira-internacional',
};

const NEXTJS_ARTICLE = {
  title: 'Frameworks JavaScript: comparativo entre Next.js e alternativas',
  slug: 'frameworks-javascript-comparativo-entre-nextjs-e-alternativas',
};

const PAGE_TWO_ARTICLE = {
  title: 'Exposição de arte contemporânea abre no Museu Oscar Niemeyer',
  slug: 'exposicao-de-arte-contemporanea-abre-no-museu-oscar-niemeyer',
};

test.describe('Home — RF01 listagem, RF02 paginação, RF03–RF05 filtros', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('RF01 — exibe artigos do seed com título e resumo', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Portal de Notícias', level: 1 })).toBeVisible();

    const firstArticle = page.getByRole('link', { name: FIRST_PAGE_ARTICLE.title });
    await expect(firstArticle).toBeVisible();
    await expect(firstArticle).toHaveAttribute('href', `/articles/${FIRST_PAGE_ARTICLE.slug}`);
  });

  test('RF02 — navegação paginada carrega artigos da página 2', async ({ page }) => {
    await expect(page.getByRole('link', { name: FIRST_PAGE_ARTICLE.title })).toBeVisible();
    await expect(page.getByRole('link', { name: PAGE_TWO_ARTICLE.title })).not.toBeVisible();

    await page.getByRole('link', { name: 'Ir para página 2' }).click();

    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByRole('link', { name: PAGE_TWO_ARTICLE.title })).toBeVisible();
    await expect(page.getByRole('link', { name: FIRST_PAGE_ARTICLE.title })).not.toBeVisible();
  });

  test('RF02 — deep link ?page=2 exibe artigos da segunda página', async ({ page }) => {
    await page.goto('/?page=2');

    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByRole('link', { name: PAGE_TWO_ARTICLE.title })).toBeVisible();
    await expect(page.getByRole('link', { name: FIRST_PAGE_ARTICLE.title })).not.toBeVisible();
  });

  test('RF02 — filtros resetam para a página 1', async ({ page }) => {
    await page.goto('/?page=2&limit=20');
    await expect(page).toHaveURL(/page=2/);

    await page.getByLabel('Buscar').fill('Next.js');
    await page.getByRole('button', { name: 'Buscar' }).click();

    await expect(page).toHaveURL(/q=Next/);
    await expect(page).toHaveURL(/limit=20/);
    await expect(page).not.toHaveURL(/page=/);
  });

  test('RF02 — alterar itens por página atualiza a listagem', async ({ page }) => {
    await page.getByLabel('Itens por página').selectOption('20');

    await expect(page).toHaveURL(/limit=20/);
    await expect(page).not.toHaveURL(/page=/);
  });

  test('RF03 — busca textual filtra resultados', async ({ page }) => {
    await page.getByLabel('Buscar').fill('Next.js');
    await page.getByRole('button', { name: 'Buscar' }).click();

    await expect(page).toHaveURL(/q=Next/);
    await expect(page.getByRole('link', { name: NEXTJS_ARTICLE.title })).toBeVisible();
  });

  test('RF04 — filtro por categoria', async ({ page }) => {
    await page.getByLabel('Categoria').selectOption('tecnologia');
    await page.getByRole('button', { name: 'Buscar' }).click();

    await expect(page).toHaveURL(/category=tecnologia/);
    await expect(page.getByRole('link', { name: 'Tecnologia' }).first()).toBeVisible();
  });

  test('RF05 — filtro por tag', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Tag' }).selectOption('nextjs');
    await page.getByRole('button', { name: 'Buscar' }).click();

    await expect(page).toHaveURL(/tag=nextjs/);
    await expect(page.getByRole('link', { name: NEXTJS_ARTICLE.title })).toBeVisible();
  });

  test('RF05 — clique em tag no card sincroniza o select de tag', async ({ page }) => {
    const tagLink = page.getByRole('link', { name: 'Paraná' }).first();
    await tagLink.click();

    await expect(page).toHaveURL(/tag=parana/);
    await expect(page.getByRole('combobox', { name: 'Tag' })).toHaveValue('parana');
  });
});
