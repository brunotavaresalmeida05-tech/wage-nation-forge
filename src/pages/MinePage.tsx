import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Wrench, Battery, Bot, Zap } from "lucide-react";
import TapToMine from "../components/TapToMine";

const MinePage = () => {
  const [mineBalance, setMineBalance] = useState(1250);
  const [energy, setEnergy] = useState(500);
  const maxEnergy = 500;
  const [minePerTap] = useState(2);
  const [level] = useState(3);
  const [totalMined] = useState(8430);

  const handleTap = useCallback((earned: number) => {
    setMineBalance((prev) => prev + earned);
    setEnergy((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(maxEnergy, prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const upgradeIcons = [Wrench, Battery, Bot, Zap];
  const upgrades = [
    { name: "Drill Upgrade", cost: 500, effect: "+1 per tap", owned: 2 },
    { name: "Energy Tank", cost: 1000, effect: "+100 max energy", owned: 1 },
    { name: "Auto-Miner", cost: 5000, effect: "+10/min passive", owned: 0 },
    { name: "Quantum Drill", cost: 15000, effect: "+5 per tap", owned: 0 },
  ];

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl">Mining Station</h1>
          <span className="text-[11px] bg-secondary px-2.5 py-1 rounded-lg font-body text-muted-foreground font-medium">
            Level {level}
          </span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Total Mined", value: totalMined.toLocaleString() },
            { label: "Per Tap", value: `${minePerTap} $M` },
            { label: "Level", value: level.toString() },
          ].map((stat) => (
            <div key={stat.label} className="card-clean p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{stat.label}</p>
              <p className="text-base font-display font-bold mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tap to Mine */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-clean p-8"
        >
          <TapToMine mineBalance={mineBalance} energy={energy} maxEnergy={maxEnergy} onTap={handleTap} minePerTap={minePerTap} />
        </motion.div>

        {/* Upgrades */}
        <section>
          <h2 className="font-display font-semibold text-[15px] mb-3">Upgrades</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {upgrades.map((upgrade, i) => {
              const Icon = upgradeIcons[i];
              return (
                <motion.div
                  key={upgrade.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`card-clean p-3.5 cursor-pointer tap-shrink ${
                    mineBalance < upgrade.cost ? "opacity-40" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-display font-semibold">{upgrade.name}</p>
                      <p className="text-[10px] text-muted-foreground font-body">{upgrade.effect}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-info font-display font-bold">{upgrade.cost} $MINE</span>
                    {upgrade.owned > 0 && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-body font-medium">
                        x{upgrade.owned}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MinePage;
