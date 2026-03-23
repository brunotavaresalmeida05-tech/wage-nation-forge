# WageCompany — Regras Económicas
> Regras imutáveis do sistema económico. Nunca alterar sem autorização do owner.

---

## 1. DUAL TOKEN SYSTEM

### $MINE (Soft Currency — off-chain)
- Gerado por: tap, tarefas, produção passiva de assets, UBI
- Gasto em: upgrades de infraestrutura, conversão para $WAGE
- Armazenado: Supabase (campo `mine_balance` na tabela `profiles`)
- Nunca sai da plataforma directamente
- Inflacionário por design — abundante, perde valor com o tempo

### $WAGE (Hard Currency — on-chain ERC-20)
- Obtido: convertendo $MINE (única forma de criar novos $WAGE)
- Usado em: comprar activos, pagar taxas premium, staking, empréstimos, P2P
- Armazenado: blockchain Base (carteira do utilizador) + espelhado em Supabase
- Deflacionário — supply fixo, burn em cada operação
- Negociável externamente em DEX

---

## 2. TAXAS E BURNS — VALORES EXACTOS

```typescript
// NUNCA alterar estes valores sem autorização
export const ECONOMY_CONSTANTS = {
  // Tap
  MINE_PER_TAP_BASE:      1,      // $MINE base por tap
  ENERGY_PER_TAP:         1,      // energia gasta por tap
  ENERGY_REGEN_RATE:      1/3,    // 1 energia por 3 segundos

  // Exchange $MINE → $WAGE
  BASE_EXCHANGE_RATE:     1000,   // 1000 $MINE = 1 $WAGE
  TREASURY_RATE:          0.005,  // 0.5% vai para tesouro
  BURN_RATE:              0.02,   // 2% é queimado permanentemente
  // Net para utilizador: 97.5% do $WAGE calculado

  // Mercado de activos
  P2P_FEE:                0.025,  // 2.5% na venda P2P
  ETF_EXIT_FEE:           0.01,   // 1% ao vender cotas ETF
  ASSET_SPREAD:           0.02,   // 2% spread na compra de acções

  // DeFi
  DAILY_INTEREST_RATE:    0.001,  // 0.1%/dia em empréstimos
  LIQUIDATION_BONUS:      0.05,   // 5% do colateral vai para tesouro
  STAKING_VAULT_APY: {
    days30:   0.12,   // 12% APY
    days90:   0.25,
    days180:  0.45,
    days365:  0.80,
  },

  // WageHalving
  HALVING_INTERVAL_DAYS:   180,   // a cada 180 dias
  HALVING_REDUCTION:       0.35,  // -35% da emissão
  INITIAL_EMISSION_DAILY:  500_000, // $WAGE/dia no Genesis

  // Energia
  MAX_ENERGY_BASE:         1000,
  ENERGY_CAP_HOURS:        8,     // produção passiva cap de 8h

  // Supply $WAGE
  TOTAL_SUPPLY_CAP:        1_000_000_000, // 1 bilião hard-capped
} as const;
```

---

## 3. CÁLCULO DO TAP

```typescript
// Regra: nivel multiplica o ganho base
function calculateTapReward(level: number, streakDays: number): number {
  const baseReward = ECONOMY_CONSTANTS.MINE_PER_TAP_BASE;
  const levelMultiplier = 1 + (level - 1) * 0.1;        // +10% por nivel
  const streakMultiplier = calculateStreakMultiplier(streakDays);
  return baseReward * levelMultiplier * streakMultiplier;
}

function calculateStreakMultiplier(days: number): number {
  if (days >= 100) return 2.0;
  if (days >= 60)  return 1.75;
  if (days >= 30)  return 1.50;
  if (days >= 14)  return 1.35;
  if (days >= 7)   return 1.20;
  if (days >= 3)   return 1.10;
  return 1.0;
}
```

---

## 4. CÁLCULO DA EXCHANGE

