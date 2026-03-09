import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, TrendingUp, TrendingDown, ArrowDownUp,
  BarChart3, Clock, Users, Shield, ChevronDown
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

// ── helpers ──────────────────────────────────────────────────────
const seed = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const generatePriceHistory = (symbol: string, basePrice: number, days: number) => {
  const s = seed(symbol);
  const data: { date: string; price: number; volume: number }[] = [];
  let price = basePrice * 0.85;
  for (let i = 0; i < days; i++) {
    const noise = (((s * (i + 1) * 7919) % 10000) / 10000 - 0.48) * basePrice * 0.04;
    price = Math.max(price * 0.7, price + noise);
    const d = new Date();
    d.setDate(d.getDate() - (days - i));
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: +price.toFixed(price >= 1 ? 2 : 6),
      volume: Math.floor(50000 + ((s * (i + 3)) % 200000)),
    });
  }
  // ensure last point = basePrice
  if (data.length > 0) data[data.length - 1].price = basePrice;
  return data;
};

const generateOrderBook = (basePrice: number) => {
  const asks: { price: number; amount: number; total: number }[] = [];
  const bids: { price: number; amount: number; total: number }[] = [];
  let askTotal = 0, bidTotal = 0;
  for (let i = 0; i < 8; i++) {
    const spread = basePrice * 0.002 * (i + 1);
    const askAmt = +(Math.random() * 50 + 5).toFixed(2);
    askTotal += askAmt;
    asks.push({ price: +(basePrice + spread).toFixed(basePrice >= 1 ? 2 : 6), amount: askAmt, total: +askTotal.toFixed(2) });
    const bidAmt = +(Math.random() * 50 + 5).toFixed(2);
    bidTotal += bidAmt;
    bids.push({ price: +(basePrice - spread).toFixed(basePrice >= 1 ? 2 : 6), amount: bidAmt, total: +bidTotal.toFixed(2) });
  }
  return { asks, bids };
};

