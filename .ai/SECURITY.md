# WageCompany — Segurança
> Lê este ficheiro antes de qualquer tarefa que envolva BD, auth, API ou dados de utilizador.

---

## 1. MODELO DE AMEAÇAS

### O que protegemos
| Dado | Sensibilidade | Protecção |
|------|--------------|-----------|
| email do utilizador | Alta | Encriptado AES-256-GCM no campo |
| wallet_address | Alta | Encriptado AES-256-GCM no campo |
| ip_address (audit) | Média | Encriptado AES-256-GCM no campo |
| mine_balance | Baixa | RLS (cada user vê só os seus) |
| wage_balance | Baixa | RLS + verificação on-chain |
| chaves privadas | Crítica | NUNCA na BD — apenas vars de ambiente |

### Atacantes considerados
1. **Atacante externo** — tenta aceder à BD por SQL injection ou leak de credenciais
2. **Insider malicioso** — alguém com acesso ao Supabase dashboard
3. **Utilizador malicioso** — tenta manipular o próprio saldo via API
4. **Bot/farm** — tenta fazer tap automatizado para ganhar $MINE

---

## 2. ARQUITECTURA DE SEGURANÇA — 5 CAMADAS

### Camada 1 — TLS em trânsito (automático)
- Todo o tráfego usa HTTPS/TLS 1.3
- Fornecido pelo Supabase + Vercel automaticamente
- Nenhuma ligação HTTP permitida

### Camada 2 — Encriptação em repouso (automático)
- Supabase usa AES-256 para encriptar os ficheiros da BD no disco
- Se o disco for roubado, os dados são ilegíveis

### Camada 3 — Encriptação a nível de campo (TENS DE IMPLEMENTAR)
```sql
-- Activar extensão pgcrypto no Supabase
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para encriptar um campo
CREATE OR REPLACE FUNCTION encrypt_field(plain_text TEXT)
RETURNS BYTEA AS $$
BEGIN
  RETURN pgp_sym_encrypt(
    plain_text,
    current_setting('app.encryption_key'),
    'cipher-algo=aes256'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para desencriptar um campo
CREATE OR REPLACE FUNCTION decrypt_field(encrypted_data BYTEA)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    encrypted_data,
    current_setting('app.encryption_key')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Camada 4 — Row Level Security (TENS DE IMPLEMENTAR)
```sql
-- REGRA FUNDAMENTAL: cada utilizador só acede aos seus dados
-- Aplicar em TODAS as tabelas que têm user_id

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_data" ON profiles
  FOR ALL USING (clerk_id = auth.uid()::text);

-- Repetir para: transactions, user_assets, loans, dividends, etc.
```

### Camada 5 — Rate Limiting e Anti-Bot (TENS DE IMPLEMENTAR)
```typescript
// Em cada Edge Function crítica
const RATE_LIMITS = {
  tap: { requests: 10, window: '1 second' },
  exchange: { requests: 5, window: '1 minute' },
  login: { requests: 5, window: '1 minute' },
  withdraw: { requests: 3, window: '1 hour' },
};
```

---

## 3. VARIÁVEIS DE AMBIENTE — REGRAS ABSOLUTAS

### O que vai para o browser (prefixo VITE_)
```env
VITE_SUPABASE_URL=          # URL pública do projecto
VITE_SUPABASE_ANON_KEY=     # Chave anon (limitada pelo RLS)
VITE_CLERK_PUBLISHABLE_KEY= # Chave pública do Clerk
VITE_BASE_SEPOLIA_RPC=      # RPC público da blockchain
VITE_WAGE_CONTRACT_ADDRESS= # Endereço público do contrato
```

### O que NUNCA vai para o browser (sem prefixo VITE_)
```env
SUPABASE_SERVICE_ROLE_KEY=  # Acesso total à BD — APENAS Edge Functions
APP_ENCRYPTION_KEY=         # Chave de encriptação de campos — APENAS Edge Functions
CLERK_SECRET_KEY=           # Chave secreta Clerk — APENAS Edge Functions
CLERK_WEBHOOK_SECRET=       # Verificar webhooks — APENAS Edge Functions
DEPLOYER_PRIVATE_KEY=       # Chave privada do contrato — APENAS Edge Functions
```

### Regras
- `.env.local` está SEMPRE no `.gitignore`
- Nunca usar `console.log` com variáveis de ambiente
- Edge Functions acedem a `Deno.env.get('VAR')` — nunca ao cliente
- Verificar com `grep -r "SERVICE_ROLE" src/` antes de cada commit

---

## 4. VALIDAÇÃO DE INPUTS — ZOD OBRIGATÓRIO

```typescript
// SEMPRE validar antes de qualquer operação de BD
import { z } from 'zod';

const TapSchema = z.object({
  userId: z.string().uuid(),
  timestamp: z.number().int().positive(),
});

const ExchangeSchema = z.object({
  mineAmount: z.number().int().min(100).max(1_000_000),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

// Usar assim:
const parsed = TapSchema.safeParse(body);
if (!parsed.success) {
  return new Response('Invalid input', { status: 400 });
}
```

---

## 5. AUDIT LOG — TUDO FICA REGISTADO

```typescript
// Registar TODA a operação financeira
await supabase.from('audit_log').insert({
  user_id: profile.id,
  action: 'TAP',
  details: { mine_earned: mineEarned, energy_used: 1 },
  ip_address: encrypt(request.headers.get('x-forwarded-for')),
  user_agent: request.headers.get('user-agent'),
  created_at: new Date().toISOString(),
});
```

---

## 6. HEADERS DE SEGURANÇA HTTP

Adicionar no `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://clerk.wagecompany.io; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://sepolia.base.org; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com"
        }
      ]
    }
  ]
}
```

---

## 7. PORTAS E SERVIÇOS — O QUE FECHAR

### Supabase (fazer no dashboard)
- [ ] Desactivar "Direct database access" (porta 5432) — usar apenas API
- [ ] Desactivar "Database webhooks" desnecessários
- [ ] Activar "Leaked password protection"
- [ ] Configurar "Allowed origins" para apenas o domínio da app
- [ ] Desactivar email confirmations falsas (usar Clerk para auth)
- [ ] Revogar todas as API keys não usadas

### Vercel (fazer no dashboard)
- [ ] Activar "Password Protection" para previews
- [ ] Configurar domínio personalizado com HTTPS forçado
- [ ] Desactivar comentários de deploy público
- [ ] Configurar "Trusted IPs" se necessário

### GitHub (fazer no repositório)
- [ ] Nunca commit de `.env.local` — verificar sempre
- [ ] Activar "Secret scanning" no repositório
- [ ] Activar "Dependabot security updates"
- [ ] Branch protection em `main` — require PR review

---

## 8. CHECKLIST PRÉ-DEPLOY

```bash
# Correr antes de qualquer deploy para produção
npm run test              # Todos os testes passam?
npm run build             # Build sem erros?
grep -r "console.log" src/  # Logs de debug removidos?
grep -r "TODO\|FIXME\|HACK" src/  # Issues pendentes?
npm audit                 # Vulnerabilidades conhecidas?
```
