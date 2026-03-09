import { motion } from "framer-motion";

export interface AdvancedTask {
  id: number;
  title: string;
  category: string;
  rewardMine: number | string;
  rewardXP: number | string;
  completed: boolean;
  progress?: number;
  target?: number;
}

const categoryEmojis: Record<string, string> = {
  Mining: "⛏️", Exchange: "🔄", "Real Estate": "🏠", ETF: "📊",
  Sectors: "📈", Upgrade: "⚙️", Education: "📚", Social: "👥",
  Habit: "⏰", Management: "🎯", Trading: "💹", Streak: "🔥",
  Capital: "💰", P2P: "🤝", Growth: "📈",
};

const categoryColors: Record<string, string> = {
  Trabalho: "bg-primary/10 text-primary",
  Exchange: "bg-info/10 text-info",
  "Real Estate": "bg-gold/10 text-gold",
  ETF: "bg-[hsl(var(--epic)/.1)] text-[hsl(var(--epic))]",
  Setores: "bg-info/10 text-info",
  Upgrade: "bg-secondary text-muted-foreground",
  Educação: "bg-primary/10 text-primary",
  Social: "bg-info/10 text-info",
  Hábito: "bg-gold/10 text-gold",
  Gestão: "bg-secondary text-muted-foreground",
  Trading: "bg-primary/10 text-primary",
  Streak: "bg-destructive/10 text-destructive",
  Capital: "bg-gold/10 text-gold",
  P2P: "bg-info/10 text-info",
  Crescimento: "bg-primary/10 text-primary",
};

const AdvancedTaskCard = ({ task, onClick }: { task: AdvancedTask; onClick?: () => void }) => {
  const hasProgress = task.progress !== undefined && task.target !== undefined;
  const progressPct = hasProgress ? Math.min(100, (task.progress! / task.target!) * 100) : 0;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-3 rounded-xl p-3 border border-border bg-gradient-card cursor-pointer select-none tap-shrink ${
        task.completed ? "opacity-60" : ""
      }`}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl flex-shrink-0">
        {task.completed ? "✅" : categoryEmojis[task.category] || "📋"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="font-display font-semibold text-xs truncate">{task.title}</h4>
          <span className={`text-[8px] uppercase tracking-wider font-display px-1.5 py-0.5 rounded-full flex-shrink-0 ${categoryColors[task.category]}`}>
            {task.category}
          </span>
        </div>

        {hasProgress && !task.completed && (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-[9px] text-muted-foreground font-body">{task.progress}/{task.target}</span>
          </div>
        )}
      </div>

      {/* Rewards */}
      <div className="text-right flex-shrink-0">
        <p className="text-[10px] font-display font-bold text-primary">+{task.rewardMine} $M</p>
        <p className="text-[9px] text-muted-foreground font-body">+{task.rewardXP} XP</p>
      </div>
    </motion.div>
  );
};

export default AdvancedTaskCard;
