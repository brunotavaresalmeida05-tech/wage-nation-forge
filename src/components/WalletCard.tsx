import { motion } from "framer-motion";

interface WalletCardProps {
  mineBalance: number;
  wageBalance: number;
  wageUsdRate: number;
}

const WalletCard = ({ mineBalance, wageBalance, wageUsdRate }: WalletCardProps) => {
  const usdValue = (wageBalance * wageUsdRate).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg p-5 card-shine"
      style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-muted-foreground font-body uppercase tracking-wider">My Wallet</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-body">Active</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* MINE Balance */}
        <div className="rounded-md bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground font-body mb-1">$MINE</p>
          <p className="text-xl font-display font-bold text-gradient-mine">
            {mineBalance.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground font-body mt-1">Internal token</p>
        </div>

        {/* WAGE Balance */}
        <div className="rounded-md bg-secondary/50 p-3">
          <p className="text-xs text-muted-foreground font-body mb-1">$WAGE</p>
          <p className="text-xl font-display font-bold text-gradient-primary">
            {wageBalance.toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground font-body mt-1">≈ ${usdValue} USD</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletCard;
