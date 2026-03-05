import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const VAULT_TIERS = [
  { id: "flex", label: "Flexível", duration: "Sem lock", apy: 5, minAmount: 10, icon: "🔓", popular: false },
  { id: "30d", label: "30 Dias", duration: "30 dias", apy: 15, minAmount: 50, icon: "🔒", popular: false },
  { id: "90d", label: "90 Dias", duration: "90 dias", apy: 35, minAmount: 100, icon: "🏦", popular: true },
  { id: "180d", label: "6 Meses", duration: "180 dias", apy: 60, minAmount: 250, icon: "💎", popular: false },
  { id: "365d", label: "1 Ano", duration: "365 dias", apy: 100, minAmount: 500, icon: "🏛️", popular: false },
  { id: "1825d", label: "5 Anos", duration: "5 anos", apy: 200, minAmount: 1000, icon: "👑", popular: false },
];

const MY_VAULTS = [
  { tier: "90 Dias", amount: 500, apy: 35, earned: 12.4, startDate: "2025-12-15", endDate: "2026-03-15", progress: 80 },
  { tier: "30 Dias", amount: 200, apy: 15, earned: 1.8, startDate: "2026-02-20", endDate: "2026-03-22", progress: 65 },
];

const VaultPage = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const wageBalance = 42.5;
  const totalStaked = 700;
  const totalEarned = 14.2;

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto flex items-center px-4 h-14">
          <button onClick={() => navigate(-1)} className="mr-3 text-lg tap-shrink">←</button>
          <h1 className="font-display font-bold text-lg">🏛️ Vault Soberano</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Total Staked", value: `${totalStaked} $W` },
            { label: "Rendido", value: `+${totalEarned} $W`, highlight: true },
            { label: "Disponível", value: `${wageBalance} $W` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-gradient-card border border-border p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-body">{s.label}</p>
              <p className={`text-sm font-display font-bold mt-0.5 ${s.highlight ? "text-primary" : ""}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Supply Burn Info */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔥</span>
            <h3 className="font-display font-semibold text-sm">Escassez Programada</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Supply Total</p>
              <p className="text-xs font-display font-bold">1,000,000,000 $W</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Queimados</p>
              <p className="text-xs font-display font-bold text-destructive">-24,350,000 $W</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Em Vault</p>
              <p className="text-xs font-display font-bold text-primary">312,000,000 $W</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Próximo Halving</p>
              <p className="text-xs font-display font-bold">42 dias</p>
            </div>
          </div>
        </div>

        {/* Vault Tiers */}
        <section>
          <h2 className="font-display font-semibold text-base mb-3">Escolhe um Vault</h2>
          <div className="space-y-2">
            {VAULT_TIERS.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedTier(selectedTier === tier.id ? null : tier.id)}
                className={`rounded-xl border-2 p-4 cursor-pointer tap-shrink transition-all ${
                  selectedTier === tier.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-gradient-card"
                } ${tier.popular ? "ring-1 ring-primary/30" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
                    {tier.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-sm">{tier.label}</h3>
                      {tier.popular && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-body font-semibold">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-body">
                      Lock: {tier.duration} • Mín: {tier.minAmount} $W
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display font-bold text-primary">{tier.apy}%</p>
                    <p className="text-[9px] text-muted-foreground font-body">APY</p>
                  </div>
                </div>

                {selectedTier === tier.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-border space-y-3"
                  >
                    <div>
                      <label className="text-[10px] text-muted-foreground font-body block mb-1">
                        Quantidade a depositar ($WAGE)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          placeholder={`Min ${tier.minAmount}`}
                          className="flex-1 bg-secondary rounded-lg px-3 py-2.5 text-sm font-display font-bold outline-none placeholder:text-muted-foreground"
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); setStakeAmount(wageBalance.toString()); }}
                          className="text-[10px] text-primary font-body font-semibold px-2 py-1 rounded bg-primary/10 tap-shrink"
                        >
                          MAX
                        </button>
                      </div>
                    </div>
                    {parseFloat(stakeAmount) > 0 && (
                      <div className="rounded-lg bg-secondary p-3 space-y-1">
                        <div className="flex justify-between text-[10px] font-body">
                          <span className="text-muted-foreground">Rendimento estimado</span>
                          <span className="text-primary font-semibold">
                            +{((parseFloat(stakeAmount) * tier.apy) / 100).toFixed(2)} $W/ano
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px] font-body">
                          <span className="text-muted-foreground">Por dia</span>
                          <span className="font-semibold">
                            +{((parseFloat(stakeAmount) * tier.apy) / 100 / 365).toFixed(4)} $W
                          </span>
                        </div>
                      </div>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      disabled={!stakeAmount || parseFloat(stakeAmount) < tier.minAmount || parseFloat(stakeAmount) > wageBalance}
                      className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm disabled:opacity-40 tap-shrink"
                    >
                      Depositar no Vault
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* My Active Vaults */}
        <section>
          <h2 className="font-display font-semibold text-base mb-3">Meus Vaults Ativos</h2>
          <div className="space-y-2">
            {MY_VAULTS.map((v, i) => (
              <div key={i} className="rounded-xl border border-border bg-gradient-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs font-display font-semibold">{v.tier}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{v.startDate} → {v.endDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold">{v.amount} $W</p>
                    <p className="text-[10px] text-primary font-body font-semibold">+{v.earned} $W</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${v.progress}%` }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground font-body">{v.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* APY Comparison */}
        <div className="rounded-xl border border-border bg-gradient-card p-4">
          <h3 className="font-display font-semibold text-sm mb-3">Comparação de Rendimento</h3>
          <div className="space-y-2">
            {VAULT_TIERS.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <span className="text-xs w-16 font-body text-muted-foreground">{t.label}</span>
                <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
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
