import { motion } from "framer-motion";

export interface Sector {
  name: string;
  emoji: string;
  companies: string[];
  dailyYield: number;
  volatility: "Muito Baixa" | "Baixa" | "Média" | "Alta" | "Muito Alta";
  cycle: string;
  pricePerShare: number;
  change24h: number;
}

const volatilityColors: Record<string, string> = {
  "Muito Baixa": "text-primary",
  "Baixa": "text-primary",
  "Média": "text-gold",
  "Alta": "text-destructive",
  "Muito Alta": "text-destructive",
};

const SectorCard = ({ sector, onBuy }: { sector: Sector; onBuy?: () => void }) => {
  const isPositive = sector.change24h >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-xl border border-border bg-gradient-card p-4 card-shine cursor-pointer select-none"
      onClick={onBuy}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
          {sector.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-sm truncate">{sector.name}</h3>
          <p className="text-[10px] text-muted-foreground font-body truncate">{sector.companies[0]}, {sector.companies[1]}</p>
        </div>
        <div className="text-right">
          <p className={`text-xs font-display font-bold ${isPositive ? "text-primary" : "text-destructive"}`}>
            {isPositive ? "+" : ""}{sector.change24h.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[10px] font-body">
        <div>
          <p className="text-muted-foreground">Preço/ação</p>
          <p className="font-display font-bold text-sm">{sector.pricePerShare} $W</p>
        </div>
        <div>
          <p className="text-muted-foreground">Yield/dia</p>
          <p className="font-display font-bold text-sm text-primary">{sector.dailyYield}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">Volatilidade</p>
          <p className={`font-display font-bold text-sm ${volatilityColors[sector.volatility]}`}>{sector.volatility}</p>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground font-body">{sector.cycle}</span>
        <button className="text-[10px] text-primary font-display font-medium tap-shrink">Comprar ação →</button>
      </div>
    </motion.div>
  );
};

export default SectorCard;
