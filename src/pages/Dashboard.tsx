import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, BarChart3, PieChart, Landmark, Globe, CreditCard, RefreshCw } from "lucide-react";
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
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-lg mx-auto flex items-center justify-between px-5 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm">W</span>
            </div>
            <h1 className="font-display font-bold text-base tracking-tight">
              WageCompany
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-secondary px-2.5 py-1 rounded-lg font-body text-muted-foreground font-medium">
              Lv. 3
            </span>
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xs font-display font-semibold text-muted-foreground">JD</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-5">
        {/* Wallet */}
        <WalletCard mineBalance={mineBalance} wageBalance={wageBalance} wageUsdRate={wageUsdRate} />

        {/* Active Event */}
        <EventBanner event={activeEvent} />

        {/* Daily Streak */}
        <DailyStreak currentStreak={4} todayCompleted={false} />

        {/* Quick Mine */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-clean p-6"
        >
          <TapToMine mineBalance={mineBalance} energy={energy} maxEnergy={maxEnergy} onTap={handleTap} minePerTap={minePerTap} />
        </motion.section>

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
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                  task.completed ? "bg-primary/10" : "bg-secondary"
                }`}>
                  {task.completed ? (
                    <span className="text-primary font-bold">✓</span>
                  ) : (
                    <span className="text-muted-foreground font-display font-bold">{task.id}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display font-semibold truncate">{task.title}</p>
                  {task.progress !== undefined && task.target !== undefined && !task.completed && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
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

        {/* Portfolio Quick View */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-[15px]">Meu Portfolio</h2>
            <button onClick={() => navigate("/invest")} className="text-xs text-primary font-body font-medium tap-shrink flex items-center gap-0.5">
              Gerir <ArrowRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Imóveis", value: "3", icon: <Building2 size={20} className="text-gold" />, onClick: () => navigate("/real-estate") },
              { label: "Ações", value: "5", icon: <BarChart3 size={20} className="text-info" />, onClick: () => navigate("/sectors") },
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

        {/* Dividends */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-[15px]">Próximos Dividendos</h2>
          </div>
          <DividendCalendar />
        </section>

        {/* UBI + WagePay Quick Access */}
        <div className="grid grid-cols-2 gap-2.5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate("/ubi")}
            className="card-clean p-4 text-center cursor-pointer border-primary/20"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 mx-auto flex items-center justify-center mb-2">
              <Globe size={20} className="text-primary" />
            </div>
            <p className="text-xs font-display font-semibold">Renda UBI</p>
            <p className="text-lg font-display font-bold text-primary mt-0.5">110 $W</p>
            <p className="text-[10px] text-muted-foreground font-body">/mês • Recolher</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.33 }}
            onClick={() => navigate("/wagepay")}
            className="card-clean p-4 text-center cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary mx-auto flex items-center justify-center mb-2">
              <CreditCard size={20} className="text-foreground" />
            </div>
            <p className="text-xs font-display font-semibold">WagePay</p>
            <p className="text-lg font-display font-bold mt-0.5">P2P</p>
            <p className="text-[10px] text-muted-foreground font-body">Enviar & Receber</p>
          </motion.div>
        </div>

        {/* Exchange CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card-clean p-5 text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-secondary mx-auto flex items-center justify-center mb-3">
            <RefreshCw size={20} className="text-primary" />
          </div>
          <p className="text-sm font-display font-semibold mb-0.5">Converter $MINE → $WAGE</p>
          <p className="text-xs text-muted-foreground font-body mb-4">
            Taxa: 1,000 $MINE = 1 $WAGE (5% taxa + 2% burn)
          </p>
          <button onClick={() => navigate("/exchange")} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
            Ir ao Exchange
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