```typescript
// Exemplo: utilizador converte 10.000 $MINE
function calculateExchange(mineAmount: number) {
  const grossWage = mineAmount / ECONOMY_CONSTANTS.BASE_EXCHANGE_RATE;
  const treasuryFee = grossWage * ECONOMY_CONSTANTS.TREASURY_RATE;
  const burnAmount  = grossWage * ECONOMY_CONSTANTS.BURN_RATE;
  const netWage     = grossWage - treasuryFee - burnAmount;

  return {
    grossWage,          // 10 $WAGE
    treasuryFee,        // 0.05 $WAGE (0.5%)
    burnAmount,         // 0.20 $WAGE (2%)
    netWage,            // 9.75 $WAGE (97.5%)
    mineSpent: mineAmount,
  };
}
// IMPORTANTE: toda esta lógica corre no servidor (Edge Function)
// NUNCA no frontend
```

---

## 5. PRODUÇÃO PASSIVA DE ACTIVOS

```typescript
// Rendimento por hora de cada tipo de activo (base, nível 1)
export const ASSET_BASE_INCOME: Record<string, number> = {
  // Infraestrutura (paga em $MINE)
  banco_central:        50,   // $MINE/hora
  empresa_energia:      120,
  imovel_comercial:     80,
  plataforma_petrolfera: 300,
  data_center:          200,
  porto_internacional:  500,

  // Real Estate (paga em $WAGE)
  apartamento_t2:       0.0005,   // $WAGE/hora (~0.48%/dia)
  loja_comercial:       0.0016,
  escritorio_premium:   0.0052,
  complexo_industrial:  0.0167,
  torre_empresarial:    0.0521,
};

// Rendimento aumenta com o nível
function getIncomePerHour(baseIncome: number, level: number): number {
  return baseIncome * level; // cada nível dobra a produção
}

// Cap de acumulação: 8 horas
// Após 8h sem recolher, a produção para
// Isto força o utilizador a voltar à app
```

---

## 6. SISTEMA DE DIVIDENDOS

```typescript
// Dividendos pagos em $WAGE
export const DIVIDEND_SCHEDULE = {
  stocks:  { frequency: 'biweekly', rate: 0.05 },  // 5% do valor
  etf_yield:    { frequency: 'weekly',   rate: 0.035 },
  etf_stable:   { frequency: 'biweekly', rate: 0.02 },
  etf_growth:   { frequency: 'monthly',  rate: 0.015 },
  real_estate:  { frequency: 'daily',    rate: null  }, // via income_per_hour
} as const;

// Profit Sharing — dia 30 de cada mês
// 10% do lucro mensal da empresa distribuído pelos TOP 100 holders de $WAGE
```

---

## 7. NÍVEL E XP

```typescript
// XP necessário para cada nível
function xpForLevel(level: number): number {
  return level * 1000 + (level - 1) * 500;
  // Nível 2: 1000 XP | Nível 3: 3000 XP | Nível 10: 14500 XP
}

// XP ganho por acção
export const XP_REWARDS = {
  tap_50_daily:    50,
  task_complete:   20,
  asset_purchase:  100,
  first_exchange:  200,
  streak_7:        150,
  streak_30:       500,
} as const;
```

---

## 8. VALIDAÇÕES OBRIGATÓRIAS

Antes de processar QUALQUER operação financeira, verificar:

```typescript
async function validateTap(userId: string) {
  const profile = await getProfile(userId);

  // 1. Utilizador existe e não está banido
  if (!profile || profile.is_banned) throw new Error('FORBIDDEN');

  // 2. Tem energia suficiente
  const currentEnergy = calculateCurrentEnergy(profile);
  if (currentEnergy < ECONOMY_CONSTANTS.ENERGY_PER_TAP) throw new Error('NO_ENERGY');

  // 3. Rate limit (máx 10 taps/segundo por utilizador)
  const recentTaps = await countRecentTaps(userId, 1); // último 1 segundo
  if (recentTaps >= 10) throw new Error('RATE_LIMITED');

  return { profile, currentEnergy };
}
```
