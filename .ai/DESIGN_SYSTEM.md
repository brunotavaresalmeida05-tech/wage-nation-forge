# WageCompany — Design System
> Referência visual completa. Usar SEMPRE estas especificações.

---

## 1. PALETA DE CORES

### Cores de marca (usar em AMBOS os temas)
```css
--wage-green:  #00C22C  /* $MINE, ganhos, positivo, energia */
--wage-black:  #181818  /* Fundo body dark mode */
--wage-blue:   hsl(214 99% 60%)  /* #3B82F6 — $WAGE, links, info */
--gold:        hsl(40 92% 52%)   /* #F0B429 — prémios, streaks, gold */
```

### Tema Dark (classe .dark — default da app)
```css
--background:        0 0% 9.4%      /* #181818 — fundo principal */
--foreground:        0 0% 95%       /* branco suave — texto */
--card:              220 12% 8%     /* cards */
--card-elevated:     220 12% 11%    /* cards em hover */
--sidebar-background: 220 12% 6%   /* sidebar */
--border:            220 12% 14%   /* bordas */
--muted-foreground:  0 0% 50%      /* texto secundário */
```

### Tema Light (sem classe .dark)
```css
--background:        0 0% 100%      /* #FFFFFF */
--foreground:        0 0% 10%       /* texto escuro */
--card:              0 0% 100%      /* branco */
--sidebar-background: 220 12% 97%  /* cinza muito claro */
--border:            220 12% 88%   /* bordas claras */
```

### Cores semânticas
```css
--success:    #00C22C   /* wage-green */
--danger:     hsl(0 72% 50%)    /* vermelho */
--info:       hsl(195 70% 48%)  /* cyan */
--epic:       hsl(265 60% 55%)  /* roxo */
--legendary:  hsl(40 92% 52%)   /* gold */
--rare:       hsl(214 99% 60%)  /* azul */
```

---

## 2. TIPOGRAFIA

```css
/* Fontes carregadas no index.css */
font-family: 'Inter' — display, títulos, CTAs, saldos grandes
font-family: 'DM Sans' — corpo, labels, descrições
```

### Escala
| Token | Tamanho | Peso | Fonte | Uso |
|-------|---------|------|-------|-----|
| display-hero | 48-80px | 800 | Inter | Saldo principal |
| display-lg | 32px | 700 | Inter | Títulos de tela |
| display-md | 24px | 700 | Inter | Subtítulos, headers |
| display-sm | 18px | 600 | Inter | Títulos de card |
| body-lg | 16px | 500 | DM Sans | Texto principal |
| body-md | 14px | 400 | DM Sans | Labels, descrições |
| caption | 12px | 400 | DM Sans | Legendas, notas |
| mono | 13px | 400 | monospace | Dados financeiros, hex |

---

## 3. COMPONENTES — PADRÕES

### Card base
```tsx
// Usar sempre esta estrutura para cards
<div className="card-clean p-4 rounded-xl">
  {/* conteúdo */}
</div>

// card-clean está definido em index.css:
// bg-card border border-border/50 + shadow-card
```

### Badge de raridade
```tsx
const rarityConfig = {
  common:    { className: 'rarity-common',    label: '★ Comum' },
  rare:      { className: 'rarity-rare',      label: '★★ Raro' },
  epic:      { className: 'rarity-epic',      label: '★★★ Épico' },
  legendary: { className: 'rarity-legendary', label: '★★★★ Lendário' },
  unique:    { className: 'rarity-unique',    label: '★★★★★ Único' },
};
```

### Saldo $MINE
```tsx
// Sempre monoespaçado, cor wage-green
<span className="font-mono text-wage-green font-bold">
  {mineBalance.toLocaleString()}
</span>
```

### Saldo $WAGE
```tsx
// Sempre monoespaçado, cor wage-blue
<span className="font-mono text-wage-blue font-bold">
  {wageBalance.toFixed(4)}
</span>
```

### Barra de energia
```tsx
<div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
  <div
    className="h-full bg-wage-green transition-all duration-300"
    style={{ width: `${(energy / maxEnergy) * 100}%` }}
  />
</div>
```

### Botão primário (CTA)
```tsx
// Usar shadcn Button com variant default
<Button className="w-full bg-primary hover:bg-primary/90">
  Confirmar
</Button>
```

### Ganho animado (+valor)
```tsx
// Mostrar ganho flutuante após tap
<span className="text-wage-green font-mono text-sm animate-fade-in">
  +{mineEarned} $M
</span>
```

---

## 4. LAYOUT DA APP

### Estrutura global (AppLayout.tsx)
```
┌─────────────────────────────────────────────────────┐
│  Header (64px) — Logo + Search + Notif + Avatar     │
├──────────┬──────────────────────┬───────────────────┤
│ Sidebar  │   Área Principal     │  Painel Direito   │
│ (180px)  │   (flex-1)           │  (280px)          │
│          │                      │                   │
│ Nav      │  Conteúdo da página  │  Daily Streak     │
│ Links    │                      │  Daily Tasks      │
│          │                      │  Dividendos       │
│          │                      │  Quick Actions    │
│──────────│                      │                   │
│ Profile  │                      │                   │
│ Worker   │                      │                   │
└──────────┴──────────────────────┴───────────────────┘
```

### Sidebar — itens de navegação
```
MAIN:    Home | Mine | Swap | Market | Invest
MORE:    Vault | UBI | WagePay | Exchange | Cards | Credit | Jobs | Economics
OUTROS:  Profile | Real Estate | ETFs
```

### Painel direito — sempre visível
- Daily Streak (7 dias visualizados)
- Daily Tasks (4 tarefas com recompensas)
- Upcoming Dividends (lista com datas)
- Quick Actions (UBI | Pay P2P | Cards Bank)

---

## 5. ANIMAÇÕES DISPONÍVEIS

```css
/* Definidas em tailwind.config.ts */
animate-pulse-glow   — glow pulsante (para botão tap activo)
animate-float        — flutuação suave (para coin icon)
animate-spin-slow    — rotação lenta (para anel do botão tap)
animate-fade-in      — entrada suave (para ganhos, notificações)
```

---

## 6. TOKENS CSS PERSONALIZADOS

```css
/* Gradientes */
var(--gradient-primary)  — azul escuro
var(--gradient-mine)     — cyan → azul
var(--gradient-gold)     — dourado
var(--gradient-epic)     — roxo
var(--gradient-card)     — fundo de card subtil

/* Sombras */
var(--shadow-card)         — sombra base de card
var(--shadow-card-hover)   — sombra em hover
var(--shadow-glow-primary) — glow azul
var(--shadow-glow-gold)    — glow dourado
var(--shadow-glow-epic)    — glow roxo

/* Utilitários */
.tap-shrink      — active:scale-[0.97] para botões
.card-clean      — card base com sombra
.card-inverted   — card invertido (dark bg em light mode)
.scrollbar-hide  — esconder scrollbar
.safe-bottom     — padding para iOS home indicator
```
