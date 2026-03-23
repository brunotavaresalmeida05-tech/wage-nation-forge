# Skill: Frontend UI
> Auto-activada quando: criar componentes React, páginas, hooks de UI

---

## Padrão de Componente

```tsx
// src/components/NomeComponente.tsx
import { type FC } from 'react';
import { cn } from '@/lib/utils';

// Types SEMPRE no topo do ficheiro
interface NomeComponenteProps {
  value: number;
  label: string;
  variant?: 'default' | 'success' | 'warning';
  className?: string;
  onAction?: () => void;
}

// Componente com export named (não default) salvo para páginas
export const NomeComponente: FC<NomeComponenteProps> = ({
  value,
  label,
  variant = 'default',
  className,
  onAction,
}) => {
  return (
    <div className={cn(
      'card-clean p-4 rounded-xl transition-all duration-200',
      variant === 'success' && 'border-wage-green/30',
      variant === 'warning' && 'border-yellow-500/30',
      className
    )}>
      <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-bold font-display text-foreground mt-1">
        {value.toLocaleString()}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-3 w-full tap-shrink"
        >
          Acção
        </button>
      )}
    </div>
  );
};
```

---

## Cores e Classes Disponíveis

```tsx
// $MINE — sempre verde
<span className="text-wage-green font-mono font-bold">
  {mineBalance.toLocaleString()} $M
</span>

// $WAGE — sempre azul
<span className="text-primary font-mono font-bold">
  {wageBalance.toFixed(4)} $W
</span>

// Prémios/streak — dourado
<span className="text-yellow-400 font-mono">+200 $M</span>

// Cards base
<div className="card-clean p-4 rounded-xl">...</div>

// Gradientes disponíveis
<div className="bg-gradient-card">...</div>
<div className="text-gradient-primary">...</div>
<div className="text-gradient-mine">...</div>

// Sombras disponíveis
<div className="shadow-glow-primary">...</div>
<div className="shadow-glow-gold">...</div>

// Animações
<div className="animate-pulse-glow">...</div>  // botão tap activo
<div className="animate-float">...</div>        // ícone flutuante
<div className="animate-fade-in">...</div>      // entrada suave

// Utilitários
<div className="tap-shrink">...</div>           // active:scale-[0.97]
<div className="scrollbar-hide">...</div>       // sem scrollbar
```

---

## Padrão de Página

```tsx
// src/pages/NomePage.tsx
import { useUser } from '@clerk/clerk-react';
import { useProfile } from '@/hooks/useProfile';

export default function NomePage() {
  const { user } = useUser();
  const profile = useProfile(user?.id ?? '');

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">Título da Página</h1>
        {/* acções */}
      </div>
      {/* conteúdo */}
    </div>
  );
}
```

---

## Padrão de Hook

```typescript
// src/hooks/useNomeFuncionalidade.ts
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

export function useNomeFuncionalidade() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executarAccao = useCallback(async (params: { valor: number }) => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('nome-edge-function', {
        body: { ...params },
      });

      if (error) throw error;

      toast.success('Acção concluída!');
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { executarAccao, loading, error };
}
```

---

## Regras de UI

- Usar `toLocaleString()` para números grandes (1.250 não 1250)
- Usar `toFixed(4)` para $WAGE (precisão de 4 casas decimais)
- Sempre mostrar loading state durante operações async
- Usar `toast.success/error` (sonner) para feedback
- Nunca mostrar erros técnicos ao utilizador — mensagens amigáveis
- Componentes de UI base vêm de `src/components/ui/` (shadcn — não editar)
- `cn()` de `@/lib/utils` para combinar classes condicionais
