import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Star, Search } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const CATEGORIES = ["Todos", "Watchlist", "Crypto", "Commodities", "Bonds", "Ações Web3"];

// Mini sparkline data generator
const spark = (trend: "up" | "down") => {
  const base = trend === "up" ? 40 : 60;
  return Array.from({ length: 20 }, (_, i) => ({
    v: base + (trend === "up" ? i * 1.5 : -i * 1.2) + (Math.random() - 0.5) * 10,
  }));
};

const ALL_ASSETS = [
  { name: "WageCoin", symbol: "$WAGE", category: "Crypto", price: 0.85, change24h: 5.2, marketCap: "2.4M", volume: "340K", sparkData: spark("up"), watched: true },
  { name: "MineCoin", symbol: "$MINE", category: "Crypto", price: 0.00085, change24h: 12.3, marketCap: "142K", volume: "28K", sparkData: spark("up"), watched: true },
  { name: "Bitcoin", symbol: "BTC", category: "Crypto", price: 97420, change24h: -3.21, marketCap: "2.3T", volume: "42B", sparkData: spark("down"), watched: true },
  { name: "Ethereum", symbol: "ETH", category: "Crypto", price: 3850, change24h: 0.39, marketCap: "367B", volume: "18B", sparkData: spark("up"), watched: true },
  { name: "Solana", symbol: "SOL", category: "Crypto", price: 160.2, change24h: -3.18, marketCap: "86B", volume: "4.2B", sparkData: spark("down"), watched: false },
  { name: "Ouro", symbol: "XAU", category: "Commodities", price: 1200, change24h: 2.3, marketCap: "--", volume: "890K", sparkData: spark("up"), watched: false },
  { name: "Prata", symbol: "XAG", category: "Commodities", price: 320, change24h: -0.5, marketCap: "--", volume: "120K", sparkData: spark("down"), watched: false },
  { name: "Petróleo", symbol: "OIL", category: "Commodities", price: 450, change24h: -1.2, marketCap: "--", volume: "540K", sparkData: spark("down"), watched: false },
  { name: "WageBond 6M", symbol: "WB6M", category: "Bonds", price: 100, change24h: 0.0, marketCap: "--", volume: "12K", sparkData: spark("up"), watched: false, yield: 15 },
  { name: "WageBond 1Y", symbol: "WB1Y", category: "Bonds", price: 500, change24h: 0.0, marketCap: "--", volume: "8K", sparkData: spark("up"), watched: false, yield: 25 },
  { name: "WageTech Corp", symbol: "WTC", category: "Ações Web3", price: 84.5, change24h: 8.4, marketCap: "845K", volume: "52K", sparkData: spark("up"), watched: false },
  { name: "WageEnergy", symbol: "WEN", category: "Ações Web3", price: 32.1, change24h: -2.1, marketCap: "321K", volume: "18K", sparkData: spark("down"), watched: false },
];

const MarketPage = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ALL_ASSETS.filter((a) => {
    const catMatch = activeCategory === "Todos" ? true : activeCategory === "Watchlist" ? a.watched : a.category === activeCategory;
    const searchMatch = !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        {/* Page title + search (mobile) */}
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl lg:text-2xl">Mercado</h1>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2.5">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar ativos..."
            className="flex-1 bg-transparent outline-none font-body text-sm placeholder:text-muted-foreground"
          />
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "$WAGE", value: "$0.85", change: "+5.2%", positive: true },
            { label: "Market Cap", value: "$2.4M", change: "+3.1%", positive: true },
            { label: "Volume 24h", value: "$340K", change: "-2.4%", positive: false },
            { label: "Burned", value: "8.2M $W", change: "", positive: true },
          ].map((stat) => (
            <div key={stat.label} className="card-clean p-3.5">
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{stat.label}</p>
              <p className="text-lg font-display font-bold mt-0.5">{stat.value}</p>
              {stat.change && (
                <p className={`text-[11px] font-body font-medium ${stat.positive ? "text-success" : "text-destructive"}`}>{stat.change}</p>
              )}
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-body whitespace-nowrap tap-shrink transition-all border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary font-medium"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/30"
              }`}
            >
              {cat === "Watchlist" && "★ "}
              {cat}
            </button>
          ))}
        </div>

        {/* Assets Table */}
        <div className="card-clean overflow-hidden">
          {/* Table header */}
          <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_120px_40px] gap-4 px-4 py-3 border-b border-border/50 text-[10px] uppercase tracking-wider text-muted-foreground font-body">
            <span>Ativo</span>
            <span className="text-right">Preço</span>
            <span className="text-right">24h</span>
            <span className="text-right">Market Cap</span>
            <span className="text-center">Gráfico 7d</span>
            <span></span>
          </div>

          {filtered.map((asset, i) => {
            const isPositive = asset.change24h >= 0;
            return (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-center lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_120px_40px] gap-3 lg:gap-4 px-4 py-3.5 border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
              >
                {/* Asset name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-display font-bold text-foreground">{asset.symbol.replace("$", "").slice(0, 2)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-display font-semibold truncate">{asset.name}</p>
                    <p className="text-[11px] text-muted-foreground font-body">{asset.symbol}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right ml-auto lg:ml-0">
                  <p className="text-sm font-display font-bold">
                    ${asset.price >= 1 ? asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : asset.price.toFixed(5)}
                  </p>
                  {asset.yield && (
                    <p className="text-[10px] text-primary font-body">APY {asset.yield}%</p>
                  )}
                </div>

                {/* Change */}
                <div className="hidden lg:flex items-center justify-end gap-1">
                  <span className={`flex items-center gap-0.5 text-sm font-body font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(asset.change24h).toFixed(2)}%
                  </span>
                </div>

                {/* Market cap */}
                <p className="hidden lg:block text-right text-sm text-muted-foreground font-body">{asset.marketCap}</p>

                {/* Sparkline */}
                <div className="hidden lg:block h-10 w-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={asset.sparkData}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke={isPositive ? "hsl(145, 72%, 40%)" : "hsl(0, 72%, 50%)"}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Watchlist */}
                <div className="hidden lg:flex justify-center">
                  <Star size={16} className={asset.watched ? "text-primary fill-primary" : "text-muted-foreground"} />
                </div>

                {/* Mobile change indicator */}
                <span className={`lg:hidden text-xs font-body font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
                  {isPositive ? "+" : ""}{asset.change24h.toFixed(2)}%
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Reward-generating assets (desktop sidebar-style) */}
        <div className="hidden lg:block">
          <div className="card-clean p-5">
            <h3 className="font-display font-semibold text-base mb-1">Ativos geradores de recompensas</h3>
            <p className="text-xs text-muted-foreground font-body mb-4">Ganhe recompensas comprando e fazendo staking de ativos qualificados</p>
            <div className="space-y-3">
              {[
                { name: "Vault Flexível", symbol: "FLEX", apy: "5.00%" },
                { name: "Vault 90 Dias", symbol: "V90D", apy: "35.00%" },
                { name: "Vault 1 Ano", symbol: "V1Y", apy: "100.00%" },
                { name: "WageBond 6M", symbol: "WB6M", apy: "15.00%" },
              ].map((a) => (
                <div key={a.symbol} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-[10px] font-display font-bold text-muted-foreground">{a.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-display font-medium">{a.name}</p>
                      <p className="text-[11px] text-muted-foreground font-body">{a.symbol}</p>
                    </div>
                  </div>
                  <span className="text-sm font-display font-bold text-primary">{a.apy} a.a.</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
