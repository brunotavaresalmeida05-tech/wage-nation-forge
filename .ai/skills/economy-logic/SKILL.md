# Skill: Economy Logic
> Auto-activada quando: implementar tap, exchange, activos, dividendos, cálculos financeiros

---

## REGRA ABSOLUTA
Toda a lógica financeira corre NO SERVIDOR (Edge Functions).
NUNCA no React/frontend. O frontend só mostra dados e envia pedidos.

---

## Constantes (importar de src/lib/economy.ts)

```typescript
// src/lib/economy.ts — FONTE DE VERDADE
export const ECONOMY = {
  MINE_PER_TAP_BASE:    1,
  ENERGY_PER_TAP:       1,
  ENERGY_REGEN_RATE:    1/3,      // 1 energia / 3 segundos
  MAX_ENERGY_BASE:      1000,
  ENERGY_CAP_HOURS:     8,        // produção passiva cap

  EXCHANGE_RATE:        1000,     // 1000 $MINE = 1 $WAGE
  TREASURY_RATE:        0.005,    // 0.5%
  BURN_RATE:            0.02,     // 2%

  P2P_FEE:              0.025,    // 2.5%
  ETF_EXIT_FEE:         0.01,     // 1%
  DAILY_INTEREST:       0.001,    // 0.1%/dia

  TOTAL_SUPPLY:         1_000_000_000,
  HALVING_DAYS:         180,
  HALVING_REDUCTION:    0.35,
} as const;
```

---

## Cálculos Core

```typescript
// Energia actual (considera regeneração desde último tap)
export function calcCurrentEnergy(
  storedEnergy: number,
  maxEnergy: number,
  lastTapAt: Date | null
): number {
  if (!lastTapAt) return maxEnergy;
  const secondsElapsed = (Date.now() - lastTapAt.getTime()) / 1000;
  const regen = Math.floor(secondsElapsed * ECONOMY.ENERGY_REGEN_RATE);
  return Math.min(maxEnergy, storedEnergy + regen);
}

// Recompensa do tap (nível + streak)
export function calcTapReward(level: number, streakDays: number): number {
  const levelMult = 1 + (level - 1) * 0.1;
  const streakMult = getStreakMultiplier(streakDays);
  return ECONOMY.MINE_PER_TAP_BASE * levelMult * streakMult;
}

function getStreakMultiplier(days: number): number {
  if (days >= 100) return 2.0;
  if (days >= 60)  return 1.75;
  if (days >= 30)  return 1.50;
  if (days >= 14)  return 1.35;
  if (days >= 7)   return 1.20;
  if (days >= 3)   return 1.10;
  return 1.0;
}

// Cálculo da exchange
export function calcExchange(mineAmount: number) {
  const gross   = mineAmount / ECONOMY.EXCHANGE_RATE;
  const fee     = gross * ECONOMY.TREASURY_RATE;
  const burn    = gross * ECONOMY.BURN_RATE;
  const net     = gross - fee - burn;
  return { grossWage: gross, treasuryFee: fee, burnAmount: burn, netWage: net };
}

// XP para atingir nível
export function xpForLevel(level: number): number {
  return level * 1000 + (level - 1) * 500;
}

// Produção passiva acumulada (com cap de 8h)
export function calcPassiveIncome(
  incomePerHour: number,
  lastClaimedAt: Date | null
): number {
  if (!lastClaimedAt) return 0;
  const hoursElapsed = (Date.now() - lastClaimedAt.getTime()) / 3_600_000;
  const cappedHours = Math.min(hoursElapsed, ECONOMY.ENERGY_CAP_HOURS);
  return incomePerHour * cappedHours;
}
```

---

## Validações Obrigatórias antes de Tap

```typescript
// COPIAR para cada Edge Function de tap
async function validateTapRequest(userId: string, supabase: SupabaseClient) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, energy, max_energy, level, streak_days, last_tap_at, is_banned')
    .eq('clerk_id', userId)
    .single();

  if (!profile) throw { code: 'NOT_FOUND', status: 404 };
  if (profile.is_banned) throw { code: 'BANNED', status: 403 };

  const currentEnergy = calcCurrentEnergy(
    profile.energy,
    profile.max_energy,
    profile.last_tap_at ? new Date(profile.last_tap_at) : null
  );

  if (currentEnergy < ECONOMY.ENERGY_PER_TAP) {
    throw { code: 'NO_ENERGY', status: 400 };
  }

  return { profile, currentEnergy };
}
```
