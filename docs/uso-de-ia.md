# Uso de IA no desenvolvimento — Frontend

> Atende [RNF16 — Uso responsável de IA](./requisitos-funcionais-nao-funcionais.md#rnf16--uso-responsável-de-ia).

---

## 1. Contexto

Desenvolvimento do frontend do desafio técnico da **Gazeta do Povo**, em repositório separado do [backend](https://github.com/Lucas-Braz7x/portal-noticias-backend). O **Cursor** foi o ambiente principal; a IA generativa entrou como **ferramenta de aceleração** — rascunhos de código, exploração de alternativas, boilerplate e primeiros casos de teste.

Fluxo adotado: **especificação → teste (quando aplicável) → implementação → revisão humana**.

### Ferramentas e modelos

| Ferramenta | Modelo | Quando usar |
|------------|--------|-------------|
| [Cursor](https://cursor.com) | **Claude Sonnet** (modo Agent) | Planejamento: SDD, arquitetura, trade-offs, estrutura de pastas |
| [Cursor](https://cursor.com) | **Composer** | Execução: componentes, API client, testes Vitest/Playwright, configs |

Sonnet para decisões estruturais; Composer para iteração rápida e TDD no API client.

---

## 2. O que ficou humano

| Responsabilidade | Por quê |
|------------------|---------|
| Baseline de requisitos (RF/RNF) | Espelho fiel do edital; critério de aceite |
| Contratos consumidos da API | Conferidos no [SDD do backend](https://github.com/Lucas-Braz7x/portal-noticias-backend/blob/main/docs/SDD.md#4-contratos-da-api) antes de tipar o client |
| Escolha Server Components + fetch server-side | Backend sem CORS — decisão de integração, não conveniência da IA |
| UX de paginação e filtros | Form GET na URL, scroll ao trocar página, reset para página 1 ao filtrar |
| Estratégia de cache ISR + webhook | Alinhada ao backend (sem Redis no Render); TTL e tags por recurso |
| Cobertura e CI | Threshold Vitest 75%; E2E Playwright só local (premissa consciente) |
| Deploy e variáveis no Render | `API_URL`, `REVALIDATE_SECRET`, deploy hook no GitHub Actions |

A IA acelerou a escrita; **o critério de qualidade e o “merge ou não merge” foram meus**.

---

## 3. Onde a IA auxiliou

| Área | Contribuição da IA | Revisão / decisão final |
|------|--------------------|-------------------------|
| **Documentação** (`docs/`, README) | Estrutura, primeira redação, tabelas de rastreabilidade | Alinhamento ao edital e ao SDD; links independentes entre repos |
| **Scaffold** | Next.js App Router, SASS, Vitest, Prettier, Husky | Porta 3001; alias `@/*`; exclusões de cobertura em `src/app/**` |
| **API client** (`lib/api/`) | `client.ts`, funções por endpoint, schemas Zod, testes mockando `fetch` | Contratos espelhados do backend; `ApiClientError` / `ApiValidationError` |
| **Páginas e componentes** | Home, detalhe, filtros, paginação, estados RF11 | Server Components por padrão; `'use client'` só onde há interatividade |
| **Cache ISR** | Helpers `cache.ts`, rota `POST /api/revalidate` | Tags `articles` / `categories` / `tags`; segredo compartilhado com backend |
| **Testes** | Specs Vitest (utils, componentes, API); specs Playwright E2E | E2E contra backend real + seed; não rodam no CI |
| **Estilos** | Tokens SCSS, mixin `respond-from`, layouts mobile-first | Sem Tailwind; breakpoints em `_variables.scss` |
| **Cursor rules** | Rascunho de `.cursor/rules/` | Padrões Next.js espelhando disciplina do backend |

---

## 4. Decisões técnicas revisadas

Registro de escolhas tomadas durante o projeto — em vários casos, a IA sugeriu um caminho diferente do adotado.

| Tema | Alternativa considerada | Decisão adotada | Onde registrar |
|------|-------------------------|-----------------|----------------|
| Fetch de dados | Client-side + BFF ou CORS no backend | Server Components → `lib/api` → `fetch` com `API_URL` | [arquitetura.md §4](./arquitetura.md#4-estratégia-de-fetch-e-cache) |
| Estilização | Tailwind (padrão do ecossistema Next) | SASS Modules + tokens em `styles/` | [SDD §2](./SDD.md#2-stack) |
| Busca e filtros | Estado client + debounce | Form GET (`q`, `category`, `tag`) — URL como fonte de verdade | RF03–RF05 |
| Paginação | Links `<a>` full page reload | Client `Pagination` + `router.push`; scroll suave via `ArticleListRegion` | RF02 |
| Validação de API | Confiar só em TypeScript | Zod na fronteira (`parseApiResponse`) | [arquitetura.md §3](./arquitetura.md#3-boundary-de-dados-zod) |
| Cache | Redis ou SWR no browser | ISR (`revalidate` + `tags`) + webhook do backend | [SDD §4.4](./SDD.md#44-cache-e-invalidação-sem-redis) |
| Streaming na home | Página monolítica async | `<Suspense>` por seção (filtros vs listagem) | [arquitetura.md §4](./arquitetura.md#suspense-granular-home) |
| Testes de página | Cobertura Vitest em `app/` | E2E Playwright local; `src/app/**` excluído do threshold | [arquitetura.md §6](./arquitetura.md#6-tdd-e-testes) |
| E2E no CI | Job com docker-compose no Actions | Adiado — suite local antes de merge; documentado como próximo passo | [SDD §7](./SDD.md#7-próximos-passos) |

**Ajustes relevantes após rascunhos da IA:**

- Paginação fora do intervalo (`?page=99`) redireciona para a última página válida.
- Submit de filtros reseta para página 1; troca de página preserva `q`, `category` e `tag`.
- Webhook de revalidação ignora tags desconhecidas; default `articles` se body vazio.
- Documentação entre repos desacoplada — links para GitHub, não paths locais.

---

## 5. Prompts utilizados

Resumo das principais sessões — objetivo, prompt essencial e resultado. Sem dump de chat completo.

### Planejamento — Claude Sonnet (Agent)

| Sessão | Prompt (resumo) | Resultado |
|--------|-----------------|-----------|
| SDD frontend | *"Com base no edital e no SDD do backend, produza SDD do frontend: rotas RF01–RF06/RF11, contratos consumidos, variáveis de ambiente."* | Rastreabilidade RF/RNF; base URL e tipos alinhados ao backend |
| Arquitetura | *"Proponha camadas Next.js App Router: Server Components, lib/api, SASS Modules, mobile-first, sem fetch no browser."* | Diagrama de camadas; regras de dependência |
| Estratégia de testes | *"Vitest para API client e componentes; Playwright E2E local com backend real; o que excluir da cobertura."* | Threshold 75%; `src/app/**` via E2E |
| Cache sem Redis | *"ISR com tags por recurso + endpoint de revalidação chamado pelo backend após ingestão."* | `cache.ts` + `POST /api/revalidate` |

### Execução — Composer

| Sessão | Prompt (resumo) | Resultado |
|--------|-----------------|-----------|
| Scaffold | *"Next.js 16 + TypeScript strict + SASS Modules + Vitest + Prettier + Husky pre-commit."* | Projeto na porta 3001; scripts alinhados ao CI |
| API client | *"lib/api com fetch wrapper, Zod schemas espelhando SDD backend, testes Vitest mockando fetch."* | `articles`, `categories`, `tags`; TDD no client |
| Home RF01–RF05 | *"Listagem com cards, filtros categoria/tag, busca q, paginação numerada via query string."* | `ArticleFilters`, `Pagination`, Suspense por seção |
| Detalhe RF06 | *"Página /articles/[slug] com ArticleDetailView; 404 vira notFound()."* | Server Component + estados de loading |
| Estados RF11 | *"loading.tsx, error.tsx, not-found.tsx, EmptyState para lista vazia."* | Shell global + detalhe |
| Paginação UX | *"Pagination client: preservar filtros na URL, scroll suave ao trocar página."* | `ArticleListRegion` + utils de paginação |
| E2E | *"Playwright: home listagem/filtros/paginação, detalhe, not-found; backend real na porta 3000."* | `e2e/*.spec.ts`; comentário de setup no config |
| Webhook ISR | *"Rota POST /api/revalidate com X-Revalidate-Secret e revalidateTag."* | Handler testado em Vitest |
| CI Render | *"GitHub Actions: lint, format, test:cov, build; deploy hook só em push main."* | `.github/workflows/ci.yml` |
| Docs independentes | *"Remover links relativos ao backend no disco; manter URLs GitHub e produção Render."* | README e SDD autônomos |

---

## 6. Resumo da solução *(mini documento — revisado manualmente)*

Interface **Next.js 16 (App Router)** que consome a API REST do backend via **fetch server-side**. A especificação ([SDD](./SDD.md) + [requisitos](./requisitos-funcionais-nao-funcionais.md)) guiou a implementação na ordem abaixo.

### Como a especificação guiou a implementação

| Fase | O que o SDD/edital pediu | O que foi entregue |
|------|--------------------------|-------------------|
| 1 | RNF01 TypeScript, stack definida | Scaffold strict + SASS Modules |
| 2 | Contratos da API (tipos, erros) | `lib/api` + Zod + testes Vitest |
| 3 | RF11 estados da interface | `loading` / `error` / `not-found` + componentes vazios |
| 4 | RF01 listagem + RF02 paginação | `ArticleList`, `ArticleCard`, `Pagination` com `meta` da API |
| 5 | RF03–RF05 busca e filtros | Form GET; categorias/tags do backend |
| 6 | RF06 detalhe | `/articles/[slug]` + `notFound()` em 404 |
| 7 | RNF07 testabilidade | Vitest (unit) + Playwright (E2E local) |
| 8 | Cache pós-ingestão (integração backend) | ISR + webhook `POST /api/revalidate` |

Cada RF implementado tem rastreio explícito no [SDD §1](./SDD.md#1-rastreabilidade). O que está fora deste repo (RF07–RF10) aponta para o backend sem acoplar a documentação local.

### Estado atual

| Área | Implementado |
|------|--------------|
| Rotas | `/` (RF01–RF05), `/articles/[slug]` (RF06) |
| Estados | RF11 — loading, error, empty, not-found |
| Integração | 4 endpoints GET; erros `ARTICLE_NOT_FOUND` → `notFound()` |
| Cache | ISR 60s (artigos) / 300s (catálogos); invalidação on-demand |
| Testes | Unitários com cobertura mínima 75%; E2E local |
| Deploy | [portal-noticias-frontend.onrender.com](https://portal-noticias-frontend.onrender.com) |

→ Detalhes: [SDD.md](./SDD.md) · [arquitetura.md](./arquitetura.md)

---

## 7. Trade-offs

| Decisão | Ganho | Custo |
|---------|-------|-------|
| Server Components + fetch server-side | Sem CORS; HTML já com dados; SEO simples | Interatividade limitada sem `'use client'` |
| SASS Modules | Estilos escopados; demonstra skill pedida na vaga | Mais verboso que utility-first (Tailwind) |
| URL como estado (form GET) | Compartilhável, refresh-safe, alinhado ao REST | Sem debounce na busca (submit explícito) |
| Zod na fronteira | Falha cedo se API divergir do contrato | Overhead de manutenção dos schemas |
| ISR + webhook (sem Redis) | Compatível com Render; invalidação após ingestão | Depende do backend chamar o webhook; TTL cobre falha |
| E2E só local | Confiança real (PG + OpenSearch + seed) | Não roda no CI; regressão depende de disciplina pré-merge |
| Páginas fora da cobertura unitária | Threshold alcançável; lógica testada em lib/components | Cobertura de `app/` só via Playwright manual |
| Repos separados | Deploy e evolução independentes | Dois SDDs para manter alinhados |

---

## 8. Premissas, dúvidas e próximos passos

**Premissas:**

- Backend disponível em `API_URL`; sem CORS — toda chamada à API é server-side.
- Contratos estáveis conforme [SDD do backend](https://github.com/Lucas-Braz7x/portal-noticias-backend/blob/main/docs/SDD.md#4-contratos-da-api).
- `REVALIDATE_SECRET` idêntico nos dois serviços Render para invalidação ISR.
- Seed do backend suficiente para E2E local reproduzível.

**Dúvidas registradas (não bloqueantes):**

- Debounce na busca exigiria `'use client'` ou CORS — adiado; form GET atende o edital.
- Imagens nos cards não são RF — layout preparado para evoluir.

**Próximos passos (frontend):**

1. E2E no CI — job GitHub Actions com docker-compose do backend
2. Open Graph / metadata avançada com `NEXT_PUBLIC_SITE_URL`
3. Debounce opcional na busca (se CORS ou BFF entrarem no escopo)
4. Dark mode persistido (`ThemeToggle` já existe no layout)
5. Artigos relacionados no detalhe

---

*Versão: 2.0 — Agosto/2026*
