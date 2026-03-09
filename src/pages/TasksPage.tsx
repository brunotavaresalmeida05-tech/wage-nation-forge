import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, ChevronRight, Trophy, Target, Flame, Gift, Star, Zap, Clock, Users } from "lucide-react";
import AdvancedTaskCard, { AdvancedTask } from "../components/AdvancedTaskCard";

const DAILY_TASKS: AdvancedTask[] = [
  { id: 1, title: "Tap 50 times today", category: "Mining", rewardMine: 200, rewardXP: 50, completed: false, progress: 12, target: 50 },
  { id: 2, title: "Tap 150 times today", category: "Mining", rewardMine: 500, rewardXP: 100, completed: false, progress: 12, target: 150 },
  { id: 3, title: "Convert any amount of $MINE to $WAGE", category: "Exchange", rewardMine: 300, rewardXP: 75, completed: false },
  { id: 4, title: "Collect rent from at least 1 property", category: "Real Estate", rewardMine: 250, rewardXP: 60, completed: true },
  { id: 5, title: "Collect ETF yield", category: "ETF", rewardMine: 250, rewardXP: 60, completed: false },
  { id: 6, title: "Visit the Stock Market", category: "Sectors", rewardMine: 150, rewardXP: 40, completed: false },
  { id: 7, title: "Upgrade a Card", category: "Upgrade", rewardMine: 400, rewardXP: 100, completed: false },
  { id: 8, title: "Check the Economic Dashboard", category: "Education", rewardMine: 100, rewardXP: 25, completed: true },
  { id: 9, title: "Send 1 message in community chat", category: "Social", rewardMine: 150, rewardXP: 30, completed: false },
  { id: 10, title: "Log in before 9:00 AM", category: "Habit", rewardMine: 200, rewardXP: 50, completed: true },
  { id: 11, title: "Have energy above 500 at login", category: "Management", rewardMine: 100, rewardXP: 20, completed: false },
  { id: 12, title: "Buy or sell 1 asset on the market", category: "Trading", rewardMine: 350, rewardXP: 80, completed: false },
  { id: 13, title: "Check the dividend calendar", category: "Education", rewardMine: 100, rewardXP: 20, completed: false },
  { id: 14, title: "Own at least 3 properties", category: "Real Estate", rewardMine: 0, rewardXP: 150, completed: true },
  { id: 15, title: "Use the property payback simulator", category: "Education", rewardMine: 150, rewardXP: 35, completed: false },
  { id: 16, title: "Check your ETF risk level", category: "ETF", rewardMine: 100, rewardXP: 25, completed: false },
  { id: 17, title: "Collect streak bonus", category: "Streak", rewardMine: "streak×100", rewardXP: "streak×20", completed: false },
  { id: 18, title: "Hold $WAGE in portfolio (any amount)", category: "Capital", rewardMine: 0, rewardXP: 100, completed: true },
  { id: 19, title: "List or sell 1 item on P2P market", category: "P2P", rewardMine: 400, rewardXP: 90, completed: false },
  { id: 20, title: "End the day with more $MINE than yesterday", category: "Growth", rewardMine: 500, rewardXP: 120, completed: false },
];

const MISSIONS: { title: string; condition: string; reward: string; completed: boolean; icon: string }[] = [
  { title: "First Property", condition: "Buy your 1st property", reward: "+5,000 $MINE", completed: true, icon: "🏠" },
  { title: "Real Estate Mogul", condition: "Own 10 properties", reward: "+50,000 $MINE + Exclusive Card", completed: false, icon: "🏰" },
  { title: "Diversified", condition: "Assets in 5 sectors", reward: "+10,000 $MINE + 5% yield", completed: false, icon: "🎯" },
  { title: "Complete Investor", condition: "Own all 3 ETFs", reward: "+25,000 $MINE + Elite ETF", completed: false, icon: "📊" },
  { title: "First Dividend", condition: "Receive 1st dividend", reward: "+2,000 $MINE", completed: true, icon: "💰" },
  { title: "Active Trader", condition: "50 P2P transactions", reward: "+20,000 $MINE", completed: false, icon: "📈" },
  { title: "Synthetic Whale", condition: "Portfolio > 100,000 $WAGE", reward: "+200,000 $MINE", completed: false, icon: "🐋" },
];

