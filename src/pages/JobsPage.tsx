import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Building2, Clock, Coins, ChevronRight, Star, TrendingUp,
  CheckCircle2, Lock, Zap, Users, Award, ArrowRight, Timer, Wallet
} from "lucide-react";
import CoinIcon from "@/components/CoinIcon";

/* ── Fictional Companies & Sectors ── */
const sectors = [
  {
    id: "tech",
    name: "Technology",
    icon: "💻",
    color: "from-blue-500/20 to-cyan-500/20",
    companies: [
      {
        id: "nexacore",
        name: "NexaCore Systems",
        logo: "⚡",
        description: "AI & Cloud Infrastructure",
        positions: [
          { title: "Data Analyst", salary: 320, level: 1, tasks: 5, xp: 50 },
          { title: "ML Engineer", salary: 580, level: 3, tasks: 7, xp: 90 },
          { title: "CTO", salary: 1200, level: 8, tasks: 10, xp: 200 },
        ],
      },
      {
        id: "quantum_labs",
        name: "Quantum Labs",
        logo: "🔬",
        description: "Quantum Computing Research",
        positions: [
          { title: "Lab Assistant", salary: 250, level: 1, tasks: 4, xp: 40 },
          { title: "Researcher", salary: 650, level: 5, tasks: 8, xp: 120 },
        ],
      },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    icon: "🏦",
    color: "from-emerald-500/20 to-green-500/20",
    companies: [
      {
        id: "wage_bank",
        name: "Wage Central Bank",
        logo: "🏛️",
        description: "Central Financial Institution",
        positions: [
          { title: "Teller", salary: 200, level: 1, tasks: 4, xp: 30 },
          { title: "Loan Officer", salary: 450, level: 3, tasks: 6, xp: 70 },
          { title: "VP Finance", salary: 1500, level: 10, tasks: 12, xp: 250 },
        ],
      },
      {
        id: "mint_capital",
        name: "Mint Capital",
        logo: "📊",
        description: "Investment & Asset Management",
        positions: [
          { title: "Analyst", salary: 380, level: 2, tasks: 5, xp: 60 },
          { title: "Portfolio Manager", salary: 900, level: 6, tasks: 9, xp: 150 },
        ],
      },
    ],
  },
  {
    id: "energy",
    name: "Energy & Mining",
    icon: "⛏️",
    color: "from-amber-500/20 to-orange-500/20",
    companies: [
      {
        id: "deepmine_corp",
        name: "DeepMine Corp",
        logo: "🪨",
        description: "Mineral Extraction & Processing",
        positions: [
          { title: "Miner", salary: 280, level: 1, tasks: 6, xp: 45 },
          { title: "Foreman", salary: 520, level: 4, tasks: 8, xp: 100 },
          { title: "Site Director", salary: 1100, level: 7, tasks: 10, xp: 180 },
        ],
      },
    ],
  },
  {
    id: "logistics",
    name: "Logistics & Trade",
    icon: "🚢",
    color: "from-purple-500/20 to-violet-500/20",
    companies: [
      {
        id: "global_freight",
        name: "Global Freight Co.",
        logo: "📦",
        description: "International Shipping & Supply Chain",
        positions: [
          { title: "Dispatcher", salary: 220, level: 1, tasks: 4, xp: 35 },
          { title: "Route Manager", salary: 480, level: 3, tasks: 6, xp: 80 },
          { title: "Operations Chief", salary: 950, level: 6, tasks: 9, xp: 160 },
        ],
      },
    ],
  },
  {
    id: "construction",
    name: "Construction & Real Estate",
    icon: "🏗️",
    color: "from-rose-500/20 to-red-500/20",
    companies: [
      {
        id: "wageville_dev",
        name: "WageVille Developments",
        logo: "🏠",
        description: "Urban Development & Housing",
        positions: [
          { title: "Builder", salary: 260, level: 1, tasks: 5, xp: 40 },
          { title: "Architect", salary: 600, level: 4, tasks: 7, xp: 110 },
          { title: "Project Lead", salary: 1050, level: 7, tasks: 10, xp: 190 },
        ],
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    color: "from-teal-500/20 to-cyan-500/20",
    companies: [
      {
        id: "vitahealth",
        name: "VitaHealth Corp",
        logo: "💊",
        description: "Pharmaceuticals & Clinics",
        positions: [
          { title: "Nurse", salary: 300, level: 1, tasks: 5, xp: 50 },
          { title: "Pharmacist", salary: 550, level: 3, tasks: 7, xp: 95 },
          { title: "Chief Doctor", salary: 1300, level: 9, tasks: 11, xp: 220 },
        ],
      },
    ],
  },
];

/* ── Daily Work Tasks (generated per profession) ── */
const workTaskTemplates: Record<string, string[]> = {
  tech: [
    "Debug the authentication module",
    "Review pull requests from team",
    "Deploy staging environment update",
    "Write unit tests for payment API",
    "Optimize database query performance",
    "Attend daily standup meeting",
    "Document API endpoints",
  ],
  finance: [
    "Process pending loan applications",
    "Reconcile daily transaction ledger",
    "Review risk assessment reports",
    "Update client portfolio allocations",
    "Generate monthly financial statement",
    "Verify KYC compliance documents",
  ],
  energy: [
    "Inspect mining equipment",
    "Log daily extraction volumes",
    "Calibrate drill pressure sensors",
    "Submit safety compliance report",
    "Coordinate shift rotations",
    "Process ore quality samples",
  ],
  logistics: [
    "Track shipment delivery status",
    "Optimize route for next delivery",
    "Process customs documentation",
    "Update inventory management system",
    "Coordinate warehouse loading",
  ],
  construction: [
    "Review architectural blueprints",
    "Inspect building foundation work",
    "Order construction materials",
    "Submit project progress report",
    "Coordinate subcontractor schedule",
  ],
  healthcare: [
    "Complete patient check-ups",
    "Review lab test results",
    "Update medical records system",
    "Restock pharmacy inventory",
    "Attend medical training session",
  ],
};

interface ActiveJob {
  companyId: string;
  companyName: string;
  companyLogo: string;
  sectorId: string;
  position: string;
  salary: number;
  tasksPerDay: number;
  xpPerDay: number;
}

const JobsPage = () => {
  const [activeJob, setActiveJob] = useState<ActiveJob | null>({
    companyId: "nexacore",
    companyName: "NexaCore Systems",
    companyLogo: "⚡",
    sectorId: "tech",
    position: "Data Analyst",
    salary: 320,
    tasksPerDay: 5,
    xpPerDay: 50,
  });
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [showApplyModal, setShowApplyModal] = useState<{
    company: (typeof sectors)[0]["companies"][0];
    position: (typeof sectors)[0]["companies"][0]["positions"][0];
    sectorId: string;
  } | null>(null);
  const [userLevel] = useState(3);
  const [weeklyEarnings] = useState(1920);
  const [totalCareerEarnings] = useState(24680);
  const [daysWorked] = useState(47);
  const [reputation] = useState(78);

  const todayTasks = activeJob
    ? (workTaskTemplates[activeJob.sectorId] || workTaskTemplates.tech).slice(0, activeJob.tasksPerDay)
    : [];

  const completedCount = completedTasks.size;
  const allDone = activeJob ? completedCount >= activeJob.tasksPerDay : false;
  const dailyProgress = activeJob ? (completedCount / activeJob.tasksPerDay) * 100 : 0;
  const earnedToday = activeJob ? Math.floor((completedCount / activeJob.tasksPerDay) * activeJob.salary) : 0;

  const handleCompleteTask = (index: number) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const handleApply = () => {
    if (!showApplyModal) return;
    const { company, position, sectorId } = showApplyModal;
    setActiveJob({
      companyId: company.id,
      companyName: company.name,
      companyLogo: company.logo,
      sectorId,
      position: position.title,
      salary: position.salary,
      tasksPerDay: position.tasks,
      xpPerDay: position.xp,
    });
    setCompletedTasks(new Set());
    setShowApplyModal(null);
    setSelectedCompany(null);
    setSelectedSector(null);
  };

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl">Career Center</h1>
            <p className="text-xs text-muted-foreground font-body">Work. Earn. Build your career.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-lg">
            <Star size={13} className="text-warning fill-warning" />
            <span className="text-xs font-display font-bold">{reputation}</span>
            <span className="text-[10px] text-muted-foreground font-body">Rep</span>
          </div>
        </div>

        {/* Career Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Weekly Salary", value: `${weeklyEarnings}`, icon: Wallet, suffix: "$M" },
            { label: "Career Total", value: totalCareerEarnings.toLocaleString(), icon: TrendingUp, suffix: "$M" },
            { label: "Days Worked", value: daysWorked.toString(), icon: Clock, suffix: "" },
            { label: "Level", value: userLevel.toString(), icon: Award, suffix: "" },
          ].map((stat) => (
            <div key={stat.label} className="card-clean p-2.5 text-center">
              <stat.icon size={14} className="text-primary mx-auto mb-1" />
              <p className="text-xs font-display font-bold">
                {stat.value}
                {stat.suffix && <span className="text-[9px] text-muted-foreground ml-0.5">{stat.suffix}</span>}
              </p>
              <p className="text-[9px] text-muted-foreground font-body mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Current Employment */}
        {activeJob && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card-clean overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-transparent p-4 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-xl">
                      {activeJob.companyLogo}
                    </div>
                    <div>
                      <p className="text-sm font-display font-bold">{activeJob.companyName}</p>
                      <p className="text-xs text-muted-foreground font-body flex items-center gap-1.5">
                        <Briefcase size={11} />
                        {activeJob.position}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-primary flex items-center gap-1">
                      <CoinIcon type="mine" size={16} />
                      {activeJob.salary}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-body">daily salary</p>
                  </div>
                </div>
              </div>

              {/* Daily Tasks */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-display font-semibold">Today's Work Tasks</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-body">
                      {completedCount}/{activeJob.tasksPerDay}
                    </span>
                    {allDone && (
                      <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-body font-medium">
                        ✓ All done!
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    animate={{ width: `${dailyProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="space-y-2">
                  {todayTasks.map((task, i) => {
                    const done = completedTasks.has(i);
                    return (
                      <motion.button
                        key={i}
                        onClick={() => !done && handleCompleteTask(i)}
                        disabled={done}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all tap-shrink ${
                          done
                            ? "bg-success/5 border border-success/20"
                            : "bg-secondary/50 hover:bg-secondary border border-transparent"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            done ? "bg-success/20" : "bg-secondary"
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 size={14} className="text-success" />
                          ) : (
                            <span className="text-[10px] font-display font-bold text-muted-foreground">{i + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-body ${done ? "line-through text-muted-foreground" : ""}`}>
                            {task}
                          </p>
                        </div>
                        {!done && (
                          <div className="flex items-center gap-1 text-[10px] text-primary font-body">
                            <Coins size={10} />+{Math.floor(activeJob.salary / activeJob.tasksPerDay)}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Daily earnings summary */}
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <p className="text-xs text-muted-foreground font-body">Earned today</p>
                  <p className="text-sm font-display font-bold text-primary flex items-center gap-1">
                    <CoinIcon type="mine" size={14} />
                    {earnedToday} / {activeJob.salary} $MINE
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Economy Flow Diagram */}
        <div className="card-clean p-4">
          <p className="text-xs font-display font-semibold mb-3">Economy Cycle</p>
          <div className="flex items-center justify-between text-center gap-1">
            {[
              { emoji: "🏢", label: "Companies", sub: "Create jobs" },
              { emoji: "→", label: "", sub: "" },
              { emoji: "👷", label: "Workers", sub: "Earn $MINE" },
              { emoji: "→", label: "", sub: "" },
              { emoji: "🏛️", label: "Treasury", sub: "Taxes & fees" },
              { emoji: "→", label: "", sub: "" },
              { emoji: "🏢", label: "Companies", sub: "Reinvest" },
            ].map((step, i) =>
              step.label ? (
                <div key={i} className="flex-1">
                  <div className="text-lg mb-1">{step.emoji}</div>
                  <p className="text-[10px] font-display font-semibold">{step.label}</p>
                  <p className="text-[8px] text-muted-foreground font-body">{step.sub}</p>
                </div>
              ) : (
                <ArrowRight key={i} size={14} className="text-muted-foreground flex-shrink-0" />
              )
            )}
          </div>
        </div>

        {/* Browse Sectors & Companies */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-[15px]">Job Market</h2>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-body">
              <Users size={11} />
              <span>{sectors.reduce((a, s) => a + s.companies.length, 0)} companies hiring</span>
            </div>
          </div>

          {/* Sector chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-none">
            <button
              onClick={() => { setSelectedSector(null); setSelectedCompany(null); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-body tap-shrink transition-colors ${
                !selectedSector ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              All Sectors
            </button>
            {sectors.map((sector) => (
              <button
                key={sector.id}
                onClick={() => { setSelectedSector(sector.id); setSelectedCompany(null); }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-body tap-shrink transition-colors ${
                  selectedSector === sector.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {sector.icon} {sector.name}
              </button>
            ))}
          </div>

          {/* Company listings */}
          <div className="space-y-2.5">
            {sectors
              .filter((s) => !selectedSector || s.id === selectedSector)
              .map((sector) =>
                sector.companies.map((company) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-clean overflow-hidden"
                  >
                    <button
                      onClick={() => setSelectedCompany(selectedCompany === company.id ? null : company.id)}
                      className="w-full p-3.5 flex items-center gap-3 tap-shrink text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sector.color} flex items-center justify-center text-lg`}>
                        {company.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-display font-semibold">{company.name}</p>
                        <p className="text-[10px] text-muted-foreground font-body">{company.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-md font-body text-muted-foreground">
                          {company.positions.length} roles
                        </span>
                        <ChevronRight
                          size={14}
                          className={`text-muted-foreground transition-transform ${selectedCompany === company.id ? "rotate-90" : ""}`}
                        />
                      </div>
                    </button>

                    <AnimatePresence>
                      {selectedCompany === company.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3.5 pb-3.5 space-y-2 border-t border-border/30 pt-3">
                            {company.positions.map((pos) => {
                              const locked = userLevel < pos.level;
                              const isCurrentJob = activeJob?.companyId === company.id && activeJob?.position === pos.title;
                              return (
                                <div
                                  key={pos.title}
                                  className={`flex items-center gap-3 p-3 rounded-xl ${
                                    isCurrentJob
                                      ? "bg-primary/10 border border-primary/30"
                                      : locked
                                      ? "bg-secondary/30 opacity-50"
                                      : "bg-secondary/50"
                                  }`}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <p className="text-xs font-display font-semibold">{pos.title}</p>
                                      {locked && <Lock size={10} className="text-muted-foreground" />}
                                      {isCurrentJob && (
                                        <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-body">
                                          Current
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-[10px] text-muted-foreground font-body flex items-center gap-0.5">
                                        <Timer size={9} /> {pos.tasks} tasks/day
                                      </span>
                                      <span className="text-[10px] text-muted-foreground font-body flex items-center gap-0.5">
                                        <Zap size={9} /> {pos.xp} XP/day
                                      </span>
                                      <span className="text-[10px] text-muted-foreground font-body">
                                        Lvl {pos.level}+
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-xs font-display font-bold text-primary flex items-center gap-1 justify-end">
                                      <CoinIcon type="mine" size={13} />
                                      {pos.salary}
                                    </p>
                                    <p className="text-[9px] text-muted-foreground font-body">per day</p>
                                  </div>
                                  {!isCurrentJob && !locked && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowApplyModal({ company, position: pos, sectorId: sector.id });
                                      }}
                                      className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-body font-medium tap-shrink"
                                    >
                                      Apply
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
          </div>
        </section>

        {/* Tax & Economy Info */}
        <div className="card-clean p-4 space-y-3">
          <p className="text-xs font-display font-semibold">How Wage Economy Works</p>
          <div className="space-y-2.5">
            {[
              { icon: "💼", title: "Work Daily", desc: "Complete tasks at your company to earn $MINE salary" },
              { icon: "💰", title: "Earn & Spend", desc: "Use $MINE for upgrades, swaps, staking, and more" },
              { icon: "🏛️", title: "Taxes Sustain", desc: "5% salary tax + transaction fees fund the Treasury" },
              { icon: "🔄", title: "Treasury Reinvests", desc: "Funds flow back into UBI, rewards & liquidity pools" },
              { icon: "📈", title: "Convert to $WAGE", desc: "Swap earned $MINE to scarce $WAGE for real value" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="text-base mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs font-display font-semibold">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Confirmation Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowApplyModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card-clean p-6 w-full max-w-sm space-y-4"
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-2xl mx-auto mb-3">
                  {showApplyModal.company.logo}
                </div>
                <h3 className="font-display font-bold text-lg">Apply for Position</h3>
                <p className="text-xs text-muted-foreground font-body mt-1">{showApplyModal.company.name}</p>
              </div>

              <div className="bg-secondary/50 rounded-xl p-3 space-y-2">
                <div className="flex justify-between text-xs font-body">
                  <span className="text-muted-foreground">Position</span>
                  <span className="font-semibold">{showApplyModal.position.title}</span>
                </div>
                <div className="flex justify-between text-xs font-body">
                  <span className="text-muted-foreground">Daily Salary</span>
                  <span className="font-semibold text-primary">{showApplyModal.position.salary} $MINE</span>
                </div>
                <div className="flex justify-between text-xs font-body">
                  <span className="text-muted-foreground">Tasks/Day</span>
                  <span>{showApplyModal.position.tasks}</span>
                </div>
                <div className="flex justify-between text-xs font-body">
                  <span className="text-muted-foreground">XP/Day</span>
                  <span>{showApplyModal.position.xp}</span>
                </div>
              </div>

              {activeJob && (
                <p className="text-[10px] text-warning text-center font-body">
                  ⚠️ You will leave your current position at {activeJob.companyName}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setShowApplyModal(null)}
                  className="flex-1 py-2.5 rounded-xl bg-secondary text-sm font-body font-medium tap-shrink"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-body font-medium tap-shrink"
                >
                  Accept Job
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobsPage;
