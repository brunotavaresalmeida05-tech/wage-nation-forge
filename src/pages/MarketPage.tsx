import { motion } from "framer-motion";
import AssetCard from "../components/AssetCard";

const CATEGORIES = ["All", "Commodities", "Energy", "Property", "Treasury"];

const ALL_ASSETS = [
  { name: "Gold", icon: "🥇", category: "Commodities", price: 1200, change24h: 2.3, yield: 3.5 },
  { name: "Silver", icon: "🪙", category: "Commodities", price: 320, change24h: -0.5, yield: 2.1 },
  { name: "Oil", icon: "🛢️", category: "Energy", price: 450, change24h: -1.2 },
  { name: "Gas", icon: "⛽", category: "Energy", price: 180, change24h: 3.8 },
  { name: "Real Estate", icon: "🏠", category: "Property", price: 5000, change24h: 0.8, yield: 8.2 },
  { name: "Office Tower", icon: "🏢", category: "Property", price: 12000, change24h: 1.1, yield: 6.5 },
  { name: "Wheat", icon: "🌾", category: "Commodities", price: 85, change24h: 4.1 },
  { name: "Cattle", icon: "🐄", category: "Commodities", price: 340, change24h: 0.3 },
  { name: "Wage Bond 30D", icon: "📄", category: "Treasury", price: 1000, change24h: 0.1, yield: 5.0 },
  { name: "Wage Bond 90D", icon: "📋", category: "Treasury", price: 1000, change24h: 0.05, yield: 7.2 },
  { name: "Wage Bond 1Y", icon: "📊", category: "Treasury", price: 1000, change24h: 0.02, yield: 12.0 },
  { name: "Soybean", icon: "🫘", category: "Commodities", price: 150, change24h: -2.1 },
];

import { useState } from "react";

const MarketPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? ALL_ASSETS : ALL_ASSETS.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto flex items-center px-4 h-14">
          <h1 className="font-display font-bold text-lg">📊 Market</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Market Overview */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Market Cap", value: "$2.4M", color: "text-gradient-primary" },
            { label: "$WAGE Price", value: "$0.85", color: "text-gradient-gold" },
            { label: "24h Volume", value: "$340K", color: "text-gradient-mine" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-gradient-card border border-border/50 p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-body uppercase">{stat.label}</p>
              <p className={`text-sm font-display font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-body whitespace-nowrap tap-shrink transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
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
