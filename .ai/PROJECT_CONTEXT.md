# WageCompany — Contexto Completo do Projecto
> Lê este ficheiro PRIMEIRO antes de qualquer tarefa de desenvolvimento.
> Última actualização: 2026-03-22

---

## 1. O QUE É O WAGECOMPANY

WageCompany é um **sistema económico digital soberano** — uma aplicação play-to-earn que funciona como uma economia nacional sintética. Os utilizadores ganham dinheiro digital trabalhando (tapping), investindo em activos sintéticos e participando na economia interna.

### Conceito central
- **WageCompany** = Banco Central + Governo digital
- **Utilizador** = Cidadão/Trabalhador digital
- **$MINE** = Moeda de trabalho (soft currency, abundante, inflacionária, off-chain)
- **$WAGE** = Moeda de capital (hard currency, escassa, deflacionária, on-chain ERC-20)
- **Tesouro** = Reservas centrais da empresa (acumula taxas, gere liquidez)

### Inspirações de produto
- **World App (Worldcoin)** — UX/design, carteira digital, identidade
- **Hamster Kombat** — loop de tap-to-earn, tarefas diárias
- **Axie Infinity / StepN** — dual-token economy
- **Compound / Aave** — DeFi interno (empréstimos, staking)

---

## 2. STACK TÉCNICA COMPLETA

```
Frontend:     Vite + React 18 + TypeScript (strict)
UI:           shadcn/ui + Tailwind CSS + Radix UI
State:        Zustand (global) + React Query (server state)
Auth:         Clerk (JWT, sessions, webhooks)
Database:     Supabase (PostgreSQL + RLS + pgcrypto)
Blockchain:   Base Sepolia (testnet) → Base Mainnet
Web3:         wagmi v2 + viem
Smart Contract: Solidity (ERC-20 $WAGE token)
Deploy:       Vercel (frontend) + Supabase (backend)
CI/CD:        GitHub Actions
Tests:        Vitest (unit) + Playwright (E2E)
```

### Estrutura de pastas
```
wage-nation-forge/
├── .ai/                          ← SKILLS DE IA (não apagar)
│   ├── PROJECT_CONTEXT.md        ← Este ficheiro
│   ├── SECURITY.md               ← Regras de segurança
│   ├── DATABASE.md               ← Schema e regras BD
│   ├── DESIGN_SYSTEM.md          ← Cores, fontes, componentes
│   ├── ECONOMY.md                ← Regras económicas
│   ├── FEATURES.md               ← Todas as features
│   └── DEVELOPMENT_PLAN.md       ← Plano de desenvolvimento
├── src/
│   ├── components/               ← Componentes reutilizáveis
│   │   ├── ui/                   ← shadcn/ui (não editar)
│   │   ├── TapToMine.tsx         ← Botão principal de mineração
│   │   ├── WalletCard.tsx        ← Card de saldo
│   │   ├── TaskCard.tsx          ← Card de tarefas
│   │   ├── PropertyCard.tsx      ← Card de imóvel
│   │   ├── ETFCard.tsx           ← Card de ETF
│   │   ├── SectorCard.tsx        ← Card de sector
│   │   ├── DividendCalendar.tsx  ← Calendário de dividendos
│   │   ├── EventBanner.tsx       ← Banner de eventos macro
│   │   └── AppLayout.tsx         ← Layout principal
│   ├── pages/                    ← Páginas da aplicação
│   ├── hooks/                    ← Custom React hooks
│   ├── lib/                      ← Utilitários e helpers
│   └── types/                    ← TypeScript types globais
├── supabase/
│   ├── migrations/               ← SQL migrations (versionadas)
│   └── functions/                ← Edge Functions (server-side)
├── contracts/                    ← Smart contracts Solidity
└── tests/                        ← Testes E2E
```

---

## 3. FLUXO ECONÓMICO CENTRAL

```
Utilizador tapa → ganha $MINE (off-chain, Supabase)
     ↓
Converte $MINE → $WAGE (taxa 0.5% tesouro + 2% burn)
     ↓
$WAGE vai para carteira on-chain (Base blockchain)
     ↓
Usa $WAGE para: comprar imóveis | acções | ETFs | staking | empréstimos
     ↓
Activos geram rendimento passivo em $WAGE
     ↓
Dividendos pagos periodicamente em $WAGE
     ↓
Loop: mais $WAGE → mais activos → mais rendimento
```

### Tokenomics
- **Supply máximo $WAGE:** 1.000.000.000 (hard-capped no contrato)
- **Taxa de conversão:** 1000 $MINE = 1 $WAGE (base)
- **Taxa do tesouro:** 0.5% em cada conversão
- **Burn rate:** 2% em cada conversão (deflação programada)
- **WageHalving:** -35% emissão a cada 180 dias

---

## 4. REGRAS DE DESENVOLVIMENTO

### NUNCA fazer
- Processar lógica financeira no frontend (React)
- Guardar chaves secretas em código ou .env commitado
- Expor `SUPABASE_SERVICE_ROLE_KEY` ou `APP_ENCRYPTION_KEY` ao browser
- Usar `any` em TypeScript sem justificação
- Fazer operações de BD sem verificar RLS
- Commitar sem correr os testes

### SEMPRE fazer
- Toda a lógica de saldo/energia/conversão em Supabase Edge Functions
- Validar inputs com Zod antes de qualquer operação
- Verificar autenticação Clerk antes de qualquer rota protegida
- Registar todas as operações financeiras no `audit_log`
- Usar transacções SQL para operações que alteram múltiplas tabelas
- Testar unitariamente toda a lógica económica

### Convenções de código
```typescript
// Nomes de ficheiros: PascalCase para componentes, camelCase para utils
// Hooks: prefixo "use" → useWallet, useTap, useProfile
// Types: sufixo "Type" ou "Props" → ProfileType, WalletCardProps
// API routes: kebab-case → /api/mine/tap, /api/exchange/convert
// Constantes: SCREAMING_SNAKE_CASE → MINE_PER_TAP, TREASURY_RATE
```
