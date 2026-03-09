import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, ArrowRight, Building2, Users, Landmark, TrendingUp, ChevronDown,
  Coins, Shield, Globe, Zap, Crown, ArrowDownUp, Wallet, BadgePercent,
  CircleDollarSign, Factory, Pickaxe, Briefcase, HandCoins, Gift,
  Lock, Unlock, Scale, Eye, PiggyBank, Target, Banknote, Activity, Clock
} from "lucide-react";
import CoinIcon from "@/components/CoinIcon";

/* ══════ ECONOMIC MODEL DATA ══════ */

const TOTAL_SUPPLY = 1_000_000_000;
const BURNED = 24_350_000;
const CIRCULATING = 185_400_000;
const COMPANY_TREASURY = 340_000_000;
const LOCKED_VAULTS = 280_000_000;
const UBI_FUND = 120_000_000;
const REMAINING = TOTAL_SUPPLY - BURNED - CIRCULATING - COMPANY_TREASURY - LOCKED_VAULTS - UBI_FUND;

const supplyBreakdown = [
  { label: "Circulating (Users)", value: CIRCULATING, pct: (CIRCULATING / TOTAL_SUPPLY * 100).toFixed(1), color: "bg-primary", icon: Users },
  { label: "Company Treasury", value: COMPANY_TREASURY, pct: (COMPANY_TREASURY / TOTAL_SUPPLY * 100).toFixed(1), color: "bg-warning", icon: Building2 },
  { label: "Locked in Vaults", value: LOCKED_VAULTS, pct: (LOCKED_VAULTS / TOTAL_SUPPLY * 100).toFixed(1), color: "bg-info", icon: Lock },
  { label: "UBI Reserve Fund", value: UBI_FUND, pct: (UBI_FUND / TOTAL_SUPPLY * 100).toFixed(1), color: "bg-success", icon: Globe },
  { label: "Burned (Forever)", value: BURNED, pct: (BURNED / TOTAL_SUPPLY * 100).toFixed(1), color: "bg-destructive", icon: Flame },
  { label: "Unminted Reserve", value: REMAINING, pct: (REMAINING / TOTAL_SUPPLY * 100).toFixed(1), color: "bg-secondary", icon: PiggyBank },
];

const revenueStreams = [
  {
    id: "task_fees",
    title: "Task & Job Fees",
    icon: Briefcase,
    description: "Every daily task has a hidden service cost. Users earn the net reward; the platform retains a fee.",
    example: "Task reward: 100 $MINE → User gets 85 $MINE, 10 $MINE → Company, 5 $MINE → Treasury burn",
    breakdown: [
      { label: "User Reward", pct: 85, color: "bg-primary" },
      { label: "Company Revenue", pct: 10, color: "bg-warning" },
      { label: "Treasury Burn", pct: 5, color: "bg-destructive" },
    ],
  },
  {
    id: "swap_fees",
    title: "Swap & Exchange Fees",
    icon: ArrowDownUp,
    description: "Every token swap charges a 0.3% fee, split between the company and liquidity providers.",
    example: "Swap 1000 $MINE → 3 $MINE fee → 1.5 Company + 1.0 LP + 0.5 Burn",
    breakdown: [
      { label: "Liquidity Providers", pct: 33, color: "bg-primary" },
      { label: "Company Revenue", pct: 50, color: "bg-warning" },
      { label: "Treasury Burn", pct: 17, color: "bg-destructive" },
    ],
  },
  {
    id: "upgrade_fees",
    title: "Upgrade & Purchase Tax",
    icon: Zap,
    description: "Mining upgrades, premium features, and in-app purchases include a 1-5% platform tax.",
    example: "Drill Upgrade 500 $MINE → 25 $MINE (5%) tax → 15 Company + 10 Burn",
    breakdown: [
      { label: "Item/Service", pct: 95, color: "bg-primary" },
      { label: "Company Tax", pct: 3, color: "bg-warning" },
      { label: "Treasury Burn", pct: 2, color: "bg-destructive" },
    ],
  },
  {
    id: "withdrawal_fees",
    title: "Withdrawal & Cash-Out Fees",
    icon: Banknote,
    description: "Converting $WAGE to real-world currency (fiat) charges a 2-5% exit fee.",
    example: "$100 $WAGE withdrawal → $95 to user, $3 Company, $2 Burn",
    breakdown: [
      { label: "User Receives", pct: 95, color: "bg-primary" },
      { label: "Company Revenue", pct: 3, color: "bg-warning" },
      { label: "Treasury Burn", pct: 2, color: "bg-destructive" },
    ],
  },
  {
    id: "credit_interest",
    title: "Loan Interest & Credit Fees",
    icon: HandCoins,
    description: "Borrowed $WAGE accrues interest. Interest payments fund the company and burn mechanism.",
    example: "Borrow 1000 $WAGE at 8% APR → 80 $WAGE/year → 60 Company + 20 Burn",
    breakdown: [
      { label: "Company Revenue", pct: 75, color: "bg-warning" },
      { label: "Treasury Burn", pct: 25, color: "bg-destructive" },
    ],
  },
  {
    id: "premium_services",
    title: "Premium & Advertising",
    icon: Crown,
    description: "Ad recovery (energy refill), premium badges, boosted profiles, and featured listings.",
    example: "Watch ad → recover 50 energy → Ad revenue goes 100% to Company",
    breakdown: [
      { label: "Company Revenue", pct: 100, color: "bg-warning" },
    ],
  },
  {
    id: "market_spread",
    title: "Market Maker Spread",
    icon: TrendingUp,
    description: "The platform acts as market maker for tokenized assets, profiting from the bid-ask spread.",
    example: "Buy Tech ETF at 1.02x → Sell at 0.98x → 4% spread to Company",
    breakdown: [
      { label: "Company Spread", pct: 80, color: "bg-warning" },
      { label: "Liquidity Fund", pct: 20, color: "bg-info" },
    ],
  },
];

