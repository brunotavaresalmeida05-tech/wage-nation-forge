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

      setScale(0.94);
      setTimeout(() => setScale(1), 100);

      onTap(minePerTap);
    },
    [energy, minePerTap, onTap]
  );

  const energyPercent = (energy / maxEnergy) * 100;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-body tracking-wide uppercase">$MINE Balance</p>
        <p className="text-4xl font-display font-bold mt-1">
          {mineBalance.toLocaleString()}
        </p>
      </div>

      <div className="relative">
        <button
          onMouseDown={handleTap}
          disabled={energy <= 0}
          className="relative w-48 h-48 rounded-full flex items-center justify-center tap-shrink select-none disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.1s",
          }}
        >
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full animate-pulse-glow" style={{
            background: energy > 0 ? "radial-gradient(circle, hsl(214 99% 60% / 0.12) 0%, transparent 70%)" : "none"
          }} />
          
          {/* Greek key pattern outer ring - SVG */}
          <div className="absolute inset-0 rounded-full animate-coin-bounce">
            <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: "drop-shadow(0 0 12px hsl(214 99% 60% / 0.3))" }}>
              {/* Outer circle */}
              <circle cx="100" cy="100" r="96" fill="none" stroke="hsl(214, 99%, 60%)" strokeWidth="2" opacity="0.6" />
              <circle cx="100" cy="100" r="92" fill="none" stroke="hsl(214, 99%, 60%)" strokeWidth="1" opacity="0.3" />
              
              {/* Greek key / meander pattern ring */}
              <g opacity="0.5">
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i * 15) * (Math.PI / 180);
                  const r = 85;
                  const x1 = 100 + r * Math.cos(angle);
                  const y1 = 100 + r * Math.sin(angle);
                  const x2 = 100 + (r - 8) * Math.cos(angle + 0.04);
                  const y2 = 100 + (r - 8) * Math.sin(angle + 0.04);
                  const x3 = 100 + (r - 8) * Math.cos(angle + 0.12);
                  const y3 = 100 + (r - 8) * Math.sin(angle + 0.12);
                  const x4 = 100 + r * Math.cos(angle + 0.12);
                  const y4 = 100 + r * Math.sin(angle + 0.12);
                  return (
                    <path
                      key={i}
                      d={`M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4}`}
                      fill="none"
                      stroke="hsl(214, 99%, 60%)"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </g>
              
              {/* Decorative inner ring */}
              <circle cx="100" cy="100" r="75" fill="none" stroke="hsl(214, 99%, 60%)" strokeWidth="1.5" opacity="0.4" strokeDasharray="4 3" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="hsl(214, 99%, 60%)" strokeWidth="1" opacity="0.2" />
              
              {/* Inner filled circle */}
              <circle cx="100" cy="100" r="62" fill="hsl(214, 99%, 60%)" opacity="0.08" />
              <circle cx="100" cy="100" r="62" fill="none" stroke="hsl(214, 99%, 60%)" strokeWidth="2" opacity="0.5" />
              
              {/* Center white/light circle for the M */}
              <circle cx="100" cy="100" r="48" fill="hsl(var(--card))" stroke="hsl(214, 99%, 60%)" strokeWidth="2" opacity="1" />
              
              {/* Small decorative dots around */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const x = 100 + 56 * Math.cos(angle);
                const y = 100 + 56 * Math.sin(angle);
                return <circle key={`dot-${i}`} cx={x} cy={y} r="1.5" fill="hsl(214, 99%, 60%)" opacity="0.4" />;
              })}
            </svg>
          </div>

          {/* M Letter - positioned absolutely on top */}
          <span className="relative z-10 text-6xl font-display font-black text-primary drop-shadow-lg select-none animate-coin-bounce" style={{
            textShadow: "0 0 24px hsl(214 99% 60% / 0.5), 0 2px 4px hsl(0 0% 0% / 0.4)"
          }}>
            M
          </span>
        </button>

        <AnimatePresence>
          {coinPops.map((pop) => (
            <motion.div
              key={pop.id}
              initial={{ scale: 0, y: 0, opacity: 1 }}
              animate={{ scale: 1.2, y: -50, opacity: 0 }}
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

      <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Tap to mine</p>

      <div className="w-full max-w-xs">
        <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5 font-body">
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-primary" />
            <span>Energy</span>
          </div>
          <span className="font-medium">{energy}/{maxEnergy}</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${energyPercent}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground font-body">+{minePerTap} $MINE per tap</p>
    </div>
  );
};

export default TapToMine;