// ── asset registry (matches MarketPage) ──────────────────────────
const ASSETS: Record<string, { name: string; category: string; price: number; change24h: number; marketCap: string; volume: string; high24h: number; low24h: number; supply?: string; description: string }> = {
  WAGE:  { name: "WageCoin", category: "Crypto", price: 0.85, change24h: 5.2, marketCap: "$2.4M", volume: "$340K", high24h: 0.88, low24h: 0.79, supply: "12M", description: "WageCoin ($WAGE) is the core governance and store-of-value token of the Wage ecosystem, featuring deflationary mechanics through minting fees and burn events." },
  MINE:  { name: "MineCoin", category: "Crypto", price: 0.00085, change24h: 12.3, marketCap: "$142K", volume: "$28K", high24h: 0.00092, low24h: 0.00071, supply: "500M", description: "MineCoin ($MINE) is the inflationary utility token earned through daily mining, used for tasks, upgrades, and in-ecosystem fees." },
  BTC:   { name: "Bitcoin", category: "Crypto", price: 97420, change24h: -3.21, marketCap: "$2.3T", volume: "$42B", high24h: 101200, low24h: 95800, supply: "21M", description: "Bitcoin is the world's first and largest decentralized digital currency, serving as a global store of value." },
  ETH:   { name: "Ethereum", category: "Crypto", price: 3850, change24h: 0.39, marketCap: "$367B", volume: "$18B", high24h: 3920, low24h: 3780, supply: "120M", description: "Ethereum is the leading smart contract platform powering DeFi, NFTs, and decentralized applications worldwide." },
  SOL:   { name: "Solana", category: "Crypto", price: 160.2, change24h: -3.18, marketCap: "$86B", volume: "$4.2B", high24h: 168, low24h: 155, description: "Solana is a high-performance blockchain supporting 65,000+ TPS with sub-second finality." },
  XRP:   { name: "XRP", category: "Crypto", price: 2.34, change24h: 1.82, marketCap: "$134B", volume: "$6.1B", high24h: 2.42, low24h: 2.28, description: "XRP is the digital asset for cross-border payments, designed for speed and low transaction costs." },
  AVAX:  { name: "Avalanche", category: "Crypto", price: 38.4, change24h: -2.4, marketCap: "$15.8B", volume: "$820M", high24h: 40.1, low24h: 37.2, description: "Avalanche is a layer-1 platform for decentralized applications and enterprise blockchain solutions." },
  LINK:  { name: "Chainlink", category: "Crypto", price: 15.8, change24h: 4.1, marketCap: "$9.5B", volume: "$410M", high24h: 16.4, low24h: 15.1, description: "Chainlink provides decentralized oracle networks connecting smart contracts with real-world data." },
  POL:   { name: "Polygon", category: "Crypto", price: 0.42, change24h: -1.5, marketCap: "$4.2B", volume: "$280M", high24h: 0.44, low24h: 0.40, description: "Polygon is an Ethereum scaling solution offering fast, low-cost transactions." },
  ADA:   { name: "Cardano", category: "Crypto", price: 0.68, change24h: 2.3, marketCap: "$24B", volume: "$1.1B", high24h: 0.71, low24h: 0.65, description: "Cardano is a proof-of-stake blockchain platform focused on peer-reviewed research and sustainability." },
  XAU:   { name: "Gold", category: "Commodities", price: 1200, change24h: 2.3, marketCap: "--", volume: "$890K", high24h: 1225, low24h: 1175, description: "Gold is a precious metal and traditional safe-haven asset, tokenized for seamless trading in the Wage ecosystem." },
  XAG:   { name: "Silver", category: "Commodities", price: 320, change24h: -0.5, marketCap: "--", volume: "$120K", high24h: 328, low24h: 315, description: "Silver is an industrial and precious metal, offering both utility and investment value." },
  OIL:   { name: "Crude Oil", category: "Commodities", price: 450, change24h: -1.2, marketCap: "--", volume: "$540K", high24h: 462, low24h: 442, description: "Crude Oil tracks WTI Crude benchmark prices, tokenized for fractional trading." },
  NGAS:  { name: "Natural Gas", category: "Commodities", price: 85, change24h: 3.8, marketCap: "--", volume: "$210K", high24h: 89, low24h: 81, description: "Natural Gas tracks Henry Hub benchmark prices for energy sector exposure." },
  CU:    { name: "Copper", category: "Commodities", price: 180, change24h: 1.1, marketCap: "--", volume: "$95K", high24h: 184, low24h: 176, description: "Copper is a key industrial metal used as an economic bellwether." },
  XPT:   { name: "Platinum", category: "Commodities", price: 520, change24h: -0.3, marketCap: "--", volume: "$45K", high24h: 530, low24h: 512, description: "Platinum is a rare precious metal used in automotive catalysts and jewelry." },
  WB6M:  { name: "WageBond 6M", category: "Bonds", price: 100, change24h: 0.0, marketCap: "--", volume: "$12K", high24h: 100, low24h: 100, description: "6-month WageBond offering 15% APY, backed by the Wage treasury reserve." },
  WB1Y:  { name: "WageBond 1Y", category: "Bonds", price: 500, change24h: 0.0, marketCap: "--", volume: "$8K", high24h: 500, low24h: 500, description: "1-year WageBond offering 25% APY with principal protection." },
  WB2Y:  { name: "WageBond 2Y", category: "Bonds", price: 1000, change24h: 0.0, marketCap: "--", volume: "$5K", high24h: 1000, low24h: 1000, description: "2-year WageBond offering 40% APY for long-term holders." },
  WTC:   { name: "WageTech Corp", category: "Web3 Stocks", price: 84.5, change24h: 8.4, marketCap: "$845K", volume: "$52K", high24h: 88.2, low24h: 78.5, description: "WageTech Corp is the ecosystem's infrastructure and technology arm." },
  WEN:   { name: "WageEnergy", category: "Web3 Stocks", price: 32.1, change24h: -2.1, marketCap: "$321K", volume: "$18K", high24h: 33.8, low24h: 31.2, description: "WageEnergy focuses on tokenized renewable energy credits and carbon offsets." },
  NRW:   { name: "NeuralWage", category: "Web3 Stocks", price: 220, change24h: 15.2, marketCap: "$1.1M", volume: "$85K", high24h: 235, low24h: 195, description: "NeuralWage builds AI-powered tools and algorithms for the Wage ecosystem." },
  CPW:   { name: "ChipWage", category: "Web3 Stocks", price: 160, change24h: 4.5, marketCap: "$640K", volume: "$42K", high24h: 168, low24h: 152, description: "ChipWage develops semiconductor and hardware solutions for Web3 infrastructure." },
  SCW:   { name: "SecureWage", category: "Web3 Stocks", price: 130, change24h: 2.8, marketCap: "$520K", volume: "$31K", high24h: 135, low24h: 126, description: "SecureWage provides cybersecurity and audit services for the ecosystem." },
  GWS:   { name: "GameWage Studios", category: "Web3 Stocks", price: 150, change24h: 12.3, marketCap: "$900K", volume: "$72K", high24h: 162, low24h: 138, description: "GameWage Studios develops play-to-earn and GameFi experiences within Wage." },
  EURUSD:{ name: "EUR/USD", category: "Forex", price: 1.0842, change24h: 0.12, marketCap: "--", volume: "$2.1B", high24h: 1.0880, low24h: 1.0795, description: "Euro vs US Dollar — the most traded forex pair globally." },
  GBPUSD:{ name: "GBP/USD", category: "Forex", price: 1.2654, change24h: -0.08, marketCap: "--", volume: "$980M", high24h: 1.2710, low24h: 1.2590, description: "British Pound vs US Dollar — reflecting UK/US economic dynamics." },
  USDJPY:{ name: "USD/JPY", category: "Forex", price: 149.82, change24h: 0.34, marketCap: "--", volume: "$1.5B", high24h: 150.40, low24h: 149.10, description: "US Dollar vs Japanese Yen — a key carry-trade currency pair." },
  SPX:   { name: "S&P 500 Index", category: "Indices", price: 5820, change24h: 0.45, marketCap: "--", volume: "--", high24h: 5850, low24h: 5790, description: "The S&P 500 tracks 500 large-cap US companies, tokenized for 24/7 trading." },
  NDX:   { name: "NASDAQ 100", category: "Indices", price: 20450, change24h: 0.82, marketCap: "--", volume: "--", high24h: 20600, low24h: 20200, description: "The NASDAQ 100 tracks the top 100 non-financial companies on NASDAQ." },
  DJI:   { name: "Dow Jones", category: "Indices", price: 43200, change24h: -0.15, marketCap: "--", volume: "--", high24h: 43500, low24h: 42900, description: "The Dow Jones Industrial Average tracks 30 prominent US companies." },
};

