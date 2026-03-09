import { useState } from "react";
import { motion } from "framer-motion";
import ETFCard, { ETF } from "../components/ETFCard";

const ETFS: ETF[] = [
  {
    name: "Growth ETF", ticker: "WGW-GROWTH", emoji: "🚀", profile: "Growth", targetYield: 0.75,
    composition: [{ sector: "Technology", pct: 35 }, { sector: "Entertainment", pct: 25 }, { sector: "Materials", pct: 20 }, { sector: "Energy", pct: 20 }],
    minInvestment: 10, totalAUM: 245000, change7d: 5.8,
  },
  {
    name: "Conservative ETF", ticker: "WGW-STABLE", emoji: "🛡️", profile: "Conservative", targetYield: 0.40,
    composition: [{ sector: "Finance", pct: 30 }, { sector: "Utilities", pct: 25 }, { sector: "Healthcare", pct: 25 }, { sector: "Real Estate", pct: 20 }],
    minInvestment: 10, totalAUM: 380000, change7d: 1.2,
  },
  {
    name: "Dividend ETF", ticker: "WGW-YIELD", emoji: "💰", profile: "Dividend", targetYield: 0.55,
    composition: [{ sector: "Real Estate", pct: 35 }, { sector: "Utilities", pct: 25 }, { sector: "Finance", pct: 20 }, { sector: "Agriculture", pct: 20 }],
    minInvestment: 10, totalAUM: 190000, change7d: 2.4,
  },
  {
    name: "AI & Robotics ETF", ticker: "WGW-AI", emoji: "🤖", profile: "Thematic", targetYield: 0.90,
    composition: [{ sector: "AI Infrastructure", pct: 40 }, { sector: "Robotics", pct: 25 }, { sector: "Cloud Computing", pct: 20 }, { sector: "Semiconductors", pct: 15 }],
    minInvestment: 25, totalAUM: 520000, change7d: 8.4,
  },
  {
    name: "Clean Energy ETF", ticker: "WGW-GREEN", emoji: "🌱", profile: "Thematic", targetYield: 0.60,
    composition: [{ sector: "Solar", pct: 30 }, { sector: "Wind", pct: 25 }, { sector: "EV & Battery", pct: 25 }, { sector: "Hydrogen", pct: 20 }],
    minInvestment: 15, totalAUM: 310000, change7d: 3.1,
  },
  {
    name: "Metaverse ETF", ticker: "WGW-META", emoji: "🕶️", profile: "Growth", targetYield: 0.85,
    composition: [{ sector: "Gaming", pct: 35 }, { sector: "VR/AR", pct: 25 }, { sector: "Social Platforms", pct: 20 }, { sector: "Digital Real Estate", pct: 20 }],
    minInvestment: 20, totalAUM: 175000, change7d: 6.2,
  },
  {
    name: "Balanced Global ETF", ticker: "WGW-GLOBAL", emoji: "🌍", profile: "Balanced", targetYield: 0.50,
    composition: [{ sector: "US Equities", pct: 30 }, { sector: "EU Equities", pct: 25 }, { sector: "Asia-Pacific", pct: 25 }, { sector: "Emerging Mkts", pct: 20 }],
    minInvestment: 10, totalAUM: 450000, change7d: 1.8,
  },
  {
    name: "DeFi Yield ETF", ticker: "WGW-DEFI", emoji: "⛓️", profile: "Growth", targetYield: 1.10,
    composition: [{ sector: "DEX Protocols", pct: 30 }, { sector: "Lending", pct: 25 }, { sector: "Stablecoins", pct: 25 }, { sector: "Bridges", pct: 20 }],
    minInvestment: 50, totalAUM: 140000, change7d: 9.7,
  },
  {
    name: "Blue Chip ETF", ticker: "WGW-BLUE", emoji: "💎", profile: "Conservative", targetYield: 0.35,
    composition: [{ sector: "Finance", pct: 30 }, { sector: "Healthcare", pct: 25 }, { sector: "Consumer Staples", pct: 25 }, { sector: "Industrials", pct: 20 }],
    minInvestment: 10, totalAUM: 620000, change7d: 0.8,
  },
  {
    name: "Commodities ETF", ticker: "WGW-COMMOD", emoji: "⛏️", profile: "Balanced", targetYield: 0.45,
    composition: [{ sector: "Gold", pct: 30 }, { sector: "Oil & Gas", pct: 25 }, { sector: "Silver & Metals", pct: 25 }, { sector: "Agriculture", pct: 20 }],
    minInvestment: 15, totalAUM: 280000, change7d: 2.1,
  },
];

const PROFILE_FILTERS = ["All", "Growth", "Conservative", "Dividend", "Thematic", "Balanced"];

const ETFsPage = () => {
  const [profileFilter, setProfileFilter] = useState("All");
  const filtered = profileFilter === "All" ? ETFS : ETFS.filter(e => e.profile === profileFilter);

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl lg:text-2xl">📊 Synthetic ETFs</h1>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full font-body text-muted-foreground">{ETFS.length} ETFs</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Active ETFs", value: "2", icon: "📊" },
            { label: "Yield/day", value: "4.2 $W", icon: "💰" },
            { label: "Invested", value: "780 $W", icon: "🔒" },
          ].map((s) => (
            <div key={s.label} className="card-clean p-3 text-center">
              <span className="text-lg">{s.icon}</span>
              <p className="text-sm font-display font-bold mt-0.5">{s.value}</p>
              <p className="text-[10px] text-muted-foreground font-body">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="card-clean p-4 border-primary/20">
          <p className="text-xs text-foreground font-display font-semibold mb-1">ℹ️ What are ETFs?</p>
          <p className="text-[11px] text-muted-foreground font-body">
            An ETF is an automatic basket of assets. Buy shares with $WAGE and earn proportional returns.
            Ideal for diversification without managing individual assets.
          </p>
        </div>

        {/* Pending yield */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-clean border-primary/30 border-2 bg-primary/5 p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-muted-foreground font-body">Accumulated yield</p>
            <p className="text-xl font-display font-bold text-primary">12.8 $WAGE</p>
            <p className="text-[10px] text-muted-foreground font-body">From 3 days (max 7 days)</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
            Collect 💰
          </button>
        </motion.div>

        {/* Profile Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {PROFILE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setProfileFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-body whitespace-nowrap tap-shrink ${
                profileFilter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ETF Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((etf, i) => (
            <motion.div
              key={etf.ticker}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ETFCard etf={etf} />
            </motion.div>
          ))}
        </div>

        {/* Locked */}
        <div className="card-clean border-2 border-dashed border-border p-5 text-center opacity-60">
          <span className="text-3xl">🔒</span>
          <h3 className="font-display font-bold text-sm mt-2">Elite ETF — WGW-ALPHA</h3>
          <p className="text-[11px] text-muted-foreground font-body mt-1">Available from Level 20</p>
          <p className="text-[10px] text-muted-foreground font-body mt-0.5">Target yield: ~1.2%/day</p>
        </div>
      </div>
    </div>
  );
};

export default ETFsPage;