// ── NEW: Engagement & Incentive Systems ──
const DAILY_REWARDS = [
  { day: 1, reward: "500 $MINE", claimed: true },
  { day: 2, reward: "750 $MINE", claimed: true },
  { day: 3, reward: "1,000 $MINE", claimed: true },
  { day: 4, reward: "1,500 $MINE", claimed: false, today: true },
  { day: 5, reward: "2,000 $MINE", claimed: false },
  { day: 6, reward: "3,000 $MINE", claimed: false },
  { day: 7, reward: "5,000 $MINE + Mystery Box", claimed: false },
];

const CHALLENGES = [
  { id: "c1", title: "Trading Master", description: "Execute 10 trades this week", progress: 3, target: 10, reward: "2,500 $MINE", timeLeft: "4d 12h", icon: "📈" },
  { id: "c2", title: "Lending Pro", description: "Lend 1,000 $WAGE in Credit pools", progress: 450, target: 1000, reward: "5,000 $MINE + 1% APR boost", timeLeft: "6d 8h", icon: "🏦" },
  { id: "c3", title: "Social Butterfly", description: "Refer 3 friends this month", progress: 1, target: 3, reward: "10,000 $MINE + Referral Card", timeLeft: "22d", icon: "🦋" },
  { id: "c4", title: "Diamond Hands", description: "Hold $WAGE without selling for 30 days", progress: 18, target: 30, reward: "15,000 $MINE + Vault boost", timeLeft: "12d", icon: "💎" },
];

const ACHIEVEMENTS = [
  { title: "Early Adopter", description: "Joined in the first month", unlocked: true, icon: "🌟" },
  { title: "Mining Legend", description: "Mine 1,000,000 $MINE total", unlocked: false, progress: 342000, target: 1000000, icon: "⛏️" },
  { title: "Streak Champion", description: "Maintain a 30-day streak", unlocked: false, progress: 12, target: 30, icon: "🔥" },
  { title: "Vault Guardian", description: "Lock 50,000 $WAGE in Vault", unlocked: false, progress: 12000, target: 50000, icon: "🛡️" },
  { title: "Market Maker", description: "100 total transactions", unlocked: false, progress: 34, target: 100, icon: "📊" },
  { title: "Property Baron", description: "Own 25 properties", unlocked: false, progress: 5, target: 25, icon: "🏗️" },
];

const LEADERBOARD = [
  { rank: 1, name: "CryptoKing", xp: 245000, badge: "🥇" },
  { rank: 2, name: "WageWhale", xp: 198000, badge: "🥈" },
  { rank: 3, name: "MineQueen", xp: 176000, badge: "🥉" },
  { rank: 4, name: "DeFiPro", xp: 152000, badge: "" },
  { rank: 5, name: "You", xp: 84200, badge: "⭐", isUser: true },
];

const CATEGORIES = ["All", "Mining", "Exchange", "Real Estate", "ETF", "Sectors", "Social", "Streak"];
const TABS = ["Tasks", "Challenges", "Rewards", "Achievements", "Leaderboard"] as const;
type Tab = typeof TABS[number];

