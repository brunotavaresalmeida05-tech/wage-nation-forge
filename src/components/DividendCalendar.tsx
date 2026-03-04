import { motion } from "framer-motion";

interface DividendEntry {
  asset: string;
  emoji: string;
  amount: number;
  date: string;
  daysUntil: number;
  type: "Ações" | "ETF" | "Imóvel" | "Especial";
}

const entries: DividendEntry[] = [
  { asset: "WageTech Corp", emoji: "💻", amount: 6.0, date: "Dia 15", daysUntil: 3, type: "Ações" },
  { asset: "ETF Dividendos", emoji: "💰", amount: 12.5, date: "Segunda", daysUntil: 1, type: "ETF" },
  { asset: "Apt. T2 Lisboa", emoji: "🏠", amount: 1.2, date: "Hoje", daysUntil: 0, type: "Imóvel" },
  { asset: "Profit Sharing", emoji: "🏛️", amount: 45.0, date: "Dia 30", daysUntil: 14, type: "Especial" },
];

const typeColors: Record<string, string> = {
  "Ações": "bg-info/10 text-info",
  "ETF": "bg-primary/10 text-primary",
  "Imóvel": "bg-gold/10 text-gold",
  "Especial": "bg-[hsl(var(--epic)/.1)] text-[hsl(var(--epic))]",
};

const DividendCalendar = () => {
  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.asset}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-3 rounded-lg p-3 bg-gradient-card border border-border"
        >
          <span className="text-xl">{entry.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display font-semibold truncate">{entry.asset}</p>
            <div className="flex items-center gap-2">
              <span className={`text-[8px] uppercase tracking-wider font-display px-1.5 py-0.5 rounded-full ${typeColors[entry.type]}`}>
                {entry.type}
              </span>
              <span className="text-[10px] text-muted-foreground font-body">
                {entry.daysUntil === 0 ? "🟢 Hoje" : `em ${entry.daysUntil}d`}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-display font-bold text-primary">+{entry.amount} $W</p>
            <p className="text-[9px] text-muted-foreground font-body">{entry.date}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DividendCalendar;
