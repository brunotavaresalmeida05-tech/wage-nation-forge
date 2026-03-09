import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Unlock, Flame, Landmark, Crown, Gem } from "lucide-react";

const VAULT_TIERS = [
  { id: "flex", label: "Flexible", duration: "No lock", apy: 5, minAmount: 10, icon: Unlock, popular: false },
  { id: "30d", label: "30 Days", duration: "30 days", apy: 15, minAmount: 50, icon: Lock, popular: false },
  { id: "90d", label: "90 Days", duration: "90 days", apy: 35, minAmount: 100, icon: Landmark, popular: true },
  { id: "180d", label: "6 Months", duration: "180 days", apy: 60, minAmount: 250, icon: Gem, popular: false },
  { id: "365d", label: "1 Year", duration: "365 days", apy: 100, minAmount: 500, icon: Landmark, popular: false },
  { id: "1825d", label: "5 Years", duration: "5 years", apy: 200, minAmount: 1000, icon: Crown, popular: false },
];

const MY_VAULTS = [
  { tier: "90 Days", amount: 500, apy: 35, earned: 12.4, startDate: "2025-12-15", endDate: "2026-03-15", progress: 80 },
  { tier: "30 Days", amount: 200, apy: 15, earned: 1.8, startDate: "2026-02-20", endDate: "2026-03-22", progress: 65 },
];

const VaultPage = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const wageBalance = 42.5;
  const totalStaked = 700;
  const totalEarned = 14.2;

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        <h1 className="font-display font-bold text-xl">Sovereign Vault</h1>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: "Total Staked", value: `${totalStaked} $W` },
            { label: "Earned", value: `+${totalEarned} $W`, highlight: true },
            { label: "Available", value: `${wageBalance} $W` },
          ].map((s) => (
            <div key={s.label} className="card-clean p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{s.label}</p>
              <p className={`text-sm font-display font-bold mt-0.5 ${s.highlight ? "text-primary" : ""}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Supply Burn Info */}
        <div className="card-clean p-4 border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={16} className="text-destructive" />
            <h3 className="font-display font-semibold text-sm">Programmed Scarcity</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Total Supply</p>
              <p className="text-xs font-display font-bold">1,000,000,000 $W</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Burned</p>
              <p className="text-xs font-display font-bold text-destructive">-24,350,000 $W</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-body">In Vault</p>
              <p className="text-xs font-display font-bold text-primary">312,000,000 $W</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Next Halving</p>
              <p className="text-xs font-display font-bold">42 days</p>
            </div>
          </div>
        </div>

        {/* Vault Tiers */}
        <section>
          <h2 className="font-display font-semibold text-[15px] mb-3">Choose a Vault</h2>
          <div className="space-y-2.5">
            {VAULT_TIERS.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedTier(selectedTier === tier.id ? null : tier.id)}
                  className={`card-clean p-4 cursor-pointer tap-shrink transition-all ${
                    selectedTier === tier.id ? "border-primary/40 ring-1 ring-primary/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-sm">{tier.label}</h3>
                        {tier.popular && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-body font-semibold">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground font-body">
                        Lock: {tier.duration} • Min: {tier.minAmount} $W
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-display font-bold text-primary">{tier.apy}%</p>
                      <p className="text-[10px] text-muted-foreground font-body">APY</p>
                    </div>
                  </div>

                  {selectedTier === tier.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 pt-4 border-t border-border space-y-3"
                    >
                      <div>
                        <label className="text-[11px] text-muted-foreground font-body block mb-1.5">
                          Amount to deposit ($WAGE)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            placeholder={`Min ${tier.minAmount}`}
                            className="flex-1 bg-secondary rounded-lg px-3 py-2.5 text-sm font-display font-bold outline-none placeholder:text-muted-foreground min-w-0"
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); setStakeAmount(wageBalance.toString()); }}
                            className="text-[11px] text-primary font-body font-semibold px-3 py-2 rounded-lg bg-primary/10 tap-shrink"
                          >
                            MAX
                          </button>
                        </div>
                      </div>
                      {parseFloat(stakeAmount) > 0 && (
                        <div className="rounded-lg bg-secondary p-3 space-y-1.5">
                          <div className="flex justify-between text-[11px] font-body">
                            <span className="text-muted-foreground">Estimated yield</span>
                            <span className="text-primary font-semibold">
                              +{((parseFloat(stakeAmount) * tier.apy) / 100).toFixed(2)} $W/yr
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] font-body">
                            <span className="text-muted-foreground">Per day</span>
                            <span className="font-semibold">
                              +{((parseFloat(stakeAmount) * tier.apy) / 100 / 365).toFixed(4)} $W
                            </span>
                          </div>
                        </div>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        disabled={!stakeAmount || parseFloat(stakeAmount) < tier.minAmount || parseFloat(stakeAmount) > wageBalance}
                        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm disabled:opacity-30 tap-shrink"
                      >
                        Deposit to Vault
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* My Active Vaults */}
        <section>
          <h2 className="font-display font-semibold text-[15px] mb-3">My Active Vaults</h2>
          <div className="space-y-2.5">
            {MY_VAULTS.map((v, i) => (
              <div key={i} className="card-clean p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <p className="text-xs font-display font-semibold">{v.tier}</p>
                    <p className="text-[11px] text-muted-foreground font-body">{v.startDate} → {v.endDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold">{v.amount} $W</p>
                    <p className="text-[11px] text-primary font-body font-semibold">+{v.earned} $W</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${v.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-body">{v.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* APY Comparison */}
        <div className="card-clean p-4">
          <h3 className="font-display font-semibold text-sm mb-3">Yield Comparison</h3>
          <div className="space-y-2.5">
            {VAULT_TIERS.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <span className="text-[11px] w-16 font-body text-muted-foreground">{t.label}</span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(t.apy / 200) * 100}%` }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
                <span className="text-xs font-display font-bold text-primary w-12 text-right">{t.apy}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultPage;
