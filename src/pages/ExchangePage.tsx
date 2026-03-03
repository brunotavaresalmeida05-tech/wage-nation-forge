import { useState } from "react";
import { motion } from "framer-motion";

const ExchangePage = () => {
  const [mineAmount, setMineAmount] = useState("");
  const rate = 1000; // 1000 MINE = 1 WAGE
  const fee = 0.05; // 5%
  const mineBalance = 1250;

  const mineNum = parseFloat(mineAmount) || 0;
  const wageOut = (mineNum / rate) * (1 - fee);
  const feeAmount = (mineNum / rate) * fee;

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto flex items-center px-4 h-14">
          <h1 className="font-display font-bold text-lg">🔄 Exchange</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, hsl(145 80% 50% / 0.08), transparent 60%)" }} />

        {/* Rate Info */}
        <div className="rounded-lg p-4 bg-gradient-card border border-border/50 text-center">
          <p className="text-xs text-muted-foreground font-body mb-1">Current Exchange Rate</p>
          <p className="text-2xl font-display font-bold">
            <span className="text-gradient-mine">1,000 $MINE</span>
            <span className="text-muted-foreground mx-2">=</span>
            <span className="text-gradient-primary">1 $WAGE</span>
          </p>
          <p className="text-xs text-muted-foreground font-body mt-2">Platform fee: 5% • Goes to WageCompany Treasury</p>
        </div>

        {/* Exchange Form */}
        <div className="rounded-lg p-5 bg-gradient-card border border-border/50 space-y-4">
          {/* From */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground font-body">You send</label>
              <span className="text-[10px] text-muted-foreground font-body">Balance: {mineBalance.toLocaleString()} $MINE</span>
            </div>
            <div className="flex items-center gap-3 rounded-md bg-secondary p-3">
              <span className="text-lg">⛏️</span>
              <input
                type="number"
                value={mineAmount}
                onChange={(e) => setMineAmount(e.target.value)}
                placeholder="0"
                className="flex-1 bg-transparent outline-none font-display font-bold text-xl placeholder:text-muted-foreground"
              />
              <span className="text-xs text-muted-foreground font-body">$MINE</span>
            </div>
            <button
              onClick={() => setMineAmount(mineBalance.toString())}
              className="text-[10px] text-primary font-body mt-1 tap-shrink"
            >
              Use max
            </button>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">↓</div>
          </div>

          {/* To */}
          <div>
            <label className="text-xs text-muted-foreground font-body mb-2 block">You receive</label>
            <div className="flex items-center gap-3 rounded-md bg-secondary p-3">
              <span className="text-lg">💰</span>
              <span className="flex-1 font-display font-bold text-xl text-gradient-primary">
                {wageOut.toFixed(4)}
              </span>
              <span className="text-xs text-muted-foreground font-body">$WAGE</span>
            </div>
          </div>

          {/* Fee breakdown */}
          <div className="space-y-1 pt-2 border-t border-border/50">
            <div className="flex justify-between text-xs font-body text-muted-foreground">
              <span>Platform Fee (5%)</span>
              <span>{feeAmount.toFixed(4)} $WAGE</span>
            </div>
            <div className="flex justify-between text-xs font-body text-muted-foreground">
              <span>Treasury Burn (1%)</span>
              <span>{((mineNum / rate) * 0.01).toFixed(4)} $WAGE</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={mineNum <= 0 || mineNum > mineBalance}
            className="w-full py-3 rounded-lg font-display font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed tap-shrink bg-primary text-primary-foreground"
          >
            Convert to $WAGE
          </motion.button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "🏦", title: "Treasury", desc: "Fee goes to sustain the WageCompany ecosystem", value: "5%" },
            { icon: "🔥", title: "Burn", desc: "Token burn creates scarcity and value", value: "1%" },
          ].map((item) => (
            <div key={item.title} className="rounded-lg p-3 bg-gradient-card border border-border/50">
              <span className="text-xl">{item.icon}</span>
              <h3 className="text-xs font-display font-semibold mt-1">{item.title}</h3>
              <p className="text-[10px] text-muted-foreground font-body mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExchangePage;
