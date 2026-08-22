# Portal de Notícias — Frontend

Interface web do portal de notícias/artigos, desenvolvida como parte do desafio técnico da **Gazeta do Povo**.

Construída com **Next.js 16 (App Router)**, **TypeScript strict** e **SASS Modules**, consumindo a API REST do backend.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript strict |
| Estilização | SASS Modules |
| Testes | Vitest + Testing Library + Playwright |
| Package manager | Yarn 1.22 |

---

## Pré-requisitos

- Node.js 20+
- Yarn 1.22+
- Backend rodando em `http://localhost:3000` (ver [portal-noticias-backend](../portal-noticias-backend))

---

## Como rodar

### 1. Instalar dependências

```bash
yarn install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `API_URL` | Base URL da API backend | `http://localhost:3000/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | URL pública do frontend | `http://localhost:3001` |

### 3. Iniciar o servidor de desenvolvimento

```bash
yarn dev
```

Acesse [http://localhost:3001](http://localhost:3001).

---

## Scripts

| Script | Descrição |
|--------|-----------|
| `yarn dev` | Servidor de desenvolvimento (porta 3001) |
| `yarn build` | Build de produção |
| `yarn start` | Servidor de produção (porta 3001) |
| `yarn lint` | ESLint |
| `yarn format` | Prettier (write) |
| `yarn format:check` | Prettier (check) |
| `yarn test` | Testes unitários (Vitest) |
| `yarn test:watch` | Testes em modo watch |
| `yarn test:e2e` | Testes E2E (Playwright) |
| `yarn test:e2e:ui` | Playwright com UI mode |

---

## Testes E2E

Os testes E2E usam **Playwright** contra o backend real (não mock).

### Pré-requisitos

1. Infraestrutura do backend: `docker compose up -d` em [portal-noticias-backend](../portal-noticias-backend)
2. Migrations e seed: `yarn prisma:migrate` e `yarn prisma db seed`
3. API rodando: `yarn start:dev` (porta 3000)

### Executar

```bash
yarn test:e2e
```

O Playwright inicia o frontend automaticamente (`yarn dev` localmente; build + start em CI). Para UI interativa: `yarn test:e2e:ui`.

---

## Rotas

| Rota | RF | Status |
|------|----|--------|
| `/` | RF01–RF05 | ✅ Listagem, busca, filtros e paginação |
| `/articles/[slug]` | RF06 | ✅ Detalhe do artigo |
| Estados RF11 | loading / error / not-found | ✅ Implementado |

---

## Estrutura do projeto

```
src/
├── app/              # App Router (pages, layouts, estados)
├── components/       # layout/, ui/, articles/
├── lib/
│   ├── api/          # client.ts, articles.ts
│   ├── constants/    # filtros (categorias/tags)
│   └── utils/        # format-date, list-params
├── types/            # Contratos da API
└── styles/           # Tokens e mixins SCSS

test/                 # Testes Vitest
e2e/                  # Testes Playwright E2E
docs/                 # SDD, arquitetura, requisitos
```

---

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [docs/requisitos-funcionais-nao-funcionais.md](./docs/requisitos-funcionais-nao-funcionais.md) | Baseline do edital (RF/RNF) |
| [docs/SDD.md](./docs/SDD.md) | Rastreabilidade, rotas, contratos da API |
| [docs/arquitetura.md](./docs/arquitetura.md) | Camadas, fetch, testes |
| [docs/uso-de-ia.md](./docs/uso-de-ia.md) | Uso responsável de IA (RNF16) |

Contratos da API: [SDD do backend](../portal-noticias-backend/docs/SDD.md#4-contratos-da-api).

---

## API backend

O frontend consome a API em `API_URL`. Chamadas são **server-side** (Server Components) — o backend não habilita CORS.

Endpoints utilizados:

- `GET /articles` — listagem, busca e filtros
- `GET /articles/:slug` — detalhe do artigo
