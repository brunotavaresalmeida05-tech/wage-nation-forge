import { motion } from "framer-motion";
import { Wallet, ArrowUpRight } from "lucide-react";

interface WalletCardProps {
  mineBalance: number;
  wageBalance: number;
  wageUsdRate: number;
}

const WalletCard = ({ mineBalance, wageBalance, wageUsdRate }: WalletCardProps) => {
  const usdValue = (wageBalance * wageUsdRate).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-foreground text-background"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-background/60" />
          <span className="text-xs font-body text-background/60 tracking-wide">Carteira</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-body text-primary font-medium">Ativa</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-background/50 font-body mb-0.5">$MINE</p>
          <p className="text-2xl font-display font-bold text-background">
            {mineBalance.toLocaleString()}
          </p>
          <p className="text-[10px] text-background/40 font-body mt-0.5">Token interno</p>
        </div>

        <div>
          <p className="text-[10px] text-background/50 font-body mb-0.5">$WAGE</p>
          <p className="text-2xl font-display font-bold text-primary">
            {wageBalance.toLocaleString()}
          </p>
          <p className="text-[10px] text-background/40 font-body mt-0.5">≈ ${usdValue} USD</p>
        </div>
      </div>

      <div className="flex gap-2 mt-5">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-background/10 text-background text-xs font-body font-medium tap-shrink">
          <ArrowUpRight size={14} />
          Enviar
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-body font-medium tap-shrink">
          Receber
        </button>
      </div>
    </motion.div>
  );
};

export default WalletCard;