const PERIODS = ["1H", "1D", "1W", "1M", "3M", "1Y", "ALL"] as const;
type Period = typeof PERIODS[number];
const periodDays: Record<Period, number> = { "1H": 1, "1D": 1, "1W": 7, "1M": 30, "3M": 90, "1Y": 365, ALL: 730 };

// ── Component ────────────────────────────────────────────────────
const AssetDetailPage = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("1M");
  const [tradeTab, setTradeTab] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [amount, setAmount] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  const asset = symbol ? ASSETS[symbol.toUpperCase().replace("$", "")] : null;
  const key = symbol?.toUpperCase().replace("$", "") || "";

  const priceHistory = useMemo(
    () => asset ? generatePriceHistory(key, asset.price, periodDays[period]) : [],
    [key, asset?.price, period]
  );

  const orderBook = useMemo(
    () => asset ? generateOrderBook(asset.price) : { asks: [], bids: [] },
    [asset?.price]
  );

  if (!asset) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground font-body">Asset not found</p>
        <button onClick={() => navigate("/market")} className="mt-4 text-primary font-body text-sm">← Back to Market</button>
      </div>
    );
  }

  const isPositive = asset.change24h >= 0;
  const fmt = (n: number) => n >= 1 ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : n.toFixed(6);
  const maxOrderTotal = Math.max(...orderBook.asks.map(o => o.total), ...orderBook.bids.map(o => o.total));

  return (
    <div className="pb-24 lg:pb-8">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/market")} className="p-2 rounded-lg hover:bg-secondary transition-colors tap-shrink">
            <ArrowLeft size={18} />
          </button>
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-sm font-display font-bold">{key.slice(0, 2)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-display font-bold truncate">{asset.name}</h1>
            <p className="text-xs text-muted-foreground font-body">{key} · {asset.category}</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <Star size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Price */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-3xl font-display font-bold">${fmt(asset.price)}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`flex items-center gap-1 text-sm font-body font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? "+" : ""}{asset.change24h.toFixed(2)}%
            </span>
            <span className="text-xs text-muted-foreground font-body">24h</span>
          </div>
        </motion.div>

        {/* Period selector */}
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-1.5 rounded-md text-[11px] font-body font-medium transition-all ${
                period === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card-clean p-4 h-[260px] lg:h-[340px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? "hsl(145, 72%, 40%)" : "hsl(0, 72%, 50%)"} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isPositive ? "hsl(145, 72%, 40%)" : "hsl(0, 72%, 50%)"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={55}
                tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v >= 1 ? v.toFixed(0) : v.toFixed(4)}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                formatter={(value: number) => [`$${fmt(value)}`, "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "hsl(145, 72%, 40%)" : "hsl(0, 72%, 50%)"}
                strokeWidth={2}
                fill="url(#priceGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Volume chart */}
        <div className="card-clean p-4 h-[100px]">
          <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider mb-2">Volume</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceHistory} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Bar dataKey="volume" fill="hsl(var(--primary) / 0.3)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "24h High", value: `$${fmt(asset.high24h)}` },
            { label: "24h Low", value: `$${fmt(asset.low24h)}` },
            { label: "Market Cap", value: asset.marketCap },
            { label: "Volume", value: asset.volume },
            ...(asset.supply ? [{ label: "Supply", value: asset.supply }] : []),
          ].map((s) => (
            <div key={s.label} className="card-clean p-3">
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{s.label}</p>
              <p className="text-sm font-display font-bold mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Two column: Order Book + Trade Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Order Book */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-clean p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={14} className="text-primary" />
              <h3 className="text-sm font-display font-semibold">Order Book</h3>
            </div>

            {/* Header */}
            <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground font-body uppercase tracking-wider mb-2 px-1">
              <span>Price</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Total</span>
            </div>

            {/* Asks (reversed so lowest ask is at bottom near spread) */}
            <div className="space-y-0.5 mb-2">
              {[...orderBook.asks].reverse().map((ask, i) => (
                <div key={`a${i}`} className="relative grid grid-cols-3 gap-2 py-1 px-1 rounded text-xs font-body">
                  <div
                    className="absolute inset-0 rounded"
                    style={{
                      background: "hsl(0, 72%, 50%)",
                      opacity: 0.08,
                      width: `${(ask.total / maxOrderTotal) * 100}%`,
                      right: 0,
                      left: "auto",
                    }}
                  />
                  <span className="text-destructive relative z-10">${fmt(ask.price)}</span>
                  <span className="text-right relative z-10">{ask.amount}</span>
                  <span className="text-right text-muted-foreground relative z-10">{ask.total}</span>
                </div>
              ))}
            </div>

            {/* Spread */}
            <div className="text-center py-1.5 border-y border-border/30">
              <span className="text-sm font-display font-bold">${fmt(asset.price)}</span>
              <span className="text-[10px] text-muted-foreground font-body ml-2">Spread {((orderBook.asks[0].price - orderBook.bids[0].price) / asset.price * 100).toFixed(3)}%</span>
            </div>

            {/* Bids */}
            <div className="space-y-0.5 mt-2">
              {orderBook.bids.map((bid, i) => (
                <div key={`b${i}`} className="relative grid grid-cols-3 gap-2 py-1 px-1 rounded text-xs font-body">
                  <div
                    className="absolute inset-0 rounded"
                    style={{
                      background: "hsl(145, 72%, 40%)",
                      opacity: 0.08,
                      width: `${(bid.total / maxOrderTotal) * 100}%`,
                      right: 0,
                      left: "auto",
                    }}
                  />
                  <span className="text-success relative z-10">${fmt(bid.price)}</span>
                  <span className="text-right relative z-10">{bid.amount}</span>
                  <span className="text-right text-muted-foreground relative z-10">{bid.total}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trade Panel */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-clean p-4">
            <div className="flex items-center gap-2 mb-4">
              <ArrowDownUp size={14} className="text-primary" />
              <h3 className="text-sm font-display font-semibold">Trade</h3>
            </div>

            {/* Buy / Sell tabs */}
            <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg mb-4">
              <button
                onClick={() => setTradeTab("buy")}
                className={`flex-1 py-2 rounded-md text-xs font-body font-medium transition-all ${
                  tradeTab === "buy" ? "bg-success/20 text-success" : "text-muted-foreground"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeTab("sell")}
                className={`flex-1 py-2 rounded-md text-xs font-body font-medium transition-all ${
                  tradeTab === "sell" ? "bg-destructive/20 text-destructive" : "text-muted-foreground"
                }`}
              >
                Sell
              </button>
            </div>

            {/* Order type */}
            <div className="flex gap-2 mb-4">
              {(["market", "limit"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setOrderType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-body capitalize border transition-all ${
                    orderType === t
                      ? "border-primary text-foreground bg-primary/10"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Limit price */}
            {orderType === "limit" && (
              <div className="mb-3">
                <label className="text-[10px] text-muted-foreground font-body uppercase">Price (USD)</label>
                <input
                  type="number"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  placeholder={fmt(asset.price)}
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border/40 text-foreground text-sm font-body focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            {/* Amount */}
            <div className="mb-3">
              <label className="text-[10px] text-muted-foreground font-body uppercase">Amount ({key})</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border/40 text-foreground text-sm font-body focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 mb-4">
              {["25%", "50%", "75%", "100%"].map((pct) => (
                <button
                  key={pct}
                  className="flex-1 py-1.5 rounded-md text-[10px] font-body text-muted-foreground border border-border hover:border-primary/30 transition-colors"
                >
                  {pct}
                </button>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between py-3 border-t border-border/30 mb-4">
              <span className="text-xs text-muted-foreground font-body">Total (USD)</span>
              <span className="text-sm font-display font-bold">
                ${amount ? (parseFloat(amount) * (orderType === "limit" && limitPrice ? parseFloat(limitPrice) : asset.price)).toFixed(2) : "0.00"}
              </span>
            </div>

            {/* Submit */}
            <button
              className={`w-full py-3 rounded-lg text-sm font-body font-semibold tap-shrink transition-all ${
                tradeTab === "buy"
                  ? "bg-success text-white"
                  : "bg-destructive text-white"
              }`}
            >
              {tradeTab === "buy" ? "Buy" : "Sell"} {key}
            </button>

            {/* Fee info */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground font-body">
                <span>Fee (0.1%)</span>
                <span>${amount ? (parseFloat(amount) * asset.price * 0.001).toFixed(4) : "0.00"}</span>
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-body">
                <span>Slippage tolerance</span>
                <span>0.5%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent trades */}
        <div className="card-clean p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-primary" />
            <h3 className="text-sm font-display font-semibold">Recent Trades</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground font-body uppercase tracking-wider mb-2 px-1">
            <span>Price</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Time</span>
          </div>
          {Array.from({ length: 10 }).map((_, i) => {
            const isBuy = Math.random() > 0.45;
            const tradePrice = asset.price * (1 + (Math.random() - 0.5) * 0.004);
            const tradeAmt = +(Math.random() * 20 + 0.5).toFixed(2);
            const mins = Math.floor(Math.random() * 60);
            return (
              <div key={i} className="grid grid-cols-3 gap-2 py-1 px-1 text-xs font-body">
                <span className={isBuy ? "text-success" : "text-destructive"}>${fmt(tradePrice)}</span>
                <span className="text-right">{tradeAmt}</span>
                <span className="text-right text-muted-foreground">{mins}m ago</span>
              </div>
            );
          })}
        </div>

        {/* About */}
        <div className="card-clean p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={14} className="text-primary" />
            <h3 className="text-sm font-display font-semibold">About {asset.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">{asset.description}</p>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailPage;
