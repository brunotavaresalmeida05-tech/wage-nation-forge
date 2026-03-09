import { motion } from "framer-motion";
import { Settings, Award, Shield, Pickaxe, Wallet, PieChart, Flame, Check, Star, Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { Switch } from "../components/ui/switch";

const profile = {
  name: "Worker #4821",
  role: "Market Analyst",
  level: 3,
  xp: 2400,
  xpNext: 5000,
  streak: 4,
  totalMined: 84300,
  totalWage: 42.5,
  reputationScore: 285,
  reputationTier: "Worker",
  wageIdTier: "Active Citizen",
  rank: 1247,
  portfolioValue: 4830,
};

const badges = [
  { icon: Pickaxe, name: "First Mine", earned: true },
  { icon: Flame, name: "Trader", earned: true },
  { icon: Award, name: "Landlord", earned: true },
  { icon: Wallet, name: "Income Earner", earned: true },
  { icon: Flame, name: "7d Streak", earned: false },
  { icon: Star, name: "Diamond Hands", earned: false },
  { icon: Shield, name: "Auditor", earned: false },
  { icon: Award, name: "Tycoon", earned: false },
  { icon: Star, name: "Whale", earned: false },
];

const streakRewards = [
  { days: 3, bonus: "+10% $MINE/tap", title: "Dedicated Worker", reached: true },
  { days: 7, bonus: "+20% $MINE + 500 $MINE", title: "Worker of the Week", reached: false },
  { days: 14, bonus: "+35% $MINE + 1,000 $MINE", title: "Biweekly Veteran", reached: false },
  { days: 30, bonus: "+50% $MINE + 1 $WAGE", title: "Employee of the Month", reached: false },
  { days: 100, bonus: "+100% $MINE + 20 $WAGE", title: "Street CEO", reached: false },
];

const xpPercent = (profile.xp / profile.xpNext) * 100;

const ProfilePage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-xl">Profile</h1>
          <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center tap-shrink">
            <Settings size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-clean p-5 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-3">
            <span className="text-primary-foreground font-display font-bold text-xl">W</span>
          </div>
          <h2 className="font-display font-bold text-lg">{profile.name}</h2>
          <p className="text-xs text-primary font-body font-medium">{profile.role} • Level {profile.level}</p>
          <p className="text-[11px] text-muted-foreground font-body mt-0.5">Rank #{profile.rank} global</p>

          <div className="mt-4 mx-auto max-w-xs">
            <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5 font-body">
              <span>XP {profile.xp.toLocaleString()}</span>
              <span>{profile.xpNext.toLocaleString()}</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </motion.div>

        {/* Theme Toggle */}
        <div className="card-clean p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
              <div>
                <p className="text-sm font-display font-semibold">Appearance</p>
                <p className="text-[11px] text-muted-foreground font-body">{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
              </div>
            </div>
            <Switch checked={theme === "light"} onCheckedChange={toggleTheme} />
          </div>
        </div>

        {/* WageID & Reputation */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="card-clean p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield size={14} className="text-primary" />
              <p className="text-[11px] text-muted-foreground font-body">WageID</p>
            </div>
            <p className="text-sm font-display font-bold text-primary">{profile.wageIdTier}</p>
            <p className="text-[10px] text-muted-foreground font-body">50 $WAGE/yr</p>
          </div>
          <div className="card-clean p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={14} className="text-gold" />
              <p className="text-[11px] text-muted-foreground font-body">Reputation</p>
            </div>
            <p className="text-sm font-display font-bold">{profile.reputationScore}/1000</p>
            <p className="text-[10px] text-muted-foreground font-body">{profile.reputationTier}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { label: "Total $MINE", value: profile.totalMined.toLocaleString(), icon: Pickaxe },
            { label: "Total $WAGE", value: profile.totalWage.toFixed(2), icon: Wallet },
            { label: "Portfolio", value: `${profile.portfolioValue.toLocaleString()} $W`, icon: PieChart },
            { label: "Streak", value: `${profile.streak} days`, icon: Flame },
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
          <h2 className="font-display font-semibold text-[15px] mb-3">Streak Rewards</h2>
          <div className="space-y-2">
            {streakRewards.map((sr) => (
              <div
                key={sr.days}
                className={`flex items-center gap-3 card-clean p-3 ${sr.reached ? "border-primary/20" : ""}`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-display font-bold flex-shrink-0 ${
                  sr.reached ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {sr.days}d
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display font-semibold">{sr.title}</p>
                  <p className="text-[11px] text-muted-foreground font-body">{sr.bonus}</p>
                </div>
                {sr.reached && <Check size={16} className="text-primary flex-shrink-0" />}
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
            Withdraw $WAGE
          </button>
          <button className="w-full py-3 rounded-xl bg-secondary text-foreground font-display font-semibold text-sm tap-shrink">
            Verify Identity (KYC)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
