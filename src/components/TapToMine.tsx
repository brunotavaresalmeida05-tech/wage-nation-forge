import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface CoinPop {
  id: number;
  x: number;
  y: number;
  value: number;
}

interface TapToMineProps {
  mineBalance: number;
  energy: number;
  maxEnergy: number;
  onTap: (earned: number) => void;
  minePerTap: number;
}

const TapToMine = ({ mineBalance, energy, maxEnergy, onTap, minePerTap }: TapToMineProps) => {
  const [coinPops, setCoinPops] = useState<CoinPop[]>([]);
  const [scale, setScale] = useState(1);
  const nextId = useRef(0);

  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      if (energy <= 0) return;

      let clientX: number, clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const id = nextId.current++;
      setCoinPops((prev) => [...prev, { id, x, y, value: minePerTap }]);
      setTimeout(() => {
        setCoinPops((prev) => prev.filter((c) => c.id !== id));
      }, 600);

      setScale(0.96);
      setTimeout(() => setScale(1), 100);

      onTap(minePerTap);
    },
    [energy, minePerTap, onTap]
  );

  const energyPercent = (energy / maxEnergy) * 100;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-body tracking-wide">Saldo $MINE</p>
        <p className="text-4xl font-display font-bold mt-1">
          {mineBalance.toLocaleString()}
        </p>
      </div>

      <div className="relative">
        <button
          onMouseDown={handleTap}
          disabled={energy <= 0}
          className="relative w-40 h-40 rounded-full flex items-center justify-center tap-shrink select-none disabled:opacity-30 disabled:cursor-not-allowed border-2 border-border bg-card transition-all"
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.1s",
            boxShadow: energy > 0 ? "0 0 40px hsl(145 80% 42% / 0.08), inset 0 0 20px hsl(145 80% 42% / 0.03)" : "none",
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap size={28} className="text-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground font-body font-medium mt-1">TAP TO MINE</span>
          </div>
        </button>

        <AnimatePresence>
          {coinPops.map((pop) => (
            <motion.div
              key={pop.id}
              initial={{ scale: 0, y: 0, opacity: 1 }}
              animate={{ scale: 1.1, y: -45, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute pointer-events-none text-primary font-display font-bold text-base"
              style={{ left: pop.x - 15, top: pop.y - 10 }}
            >
              +{pop.value}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-xs">
        <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5 font-body">
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-primary" />
            <span>Energia</span>
          </div>
          <span className="font-medium">{energy}/{maxEnergy}</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${energyPercent}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground font-body">+{minePerTap} $MINE por tap</p>
    </div>
  );
};

export default TapToMine;
