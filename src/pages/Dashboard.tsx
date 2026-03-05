import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import WalletCard from "../components/WalletCard";
import TapToMine from "../components/TapToMine";
import DailyStreak from "../components/DailyStreak";
import EventBanner from "../components/EventBanner";
import DividendCalendar from "../components/DividendCalendar";

const activeEvent = {
  title: "Boom Tecnológico",
  description: "IA Generativa provoca Rally no setor de Tecnologia",
  sector: "Tecnologia",
  impact: "+25% preço ações Tech",
  emoji: "🚀",
  duration: "72h",
  endsIn: "18h",
  isPositive: true,
};

const QUICK_TASKS = [
  { id: 1, title: "Faz 50 taps hoje", icon: "⛏️", reward: "+200 $M", completed: false, progress: 12, target: 50 },
  { id: 2, title: "Converte $MINE em $WAGE", icon: "🔄", reward: "+300 $M", completed: false },
  { id: 3, title: "Recolhe rendas", icon: "🏠", reward: "+250 $M", completed: true },
  { id: 4, title: "Visita Mercado de Ações", icon: "📈", reward: "+150 $M", completed: false },
];

const Dashboard = () => {
  const [mineBalance, setMineBalance] = useState(1250);
  const [wageBalance] = useState(42.5);
  const [energy, setEnergy] = useState(500);
  const maxEnergy = 500;
  const minePerTap = 2;
  const wageUsdRate = 0.85;
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <span className="text-xl">💼</span>
            <h1 className="font-display font-bold text-lg">
              <span className="text-foreground">Wage</span><span className="text-primary">Company</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-secondary px-2 py-1 rounded-full font-body text-muted-foreground">
              Lv. 3 Analista
            </span>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm">
              👤
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-glow pointer-events-none" />

        <WalletCard mineBalance={mineBalance} wageBalance={wageBalance} wageUsdRate={wageUsdRate} />

        {/* Active Event */}
        <EventBanner event={activeEvent} />

        <DailyStreak currentStreak={4} todayCompleted={false} />

        {/* Quick Mine */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 bg-card border border-border"
        >
          <TapToMine mineBalance={mineBalance} energy={energy} maxEnergy={maxEnergy} onTap={handleTap} minePerTap={minePerTap} />
        </motion.section>

        {/* Quick Tasks */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-base">Tarefas Diárias</h2>
            <button onClick={() => navigate("/tasks")} className="text-xs text-primary font-body tap-shrink">Ver todas →</button>
          </div>
          <div className="space-y-2">
            {QUICK_TASKS.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className={`flex items-center gap-3 rounded-xl p-3 border border-border bg-gradient-card ${task.completed ? "opacity-60" : ""}`}
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
                  {task.completed ? "✅" : task.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display font-semibold truncate">{task.title}</p>
                  {task.progress !== undefined && task.target !== undefined && !task.completed && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(task.progress / task.target) * 100}%` }} />
                      </div>
                      <span className="text-[9px] text-muted-foreground font-body">{task.progress}/{task.target}</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-display font-bold text-primary">{task.reward}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Portfolio Quick View */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-base">Meu Portfolio</h2>
            <button onClick={() => navigate("/invest")} className="text-xs text-primary font-body tap-shrink">Gerir →</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Imóveis", value: "3", icon: "🏠", onClick: () => navigate("/real-estate") },
              { label: "Ações", value: "5", icon: "📈", onClick: () => navigate("/sectors") },
              { label: "ETFs", value: "2", icon: "📊", onClick: () => navigate("/etfs") },
              { label: "Vault", value: "700 $W", icon: "🏛️", onClick: () => navigate("/vault") },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileTap={{ scale: 0.95 }}
                onClick={item.onClick}
                className="rounded-xl p-3 bg-gradient-card border border-border text-center cursor-pointer tap-shrink"
              >
                <span className="text-2xl block mb-1">{item.icon}</span>
                <p className="text-lg font-display font-bold">{item.value}</p>
                <p className="text-[10px] text-muted-foreground font-body">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Dividends */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-base">Próximos Dividendos</h2>
            <span className="text-[10px] text-muted-foreground font-body">Calendário</span>
          </div>
          <DividendCalendar />
        </section>

        {/* UBI + WagePay Quick Access */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            onClick={() => navigate("/ubi")}
            className="rounded-xl p-4 border-2 border-primary/20 bg-primary/5 text-center cursor-pointer tap-shrink"
          >
            <span className="text-2xl block mb-1">🌍</span>
            <p className="text-xs font-display font-semibold">Renda UBI</p>
            <p className="text-lg font-display font-bold text-primary">110 $W</p>
            <p className="text-[9px] text-muted-foreground font-body">/mês • Recolher</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            onClick={() => navigate("/wagepay")}
            className="rounded-xl p-4 border border-border bg-gradient-card text-center cursor-pointer tap-shrink"
          >
            <span className="text-2xl block mb-1">💸</span>
            <p className="text-xs font-display font-semibold">WagePay</p>
            <p className="text-lg font-display font-bold">P2P</p>
            <p className="text-[9px] text-muted-foreground font-body">Enviar & Receber</p>
          </motion.div>
        </div>

        {/* Exchange CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl p-5 border border-primary/20 bg-primary/5 text-center"
        >
          <p className="text-sm font-display font-semibold mb-1">Converter $MINE → $WAGE</p>
          <p className="text-xs text-muted-foreground font-body mb-3">
            Taxa: 1,000 $MINE = 1 $WAGE (5% taxa + 2% burn)
          </p>
          <button onClick={() => navigate("/exchange")} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
            Ir ao Exchange →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
