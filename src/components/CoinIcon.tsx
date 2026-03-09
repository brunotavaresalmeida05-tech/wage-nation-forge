import { useTheme } from "@/hooks/useTheme";

interface CoinIconProps {
  type: "wage" | "mine";
  size?: number;
  className?: string;
  variant?: "default" | "gold";
}

const MeanderCoin = ({ letter, color, size }: { letter: string; color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer circle */}
    <circle cx="100" cy="100" r="96" stroke={color} strokeWidth="4" fill="none" />
    {/* Greek key / meander pattern ring */}
    <g stroke={color} strokeWidth="3" fill="none">
      {/* Outer meander segments - 16 segments around the circle */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 22.5) * Math.PI / 180;
        const r1 = 88, r2 = 72;
        const cx1 = 100 + r1 * Math.cos(angle);
        const cy1 = 100 + r1 * Math.sin(angle);
        const cx2 = 100 + r2 * Math.cos(angle);
        const cy2 = 100 + r2 * Math.sin(angle);
        return <line key={i} x1={cx1} y1={cy1} x2={cx2} y2={cy2} />;
      })}
    </g>
    {/* Outer decorative ring */}
    <circle cx="100" cy="100" r="88" stroke={color} strokeWidth="3" fill="none" />
    {/* Greek key square pattern ring */}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 22.5 + 11.25) * Math.PI / 180;
      const r = 80;
      const cx = 100 + r * Math.cos(angle);
      const cy = 100 + r * Math.sin(angle);
      return (
        <g key={i}>
          <rect
            x={cx - 7}
            y={cy - 7}
            width="14"
            height="14"
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            transform={`rotate(${i * 22.5 + 11.25} ${cx} ${cy})`}
          />
          <circle cx={cx} cy={cy} r="2.5" fill={color} />
        </g>
      );
    })}
    {/* Inner meander band */}
    <circle cx="100" cy="100" r="70" stroke={color} strokeWidth="3" fill="none" />
    {/* Dashed inner decorative ring */}
    <circle cx="100" cy="100" r="64" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
    {/* Inner solid circle */}
    <circle cx="100" cy="100" r="58" stroke={color} strokeWidth="3" fill="none" />
    {/* Center letter */}
    <text
      x="100"
      y="100"
      textAnchor="middle"
      dominantBaseline="central"
      fill={color}
      fontSize="62"
      fontWeight="bold"
      fontFamily="'Inter', 'Arial Black', sans-serif"
    >
      {letter}
    </text>
  </svg>
);

const GoldCoin = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="goldGrad" x1="0" y1="0" x2="200" y2="200">
        <stop offset="0%" stopColor="#D4A843" />
        <stop offset="50%" stopColor="#F5D76E" />
        <stop offset="100%" stopColor="#C5941F" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="96" stroke="url(#goldGrad)" strokeWidth="4" fill="none" />
    <circle cx="100" cy="100" r="88" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 22.5) * Math.PI / 180;
      const r1 = 88, r2 = 72;
      return <line key={i} x1={100 + r1 * Math.cos(angle)} y1={100 + r1 * Math.sin(angle)} x2={100 + r2 * Math.cos(angle)} y2={100 + r2 * Math.sin(angle)} stroke="url(#goldGrad)" strokeWidth="3" />;
    })}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 22.5 + 11.25) * Math.PI / 180;
      const r = 80;
      const cx = 100 + r * Math.cos(angle);
      const cy = 100 + r * Math.sin(angle);
      return (
        <g key={i}>
          <rect x={cx - 7} y={cy - 7} width="14" height="14" stroke="url(#goldGrad)" strokeWidth="2.5" fill="none" transform={`rotate(${i * 22.5 + 11.25} ${cx} ${cy})`} />
          <circle cx={cx} cy={cy} r="2.5" fill="url(#goldGrad)" />
        </g>
      );
    })}
    <circle cx="100" cy="100" r="70" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
    <circle cx="100" cy="100" r="64" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
    <circle cx="100" cy="100" r="58" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
    <text x="100" y="100" textAnchor="middle" dominantBaseline="central" fill="url(#goldGrad)" fontSize="62" fontWeight="bold" fontFamily="'Inter', 'Arial Black', sans-serif">W</text>
  </svg>
);

const CoinIcon = ({ type, size = 32, className = "", variant = "default" }: CoinIconProps) => {
  const { theme } = useTheme();

  if (variant === "gold" && type === "wage") {
    return <span className={`inline-flex ${className}`}><GoldCoin size={size} /></span>;
  }

  const letter = type === "wage" ? "W" : "M";
  // Dark theme = white coin, Light theme = dark coin
  const color = theme === "dark" ? "hsl(0 0% 95%)" : "hsl(0 0% 15%)";

  return (
    <span className={`inline-flex ${className}`}>
      <MeanderCoin letter={letter} color={color} size={size} />
    </span>
  );
};

export default CoinIcon;
