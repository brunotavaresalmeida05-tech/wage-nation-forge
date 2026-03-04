import { useState } from "react";
import { motion } from "framer-motion";
import SectorCard, { Sector } from "../components/SectorCard";
import EventBanner from "../components/EventBanner";

const SECTORS: Sector[] = [
  { name: "Tecnologia", emoji: "💻", companies: ["WageTech Corp", "DataCore AI", "CloudVault"], dailyYield: 0.8, volatility: "Alta", cycle: "Pró-crescimento", pricePerShare: 120, change24h: 8.5 },
  { name: "Energia", emoji: "⚡", companies: ["Wage Oil & Gas", "SolarWage", "NuclearBase"], dailyYield: 0.6, volatility: "Média", cycle: "Ligado ao petróleo", pricePerShare: 85, change24h: -1.2 },
  { name: "Financeiro", emoji: "🏦", companies: ["WageBank", "TrustCapital", "LendingDAO"], dailyYield: 0.5, volatility: "Baixa", cycle: "Estável e resiliente", pricePerShare: 200, change24h: 0.8 },
  { name: "Saúde", emoji: "🏥", companies: ["WagePharma", "BioResearch", "MedTech"], dailyYield: 0.4, volatility: "Muito Baixa", cycle: "Defensivo", pricePerShare: 180, change24h: 1.5 },
  { name: "Consumo", emoji: "🛒", companies: ["RetailWage", "FoodChain", "LuxuryGoods"], dailyYield: 0.5, volatility: "Média", cycle: "Ligado ao DAU", pricePerShare: 90, change24h: 2.1 },
  { name: "Indústria", emoji: "🔧", companies: ["HeavyWage", "AutoManufact", "RoboFactory"], dailyYield: 0.55, volatility: "Média", cycle: "Ligado a upgrades", pricePerShare: 75, change24h: -0.5 },
  { name: "Imobiliário", emoji: "🏢", companies: ["REWage REIT", "UrbanDev Fund"], dailyYield: 0.45, volatility: "Baixa", cycle: "Correlacionado RE", pricePerShare: 150, change24h: 0.3 },
  { name: "Materiais", emoji: "⛏️", companies: ["GoldMine Corp", "WageSteel", "ChemBase"], dailyYield: 0.7, volatility: "Alta", cycle: "Commodities", pricePerShare: 110, change24h: 4.2 },
  { name: "Utilities", emoji: "💡", companies: ["WaterWage", "GasGrid", "TelecomBase"], dailyYield: 0.35, volatility: "Muito Baixa", cycle: "Ultra-defensivo", pricePerShare: 60, change24h: 0.1 },
  { name: "Transportes", emoji: "✈️", companies: ["AirWage", "ShipCargo", "LogisticDAO"], dailyYield: 0.6, volatility: "Média", cycle: "Volume de transações", pricePerShare: 95, change24h: -2.1 },
  { name: "Entretenimento", emoji: "🎮", companies: ["GameWage Studios", "StreamBase", "EsportsDAO"], dailyYield: 0.9, volatility: "Muito Alta", cycle: "Viral", pricePerShare: 150, change24h: 12.3 },
  { name: "Agricultura", emoji: "🌾", companies: ["FarmWage", "AgroChain", "FoodTech"], dailyYield: 0.4, volatility: "Média", cycle: "Sazonal", pricePerShare: 60, change24h: -0.8 },
];

const activeEvent = {
  title: "Boom Tecnológico",
  description: "IA Generativa provoca Rally — ações Tech +25%",
  sector: "Tecnologia",
  impact: "+25% preço ações Tech",
  emoji: "🚀",
  duration: "72h",
  endsIn: "18h",
  isPositive: true,
};

const SectorsPage = () => {
  const [filter, setFilter] = useState<"all" | "high" | "low">("all");
  const sorted = [...SECTORS].sort((a, b) => {
    if (filter === "high") return b.change24h - a.change24h;
    if (filter === "low") return a.change24h - b.change24h;
    return 0;
  });

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <h1 className="font-display font-bold text-lg">📈 Setores & Ações</h1>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full font-body text-muted-foreground">12 setores</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        <EventBanner event={activeEvent} />

        {/* My Stocks Overview */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Ações Detidas", value: "5", icon: "📊" },
            { label: "Dividendos/mês", value: "32 $W", icon: "💰" },
            { label: "Lucro Total", value: "+248 $W", icon: "📈" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-gradient-card border border-border p-3 text-center">
              <span className="text-lg">{s.icon}</span>
              <p className="text-sm font-display font-bold mt-0.5">{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-body">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          {([["all", "Todos"], ["high", "Maior alta"], ["low", "Maior baixa"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-full text-xs font-body tap-shrink ${
                filter === key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sectors */}
        <div className="space-y-3">
          {sorted.map((sector, i) => (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <SectorCard sector={sector} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorsPage;
