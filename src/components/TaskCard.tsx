import { motion } from "framer-motion";

interface TaskCardProps {
  title: string;
  description: string;
  costMine: number;
  rewardMine: number;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  locked?: boolean;
  onExecute?: () => void;
}

const rarityStyles: Record<string, { border: string; glow: string; label: string }> = {
  common: {
    border: "border-muted-foreground/30",
    glow: "",
    label: "Common",
  },
  rare: {
    border: "border-mine-blue/50",
    glow: "shadow-glow-blue",
    label: "Rare",
  },
  epic: {
    border: "border-accent/50",
    glow: "",
    label: "Epic",
  },
  legendary: {
    border: "border-primary/50",
    glow: "shadow-glow-green",
    label: "Legendary",
  },
};

const TaskCard = ({
  title,
  description,
  costMine,
  rewardMine,
  icon,
  rarity,
  locked = false,
  onExecute,
}: TaskCardProps) => {
  const style = rarityStyles[rarity];
  const profit = rewardMine - costMine;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-lg border ${style.border} ${style.glow} p-4 bg-gradient-card card-shine cursor-pointer select-none ${
        locked ? "opacity-50 pointer-events-none" : ""
      }`}
      onClick={onExecute}
    >
      {/* Rarity Badge */}
      <span
        className={`absolute top-2 right-2 text-[10px] uppercase tracking-wider font-display px-2 py-0.5 rounded-full ${
          rarity === "legendary"
            ? "bg-primary/20 text-primary"
            : rarity === "epic"
            ? "bg-accent/20 text-accent"
            : rarity === "rare"
            ? "bg-mine-blue/20 text-mine-blue"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {style.label}
      </span>

      <div className="flex items-start gap-3">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-sm truncate">{title}</h4>
          <p className="text-xs text-muted-foreground font-body mt-0.5 line-clamp-2">{description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-3 text-xs font-body">
          <span className="text-destructive">-{costMine} $MINE</span>
          <span className="text-primary">+{rewardMine} $MINE</span>
        </div>
        <span className={`text-xs font-display font-bold ${profit > 0 ? "text-primary" : "text-destructive"}`}>
          {profit > 0 ? "+" : ""}
          {profit}
        </span>
      </div>

      {locked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm">
          <span className="text-2xl">🔒</span>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;
