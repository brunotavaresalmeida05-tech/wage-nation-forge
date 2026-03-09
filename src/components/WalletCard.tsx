import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, ArrowDownUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CoinIcon from "./CoinIcon";

interface WalletCardProps {
  mineBalance: number;
  wageBalance: number;
  wageUsdRate: number;
}

const WalletCard = ({ mineBalance, wageBalance, wageUsdRate }: WalletCardProps) => {
  const usdValue = (wageBalance * wageUsdRate).toFixed(2);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-5 bg-card border border-border/40"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CoinIcon type="wage" size={20} />
          <span className="text-xs font-body text-muted-foreground tracking-wide">Wallet</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-body text-primary font-medium">Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <CoinIcon type="mine" size={14} />
            <p className="text-[10px] text-muted-foreground font-body">$MINE</p>
          </div>
          <p className="text-2xl font-display font-bold">{mineBalance.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground font-body mt-0.5">Internal token</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <CoinIcon type="wage" size={14} />
            <p className="text-[10px] text-muted-foreground font-body">$WAGE</p>
          </div>
          <p className="text-2xl font-display font-bold text-primary">{wageBalance.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground font-body mt-0.5">≈ ${usdValue} USD</p>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-secondary text-foreground text-xs font-body font-medium tap-shrink">
          <ArrowUpRight size={14} /> Send
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-secondary text-foreground text-xs font-body font-medium tap-shrink">
          <ArrowDownLeft size={14} /> Receive
        </button>
        <button
          onClick={() => navigate("/swap")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium tap-shrink"
        >
          <ArrowDownUp size={14} /> Swap
        </button>
      </div>
    </motion.div>
  );
};

export default WalletCard;
