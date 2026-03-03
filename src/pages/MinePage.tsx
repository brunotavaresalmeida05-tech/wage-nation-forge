import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import TapToMine from "../components/TapToMine";

const MinePage = () => {
  const [mineBalance, setMineBalance] = useState(1250);
  const [energy, setEnergy] = useState(500);
  const maxEnergy = 500;
  const [minePerTap, setMinePerTap] = useState(2);
  const [level, setLevel] = useState(3);
  const [totalMined, setTotalMined] = useState(8430);

  const handleTap = useCallback((earned: number) => {
    setMineBalance((prev) => prev + earned);
    setTotalMined((prev) => prev + earned);
    setEnergy((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(maxEnergy, prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const upgrades = [
    { name: "Drill Upgrade", cost: 500, effect: "+1 per tap", icon: "🔧", owned: 2 },
    { name: "Energy Tank", cost: 1000, effect: "+100 max energy", icon: "🔋", owned: 1 },
    { name: "Auto-Miner", cost: 5000, effect: "+10/min passive", icon: "🤖", owned: 0 },
    { name: "Quantum Drill", cost: 15000, effect: "+5 per tap", icon: "⚡", owned: 0 },
  ];

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <h1 className="font-display font-bold text-lg">⛏️ Mining Station</h1>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full font-body text-muted-foreground">
            Level {level}
          </span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none bg-gradient-glow" />

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Mined", value: totalMined.toLocaleString(), color: "text-gradient-mine" },
            { label: "Per Tap", value: `${minePerTap} $M`, color: "text-gradient-primary" },
            { label: "Level", value: level.toString(), color: "text-gradient-gold" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-gradient-card border border-border/50 p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-body uppercase">{stat.label}</p>
              <p className={`text-lg font-display font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tap to Mine */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-8 bg-card border border-border"
        >
          <TapToMine
            mineBalance={mineBalance}
            energy={energy}
            maxEnergy={maxEnergy}
            onTap={handleTap}
            minePerTap={minePerTap}
          />
        </motion.div>

        {/* Upgrades */}
        <section>
          <h2 className="font-display font-semibold text-base mb-3">⚙️ Upgrades</h2>
          <div className="grid grid-cols-2 gap-3">
            {upgrades.map((upgrade, i) => (
              <motion.div
                key={upgrade.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-lg p-3 bg-gradient-card border border-border/50 card-shine cursor-pointer tap-shrink ${
                  mineBalance < upgrade.cost ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{upgrade.icon}</span>
                  <div>
                    <p className="text-xs font-display font-semibold">{upgrade.name}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{upgrade.effect}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-mine-blue font-display font-bold">{upgrade.cost} $MINE</span>
                  {upgrade.owned > 0 && (
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-body">
                      x{upgrade.owned}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MinePage;
