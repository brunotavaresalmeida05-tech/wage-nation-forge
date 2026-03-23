# Skill: Database Operations
> Auto-activada quando: criar migrations SQL, queries Supabase, RLS, Edge Functions com BD

---

## Regras de BD (SEMPRE seguir)

1. **RLS em TODAS as tabelas** — sem excepção
2. **Transacções** para operações que alteram múltiplas tabelas
3. **Encriptar** campos sensíveis com pgcrypto antes de gravar
4. **Nunca** usar `SELECT *` em código de produção — especificar colunas
5. **Índices** em colunas usadas em WHERE (user_id, clerk_id, created_at)
6. **Timestamps** em UTC sempre com `TIMESTAMPTZ`

---

## Padrão de Migration

```sql
-- supabase/migrations/00X_nome_descritivo.sql
-- Sempre com comentário de data e propósito

-- ==========================================
-- Migration: 001_initial_schema
-- Data: 2026-03-22
-- Propósito: Criar schema inicial do WageCompany
-- ==========================================

BEGIN;

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela
CREATE TABLE IF NOT EXISTS nome_tabela (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- colunas...
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Activar RLS IMEDIATAMENTE
ALTER TABLE nome_tabela ENABLE ROW LEVEL SECURITY;

-- Criar política
CREATE POLICY "descricao_clara" ON nome_tabela
  FOR ALL
  USING (user_id = auth.uid());

-- Índices
CREATE INDEX IF NOT EXISTS idx_nome_tabela_user_id
  ON nome_tabela(user_id);

COMMIT;
```

---

## Padrão de Query no Frontend

```typescript
// src/lib/supabase.ts — cliente configurado
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Hook padrão de fetch
export async function getProfile(clerkId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, mine_balance, energy, max_energy, level, streak_days')  // nunca SELECT *
    .eq('clerk_id', clerkId)
    .single();

  if (error) throw new Error(`Profile fetch failed: ${error.message}`);
  return data;
}
```

---

## Encriptação de Campos

```typescript
// supabase/functions/_shared/encryption.ts
export async function encryptField(
  plainText: string,
  key: string
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key.slice(0, 32)); // 256 bits
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'AES-GCM' }, false, ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encoder.encode(plainText)
  );
  // Combinar IV + dados encriptados em base64
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptField(
  encryptedBase64: string,
  key: string
): Promise<string> {
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key.slice(0, 32));
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'AES-GCM' }, false, ['decrypt']
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv }, cryptoKey, data
  );
  return new TextDecoder().decode(decrypted);
}
```

---

## Realtime Subscription (padrão)

```typescript
// src/hooks/useProfile.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useProfile(clerkId: string) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!clerkId) return;

    // Fetch inicial
    supabase
      .from('profiles')
      .select('id, mine_balance, energy, max_energy, level, streak_days, wage_id_tier')
      .eq('clerk_id', clerkId)
      .single()
      .then(({ data }) => setProfile(data));

    // Subscrição realtime
    const channel = supabase
      .channel(`profile:${clerkId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `clerk_id=eq.${clerkId}`,
      }, ({ new: newProfile }) => setProfile(newProfile))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [clerkId]);

  return profile;
}
```
