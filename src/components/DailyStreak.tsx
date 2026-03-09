import { motion } from "framer-motion";
import { Flame, Check } from "lucide-react";

interface DailyStreakProps {
  currentStreak: number;
  todayCompleted: boolean;
}

const DailyStreak = ({ currentStreak, todayCompleted }: DailyStreakProps) => {
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="card-clean p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-display font-semibold">Daily Streak</h3>
        <div className="flex items-center gap-1 text-xs font-body text-primary font-medium">
          <Flame size={14} className="text-primary" />
          <span>{currentStreak} days</span>
        </div>
      </div>
      <div className="flex justify-between gap-1.5">
        {days.map((day, i) => {
          const completed = i < currentStreak % 7;
          const isToday = i === currentStreak % 7;
          return (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-display font-medium transition-all ${
                completed
                  ? "bg-primary/10 text-primary"
                  : isToday && !todayCompleted
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {completed ? <Check size={14} /> : day}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyStreak;
