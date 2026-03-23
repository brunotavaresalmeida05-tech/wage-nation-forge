# WageCompany — Plano de Desenvolvimento Completo
> Roadmap detalhado com ordem, dependências e critérios de conclusão.
> Seguir EXACTAMENTE esta ordem. Não saltar fases.

---

## ESTADO ACTUAL DO PROJECTO

### Concluído ✅
- [x] Estrutura de pastas e ficheiros
- [x] Design system (cores, tipografia, componentes)
- [x] Layout de 3 colunas (sidebar + main + painel direito)
- [x] Todas as páginas com UI (sem lógica real)
- [x] Tema dark/light funcional
- [x] Componentes: TapToMine, WalletCard, TaskCard, PropertyCard, ETFCard
- [x] Design system expandido com #181818 e #00C22C
- [x] Lovable removido do vite.config.ts
- [x] README profissional

### Em curso 🔄
- [ ] Base de dados Supabase (schema + RLS + encriptação)
- [ ] Autenticação Clerk

### Por fazer ❌
- Tudo o que está nas fases abaixo

---

## FASE 0 — LIMPEZA (CONCLUÍDA ✅)
Remover Lovable, organizar ficheiros, design system expandido.

---

## FASE 1 — FUNDAÇÃO SEGURA (Semana 1)
**Objectivo:** Base de dados encriptada + Auth funcional

