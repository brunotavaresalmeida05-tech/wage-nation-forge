# Wage — The Money App

Sistema económico digital play-to-earn. Ganha $MINE, converte em $WAGE, investe em ativos sintéticos.

## Stack

- Vite + React + TypeScript
- shadcn/ui + Tailwind CSS
- Supabase (base de dados + auth)
- wagmi (blockchain Base)

## Instalação
```bash
npm install
npm run dev
```

## Variáveis de ambiente

Cria um ficheiro `.env.local` na raiz com:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLERK_PUBLISHABLE_KEY=
```

## Estrutura
```
src/
  components/     # Componentes reutilizáveis
  pages/          # Páginas da aplicação
  hooks/          # Custom hooks
  lib/            # Utilitários
```
