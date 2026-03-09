import { motion } from "framer-motion";
import { Monitor, PiggyBank, Home, Landmark } from "lucide-react";

interface DividendEntry {
  asset: string;
  icon: React.ReactNode;
  amount: number;
  date: string;
  daysUntil: number;
  type: "Stocks" | "ETF" | "Real Estate" | "Special";
}

const typeStyles: Record<string, string> = {
  "Stocks": "bg-info/10 text-info",
  "ETF": "bg-primary/10 text-primary",
  "Real Estate": "bg-gold/10 text-gold",
  "Special": "bg-[hsl(265_60%_55%/.1)] text-[hsl(265_60%_55%)]",
};

const entries: DividendEntry[] = [
  { asset: "WageTech Corp", icon: <Monitor size={18} className="text-info" />, amount: 6.0, date: "15th", daysUntil: 3, type: "Stocks" },
  { asset: "Dividend ETF", icon: <PiggyBank size={18} className="text-primary" />, amount: 12.5, date: "Monday", daysUntil: 1, type: "ETF" },
  { asset: "Downtown Apt. NYC", icon: <Home size={18} className="text-gold" />, amount: 1.2, date: "Today", daysUntil: 0, type: "Real Estate" },
  { asset: "Profit Sharing", icon: <Landmark size={18} className="text-[hsl(265_60%_55%)]" />, amount: 45.0, date: "30th", daysUntil: 14, type: "Special" },
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
          <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
            {entry.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-display font-semibold truncate">{entry.asset}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[9px] uppercase tracking-wider font-body px-1.5 py-0.5 rounded-md ${typeStyles[entry.type]}`}>
                {entry.type}
              </span>
              <span className="text-[10px] text-muted-foreground font-body">
                {entry.daysUntil === 0 ? "Today" : `in ${entry.daysUntil}d`}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-display font-bold text-primary">+{entry.amount} $W</p>
            <p className="text-[10px] text-muted-foreground font-body">{entry.date}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DividendCalendar;
