# Arquitetura — Portal de Notícias Frontend

> Guia de decisões arquiteturais, padrões e convenções do projeto.  
> Complementa o [SDD](./SDD.md) e a [baseline de requisitos](./requisitos-funcionais-nao-funcionais.md).

---

## 1. Visão geral

O frontend segue uma arquitetura em camadas simples, priorizando **Server Components** do Next.js App Router e fetch server-side para a API do backend.

```mermaid
flowchart TB
    subgraph AppRouter [App Router]
        Pages[pages / layouts]
        Loading[loading.tsx / error.tsx]
    end
    subgraph Components
        Layout[layout/]
        UI[ui/]
    end
    subgraph Lib
        Api[lib/api/]
    end
    subgraph Types
        T[types/]
    end
    subgraph Backend
        API[GET /api/v1/articles]
    end

    Pages --> Layout
    Pages --> UI
    Pages --> Api
    Api --> T
    Api --> API
```

### Princípios adotados

| Princípio | Aplicação |
|-----------|-----------|
| **Server Components por padrão** | Fetch na camada de página; sem `'use client'` desnecessário |
| **Clean Code** | Funções pequenas, nomes expressivos, SRP |
| **TDD** | Red → Green → Refactor no API client e componentes críticos |
| **Tipagem forte** | Tipos espelham contratos do backend; validação runtime com Zod na fronteira da API |
| **SASS Modules** | Estilos escopados por componente; tokens em `styles/` |
| **Mobile-first** | Layout base para telas pequenas; breakpoints com `min-width` — ver [mobile-first.md](./mobile-first.md) |

---

## 2. Camadas e responsabilidades

### 2.1 App Router (`src/app/`)

- **Pages** — Server Components que buscam dados e compõem a UI.
- **Layouts** — shell global (header, footer, metadata).
- **loading.tsx / error.tsx / not-found.tsx** — estados da interface (RF11).

**Regra:** páginas não chamam `fetch` diretamente — usam `lib/api/`.

### 2.2 Components (`src/components/`)

| Pasta | Responsabilidade |
|-------|------------------|
| `layout/` | Header, Footer, Container — estrutura da página |
| `articles/` | ArticleList, ArticleCard, ArticleFilters, Pagination, ArticleDetailView |
| `ui/` | EmptyState, ErrorMessage, Spinner — estados reutilizáveis |

**Regra:** componentes de UI são apresentacionais; sem lógica de API.

### 2.3 Lib (`src/lib/`)

| Pasta / arquivo | Responsabilidade |
|-----------------|------------------|
| `api/client.ts` | `fetch` wrapper, parse de erros, base URL |
| `api/parse.ts` | `parseApiResponse` + `ApiValidationError` |
| `api/schemas/` | Schemas Zod dos contratos da API |
| `api/cache.ts` | Tags e `revalidate` por recurso |
| `api/articles.ts` | `listArticles`, `getArticleBySlug` |
| `utils/` | `list-params`, `format-date` — helpers de URL e formatação |
| `constants/filters.ts` | Categorias e tags para filtros |

### 2.4 Types (`src/types/`)

Tipos TypeScript inferidos dos schemas Zod em `lib/api/schemas/`. Reexportados em `types/article.ts` para uso em componentes.

---

## 3. Boundary de dados (Zod)

Toda resposta da API passa por validação runtime antes de chegar aos componentes:

```
fetch → response.json() → parseApiResponse(schema) → componente
```

| Erro | Classe | Quando |
|------|--------|--------|
| HTTP 4xx/5xx | `ApiClientError` | Resposta de erro da API |
| Payload inválido | `ApiValidationError` | JSON não bate com o schema Zod |

