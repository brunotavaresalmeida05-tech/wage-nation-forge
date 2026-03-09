import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Star, Search } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["All", "Watchlist", "Crypto", "Commodities", "Bonds", "Web3 Stocks", "Forex", "Indices"];

const spark = (trend: "up" | "down") => {
  const base = trend === "up" ? 40 : 60;
  return Array.from({ length: 20 }, (_, i) => ({
    v: base + (trend === "up" ? i * 1.5 : -i * 1.2) + (Math.random() - 0.5) * 10,
  }));
};

const ALL_ASSETS = [
  // Ecosystem tokens
  { name: "WageCoin", symbol: "$WAGE", category: "Crypto", price: 0.85, change24h: 5.2, marketCap: "2.4M", volume: "340K", sparkData: spark("up"), watched: true },
  { name: "MineCoin", symbol: "$MINE", category: "Crypto", price: 0.00085, change24h: 12.3, marketCap: "142K", volume: "28K", sparkData: spark("up"), watched: true },
  // Major Crypto
  { name: "Bitcoin", symbol: "BTC", category: "Crypto", price: 97420, change24h: -3.21, marketCap: "2.3T", volume: "42B", sparkData: spark("down"), watched: true },
  { name: "Ethereum", symbol: "ETH", category: "Crypto", price: 3850, change24h: 0.39, marketCap: "367B", volume: "18B", sparkData: spark("up"), watched: true },
  { name: "Solana", symbol: "SOL", category: "Crypto", price: 160.2, change24h: -3.18, marketCap: "86B", volume: "4.2B", sparkData: spark("down"), watched: false },
  { name: "XRP", symbol: "XRP", category: "Crypto", price: 2.34, change24h: 1.82, marketCap: "134B", volume: "6.1B", sparkData: spark("up"), watched: false },
  { name: "Avalanche", symbol: "AVAX", category: "Crypto", price: 38.4, change24h: -2.4, marketCap: "15.8B", volume: "820M", sparkData: spark("down"), watched: false },
  { name: "Chainlink", symbol: "LINK", category: "Crypto", price: 15.8, change24h: 4.1, marketCap: "9.5B", volume: "410M", sparkData: spark("up"), watched: false },
  { name: "Polygon", symbol: "POL", category: "Crypto", price: 0.42, change24h: -1.5, marketCap: "4.2B", volume: "280M", sparkData: spark("down"), watched: false },
  { name: "Cardano", symbol: "ADA", category: "Crypto", price: 0.68, change24h: 2.3, marketCap: "24B", volume: "1.1B", sparkData: spark("up"), watched: false },
  // Commodities
  { name: "Gold", symbol: "XAU", category: "Commodities", price: 1200, change24h: 2.3, marketCap: "--", volume: "890K", sparkData: spark("up"), watched: false },
  { name: "Silver", symbol: "XAG", category: "Commodities", price: 320, change24h: -0.5, marketCap: "--", volume: "120K", sparkData: spark("down"), watched: false },
  { name: "Crude Oil", symbol: "OIL", category: "Commodities", price: 450, change24h: -1.2, marketCap: "--", volume: "540K", sparkData: spark("down"), watched: false },
  { name: "Natural Gas", symbol: "NGAS", category: "Commodities", price: 85, change24h: 3.8, marketCap: "--", volume: "210K", sparkData: spark("up"), watched: false },
  { name: "Copper", symbol: "CU", category: "Commodities", price: 180, change24h: 1.1, marketCap: "--", volume: "95K", sparkData: spark("up"), watched: false },
  { name: "Platinum", symbol: "XPT", category: "Commodities", price: 520, change24h: -0.3, marketCap: "--", volume: "45K", sparkData: spark("down"), watched: false },
  // Bonds
  { name: "WageBond 6M", symbol: "WB6M", category: "Bonds", price: 100, change24h: 0.0, marketCap: "--", volume: "12K", sparkData: spark("up"), watched: false, yield: 15 },
  { name: "WageBond 1Y", symbol: "WB1Y", category: "Bonds", price: 500, change24h: 0.0, marketCap: "--", volume: "8K", sparkData: spark("up"), watched: false, yield: 25 },
  { name: "WageBond 2Y", symbol: "WB2Y", category: "Bonds", price: 1000, change24h: 0.0, marketCap: "--", volume: "5K", sparkData: spark("up"), watched: false, yield: 40 },
  // Web3 Stocks
  { name: "WageTech Corp", symbol: "WTC", category: "Web3 Stocks", price: 84.5, change24h: 8.4, marketCap: "845K", volume: "52K", sparkData: spark("up"), watched: false },
  { name: "WageEnergy", symbol: "WEN", category: "Web3 Stocks", price: 32.1, change24h: -2.1, marketCap: "321K", volume: "18K", sparkData: spark("down"), watched: false },
  { name: "NeuralWage", symbol: "NRW", category: "Web3 Stocks", price: 220, change24h: 15.2, marketCap: "1.1M", volume: "85K", sparkData: spark("up"), watched: false },
  { name: "ChipWage", symbol: "CPW", category: "Web3 Stocks", price: 160, change24h: 4.5, marketCap: "640K", volume: "42K", sparkData: spark("up"), watched: false },
  { name: "SecureWage", symbol: "SCW", category: "Web3 Stocks", price: 130, change24h: 2.8, marketCap: "520K", volume: "31K", sparkData: spark("up"), watched: false },
  { name: "GameWage Studios", symbol: "GWS", category: "Web3 Stocks", price: 150, change24h: 12.3, marketCap: "900K", volume: "72K", sparkData: spark("up"), watched: false },
  // Forex
  { name: "EUR/USD", symbol: "EURUSD", category: "Forex", price: 1.0842, change24h: 0.12, marketCap: "--", volume: "2.1B", sparkData: spark("up"), watched: false },
  { name: "GBP/USD", symbol: "GBPUSD", category: "Forex", price: 1.2654, change24h: -0.08, marketCap: "--", volume: "980M", sparkData: spark("down"), watched: false },
  { name: "USD/JPY", symbol: "USDJPY", category: "Forex", price: 149.82, change24h: 0.34, marketCap: "--", volume: "1.5B", sparkData: spark("up"), watched: false },
  // Indices
  { name: "S&P 500 Index", symbol: "SPX", category: "Indices", price: 5820, change24h: 0.45, marketCap: "--", volume: "--", sparkData: spark("up"), watched: false },
  { name: "NASDAQ 100", symbol: "NDX", category: "Indices", price: 20450, change24h: 0.82, marketCap: "--", volume: "--", sparkData: spark("up"), watched: false },
  { name: "Dow Jones", symbol: "DJI", category: "Indices", price: 43200, change24h: -0.15, marketCap: "--", volume: "--", sparkData: spark("down"), watched: false },
];

const MarketPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filtered = ALL_ASSETS.filter((a) => {
    const catMatch = activeCategory === "All" ? true : activeCategory === "Watchlist" ? a.watched : a.category === activeCategory;
    const searchMatch = !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl lg:text-2xl">Market</h1>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full font-body text-muted-foreground">{ALL_ASSETS.length} assets</span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2.5">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="flex-1 bg-transparent outline-none font-body text-sm placeholder:text-muted-foreground min-w-0"
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
          <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_120px_40px] gap-4 px-4 py-3 border-b border-border/50 text-[10px] uppercase tracking-wider text-muted-foreground font-body">
            <span>Asset</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h</span>
            <span className="text-right">Market Cap</span>
            <span className="text-center">7d Chart</span>
            <span></span>
          </div>

          {filtered.map((asset, i) => {
            const isPositive = asset.change24h >= 0;
            return (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.015 }}
                className="flex items-center lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_120px_40px] gap-3 lg:gap-4 px-4 py-3.5 border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/market/${asset.symbol.replace("$", "")}`)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-display font-bold text-foreground">{asset.symbol.replace("$", "").slice(0, 2)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-display font-semibold truncate">{asset.name}</p>
                    <p className="text-[11px] text-muted-foreground font-body">{asset.symbol}</p>
                  </div>
                </div>

                <div className="text-right ml-auto lg:ml-0">
                  <p className="text-sm font-display font-bold">
                    ${asset.price >= 1 ? asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : asset.price.toFixed(5)}
                  </p>
                  {asset.yield && (
                    <p className="text-[10px] text-primary font-body">APY {asset.yield}%</p>
                  )}
                </div>

                <div className="hidden lg:flex items-center justify-end gap-1">
                  <span className={`flex items-center gap-0.5 text-sm font-body font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(asset.change24h).toFixed(2)}%
                  </span>
                </div>

                <p className="hidden lg:block text-right text-sm text-muted-foreground font-body">{asset.marketCap}</p>

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

                <div className="hidden lg:flex justify-center">
                  <Star size={16} className={asset.watched ? "text-primary fill-primary" : "text-muted-foreground"} />
                </div>

                <span className={`lg:hidden text-xs font-body font-medium whitespace-nowrap ${isPositive ? "text-success" : "text-destructive"}`}>
                  {isPositive ? "+" : ""}{asset.change24h.toFixed(2)}%
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Reward-generating assets */}
        <div className="hidden lg:block">
          <div className="card-clean p-5">
            <h3 className="font-display font-semibold text-base mb-1">Reward-generating assets</h3>
            <p className="text-xs text-muted-foreground font-body mb-4">Earn rewards by buying and staking eligible assets</p>
            <div className="space-y-3">
              {[
                { name: "Flexible Vault", symbol: "FLEX", apy: "5.00%" },
                { name: "90-Day Vault", symbol: "V90D", apy: "35.00%" },
                { name: "1-Year Vault", symbol: "V1Y", apy: "100.00%" },
                { name: "WageBond 6M", symbol: "WB6M", apy: "15.00%" },
                { name: "WageBond 2Y", symbol: "WB2Y", apy: "40.00%" },
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
                  <span className="text-sm font-display font-bold text-primary">{a.apy} APY</span>
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
