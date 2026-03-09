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
          {/* Coin SVG - static, matching reference design */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ filter: energy > 0 ? "drop-shadow(0 0 16px hsl(214 99% 60% / 0.25))" : "none" }}>
            {/* Outer border ring */}
            <circle cx="100" cy="100" r="97" fill="none" stroke="currentColor" strokeWidth="3" className="text-foreground" opacity="0.9" />
            <circle cx="100" cy="100" r="93" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground" opacity="0.5" />

            {/* Greek key meander pattern band */}
            <defs>
              <clipPath id="meanderRing">
                <path d="M100,12 A88,88 0 1,1 99.9,12 Z M100,30 A70,70 0 1,0 99.9,30 Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#meanderRing)" className="text-foreground" opacity="0.8">
              {Array.from({ length: 32 }).map((_, i) => {
                const angle = (i * 11.25) * (Math.PI / 180);
                const cx = 100;
                const cy = 100;
                const r1 = 89;
                const r2 = 80;
                const r3 = 34;
                const aStep = 5.625 * (Math.PI / 180);
                
                const x1 = cx + r1 * Math.cos(angle);
                const y1 = cy + r1 * Math.sin(angle);
                const x2 = cx + r1 * Math.cos(angle + aStep * 0.5);
                const y2 = cy + r1 * Math.sin(angle + aStep * 0.5);
                const x3 = cx + r2 * Math.cos(angle + aStep * 0.5);
                const y3 = cy + r2 * Math.sin(angle + aStep * 0.5);
                const x4 = cx + r2 * Math.cos(angle + aStep);
                const y4 = cy + r2 * Math.sin(angle + aStep);
                const x5 = cx + (r2 + 5) * Math.cos(angle + aStep);
                const y5 = cy + (r2 + 5) * Math.sin(angle + aStep);
                const x6 = cx + (r2 + 5) * Math.cos(angle + aStep * 1.5);
                const y6 = cy + (r2 + 5) * Math.sin(angle + aStep * 1.5);
                const x7 = cx + r1 * Math.cos(angle + aStep * 1.5);
                const y7 = cy + r1 * Math.sin(angle + aStep * 1.5);

                return (
                  <path
                    key={i}
                    d={`M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4} L${x5},${y5} L${x6},${y6} L${x7},${y7}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                );
              })}
            </g>

            {/* Inner decorative rings */}
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground" opacity="0.5" />
            <circle cx="100" cy="100" r="66" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" opacity="0.3" />

            {/* Center filled circle */}
            <circle cx="100" cy="100" r="58" fill="hsl(var(--card))" stroke="currentColor" strokeWidth="2.5" className="text-foreground" opacity="1" />

            {/* M letter */}
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground"
              style={{ fontSize: "58px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, letterSpacing: "-2px" }}
            >
              M
            </text>
          </svg>
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
