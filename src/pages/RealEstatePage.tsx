import { useState } from "react";
import { motion } from "framer-motion";
import PropertyCard, { Property } from "../components/PropertyCard";

const PROPERTIES: Property[] = [
  { id: "RE-4821-LX", name: "Apartamento T2 — Bairro Alto", type: "Residencial", location: "Lisboa", price: 250, dailyYield: 1.2, rarity: "common", emoji: "🏠", condoFee: 0.1 },
  { id: "RE-5102-PT", name: "Loja Comercial — Porto Centro", type: "Comercial", location: "Porto", price: 800, dailyYield: 4.8, rarity: "rare", emoji: "🏬", condoFee: 0.3 },
  { id: "RE-6033-PN", name: "Escritório Premium — Parque Nações", type: "Prime", location: "Lisboa", price: 2500, dailyYield: 15, rarity: "epic", emoji: "🏢", condoFee: 0.8 },
  { id: "RE-7201-ZF", name: "Complexo Industrial — Zona Franca", type: "Industrial", location: "Setúbal", price: 8000, dailyYield: 48, rarity: "legendary", emoji: "🏭", condoFee: 2.5 },
  { id: "RE-8001-AL", name: "Resort Costeiro — Algarve", type: "Turismo", location: "Faro", price: 15000, dailyYield: 120, rarity: "legendary", emoji: "🏖️", condoFee: 5.0 },
  { id: "RE-9001-CBD", name: "Torre Empresarial — CBD Lisboa", type: "Prime", location: "Lisboa", price: 25000, dailyYield: 200, rarity: "unique", emoji: "🌆", condoFee: 8.0 },
  { id: "RE-1102-CB", name: "Apartamento T1 — Coimbra", type: "Residencial", location: "Coimbra", price: 180, dailyYield: 0.85, rarity: "common", emoji: "🏠", condoFee: 0.08 },
  { id: "RE-2201-MD", name: "Villa Luxo — Madrid", type: "Residencial", location: "Madrid", price: 5000, dailyYield: 30, rarity: "epic", emoji: "🏡", condoFee: 1.5 },
];

const FILTERS = ["Todos", "Residencial", "Comercial", "Industrial", "Turismo", "Prime"];

const RealEstatePage = () => {
  const [filter, setFilter] = useState("Todos");
  const filtered = filter === "Todos" ? PROPERTIES : PROPERTIES.filter(p => p.type === filter);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <h1 className="font-display font-bold text-lg">🏢 Real Estate</h1>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full font-body text-muted-foreground">3/20 imóveis</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* My Portfolio Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Imóveis", value: "3", icon: "🏠" },
            { label: "Renda/dia", value: "3.6 $W", icon: "💰" },
            { label: "Valor Total", value: "1,230 $W", icon: "📊" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-gradient-card border border-border p-3 text-center">
              <span className="text-lg">{s.icon}</span>
              <p className="text-sm font-display font-bold mt-0.5">{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-body">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Rendas a Recolher */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-muted-foreground font-body">Rendas a Recolher</p>
            <p className="text-xl font-display font-bold text-primary">7.2 $WAGE</p>
            <p className="text-[10px] text-muted-foreground font-body">Acumuladas de 2 dias</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
            Recolher 💰
          </button>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-body whitespace-nowrap tap-shrink ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealEstatePage;
