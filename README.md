# Portal de Notícias — Frontend

Interface web do portal de notícias/artigos, desenvolvida como parte do desafio técnico da **Gazeta do Povo**.

|                 |                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Repositório** | [github.com/Lucas-Braz7x/portal-noticias-frontend](https://github.com/Lucas-Braz7x/portal-noticias-frontend) |
| **Produção**    | [portal-noticias-frontend.onrender.com](https://portal-noticias-frontend.onrender.com)                       |

Construída com **Next.js 16 (App Router)**, **TypeScript strict** e **SASS Modules**, consumindo a API REST do backend ([repositório separado](https://github.com/Lucas-Braz7x/portal-noticias-backend)).

---

## Stack

| Camada          | Tecnologia                            |
| --------------- | ------------------------------------- |
| Framework       | Next.js 16 (App Router)               |
| Linguagem       | TypeScript strict                     |
| Estilização     | SASS Modules                          |
| Testes          | Vitest + Testing Library + Playwright |
| Package manager | Yarn 1.22                             |

---

## Pré-requisitos

- Node.js 20+
- Yarn 1.22+
- Backend rodando em `http://localhost:3000` (ver [portal-noticias-backend](https://github.com/Lucas-Braz7x/portal-noticias-backend))

---

## Como rodar

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/Lucas-Braz7x/portal-noticias-frontend.git
cd portal-noticias-frontend
yarn install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

| Variável               | Descrição                                                          | Exemplo                        |
| ---------------------- | ------------------------------------------------------------------ | ------------------------------ |
| `API_URL`              | Base URL da API backend                                            | `http://localhost:3000/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | URL pública do frontend                                            | `http://localhost:3001`        |
| `REVALIDATE_SECRET`    | Segredo do webhook `POST /api/revalidate` (mesmo valor no backend) | — (opcional em dev)            |

### Cache no Render

O frontend usa ISR (`revalidate` + `tags`). Após ingestão, o backend chama `POST /api/revalidate` com header `X-Revalidate-Secret` para invalidar `articles`, `categories` e `tags` imediatamente. Configure `REVALIDATE_SECRET` no frontend e no backend (`FRONTEND_REVALIDATE_URL` apontando para este serviço).

### 3. Iniciar o servidor de desenvolvimento

```bash
yarn dev
```

Acesse [http://localhost:3001](http://localhost:3001).

---

## Scripts

| Script              | Descrição                                        |
| ------------------- | ------------------------------------------------ |
| `yarn dev`          | Servidor de desenvolvimento (porta 3001)         |
| `yarn build`        | Build de produção                                |
| `yarn start`        | Servidor de produção (porta 3001)                |
| `yarn lint`         | ESLint                                           |
| `yarn format`       | Prettier (write)                                 |
| `yarn format:check` | Prettier (check)                                 |
| `yarn test`         | Testes unitários (Vitest)                        |
| `yarn test:watch`   | Testes em modo watch                             |
| `yarn test:cov`     | Testes unitários + cobertura (mínimo global 75%) |
| `yarn test:e2e`     | Testes E2E (Playwright) — apenas local           |
| `yarn test:e2e:ui`  | Playwright com UI mode                           |

---

## Testes unitários

| Tipo     | Comando                       | Escopo                          |
| -------- | ----------------------------- | ------------------------------- |
| Unitário | `yarn test` / `yarn test:cov` | API client, utils, componentes  |
| E2E      | `yarn test:e2e`               | Fluxos RF01–RF06 e RF11 (local) |

```bash
yarn test              # unitários
yarn test:cov          # unitários + cobertura (mínimo global 75%)
yarn test:watch        # unitários em modo interativo
```

Arquivos excluídos da cobertura unitária: `src/app/**` (páginas e layouts — validados via E2E local) e `src/types/**` (apenas tipos).

O **[Husky](https://typicode.github.io/husky/)** executa `yarn lint`, `yarn format:check` e `yarn test:cov` no **pre-commit**.

---

## CI

O pipeline em [`.github/workflows/ci.yml`](.github/workflows/ci.yml) roda em **push** e **pull request** para `main`/`master`, com **Node.js 22**:

| Job       | Comando(s)                       | Infra                                     |
| --------- | -------------------------------- | ----------------------------------------- |
| `quality` | `yarn lint`, `yarn format:check` | —                                         |
| `unit`    | `yarn test:cov`                  | —                                         |
| `build`   | `yarn build`                     | —                                         |
| `deploy`  | deploy hook Render               | só em **push** em `main`, após jobs acima |

O job `deploy` dispara o deploy de produção no Render via secret `RENDER_DEPLOY_HOOK_URL`. PR previews são criados automaticamente pelo Render. Ver [docs/deploy-render.md § CI/CD](./docs/deploy-render.md#2-cicd-github-actions--render).

Para reproduzir localmente os mesmos passos do CI:

```bash
yarn lint && yarn format:check && yarn test:cov
API_URL=http://localhost:3000/api/v1 NEXT_PUBLIC_SITE_URL=http://localhost:3001 yarn build
```

---

## Testes E2E (local)

Os testes E2E usam **Playwright** contra o backend real (não mock). **Não rodam no GitHub Actions** — validação manual/local antes de merge.

### Pré-requisitos

1. Clone e configure o [repositório do backend](https://github.com/Lucas-Braz7x/portal-noticias-backend): `docker compose up -d`
2. Migrations e seed no backend: `yarn prisma:migrate` e `yarn prisma db seed`
3. API rodando no backend: `yarn start:dev` (porta 3000)

### Executar

```bash
yarn test:e2e
```

O Playwright inicia o frontend automaticamente (`yarn dev` localmente; `yarn build && yarn start` com `CI=true`). Para UI interativa: `yarn test:e2e:ui`.

---

## Rotas

| Rota               | RF                          | Status                                  |
| ------------------ | --------------------------- | --------------------------------------- |
| `/`                | RF01–RF05                   | ✅ Listagem, busca, filtros e paginação |
| `/articles/[slug]` | RF06                        | ✅ Detalhe do artigo                    |
| Estados RF11       | loading / error / not-found | ✅ Implementado                         |

---

## Arquitetura

Camadas simples com **Server Components** por padrão e fetch server-side para a API (backend sem CORS):

```
App Router (pages) → lib/api → Backend REST
                 ↘ components/ (apresentação)
```

- **Páginas** — Server Components; dados via `lib/api/`, nunca `fetch` direto na UI
- **`lib/api/`** — client HTTP, schemas Zod, cache ISR (`tags` + `revalidate`)
- **`components/`** — layout, artigos, estados RF11 (apresentacionais)
- **`POST /api/revalidate`** — webhook ISR chamado pelo backend após ingestão

**Mobile-first** com SASS Modules — ver [docs/mobile-first.md](./docs/mobile-first.md).

Documentação completa: [docs/arquitetura.md](./docs/arquitetura.md) · produção: [docs/arquitetura-producao.md](./docs/arquitetura-producao.md)

---

## Estrutura do projeto

```
src/
├── app/              # App Router (pages, layouts, estados, _components/)
├── components/       # layout/, ui/, articles/
├── lib/
│   ├── api/          # client, articles, categories, tags, schemas, cache
│   ├── revalidate/   # handle-revalidate-request (webhook ISR)
│   ├── constants/    # pagination (limites e opções de página)
│   └── utils/        # list-params, pagination, format-date, etc.
├── types/            # Contratos da API
└── styles/           # Tokens e mixins SCSS

test/                 # Testes Vitest
e2e/                  # Testes Playwright E2E (local)
.husky/               # git hooks (pre-commit → lint, format, test:cov)
docs/                 # SDD, arquitetura, deploy, requisitos, roadmap
```

---

## Documentação

| Documento                                                                                      | Conteúdo                                 |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [docs/requisitos-funcionais-nao-funcionais.md](./docs/requisitos-funcionais-nao-funcionais.md) | Baseline do edital (RF/RNF)              |
| [docs/SDD.md](./docs/SDD.md)                                                                   | Rastreabilidade, rotas, contratos da API |
| [docs/arquitetura.md](./docs/arquitetura.md)                                                   | Camadas, fetch, testes                   |
| [docs/arquitetura-producao.md](./docs/arquitetura-producao.md)                                 | Render, ISR, integração com a API        |
| [docs/mobile-first.md](./docs/mobile-first.md)                                                 | Breakpoints, mixin `respond-from`, grids |
| [docs/deploy-render.md](./docs/deploy-render.md)                                               | Deploy no Render e CI/CD                 |
| [docs/proximos-passos.md](./docs/proximos-passos.md)                                           | Roadmap: E2E no CI, SEO, auth, i18n      |
| [docs/uso-de-ia.md](./docs/uso-de-ia.md)                                                       | Uso responsável de IA (RNF16)            |

### Uso de IA (RNF16)

A IA (**Cursor** — Sonnet para planejamento, Composer para execução) foi usada como **acelerador de rascunhos**, não como autor do projeto. Decisões de arquitetura, contratos da API, UX e merge ficaram sob revisão manual.

| Onde ajudou         | Exemplos de prompt (resumo)                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| Documentação        | _"SDD frontend com rotas RF01–RF06/RF11 e contratos consumidos do backend"_ |
| API client + testes | _"lib/api com Zod espelhando SDD backend; Vitest mockando fetch"_           |
| UI e fluxos         | _"Home com filtros GET, paginação numerada e Suspense por seção"_           |
| Cache ISR           | _"Tags por recurso + POST /api/revalidate com segredo compartilhado"_       |

Decisões revisadas manualmente: Server Components (backend sem CORS), SASS Modules, URL como estado dos filtros, E2E Playwright só local, docs independentes entre repos.

Documento completo — prompts, trade-offs, premissas e mini resumo da solução: **[docs/uso-de-ia.md](./docs/uso-de-ia.md)**.

---

## Backend (repositório separado)

|                 |                                                                                                            |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| **Repositório** | [github.com/Lucas-Braz7x/portal-noticias-backend](https://github.com/Lucas-Braz7x/portal-noticias-backend) |
| **Produção**    | [portal-noticias-backend.onrender.com](https://portal-noticias-backend.onrender.com/)                      |

Contratos da API (endpoints, payloads, erros): [SDD do backend — § Contratos da API](https://github.com/Lucas-Braz7x/portal-noticias-backend/blob/main/docs/SDD.md#4-contratos-da-api).

---

## API backend

O frontend consome a API em `API_URL` (em produção: `https://portal-noticias-backend.onrender.com/api/v1`). Chamadas são **server-side** (Server Components) — o backend não habilita CORS.

Endpoints utilizados:

- `GET /articles` — listagem, busca, filtros e paginação
- `GET /articles/:slug` — detalhe do artigo
- `GET /categories` — opções do filtro de categoria
- `GET /tags` — opções do filtro de tag

---

## Variáveis de ambiente

| Variável               | Descrição                                                          | Default / exemplo (dev)        |
| ---------------------- | ------------------------------------------------------------------ | ------------------------------ |
| `API_URL`              | Base URL da API backend (Server Components)                        | `http://localhost:3000/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | URL pública do frontend (metadata, SEO, links absolutos)           | `http://localhost:3001`        |
| `REVALIDATE_SECRET`    | Segredo do webhook `POST /api/revalidate` (mesmo valor no backend) | — (opcional em dev)            |

Em **produção** (Render): ver [docs/deploy-render.md](./docs/deploy-render.md). Alinhar `FRONTEND_REVALIDATE_URL` e `REVALIDATE_SECRET` no backend.

Deploy completo: [docs/deploy-render.md](./docs/deploy-render.md).

---

## Commits

Este projeto segue **[Conventional Commits](https://www.conventionalcommits.org/)**:

```
<type>(<scope>): <descrição curta>
```

| Tipo       | Uso                                      |
| ---------- | ---------------------------------------- |
| `feat`     | Nova funcionalidade                      |
| `fix`      | Correção de bug                          |
| `docs`     | Documentação                             |
| `test`     | Testes                                   |
| `chore`    | Manutenção (deps, configs, tooling)      |
| `refactor` | Refatoração sem mudança de comportamento |

---

## Licença

Projeto privado — uso exclusivo para avaliação técnica.
