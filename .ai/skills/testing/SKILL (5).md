# Skill: Testing
> Activar quando: escrever testes unitários (Vitest) ou E2E (Playwright)

---

## Estrutura de Testes

```
src/test/
├── setup.ts              ← Configuração global (já existe)
├── economy.test.ts       ← Lógica económica (calcular tap, exchange, etc.)
├── encryption.test.ts    ← Encriptação/desencriptação
└── validators.test.ts    ← Validações Zod

tests/
└── e2e/
    ├── auth.spec.ts       ← Login, registo, logout
    ├── tap.spec.ts        ← Tap to mine completo
    └── exchange.spec.ts   ← Exchange $MINE → $WAGE
```

---

## Padrão de Teste Unitário (Vitest)

```typescript
// src/test/economy.test.ts
import { describe, it, expect } from "vitest";
import {
  calcCurrentEnergy,
  calcTapReward,
  calcExchange,
  calcPassiveIncome,
} from "@/lib/economy";

describe("calcCurrentEnergy", () => {
  it("retorna maxEnergy se nunca tapou", () => {
    expect(calcCurrentEnergy(500, 1000, null)).toBe(1000);
  });

  it("regenera energia correctamente ao longo do tempo", () => {
    const lastTap = new Date(Date.now() - 30_000); // 30 segundos atrás
    // 30s * (1/3 energia/s) = 10 energia regenerada
    expect(calcCurrentEnergy(500, 1000, lastTap)).toBe(510);
  });

  it("nunca ultrapassa maxEnergy", () => {
    const lastTap = new Date(Date.now() - 1_000_000); // muito tempo atrás
    expect(calcCurrentEnergy(900, 1000, lastTap)).toBe(1000);
  });
});

describe("calcTapReward", () => {
  it("nível 1, sem streak = 1 $MINE", () => {
    expect(calcTapReward(1, 0)).toBe(1);
  });

  it("nível 2 = 1.1x multiplicador", () => {
    expect(calcTapReward(2, 0)).toBeCloseTo(1.1);
  });

  it("streak 7 dias = 1.2x multiplicador", () => {
    expect(calcTapReward(1, 7)).toBeCloseTo(1.2);
  });

  it("streak 30 dias + nível 3 = multiplicadores combinados", () => {
    // nivel 3: 1 + (3-1)*0.1 = 1.2 | streak 30: 1.5
    expect(calcTapReward(3, 30)).toBeCloseTo(1.8);
  });
});

describe("calcExchange", () => {
  it("1000 $MINE = 1 $WAGE bruto", () => {
    const result = calcExchange(1000);
    expect(result.grossWage).toBeCloseTo(1);
  });

  it("taxa do tesouro é 0.5%", () => {
    const result = calcExchange(1000);
    expect(result.treasuryFee).toBeCloseTo(0.005);
  });

  it("burn é 2%", () => {
    const result = calcExchange(1000);
    expect(result.burnAmount).toBeCloseTo(0.02);
  });

  it("utilizador recebe 97.5% do bruto", () => {
    const result = calcExchange(1000);
    expect(result.netWage).toBeCloseTo(0.975);
  });

  it("grossWage = fee + burn + net (conservação)", () => {
    const result = calcExchange(5000);
    expect(result.treasuryFee + result.burnAmount + result.netWage)
      .toBeCloseTo(result.grossWage);
  });
});

describe("calcPassiveIncome", () => {
  it("retorna 0 se nunca reclamou", () => {
    expect(calcPassiveIncome(50, null)).toBe(0);
  });

  it("calcula correctamente para 4 horas", () => {
    const lastClaim = new Date(Date.now() - 4 * 3_600_000);
    expect(calcPassiveIncome(50, lastClaim)).toBeCloseTo(200);
  });

  it("cap de 8 horas — não acumula além disso", () => {
    const lastClaim = new Date(Date.now() - 24 * 3_600_000); // 24h atrás
    expect(calcPassiveIncome(50, lastClaim)).toBeCloseTo(400); // max 8h
  });
});
```

---

## Padrão de Teste E2E (Playwright)

```typescript
// tests/e2e/tap.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Tap to Mine", () => {
  test.beforeEach(async ({ page }) => {
    // Login com utilizador de teste
    await page.goto("/sign-in");
    await page.fill('[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('[type="submit"]');
    await page.waitForURL("/");
  });

  test("botão de tap está visível e clicável", async ({ page }) => {
    const tapButton = page.getByText("TAP TO MINE");
    await expect(tapButton).toBeVisible();
    await expect(tapButton).toBeEnabled();
  });

  test("tap aumenta saldo $MINE", async ({ page }) => {
    // Ler saldo inicial
    const balanceBefore = await page.getByTestId("mine-balance").textContent();
    const before = parseInt(balanceBefore?.replace(/\D/g, "") ?? "0");

    // Fazer tap
    await page.getByTestId("tap-button").click();
    await page.waitForTimeout(500); // aguardar actualização

    // Verificar que saldo aumentou
    const balanceAfter = await page.getByTestId("mine-balance").textContent();
    const after = parseInt(balanceAfter?.replace(/\D/g, "") ?? "0");

    expect(after).toBeGreaterThan(before);
  });

  test("tap debita energia", async ({ page }) => {
    const energyBefore = await page.getByTestId("energy-value").textContent();
    await page.getByTestId("tap-button").click();
    await page.waitForTimeout(500);
    const energyAfter = await page.getByTestId("energy-value").textContent();

    const before = parseInt(energyBefore ?? "0");
    const after  = parseInt(energyAfter ?? "0");
    expect(after).toBeLessThan(before);
  });

  test("botão desactiva quando energia = 0", async ({ page }) => {
    // Forçar energia zero via mock ou utilizador de teste específico
    // Este teste requer utilizador de teste com energia = 0
    const tapButton = page.getByTestId("tap-button");
    // Verificar estado desactivado visualmente
    await expect(tapButton).toHaveClass(/disabled|opacity/);
  });
});
```

---

## Executar Testes

```bash
# Unitários
npm test                  # Vitest em modo watch
npm run test:run          # Vitest uma vez (para CI)
npm run test:coverage     # Com relatório de cobertura

# E2E
npx playwright install    # Instalar browsers (primeira vez)
npm run test:e2e          # Playwright
npm run test:e2e:ui       # Com UI do Playwright

# Tudo
npm run test:all
```

---

## Cobertura Mínima Obrigatória

| Módulo | Cobertura mínima |
|--------|-----------------|
| `src/lib/economy.ts` | 100% — sem excepção |
| `supabase/functions/` | 80% |
| `src/hooks/` | 70% |
| `src/components/` | 60% |
