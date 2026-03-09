import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Clock, Shield, TrendingUp, Users, ChevronRight, AlertTriangle } from "lucide-react";
import CoinIcon from "@/components/CoinIcon";

type Tab = "borrow" | "lend";

interface LoanOffer {
  id: string;
  amount: number;
  apr: number;
  term: string;
  collateralRatio: number;
  lender?: string;
}

interface ActiveLoan {
  id: string;
  type: "borrowed" | "lent";
  amount: number;
  remaining: number;
  apr: number;
  nextPayment: string;
  status: "active" | "overdue";
}

const borrowOffers: LoanOffer[] = [
  { id: "1", amount: 500, apr: 8.5, term: "30 days", collateralRatio: 150 },
  { id: "2", amount: 2000, apr: 6.2, term: "90 days", collateralRatio: 200 },
  { id: "3", amount: 5000, apr: 5.0, term: "180 days", collateralRatio: 250 },
  { id: "4", amount: 10000, apr: 4.5, term: "365 days", collateralRatio: 300 },
  { id: "5", amount: 25000, apr: 3.8, term: "365 days", collateralRatio: 350 },
  { id: "6", amount: 50000, apr: 3.2, term: "730 days", collateralRatio: 400 },
];

const lendingPools = [
  { id: "p1", name: "Conservative Pool", apr: 4.5, tvl: 1250000, utilization: 72, risk: "Low" },
  { id: "p2", name: "Standard Pool", apr: 7.8, tvl: 890000, utilization: 85, risk: "Medium" },
  { id: "p3", name: "High Yield Pool", apr: 12.5, tvl: 340000, utilization: 92, risk: "High" },
  { id: "p4", name: "Peer-to-Peer", apr: 9.0, tvl: 560000, utilization: 68, risk: "Medium" },
];

const activeLoans: ActiveLoan[] = [
  { id: "a1", type: "borrowed", amount: 2000, remaining: 1450, apr: 6.2, nextPayment: "Mar 15", status: "active" },
  { id: "a2", type: "lent", amount: 5000, remaining: 5000, apr: 7.8, nextPayment: "Mar 20", status: "active" },
];

const CreditPage = () => {
  const [tab, setTab] = useState<Tab>("borrow");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [lendAmount, setLendAmount] = useState("");
  const reputationScore = 742;
  const maxCredit = 100000;
  const availableCredit = 75000;
  const wageBalance = 12450;

  return (
    <div className="p-4 pb-24 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold">Credit</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Borrow $WAGE or lend to earn yield</p>
      </div>

      {/* Credit Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-5 bg-card border border-border/40"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-primary" />
            <span className="text-xs font-body text-muted-foreground uppercase tracking-wide">Reputation Score</span>
          </div>
          <span className="text-2xl font-display font-bold text-primary">{reputationScore}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-muted-foreground font-body">Credit Limit</p>
            <p className="text-lg font-display font-bold">${maxCredit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-body">Available</p>
            <p className="text-lg font-display font-bold text-primary">${availableCredit.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(availableCredit / maxCredit) * 100}%` }} />
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
        <button
          onClick={() => setTab("borrow")}
          className={`flex-1 py-2.5 rounded-md text-xs font-body font-medium transition-all ${tab === "borrow" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          <ArrowDownLeft size={14} className="inline mr-1.5" />
          Borrow
        </button>
        <button
          onClick={() => setTab("lend")}
          className={`flex-1 py-2.5 rounded-md text-xs font-body font-medium transition-all ${tab === "lend" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          <ArrowUpRight size={14} className="inline mr-1.5" />
          Lend
        </button>
      </div>

      {tab === "borrow" ? (
        <div className="space-y-4">
          {/* Quick Borrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-5 bg-card border border-border/40"
          >
            <h3 className="text-sm font-display font-semibold mb-3">Quick Borrow</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground font-body uppercase">Amount ($WAGE)</label>
                <input
                  type="number"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border/40 text-foreground text-sm font-body focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-body">
                <span>Collateral required (150%)</span>
                <span>{borrowAmount ? (parseFloat(borrowAmount) * 1.5).toFixed(0) : "0"} $MINE</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-body">
                <span>Est. APR</span>
                <span className="text-primary">6.2%</span>
              </div>
              <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium tap-shrink">
                Borrow $WAGE
              </button>
            </div>
          </motion.div>

          {/* Loan Options */}
          <div>
            <h3 className="text-sm font-display font-semibold mb-3">Available Loans</h3>
            <div className="space-y-2">
              {borrowOffers.map((offer) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40 tap-shrink cursor-pointer hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CoinIcon type="wage" size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-display font-semibold">{offer.amount.toLocaleString()} $WAGE</p>
                      <p className="text-[10px] text-muted-foreground font-body">{offer.term} · {offer.collateralRatio}% collateral</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-primary">{offer.apr}%</p>
                    <p className="text-[10px] text-muted-foreground font-body">APR</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quick Lend */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-5 bg-card border border-border/40"
          >
            <h3 className="text-sm font-display font-semibold mb-3">Lend $WAGE</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground font-body uppercase">Amount ($WAGE)</label>
                <input
                  type="number"
                  value={lendAmount}
                  onChange={(e) => setLendAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-1 px-3 py-2.5 rounded-lg bg-secondary border border-border/40 text-foreground text-sm font-body focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="text-[10px] text-muted-foreground font-body mt-1">Balance: {wageBalance.toLocaleString()} $WAGE</p>
              </div>
              <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium tap-shrink">
                Deposit to Pool
              </button>
            </div>
          </motion.div>

          {/* Lending Pools */}
          <div>
            <h3 className="text-sm font-display font-semibold mb-3">Lending Pools</h3>
            <div className="space-y-2">
              {lendingPools.map((pool) => (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-card border border-border/40 tap-shrink cursor-pointer hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-primary" />
                      <p className="text-sm font-display font-semibold">{pool.name}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${
                      pool.risk === "Low" ? "bg-green-500/10 text-green-500" :
                      pool.risk === "Medium" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>{pool.risk}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-body">APR</p>
                      <p className="text-sm font-display font-bold text-primary">{pool.apr}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-body">TVL</p>
                      <p className="text-sm font-display font-semibold">${(pool.tvl / 1000000).toFixed(2)}M</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-body">Utilization</p>
                      <p className="text-sm font-display font-semibold">{pool.utilization}%</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <div>
          <h3 className="text-sm font-display font-semibold mb-3">Active Positions</h3>
          <div className="space-y-2">
            {activeLoans.map((loan) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/40"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    loan.type === "borrowed" ? "bg-red-500/10" : "bg-green-500/10"
                  }`}>
                    {loan.type === "borrowed" ? <ArrowDownLeft size={14} className="text-red-500" /> : <ArrowUpRight size={14} className="text-green-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-display font-semibold">
                      {loan.type === "borrowed" ? "Borrowed" : "Lent"} {loan.amount.toLocaleString()} $WAGE
                    </p>
                    <p className="text-[10px] text-muted-foreground font-body">
                      <Clock size={10} className="inline mr-1" />
                      Next: {loan.nextPayment} · {loan.apr}% APR
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-display font-bold">{loan.remaining.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground font-body">remaining</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditPage;
