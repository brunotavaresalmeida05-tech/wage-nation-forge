import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

      setScale(0.95);
      setTimeout(() => setScale(1), 100);

      onTap(minePerTap);
    },
    [energy, minePerTap, onTap]
  );

  const energyPercent = (energy / maxEnergy) * 100;

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Balance Display */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground font-body tracking-wide uppercase">$MINE Balance</p>
        <p className="text-4xl font-display font-bold text-gradient-mine">
          {mineBalance.toLocaleString()}
        </p>
      </div>

      {/* Tap Button */}
      <div className="relative">
        <button
          onMouseDown={handleTap}
          disabled={energy <= 0}
          className="relative w-44 h-44 rounded-full border-2 border-border flex items-center justify-center tap-shrink select-none disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.1s",
            background: "radial-gradient(circle at 40% 35%, hsl(145 72% 40% / 0.12), hsl(0 0% 95% / 0.5), transparent 70%)",
            boxShadow: energy > 0 ? "0 0 40px hsl(145 72% 40% / 0.1), inset 0 0 30px hsl(145 72% 40% / 0.05)" : "none",
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-5xl">⛏️</span>
            <span className="text-xs text-muted-foreground font-body">TAP TO MINE</span>
          </div>
        </button>

        {/* Coin pop animations */}
        <AnimatePresence>
          {coinPops.map((pop) => (
            <motion.div
              key={pop.id}
              initial={{ scale: 0, y: 0, opacity: 1 }}
              animate={{ scale: 1.2, y: -50, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute pointer-events-none text-primary font-display font-bold text-lg"
              style={{ left: pop.x - 15, top: pop.y - 10 }}
            >
              +{pop.value}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Energy Bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-muted-foreground mb-1 font-body">
          <span>⚡ Energy</span>
          <span>{energy}/{maxEnergy}</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gradient-mine)" }}
            animate={{ width: `${energyPercent}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground font-body">+{minePerTap} $MINE per tap</p>
    </div>
  );
};

export default TapToMine;
