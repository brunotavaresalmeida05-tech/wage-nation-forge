# WageCompany — AI Agent Context
> Este ficheiro é lido por QUALQUER agente de IA: Claude Code, Cursor, Copilot, Windsurf, Codeium, etc.
> Coloca-o na raiz do projecto. Todos os agentes modernos procuram ficheiros de contexto na raiz.

---

## O QUE É ESTE PROJECTO

WageCompany é um **sistema económico digital soberano** — aplicação play-to-earn com:
- Dual-token economy: **$MINE** (trabalho, off-chain) + **$WAGE** (capital, on-chain ERC-20)
- Activos sintéticos: imóveis, acções, ETFs, obrigações
- DeFi interno: empréstimos, staking, vault
- Blockchain real: Base (L2 Ethereum)
- UBI (Renda Base Universal) em $WAGE

**Repositório:** https://github.com/wagecompanyoficial-a11y/wage-nation-forge

---

## STACK TÉCNICA

```
Frontend:    Vite 5 + React 18 + TypeScript (strict mode)
UI:          shadcn/ui + Tailwind CSS + Radix UI
State:       Zustand + React Query (TanStack)
Auth:        Clerk
Database:    Supabase (PostgreSQL + RLS + pgcrypto)
Blockchain:  Base Sepolia → Base Mainnet
Web3:        wagmi v2 + viem
Deploy:      Vercel + Supabase
Tests:       Vitest + Playwright
PackageMgr:  npm (NUNCA bun ou yarn neste projecto)
```

---

## ESTRUTURA DE PASTAS

```
wage-nation-forge/
├── AI_CONTEXT.md              ← Este ficheiro (ler PRIMEIRO)
├── .ai/                       ← Skills detalhadas por área
│   ├── README.md              ← Índice das skills
│   └── skills/
│       ├── security-audit/    ← Segurança e encriptação
│       ├── database/          ← Supabase, SQL, RLS
│       ├── frontend-ui/       ← React, componentes, design
│       ├── economy-logic/     ← Cálculos financeiros
│       ├── blockchain/        ← Smart contracts, wagmi
│       └── testing/           ← Vitest, Playwright
├── src/
│   ├── components/            ← Componentes React
│   │   └── ui/                ← shadcn (NÃO EDITAR)
│   ├── pages/                 ← Uma página por rota
│   ├── hooks/                 ← Custom hooks
│   ├── lib/                   ← supabase.ts, wagmi.ts, utils.ts
│   └── types/                 ← TypeScript types
├── supabase/
│   ├── migrations/            ← SQL versionado (001_, 002_...)
│   └── functions/             ← Edge Functions (server-side)
├── contracts/                 ← Solidity smart contracts
└── tests/                     ← E2E com Playwright
```

---

## REGRAS ABSOLUTAS (para qualquer agente)

### NUNCA fazer
- Lógica financeira no React/frontend — vai sempre para Edge Functions
- Expor variáveis sem prefixo `VITE_` ao browser
- Usar `any` em TypeScript sem justificação comentada
- Fazer queries Supabase sem RLS verificado
- Guardar chaves/segredos no código ou commits
- Alterar constantes económicas sem autorização do owner
- Usar `bun` ou `yarn` — apenas `npm`

### SEMPRE fazer
- Validar inputs com **Zod** em todas as Edge Functions
- Verificar **autenticação Clerk** antes de qualquer operação
- Registar operações financeiras no **audit_log**
- Usar **transacções SQL** para operações multi-tabela
- Encriptar campos sensíveis com **pgcrypto AES-256**
- Escrever testes para lógica económica

---

## CONSTANTES ECONÓMICAS (IMUTÁVEIS)

```typescript
// Nunca alterar sem autorização do owner do projecto
MINE_PER_TAP_BASE    = 1
ENERGY_PER_TAP       = 1
ENERGY_REGEN         = 1 energia / 3 segundos
EXCHANGE_RATE        = 1000 $MINE = 1 $WAGE
TREASURY_RATE        = 0.5%   (vai para tesouro da empresa)
BURN_RATE            = 2%     (queimado permanentemente)
TOTAL_SUPPLY_CAP     = 1.000.000.000 $WAGE (hard-capped)
HALVING_INTERVAL     = 180 dias
HALVING_REDUCTION    = 35% por halving
```

---

## ESTADO ACTUAL DO PROJECTO

- [x] UI completa (todas as páginas com design)
- [x] Design system (#181818, #00C22C integrados)
- [x] Lovable removido
- [x] Skills de IA criadas
- [ ] **EM CURSO:** Supabase schema + Auth Clerk (Fase 1)
- [ ] Tap funcional com Edge Functions
- [ ] Exchange $MINE → $WAGE
- [ ] Smart contract $WAGE deployado

---

## CONVENÇÕES DE CÓDIGO

```
Componentes:   PascalCase.tsx      → TapToMine.tsx
Hooks:         use + camelCase.ts  → useProfile.ts
Utils:         camelCase.ts        → formatBalance.ts
Páginas:       PascalCase + Page   → DashboardPage.tsx
Types:         PascalCase + Type   → ProfileType
Constantes:    SCREAMING_SNAKE     → MINE_PER_TAP
Edge Functions: kebab-case/        → mine-tap/
SQL migrations: NNN_descricao.sql  → 001_initial_schema.sql
```

---

## COMMITS

```
feat:     nova funcionalidade
fix:      correcção de bug
security: melhoria de segurança
test:     testes
docs:     documentação
chore:    manutenção
refactor: refactoring sem mudança de comportamento
```

---

## SKILLS DETALHADAS

Para contexto aprofundado sobre cada área, ler os ficheiros em `.ai/skills/`:

| Área | Ficheiro | Quando ler |
|------|---------|-----------|
| Segurança | `.ai/skills/security-audit/SKILL.md` | Qualquer tarefa com BD, auth ou API |
| Base de dados | `.ai/skills/database/SKILL.md` | Supabase, SQL, migrations, RLS |
| Frontend | `.ai/skills/frontend-ui/SKILL.md` | Componentes, páginas, hooks |
| Economia | `.ai/skills/economy-logic/SKILL.md` | Cálculos financeiros, tap, exchange |
| Blockchain | `.ai/skills/blockchain/SKILL.md` | Smart contracts, wagmi, Base |
| Testes | `.ai/skills/testing/SKILL.md` | Vitest, Playwright |