### 1.1 — Supabase Setup (2-3 dias)
**Ficheiros a criar:**
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/migrations/003_encryption_setup.sql`
- `supabase/migrations/004_seed_tasks.sql`
- `src/lib/supabase.ts`
- `src/types/database.ts`

**SQL a executar (nesta ordem):**
1. Activar extensões: `pgcrypto`, `uuid-ossp`
2. Criar todas as tabelas (ver DATABASE.md)
3. Activar RLS em todas as tabelas
4. Criar políticas RLS
5. Criar funções de encriptação/desencriptação
6. Configurar `app.encryption_key`
7. Criar seed de tarefas iniciais

**Critério de conclusão:**
- [ ] Todas as tabelas criadas no Supabase
- [ ] RLS testado: user A não vê dados do user B
- [ ] pgcrypto: email encriptado/desencriptado correctamente
- [ ] `src/lib/supabase.ts` exporta cliente configurado

### 1.2 — Clerk Auth (1-2 dias)
**Ficheiros a criar/editar:**
- `src/main.tsx` — adicionar ClerkProvider
- `src/components/AuthGuard.tsx` — proteger rotas
- `supabase/functions/clerk-webhook/index.ts` — criar profile ao registar
- `.env.local` — adicionar chaves Clerk

**Critério de conclusão:**
- [ ] Login/registo funciona
- [ ] Webhook cria profile automaticamente no Supabase
- [ ] Rotas protegidas redireccionam para login
- [ ] Perfil aparece na sidebar (Worker #XXXX)

### 1.3 — Tipos TypeScript (1 dia)
**Ficheiro a criar:** `src/types/database.ts`
```typescript
// Tipos gerados do schema Supabase
export interface Profile { ... }
export interface Transaction { ... }
export interface UserAsset { ... }
// etc.
```

---

## FASE 2 — MOTOR ECONÓMICO CORE (Semana 2)
**Objectivo:** Tap funcional, energia, exchange

### 2.1 — Edge Function: Tap (2 dias)
**Ficheiro:** `supabase/functions/mine-tap/index.ts`

**Lógica:**
1. Verificar JWT Clerk
2. Buscar profile + calcular energia actual
3. Verificar rate limit (10 req/s)
4. Calcular $MINE earned (nível + streak)
5. UPDATE profiles (mine_balance, energy, last_tap_at)
6. INSERT transactions
7. INSERT audit_log (com IP encriptado)
8. Retornar novo estado

**Critério de conclusão:**
- [ ] Tap debita energia correctamente
- [ ] $MINE credita com multiplicador de nível
- [ ] Rate limit bloqueia bots (>10/s)
- [ ] Energia regenera ao longo do tempo
- [ ] Testes unitários passam

### 2.2 — Realtime (1 dia)
**Ficheiro:** `src/hooks/useProfile.ts`

```typescript
// Hook que subscreve mudanças em tempo real
export function useProfile() {
  // Supabase Realtime subscription
  // Actualiza saldo, energia, streak em tempo real
}
```

### 2.3 — Edge Function: Exchange (2 dias)
**Ficheiro:** `supabase/functions/exchange-convert/index.ts`

**Lógica:**
1. Verificar JWT + saldo suficiente
2. Calcular: grossWage, fee, burn, netWage
3. Debitar $MINE do Supabase
4. Chamar contrato `mintWage` (quando contrato existir — mock por agora)
5. Creditar $WAGE no Supabase (espelhado)
6. Actualizar treasury
7. Registar em transactions + audit_log

**Critério de conclusão:**
- [ ] Conversão debita $MINE correctamente
- [ ] Taxa 0.5% vai para treasury
- [ ] 2% é registado como burned
- [ ] Interface mostra breakdown em tempo real

---

## FASE 3 — INVESTIMENTOS (Semana 3-4)
**Objectivo:** Real Estate, Sectores, ETFs, Dividendos, Tarefas

### 3.1 — Tarefas Diárias (2 dias)
**Ficheiros:**
- `supabase/functions/complete-task/index.ts`
- `src/hooks/useTasks.ts`
- `src/components/TaskCard.tsx` (actualizar com lógica real)

### 3.2 — Real Estate (3 dias)
**Ficheiros:**
- `supabase/functions/buy-asset/index.ts`
- `supabase/functions/claim-passive/index.ts`
- `src/hooks/useAssets.ts`
- `src/pages/RealEstatePage.tsx` (ligar à BD)

### 3.3 — Sectores e Eventos Macro (2 dias)
**Ficheiros:**
- `supabase/functions/buy-stock/index.ts`
- `supabase/functions/trigger-market-event/index.ts`
- `src/hooks/useMarketEvents.ts`

### 3.4 — ETFs (2 dias)
**Ficheiros:**
- `supabase/functions/buy-etf-shares/index.ts`
- `supabase/functions/sell-etf-shares/index.ts`
- `src/hooks/useETFs.ts`

### 3.5 — Dividendos (2 dias)
**Ficheiros:**
- `supabase/functions/calculate-dividends/index.ts` (cron)
- `supabase/functions/claim-dividends/index.ts`
- `src/hooks/useDividends.ts`

---

## FASE 4 — BLOCKCHAIN (Semana 5-6)
**Objectivo:** Smart contract $WAGE on-chain

### 4.1 — Smart Contract (3 dias)
**Ficheiros:**
- `contracts/WageToken.sol`
- `contracts/deploy.ts`
- `hardhat.config.ts`

```solidity
// WageToken.sol — ERC-20 com treasury e burn
contract WageToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    uint256 public constant TREASURY_RATE = 50;  // 0.5% basis points
    uint256 public constant BURN_RATE = 200;      // 2%
    address public treasury;
    // ...
}
```

### 4.2 — Integração wagmi (2 dias)
**Ficheiros:**
- `src/lib/wagmi.ts`
- `src/hooks/useWallet.ts`
- `src/components/ConnectWallet.tsx`

### 4.3 — Deploy Base Sepolia (1 dia)
- Deploy do contrato
- Verificar no BaseScan
- Actualizar `.env.local` com endereço do contrato

---

## FASE 5 — SOCIAL E UBI (Semana 7)
**Objectivo:** Corporações, UBI, WagePay

### 5.1 — WagePay P2P (2 dias)
### 5.2 — UBI System (2 dias)
### 5.3 — Sistema de Referidos (1 dia)

---

## FASE 6 — TESTES E DEPLOY (Semana 8)
**Objectivo:** Qualidade, segurança, produção

### 6.1 — Testes (3 dias)
**Ficheiros:**
- `src/test/economy.test.ts` — lógica económica
- `src/test/auth.test.ts` — autenticação
- `tests/e2e/tap.spec.ts` — tap to mine E2E
- `tests/e2e/exchange.spec.ts` — exchange E2E

### 6.2 — Segurança (2 dias)
- Audit de todas as Edge Functions
- Verificar RLS com utilizadores de teste
- Testar rate limiting
- Headers HTTP (vercel.json)
- npm audit

### 6.3 — Deploy Produção (1 dia)
- Configurar variáveis no Vercel
- Deploy
- Smoke tests em produção

---

## CONVENÇÕES DE COMMIT

```
feat: adiciona funcionalidade nova
fix: corrige bug
chore: manutenção (deps, config)
security: melhoria de segurança
test: adiciona ou modifica testes
docs: documentação
refactor: refactoring sem mudança de comportamento

Exemplos:
feat: implement tap-to-mine edge function with rate limiting
fix: correct energy regeneration calculation
security: encrypt email field with pgcrypto AES-256
test: add unit tests for exchange calculation
```

---

## CRITÉRIOS DE QUALIDADE

Antes de marcar qualquer tarefa como concluída:
- [ ] Funcionalidade implementada e testada manualmente
- [ ] Testes unitários escritos e a passar
- [ ] Sem `console.log` de debug
- [ ] Sem `any` TypeScript sem justificação
- [ ] RLS verificado (se envolve BD)
- [ ] Audit log registado (se envolve operação financeira)
- [ ] Código revisto (pelo menos uma passagem manual)
- [ ] Commit com mensagem descritiva
