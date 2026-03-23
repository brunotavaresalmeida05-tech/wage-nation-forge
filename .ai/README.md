# WageCompany — Skills de IA
> Pasta de contexto para agentes de IA (Cursor, Copilot, Claude, etc.)
> Lê os ficheiros nesta ordem antes de qualquer tarefa.

---

## Ordem de Leitura

| # | Ficheiro | Lê quando... |
|---|----------|-------------|
| 1 | `PROJECT_CONTEXT.md` | **SEMPRE** — contexto geral, stack, estrutura |
| 2 | `SECURITY.md` | Qualquer tarefa com BD, auth, API ou dados |
| 3 | `DATABASE.md` | Trabalhar com Supabase, queries, migrations |
| 4 | `DESIGN_SYSTEM.md` | Criar ou editar componentes UI |
| 5 | `ECONOMY.md` | Lógica financeira, cálculos, tokenomics |
| 6 | `FEATURES.md` | Implementar uma feature específica |
| 7 | `DEVELOPMENT_PLAN.md` | Planear próxima tarefa, ver estado actual |

---

## Regras Absolutas para Agentes de IA

### NUNCA
- Processar lógica financeira no React (frontend)
- Expor variáveis de ambiente sem prefixo `VITE_` ao browser
- Omitir verificação de autenticação em Edge Functions
- Fazer operações de BD sem RLS activo
- Usar `any` em TypeScript
- Commitar `.env.local` ou qualquer ficheiro com chaves

### SEMPRE
- Validar inputs com Zod antes de qualquer operação
- Registar operações financeiras no `audit_log`
- Usar transacções SQL para operações multi-tabela
- Verificar o `DEVELOPMENT_PLAN.md` para a fase actual
- Seguir as convenções de nome dos ficheiros existentes

---

## Estrutura de uma Edge Function

```typescript
// supabase/functions/nome-da-funcao/index.ts
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const InputSchema = z.object({ /* ... */ })

Deno.serve(async (req) => {
  // 1. CORS
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  // 2. Auth
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Unauthorized', { status: 401 })

  // 3. Parse + Validate
  const body = await req.json()
  const parsed = InputSchema.safeParse(body)
  if (!parsed.success) return new Response('Bad Request', { status: 400 })

  // 4. Supabase com service role (acesso total, seguro pois está no servidor)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 5. Lógica de negócio
  // ...

  // 6. Audit log
  await supabase.from('audit_log').insert({ /* ... */ })

  // 7. Resposta
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  })
})
```

---

## Perguntas Frequentes para Agentes

**Q: Onde corre a lógica de tap?**
A: `supabase/functions/mine-tap/index.ts` — NUNCA no React

**Q: Como obtenho o profile do utilizador autenticado?**
A: `const { data } = await supabase.from('profiles').select('*').eq('clerk_id', userId).single()`

**Q: Como encripto um campo sensível?**
A: Ver `DATABASE.md` secção 4 — função `encrypt_field()` com pgcrypto

**Q: Qual é a taxa da exchange?**
A: Ver `ECONOMY.md` — TREASURY_RATE=0.005, BURN_RATE=0.02

**Q: Posso alterar os valores das constantes económicas?**
A: NÃO. Ver `ECONOMY.md` — "Nunca alterar sem autorização do owner"

**Q: Como adiciono uma nova página?**
A: Criar em `src/pages/NomePage.tsx`, adicionar rota em `App.tsx`, adicionar link em `AppLayout.tsx`

**Q: O projecto usa npm ou bun?**
A: npm (`package-lock.json`). Usar sempre `npm install`, `npm run dev`