const TasksPage = () => {
  const [activeCat, setActiveCat] = useState("All");
  const [activeTab, setActiveTab] = useState<Tab>("Tasks");
  const navigate = useNavigate();

  const completed = DAILY_TASKS.filter((t) => t.completed).length;
  const filtered = activeCat === "All" ? DAILY_TASKS : DAILY_TASKS.filter((t) => t.category === activeCat);

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        {/* Header with level */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl lg:text-2xl">Earn & Engage</h1>
            <p className="text-xs text-muted-foreground font-body mt-1">Complete tasks, challenges & achievements for rewards</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Star size={14} className="text-primary" />
            <span className="text-xs font-display font-bold text-primary">Lv. 12</span>
            <span className="text-[10px] text-muted-foreground font-body">84,200 XP</span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="card-clean p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-body text-muted-foreground">Level 12 → Level 13</span>
            <span className="text-xs font-body font-medium text-primary">84,200 / 100,000 XP</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: "84.2%" }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground font-body mt-1.5">🎁 Level 13 unlocks: +5% mining boost, exclusive avatar frame</p>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide bg-secondary/50 p-1 rounded-lg">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-md text-xs font-body font-medium whitespace-nowrap transition-all min-w-[80px] ${
                activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ═══ TASKS TAB ═══ */}
        {activeTab === "Tasks" && (
          <div className="space-y-4">
            {/* Task progress */}
            <div className="card-clean p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-primary" />
                  <span className="text-sm font-display font-semibold">Daily Tasks</span>
                </div>
                <span className="text-xs font-body text-muted-foreground">{completed}/{DAILY_TASKS.length}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(completed / DAILY_TASKS.length) * 100}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground font-body mt-1.5">
                Complete all 20 tasks for 🎁 Bonus: 5,000 $MINE + Mystery Box
              </p>
            </div>

            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-body whitespace-nowrap tap-shrink border transition-all ${
                    activeCat === c ? "bg-primary text-primary-foreground border-primary" : "bg-transparent text-muted-foreground border-border"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Task list */}
            <div className="space-y-2">
              {filtered.map((task) => (
                <AdvancedTaskCard key={task.id} task={task} />
              ))}
            </div>

            {/* Missions */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={16} className="text-primary" />
                <h3 className="text-sm font-display font-semibold">Long-term Missions</h3>
              </div>
              <div className="space-y-2">
                {MISSIONS.map((m) => (
                  <div key={m.title} className={`card-clean p-4 flex items-center gap-3 ${m.completed ? "opacity-60" : ""}`}>
                    <span className="text-xl">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-display font-semibold">{m.title}</p>
                      <p className="text-[11px] text-muted-foreground font-body">{m.condition}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-body font-medium text-primary">{m.reward}</p>
                      {m.completed && <span className="text-[10px] text-success font-body">✓ Done</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ CHALLENGES TAB ═══ */}
        {activeTab === "Challenges" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-body">Time-limited challenges with premium rewards</p>
            {CHALLENGES.map((ch) => (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-clean p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{ch.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-display font-semibold">{ch.title}</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-body">
                        <Clock size={10} />
                        <span>{ch.timeLeft}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-body mb-2">{ch.description}</p>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-1.5">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(ch.progress / ch.target) * 100}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-body text-muted-foreground">{ch.progress}/{ch.target}</span>
                      <span className="text-[10px] font-body font-medium text-primary">{ch.reward}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ═══ REWARDS TAB ═══ */}
        {activeTab === "Rewards" && (
          <div className="space-y-4">
            {/* Daily Login Rewards */}
            <div className="card-clean p-4">
              <div className="flex items-center gap-2 mb-4">
                <Gift size={16} className="text-primary" />
                <h3 className="text-sm font-display font-semibold">Daily Login Rewards</h3>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {DAILY_REWARDS.map((dr) => (
                  <div
                    key={dr.day}
                    className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                      dr.claimed
                        ? "border-success/30 bg-success/5"
                        : dr.today
                        ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                        : "border-border/40"
                    }`}
                  >
                    <span className="text-[10px] text-muted-foreground font-body">D{dr.day}</span>
                    <span className="text-lg mt-0.5">{dr.claimed ? "✅" : dr.today ? "🎁" : "📦"}</span>
                    <span className="text-[8px] text-muted-foreground font-body mt-1 text-center leading-tight">{dr.reward}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium tap-shrink">
                Claim Day 4 Reward
              </button>
            </div>

            {/* Referral Program */}
            <div className="card-clean p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-primary" />
                <h3 className="text-sm font-display font-semibold">Referral Program</h3>
              </div>
              <p className="text-xs text-muted-foreground font-body mb-3">Invite friends and earn together. Both you and your friend get rewards!</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-[10px] text-muted-foreground font-body uppercase">You Earn</p>
                  <p className="text-sm font-display font-bold text-primary">5,000 $MINE</p>
                  <p className="text-[10px] text-muted-foreground font-body">+ 10% of friend's mining</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-[10px] text-muted-foreground font-body uppercase">Friend Gets</p>
                  <p className="text-sm font-display font-bold text-primary">3,000 $MINE</p>
                  <p className="text-[10px] text-muted-foreground font-body">+ 2x energy for 7 days</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-secondary text-xs font-body text-muted-foreground truncate">
                  wage.app/ref/JD2024XK
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium tap-shrink">
                  Copy
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground font-body mt-2">3 friends invited · 12,000 $MINE earned</p>
            </div>

            {/* Spin the Wheel */}
            <div className="card-clean p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-primary" />
                <h3 className="text-sm font-display font-semibold">Lucky Spin</h3>
              </div>
              <p className="text-xs text-muted-foreground font-body mb-3">Spin once per day for free! Extra spins with $MINE.</p>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {["500 $M", "1K $M", "2x Energy", "0.5 $W", "5K $M", "NFT Badge", "Mystery", "50K $M"].slice(0, 4).map((prize, i) => (
                  <div key={i} className="p-2 rounded-lg bg-secondary/50 text-center">
                    <span className="text-lg">{"🎰🎲🎯🎪"[i]}</span>
                    <p className="text-[9px] text-muted-foreground font-body mt-0.5">{prize}</p>
                  </div>
                ))}
              </div>
              <button className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium tap-shrink">
                🎡 Spin Now (Free)
              </button>
            </div>
          </div>
        )}

        {/* ═══ ACHIEVEMENTS TAB ═══ */}
        {activeTab === "Achievements" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-body">Unlock permanent badges and boosts</p>
            {ACHIEVEMENTS.map((ach) => (
              <motion.div
                key={ach.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`card-clean p-4 ${!ach.unlocked ? "" : "border-primary/30"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${ach.unlocked ? "bg-primary/15" : "bg-secondary"}`}>
                    {ach.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-display font-semibold">{ach.title}</p>
                      {ach.unlocked && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/10 text-success font-body">Unlocked</span>}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-body">{ach.description}</p>
                    {!ach.unlocked && ach.progress !== undefined && (
                      <div className="mt-1.5">
                        <div className="h-1 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${(ach.progress / (ach.target || 1)) * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-body">{ach.progress.toLocaleString()}/{ach.target?.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ═══ LEADERBOARD TAB ═══ */}
        {activeTab === "Leaderboard" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-body">Top earners this week — climb the ranks!</p>
            {LEADERBOARD.map((entry) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: entry.rank * 0.05 }}
                className={`card-clean p-4 flex items-center gap-3 ${entry.isUser ? "border-primary/40 bg-primary/5" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold ${
                  entry.rank <= 3 ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  {entry.badge || `#${entry.rank}`}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-display font-semibold ${entry.isUser ? "text-primary" : ""}`}>{entry.name}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{entry.xp.toLocaleString()} XP</p>
                </div>
                {entry.isUser && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-body font-medium">You</span>
                )}
              </motion.div>
            ))}
            <div className="card-clean p-4 text-center">
              <p className="text-xs text-muted-foreground font-body">🏆 Top 3 weekly winners receive:</p>
              <p className="text-sm font-display font-semibold text-primary mt-1">50,000 $MINE + Exclusive NFT Badge + 2x Vault APY for 7 days</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
