# WageCompany — Features Completas
> Especificação detalhada de cada feature do sistema.

---

## MÓDULO 1 — TAP TO MINE (Home)

### Ficheiros relevantes
- `src/components/TapToMine.tsx` — botão animado
- `src/pages/Dashboard.tsx` — página principal
- `supabase/functions/mine-tap/index.ts` — lógica server-side

### Funcionamento
1. Utilizador toca no botão circular central
2. Frontend envia POST para Edge Function `/mine-tap`
3. Edge Function valida: auth + energia + rate limit
4. Debita 1 energia, credita $MINE (baseado em nivel + streak)
5. Regista em `transactions` e `audit_log`
6. Retorna novo saldo em tempo real via Supabase Realtime
7. Frontend mostra animação de ganho (+X $MINE flutuante)

### Estado visual do botão
- Energia > 50%: botão brilhante, anel animado
- Energia 10-50%: botão amarelo/laranja
- Energia < 10%: botão vermelho, pulsa
- Energia = 0: botão cinzento, desactivado, mostra tempo até regenerar

---

## MÓDULO 2 — EXCHANGE ($MINE → $WAGE)

### Ficheiros relevantes
- `src/pages/ExchangePage.tsx`
- `supabase/functions/exchange-convert/index.ts`

### Fluxo completo
1. Utilizador insere quantidade de $MINE
2. Frontend calcula preview em tempo real (sem chamar API)
3. Utilizador clica "Confirmar Minting"
4. Edge Function valida saldo + conecta carteira
5. Debita $MINE do Supabase
6. Chama smart contract `mintWage(address, grossAmount)`
7. $WAGE é mintado on-chain na carteira do utilizador
8. Actualiza `wage_balance` espelhado no Supabase
9. Regista na treasury e em `transactions`

### Interface
- Card "De $MINE" com saldo disponível
- Seta ⇅ de swap
- Card "Para $WAGE" com valor calculado
- Breakdown: taxa tesouro (0.5%) | burn (2%) | recebes (97.5%)
- Gas estimado em ETH
- Botão "Confirmar Minting On-Chain"

---

## MÓDULO 3 — REAL ESTATE

### Ficheiros relevantes
- `src/pages/RealEstatePage.tsx`
- `src/components/PropertyCard.tsx`

### Tipos de imóvel
| Tipo | Emoji | Raridade | Preço $WAGE | Renda/dia |
|------|-------|----------|-------------|-----------|
| Apartamento T2 | 🏠 | Comum | 250 | 1.2 $W |
| Loja Comercial | 🏬 | Raro | 800 | 3.84 $W |
| Escritório Premium | 🏢 | Épico | 2500 | 15 $W |
| Complexo Industrial | 🏭 | Lendário | 8000 | 57.6 $W |
| Torre Empresarial | 🌆 | Lendário | 25000 | 200 $W |
| Resort Costeiro | 🏖️ | Lendário | 15000 | 115.2 $W |

### Mecânicas
- Compra com $WAGE → entra em `user_assets`
- Renda acumula automaticamente (via cron job ou lazy calculation)
- Cap de 8h de acumulação (força retorno diário)
- Recolha manual: utilizador toca "Recolher" → credita $WAGE
- Mercado P2P: listar para venda → outros compram → taxa 2.5%
- Leilões semanais para imóveis raros (24h, só $WAGE)

---

## MÓDULO 4 — SETORES ECONÓMICOS (12 sectores)

### Sectores disponíveis
```
Tecnologia | Energia | Financeiro | Saúde | Consumo
Indústria | Imobiliário | Materiais | Utilities
Transportes | Entretenimento | Agricultura
```

### Cada sector tem
- 3-5 empresas sintéticas com preço em $WAGE
- Rendimento base por dia (0.35% - 0.9%)
- Volatilidade: Muito Baixa / Baixa / Média / Alta / Muito Alta
- Ciclo económico próprio (afectado por eventos macro)

### Eventos macro (ocorrem a cada 48-72h)
- Disparam notificação push
- Afectam preço das acções ±15% a ±50%
- Duração de 24h a 96h
- Exemplo: "Tech Boom" → +25% acções de Tecnologia

---

## MÓDULO 5 — ETFs SINTÉTICOS

### Os 3 ETFs
| ETF | Código | Rendimento | Risco | Rebalanceamento |
|-----|--------|-----------|-------|-----------------|
| Crescimento | WGW-GROWTH | ~0.75%/dia | Alto | Semanal |
| Conservador | WGW-STABLE | ~0.40%/dia | Baixo | Semanal |
| Dividendos | WGW-YIELD | ~0.55%/dia | Médio | Semanal |

### Mecânica
- Compra cotas com $WAGE (mínimo 10 $WAGE)
- Rendimento acumula diariamente
- Recolha manual (até 7 dias acumulados)
- Taxa de saída: 1% ao vender cotas
- ETF de Elite: desbloqueado no nível 20+

---

## MÓDULO 6 — DIVIDENDOS

