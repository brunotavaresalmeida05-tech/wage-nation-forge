import { motion } from "framer-motion";

interface AssetCardProps {
  name: string;
  icon: string;
  category: string;
  price: number;
  change24h: number;
  yield?: number;
}

const AssetCard = ({ name, icon, category, price, change24h, yield: yieldPct }: AssetCardProps) => {
  const isPositive = change24h >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-lg border border-border/50 p-3 bg-gradient-card card-shine cursor-pointer min-w-[140px] select-none"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs font-display font-semibold leading-tight">{name}</p>
          <p className="text-[10px] text-muted-foreground font-body">{category}</p>
        </div>
      </div>

      <p className="font-display font-bold text-sm">{price.toLocaleString()} $W</p>

      <div className="flex items-center justify-between mt-1">
        <span className={`text-[11px] font-body ${isPositive ? "text-primary" : "text-destructive"}`}>
          {isPositive ? "▲" : "▼"} {Math.abs(change24h).toFixed(1)}%
        </span>
        {yieldPct !== undefined && (
          <span className="text-[10px] text-accent font-body">APY {yieldPct}%</span>
        )}
      </div>
    </motion.div>
  );
};

export default AssetCard;