Schemas em `src/lib/api/schemas/article.ts` espelham o [SDD do backend](../portal-noticias-backend/docs/SDD.md#4-contratos-da-api).

---

## 4. Estratégia de fetch e cache

| Cenário | Abordagem |
|---------|-----------|
| Listagem / detalhe | Server Component → `lib/api` → `fetch` com `API_URL` |
| Busca com debounce (futuro) | Route Handler BFF ou CORS no backend |
| Cache ISR | `next.revalidate` + `tags` via helpers em `lib/api/cache.ts` |

### Cache por recurso

| Tag | Endpoints | Revalidate | Justificativa |
|-----|-----------|------------|---------------|
| `articles` | `GET /articles`, `GET /articles/:slug` | 60s | Conteúdo muda com ingestão/publicação |
| `categories` | `GET /categories` | 300s | Catálogo estável; muda raramente |
| `tags` | `GET /tags` | 300s | Catálogo estável; muda raramente |

Helpers: `articlesCacheOptions()`, `categoriesCacheOptions()`, `tagsCacheOptions()`.

**Futuro (produção):** webhook de ingestão no backend pode chamar `revalidateTag('articles')` no frontend para invalidação imediata — não implementado neste setup.

> O backend não habilita CORS. Toda chamada à API é **server-side**.

### Suspense granular (home)

A home usa `<Suspense>` por seção para streaming independente:

| Seção | Componente async | Fallback |
|-------|------------------|----------|
| Filtros | `ArticleFiltersSection` | `ArticleFiltersSkeleton` |
| Listagem | `ArticleListSection` | `ArticleListSkeleton` |

`loading.tsx` na raiz permanece como fallback de navegação entre rotas.

---

## 5. Estrutura de pastas

```
src/
├── app/
│   ├── _components/      # Server Components async por seção (Suspense)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── page.module.scss
│   ├── loading.tsx
│   ├── error.tsx
│   ├── error.module.scss
│   ├── not-found.tsx
│   ├── globals.scss
│   └── articles/[slug]/
│       ├── page.tsx
│       └── loading.tsx
├── components/
│   ├── articles/
│   ├── layout/
│   └── ui/
├── lib/
│   ├── api/
│   │   ├── schemas/
│   │   ├── cache.ts
│   │   ├── parse.ts
│   │   ├── client.ts
│   │   ├── articles.ts
│   │   ├── categories.ts
│   │   └── tags.ts
│   ├── constants/
│   └── utils/
├── types/
└── styles/
    ├── _variables.scss
    └── _mixins.scss

test/
├── setup.ts
├── lib/
│   ├── api/
│   │   ├── parse.spec.ts
│   │   └── articles.spec.ts
│   └── utils/
│       ├── list-params.spec.ts
│       └── format-date.spec.ts
└── components/
    └── articles/
        ├── ArticleList.spec.tsx
        ├── ArticleCard.spec.tsx
        ├── ArticleFilters.spec.tsx
        ├── Pagination.spec.tsx
        └── ArticleDetailView.spec.tsx

e2e/                      # Playwright E2E (backend real + seed)
├── home.spec.ts
├── article-detail.spec.ts
└── not-found.spec.ts
```

---

## 6. TDD e testes

| Camada | Onde testar | Ferramenta |
|--------|-------------|------------|
| API client + Zod | `test/lib/api/` | Vitest + mock de `fetch` |
| Utils | `test/lib/utils/` | Vitest |
| Componentes | `test/components/` | Vitest + Testing Library |
| E2E (RF01–RF06, RF11) | `e2e/` | Playwright + backend real |

**Comandos:** `yarn test` (unitário), `yarn test:watch` (desenvolvimento), `yarn test:e2e` (E2E).

**Pré-requisito E2E:** backend com docker-compose, migrations e seed rodando em `localhost:3000`.

---

## 7. Responsividade

Padrão **mobile-first** com SASS Modules. Breakpoints, mixin `respond-from` e convenções de grid/tipografia estão em [mobile-first.md](./mobile-first.md).

---

## 8. O que evitar

- Chamar a API diretamente em componentes de UI
- `'use client'` sem necessidade de interatividade
- Fetch client-side para a API backend (sem CORS/BFF)
- Misturar Tailwind com SASS Modules
- Media queries `max-width` ou breakpoints fora dos tokens do projeto

---

*Versão: 1.1 — Agosto/2026*
