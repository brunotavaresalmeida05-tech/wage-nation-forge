# WageCompany — Base de Dados
> Schema completo, regras de acesso e encriptação.
> Supabase (PostgreSQL 15) com RLS e pgcrypto.

---

## 1. SCHEMA COMPLETO

### Tabela: profiles
```sql
CREATE TABLE profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id          TEXT UNIQUE NOT NULL,
  username          TEXT,
  email_encrypted   BYTEA,                    -- encriptado com pgcrypto
  mine_balance      NUMERIC(20,6) DEFAULT 0,
  wage_balance      NUMERIC(20,8) DEFAULT 0,  -- espelhado do on-chain
  energy            INTEGER DEFAULT 1000,
  max_energy        INTEGER DEFAULT 1000,
  level             INTEGER DEFAULT 1,
  xp                INTEGER DEFAULT 0,
  streak_days       INTEGER DEFAULT 0,
  last_tap_at       TIMESTAMPTZ,
  last_claim_at     TIMESTAMPTZ,
  last_login_at     TIMESTAMPTZ,
  reputation_score  NUMERIC(8,2) DEFAULT 0,
  wage_id_tier      TEXT DEFAULT 'basic',     -- basic|active|premium|sovereign
  wallet_encrypted  BYTEA,                    -- endereço ETH encriptado
  world_id_verified BOOLEAN DEFAULT false,
  is_banned         BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_profile" ON profiles
  FOR ALL USING (clerk_id = auth.uid()::text);
```

### Tabela: transactions
```sql
CREATE TABLE transactions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type           TEXT NOT NULL CHECK (type IN (
    'tap','task','passive_claim','convert',
    'buy_asset','sell_asset','upgrade',
    'dividend','loan_borrow','loan_repay',
    'staking_deposit','staking_withdraw',
    'p2p_sale','p2p_purchase','ubi_claim'
  )),
  mine_delta     NUMERIC(20,6) DEFAULT 0,
  wage_delta     NUMERIC(20,8) DEFAULT 0,
  treasury_fee   NUMERIC(20,8) DEFAULT 0,
  burn_amount    NUMERIC(20,8) DEFAULT 0,
  description    TEXT,
  metadata       JSONB DEFAULT '{}',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_transactions" ON transactions
  FOR ALL USING (user_id = (
    SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
  ));
```

### Tabela: user_assets
```sql
CREATE TABLE user_assets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES profiles(id) ON DELETE CASCADE,
  asset_type        TEXT NOT NULL CHECK (asset_type IN (
    'infrastructure','real_estate','stock','etf','bond','vault'
  )),
  asset_subtype     TEXT,               -- 'residential','commercial','tech'...
  asset_name        TEXT NOT NULL,
  asset_emoji       TEXT DEFAULT '🏢',
  level             INTEGER DEFAULT 1,
  quantity          NUMERIC(20,8) DEFAULT 1,
  income_per_hour   NUMERIC(20,8) DEFAULT 0,
  upgrade_cost      NUMERIC(20,6),
  purchase_price    NUMERIC(20,8),
  current_value     NUMERIC(20,8),
  rarity            TEXT DEFAULT 'common' CHECK (rarity IN (
    'common','rare','epic','legendary','unique'
  )),
  locked_until      TIMESTAMPTZ,        -- para vault/staking
  last_claimed_at   TIMESTAMPTZ,
  purchased_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_assets" ON user_assets
  FOR ALL USING (user_id = (
    SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
  ));
```

### Tabela: tasks
```sql
CREATE TABLE tasks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  task_type     TEXT NOT NULL CHECK (task_type IN (
    'daily','one_time','social','portfolio','streak'
  )),
  reward_mine   NUMERIC(20,6) DEFAULT 0,
  reward_wage   NUMERIC(20,8) DEFAULT 0,
  reward_xp     INTEGER DEFAULT 0,
  requirement   JSONB DEFAULT '{}',    -- condição para completar
  reset_hours   INTEGER DEFAULT 24,   -- 0 = one_time, 24 = daily
  is_active     BOOLEAN DEFAULT true,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
-- tasks é leitura pública (não tem dados sensíveis)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_readable" ON tasks FOR SELECT USING (true);
```

### Tabela: user_task_completions
```sql
CREATE TABLE user_task_completions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  task_id      UUID REFERENCES tasks(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id, (date_trunc('day', completed_at)))
);

ALTER TABLE user_task_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_completions" ON user_task_completions
  FOR ALL USING (user_id = (
    SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
  ));
```

### Tabela: company_treasury
```sql
CREATE TABLE company_treasury (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_mine_collected   NUMERIC(30,6) DEFAULT 0,
  total_wage_minted      NUMERIC(30,8) DEFAULT 0,
  total_mine_burned      NUMERIC(30,6) DEFAULT 0,
  total_fees_wage        NUMERIC(30,8) DEFAULT 0,
  total_p2p_fees         NUMERIC(30,8) DEFAULT 0,
  total_loan_interest    NUMERIC(30,8) DEFAULT 0,
  last_halving_at        TIMESTAMPTZ,
  next_halving_at        TIMESTAMPTZ,
  current_emission_rate  NUMERIC(20,6) DEFAULT 500000,
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Apenas admin lê o tesouro (via service role)
ALTER TABLE company_treasury ENABLE ROW LEVEL SECURITY;
CREATE POLICY "treasury_admin_only" ON company_treasury
  FOR ALL USING (false);  -- nenhum user acede directamente
```

