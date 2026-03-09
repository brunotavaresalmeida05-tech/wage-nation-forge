import { useState } from "react";
import { motion } from "framer-motion";
import SectorCard, { Sector } from "../components/SectorCard";
import EventBanner from "../components/EventBanner";

const SECTORS: Sector[] = [
  { name: "Technology", emoji: "💻", companies: ["WageTech Corp", "DataCore AI", "CloudVault", "ByteShield"], dailyYield: 0.8, volatility: "Alta", cycle: "Pro-growth", pricePerShare: 120, change24h: 8.5 },
  { name: "Energy", emoji: "⚡", companies: ["Wage Oil & Gas", "SolarWage", "NuclearBase"], dailyYield: 0.6, volatility: "Média", cycle: "Tied to oil", pricePerShare: 85, change24h: -1.2 },
  { name: "Finance", emoji: "🏦", companies: ["WageBank", "TrustCapital", "LendingDAO", "InsureChain"], dailyYield: 0.5, volatility: "Baixa", cycle: "Stable & resilient", pricePerShare: 200, change24h: 0.8 },
  { name: "Healthcare", emoji: "🏥", companies: ["WagePharma", "BioResearch", "MedTech", "GenomicsDAO"], dailyYield: 0.4, volatility: "Muito Baixa", cycle: "Defensive", pricePerShare: 180, change24h: 1.5 },
  { name: "Consumer", emoji: "🛒", companies: ["RetailWage", "FoodChain", "LuxuryGoods"], dailyYield: 0.5, volatility: "Média", cycle: "Tied to DAU", pricePerShare: 90, change24h: 2.1 },
  { name: "Industrials", emoji: "🔧", companies: ["HeavyWage", "AutoManufact", "RoboFactory"], dailyYield: 0.55, volatility: "Média", cycle: "Tied to upgrades", pricePerShare: 75, change24h: -0.5 },
  { name: "Real Estate", emoji: "🏢", companies: ["REWage REIT", "UrbanDev Fund", "GlobalProp"], dailyYield: 0.45, volatility: "Baixa", cycle: "Correlated RE", pricePerShare: 150, change24h: 0.3 },
  { name: "Materials", emoji: "⛏️", companies: ["GoldMine Corp", "WageSteel", "ChemBase"], dailyYield: 0.7, volatility: "Alta", cycle: "Commodities", pricePerShare: 110, change24h: 4.2 },
  { name: "Utilities", emoji: "💡", companies: ["WaterWage", "GasGrid", "TelecomBase"], dailyYield: 0.35, volatility: "Muito Baixa", cycle: "Ultra-defensive", pricePerShare: 60, change24h: 0.1 },
  { name: "Transportation", emoji: "✈️", companies: ["AirWage", "ShipCargo", "LogisticDAO"], dailyYield: 0.6, volatility: "Média", cycle: "Transaction volume", pricePerShare: 95, change24h: -2.1 },
  { name: "Entertainment", emoji: "🎮", companies: ["GameWage Studios", "StreamBase", "EsportsDAO"], dailyYield: 0.9, volatility: "Muito Alta", cycle: "Viral", pricePerShare: 150, change24h: 12.3 },
  { name: "Agriculture", emoji: "🌾", companies: ["FarmWage", "AgroChain", "FoodTech"], dailyYield: 0.4, volatility: "Média", cycle: "Seasonal", pricePerShare: 60, change24h: -0.8 },
  { name: "AI & Robotics", emoji: "🤖", companies: ["NeuralWage", "AutoBot Corp", "DeepMine AI"], dailyYield: 1.0, volatility: "Muito Alta", cycle: "Innovation-driven", pricePerShare: 220, change24h: 15.2 },
  { name: "Aerospace & Defense", emoji: "🚀", companies: ["WageSpace", "DefenseGrid", "OrbitDAO"], dailyYield: 0.65, volatility: "Média", cycle: "Gov contracts", pricePerShare: 180, change24h: 3.4 },
  { name: "Biotech", emoji: "🧬", companies: ["GenomeWage", "CRISPR Labs", "PharmaDAO"], dailyYield: 0.85, volatility: "Alta", cycle: "R&D milestone", pricePerShare: 95, change24h: 6.8 },
  { name: "Semiconductors", emoji: "🔬", companies: ["ChipWage", "SiliconDAO", "NanoFab"], dailyYield: 0.75, volatility: "Alta", cycle: "Demand cycles", pricePerShare: 160, change24h: 4.5 },
  { name: "Cybersecurity", emoji: "🔐", companies: ["SecureWage", "CipherNet", "ShieldDAO"], dailyYield: 0.55, volatility: "Baixa", cycle: "Always in demand", pricePerShare: 130, change24h: 2.8 },
  { name: "Media & Streaming", emoji: "📺", companies: ["StreamWage", "ContentDAO", "PodcastNet"], dailyYield: 0.50, volatility: "Média", cycle: "Content cycles", pricePerShare: 70, change24h: 1.2 },
];

const activeEvent = {
  title: "AI Revolution",
  description: "Generative AI triggers massive rally — AI & Robotics stocks +25%",
  sector: "AI & Robotics",
  impact: "+25% AI stock prices",
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
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl lg:text-2xl">📈 Sectors & Stocks</h1>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full font-body text-muted-foreground">{SECTORS.length} sectors</span>
        </div>

        <EventBanner event={activeEvent} />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Stocks Held", value: "5", icon: "📊" },
            { label: "Dividends/mo", value: "32 $W", icon: "💰" },
            { label: "Total Profit", value: "+248 $W", icon: "📈" },
          ].map((s) => (
            <div key={s.label} className="card-clean p-3 text-center">
              <span className="text-lg">{s.icon}</span>
              <p className="text-sm font-display font-bold mt-0.5">{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-body">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-2">
          {([["all", "All"], ["high", "Top gainers"], ["low", "Top losers"]] as const).map(([key, label]) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {sorted.map((sector, i) => (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
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
