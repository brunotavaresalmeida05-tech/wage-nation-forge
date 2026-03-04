import { motion } from "framer-motion";

export interface EconomicEvent {
  title: string;
  description: string;
  sector: string;
  impact: string;
  emoji: string;
  duration: string;
  endsIn: string;
  isPositive: boolean;
}

const EventBanner = ({ event }: { event: EconomicEvent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-4 border-2 ${
        event.isPositive ? "border-primary/30 bg-primary/5" : "border-destructive/30 bg-destructive/5"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{event.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-sm">{event.title}</h3>
            <span className={`text-[9px] uppercase tracking-wider font-display px-1.5 py-0.5 rounded-full ${
              event.isPositive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}>
              {event.sector}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-body">{event.description}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px] font-body">
            <span className={event.isPositive ? "text-primary font-bold" : "text-destructive font-bold"}>
              {event.impact}
            </span>
            <span className="text-muted-foreground">⏱ {event.endsIn} restantes</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventBanner;
