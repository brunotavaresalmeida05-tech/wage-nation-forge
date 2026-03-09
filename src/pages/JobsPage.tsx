import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, Building2, Clock, Coins, ChevronRight, Star, TrendingUp, TrendingDown,
  CheckCircle2, Lock, Zap, Users, Award, ArrowRight, Timer, Wallet,
  ChevronUp, Trophy, Sparkles, PartyPopper, AlertTriangle, Flame, Snowflake,
  Ban, Megaphone, ShieldAlert, Gift, Newspaper
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
          { title: "Data Analyst", salary: 320, level: 1, tasks: 5, xp: 50, promoDays: 7 },
          { title: "ML Engineer", salary: 580, level: 3, tasks: 7, xp: 90, promoDays: 14 },
          { title: "CTO", salary: 1200, level: 8, tasks: 10, xp: 200, promoDays: 0 },
        ],
      },
      {
        id: "quantum_labs",
        name: "Quantum Labs",
        logo: "🔬",
        description: "Quantum Computing Research",
        positions: [
          { title: "Lab Assistant", salary: 250, level: 1, tasks: 4, xp: 40, promoDays: 10 },
          { title: "Researcher", salary: 650, level: 5, tasks: 8, xp: 120, promoDays: 0 },
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
          { title: "Teller", salary: 200, level: 1, tasks: 4, xp: 30, promoDays: 5 },
          { title: "Loan Officer", salary: 450, level: 3, tasks: 6, xp: 70, promoDays: 14 },
          { title: "VP Finance", salary: 1500, level: 10, tasks: 12, xp: 250, promoDays: 0 },
        ],
      },
      {
        id: "mint_capital",
        name: "Mint Capital",
        logo: "📊",
        description: "Investment & Asset Management",
        positions: [
          { title: "Analyst", salary: 380, level: 2, tasks: 5, xp: 60, promoDays: 10 },
          { title: "Portfolio Manager", salary: 900, level: 6, tasks: 9, xp: 150, promoDays: 0 },
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
          { title: "Miner", salary: 280, level: 1, tasks: 6, xp: 45, promoDays: 7 },
          { title: "Foreman", salary: 520, level: 4, tasks: 8, xp: 100, promoDays: 14 },
          { title: "Site Director", salary: 1100, level: 7, tasks: 10, xp: 180, promoDays: 0 },
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
          { title: "Dispatcher", salary: 220, level: 1, tasks: 4, xp: 35, promoDays: 7 },
          { title: "Route Manager", salary: 480, level: 3, tasks: 6, xp: 80, promoDays: 12 },
          { title: "Operations Chief", salary: 950, level: 6, tasks: 9, xp: 160, promoDays: 0 },
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
          { title: "Builder", salary: 260, level: 1, tasks: 5, xp: 40, promoDays: 8 },
          { title: "Architect", salary: 600, level: 4, tasks: 7, xp: 110, promoDays: 14 },
          { title: "Project Lead", salary: 1050, level: 7, tasks: 10, xp: 190, promoDays: 0 },
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
          { title: "Nurse", salary: 300, level: 1, tasks: 5, xp: 50, promoDays: 7 },
          { title: "Pharmacist", salary: 550, level: 3, tasks: 7, xp: 95, promoDays: 14 },
          { title: "Chief Doctor", salary: 1300, level: 9, tasks: 11, xp: 220, promoDays: 0 },
        ],
      },
    ],
  },
];

/* ── Daily Work Tasks ── */
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

/* ── Economic Events System ── */
interface EconomicEventDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  type: "boom" | "recession" | "strike" | "subsidy" | "crisis" | "golden";
  isPositive: boolean;
  /** Salary multiplier (1.0 = no change) */
  salaryMod: number;
  /** Affected sector IDs, empty = all sectors */
  affectedSectors: string[];
  /** Whether hiring is frozen in affected sectors */
  hiringFreeze: boolean;
  /** Duration label */
  duration: string;
  /** Extra XP modifier */
  xpMod: number;
}

