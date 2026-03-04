import { useState } from "react";
import { motion } from "framer-motion";
import AdvancedTaskCard, { AdvancedTask } from "../components/AdvancedTaskCard";

const DAILY_TASKS: AdvancedTask[] = [
  { id: 1, title: "Faz 50 taps hoje", category: "Trabalho", rewardMine: 200, rewardXP: 50, completed: false, progress: 12, target: 50 },
  { id: 2, title: "Faz 150 taps hoje", category: "Trabalho", rewardMine: 500, rewardXP: 100, completed: false, progress: 12, target: 150 },
  { id: 3, title: "Converte qualquer valor de $MINE em $WAGE", category: "Exchange", rewardMine: 300, rewardXP: 75, completed: false },
  { id: 4, title: "Recolhe rendas de pelo menos 1 imóvel", category: "Real Estate", rewardMine: 250, rewardXP: 60, completed: true },
  { id: 5, title: "Recolhe rendimento de ETF", category: "ETF", rewardMine: 250, rewardXP: 60, completed: false },
  { id: 6, title: "Visita o Mercado de Ações", category: "Setores", rewardMine: 150, rewardXP: 40, completed: false },
  { id: 7, title: "Faz um upgrade numa Carta", category: "Upgrade", rewardMine: 400, rewardXP: 100, completed: false },
  { id: 8, title: "Consulta o Dashboard Económico", category: "Educação", rewardMine: 100, rewardXP: 25, completed: true },
  { id: 9, title: "Envia 1 mensagem no chat comunitário", category: "Social", rewardMine: 150, rewardXP: 30, completed: false },
  { id: 10, title: "Faz login antes das 9h00", category: "Hábito", rewardMine: 200, rewardXP: 50, completed: true },
  { id: 11, title: "Tem energia acima de 500 ao fazer login", category: "Gestão", rewardMine: 100, rewardXP: 20, completed: false },
  { id: 12, title: "Compra ou vende 1 ativo no mercado", category: "Trading", rewardMine: 350, rewardXP: 80, completed: false },
  { id: 13, title: "Verifica o calendário de dividendos", category: "Educação", rewardMine: 100, rewardXP: 20, completed: false },
  { id: 14, title: "Tem pelo menos 3 imóveis no portfolio", category: "Real Estate", rewardMine: 0, rewardXP: 150, completed: true },
  { id: 15, title: "Usa o simulador de payback de imóvel", category: "Educação", rewardMine: 150, rewardXP: 35, completed: false },
  { id: 16, title: "Confirma o nível de risco do teu ETF", category: "ETF", rewardMine: 100, rewardXP: 25, completed: false },
  { id: 17, title: "Recolhe bonus de streak", category: "Streak", rewardMine: "streak×100", rewardXP: "streak×20", completed: false },
  { id: 18, title: "Tem $WAGE no portfolio (qualquer valor)", category: "Capital", rewardMine: 0, rewardXP: 100, completed: true },
  { id: 19, title: "Lista ou vende 1 item no mercado P2P", category: "P2P", rewardMine: 400, rewardXP: 90, completed: false },
  { id: 20, title: "Fecha o dia com mais $MINE do que ontem", category: "Crescimento", rewardMine: 500, rewardXP: 120, completed: false },
];

const MISSIONS: { title: string; condition: string; reward: string; completed: boolean; icon: string }[] = [
  { title: "Primeiro Imóvel", condition: "Comprar o 1º imóvel", reward: "+5.000 $MINE", completed: true, icon: "🏠" },
  { title: "Magnata Imobiliário", condition: "Possuir 10 imóveis", reward: "+50.000 $MINE + Carta Exclusiva", completed: false, icon: "🏰" },
  { title: "Diversificado", condition: "Ativos em 5 setores", reward: "+10.000 $MINE + 5% rendimento", completed: false, icon: "🎯" },
  { title: "Investidor Completo", condition: "Possuir os 3 ETFs", reward: "+25.000 $MINE + ETF Elite", completed: false, icon: "📊" },
  { title: "Primeiro Dividendo", condition: "Receber 1º dividendo", reward: "+2.000 $MINE", completed: true, icon: "💰" },
  { title: "Trader Ativo", condition: "50 transações P2P", reward: "+20.000 $MINE", completed: false, icon: "📈" },
  { title: "Whale Sintético", condition: "Portfolio > 100.000 $WAGE", reward: "+200.000 $MINE", completed: false, icon: "🐋" },
];

const CATEGORIES = ["Todas", "Trabalho", "Exchange", "Real Estate", "ETF", "Setores", "Social", "Streak"];

const TasksPage = () => {
  const [tab, setTab] = useState<"daily" | "missions">("daily");
  const [filter, setFilter] = useState("Todas");

  const completedCount = DAILY_TASKS.filter(t => t.completed).length;
  const filteredTasks = filter === "Todas" ? DAILY_TASKS : DAILY_TASKS.filter(t => t.category === filter);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <h1 className="font-display font-bold text-lg">🎯 Tarefas</h1>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-body">
            {completedCount}/20 hoje
          </span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("daily")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-display font-semibold tap-shrink ${
              tab === "daily" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            Diárias (20)
          </button>
          <button
            onClick={() => setTab("missions")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-display font-semibold tap-shrink ${
              tab === "missions" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            Missões ({MISSIONS.length})
          </button>
        </div>

        {tab === "daily" ? (
          <>
            {/* Progress */}
            <div className="rounded-xl bg-gradient-card border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-display font-semibold">Progresso Diário</p>
                <p className="text-xs text-primary font-body">{completedCount}/20</p>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  animate={{ width: `${(completedCount / 20) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-body mt-1">Reset em 8h 42m</p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-body whitespace-nowrap tap-shrink ${
                    filter === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-2">
              {filteredTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <AdvancedTaskCard task={task} />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* Missions */
          <div className="space-y-3">
            {MISSIONS.map((mission, i) => (
              <motion.div
                key={mission.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border-2 p-4 ${
                  mission.completed
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-gradient-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{mission.completed ? "✅" : mission.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-sm">{mission.title}</h3>
                    <p className="text-[11px] text-muted-foreground font-body">{mission.condition}</p>
                    <p className="text-[10px] text-primary font-display font-bold mt-1">{mission.reward}</p>
                  </div>
                  {mission.completed && (
                    <span className="text-[10px] text-primary font-body">Concluída</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
