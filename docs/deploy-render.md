# Deploy no Render — Frontend

Guia para publicar a interface Next.js no **Render**, integrada à API do [backend](https://github.com/Lucas-Braz7x/portal-noticias-backend) (repositório separado).

| Projeto | Repositório | Produção |
|---------|-------------|----------|
| Frontend (este repo) | [github.com/Lucas-Braz7x/portal-noticias-frontend](https://github.com/Lucas-Braz7x/portal-noticias-frontend) | [portal-noticias-frontend.onrender.com](https://portal-noticias-frontend.onrender.com) |
| Backend (API) | [github.com/Lucas-Braz7x/portal-noticias-backend](https://github.com/Lucas-Braz7x/portal-noticias-backend) | [portal-noticias-backend.onrender.com](https://portal-noticias-backend.onrender.com/) |

Setup completo da API, Postgres e OpenSearch: [deploy-render.md do backend](https://github.com/Lucas-Braz7x/portal-noticias-backend/blob/main/docs/deploy-render.md).

---

## Visão geral

| Serviço Render | Tipo | Build command | Start command |
|----------------|------|---------------|---------------|
| `portal-noticias-frontend` | Web Service | `yarn install && yarn build` | `yarn start` |

O frontend roda na **porta 3001** (configurada no `package.json`). No Render, defina a porta exposta como **3001** se o dashboard solicitar.

**Fluxo de cache:**

```
Server Component → fetch(API_URL) com ISR (tags + revalidate)
Ingestão no backend → POST /api/revalidate (webhook) → revalidateTag no Next.js
```

---

## Pré-requisitos

- Conta no [Render](https://render.com)
- API backend já deployada e acessível (ex.: `https://portal-noticias-backend.onrender.com/api/v1`)
- Repositório conectado ao GitHub

---

## 1. Web Service (frontend)

| Campo | Valor |
|-------|-------|
| Repositório | [portal-noticias-frontend](https://github.com/Lucas-Braz7x/portal-noticias-frontend) |
| Build Command | `yarn install && yarn build` |
| Start Command | `yarn start` |
| Node.js | 22 (alinhado ao CI) |

### Variáveis de ambiente

| Variável | Valor sugerido (produção) | Obrigatório |
|----------|---------------------------|-------------|
| `API_URL` | `https://portal-noticias-backend.onrender.com/api/v1` | Sim |
| `NEXT_PUBLIC_SITE_URL` | `https://portal-noticias-frontend.onrender.com` | Sim |
| `REVALIDATE_SECRET` | Segredo forte (mesmo valor no backend) | Sim (ISR on-demand) |

> `API_URL` é lida em **runtime** no servidor Next.js — não precisa ser `NEXT_PUBLIC_*`.

### Alinhar com o backend

No serviço da **API**, configure:

| Variável backend | Valor |
|------------------|-------|
| `FRONTEND_REVALIDATE_URL` | `https://portal-noticias-frontend.onrender.com/api/revalidate` |
| `REVALIDATE_SECRET` | Idêntico ao deste serviço |

Sem essas variáveis no backend, o frontend ainda funciona — conteúdo novo aparece após o TTL do ISR (60s artigos / 300s catálogos).

---

## 2. CI/CD (GitHub Actions + Render)

### Fluxo

| Evento | GitHub Actions | Render |
|--------|----------------|--------|
| Pull request | `quality`, `unit`, `build` | PR Preview automático (dashboard) |
| Push em `main` com CI verde | Job `deploy` dispara deploy hook | Build e deploy de produção |

Pipeline: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

### Dashboard Render (configuração manual)

1. **Settings → Build & Deploy → Auto-Deploy**: **No** — produção só via hook após CI verde.
2. **Settings → Deploy Hook**: copiar URL para o secret `RENDER_DEPLOY_HOOK_URL` no GitHub.
3. **Previews → Pull Request Previews**: **Automatic** (opcional).

### Secret no GitHub

**Settings → Secrets and variables → Actions**:

| Secret | Valor |
|--------|-------|
| `RENDER_DEPLOY_HOOK_URL` | Deploy hook deste serviço no Render |

Nunca commitar URLs de deploy hook. Se exposta, use **Regenerate Hook** no Render ([documentação](https://render.com/docs/deploy-hooks)).

### Preview em PR (limitação cross-repo)

Frontend e backend são repos separados — números de PR não coincidem. Para previews do frontend, defina `API_URL` nas **Preview Environment Variables** apontando à API de **produção** ou staging fixa.

---

## 3. Verificação

```bash
# Home deve responder 200
curl -I https://portal-noticias-frontend.onrender.com

# Webhook (substitua o segredo)
curl -X POST https://portal-noticias-frontend.onrender.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "X-Revalidate-Secret: $REVALIDATE_SECRET" \
  -d '{"tags":["articles"]}'
# → {"revalidated":true,"tags":["articles"]}
```

Checklist:

1. PR aberto → CI roda; Render cria preview (URL no PR).
2. Push em `main` com CI verde → job `deploy` dispara build.
3. Após ingestão no backend → listagem atualiza (webhook ou TTL ISR).
4. Auto-deploy desligado no Render (produção só via hook).

---

## Troubleshooting

| Sintoma | Causa provável |
|---------|----------------|
| Página sem artigos | `API_URL` incorreta ou API offline |
| Build falha no Render | Variáveis ausentes — `yarn build` precisa de `API_URL` e `NEXT_PUBLIC_SITE_URL` |
| Conteúdo desatualizado após ingestão | `REVALIDATE_SECRET` divergente ou `FRONTEND_REVALIDATE_URL` ausente no backend |
| Preview PR sem dados | `API_URL` do preview não aponta para API acessível |
| Erro 401 no webhook | `X-Revalidate-Secret` incorreto ou `REVALIDATE_SECRET` vazio no frontend |

---

*Versão: 1.0 — Agosto/2026*
