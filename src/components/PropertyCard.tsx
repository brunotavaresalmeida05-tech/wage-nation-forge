import { motion } from "framer-motion";

export interface Property {
  id: string;
  name: string;
  type: "Residential" | "Commercial" | "Industrial" | "Hospitality" | "Prime" | "Mixed-Use" | "Luxury" | "Data Center";
  location: string;
  region: string;
  price: number;
  dailyYield: number;
  rarity: "common" | "rare" | "epic" | "legendary" | "unique";
  emoji: string;
  condoFee: number;
}

const rarityConfig = {
  common: { label: "★ Common", bg: "bg-secondary", text: "text-muted-foreground", border: "rarity-common" },
  rare: { label: "★★ Rare", bg: "bg-info/10", text: "text-info", border: "rarity-rare" },
  epic: { label: "★★★ Epic", bg: "bg-[hsl(var(--epic)/.1)]", text: "text-[hsl(var(--epic))]", border: "rarity-epic" },
  legendary: { label: "★★★★ Legendary", bg: "bg-gold/10", text: "text-gold", border: "rarity-legendary" },
  unique: { label: "★★★★★ Unique", bg: "bg-primary/10", text: "text-primary", border: "rarity-unique" },
};

const PropertyCard = ({ property, onBuy }: { property: Property; onBuy?: () => void }) => {
  const r = rarityConfig[property.rarity];
  const monthlyYield = property.dailyYield * 30;
  const paybackDays = Math.round(property.price / (property.dailyYield - property.condoFee));

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-xl border-2 ${r.border} bg-gradient-card p-4 card-shine cursor-pointer select-none`}
      onClick={onBuy}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-3xl">{property.emoji}</span>
        <span className={`text-[9px] uppercase tracking-wider font-display px-2 py-0.5 rounded-full ${r.bg} ${r.text}`}>
          {r.label}
        </span>
      </div>

      <h3 className="font-display font-semibold text-sm">{property.name}</h3>
      <p className="text-[10px] text-muted-foreground font-body">{property.type} — {property.location}</p>
      <p className="text-[9px] text-muted-foreground/70 font-body">{property.region}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-body">
        <div>
          <p className="text-muted-foreground">Price</p>
          <p className="font-display font-bold text-primary">{property.price.toLocaleString()} $W</p>
        </div>
        <div>
          <p className="text-muted-foreground">Rent/day</p>
          <p className="font-display font-bold text-primary">{property.dailyYield} $W</p>
        </div>
        <div>
          <p className="text-muted-foreground">Rent/month</p>
          <p className="font-display font-bold">{monthlyYield.toFixed(1)} $W</p>
        </div>
        <div>
          <p className="text-muted-foreground">Payback</p>
          <p className="font-display font-bold">~{paybackDays}d</p>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground font-body">
        <span>HOA: {property.condoFee} $W/day</span>
        <span className="text-primary font-medium">Buy →</span>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
