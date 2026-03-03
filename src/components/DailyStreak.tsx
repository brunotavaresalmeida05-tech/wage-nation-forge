import { motion } from "framer-motion";

interface DailyStreakProps {
  currentStreak: number;
  todayCompleted: boolean;
}

const DailyStreak = ({ currentStreak, todayCompleted }: DailyStreakProps) => {
  const days = ["S", "T", "Q", "Q", "S", "S", "D"];

  return (
    <div className="rounded-lg p-4 bg-gradient-card border border-border/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-display font-semibold">Daily Streak</h3>
        <span className="text-xs font-body text-accent">🔥 {currentStreak} days</span>
      </div>
      <div className="flex justify-between gap-1">
        {days.map((day, i) => {
          const completed = i < currentStreak % 7;
          const isToday = i === currentStreak % 7;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-display font-medium ${
                completed
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : isToday && !todayCompleted
                  ? "bg-accent/10 text-accent border border-accent/30 animate-pulse-glow"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {completed ? "✓" : day}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyStreak;
