import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, ChevronDown, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

const TOKENS = [
  { symbol: "$WAGE", name: "WageCoin", balance: 42.5, usdPrice: 0.85, icon: "W" },
  { symbol: "$MINE", name: "MineCoin", balance: 1250, usdPrice: 0.00085, icon: "M" },
  { symbol: "USDT", name: "Tether", balance: 0, usdPrice: 1.0, icon: "U" },
  { symbol: "BTC", name: "Bitcoin", balance: 0, usdPrice: 97420, icon: "₿" },
  { symbol: "ETH", name: "Ethereum", balance: 0, usdPrice: 3850, icon: "Ξ" },
  { symbol: "EUR", name: "Euro", balance: 0, usdPrice: 1.08, icon: "€" },
  { symbol: "USD", name: "US Dollar", balance: 0, usdPrice: 1.0, icon: "$" },
  { symbol: "GBP", name: "British Pound", balance: 0, usdPrice: 1.27, icon: "£" },
];

// Mock price history
const PRICE_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  price: 0.65 + Math.sin(i / 4) * 0.1 + (i / 30) * 0.2 + (Math.random() - 0.5) * 0.05,
}));

const SwapPage = () => {
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[2]);
  const [fromAmount, setFromAmount] = useState("");
  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);

  const fromNum = parseFloat(fromAmount) || 0;
  const rate = fromToken.usdPrice / toToken.usdPrice;
  const toAmount = fromNum * rate;
  const fee = fromNum * 0.003;

  const handleSwapDirection = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount("");
  };

  const TokenSelector = ({
    selected, show, onToggle, onSelect, exclude,
  }: {
    selected: typeof TOKENS[0]; show: boolean; onToggle: () => void;
    onSelect: (t: typeof TOKENS[0]) => void; exclude: string;
  }) => (
    <div className="relative">
      <button onClick={onToggle} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary tap-shrink">
        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
          <span className="text-xs font-display font-bold text-primary">{selected.icon}</span>
        </div>
        <span className="text-sm font-display font-semibold">{selected.symbol}</span>
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 top-12 left-0 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
        >
          {TOKENS.filter((t) => t.symbol !== exclude).map((t) => (
            <button
              key={t.symbol}
              onClick={() => { onSelect(t); onToggle(); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors tap-shrink"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-display font-bold text-primary">{t.icon}</span>
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-display font-semibold">{t.symbol}</p>
                <p className="text-[10px] text-muted-foreground font-body">{t.name}</p>
              </div>
              {t.balance > 0 && (
                <span className="text-[11px] text-muted-foreground font-body">{t.balance}</span>
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-6">
          {/* Price Chart */}
          <div className="space-y-5 min-w-0">
            <div>
              <h1 className="font-display font-bold text-xl lg:text-2xl">Swap</h1>
              <p className="text-xs text-muted-foreground font-body mt-0.5">Convert any token instantly</p>
            </div>

            {/* Price Chart */}
            <div className="card-clean p-4 lg:p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-body">$WAGE / USD</p>
                  <p className="text-2xl font-display font-bold">$0.85</p>
                  <p className="text-xs text-success font-body font-medium">+5.2% (30d)</p>
                </div>
                <div className="flex gap-1">
                  {["1D", "7D", "30D", "1Y"].map((p) => (
                    <button
                      key={p}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-body tap-shrink ${
                        p === "30D" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-48 lg:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PRICE_HISTORY}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(214, 99%, 60%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(214, 99%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" hide />
                    <YAxis domain={["auto", "auto"]} hide />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(220, 12%, 8%)",
                        border: "1px solid hsl(220, 12%, 14%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`$${value.toFixed(4)}`, "$WAGE"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(214, 99%, 60%)"
                      strokeWidth={2}
                      fill="url(#priceGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fiat Offramp - Desktop */}
            <div className="hidden lg:block card-clean p-5">
              <h3 className="font-display font-semibold text-base mb-2">Send to Bank</h3>
              <p className="text-xs text-muted-foreground font-body mb-4">
                Convert $WAGE to local currency and send directly to your bank account.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { currency: "USD", label: "ACH / Wire", flag: "🇺🇸" },
                  { currency: "EUR", label: "SEPA", flag: "🇪🇺" },
                  { currency: "GBP", label: "Faster Payments", flag: "🇬🇧" },
                ].map((opt) => (
                  <button key={opt.currency} className="card-clean p-3.5 text-center tap-shrink hover:border-primary/30 transition-colors">
                    <span className="text-xl">{opt.flag}</span>
                    <p className="text-sm font-display font-semibold mt-1">{opt.currency}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{opt.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Swap Card */}
          <div className="space-y-4 mt-5 lg:mt-0 min-w-0">
            {/* From */}
            <div className="card-clean p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs text-muted-foreground font-body">From</label>
                <span className="text-[11px] text-muted-foreground font-body">
                  Balance: {fromToken.balance} {fromToken.symbol}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <TokenSelector
                  selected={fromToken} show={showFromList}
                  onToggle={() => { setShowFromList(!showFromList); setShowToList(false); }}
                  onSelect={setFromToken} exclude={toToken.symbol}
                />
                <input
                  type="number" value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 text-right bg-transparent outline-none font-display font-bold text-2xl placeholder:text-muted-foreground min-w-0"
                />
              </div>
              <div className="flex gap-2 mt-3">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setFromAmount(((fromToken.balance * pct) / 100).toString())}
                    className="flex-1 py-1.5 rounded-md bg-secondary text-[11px] font-body font-medium tap-shrink hover:bg-primary/10 transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Swap Direction */}
            <div className="flex justify-center -my-1">
              <motion.button
                whileTap={{ rotate: 180 }}
                onClick={handleSwapDirection}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-glow-primary tap-shrink"
              >
                <ArrowDownUp size={16} className="text-primary-foreground" />
              </motion.button>
            </div>

            {/* To */}
            <div className="card-clean p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs text-muted-foreground font-body">To</label>
                <span className="text-[11px] text-muted-foreground font-body">
                  Balance: {toToken.balance} {toToken.symbol}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <TokenSelector
                  selected={toToken} show={showToList}
                  onToggle={() => { setShowToList(!showToList); setShowFromList(false); }}
                  onSelect={setToToken} exclude={fromToken.symbol}
                />
                <span className="flex-1 text-right font-display font-bold text-2xl text-primary">
                  {toAmount > 0 ? toAmount.toFixed(toToken.usdPrice >= 1 ? 2 : 6) : "0.00"}
                </span>
              </div>
            </div>

            {/* Rate Info */}
            {fromNum > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-clean p-3.5 space-y-2">
                <div className="flex justify-between text-[11px] font-body">
                  <span className="text-muted-foreground">Rate</span>
                  <span>1 {fromToken.symbol} = {rate.toFixed(rate >= 1 ? 4 : 8)} {toToken.symbol}</span>
                </div>
                <div className="flex justify-between text-[11px] font-body">
                  <span className="text-muted-foreground">Fee (0.3%)</span>
                  <span>{fee.toFixed(4)} {fromToken.symbol}</span>
                </div>
                <div className="flex justify-between text-xs font-body font-semibold pt-2 border-t border-border">
                  <span>You receive</span>
                  <span className="text-primary">{(toAmount * 0.997).toFixed(toToken.usdPrice >= 1 ? 2 : 6)} {toToken.symbol}</span>
                </div>
              </motion.div>
            )}

            {/* Swap Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={fromNum <= 0 || fromNum > fromToken.balance}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm disabled:opacity-30 tap-shrink"
            >
              {fromNum > fromToken.balance
                ? "Insufficient balance"
                : fromNum <= 0
                ? "Enter amount"
                : `Swap ${fromToken.symbol} → ${toToken.symbol}`}
            </motion.button>

            {/* Mobile Fiat Offramp */}
            <div className="lg:hidden card-clean p-4">
              <h3 className="font-display font-semibold text-sm mb-2">Send to Bank</h3>
              <p className="text-[11px] text-muted-foreground font-body mb-3">
                Convert to local currency and send to your bank.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { currency: "USD", label: "ACH / Wire", flag: "🇺🇸" },
                  { currency: "EUR", label: "SEPA", flag: "🇪🇺" },
                  { currency: "GBP", label: "Faster Payments", flag: "🇬🇧" },
                ].map((opt) => (
                  <button key={opt.currency} className="card-clean p-2.5 text-center tap-shrink hover:border-primary/30 transition-colors">
                    <span className="text-lg">{opt.flag}</span>
                    <p className="text-xs font-display font-semibold mt-1">{opt.currency}</p>
                    <p className="text-[10px] text-muted-foreground font-body">{opt.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
