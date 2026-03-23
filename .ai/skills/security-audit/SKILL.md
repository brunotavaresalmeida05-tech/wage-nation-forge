# Skill: Security Audit
> Auto-activada quando: tarefa envolve segurança, auth, BD, API, encriptação
> Propósito: garantir que código produzido segue todas as regras de segurança

---

## Quando usar esta skill

Activar automaticamente quando:
- Criar ou editar Edge Functions
- Trabalhar com Supabase (queries, migrations, RLS)
- Implementar autenticação ou autorização
- Lidar com dados sensíveis (email, wallet, IP)
- Fazer deploy ou configurar ambiente

---

## Checklist de Segurança (executar antes de terminar)

### Variáveis de Ambiente
```bash
# Verificar que nenhuma chave secreta está no código fonte
grep -r "eyJ" src/ --include="*.ts" --include="*.tsx"
grep -r "sk_" src/ --include="*.ts" --include="*.tsx"
grep -r "SERVICE_ROLE" src/ --include="*.ts" --include="*.tsx"
# Resultado esperado: sem matches
```

### RLS (Row Level Security)
```sql
-- Verificar que RLS está activo em todas as tabelas
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
-- Resultado esperado: rowsecurity = true em TODAS
```

### Encriptação de Campos
```typescript
// SEMPRE encriptar antes de guardar na BD:
const emailEncrypted = await encryptField(email, encryptionKey);
await supabase.from('profiles').update({ email_encrypted: emailEncrypted });

// NUNCA guardar email em texto claro:
// ❌ await supabase.from('profiles').update({ email: email });
```

### Validação de Inputs
```typescript
// SEMPRE usar Zod em Edge Functions:
const Schema = z.object({
  amount: z.number().int().min(1).max(1_000_000),
  userId: z.string().uuid(),
});
const result = Schema.safeParse(body);
if (!result.success) return new Response('Bad Request', { status: 400 });
```

### Auth em Edge Functions
```typescript
// SEMPRE verificar auth PRIMEIRO, antes de qualquer lógica:
const authHeader = req.headers.get('Authorization');
if (!authHeader?.startsWith('Bearer ')) {
  return new Response('Unauthorized', { status: 401 });
}
const token = authHeader.split(' ')[1];
// Verificar token com Clerk...
```

### Rate Limiting
```typescript
// SEMPRE aplicar rate limiting em operações críticas:
const key = `ratelimit:tap:${userId}`;
const requests = await redis.incr(key);
await redis.expire(key, 1); // janela de 1 segundo
if (requests > 10) {
  return new Response('Too Many Requests', { status: 429 });
}
```

---

## Padrão de Edge Function Segura

```typescript
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || 'https://wagecompany.io',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const InputSchema = z.object({
  // definir schema específico
});

Deno.serve(async (req) => {
  // 1. CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 2. Auth PRIMEIRO
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 3. Parse + Validate
    const body = await req.json().catch(() => null);
    if (!body) return new Response(JSON.stringify({ error: 'Bad Request' }), { status: 400 });
    const parsed = InputSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Validation failed' }), { status: 400 });
    }

    // 4. Supabase com service role (APENAS no servidor)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    // 5. Lógica de negócio em transacção
    const { data, error } = await supabase.rpc('nome_da_funcao_sql', parsed.data);
    if (error) throw error;

    // 6. Audit log SEMPRE
    await supabase.from('audit_log').insert({
      action: 'NOME_DA_ACCAO',
      details: { /* dados relevantes, sem dados sensíveis */ },
      ip_encrypted: await encryptField(
        req.headers.get('x-forwarded-for') || 'unknown',
        Deno.env.get('APP_ENCRYPTION_KEY')!
      ),
      success: true,
    });

    // 7. Resposta segura (nunca expor detalhes de erro internos)
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // NUNCA expor detalhes do erro ao cliente
    console.error('Internal error:', error); // apenas nos logs do servidor
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```
