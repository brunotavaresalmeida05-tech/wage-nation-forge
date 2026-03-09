import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Pickaxe, Users, Flame, Landmark, Mail, IdCard, Fingerprint, Check, Lock } from "lucide-react";

const UBI_TYPES = [
  { id: "base", label: "Base UBI", amount: 50, frequency: "/mo", icon: Globe, desc: "Proof of humanity required", unlocked: true },
  { id: "work", label: "Work UBI", amount: 60, frequency: "/mo", icon: Pickaxe, desc: "Complete 15+ tasks/week", unlocked: true },
  { id: "contribution", label: "Contribution UBI", amount: 50, frequency: "/mo", icon: Users, desc: "Active referrals + governance", unlocked: false },
  { id: "streak", label: "Streak UBI", amount: 30, frequency: "/mo", icon: Flame, desc: "30+ consecutive day streak", unlocked: false },
];

const VERIFICATION_PHASES = [
  { phase: 1, label: "Email & Phone", status: "completed" as const, icon: Mail },
  { phase: 2, label: "ID Document", status: "current" as const, icon: IdCard },
  { phase: 3, label: "WageID Biometrics", status: "locked" as const, icon: Fingerprint },
];

const UBI_HISTORY = [
  { date: "2026-03-01", type: "Base UBI", amount: 50, status: "claimed" },
  { date: "2026-03-01", type: "Work UBI", amount: 60, status: "claimed" },
  { date: "2026-02-01", type: "Base UBI", amount: 50, status: "claimed" },
  { date: "2026-02-01", type: "Work UBI", amount: 45, status: "claimed" },
];

const UBIPage = () => {
  const [claimed, setClaimed] = useState(false);
  const totalUBI = 110;
  const maxUBI = 190;
  const nextClaim = "23h 14m";
  const lifetimeUBI = 340;
  const fundRemaining = 97_200_000;

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        <h1 className="font-display font-bold text-xl">Universal Basic Income</h1>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-clean p-6 text-center border-primary/20"
        >
          <p className="text-[11px] text-muted-foreground font-body mb-1">Your monthly income</p>
          <p className="text-4xl font-display font-bold text-primary">{totalUBI} $W</p>
          <p className="text-xs text-muted-foreground font-body mt-1">of {maxUBI} $W possible</p>

          <div className="flex items-center gap-2 mt-4 px-4">
            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(totalUBI / maxUBI) * 100}%` }} />
            </div>
            <span className="text-[11px] text-muted-foreground font-body">{Math.round((totalUBI / maxUBI) * 100)}%</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setClaimed(true)}
            disabled={claimed}
            className={`mt-5 px-8 py-3 rounded-lg font-display font-semibold text-sm tap-shrink ${
              claimed ? "bg-secondary text-muted-foreground" : "bg-primary text-primary-foreground"
            }`}
          >
            {claimed ? `Next claim: ${nextClaim}` : "Claim Daily UBI"}
          </motion.button>
        </motion.div>

        {/* Fund Transparency */}
        <div className="card-clean p-4">
          <div className="flex items-center gap-2 mb-3">
            <Landmark size={16} className="text-primary" />
            <h3 className="font-display font-semibold text-sm">UBI Fund</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Reserve</p>
              <p className="text-xs font-display font-bold">100M $W</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Remaining</p>
              <p className="text-xs font-display font-bold text-primary">{(fundRemaining / 1e6).toFixed(1)}M $W</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Duration</p>
              <p className="text-xs font-display font-bold">~18 years</p>
            </div>
          </div>
        </div>

        {/* UBI Breakdown */}
        <section>
          <h2 className="font-display font-semibold text-[15px] mb-3">UBI Sources</h2>
          <div className="space-y-2.5">
            {UBI_TYPES.map((ubi, i) => {
              const Icon = ubi.unlocked ? ubi.icon : Lock;
              return (
                <motion.div
                  key={ubi.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`card-clean p-4 ${!ubi.unlocked ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className={ubi.unlocked ? "text-primary" : "text-muted-foreground"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-sm">{ubi.label}</h3>
                      <p className="text-[11px] text-muted-foreground font-body">{ubi.desc}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-lg font-display font-bold ${ubi.unlocked ? "text-primary" : "text-muted-foreground"}`}>
                        {ubi.amount}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-body">$W{ubi.frequency}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Verification */}
        <section>
          <h2 className="font-display font-semibold text-[15px] mb-3">Proof of Humanity</h2>
          <div className="card-clean p-4 space-y-3">
            {VERIFICATION_PHASES.map((phase) => {
              const Icon = phase.icon;
              return (
                <div key={phase.phase} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    phase.status === "completed" ? "bg-primary text-primary-foreground" :
                    phase.status === "current" ? "bg-primary/10 border border-primary/30" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {phase.status === "completed" ? <Check size={16} /> : <Icon size={16} className={phase.status === "current" ? "text-primary" : ""} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-display font-semibold">{phase.label}</p>
                    <p className="text-[11px] text-muted-foreground font-body">Phase {phase.phase}</p>
                  </div>
                  <span className={`text-[10px] font-body font-medium px-2 py-0.5 rounded-md whitespace-nowrap ${
                    phase.status === "completed" ? "bg-primary/10 text-primary" :
                    phase.status === "current" ? "bg-primary/10 text-primary" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {phase.status === "completed" ? "Done" : phase.status === "current" ? "In progress" : "Locked"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* History */}
        <section>
          <h2 className="font-display font-semibold text-[15px] mb-3">History</h2>
          <div className="space-y-1.5">
            {UBI_HISTORY.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 px-3.5 card-clean">
                <div>
                  <p className="text-xs font-display font-semibold">{h.type}</p>
                  <p className="text-[11px] text-muted-foreground font-body">{h.date}</p>
                </div>
                <p className="text-sm font-display font-bold text-primary">+{h.amount} $W</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground font-body text-center mt-3">
            Lifetime received: {lifetimeUBI} $W
          </p>
        </section>
      </div>
    </div>
  );
};

export default UBIPage;