const ALL_ECONOMIC_EVENTS: EconomicEventDef[] = [
  {
    id: "tech_boom",
    title: "Tech Boom",
    description: "AI revolution drives massive demand for tech workers. Salaries surge across all tech companies.",
    emoji: "🚀",
    type: "boom",
    isPositive: true,
    salaryMod: 1.35,
    affectedSectors: ["tech"],
    hiringFreeze: false,
    duration: "48h",
    xpMod: 1.2,
  },
  {
    id: "global_recession",
    title: "Global Recession",
    description: "Economic downturn hits all sectors. Companies cut salaries and freeze new hiring.",
    emoji: "📉",
    type: "recession",
    isPositive: false,
    salaryMod: 0.7,
    affectedSectors: [],
    hiringFreeze: true,
    duration: "72h",
    xpMod: 0.8,
  },
  {
    id: "mining_strike",
    title: "Miners' Strike",
    description: "Workers in Energy & Mining demand better conditions. All mining operations temporarily halted.",
    emoji: "✊",
    type: "strike",
    isPositive: false,
    salaryMod: 0,
    affectedSectors: ["energy"],
    hiringFreeze: true,
    duration: "24h",
    xpMod: 0,
  },
  {
    id: "finance_golden",
    title: "Bull Market Rally",
    description: "Stock markets hit all-time highs. Finance sector bonuses doubled!",
    emoji: "🐂",
    type: "golden",
    isPositive: true,
    salaryMod: 1.5,
    affectedSectors: ["finance"],
    hiringFreeze: false,
    duration: "48h",
    xpMod: 1.5,
  },
  {
    id: "govt_subsidy",
    title: "Government Subsidy",
    description: "Treasury announces stimulus package. All workers receive a temporary salary boost.",
    emoji: "🏛️",
    type: "subsidy",
    isPositive: true,
    salaryMod: 1.2,
    affectedSectors: [],
    hiringFreeze: false,
    duration: "48h",
    xpMod: 1.1,
  },
  {
    id: "health_crisis",
    title: "Health Emergency",
    description: "Pandemic alert! Healthcare demand spikes but other sectors see reduced activity.",
    emoji: "🦠",
    type: "crisis",
    isPositive: false,
    salaryMod: 0.8,
    affectedSectors: ["tech", "logistics", "construction", "energy"],
    hiringFreeze: false,
    duration: "72h",
    xpMod: 0.9,
  },
  {
    id: "healthcare_boom",
    title: "Healthcare Funding",
    description: "Massive government investment in healthcare. Medical salaries boosted significantly.",
    emoji: "💉",
    type: "boom",
    isPositive: true,
    salaryMod: 1.4,
    affectedSectors: ["healthcare"],
    hiringFreeze: false,
    duration: "48h",
    xpMod: 1.3,
  },
  {
    id: "logistics_surge",
    title: "Trade Boom",
    description: "International trade agreements boost global shipping demand. Logistics pays premium!",
    emoji: "🌍",
    type: "boom",
    isPositive: true,
    salaryMod: 1.3,
    affectedSectors: ["logistics"],
    hiringFreeze: false,
    duration: "48h",
    xpMod: 1.2,
  },
  {
    id: "construction_freeze",
    title: "Material Shortage",
    description: "Global supply chain disruption halts construction projects. Building sites shut down.",
    emoji: "🚧",
    type: "crisis",
    isPositive: false,
    salaryMod: 0.5,
    affectedSectors: ["construction"],
    hiringFreeze: true,
    duration: "48h",
    xpMod: 0.5,
  },
  {
    id: "golden_age",
    title: "Golden Age",
    description: "Economic prosperity! All sectors flourish with increased wages and new opportunities.",
    emoji: "✨",
    type: "golden",
    isPositive: true,
    salaryMod: 1.25,
    affectedSectors: [],
    hiringFreeze: false,
    duration: "24h",
    xpMod: 1.5,
  },
  {
    id: "energy_crisis",
    title: "Energy Crisis",
    description: "Oil prices skyrocket. Energy companies profit but all other sectors face higher costs.",
    emoji: "⛽",
    type: "crisis",
    isPositive: false,
    salaryMod: 0.85,
    affectedSectors: ["tech", "finance", "logistics", "construction", "healthcare"],
    hiringFreeze: false,
    duration: "48h",
    xpMod: 0.9,
  },
  {
    id: "energy_profit",
    title: "Energy Windfall",
    description: "Energy sector profits from crisis. Mining and energy workers get massive bonuses.",
    emoji: "💰",
    type: "boom",
    isPositive: true,
    salaryMod: 1.6,
    affectedSectors: ["energy"],
    hiringFreeze: false,
    duration: "48h",
    xpMod: 1.4,
  },
];

