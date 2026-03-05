import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UBI_TYPES = [
  { id: "base", label: "UBI Base", amount: 50, frequency: "/mês", icon: "🌍", desc: "Verificação de humanidade necessária", unlocked: true },
  { id: "work", label: "UBI de Trabalho", amount: 60, frequency: "/mês", icon: "⛏️", desc: "Completa 15+ tarefas/semana", unlocked: true },
  { id: "contribution", label: "UBI de Contribuição", amount: 50, frequency: "/mês", icon: "🤝", desc: "Referidos ativos + governança", unlocked: false },
  { id: "streak", label: "UBI de Streak", amount: 30, frequency: "/mês", icon: "🔥", desc: "Streak de 30+ dias consecutivos", unlocked: false },
];

const VERIFICATION_PHASES = [
  { phase: 1, label: "Email & Telefone", status: "completed" as const, icon: "📧" },
  { phase: 2, label: "Documento de Identidade", status: "current" as const, icon: "🪪" },
  { phase: 3, label: "Biometria WageID", status: "locked" as const, icon: "🧬" },
];

const UBI_HISTORY = [
  { date: "2026-03-01", type: "UBI Base", amount: 50, status: "claimed" },
  { date: "2026-03-01", type: "UBI Trabalho", amount: 60, status: "claimed" },
  { date: "2026-02-01", type: "UBI Base", amount: 50, status: "claimed" },
  { date: "2026-02-01", type: "UBI Trabalho", amount: 45, status: "claimed" },
];

const UBIPage = () => {
  const navigate = useNavigate();
  const [claimed, setClaimed] = useState(false);
  const totalUBI = 110;
  const maxUBI = 190;
  const nextClaim = "23h 14m";
  const lifetimeUBI = 340;
  const fundRemaining = 97_200_000;

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto flex items-center px-4 h-14">
          <button onClick={() => navigate(-1)} className="mr-3 text-lg tap-shrink">←</button>
          <h1 className="font-display font-bold text-lg">🌍 Renda Base Universal</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 text-center"
        >
          <p className="text-[10px] text-muted-foreground font-body mb-1">A tua renda mensal</p>
          <p className="text-4xl font-display font-bold text-primary">{totalUBI} $W</p>
          <p className="text-xs text-muted-foreground font-body mt-1">de {maxUBI} $W possíveis</p>
          
          <div className="flex items-center gap-2 mt-3 px-4">
            <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(totalUBI / maxUBI) * 100}%` }} />
            </div>
            <span className="text-[10px] text-muted-foreground font-body">{Math.round((totalUBI / maxUBI) * 100)}%</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setClaimed(true)}
            disabled={claimed}
            className={`mt-4 px-8 py-3 rounded-xl font-display font-semibold text-sm tap-shrink ${
              claimed
                ? "bg-secondary text-muted-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {claimed ? `Próximo claim: ${nextClaim}` : "Recolher UBI Diário"}
          </motion.button>
        </motion.div>

        {/* Fund Transparency */}
        <div className="rounded-xl border border-border bg-gradient-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <span>🏦</span>
            <h3 className="font-display font-semibold text-sm">Fundo UBI</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Reserva</p>
              <p className="text-xs font-display font-bold">100M $W</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Restante</p>
              <p className="text-xs font-display font-bold text-primary">{(fundRemaining / 1e6).toFixed(1)}M $W</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-body">Duração</p>
              <p className="text-xs font-display font-bold">~18 anos</p>
            </div>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(fundRemaining / 100_000_000) * 100}%` }} />
          </div>
        </div>

        {/* UBI Breakdown */}
        <section>
          <h2 className="font-display font-semibold text-base mb-3">Fontes de UBI</h2>
          <div className="space-y-2">
            {UBI_TYPES.map((ubi, i) => (
              <motion.div
                key={ubi.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border p-4 ${
                  ubi.unlocked ? "border-primary/20 bg-primary/5" : "border-border bg-gradient-card opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
                    {ubi.unlocked ? ubi.icon : "🔒"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-sm">{ubi.label}</h3>
                    <p className="text-[10px] text-muted-foreground font-body">{ubi.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-display font-bold ${ubi.unlocked ? "text-primary" : "text-muted-foreground"}`}>
                      {ubi.amount}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-body">$W{ubi.frequency}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Humanity Verification */}
        <section>
          <h2 className="font-display font-semibold text-base mb-3">Verificação de Humanidade</h2>
          <div className="rounded-xl border border-border bg-gradient-card p-4 space-y-3">
            {VERIFICATION_PHASES.map((phase) => (
              <div key={phase.phase} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  phase.status === "completed" ? "bg-primary text-primary-foreground" :
                  phase.status === "current" ? "bg-primary/20 border-2 border-primary" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {phase.status === "completed" ? "✓" : phase.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-display font-semibold">{phase.label}</p>
                  <p className="text-[10px] text-muted-foreground font-body">Fase {phase.phase}</p>
                </div>
                <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${
                  phase.status === "completed" ? "bg-primary/10 text-primary" :
                  phase.status === "current" ? "bg-primary/10 text-primary" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {phase.status === "completed" ? "Concluído" : phase.status === "current" ? "Em progresso" : "Bloqueado"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section>
          <h2 className="font-display font-semibold text-base mb-3">Histórico</h2>
          <div className="space-y-1">
            {UBI_HISTORY.map((h, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gradient-card border border-border">
                <div>
                  <p className="text-xs font-display font-semibold">{h.type}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{h.date}</p>
                </div>
                <p className="text-sm font-display font-bold text-primary">+{h.amount} $W</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground font-body text-center mt-2">
            Total recebido: {lifetimeUBI} $W ao longo de toda a vida
          </p>
        </section>
      </div>
    </div>
  );
};

export default UBIPage;
