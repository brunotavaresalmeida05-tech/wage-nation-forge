import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowDownUp, ChevronDown, Info } from "lucide-react";

const TOKENS = [
  { symbol: "$WAGE", name: "WageCoin", balance: 42.5, usdPrice: 0.85, icon: "W" },
  { symbol: "$MINE", name: "MineCoin", balance: 1250, usdPrice: 0.00085, icon: "M" },
  { symbol: "USDT", name: "Tether", balance: 0, usdPrice: 1.0, icon: "U" },
  { symbol: "BTC", name: "Bitcoin", balance: 0, usdPrice: 97420, icon: "₿" },
  { symbol: "ETH", name: "Ethereum", balance: 0, usdPrice: 3850, icon: "Ξ" },
  { symbol: "BRL", name: "Real Brasileiro", balance: 0, usdPrice: 0.17, icon: "R$" },
  { symbol: "EUR", name: "Euro", balance: 0, usdPrice: 1.08, icon: "€" },
  { symbol: "USD", name: "US Dollar", balance: 0, usdPrice: 1.0, icon: "$" },
];

const SwapPage = () => {
  const navigate = useNavigate();
  const [fromToken, setFromToken] = useState(TOKENS[0]);
  const [toToken, setToToken] = useState(TOKENS[2]);
  const [fromAmount, setFromAmount] = useState("");
  const [showFromList, setShowFromList] = useState(false);
  const [showToList, setShowToList] = useState(false);

  const fromNum = parseFloat(fromAmount) || 0;
  const rate = fromToken.usdPrice / toToken.usdPrice;
  const toAmount = fromNum * rate;
  const fee = fromNum * 0.003;
  const slippage = 0.5;

  const handleSwapDirection = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount("");
  };

  const TokenSelector = ({
    selected,
    show,
    onToggle,
    onSelect,
    exclude,
  }: {
    selected: typeof TOKENS[0];
    show: boolean;
    onToggle: () => void;
    onSelect: (t: typeof TOKENS[0]) => void;
    exclude: string;
  }) => (
    <div className="relative">
      <button onClick={onToggle} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary tap-shrink">
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-display font-bold text-primary">{selected.icon}</span>
        </div>
        <span className="text-sm font-display font-semibold">{selected.symbol}</span>
        <ChevronDown size={14} className="text-muted-foreground" />
      </button>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 top-12 left-0 right-0 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
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
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-lg mx-auto flex items-center px-5 h-14">
          <button onClick={() => navigate(-1)} className="mr-3 tap-shrink">
            <ChevronLeft size={20} className="text-foreground" />
          </button>
          <h1 className="font-display font-bold text-base">Swap</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-4">
        {/* From */}
        <div className="card-clean p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-muted-foreground font-body">De</label>
            <span className="text-[11px] text-muted-foreground font-body">
              Saldo: {fromToken.balance} {fromToken.symbol}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <TokenSelector
              selected={fromToken}
              show={showFromList}
              onToggle={() => { setShowFromList(!showFromList); setShowToList(false); }}
              onSelect={setFromToken}
              exclude={toToken.symbol}
            />
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 text-right bg-transparent outline-none font-display font-bold text-2xl placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-2 mt-3">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => setFromAmount(((fromToken.balance * pct) / 100).toString())}
                className="flex-1 py-1.5 rounded-lg bg-secondary text-[11px] font-body font-medium tap-shrink hover:bg-primary/10 transition-colors"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <motion.button
            whileTap={{ rotate: 180 }}
            onClick={handleSwapDirection}
            className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shadow-glow-orange tap-shrink"
          >
            <ArrowDownUp size={18} className="text-primary-foreground" />
          </motion.button>
        </div>

        {/* To */}
        <div className="card-clean p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-muted-foreground font-body">Para</label>
            <span className="text-[11px] text-muted-foreground font-body">
              Saldo: {toToken.balance} {toToken.symbol}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <TokenSelector
              selected={toToken}
              show={showToList}
              onToggle={() => { setShowToList(!showToList); setShowFromList(false); }}
              onSelect={setToToken}
              exclude={fromToken.symbol}
            />
            <span className="flex-1 text-right font-display font-bold text-2xl text-primary">
              {toAmount > 0 ? toAmount.toFixed(toToken.usdPrice >= 1 ? 2 : 6) : "0.00"}
            </span>
          </div>
        </div>

        {/* Rate Info */}
        {fromNum > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-clean p-4 space-y-2">
            <div className="flex justify-between text-[11px] font-body">
              <span className="text-muted-foreground">Taxa</span>
              <span>1 {fromToken.symbol} = {rate.toFixed(rate >= 1 ? 4 : 8)} {toToken.symbol}</span>
            </div>
            <div className="flex justify-between text-[11px] font-body">
              <span className="text-muted-foreground">Fee (0.3%)</span>
              <span>{fee.toFixed(4)} {fromToken.symbol}</span>
            </div>
            <div className="flex justify-between text-[11px] font-body">
              <span className="text-muted-foreground flex items-center gap-1">
                Slippage <Info size={10} />
              </span>
              <span>{slippage}%</span>
            </div>
            <div className="flex justify-between text-xs font-body font-semibold pt-2 border-t border-border">
              <span>Recebes (estimado)</span>
              <span className="text-primary">{(toAmount * (1 - 0.003)).toFixed(toToken.usdPrice >= 1 ? 2 : 6)} {toToken.symbol}</span>
            </div>
          </motion.div>
        )}

        {/* Swap Action */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={fromNum <= 0 || fromNum > fromToken.balance}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-display font-bold text-base disabled:opacity-30 tap-shrink"
        >
          {fromNum > fromToken.balance
            ? "Saldo insuficiente"
            : fromNum <= 0
            ? "Inserir montante"
            : `Swap ${fromToken.symbol} → ${toToken.symbol}`}
        </motion.button>

        {/* Quick Info */}
        <div className="card-clean p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-muted-foreground" />
            <h3 className="text-xs font-display font-semibold">Como funciona</h3>
          </div>
          <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
            O Swap permite converter qualquer token em outro instantaneamente. 
            Converte crypto em moedas locais (BRL, EUR, USD) para enviar diretamente para o teu banco. 
            Taxa fixa de 0.3% por transação com burn automático de 0.1%.
          </p>
        </div>

        {/* Fiat Offramp */}
        <div className="card-clean p-5 border-primary/20">
          <h3 className="font-display font-semibold text-sm mb-2">Enviar para Banco</h3>
          <p className="text-[11px] text-muted-foreground font-body mb-4">
            Converte $WAGE para moeda local e envia diretamente para a tua conta bancária. Sem complicação.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { currency: "BRL", label: "PIX", flag: "🇧🇷" },
              { currency: "EUR", label: "SEPA", flag: "🇪🇺" },
              { currency: "USD", label: "Wire", flag: "🇺🇸" },
            ].map((opt) => (
              <button key={opt.currency} className="card-clean p-3 text-center tap-shrink hover:border-primary/30 transition-colors">
                <span className="text-lg">{opt.flag}</span>
                <p className="text-xs font-display font-semibold mt-1">{opt.currency}</p>
                <p className="text-[10px] text-muted-foreground font-body">{opt.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
