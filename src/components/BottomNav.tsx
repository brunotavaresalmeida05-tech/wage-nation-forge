import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: "🏠", label: "Home" },
  { path: "/mine", icon: "⛏️", label: "Mine" },
  { path: "/exchange", icon: "🔄", label: "Exchange" },
  { path: "/market", icon: "📊", label: "Market" },
  { path: "/profile", icon: "👤", label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-0.5 py-1 px-3 tap-shrink"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`text-xl transition-transform ${isActive ? "scale-110" : ""}`}>{item.icon}</span>
              <span
                className={`text-[10px] font-body transition-colors ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
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