### Tabela: loans
```sql
CREATE TABLE loans (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount_wage         NUMERIC(20,8) NOT NULL,
  collateral_asset_id UUID REFERENCES user_assets(id),
  collateral_value    NUMERIC(20,8),
  daily_interest_rate NUMERIC(8,6) DEFAULT 0.001,   -- 0.1%/dia
  total_interest_paid NUMERIC(20,8) DEFAULT 0,
  status              TEXT DEFAULT 'active' CHECK (status IN (
    'active','repaid','liquidated'
  )),
  due_date            TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  repaid_at           TIMESTAMPTZ
);

ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_loans" ON loans
  FOR ALL USING (user_id = (
    SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
  ));
```

### Tabela: dividend_payments
```sql
CREATE TABLE dividend_payments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  asset_id     UUID REFERENCES user_assets(id),
  amount_wage  NUMERIC(20,8) NOT NULL,
  payment_type TEXT DEFAULT 'regular' CHECK (payment_type IN (
    'regular','special','profit_sharing'
  )),
  claimed      BOOLEAN DEFAULT false,
  claimable_at TIMESTAMPTZ DEFAULT NOW(),
  claimed_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dividend_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_dividends" ON dividend_payments
  FOR ALL USING (user_id = (
    SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
  ));
```

### Tabela: audit_log
```sql
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id),
  action      TEXT NOT NULL,
  details     JSONB DEFAULT '{}',
  ip_encrypted BYTEA,         -- IP encriptado com pgcrypto
  user_agent  TEXT,
  success     BOOLEAN DEFAULT true,
  error_msg   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- audit_log: utilizador pode ler os seus logs, nunca escrever directamente
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_own_audit" ON audit_log
  FOR SELECT USING (user_id = (
    SELECT id FROM profiles WHERE clerk_id = auth.uid()::text
  ));
-- Escrita apenas via service role (Edge Functions)
```

### Tabela: market_events
```sql
CREATE TABLE market_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  event_type    TEXT NOT NULL,    -- 'sector_boom','sector_crash','global_event'
  sector        TEXT,             -- sector afectado
  price_impact  NUMERIC(6,4),     -- multiplicador (1.25 = +25%)
  starts_at     TIMESTAMPTZ NOT NULL,
  ends_at       TIMESTAMPTZ NOT NULL,
  is_active     BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE market_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public" ON market_events FOR SELECT USING (true);
```

---

## 2. FUNÇÕES E TRIGGERS IMPORTANTES

### Auto-update de updated_at
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Calcular energia actual (considera regeneração)
```sql
CREATE OR REPLACE FUNCTION get_current_energy(p_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_energy INTEGER;
  v_max_energy INTEGER;
  v_last_tap TIMESTAMPTZ;
  v_seconds_elapsed NUMERIC;
  v_regen_rate NUMERIC := 1.0/3.0;  -- 1 energia por 3 segundos
BEGIN
  SELECT energy, max_energy, last_tap_at
  INTO v_energy, v_max_energy, v_last_tap
  FROM profiles WHERE id = p_id;

  IF v_last_tap IS NULL THEN
    RETURN v_max_energy;
  END IF;

  v_seconds_elapsed := EXTRACT(EPOCH FROM (NOW() - v_last_tap));
  RETURN LEAST(v_max_energy,
    v_energy + FLOOR(v_seconds_elapsed * v_regen_rate)::INTEGER
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 3. REGRAS DE ACESSO — RESUMO

| Tabela | Utilizador | Admin (service role) |
|--------|-----------|---------------------|
| profiles | Lê/edita os seus | Lê todos |
| transactions | Lê os seus | Lê todos, escreve |
| user_assets | Lê/edita os seus | Lê todos, escreve |
| tasks | Só leitura (todos) | CRUD completo |
| user_task_completions | Lê os seus | Lê todos, escreve |
| company_treasury | Sem acesso | Lê e escreve |
| loans | Lê os seus | Lê todos, escreve |
| dividend_payments | Lê os seus | Lê todos, escreve |
| audit_log | Lê os seus | Lê todos, escreve |
| market_events | Só leitura (todos) | CRUD completo |

---

## 4. CAMPOS ENCRIPTADOS

Os seguintes campos são encriptados com `pgp_sym_encrypt` antes de gravar:
- `profiles.email_encrypted` — email do utilizador
- `profiles.wallet_encrypted` — endereço de carteira ETH
- `audit_log.ip_encrypted` — endereço IP

A chave de encriptação vem de `current_setting('app.encryption_key')` — definida
apenas nas Edge Functions via `Deno.env.get('APP_ENCRYPTION_KEY')`.
