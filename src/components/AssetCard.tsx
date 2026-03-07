import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

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
      whileTap={{ scale: 0.97 }}
      className="card-clean p-3.5 cursor-pointer select-none"
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-lg">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-display font-semibold leading-tight truncate">{name}</p>
          <p className="text-[10px] text-muted-foreground font-body">{category}</p>
        </div>
      </div>

      <p className="font-display font-bold text-sm">{price.toLocaleString()} $W</p>

      <div className="flex items-center justify-between mt-1.5">
        <span className={`flex items-center gap-0.5 text-[11px] font-body font-medium ${isPositive ? "text-primary" : "text-destructive"}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change24h).toFixed(1)}%
        </span>
        {yieldPct !== undefined && (
          <span className="text-[10px] text-muted-foreground font-body">APY {yieldPct}%</span>
        )}
      </div>
    </motion.div>
  );
};

export default AssetCard;
