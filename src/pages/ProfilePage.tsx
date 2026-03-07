import { motion } from "framer-motion";
import { Settings, Award, Shield, Pickaxe, Wallet, PieChart, Flame, Check, Star } from "lucide-react";

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
  { icon: Pickaxe, name: "Primeiro Mine", earned: true },
  { icon: Flame, name: "Trader", earned: true },
  { icon: Award, name: "Proprietário", earned: true },
  { icon: Wallet, name: "Rentista", earned: true },
  { icon: Flame, name: "Streak 7d", earned: false },
  { icon: Star, name: "Diamond Hands", earned: false },
  { icon: Shield, name: "Auditor", earned: false },
  { icon: Award, name: "Magnata", earned: false },
  { icon: Star, name: "Whale", earned: false },
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
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-lg mx-auto flex items-center justify-between px-5 h-14">
          <h1 className="font-display font-bold text-base">Perfil</h1>
          <button className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center tap-shrink">
            <Settings size={16} className="text-muted-foreground" />
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-5">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-clean p-5 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-foreground mx-auto flex items-center justify-center mb-3">
            <span className="text-background font-display font-bold text-xl">W</span>
          </div>
          <h2 className="font-display font-bold text-lg">{profile.name}</h2>
          <p className="text-xs text-primary font-body font-medium">{profile.role} • Nível {profile.level}</p>
          <p className="text-[11px] text-muted-foreground font-body mt-0.5">Rank #{profile.rank} global</p>

          <div className="mt-4 mx-auto max-w-xs">
            <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5 font-body">
              <span>XP {profile.xp.toLocaleString()}</span>
              <span>{profile.xpNext.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </motion.div>

        {/* WageID & Reputation */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="card-clean p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield size={14} className="text-primary" />
              <p className="text-[11px] text-muted-foreground font-body">WageID</p>
            </div>
            <p className="text-sm font-display font-bold text-primary">{profile.wageIdTier}</p>
            <p className="text-[10px] text-muted-foreground font-body">50 $WAGE/ano</p>
          </div>
          <div className="card-clean p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={14} className="text-gold" />
              <p className="text-[11px] text-muted-foreground font-body">Reputação</p>
            </div>
            <p className="text-sm font-display font-bold">{profile.reputationScore}/1000</p>
            <p className="text-[10px] text-muted-foreground font-body">{profile.reputationTier} — Crédito: 500 $W</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Total $MINE", value: profile.totalMined.toLocaleString(), icon: Pickaxe },
            { label: "Total $WAGE", value: profile.totalWage.toFixed(2), icon: Wallet },
            { label: "Portfolio", value: `${profile.portfolioValue.toLocaleString()} $W`, icon: PieChart },
            { label: "Streak", value: `${profile.streak} dias`, icon: Flame },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card-clean p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={14} className="text-muted-foreground" />
                  <p className="text-[11px] text-muted-foreground font-body">{stat.label}</p>
                </div>
                <p className="font-display font-bold text-sm">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Streak Rewards */}
        <section>
          <h2 className="font-display font-semibold text-[15px] mb-3">Recompensas de Streak</h2>
          <div className="space-y-2">
            {streakRewards.map((sr) => (
              <div
                key={sr.days}
                className={`flex items-center gap-3 card-clean p-3.5 ${
                  sr.reached ? "border-primary/20" : ""
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-display font-bold ${
                  sr.reached ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {sr.days}d
                </div>
                <div className="flex-1">
                  <p className="text-xs font-display font-semibold">{sr.title}</p>
                  <p className="text-[11px] text-muted-foreground font-body">{sr.bonus}</p>
                </div>
                {sr.reached && <Check size={16} className="text-primary" />}
              </div>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="font-display font-semibold text-[15px] mb-3">Badges</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.name}
                  className={`card-clean p-3 text-center ${!badge.earned ? "opacity-30" : ""}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-secondary mx-auto flex items-center justify-center mb-1.5">
                    <Icon size={18} className={badge.earned ? "text-primary" : "text-muted-foreground"} />
                  </div>
                  <p className="text-[10px] font-body text-muted-foreground">{badge.name}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Actions */}
        <div className="space-y-2.5">
          <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
            Levantar $WAGE
          </button>
          <button className="w-full py-3 rounded-xl bg-foreground text-background font-display font-semibold text-sm tap-shrink">
            Verificar Identidade (KYC)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
