import { motion } from "framer-motion";
import ETFCard, { ETF } from "../components/ETFCard";

const ETFS: ETF[] = [
  {
    name: "ETF Crescimento",
    ticker: "WGW-GROWTH",
    emoji: "🚀",
    profile: "Crescimento",
    targetYield: 0.75,
    composition: [
      { sector: "Tecnologia", pct: 35 },
      { sector: "Entretenimento", pct: 25 },
      { sector: "Materiais", pct: 20 },
      { sector: "Energia", pct: 20 },
    ],
    minInvestment: 10,
    totalAUM: 245000,
    change7d: 5.8,
  },
  {
    name: "ETF Conservador",
    ticker: "WGW-STABLE",
    emoji: "🛡️",
    profile: "Conservador",
    targetYield: 0.40,
    composition: [
      { sector: "Financeiro", pct: 30 },
      { sector: "Utilities", pct: 25 },
      { sector: "Saúde", pct: 25 },
      { sector: "Imobiliário", pct: 20 },
    ],
    minInvestment: 10,
    totalAUM: 380000,
    change7d: 1.2,
  },
  {
    name: "ETF Dividendos",
    ticker: "WGW-YIELD",
    emoji: "💰",
    profile: "Dividendos",
    targetYield: 0.55,
    composition: [
      { sector: "Imobiliário", pct: 35 },
      { sector: "Utilities", pct: 25 },
      { sector: "Financeiro", pct: 20 },
      { sector: "Agricultura", pct: 20 },
    ],
    minInvestment: 10,
    totalAUM: 190000,
    change7d: 2.4,
  },
];

const ETFsPage = () => {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <h1 className="font-display font-bold text-lg">📊 ETFs Sintéticos</h1>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full font-body text-muted-foreground">3 perfis</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* My ETF Overview */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "ETFs Ativos", value: "2", icon: "📊" },
            { label: "Rendimento/dia", value: "4.2 $W", icon: "💰" },
            { label: "Capital Investido", value: "780 $W", icon: "🔒" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-gradient-card border border-border p-3 text-center">
              <span className="text-lg">{s.icon}</span>
              <p className="text-sm font-display font-bold mt-0.5">{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-body">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="rounded-xl p-4 bg-primary/5 border border-primary/20">
          <p className="text-xs text-foreground font-display font-semibold mb-1">ℹ️ O que são ETFs?</p>
          <p className="text-[11px] text-muted-foreground font-body">
            Um ETF é um cesto automático de ativos. Compras cotas com $WAGE e recebes rendimento proporcional ao desempenho.
            Ideal para diversificação sem gerir ativos individuais.
          </p>
        </div>

        {/* Rendimento a Recolher */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-muted-foreground font-body">Rendimento acumulado</p>
            <p className="text-xl font-display font-bold text-primary">12.8 $WAGE</p>
            <p className="text-[10px] text-muted-foreground font-body">De 3 dias (max 7 dias)</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
            Recolher 💰
          </button>
        </motion.div>

        {/* ETF Cards */}
        <div className="space-y-4">
          {ETFS.map((etf, i) => (
            <motion.div
              key={etf.ticker}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <ETFCard etf={etf} />
            </motion.div>
          ))}
        </div>

        {/* ETF Elite locked */}
        <div className="rounded-xl border-2 border-dashed border-border p-5 text-center opacity-60">
          <span className="text-3xl">🔒</span>
          <h3 className="font-display font-bold text-sm mt-2">ETF de Elite — WGW-ALPHA</h3>
          <p className="text-[11px] text-muted-foreground font-body mt-1">Disponível a partir do Nível 20</p>
          <p className="text-[10px] text-muted-foreground font-body mt-0.5">Rendimento alvo: ~1.2%/dia</p>
        </div>
      </div>
    </div>
  );
};

export default ETFsPage;
