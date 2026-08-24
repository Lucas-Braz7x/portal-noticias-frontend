# Especificação Técnica — Portal de Notícias (Frontend)

> **Spec Driven Development** — decisões de implementação registradas antes e durante o código.  
> Requisitos funcionais e não funcionais do desafio: [requisitos-funcionais-nao-funcionais.md](./requisitos-funcionais-nao-funcionais.md).

| | |
|---|---|
| **Repositório** | [github.com/Lucas-Braz7x/portal-noticias-frontend](https://github.com/Lucas-Braz7x/portal-noticias-frontend) |
| **Produção** | [portal-noticias-frontend.onrender.com](https://portal-noticias-frontend.onrender.com) |

---

## 1. Rastreabilidade

Mapa entre requisitos do edital e implementação neste repositório (frontend).

### 1.1 Requisitos funcionais

| Requisito | Status | Implementação |
|-----------|--------|---------------|
| [RF01](./requisitos-funcionais-nao-funcionais.md#rf01--listagem-de-artigos) | ✅ | `/` — `ArticleList` + `ArticleCard` via `listArticles()` |
| [RF02](./requisitos-funcionais-nao-funcionais.md#rf02--paginação) | ✅ | `Pagination` numerada na home (`?page=`) com `meta` da API |
| [RF03](./requisitos-funcionais-nao-funcionais.md#rf03--busca-textual) | ✅ | `ArticleFilters` — campo `q` via form GET |
| [RF04](./requisitos-funcionais-nao-funcionais.md#rf04--filtro-por-categoria) | ✅ | `ArticleFilters` — select `category` (slug) |
| [RF05](./requisitos-funcionais-nao-funcionais.md#rf05--filtro-por-tag) | ✅ | `ArticleFilters` — select `tag` (slug) |
| [RF06](./requisitos-funcionais-nao-funcionais.md#rf06--visualização-do-artigo) | ✅ | `/articles/[slug]` — `ArticleDetailView` via `getArticleBySlug()` |
| [RF07](./requisitos-funcionais-nao-funcionais.md#rf07--api-de-artigos) | — | Backend ([repositório](https://github.com/Lucas-Braz7x/portal-noticias-backend)) |
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
| [RNF14](./requisitos-funcionais-nao-funcionais.md#rnf14--documentação) | ✅ | README, SDD, arquitetura, deploy, requisitos |
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
| `/` | RF01–RF05 | ✅ Listagem, busca, filtros e paginação numerada (`?page=`) |
| `/articles/[slug]` | RF06 | ✅ Detalhe do artigo |
| `loading.tsx` / `error.tsx` / `not-found.tsx` | RF11 | ✅ Estados da interface |

---

## 4. Contratos consumidos da API

Base URL: `API_URL` (ex.: `http://localhost:3000/api/v1`)

Contratos definidos no [SDD do backend](https://github.com/Lucas-Braz7x/portal-noticias-backend/blob/main/docs/SDD.md#4-contratos-da-api) (repositório separado).

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

### 4.4 Cache e invalidação (sem Redis)

| Mecanismo | Onde | Detalhe |
|-----------|------|---------|
| ISR | `lib/api/cache.ts` | `revalidate` + `tags` por recurso (`articles`, `categories`, `tags`) |
| Invalidação on-demand | `POST /api/revalidate` | `src/app/api/revalidate/route.ts` |
| Webhook | Backend → frontend | Após ingestão, backend chama o endpoint com `X-Revalidate-Secret` |

**Contrato do webhook:**

```http
POST /api/revalidate
X-Revalidate-Secret: <REVALIDATE_SECRET>
Content-Type: application/json

{ "tags": ["articles", "categories", "tags"] }
```

Resposta `200`: `{ "revalidated": true, "tags": [...] }`. Tags desconhecidas são ignoradas; se nenhuma tag válida for enviada, revalida `articles`.

---

## 5. Variáveis de ambiente

| Variável | Uso |
|----------|-----|
| `API_URL` | Server Components — base da API backend |
| `NEXT_PUBLIC_SITE_URL` | URL pública do frontend (metadata/SEO) |
| `REVALIDATE_SECRET` | Segredo do webhook `POST /api/revalidate` (mesmo valor no backend) |

No **Render**, configure `REVALIDATE_SECRET` neste serviço e `FRONTEND_REVALIDATE_URL` + `REVALIDATE_SECRET` no backend apontando para `https://portal-noticias-frontend.onrender.com/api/revalidate`. Detalhes: [deploy-render.md](./deploy-render.md).

---

## 6. Histórico de implementação

1. [x] Scaffold Next.js + SASS + Vitest + Prettier
2. [x] Tipos + API client + teste Vitest
3. [x] Layout shell + placeholders + estados RF11 (base)
4. [x] Documentação e Cursor rules
5. [x] Listagem funcional (RF01/RF02) com cards e paginação
6. [x] Busca e filtros (RF03–RF05)
7. [x] Detalhe do artigo (RF06)
8. [x] Playwright E2E (RF01–RF06, RF11), cache ISR, validação Zod
9. [x] Invalidação on-demand via `POST /api/revalidate` (webhook do backend após ingestão)

---

## 5. Riscos, simplificações e próximos passos

### 5.1 Riscos

| Risco | Mitigação |
|-------|-----------|
| API indisponível no build/runtime | CI exige `API_URL` no build; health check manual pós-deploy |
| Payload divergente do contrato | Zod na fronteira (`parseApiResponse`); testes Vitest do API client |
| Conteúdo stale após ingestão | Webhook ISR + TTL (60s artigos); monitorar `REVALIDATE_SECRET` |
| Regressão em páginas sem E2E no CI | Playwright local antes de merge; roadmap E2E no CI |

### 5.2 Simplificações assumidas

- Fetch **100% server-side** — backend sem CORS
- Busca/filtros via **form GET** (URL como estado) — sem debounce client-side
- **ISR** em vez de Redis — alinhado ao deploy Render
- RF07–RF10 implementados no [backend](https://github.com/Lucas-Braz7x/portal-noticias-backend)

### 5.3 Fora do escopo

Ver [§4 do documento de requisitos](./requisitos-funcionais-nao-funcionais.md#4-fora-do-escopo).

### 5.4 Próximos passos

Roadmap priorizado: [proximos-passos.md](./proximos-passos.md).

Resumo:

- E2E no CI (Playwright + backend dockerizado)
- Open Graph / metadata avançada
- Dark mode persistido; autenticação quando o backend evoluir

---

*Versão: 1.2 — Agosto/2026*
