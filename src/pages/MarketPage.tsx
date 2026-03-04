import { useState } from "react";
import { motion } from "framer-motion";
import AssetCard from "../components/AssetCard";

const CATEGORIES = ["Todos", "Commodities", "Energia", "Imóveis", "Treasury", "Bonds"];

const ALL_ASSETS = [
  { name: "Ouro", icon: "🥇", category: "Commodities", price: 1200, change24h: 2.3, yield: 3.5 },
  { name: "Prata", icon: "🪙", category: "Commodities", price: 320, change24h: -0.5, yield: 2.1 },
  { name: "Petróleo", icon: "🛢️", category: "Energia", price: 450, change24h: -1.2 },
  { name: "Gás Natural", icon: "⛽", category: "Energia", price: 180, change24h: 3.8 },
  { name: "Real Estate Fund", icon: "🏠", category: "Imóveis", price: 5000, change24h: 0.8, yield: 8.2 },
  { name: "Torre Empresarial", icon: "🏢", category: "Imóveis", price: 12000, change24h: 1.1, yield: 6.5 },
  { name: "Trigo", icon: "🌾", category: "Commodities", price: 85, change24h: 4.1 },
  { name: "Gado", icon: "🐄", category: "Commodities", price: 340, change24h: 0.3 },
  { name: "WageBond 6M", icon: "📄", category: "Bonds", price: 100, change24h: 0.0, yield: 15.0 },
  { name: "WageBond 1Y", icon: "📋", category: "Bonds", price: 500, change24h: 0.0, yield: 25.0 },
  { name: "WageBond 3Y", icon: "📊", category: "Bonds", price: 2000, change24h: 0.0, yield: 40.0 },
  { name: "Soja", icon: "🫘", category: "Commodities", price: 150, change24h: -2.1 },
];

const MarketPage = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered = activeCategory === "Todos" ? ALL_ASSETS : ALL_ASSETS.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto flex items-center px-4 h-14">
          <h1 className="font-display font-bold text-lg">📊 Mercado</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Market Overview */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Market Cap", value: "$2.4M", color: "text-gradient-primary" },
            { label: "Preço $WAGE", value: "$0.85", color: "text-gradient-gold" },
            { label: "Volume 24h", value: "$340K", color: "text-gradient-mine" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-gradient-card border border-border p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-body uppercase">{stat.label}</p>
              <p className={`text-sm font-display font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* WageIndex Quick */}
        <div className="rounded-xl p-4 bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-display font-semibold">📡 WageIndex</p>
              <p className="text-[10px] text-muted-foreground font-body">Supply circulante: 142M / 1B</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-display font-bold text-primary">Total Burned: 8.2M $W</p>
              <p className="text-[10px] text-muted-foreground font-body">DAU: 12,430</p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-body whitespace-nowrap tap-shrink ${
                activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((asset, i) => (
            <motion.div
              key={asset.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <AssetCard {...asset} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
