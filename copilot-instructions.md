# WageCompany — GitHub Copilot Instructions
# Lido automaticamente pelo GitHub Copilot em todo o projecto

## Projecto
WageCompany — sistema económico digital play-to-earn.
Stack: Vite + React 18 + TypeScript + shadcn/ui + Tailwind + Supabase + Clerk + wagmi (Base blockchain)
Contexto completo: AI_CONTEXT.md na raiz

## Regras Prioritárias

### NUNCA fazer
- Lógica financeira no React — vai sempre para Supabase Edge Functions
- Expor variáveis sem prefixo VITE_ ao browser
- Usar `any` em TypeScript sem comentário justificativo
- Alterar as constantes económicas (TREASURY_RATE, BURN_RATE, etc.)
- Usar bun ou yarn — apenas npm

### SEMPRE fazer
- Validar inputs com Zod em Edge Functions
- Verificar auth Clerk antes de operações protegidas
- Registar operações financeiras no audit_log
- RLS verificado em queries Supabase
- Loading states em operações async

## Constantes Económicas (IMUTÁVEIS)
EXCHANGE_RATE = 1000 ($MINE por $WAGE)
TREASURY_RATE = 0.005 (0.5%)
BURN_RATE     = 0.02  (2%)
MAX_SUPPLY    = 1_000_000_000 $WAGE

## Padrões de Código

### Componente React
interface Props { value: number; label: string; }
export const NomeComponente = ({ value, label }: Props) => (
  <div className="card-clean p-4">{label}: {value.toLocaleString()}</div>
);

### Edge Function Supabase
Deno.serve(async (req) => {
  // 1. Auth, 2. Zod validate, 3. Business logic, 4. Audit log, 5. Response
});

## Skills disponíveis em .ai/skills/
security-audit | database | frontend-ui | economy-logic | blockchain | testing
