import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, TrendingUp, PieChart, RefreshCw, FileText, Users, Landmark, CreditCard, ChevronRight } from "lucide-react";

const modules = [
  { title: "Real Estate", description: "Compra imóveis, recebe rendas diárias em $WAGE", icon: Building2, route: "/real-estate", stats: "3 imóveis • 3.6 $W/dia", accent: "text-gold" },
  { title: "Setores & Ações", description: "12 setores económicos com ações sintéticas", icon: TrendingUp, route: "/sectors", stats: "5 ações • +12.3%", accent: "text-info" },
  { title: "ETFs Sintéticos", description: "3 perfis de investidor com diversificação automática", icon: PieChart, route: "/etfs", stats: "2 ETFs • 0.55%/dia", accent: "text-primary" },
  { title: "Exchange", description: "Converte $MINE em $WAGE e vice-versa", icon: RefreshCw, route: "/exchange", stats: "1,000 $M = 1 $W", accent: "text-foreground" },
  { title: "WageBonds", description: "Títulos de renda fixa com juros garantidos", icon: FileText, route: "/market", stats: "15-40% APY", accent: "text-[hsl(265_60%_55%)]" },
  { title: "Mercado P2P", description: "Compra e vende ativos entre utilizadores", icon: Users, route: "/market", stats: "Taxa: 2.5%", accent: "text-foreground" },
  { title: "Vault Soberano", description: "Staking com APY de 5% a 200% conforme duração", icon: Landmark, route: "/vault", stats: "Até 200% APY", accent: "text-primary" },
  { title: "WagePay", description: "Enviar e receber $WAGE via QR e P2P", icon: CreditCard, route: "/wagepay", stats: "Instantâneo", accent: "text-foreground" },
];

const portfolio = [
  { label: "Portfolio Total", value: "4,830 $W", change: "+5.2%", positive: true },
  { label: "Rendimento/dia", value: "12.4 $W", change: "+0.8%", positive: true },
  { label: "Dividendos (mês)", value: "64.7 $W", change: "", positive: true },
];

const InvestPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        <h1 className="font-display font-bold text-xl lg:text-2xl">Investimentos</h1>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-3 gap-2.5">
          {portfolio.map((p) => (
            <div key={p.label} className="card-clean p-3 text-center">
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{p.label}</p>
              <p className="text-sm font-display font-bold mt-0.5">{p.value}</p>
              {p.change && (
                <p className={`text-[10px] font-body font-medium ${p.positive ? "text-success" : "text-destructive"}`}>{p.change}</p>
              )}
            </div>
          ))}
        </div>

        {/* Modules */}
        <div className="space-y-2.5">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(mod.route)}
                className="card-clean p-4 cursor-pointer tap-shrink"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon size={20} className={mod.accent} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-sm">{mod.title}</h3>
                    <p className="text-[11px] text-muted-foreground font-body">{mod.description}</p>
                    <p className="text-[11px] text-primary font-body font-medium mt-0.5">{mod.stats}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InvestPage;
