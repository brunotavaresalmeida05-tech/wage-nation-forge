import { useState } from "react";
import { NavLink, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Pickaxe, ArrowDownUp, BarChart3, User, Building2, PieChart,
  Landmark, Globe, CreditCard, TrendingUp, Menu, X, Search, Bell,
  Wallet, RefreshCw, HandCoins
} from "lucide-react";
import CoinIcon from "./CoinIcon";

const mainNav = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/mine", icon: Pickaxe, label: "Mine" },
  { path: "/swap", icon: ArrowDownUp, label: "Swap" },
  { path: "/market", icon: BarChart3, label: "Market" },
  { path: "/invest", icon: TrendingUp, label: "Invest" },
];

const moreNav = [
  { path: "/vault", icon: Landmark, label: "Vault" },
  { path: "/ubi", icon: Globe, label: "UBI" },
  { path: "/wagepay", icon: CreditCard, label: "WagePay" },
  { path: "/exchange", icon: RefreshCw, label: "Exchange" },
  { path: "/bank-cards", icon: Wallet, label: "Cards" },
  { path: "/credit", icon: HandCoins, label: "Credit" },
  { path: "/profile", icon: User, label: "Profile" },
  { path: "/real-estate", icon: Building2, label: "Real Estate" },
  { path: "/etfs", icon: PieChart, label: "ETFs" },
];

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] min-w-[220px] border-r border-border/50 bg-sidebar fixed h-full z-50">
        <div className="h-16 flex items-center px-5 border-b border-border/30">
          <CoinIcon type="wage" size={30} className="mr-2.5" />
          <span className="font-display font-bold text-lg">Wage</span>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 mb-2 font-body">Main</p>
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <Icon size={18} strokeWidth={isActive(item.path) ? 2.2 : 1.8} />
                {item.label}
              </NavLink>
            );
          })}

          <div className="h-px bg-border/30 my-3" />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 mb-2 font-body">More</p>
          {moreNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <Icon size={18} strokeWidth={isActive(item.path) ? 2.2 : 1.8} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/30">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xs font-display font-semibold text-muted-foreground">JD</span>
            </div>
            <div>
              <p className="text-sm font-display font-medium">Worker #4821</p>
              <p className="text-[10px] text-muted-foreground font-body">Level 3</p>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Hamburger Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[260px] bg-card border-r border-border/50 z-50 flex flex-col"
            >
              <div className="h-14 flex items-center justify-between px-5 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <CoinIcon type="wage" size={26} />
                  <span className="font-display font-bold">Wage</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="tap-shrink p-1">
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>

              <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                {[...mainNav, ...moreNav].map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors ${
                        isActive(item.path)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
          >
            <div className="max-w-lg mx-auto px-5 pt-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 flex items-center gap-2 bg-secondary rounded-xl px-4 py-3">
                  <Search size={18} className="text-muted-foreground" />
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search assets, tokens, stocks..."
                    className="flex-1 bg-transparent outline-none font-body text-sm placeholder:text-muted-foreground"
                  />
                </div>
                <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-sm font-body text-primary tap-shrink">
                  Cancel
                </button>
              </div>
              {!searchQuery && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground font-body">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["$WAGE", "Bitcoin", "Ethereum", "Real Estate", "ETFs", "Vault"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSearchQuery(s)}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-body text-muted-foreground tap-shrink hover:text-foreground transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[220px] flex flex-col min-h-screen w-full min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden tap-shrink">
                <Menu size={22} className="text-foreground" />
              </button>
              <div className="flex items-center gap-2 lg:hidden">
                <CoinIcon type="wage" size={26} />
                <span className="font-display font-bold text-[15px]">Wage</span>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2 bg-secondary rounded-lg px-4 py-2 text-sm text-muted-foreground font-body hover:bg-secondary/80 transition-colors"
              >
                <Search size={16} />
                Search assets, tokens...
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(true)} className="lg:hidden w-8 h-8 rounded-full bg-secondary flex items-center justify-center tap-shrink">
                <Search size={16} className="text-muted-foreground" />
              </button>
              <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center tap-shrink">
                <Bell size={16} className="text-muted-foreground" />
              </button>
              <div className="hidden lg:flex w-8 h-8 rounded-full bg-secondary items-center justify-center">
                <span className="text-xs font-display font-semibold text-muted-foreground">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full min-w-0 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/40 safe-bottom">
          <div className="flex items-center justify-around h-[58px] max-w-lg mx-auto px-2">
            {mainNav.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              const isSwap = item.path === "/swap";
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col items-center gap-0.5 py-1.5 px-3 tap-shrink"
                >
                  {active && !isSwap && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {isSwap ? (
                    <div className={`w-10 h-10 -mt-3 rounded-full flex items-center justify-center ${active ? "bg-primary shadow-glow-primary" : "bg-secondary"}`}>
                      <Icon size={20} strokeWidth={2} className={active ? "text-primary-foreground" : "text-muted-foreground"} />
                    </div>
                  ) : (
                    <Icon
                      size={21}
                      strokeWidth={active ? 2.2 : 1.8}
                      className={`transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                    />
                  )}
                  {!isSwap && (
                    <span className={`text-[10px] font-body transition-colors ${active ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;
