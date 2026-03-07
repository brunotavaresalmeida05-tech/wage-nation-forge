import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-clean p-4"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          event.isPositive ? "bg-primary/10" : "bg-destructive/10"
        }`}>
          {event.isPositive ? (
            <TrendingUp size={20} className="text-primary" />
          ) : (
            <TrendingDown size={20} className="text-destructive" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-display font-semibold text-sm">{event.title}</h3>
            <span className={`text-[9px] uppercase tracking-wider font-body px-1.5 py-0.5 rounded-md ${
              event.isPositive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}>
              {event.sector}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-body">{event.description}</p>
          <div className="flex items-center gap-3 mt-2 text-[11px] font-body">
            <span className={`font-semibold ${event.isPositive ? "text-primary" : "text-destructive"}`}>
              {event.impact}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock size={10} />
              {event.endsIn} restantes
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventBanner;
