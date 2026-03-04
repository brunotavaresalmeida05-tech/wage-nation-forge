import { motion } from "framer-motion";

const profile = {
  name: "Worker #4821",
  role: "Analista de Mercado",
  level: 3,
  xp: 2400,
  xpNext: 5000,
  streak: 4,
  totalMined: 84300,
  totalWage: 42.5,
  reputationScore: 285,
  reputationTier: "Trabalhador",
  wageIdTier: "Cidadão Ativo",
  rank: 1247,
  portfolioValue: 4830,
};

const badges = [
  { icon: "⛏️", name: "Primeiro Mine", earned: true },
  { icon: "📈", name: "Trader", earned: true },
  { icon: "🏠", name: "Proprietário", earned: true },
  { icon: "💰", name: "Rentista", earned: true },
  { icon: "🔥", name: "Streak 7d", earned: false },
  { icon: "💎", name: "Diamond Hands", earned: false },
  { icon: "🏛️", name: "Auditor", earned: false },
  { icon: "👑", name: "Magnata", earned: false },
  { icon: "🐋", name: "Whale", earned: false },
];

const streakRewards = [
  { days: 3, bonus: "+10% $MINE/tap", title: "Trabalhador Dedicado", reached: true },
  { days: 7, bonus: "+20% $MINE + 500 $MINE", title: "Operário da Semana", reached: false },
  { days: 14, bonus: "+35% $MINE + 1.000 $MINE", title: "Veterano Quinzenal", reached: false },
  { days: 30, bonus: "+50% $MINE + 1 $WAGE", title: "Empregado do Mês", reached: false },
  { days: 100, bonus: "+100% $MINE + 20 $WAGE", title: "CEO da Rua", reached: false },
];

const xpPercent = (profile.xp / profile.xpNext) * 100;

const ProfilePage = () => {
  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <h1 className="font-display font-bold text-lg">👤 Perfil</h1>
          <button className="text-xs text-muted-foreground font-body tap-shrink">⚙️ Definições</button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-5 bg-gradient-card border border-border text-center"
        >
          <div className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center text-3xl mb-3 border-2 border-primary/30">
            👷
          </div>
          <h2 className="font-display font-bold text-lg">{profile.name}</h2>
          <p className="text-xs text-primary font-body">{profile.role} • Nível {profile.level}</p>
          <p className="text-[10px] text-muted-foreground font-body mt-1">Rank #{profile.rank} global</p>

          {/* XP Bar */}
          <div className="mt-4 mx-auto max-w-xs">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-body">
              <span>XP {profile.xp.toLocaleString()}</span>
              <span>{profile.xpNext.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: "var(--gradient-gold)" }} animate={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </motion.div>

        {/* WageID & Reputation */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4 bg-gradient-card border border-border">
            <p className="text-[10px] text-muted-foreground font-body mb-1">🪪 WageID</p>
            <p className="text-sm font-display font-bold text-primary">{profile.wageIdTier}</p>
            <p className="text-[9px] text-muted-foreground font-body">50 $WAGE/ano</p>
          </div>
          <div className="rounded-xl p-4 bg-gradient-card border border-border">
            <p className="text-[10px] text-muted-foreground font-body mb-1">⭐ Reputação</p>
            <p className="text-sm font-display font-bold">{profile.reputationScore}/1000</p>
            <p className="text-[9px] text-muted-foreground font-body">{profile.reputationTier} — Crédito: 500 $W</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total $MINE", value: profile.totalMined.toLocaleString(), icon: "⛏️" },
            { label: "Total $WAGE", value: profile.totalWage.toFixed(2), icon: "💰" },
            { label: "Portfolio", value: `${profile.portfolioValue.toLocaleString()} $W`, icon: "📊" },
            { label: "Streak", value: `${profile.streak} dias`, icon: "🔥" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-3 bg-gradient-card border border-border">
              <div className="flex items-center gap-2 mb-1">
                <span>{stat.icon}</span>
                <p className="text-[10px] text-muted-foreground font-body">{stat.label}</p>
              </div>
              <p className="font-display font-bold text-sm">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Streak Rewards */}
        <section>
          <h2 className="font-display font-semibold text-base mb-3">🔥 Recompensas de Streak</h2>
          <div className="space-y-2">
            {streakRewards.map((sr) => (
              <div
                key={sr.days}
                className={`flex items-center gap-3 rounded-xl p-3 border ${
                  sr.reached ? "border-primary/30 bg-primary/5" : "border-border bg-gradient-card"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-display font-bold ${
                  sr.reached ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {sr.days}d
                </div>
                <div className="flex-1">
                  <p className="text-xs font-display font-semibold">{sr.title}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{sr.bonus}</p>
                </div>
                {sr.reached && <span className="text-primary text-sm">✓</span>}
              </div>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="font-display font-semibold text-base mb-3">🏆 Badges</h2>
          <div className="grid grid-cols-3 gap-2">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`rounded-xl p-3 text-center border border-border ${
                  badge.earned ? "bg-gradient-card" : "bg-secondary/30 opacity-40"
                }`}
              >
                <span className="text-2xl block mb-1">{badge.icon}</span>
                <p className="text-[10px] font-body text-muted-foreground">{badge.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="space-y-2">
          <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
            🏦 Levantar $WAGE
          </button>
          <button className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-display font-semibold text-sm tap-shrink">
            🪪 Verificar Identidade (KYC)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
