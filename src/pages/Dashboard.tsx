import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import WalletCard from "../components/WalletCard";
import TapToMine from "../components/TapToMine";
import TaskCard from "../components/TaskCard";
import AssetCard from "../components/AssetCard";
import DailyStreak from "../components/DailyStreak";

const TASKS = [
  { title: "Daily Report", description: "Submit your daily productivity report", costMine: 30, rewardMine: 80, icon: "📋", rarity: "common" as const },
  { title: "Market Analysis", description: "Analyze commodity trends and submit findings", costMine: 100, rewardMine: 250, icon: "📈", rarity: "rare" as const },
  { title: "Contract Negotiation", description: "Negotiate institutional asset contracts", costMine: 300, rewardMine: 700, icon: "📜", rarity: "epic" as const },
  { title: "Treasury Audit", description: "Audit the national treasury reserves", costMine: 1000, rewardMine: 2500, icon: "🏛️", rarity: "legendary" as const },
];

const ASSETS = [
  { name: "Gold", icon: "🥇", category: "Commodity", price: 1200, change24h: 2.3, yield: 3.5 },
  { name: "Oil", icon: "🛢️", category: "Energy", price: 450, change24h: -1.2 },
  { name: "Real Estate", icon: "🏠", category: "Property", price: 5000, change24h: 0.8, yield: 8.2 },
  { name: "Wheat", icon: "🌾", category: "Commodity", price: 85, change24h: 4.1 },
  { name: "Bonds", icon: "📄", category: "Treasury", price: 1000, change24h: 0.1, yield: 5.0 },
  { name: "Silver", icon: "🪙", category: "Commodity", price: 320, change24h: -0.5, yield: 2.1 },
];

const Dashboard = () => {
  const [mineBalance, setMineBalance] = useState(1250);
  const [wageBalance] = useState(42.5);
  const [energy, setEnergy] = useState(500);
  const maxEnergy = 500;
  const minePerTap = 2;
  const wageUsdRate = 0.85;

  const handleTap = useCallback((earned: number) => {
    setMineBalance((prev) => prev + earned);
    setEnergy((prev) => Math.max(0, prev - 1));
  }, []);

  const handleTask = useCallback((cost: number, reward: number) => {
    if (mineBalance >= cost) {
      setMineBalance((prev) => prev - cost + reward);
    }
  }, [mineBalance]);

  // Energy regen
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(maxEnergy, prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="text-xl">💼</span>
            <h1 className="font-display font-bold text-lg">
              <span className="text-gradient-primary">Wage</span>Company
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-secondary px-2 py-1 rounded-full font-body text-muted-foreground">
              Lv. 3 Analyst
            </span>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm">
              👤
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-6">
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-glow pointer-events-none" />

        {/* Wallet */}
        <WalletCard mineBalance={mineBalance} wageBalance={wageBalance} wageUsdRate={wageUsdRate} />

        {/* Daily Streak */}
        <DailyStreak currentStreak={4} todayCompleted={false} />

        {/* Tap to Mine */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg p-6 bg-gradient-card border border-border/50"
        >
          <TapToMine
            mineBalance={mineBalance}
            energy={energy}
            maxEnergy={maxEnergy}
            onTap={handleTap}
            minePerTap={minePerTap}
          />
        </motion.section>

        {/* Daily Tasks */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-base">Daily Tasks</h2>
            <span className="text-xs text-muted-foreground font-body">0/4 completed</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {TASKS.map((task, i) => (
              <motion.div
                key={task.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <TaskCard
                  {...task}
                  locked={mineBalance < task.costMine}
                  onExecute={() => handleTask(task.costMine, task.rewardMine)}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Market Assets */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-base">Market Assets</h2>
            <span className="text-xs text-primary font-body cursor-pointer">View all →</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {ASSETS.map((asset, i) => (
              <motion.div
                key={asset.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <AssetCard {...asset} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Exchange CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-lg p-5 border border-primary/20 bg-primary/5 text-center"
        >
          <p className="text-sm font-display font-semibold mb-1">Convert $MINE to $WAGE</p>
          <p className="text-xs text-muted-foreground font-body mb-3">
            Exchange rate: 1,000 $MINE = 1 $WAGE (5% platform fee)
          </p>
          <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
            Go to Exchange →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