const economyCycle = [
  { emoji: "🏢", agent: "Companies", role: "Create Tasks & Jobs", flow: "Pay salaries in $MINE", icon: Factory },
  { emoji: "👷", agent: "Workers", role: "Complete Tasks", flow: "Earn $MINE, convert to $WAGE", icon: Users },
  { emoji: "🏛️", agent: "Treasury", role: "Collect Taxes", flow: "Burn $MINE → $WAGE scarcity", icon: Landmark },
  { emoji: "💼", agent: "Platform", role: "Revenue & Growth", flow: "Fees fund operations + profit", icon: Building2 },
];

const wagecoinMetrics = [
  { label: "Total Supply", value: "1,000,000,000", sub: "Hard cap — never more" },
  { label: "Halving Cycle", value: "180 Days", sub: "Emission halves every 6 months" },
  { label: "Current Price", value: "$0.85", sub: "Market determined" },
  { label: "Burn Rate", value: "~2.4%", sub: "Of total supply burned" },
  { label: "Next Halving", value: "42 Days", sub: "Emission reduces 50%" },
  { label: "Backing Model", value: "Work + Scarcity", sub: "Like Bitcoin + Worldcoin" },
];

const EconomicsPage = () => {
  const [expandedStream, setExpandedStream] = useState<string | null>("task_fees");
  const [showFullSupply, setShowFullSupply] = useState(false);

  // Real-time metrics simulation
  const [livePrice, setLivePrice] = useState(0.85);
  const [dailyActiveUsers, setDailyActiveUsers] = useState(12847);

  // Calculate time until next halving (180 days from launch)
  const LAUNCH_DATE = new Date("2024-09-01T00:00:00Z");
  const HALVING_INTERVAL = 180 * 24 * 60 * 60 * 1000; // 180 days in ms
  
  const [timeToHalving, setTimeToHalving] = useState(() => {
    const now = Date.now();
    const timeSinceLaunch = now - LAUNCH_DATE.getTime();
    const halvingNumber = Math.floor(timeSinceLaunch / HALVING_INTERVAL);
    const nextHalving = LAUNCH_DATE.getTime() + (halvingNumber + 1) * HALVING_INTERVAL;
    return nextHalving - now;
  });

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLaunch = now - LAUNCH_DATE.getTime();
      const halvingNumber = Math.floor(timeSinceLaunch / HALVING_INTERVAL);
      const nextHalving = LAUNCH_DATE.getTime() + (halvingNumber + 1) * HALVING_INTERVAL;
      setTimeToHalving(nextHalving - now);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live price changes
  useEffect(() => {
    const priceInterval = setInterval(() => {
      setLivePrice((prev) => {
        const change = (Math.random() - 0.48) * 0.005; // Slight upward bias
        const newPrice = Math.max(0.5, Math.min(1.5, prev + change));
        return Number(newPrice.toFixed(4));
      });
    }, 3000);
    return () => clearInterval(priceInterval);
  }, []);

  // Simulate DAU changes
  useEffect(() => {
    const dauInterval = setInterval(() => {
      setDailyActiveUsers((prev) => {
        const change = Math.floor((Math.random() - 0.5) * 50);
        return Math.max(10000, Math.min(20000, prev + change));
      });
    }, 8000);
    return () => clearInterval(dauInterval);
  }, []);

  // Format time to halving
  const formatTimeToHalving = (ms: number) => {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTimeToHalving(timeToHalving);

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-6">

        {/* ══ Header ══ */}
        <div>
          <h1 className="font-display font-bold text-xl">Tokenomics</h1>
          <p className="text-xs text-muted-foreground font-body mt-0.5">
            How $MINE and $WAGE power a self-sustaining economy — and generate real revenue.
          </p>
        </div>

        {/* ══ WageIndex Live Dashboard ══ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-clean p-4 space-y-4 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-sm flex items-center gap-2">
              <Activity size={15} className="text-primary" />
              WageIndex — Live Metrics
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[9px] text-success font-body font-medium">LIVE</span>
            </div>
          </div>

          {/* Main Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Total Supply */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card-elevated rounded-xl p-3 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Coins size={14} className="text-primary" />
                <p className="text-[9px] text-muted-foreground font-body uppercase tracking-wide">Total Supply</p>
              </div>
              <p className="text-lg font-display font-bold text-gradient-primary">1.00B</p>
              <p className="text-[8px] text-muted-foreground font-body">Hard Cap (Max Ever)</p>
            </motion.div>

            {/* Tokens Burned */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card-elevated rounded-xl p-3 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Flame size={14} className="text-destructive" />
                <p className="text-[9px] text-muted-foreground font-body uppercase tracking-wide">Burned Forever</p>
              </div>
              <p className="text-lg font-display font-bold text-destructive">
                {(BURNED / 1_000_000).toFixed(2)}M
              </p>
              <p className="text-[8px] text-muted-foreground font-body">
                {((BURNED / TOTAL_SUPPLY) * 100).toFixed(2)}% of supply
              </p>
            </motion.div>

            {/* DAU */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card-elevated rounded-xl p-3 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-info" />
                <p className="text-[9px] text-muted-foreground font-body uppercase tracking-wide">Daily Active Users</p>
              </div>
              <motion.p
                key={dailyActiveUsers}
                initial={{ scale: 1.1, color: "hsl(var(--info))" }}
                animate={{ scale: 1, color: "hsl(var(--foreground))" }}
                className="text-lg font-display font-bold"
              >
                {dailyActiveUsers.toLocaleString()}
              </motion.p>
              <p className="text-[8px] text-muted-foreground font-body">Last 24 hours</p>
            </motion.div>

            {/* $WAGE Price */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-card-elevated rounded-xl p-3 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-success" />
                <p className="text-[9px] text-muted-foreground font-body uppercase tracking-wide">$WAGE Price</p>
              </div>
              <motion.p
                key={livePrice}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                className="text-lg font-display font-bold text-gradient-gold"
              >
                ${livePrice.toFixed(4)}
              </motion.p>
              <p className="text-[8px] text-muted-foreground font-body">Market rate (simulated)</p>
            </motion.div>
          </div>

          {/* Halving Countdown */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-primary" />
                <p className="text-xs font-display font-semibold">Next WageHalving™</p>
              </div>
              <div className="px-2 py-0.5 bg-primary/20 rounded-md">
                <p className="text-[8px] font-body font-bold text-primary">-50% Emission</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Days", value: days },
                { label: "Hours", value: hours },
                { label: "Mins", value: minutes },
                { label: "Secs", value: seconds },
              ].map((unit) => (
                <div key={unit.label} className="bg-card rounded-lg p-2 text-center">
                  <motion.p
                    key={unit.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-xl font-display font-bold text-primary"
                  >
                    {String(unit.value).padStart(2, "0")}
                  </motion.p>
                  <p className="text-[8px] text-muted-foreground font-body uppercase">{unit.label}</p>
                </div>
              ))}
            </div>

            <p className="text-[9px] text-muted-foreground font-body text-center mt-3">
              Every 180 days, new $WAGE emission is cut in half — increasing scarcity forever.
            </p>
          </div>
        </motion.section>

        {/* ══ Dual Token Overview ══ */}
        <div className="grid grid-cols-2 gap-3">
          {/* $MINE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-clean p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <CoinIcon type="mine" size={28} />
              <div>
                <p className="text-sm font-display font-bold">$MINE</p>
                <p className="text-[9px] text-muted-foreground font-body">Utility Token</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {[
                { label: "Type", value: "Inflationary" },
                { label: "Use", value: "Tasks, Upgrades, Fees" },
                { label: "Earning", value: "Mining, Jobs, Tasks" },
                { label: "Burns", value: "Via Treasury taxes" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-[10px] font-body">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* $WAGE */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card-clean p-4 space-y-3 border-primary/20"
          >
            <div className="flex items-center gap-2">
              <CoinIcon type="wage" size={28} variant="gold" />
              <div>
                <p className="text-sm font-display font-bold">$WAGE</p>
                <p className="text-[9px] text-muted-foreground font-body">Capital & Governance</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {[
                { label: "Type", value: "Deflationary" },
                { label: "Use", value: "Salary, Staking, Cash-out" },
                { label: "Earning", value: "Swap from $MINE" },
                { label: "Halving", value: "Every 180 days" },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-[10px] font-body">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ══ $WAGE Metrics Grid ══ */}
        <section>
          <h2 className="font-display font-semibold text-[15px] mb-3 flex items-center gap-2">
            <Scale size={15} className="text-primary" />
            $WAGE Token Metrics
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {wagecoinMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card-clean p-3 text-center"
              >
                <p className="text-xs font-display font-bold">{m.value}</p>
                <p className="text-[9px] text-muted-foreground font-body mt-0.5">{m.label}</p>
                <p className="text-[8px] text-muted-foreground/60 font-body">{m.sub}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══ Economy Cycle ══ */}
        <section className="card-clean p-4">
          <h2 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
            <ArrowDownUp size={15} className="text-primary" />
            Economic Circulation
          </h2>
          <div className="relative">
            {/* Circular flow */}
            <div className="grid grid-cols-2 gap-3">
              {economyCycle.map((step, i) => (
                <motion.div
                  key={step.agent}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-secondary/50 rounded-xl p-3 relative"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{step.emoji}</span>
                    <p className="text-xs font-display font-bold">{step.agent}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-body">{step.role}</p>
                  <p className="text-[9px] text-primary font-body font-medium mt-1">{step.flow}</p>
                  {i < 3 && (
                    <ArrowRight size={12} className="absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
                  )}
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-3">
              <p className="text-[10px] text-muted-foreground font-body italic">
                Companies → Workers → Treasury → Platform → Companies (repeat)
              </p>
            </div>
          </div>
        </section>

        {/* ══ Task Cost Breakdown Example ══ */}
        <section className="card-clean p-4 space-y-4">
          <h2 className="font-display font-semibold text-sm flex items-center gap-2">
            <Eye size={15} className="text-primary" />
            How a Task Really Works
          </h2>
          <p className="text-[10px] text-muted-foreground font-body">
            Each task has a hidden "service cost" baked in. Here's what happens when you complete a 100 $MINE task:
          </p>

          <div className="space-y-2">
            {/* Visual flow */}
            <div className="flex items-center gap-2 bg-secondary/50 rounded-xl p-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Briefcase size={18} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-display font-bold">Task Completed</p>
                <p className="text-[10px] text-muted-foreground font-body">Gross value: 100 $MINE</p>
              </div>
            </div>

            <div className="flex gap-2">
              <ArrowRight size={12} className="text-muted-foreground mt-3 flex-shrink-0 ml-5" />
              <div className="flex-1 space-y-1.5">
                {[
                  { label: "Your Reward (Net Salary)", value: "85 $MINE", pct: "85%", color: "bg-primary", icon: Users, desc: "Goes to your wallet" },
                  { label: "Company Revenue", value: "10 $MINE", pct: "10%", color: "bg-warning", icon: Building2, desc: "Platform operating costs & profit" },
                  { label: "Treasury Burn", value: "5 $MINE", pct: "5%", color: "bg-destructive", icon: Flame, desc: "Burned forever → $WAGE appreciates" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 bg-secondary/30 rounded-lg p-2.5">
                    <div className={`w-2 h-8 rounded-full ${item.color} flex-shrink-0`} />
                    <item.icon size={14} className="text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-display font-semibold">{item.label}</p>
                        <p className="text-[10px] font-display font-bold">{item.value}</p>
                      </div>
                      <p className="text-[8px] text-muted-foreground font-body">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar visual */}
            <div className="h-3 rounded-full overflow-hidden flex">
              <div className="bg-primary h-full" style={{ width: "85%" }} />
              <div className="bg-warning h-full" style={{ width: "10%" }} />
              <div className="bg-destructive h-full" style={{ width: "5%" }} />
            </div>
            <div className="flex justify-between text-[8px] text-muted-foreground font-body">
              <span>85% Worker</span>
              <span>10% Company</span>
              <span>5% Burn</span>
            </div>
          </div>
        </section>

        {/* ══ All Revenue Streams ══ */}
        <section>
          <h2 className="font-display font-semibold text-[15px] mb-3 flex items-center gap-2">
            <CircleDollarSign size={15} className="text-warning" />
            Platform Revenue Streams
          </h2>
          <p className="text-[10px] text-muted-foreground font-body mb-3">
            The platform generates revenue through fair, transparent fees across all economic activities — sustaining operations and driving token value.
          </p>
          <div className="space-y-2">
            {revenueStreams.map((stream) => {
              const Icon = stream.icon;
              const isExpanded = expandedStream === stream.id;
              return (
                <motion.div
                  key={stream.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-clean overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedStream(isExpanded ? null : stream.id)}
                    className="w-full p-3.5 flex items-center gap-3 tap-shrink text-left"
                  >
                    <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-display font-semibold">{stream.title}</p>
                      <p className="text-[9px] text-muted-foreground font-body line-clamp-1">{stream.description}</p>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-muted-foreground transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3.5 pb-3.5 space-y-3 border-t border-border/30 pt-3">
                          <p className="text-[10px] text-muted-foreground font-body">{stream.description}</p>
                          
                          {/* Example */}
                          <div className="bg-secondary/40 rounded-lg p-2.5">
                            <p className="text-[9px] text-muted-foreground font-body uppercase mb-1">Example</p>
                            <p className="text-[10px] font-body font-medium">{stream.example}</p>
                          </div>

                          {/* Breakdown bar */}
                          <div className="h-2.5 rounded-full overflow-hidden flex">
                            {stream.breakdown.map((b) => (
                              <div key={b.label} className={`${b.color} h-full`} style={{ width: `${b.pct}%` }} />
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {stream.breakdown.map((b) => (
                              <div key={b.label} className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-full ${b.color}`} />
                                <span className="text-[9px] font-body text-muted-foreground">
                                  {b.label} ({b.pct}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ══ Supply Distribution ══ */}
        <section className="card-clean p-4 space-y-4">
          <h2 className="font-display font-semibold text-sm flex items-center gap-2">
            <Target size={15} className="text-primary" />
            $WAGE Supply Distribution
          </h2>

          {/* Supply bar */}
          <div className="h-4 rounded-full overflow-hidden flex">
            {supplyBreakdown.map((s) => (
              <div
                key={s.label}
                className={`${s.color} h-full transition-all`}
                style={{ width: `${s.pct}%` }}
                title={`${s.label}: ${s.pct}%`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {supplyBreakdown.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-2.5 bg-secondary/30 rounded-lg p-2.5">
                  <div className={`w-2 h-8 rounded-full ${s.color} flex-shrink-0`} />
                  <Icon size={13} className="text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-display font-semibold">{s.label}</p>
                    <p className="text-[9px] text-muted-foreground font-body">
                      {(s.value / 1_000_000).toFixed(1)}M ({s.pct}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ Company Capital Model ══ */}
        <section className="card-clean p-4 space-y-3 border-warning/20">
          <h2 className="font-display font-semibold text-sm flex items-center gap-2">
            <Building2 size={15} className="text-warning" />
            Company Revenue Model
          </h2>
          <p className="text-[10px] text-muted-foreground font-body">
            The platform operates like a government within a digital economy — collecting fair taxes and fees that sustain operations while the token ($WAGE) serves as the company's primary capital asset.
          </p>

          <div className="space-y-2">
            {[
              {
                icon: BadgePercent,
                title: "Transaction Fees (0.3–5%)",
                desc: "Every swap, withdrawal, upgrade, and trade generates micro-revenue for the platform.",
              },
              {
                icon: Flame,
                title: "Burn Mechanism → Token Value",
                desc: "A portion of every fee is permanently burned, reducing supply. As $WAGE becomes scarcer, its value increases — benefiting both users and the company's treasury holdings.",
              },
              {
                icon: PiggyBank,
                title: "Treasury Holdings",
                desc: "The company holds 340M $WAGE in reserve. As the token appreciates through burns and adoption, the company's capital grows without selling anything.",
              },
              {
                icon: Crown,
                title: "Premium Services & Ads",
                desc: "Energy recovery ads, premium badges, boosted profiles, and featured listings generate direct fiat revenue.",
              },
              {
                icon: HandCoins,
                title: "Credit Interest",
                desc: "Loans create recurring interest revenue. Users borrow $WAGE, repay with interest — 75% to company, 25% burned.",
              },
              {
                icon: TrendingUp,
                title: "Market Making",
                desc: "The platform provides liquidity for all tokenized assets (stocks, ETFs, commodities), earning the bid-ask spread.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-secondary/30 rounded-xl p-3">
                <item.icon size={16} className="text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-display font-semibold">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ Worldcoin-Inspired Vision ══ */}
        <section className="card-clean p-4 space-y-3 border-primary/20">
          <h2 className="font-display font-semibold text-sm flex items-center gap-2">
            <Globe size={15} className="text-primary" />
            From Virtual to Real — The Vision
          </h2>
          <p className="text-[10px] text-muted-foreground font-body leading-relaxed">
            Inspired by <span className="text-foreground font-medium">Worldcoin</span>, <span className="text-foreground font-medium">DeFi protocols</span>, and <span className="text-foreground font-medium">play-to-earn economies</span> — the ultimate goal is that consistent work on the platform translates to <span className="text-primary font-medium">real-world income</span>.
          </p>

          <div className="space-y-2">
            {[
              { step: "1", title: "Work & Earn $MINE", desc: "Complete daily tasks, jobs, and mining to accumulate $MINE" },
              { step: "2", title: "Convert to $WAGE", desc: "Swap $MINE → $WAGE at market rate (deflationary, scarce)" },
              { step: "3", title: "Stake for Yield", desc: "Lock $WAGE in Vault for 5–200% APY compound growth" },
              { step: "4", title: "Cash Out to Fiat", desc: "Withdraw $WAGE to bank account via WagePay (2-5% fee)" },
              { step: "5", title: "Real-World Value", desc: "Your daily platform work generates actual income — like a job" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-display font-bold text-primary">{item.step}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-display font-semibold">{item.title}</p>
                  <p className="text-[9px] text-muted-foreground font-body">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mt-2">
            <p className="text-[10px] font-body text-primary font-medium text-center">
              💡 The more users work → the more fees generated → the more $MINE burned → the more $WAGE appreciates → everyone's salary is worth more in the real world.
            </p>
          </div>
        </section>

        {/* ══ Sustainability Model ══ */}
        <section className="card-clean p-4 space-y-3">
          <h2 className="font-display font-semibold text-sm flex items-center gap-2">
            <Shield size={15} className="text-success" />
            Why This Economy is Sustainable
          </h2>
          <div className="space-y-2">
            {[
              { icon: "⚖️", title: "Balanced In/Out", desc: "$MINE creation (tasks) is balanced by $MINE destruction (fees, burns, upgrades)" },
              { icon: "📉", title: "Deflationary $WAGE", desc: "Halvings every 180 days ensure $WAGE becomes increasingly scarce over time" },
              { icon: "💼", title: "Real Revenue", desc: "The platform earns real revenue through fees — not just from token sales" },
              { icon: "🏛️", title: "Treasury Reserves", desc: "Company holds $WAGE reserves, aligned with users — if token grows, everyone benefits" },
              { icon: "🌍", title: "UBI Funding", desc: "12% of supply dedicated to Universal Basic Income — funded by the working economy" },
              { icon: "🔒", title: "Game Theory", desc: "Debt incentivizes work (pay back loans), staking locks supply, competition drives engagement" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-base mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs font-display font-semibold">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default EconomicsPage;