/** Pick 1-3 random active events (simulated) */
function getActiveEvents(): (EconomicEventDef & { endsIn: string })[] {
  // Use a seed based on the day so events feel persistent within a session
  const daySeed = Math.floor(Date.now() / (1000 * 60 * 60 * 12)); // changes every 12h
  const shuffled = [...ALL_ECONOMIC_EVENTS].sort((a, b) => {
    const ha = ((daySeed * 31 + a.id.length) % 97) / 97;
    const hb = ((daySeed * 31 + b.id.length) % 97) / 97;
    return ha - hb;
  });
  const count = (daySeed % 3) + 1; // 1-3 events
  return shuffled.slice(0, count).map((ev, i) => ({
    ...ev,
    endsIn: `${((daySeed + i * 7) % 47) + 1}h`,
  }));
}

const eventTypeConfig: Record<EconomicEventDef["type"], { icon: typeof TrendingUp; color: string; bg: string; border: string }> = {
  boom: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  recession: { icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
  strike: { icon: Ban, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
  subsidy: { icon: Gift, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  crisis: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  golden: { icon: Sparkles, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
};

interface ActiveJob {
  companyId: string;
  companyName: string;
  companyLogo: string;
  sectorId: string;
  positionIndex: number;
  position: string;
  salary: number;
  tasksPerDay: number;
  xpPerDay: number;
  promoDays: number;
  consecutiveDays: number;
}

interface PromotionData {
  oldPosition: string;
  newPosition: string;
  oldSalary: number;
  newSalary: number;
  companyName: string;
  companyLogo: string;
  bonusReward: number;
}

/* ── Confetti Particle ── */
const confettiColors = [
  "hsl(var(--primary))",
  "hsl(48, 96%, 53%)",
  "hsl(142, 71%, 45%)",
  "hsl(280, 87%, 65%)",
  "hsl(0, 84%, 60%)",
  "hsl(199, 89%, 48%)",
];

const ConfettiParticle = ({ index }: { index: number }) => {
  const color = confettiColors[index % confettiColors.length];
  const left = 10 + Math.random() * 80;
  const delay = Math.random() * 0.5;
  const rotation = Math.random() * 720 - 360;
  const size = 6 + Math.random() * 8;
  const isCircle = index % 3 === 0;

  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: [0, 300 + Math.random() * 200],
        x: [0, (Math.random() - 0.5) * 150],
        opacity: [1, 1, 0],
        rotate: rotation,
        scale: [1, 0.6],
      }}
      transition={{ duration: 2 + Math.random(), delay, ease: "easeOut" }}
      className="absolute pointer-events-none"
      style={{
        left: `${left}%`,
        top: -10,
        width: size,
        height: isCircle ? size : size * 2.5,
        borderRadius: isCircle ? "50%" : "2px",
        backgroundColor: color,
      }}
    />
  );
};

const JobsPage = () => {
  const [activeJob, setActiveJob] = useState<ActiveJob | null>({
    companyId: "nexacore",
    companyName: "NexaCore Systems",
    companyLogo: "⚡",
    sectorId: "tech",
    positionIndex: 0,
    position: "Data Analyst",
    salary: 320,
    tasksPerDay: 5,
    xpPerDay: 50,
    promoDays: 7,
    consecutiveDays: 5,
  });
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [showApplyModal, setShowApplyModal] = useState<{
    company: (typeof sectors)[0]["companies"][0];
    position: (typeof sectors)[0]["companies"][0]["positions"][0];
    positionIndex: number;
    sectorId: string;
  } | null>(null);
  const [showPromotion, setShowPromotion] = useState<PromotionData | null>(null);
  const [promotionStep, setPromotionStep] = useState(0);
  const [userLevel, setUserLevel] = useState(3);
  const [weeklyEarnings] = useState(1920);
  const [totalCareerEarnings] = useState(24680);
  const [daysWorked] = useState(47);
  const [reputation, setReputation] = useState(78);
  const [promotionHistory, setPromotionHistory] = useState<{ from: string; to: string; company: string; date: string }[]>([
    { from: "Intern", to: "Data Analyst", company: "NexaCore Systems", date: "2 weeks ago" },
  ]);

  const [activeEvents] = useState(() => getActiveEvents());
  const [dismissedEvents, setDismissedEvents] = useState<Set<string>>(new Set());
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  // Calculate salary modifier for a given sector
  const getSectorModifiers = useCallback((sectorId: string) => {
    let salaryMod = 1;
    let xpMod = 1;
    let hiringFrozen = false;
    let strikeActive = false;

    for (const ev of activeEvents) {
      const affects = ev.affectedSectors.length === 0 || ev.affectedSectors.includes(sectorId);
      if (affects) {
        if (ev.salaryMod === 0) {
          strikeActive = true;
          salaryMod = 0;
          xpMod = 0;
        } else {
          salaryMod *= ev.salaryMod;
          xpMod *= ev.xpMod;
        }
        if (ev.hiringFreeze) hiringFrozen = true;
      }
    }
    return { salaryMod: Math.round(salaryMod * 100) / 100, xpMod: Math.round(xpMod * 100) / 100, hiringFrozen, strikeActive };
  }, [activeEvents]);

  // Get effective salary for display
  const getEffectiveSalary = useCallback((baseSalary: number, sectorId: string) => {
    const { salaryMod } = getSectorModifiers(sectorId);
    return Math.floor(baseSalary * salaryMod);
  }, [getSectorModifiers]);

  const currentJobMods = activeJob ? getSectorModifiers(activeJob.sectorId) : { salaryMod: 1, xpMod: 1, hiringFrozen: false, strikeActive: false };
  const effectiveSalary = activeJob ? getEffectiveSalary(activeJob.salary, activeJob.sectorId) : 0;

  const todayTasks = activeJob && !currentJobMods.strikeActive
    ? (workTaskTemplates[activeJob.sectorId] || workTaskTemplates.tech).slice(0, activeJob.tasksPerDay)
    : [];

  const completedCount = completedTasks.size;
  const allDone = activeJob ? completedCount >= activeJob.tasksPerDay : false;
  const dailyProgress = activeJob ? (completedCount / activeJob.tasksPerDay) * 100 : 0;
  const earnedToday = activeJob ? Math.floor((completedCount / activeJob.tasksPerDay) * effectiveSalary) : 0;

  // Find next position for promotion
  const getNextPosition = useCallback(() => {
    if (!activeJob) return null;
    const sector = sectors.find((s) => s.companies.some((c) => c.id === activeJob.companyId));
    if (!sector) return null;
    const company = sector.companies.find((c) => c.id === activeJob.companyId);
    if (!company) return null;
    const nextIdx = activeJob.positionIndex + 1;
    if (nextIdx >= company.positions.length) return null;
    return { position: company.positions[nextIdx], index: nextIdx, company, sector };
  }, [activeJob]);

  const nextPromo = getNextPosition();
  const canPromote = activeJob && activeJob.promoDays > 0 && activeJob.consecutiveDays >= activeJob.promoDays && nextPromo && userLevel >= nextPromo.position.level;
  const promoProgress = activeJob && activeJob.promoDays > 0
    ? Math.min(100, (activeJob.consecutiveDays / activeJob.promoDays) * 100)
    : 0;

  const handleCompleteTask = (index: number) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  // Check if all tasks done → increment consecutive days (simulated)
  useEffect(() => {
    if (allDone && activeJob) {
      // Simulate incrementing consecutive days on all-tasks-done
      const timer = setTimeout(() => {
        setActiveJob((prev) => prev ? { ...prev, consecutiveDays: prev.consecutiveDays + 1 } : null);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [allDone]);

  const handlePromote = useCallback(() => {
    if (!activeJob || !nextPromo) return;
    const bonusReward = Math.floor(nextPromo.position.salary * 2);

    setShowPromotion({
      oldPosition: activeJob.position,
      newPosition: nextPromo.position.title,
      oldSalary: activeJob.salary,
      newSalary: nextPromo.position.salary,
      companyName: activeJob.companyName,
      companyLogo: activeJob.companyLogo,
      bonusReward,
    });
    setPromotionStep(0);

    // Animate steps
    setTimeout(() => setPromotionStep(1), 600);
    setTimeout(() => setPromotionStep(2), 1400);
    setTimeout(() => setPromotionStep(3), 2200);
  }, [activeJob, nextPromo]);

  const confirmPromotion = useCallback(() => {
    if (!activeJob || !nextPromo || !showPromotion) return;

    setActiveJob({
      ...activeJob,
      positionIndex: nextPromo.index,
      position: nextPromo.position.title,
      salary: nextPromo.position.salary,
      tasksPerDay: nextPromo.position.tasks,
      xpPerDay: nextPromo.position.xp,
      promoDays: nextPromo.position.promoDays,
      consecutiveDays: 0,
    });
    setCompletedTasks(new Set());
    setReputation((r) => Math.min(100, r + 5));
    setPromotionHistory((prev) => [
      { from: showPromotion.oldPosition, to: showPromotion.newPosition, company: showPromotion.companyName, date: "Just now" },
      ...prev,
    ]);
    setShowPromotion(null);
    setPromotionStep(0);
  }, [activeJob, nextPromo, showPromotion]);

  const handleApply = () => {
    if (!showApplyModal) return;
    const { company, position, positionIndex, sectorId } = showApplyModal;
    setActiveJob({
      companyId: company.id,
      companyName: company.name,
      companyLogo: company.logo,
      sectorId,
      positionIndex,
      position: position.title,
      salary: position.salary,
      tasksPerDay: position.tasks,
      xpPerDay: position.xp,
      promoDays: position.promoDays,
      consecutiveDays: 0,
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

        {/* ══ Active Economic Events ══ */}
        {activeEvents.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Newspaper size={14} className="text-primary" />
              <p className="text-xs font-display font-semibold">Economic Events</p>
              <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-body">{activeEvents.length} active</span>
            </div>
            {activeEvents.filter((ev) => !dismissedEvents.has(ev.id)).map((ev) => {
              const config = eventTypeConfig[ev.type];
              const EventIcon = config.icon;
              const affectedLabel = ev.affectedSectors.length === 0
                ? "All Sectors"
                : ev.affectedSectors.map((s) => sectors.find((sec) => sec.id === s)?.name || s).join(", ");
              const salaryLabel = ev.salaryMod === 0
                ? "Halted"
                : ev.salaryMod > 1
                ? `+${Math.round((ev.salaryMod - 1) * 100)}%`
                : `${Math.round((ev.salaryMod - 1) * 100)}%`;

              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`card-clean overflow-hidden border ${config.border}`}
                >
                  <button
                    onClick={() => setExpandedEvent(expandedEvent === ev.id ? null : ev.id)}
                    className="w-full p-3 flex items-start gap-3 tap-shrink text-left"
                  >
                    <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-base">{ev.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-display font-bold">{ev.title}</p>
                        <span className={`text-[9px] uppercase tracking-wider font-body px-1.5 py-0.5 rounded-md ${config.bg} ${config.color}`}>
                          {ev.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-body line-clamp-1">{ev.description}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className={`text-[10px] font-display font-bold ${ev.isPositive ? "text-success" : "text-destructive"}`}>
                          Salary: {salaryLabel}
                        </span>
                        {ev.hiringFreeze && (
                          <span className="text-[9px] text-destructive font-body flex items-center gap-0.5">
                            <Ban size={8} /> Hiring Frozen
                          </span>
                        )}
                        <span className="text-[9px] text-muted-foreground font-body flex items-center gap-0.5 ml-auto">
                          <Clock size={8} /> {ev.endsIn}
                        </span>
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedEvent === ev.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 border-t border-border/30 pt-2.5 space-y-2">
                          <p className="text-[10px] text-muted-foreground font-body">{ev.description}</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-secondary/50 rounded-lg p-2">
                              <p className="text-[9px] text-muted-foreground font-body">Affected</p>
                              <p className="text-[10px] font-display font-semibold">{affectedLabel}</p>
                            </div>
                            <div className="bg-secondary/50 rounded-lg p-2">
                              <p className="text-[9px] text-muted-foreground font-body">Duration</p>
                              <p className="text-[10px] font-display font-semibold">{ev.duration}</p>
                            </div>
                            <div className="bg-secondary/50 rounded-lg p-2">
                              <p className="text-[9px] text-muted-foreground font-body">Salary Impact</p>
                              <p className={`text-[10px] font-display font-bold ${ev.isPositive ? "text-success" : "text-destructive"}`}>
                                {ev.salaryMod === 0 ? "⛔ Halted" : `×${ev.salaryMod}`}
                              </p>
                            </div>
                            <div className="bg-secondary/50 rounded-lg p-2">
                              <p className="text-[9px] text-muted-foreground font-body">XP Impact</p>
                              <p className={`text-[10px] font-display font-bold ${ev.xpMod >= 1 ? "text-success" : "text-destructive"}`}>
                                ×{ev.xpMod}
                              </p>
                            </div>
                          </div>
                          {ev.hiringFreeze && (
                            <div className="flex items-center gap-2 bg-destructive/5 border border-destructive/20 rounded-lg p-2">
                              <ShieldAlert size={12} className="text-destructive" />
                              <p className="text-[9px] font-body text-destructive">New applications are frozen during this event</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </section>
        )}

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

              {/* Promotion Progress */}
              {activeJob.promoDays > 0 && nextPromo && (
                <div className="px-4 pt-3 pb-1">
                  <div className="bg-gradient-to-r from-warning/5 to-warning/10 border border-warning/20 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-warning/15 flex items-center justify-center">
                          <ChevronUp size={14} className="text-warning" />
                        </div>
                        <div>
                          <p className="text-[10px] font-display font-semibold flex items-center gap-1">
                            Next: {nextPromo.position.title}
                            <Sparkles size={10} className="text-warning" />
                          </p>
                          <p className="text-[9px] text-muted-foreground font-body">
                            {activeJob.consecutiveDays}/{activeJob.promoDays} days consistent work
                          </p>
                        </div>
                      </div>
                      {canPromote ? (
                        <motion.button
                          onClick={handlePromote}
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="px-3 py-1.5 rounded-lg bg-warning text-warning-foreground text-[10px] font-body font-bold tap-shrink flex items-center gap-1"
                        >
                          <Trophy size={11} />
                          Claim Promotion!
                        </motion.button>
                      ) : (
                        <span className="text-[10px] font-display font-bold text-warning">
                          {Math.round(promoProgress)}%
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 rounded-full bg-warning/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-warning"
                        animate={{ width: `${promoProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-muted-foreground font-body">
                      <span>Salary: {activeJob.salary} → {nextPromo.position.salary} $MINE</span>
                      <span>+{((nextPromo.position.salary - activeJob.salary) / activeJob.salary * 100).toFixed(0)}% raise</span>
                    </div>
                  </div>
                </div>
              )}

              {/* At max position badge */}
              {activeJob.promoDays === 0 && (
                <div className="px-4 pt-3 pb-1">
                  <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl p-2.5">
                    <Trophy size={14} className="text-primary" />
                    <p className="text-[10px] font-body text-primary font-medium">Top position — you've reached the highest rank at this company</p>
                  </div>
                </div>
              )}

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

        {/* Promotion History */}
        {promotionHistory.length > 0 && (
          <section>
            <h2 className="font-display font-semibold text-[15px] mb-3 flex items-center gap-2">
              <Trophy size={15} className="text-warning" />
              Promotion History
            </h2>
            <div className="space-y-2">
              {promotionHistory.map((promo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card-clean p-3 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                    <ChevronUp size={14} className="text-warning" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-body">
                      <span className="text-muted-foreground">{promo.from}</span>
                      <ArrowRight size={10} className="inline mx-1.5 text-warning" />
                      <span className="font-semibold">{promo.to}</span>
                    </p>
                    <p className="text-[9px] text-muted-foreground font-body">{promo.company}</p>
                  </div>
                  <span className="text-[9px] text-muted-foreground font-body">{promo.date}</span>
                </motion.div>
              ))}
            </div>
          </section>
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
                            {company.positions.map((pos, posIdx) => {
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
                                      {pos.promoDays > 0 && (
                                        <span className="text-[10px] text-warning font-body flex items-center gap-0.5">
                                          <ChevronUp size={9} /> {pos.promoDays}d promo
                                        </span>
                                      )}
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
                                        setShowApplyModal({ company, position: pos, positionIndex: posIdx, sectorId: sector.id });
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

        {/* Economy Info */}
        <div className="card-clean p-4 space-y-3">
          <p className="text-xs font-display font-semibold">How Wage Economy Works</p>
          <div className="space-y-2.5">
            {[
              { icon: "💼", title: "Work Daily", desc: "Complete tasks at your company to earn $MINE salary" },
              { icon: "📈", title: "Get Promoted", desc: "Work consistently to unlock higher positions & salaries" },
              { icon: "💰", title: "Earn & Spend", desc: "Use $MINE for upgrades, swaps, staking, and more" },
              { icon: "🏛️", title: "Taxes Sustain", desc: "5% salary tax + transaction fees fund the Treasury" },
              { icon: "🔄", title: "Treasury Reinvests", desc: "Funds flow back into UBI, rewards & liquidity pools" },
              { icon: "💎", title: "Convert to $WAGE", desc: "Swap earned $MINE to scarce $WAGE for real value" },
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
                {showApplyModal.position.promoDays > 0 && (
                  <div className="flex justify-between text-xs font-body">
                    <span className="text-muted-foreground">Promotion after</span>
                    <span className="text-warning font-medium">{showApplyModal.position.promoDays} days</span>
                  </div>
                )}
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

      {/* ══════ PROMOTION CEREMONY MODAL ══════ */}
      <AnimatePresence>
        {showPromotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-hidden"
          >
            {/* Confetti */}
            {promotionStep >= 2 && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 40 }).map((_, i) => (
                  <ConfettiParticle key={i} index={i} />
                ))}
              </div>
            )}

            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="card-clean p-8 w-full max-w-sm space-y-5 text-center relative z-10"
            >
              {/* Step 0: Trophy appears */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, damping: 12 }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-br from-warning/20 to-warning/5 flex items-center justify-center mx-auto"
              >
                <motion.div
                  animate={promotionStep >= 2 ? { rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <Trophy size={40} className="text-warning" />
                </motion.div>
              </motion.div>

              {/* Step 1: Title */}
              <AnimatePresence mode="wait">
                {promotionStep >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <PartyPopper size={18} className="text-warning" />
                      <h2 className="font-display font-bold text-xl">Promotion!</h2>
                      <PartyPopper size={18} className="text-warning" style={{ transform: "scaleX(-1)" }} />
                    </div>
                    <p className="text-xs text-muted-foreground font-body">{showPromotion.companyName}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 2: Details */}
              <AnimatePresence>
                {promotionStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    {/* Position change */}
                    <div className="flex items-center justify-center gap-3">
                      <div className="bg-secondary/60 rounded-xl px-3 py-2 text-center">
                        <p className="text-[9px] text-muted-foreground font-body uppercase">From</p>
                        <p className="text-xs font-display font-semibold">{showPromotion.oldPosition}</p>
                      </div>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <ArrowRight size={18} className="text-warning" />
                      </motion.div>
                      <div className="bg-warning/10 border border-warning/30 rounded-xl px-3 py-2 text-center">
                        <p className="text-[9px] text-warning font-body uppercase">To</p>
                        <p className="text-xs font-display font-bold text-warning">{showPromotion.newPosition}</p>
                      </div>
                    </div>

                    {/* Salary increase */}
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-3"
                    >
                      <p className="text-[9px] text-muted-foreground font-body uppercase mb-1">Salary Increase</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-muted-foreground font-display line-through">{showPromotion.oldSalary}</span>
                        <ArrowRight size={14} className="text-primary" />
                        <span className="text-lg font-display font-bold text-primary">{showPromotion.newSalary}</span>
                        <span className="text-xs text-muted-foreground font-body">$MINE/day</span>
                      </div>
                      <p className="text-[10px] text-success font-body font-medium mt-1">
                        +{((showPromotion.newSalary - showPromotion.oldSalary) / showPromotion.oldSalary * 100).toFixed(0)}% raise!
                      </p>
                    </motion.div>

                    {/* Bonus */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center justify-center gap-2 text-sm"
                    >
                      <Sparkles size={14} className="text-warning" />
                      <span className="font-body text-muted-foreground">Promotion Bonus:</span>
                      <span className="font-display font-bold text-primary flex items-center gap-1">
                        <CoinIcon type="mine" size={14} />
                        {showPromotion.bonusReward} $MINE
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step 3: Accept button */}
              <AnimatePresence>
                {promotionStep >= 3 && (
                  <motion.button
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    onClick={confirmPromotion}
                    className="w-full py-3 rounded-xl bg-warning text-warning-foreground font-display font-bold text-sm tap-shrink flex items-center justify-center gap-2"
                  >
                    <Trophy size={16} />
                    Accept Promotion
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobsPage;
