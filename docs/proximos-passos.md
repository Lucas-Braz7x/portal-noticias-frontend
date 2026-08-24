# Próximos Passos — Frontend

> Roadmap de melhorias priorizadas para a interface Next.js.
>
> Contexto: [arquitetura de produção](./arquitetura-producao.md) · [SDD](./SDD.md) · [arquitetura](./arquitetura.md)

---

## Prioridade Alta

### 1. E2E no CI

**Motivação:** Playwright cobre RF01–RF06 e RF11, mas **só roda localmente**. Regressões em páginas (`src/app/**`, excluídas da cobertura Vitest) dependem de disciplina pré-merge.

**O que implementar:**

1. Job `e2e` no GitHub Actions deste repositório (ou workflow cross-repo)
2. Subir infra do [backend](https://github.com/Lucas-Braz7x/portal-noticias-backend) via `docker compose` + seed
3. Playwright contra `localhost:3001` (frontend) + API em `localhost:3000`
4. Cache de imagens Docker no CI para reduzir tempo

**Referência cruzada:** item 7 em [proximos-passos.md do backend](https://github.com/Lucas-Braz7x/portal-noticias-backend/blob/main/docs/proximos-passos.md).

---

### 2. Metadata e Open Graph

**Motivação:** `NEXT_PUBLIC_SITE_URL` já existe; falta enriquecer `<meta>` por página (título do artigo, descrição, imagem social).

**O que implementar:**

1. `generateMetadata` em `/` e `/articles/[slug]`
2. Open Graph + Twitter cards
3. `canonical` URL com base em `NEXT_PUBLIC_SITE_URL`

---

## Prioridade Média

### 3. Debounce na busca (opcional)

**Motivação:** hoje a busca usa form GET com submit explícito — atende o edital e é refresh-safe. Debounce melhoraria UX, mas exige `'use client'` ou CORS/BFF no backend.

**Opções:**

| Opção | Prós | Contras |
|-------|------|---------|
| Manter form GET | URL compartilhável, sem CORS | Sem debounce |
| Client debounce + `router.push` | UX fluida | Mais JS no cliente |
| BFF route handler | Mantém fetch server-side | Camada extra |

---

### 4. Dark mode persistido

**Motivação:** `ThemeToggle` existe no layout, mas a preferência não persiste entre sessões.

**O que implementar:**

1. Salvar tema em `localStorage` ou cookie (`theme=dark|light`)
2. Script inline no `layout.tsx` para evitar flash (FOUC)
3. Respeitar `prefers-color-scheme` como default

---

### 5. Autenticação (painel editorial)

**Motivação:** fora do escopo mínimo. Quando o backend adotar JWT/Cognito, o frontend precisará de fluxo de login.

**Implementação sugerida:**

1. `next-auth` ou Auth.js com provider alinhado ao backend
2. Rotas `/admin/*` protegidas por middleware
3. Server Components continuam buscando API com token server-side

---

## Prioridade Baixa / Diferenciais

### 6. Artigos relacionados no detalhe

**Motivação:** melhora engajamento; não é RF do edital.

**O que implementar:** seção no `ArticleDetailView` com artigos da mesma categoria ou tags compartilhadas (novo param ou endpoint no backend).

---

### 7. Imagens nos cards

**Motivação:** layout atual é texto; cards suportam evolução visual.

**O que implementar:** campo `imageUrl` no contrato (backend) + `next/image` nos cards com fallback.

---

### 8. Internacionalização

**Motivação:** portal monolíngue atende o desafio; i18n seria evolução de produto.

**Implementação sugerida:** `next-intl` com rotas `[locale]/` ou prefixo de URL.

---

### 9. Cache complementar (Redis no backend)

**Motivação:** quando o backend adotar ElastiCache, o frontend pode manter ISR agressivo — webhook continua como invalidação primária; TTL como rede de segurança.

---

## Sumário de prioridades

| # | Item | Impacto | Esforço | Quando |
|---|------|---------|---------|--------|
| 1 | E2E no CI | Alto | Médio | Antes de times maiores / merge frequente |
| 2 | Open Graph / SEO | Médio | Baixo | Antes de compartilhamento social |
| 3 | Debounce busca | Baixo | Baixo | Se UX pedir; form GET já atende edital |
| 4 | Dark mode persistido | Baixo | Baixo | Quick win de UX |
| 5 | Autenticação | Alto | Alto | Com painel editorial no backend |
| 6 | Artigos relacionados | Baixo | Médio | Diferencial de produto |
| 7 | Imagens nos cards | Baixo | Médio | Depende de contrato backend |
| 8 | i18n | Baixo | Alto | Evolução de produto |
| 9 | Redis + ISR | Médio | Baixo | Com ElastiCache no backend |

---

*Versão: 1.0 — Agosto/2026*
