import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const modules = [
  {
    title: "Real Estate",
    description: "Compra imóveis, recebe rendas diárias em $WAGE",
    icon: "🏢",
    route: "/real-estate",
    stats: "3 imóveis • 3.6 $W/dia",
    color: "border-gold/30 bg-gold/5",
  },
  {
    title: "Setores & Ações",
    description: "12 setores económicos com ações sintéticas",
    icon: "📈",
    route: "/sectors",
    stats: "5 ações • +12.3%",
    color: "border-info/30 bg-info/5",
  },
  {
    title: "ETFs Sintéticos",
    description: "3 perfis de investidor com diversificação automática",
    icon: "📊",
    route: "/etfs",
    stats: "2 ETFs • 0.55%/dia",
    color: "border-primary/30 bg-primary/5",
  },
  {
    title: "Exchange",
    description: "Converte $MINE em $WAGE e vice-versa",
    icon: "🔄",
    route: "/exchange",
    stats: "1,000 $M = 1 $W",
    color: "border-border",
  },
  {
    title: "WageBonds",
    description: "Títulos de renda fixa com juros garantidos",
    icon: "📄",
    route: "/market",
    stats: "15-40% APY",
    color: "border-[hsl(var(--epic)/.3)] bg-[hsl(var(--epic)/.05)]",
  },
  {
    title: "Mercado P2P",
    description: "Compra e vende ativos entre utilizadores",
    icon: "🤝",
    route: "/market",
    stats: "Taxa: 2.5%",
    color: "border-border",
  },
  {
    title: "Vault Soberano",
    description: "Staking com APY de 5% a 200% conforme duração do lock",
    icon: "🏛️",
    route: "/vault",
    stats: "Até 200% APY",
    color: "border-primary/30 bg-primary/5",
  },
  {
    title: "WagePay",
    description: "Enviar e receber $WAGE via QR e P2P",
    icon: "💸",
    route: "/wagepay",
    stats: "Instantâneo",
    color: "border-border",
  },
];

const portfolio = [
  { label: "Portfolio Total", value: "4,830 $W", change: "+5.2%", positive: true },
  { label: "Rendimento/dia", value: "12.4 $W", change: "+0.8%", positive: true },
  { label: "Dividendos (mês)", value: "64.7 $W", change: "", positive: true },
];

const InvestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto flex items-center px-4 h-14">
          <h1 className="font-display font-bold text-lg">🏢 Investimentos</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-3 gap-2">
          {portfolio.map((p) => (
            <div key={p.label} className="rounded-xl bg-gradient-card border border-border p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-body">{p.label}</p>
              <p className="text-sm font-display font-bold mt-0.5">{p.value}</p>
              {p.change && (
                <p className={`text-[10px] font-body ${p.positive ? "text-primary" : "text-destructive"}`}>{p.change}</p>
              )}
            </div>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="space-y-3">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(mod.route)}
              className={`rounded-xl border-2 ${mod.color} p-4 cursor-pointer tap-shrink card-shine`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-sm">{mod.title}</h3>
                  <p className="text-[10px] text-muted-foreground font-body">{mod.description}</p>
                  <p className="text-[10px] text-primary font-body mt-0.5">{mod.stats}</p>
                </div>
                <span className="text-muted-foreground text-lg">›</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestPage;
