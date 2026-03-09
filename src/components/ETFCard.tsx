import { motion } from "framer-motion";

export interface ETF {
  name: string;
  ticker: string;
  emoji: string;
  profile: string;
  targetYield: number;
  composition: { sector: string; pct: number }[];
  minInvestment: number;
  totalAUM: number;
  change7d: number;
}

const profileColors: Record<string, { color: string; bg: string; border: string }> = {
  Growth: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/30" },
  Conservative: { color: "text-info", bg: "bg-info/10", border: "border-info/30" },
  Dividend: { color: "text-gold", bg: "bg-gold/10", border: "border-gold/30" },
  Thematic: { color: "text-success", bg: "bg-success/10", border: "border-success/30" },
  Balanced: { color: "text-foreground", bg: "bg-secondary", border: "border-border" },
};

const ETFCard = ({ etf, onBuy }: { etf: ETF; onBuy?: () => void }) => {
  const config = profileColors[etf.profile] || profileColors.Balanced;
  const isPositive = etf.change7d >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-xl border-2 ${config.border} bg-gradient-card p-5 card-shine cursor-pointer select-none`}
      onClick={onBuy}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{etf.emoji}</span>
          <div>
            <h3 className="font-display font-bold text-base">{etf.name}</h3>
            <p className="text-xs text-muted-foreground font-body">{etf.ticker}</p>
          </div>
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-display px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
          {etf.profile}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3 text-center">
        <div>
          <p className="text-[10px] text-muted-foreground font-body">Target Yield</p>
          <p className={`text-lg font-display font-bold ${config.color}`}>{etf.targetYield}%<span className="text-[10px]">/day</span></p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground font-body">7d</p>
          <p className={`text-lg font-display font-bold ${isPositive ? "text-success" : "text-destructive"}`}>
            {isPositive ? "+" : ""}{etf.change7d.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground font-body">Total AUM</p>
          <p className="text-lg font-display font-bold">{(etf.totalAUM / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Composition bar */}
      <div className="mb-3">
        <p className="text-[10px] text-muted-foreground font-body mb-1">Composition</p>
        <div className="flex h-2 rounded-full overflow-hidden bg-secondary">
          {etf.composition.map((c, i) => (
            <div
              key={c.sector}
              className="h-full"
              style={{
                width: `${c.pct}%`,
                background: `hsl(${145 + i * 30} 60% ${40 + i * 5}%)`,
              }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
          {etf.composition.map((c, i) => (
            <span key={c.sector} className="text-[9px] text-muted-foreground font-body">
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: `hsl(${145 + i * 30} 60% ${40 + i * 5}%)` }} />
              {c.sector} {c.pct}%
            </span>
          ))}
        </div>
      </div>

      <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
        Buy Shares — Min. {etf.minInvestment} $WAGE
      </button>
    </motion.div>
  );
};

export default ETFCard;
