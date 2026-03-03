import { motion } from "framer-motion";

const ProfilePage = () => {
  const profile = {
    name: "Worker #4821",
    role: "Market Analyst",
    level: 3,
    xp: 2400,
    xpNext: 5000,
    streak: 4,
    totalMined: 84300,
    totalWage: 42.5,
    joined: "2025-12-01",
    rank: 1247,
  };

  const badges = [
    { icon: "⛏️", name: "First Mine", earned: true },
    { icon: "📈", name: "Trader", earned: true },
    { icon: "🔥", name: "7-Day Streak", earned: false },
    { icon: "💎", name: "Diamond Hands", earned: false },
    { icon: "🏛️", name: "Auditor", earned: false },
    { icon: "👑", name: "Magnate", earned: false },
  ];

  const xpPercent = (profile.xp / profile.xpNext) * 100;

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-14">
          <h1 className="font-display font-bold text-lg">👤 Profile</h1>
          <button className="text-xs text-muted-foreground font-body tap-shrink">⚙️ Settings</button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-5 bg-gradient-card border border-border/50 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-secondary mx-auto flex items-center justify-center text-3xl mb-3 border-2 border-primary/30">
            👷
          </div>
          <h2 className="font-display font-bold text-lg">{profile.name}</h2>
          <p className="text-xs text-primary font-body">{profile.role} • Level {profile.level}</p>
          <p className="text-[10px] text-muted-foreground font-body mt-1">Rank #{profile.rank} globally</p>

          {/* XP Bar */}
          <div className="mt-4 mx-auto max-w-xs">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-body">
              <span>XP {profile.xp.toLocaleString()}</span>
              <span>{profile.xpNext.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--gradient-gold)" }}
                animate={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total $MINE Mined", value: profile.totalMined.toLocaleString(), icon: "⛏️" },
            { label: "Total $WAGE Earned", value: profile.totalWage.toFixed(2), icon: "💰" },
            { label: "Current Streak", value: `${profile.streak} days`, icon: "🔥" },
            { label: "Member Since", value: "Dec 2025", icon: "📅" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg p-3 bg-gradient-card border border-border/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{stat.icon}</span>
                <p className="text-[10px] text-muted-foreground font-body">{stat.label}</p>
              </div>
              <p className="font-display font-bold text-sm">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <section>
          <h2 className="font-display font-semibold text-base mb-3">🏆 Badges</h2>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge, i) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-lg p-3 text-center border border-border/50 ${
                  badge.earned
                    ? "bg-gradient-card"
                    : "bg-secondary/30 opacity-40"
                }`}
              >
                <span className="text-2xl block mb-1">{badge.icon}</span>
                <p className="text-[10px] font-body text-muted-foreground">{badge.name}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="space-y-2">
          <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
            🏦 Withdraw $WAGE
          </button>
          <button className="w-full py-3 rounded-lg bg-secondary text-secondary-foreground font-display font-semibold text-sm tap-shrink">
            🪪 Verify Identity (KYC)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
