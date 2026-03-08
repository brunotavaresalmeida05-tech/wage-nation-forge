import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, BarChart3, PieChart, Landmark, Globe, CreditCard, ArrowDownUp, Wallet } from "lucide-react";
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
  { id: 1, title: "Faz 50 taps hoje", reward: "+200 $M", completed: false, progress: 12, target: 50 },
  { id: 2, title: "Converte $MINE em $WAGE", reward: "+300 $M", completed: false },
  { id: 3, title: "Recolhe rendas", reward: "+250 $M", completed: true },
  { id: 4, title: "Visita Mercado de Ações", reward: "+150 $M", completed: false },
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
    <div className="pb-20 lg:pb-6">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
        {/* Desktop: two-column layout */}
        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-6">
          {/* Main Column */}
          <div className="space-y-5">
            {/* Wallet */}
            <WalletCard mineBalance={mineBalance} wageBalance={wageBalance} wageUsdRate={wageUsdRate} />

            {/* Active Event */}
            <EventBanner event={activeEvent} />

            {/* Quick Mine */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-clean p-6"
            >
              <TapToMine mineBalance={mineBalance} energy={energy} maxEnergy={maxEnergy} onTap={handleTap} minePerTap={minePerTap} />
            </motion.section>

            {/* Portfolio Quick View */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-semibold text-[15px]">Meu Portfolio</h2>
                <button onClick={() => navigate("/invest")} className="text-xs text-primary font-body font-medium tap-shrink flex items-center gap-0.5">
                  Gerir <ArrowRight size={12} />
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { label: "Imóveis", value: "3", icon: <Building2 size={20} className="text-gold" />, onClick: () => navigate("/real-estate") },
                  { label: "Ações Web3", value: "5", icon: <BarChart3 size={20} className="text-info" />, onClick: () => navigate("/sectors") },
                  { label: "ETFs", value: "2", icon: <PieChart size={20} className="text-primary" />, onClick: () => navigate("/etfs") },
                  { label: "Vault", value: "700 $W", icon: <Landmark size={20} className="text-foreground" />, onClick: () => navigate("/vault") },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileTap={{ scale: 0.97 }}
                    onClick={item.onClick}
                    className="card-clean p-4 text-center cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-secondary mx-auto flex items-center justify-center mb-2">
                      {item.icon}
                    </div>
                    <p className="text-lg font-display font-bold">{item.value}</p>
                    <p className="text-[11px] text-muted-foreground font-body">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar (desktop) / Stacked (mobile) */}
          <div className="space-y-5 mt-5 lg:mt-0">
            {/* Daily Streak */}
            <DailyStreak currentStreak={4} todayCompleted={false} />

            {/* Quick Tasks */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-semibold text-[15px]">Tarefas Diárias</h2>
                <button onClick={() => navigate("/tasks")} className="text-xs text-primary font-body font-medium tap-shrink flex items-center gap-0.5">
                  Ver todas <ArrowRight size={12} />
                </button>
              </div>
              <div className="space-y-2">
                {QUICK_TASKS.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.03 }}
                    className={`flex items-center gap-3 card-clean p-3 ${task.completed ? "opacity-50" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                      task.completed ? "bg-primary/10" : "bg-secondary"
                    }`}>
                      {task.completed ? (
                        <span className="text-primary font-bold text-xs">✓</span>
                      ) : (
                        <span className="text-muted-foreground font-display font-bold text-xs">{task.id}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-display font-semibold truncate">{task.title}</p>
                      {task.progress !== undefined && task.target !== undefined && !task.completed && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 rounded-full bg-secondary overflow-hidden">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(task.progress / task.target) * 100}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground font-body">{task.progress}/{task.target}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-display font-bold text-primary">{task.reward}</span>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Dividends */}
            <section>
              <h2 className="font-display font-semibold text-[15px] mb-3">Próximos Dividendos</h2>
              <DividendCalendar />
            </section>

            {/* Quick Access */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { icon: Globe, label: "UBI", value: "110 $W", route: "/ubi", accent: true },
                { icon: CreditCard, label: "Pay", value: "P2P", route: "/wagepay", accent: false },
                { icon: Wallet, label: "Cartões", value: "Banco", route: "/bank-cards", accent: false },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.03 }}
                    onClick={() => navigate(item.route)}
                    className={`card-clean p-3 text-center cursor-pointer ${item.accent ? "border-primary/20" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center mb-1.5 ${item.accent ? "bg-primary/10" : "bg-secondary"}`}>
                      <Icon size={16} className={item.accent ? "text-primary" : "text-foreground"} />
                    </div>
                    <p className="text-[11px] font-display font-semibold">{item.label}</p>
                    <p className={`text-xs font-display font-bold mt-0.5 ${item.accent ? "text-primary" : ""}`}>{item.value}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
