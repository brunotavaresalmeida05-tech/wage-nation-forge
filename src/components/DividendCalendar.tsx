import { motion } from "framer-motion";
import { Monitor, PiggyBank, Home, Landmark } from "lucide-react";

interface DividendEntry {
  asset: string;
  icon: React.ReactNode;
  amount: number;
  date: string;
  daysUntil: number;
  type: "Ações" | "ETF" | "Imóvel" | "Especial";
}

const typeStyles: Record<string, string> = {
  "Ações": "bg-info/10 text-info",
  "ETF": "bg-primary/10 text-primary",
  "Imóvel": "bg-gold/10 text-gold",
  "Especial": "bg-[hsl(265_60%_55%/.1)] text-[hsl(265_60%_55%)]",
};

const entries: DividendEntry[] = [
  { asset: "WageTech Corp", icon: <Monitor size={18} className="text-info" />, amount: 6.0, date: "Dia 15", daysUntil: 3, type: "Ações" },
  { asset: "ETF Dividendos", icon: <PiggyBank size={18} className="text-primary" />, amount: 12.5, date: "Segunda", daysUntil: 1, type: "ETF" },
  { asset: "Apt. T2 Lisboa", icon: <Home size={18} className="text-gold" />, amount: 1.2, date: "Hoje", daysUntil: 0, type: "Imóvel" },
  { asset: "Profit Sharing", icon: <Landmark size={18} className="text-[hsl(265_60%_55%)]" />, amount: 45.0, date: "Dia 30", daysUntil: 14, type: "Especial" },
];

const DividendCalendar = () => {
  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <motion.div
          key={entry.asset}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-3 card-clean p-3"
        >
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
            {entry.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display font-semibold truncate">{entry.asset}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[9px] uppercase tracking-wider font-body px-1.5 py-0.5 rounded-md ${typeStyles[entry.type]}`}>
                {entry.type}
              </span>
              <span className="text-[10px] text-muted-foreground font-body">
                {entry.daysUntil === 0 ? "Hoje" : `em ${entry.daysUntil}d`}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-display font-bold text-primary">+{entry.amount} $W</p>
            <p className="text-[10px] text-muted-foreground font-body">{entry.date}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DividendCalendar;
