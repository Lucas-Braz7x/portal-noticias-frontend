# Uso de IA no desenvolvimento — Frontend

> Atende [RNF16 — Uso responsável de IA](./requisitos-funcionais-nao-funcionais.md#rnf16--uso-responsável-de-ia).

---

## 1. Contexto

Desenvolvimento do frontend do desafio técnico da **Gazeta do Povo**, em repositório separado do backend. O setup inicial foi planejado e executado com auxílio de IA no **Cursor**, seguindo os mesmos princípios do backend: documentação antes do código, TDD no API client e revisão manual.

---

## 2. Onde a IA entrou (setup inicial)

| Área | Contribuição da IA | Revisão / decisão final |
|------|--------------------|-------------------------|
| **Plano de setup** | Estrutura de pastas, stack, ordem de execução | Alinhamento ao SDD do backend e edital |
| **API client** | Tipos, `client.ts`, `articles.ts`, teste Vitest | Contratos espelhados do backend |
| **App shell** | Layout, placeholders, componentes RF11 | SASS Modules; Server Components |
| **Documentação** | SDD, arquitetura, README | Rastreabilidade RF/RNF |
| **Cursor rules** | Adaptação das rules do backend | Padrões específicos Next.js |

---

## 3. Decisões técnicas

| Tema | Decisão |
|------|---------|
| Framework | Next.js 16 App Router (CLI instalou versão mais recente; atende RNF01 "14+") |
| Estilização | SASS Modules (demonstra skill da vaga; edital não exige framework CSS) |
| Fetch | Server-side via `lib/api` (backend sem CORS) |
| Testes | Vitest + Testing Library (espelha TDD do backend com Jest) |

---

## 4. Documentação

Os arquivos em `docs/` foram redigidos com auxílio de IA e revisados manualmente.

| Documento | Foco |
|-----------|------|
| [requisitos-funcionais-nao-funcionais.md](./requisitos-funcionais-nao-funcionais.md) | Cópia fiel do edital (baseline compartilhada com backend) |
| [SDD.md](./SDD.md) | Rastreabilidade RF01–RF06/RF11 no frontend |
| [arquitetura.md](./arquitetura.md) | Camadas, fetch, testes |

---

## 5. Próximos passos

Implementação das features RF01–RF06 com o mesmo fluxo: consultar docs → teste → implementação → revisão.

---

*Versão: 1.0 — Agosto/2026*
