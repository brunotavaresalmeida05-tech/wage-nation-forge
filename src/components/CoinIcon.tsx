import coinWDark from "@/assets/coin-w-dark.png";
import coinWLight from "@/assets/coin-w-light.png";
import coinMDark from "@/assets/coin-m-dark.png";
import coinWGold from "@/assets/coin-w-gold.png";
import { useTheme } from "@/hooks/useTheme";

interface CoinIconProps {
  type: "wage" | "mine";
  size?: number;
  className?: string;
  variant?: "default" | "gold";
}

const CoinIcon = ({ type, size = 32, className = "", variant = "default" }: CoinIconProps) => {
  const { theme } = useTheme();
  
  const getSrc = () => {
    if (type === "mine") return coinMDark; // M coin works for both themes (black/white outline)
    if (variant === "gold") return coinWGold;
    return theme === "light" ? coinWDark : coinWLight;
  };

  return (
    <img
      src={getSrc()}
      alt={type === "wage" ? "$WAGE" : "$MINE"}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      draggable={false}
    />
  );
};

export default CoinIcon;