### Fontes de dividendo
- Acções sectoriais: quinzenal, 5% do valor
- WGW-YIELD: semanal, 3.5% das cotas
- WGW-STABLE: quinzenal, 2% das cotas
- WGW-GROWTH: mensal, 1.5% das cotas
- Imóveis: diário via income_per_hour

### Interface (DividendCalendar.tsx)
- Calendário com datas de pagamento marcadas
- Próximo pagamento com contagem regressiva
- Lista de fontes com valor estimado
- Botão "Recolher Tudo"
- Histórico de pagamentos

---

## MÓDULO 7 — TAREFAS E MISSÕES (TasksPage)

### 20 Tarefas diárias (reset às 00:00 UTC)
1. Faz 50 taps hoje (+200 $M)
2. Faz 150 taps hoje (+500 $M)
3. Converte $MINE em $WAGE (+300 $M)
4. Recolhe rendas de imóvel (+250 $M)
5. Recolhe rendimento de ETF (+250 $M)
6. Visita Mercado de Acções (+150 $M)
7. Faz upgrade numa carta (+400 $M)
8. Consulta Dashboard Económico (+100 $M)
... (ver ECONOMY.md para lista completa)

### Streak Rewards
| Dias | Bonus | Título |
|------|-------|--------|
| 3d | +10% $MINE/tap | Trabalhador Dedicado |
| 7d | +20% + 500 $M | Operário da Semana |
| 14d | +35% + 1.000 $M | Veterano Quinzenal |
| 30d | +50% + 5.000 $M + 1 $W | Empregado do Mês |
| 100d | +100% + 20.000 $M + 20 $W | CEO da Rua |
| 365d | +200% permanente | Fundador da WageCompany |

---

## MÓDULO 8 — VAULT SOBERANO (VaultPage)

### Lock periods e recompensas
| Período | APY | Benefício Extra |
|---------|-----|-----------------|
| 30 dias | 12% | Badge Cidadão Comprometido |
| 90 dias | 25% | Acesso ETF de Elite |
| 180 dias | 45% | NFT Cidadão Fundador + Voto Duplo |
| 365 dias | 80% | Profit Sharing Triplo |

---

## MÓDULO 9 — CRÉDITO (CreditPage)

### Empréstimos em $WAGE com colateral
- Colateral: activos do portfolio (imóveis, acções, ETFs)
- Limite: até 70% do valor do colateral
- Juro: 0.1%/dia sobre o capital
- Liquidação automática se colateral cair abaixo de 80% do empréstimo
- Reputation Score determina limite máximo

---

## MÓDULO 10 — UBI (UBIPage)

### Renda Base Universal
- UBI Base: 10 $WAGE/mês para utilizadores verificados
- UBI Trabalho: até 50 $WAGE/mês (proporcional à actividade)
- UBI Streak: até 30 $WAGE/mês (por consistência)
- Requer verificação de humanidade (Clerk + futuramente World ID)
- Financiado por 10% do supply reservado + 5% dos lucros mensais

---

## MÓDULO 11 — WAGEPAY (WagePayPage)

### Pagamentos P2P
- Enviar $WAGE para outro utilizador por username ou endereço
- QR code para receber
- Histórico de pagamentos
- Taxa: 0.1% em cada envio (vai para tesouro)

---

## MÓDULO 12 — PERFIL (ProfilePage)

### Informação exibida
- Avatar + Worker #XXXX + Título + Rank global
- WageID tier (Basic/Active/Premium/Sovereign)
- Reputation Score (0-1000)
- Barra XP do nível actual
- Estatísticas: Total $MINE | Total $WAGE | Portfolio | Streak
- Streak Rewards (progresso visual)
- Badges conquistados
- Carteira conectada (endereço truncado)
- Botão "Withdraw $WAGE" (saque)
- Botão "Verify Identity KYC"
- Toggle Dark/Light mode

---

## MÓDULO 13 — ECONOMICS (EconomicsPage)

### Dashboard público da economia
- Supply total vs circulação
- Treasury balance
- DAU (utilizadores activos diariamente)
- Volume de transacções 24h
- Próximo WageHalving (countdown)
- Total $WAGE queimado
- Top 10 Corporações

---

## PÁGINAS EXISTENTES (verificar src/pages/)
```
Dashboard.tsx      ← Home principal (tap + wallet + eventos)
MinePage.tsx       ← Detalhes de mineração
SwapPage.tsx       ← Swap rápido
MarketPage.tsx     ← Mercado geral
InvestPage.tsx     ← Investimentos
ExchangePage.tsx   ← Exchange $MINE→$WAGE
RealEstatePage.tsx ← Imóveis
ETFsPage.tsx       ← ETFs
SectorsPage.tsx    ← Sectores económicos
VaultPage.tsx      ← Vault/staking
UBIPage.tsx        ← Renda universal
WagePayPage.tsx    ← Pagamentos
CreditPage.tsx     ← Crédito/empréstimos
JobsPage.tsx       ← Jobs/tarefas especiais
EconomicsPage.tsx  ← Dashboard económico
ProfilePage.tsx    ← Perfil do utilizador
BankCardsPage.tsx  ← Cartões bancários
TasksPage.tsx      ← Todas as tarefas
AssetDetailPage.tsx ← Detalhe de activo
```
