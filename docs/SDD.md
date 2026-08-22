# Especificação Técnica — Portal de Notícias (Frontend)

> **Spec Driven Development** — decisões de implementação registradas antes e durante o código.  
> Requisitos funcionais e não funcionais do desafio: [requisitos-funcionais-nao-funcionais.md](./requisitos-funcionais-nao-funcionais.md).

---

## 1. Rastreabilidade

Mapa entre requisitos do edital e implementação neste repositório (frontend).

### 1.1 Requisitos funcionais

| Requisito | Status | Implementação |
|-----------|--------|---------------|
| [RF01](./requisitos-funcionais-nao-funcionais.md#rf01--listagem-de-artigos) | ✅ | `/` — `ArticleList` + `ArticleCard` via `listArticles()` |
| [RF02](./requisitos-funcionais-nao-funcionais.md#rf02--paginação) | ✅ | `Pagination` na home com `meta` da API |
| [RF03](./requisitos-funcionais-nao-funcionais.md#rf03--busca-textual) | ✅ | `ArticleFilters` — campo `q` via form GET |
| [RF04](./requisitos-funcionais-nao-funcionais.md#rf04--filtro-por-categoria) | ✅ | `ArticleFilters` — select `category` (slug) |
| [RF05](./requisitos-funcionais-nao-funcionais.md#rf05--filtro-por-tag) | ✅ | `ArticleFilters` — select `tag` (slug) |
| [RF06](./requisitos-funcionais-nao-funcionais.md#rf06--visualização-do-artigo) | ✅ | `/articles/[slug]` — `ArticleDetailView` via `getArticleBySlug()` |
| [RF07](./requisitos-funcionais-nao-funcionais.md#rf07--api-de-artigos) | — | Backend ([SDD backend](https://github.com)) |
| [RF08](./requisitos-funcionais-nao-funcionais.md#rf08--ingestão-de-artigos) | — | Backend |
| [RF09](./requisitos-funcionais-nao-funcionais.md#rf09--persistência) | — | Backend |
| [RF10](./requisitos-funcionais-nao-funcionais.md#rf10--dados-iniciais) | — | Backend |
| [RF11](./requisitos-funcionais-nao-funcionais.md#rf11--estados-da-interface) | ✅ | `loading.tsx`, `error.tsx`, `EmptyState`, `notFound()` no detalhe |

Legenda: ✅ implementado · 🔜 planejado · — fora deste repo

### 1.2 Requisitos não funcionais (frontend)

| Requisito | Status | Implementação neste repo |
|-----------|--------|--------------------------|
| [RNF01](./requisitos-funcionais-nao-funcionais.md#rnf01--typescript) | ✅ | TypeScript com `strict` no `tsconfig.json` |
| [RNF07](./requisitos-funcionais-nao-funcionais.md#rnf07--testabilidade) | ✅ | Vitest + Testing Library; teste do API client |
| [RNF14](./requisitos-funcionais-nao-funcionais.md#rnf14--documentação) | ✅ | README, SDD, arquitetura, requisitos |
| [RNF15](./requisitos-funcionais-nao-funcionais.md#rnf15--spec-driven-development) | ✅ | Este documento |
| [RNF16](./requisitos-funcionais-nao-funcionais.md#rnf16--uso-responsável-de-ia) | ✅ | [uso-de-ia.md](./uso-de-ia.md) |

---

## 2. Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript strict |
| Estilização | SASS Modules |
| Testes | Vitest + Testing Library + Playwright E2E |
| Package manager | Yarn 1.22 |

---

## 3. Rotas

| Rota | RF | Status no setup |
|------|----|-----------------|
| `/` | RF01–RF05 | ✅ Listagem, busca, filtros e paginação |
| `/articles/[slug]` | RF06 | ✅ Detalhe do artigo |
| `loading.tsx` / `error.tsx` / `not-found.tsx` | RF11 | ✅ Estados da interface |

---

## 4. Contratos consumidos da API

Base URL: `API_URL` (ex.: `http://localhost:3000/api/v1`)

Contratos definidos no [SDD do backend](../portal-noticias-backend/docs/SDD.md#4-contratos-da-api).

### 4.1 Tipos (`src/types/article.ts`)

```typescript
interface ReferenceItem { name: string; slug: string }
interface ArticleSummary {
  slug, title, summary, publishedAt, author,
  category: ReferenceItem,
  tags: ReferenceItem[]
}
interface ArticleDetail extends ArticleSummary { content }
interface PaginatedResponse<T> { data: T[]; meta: { page, limit, total, totalPages } }
interface ApiError { error: { code, message } }
```

### 4.2 Funções (`src/lib/api/`)

| Função | Endpoint | Uso |
|--------|----------|-----|
| `listArticles(params)` | `GET /articles` | Server Component na home |
| `getArticleBySlug(slug)` | `GET /articles/:slug` | Server Component no detalhe |
| `listCategories()` | `GET /categories` | Server Component na home (filtros) |
| `listTags()` | `GET /tags` | Server Component na home (filtros) |

### 4.3 Erros

| Código | HTTP | Tratamento no frontend |
|--------|------|------------------------|
| `ARTICLE_NOT_FOUND` | 404 | `notFound()` no detalhe |
| `UNKNOWN_ERROR` | outros | `error.tsx` ou mensagem genérica |

---

## 5. Variáveis de ambiente

| Variável | Uso |
|----------|-----|
| `API_URL` | Server Components — base da API backend |
| `NEXT_PUBLIC_SITE_URL` | URLs absolutas e SEO |

---

## 6. Próximos passos

1. [x] Scaffold Next.js + SASS + Vitest + Prettier
2. [x] Tipos + API client + teste Vitest
3. [x] Layout shell + placeholders + estados RF11 (base)
4. [x] Documentação e Cursor rules
5. [x] Listagem funcional (RF01/RF02) com cards e paginação
6. [x] Busca e filtros (RF03–RF05)
7. [x] Detalhe do artigo (RF06)
8. [x] Playwright E2E (RF01–RF06, RF11), cache ISR, validação Zod

---

*Versão: 1.0 — Agosto/2026*
