import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Pickaxe, BarChart3, Building2, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/mine", icon: Pickaxe, label: "Mine" },
  { path: "/market", icon: BarChart3, label: "Mercado" },
  { path: "/invest", icon: Building2, label: "Investir" },
  { path: "/profile", icon: User, label: "Perfil" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/60 safe-bottom">
      <div className="flex items-center justify-around h-[60px] max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-0.5 py-1.5 px-4 tap-shrink"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={`transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`text-[10px] font-body transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
