import { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, Flame, ArrowDown } from "lucide-react";

const ExchangePage = () => {
  const [mineAmount, setMineAmount] = useState("");
  const rate = 1000;
  const fee = 0.05;
  const mineBalance = 1250;
  const mineNum = parseFloat(mineAmount) || 0;
  const wageOut = (mineNum / rate) * (1 - fee);
  const feeAmount = (mineNum / rate) * fee;

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        <h1 className="font-display font-bold text-xl">Exchange</h1>

        {/* Rate Info */}
        <div className="card-clean p-5 text-center">
          <p className="text-xs text-muted-foreground font-body mb-1.5">Taxa de câmbio atual</p>
          <p className="text-2xl font-display font-bold">
            <span className="text-info">1,000 $MINE</span>
            <span className="text-muted-foreground mx-2">=</span>
            <span className="text-primary">1 $WAGE</span>
          </p>
          <p className="text-[11px] text-muted-foreground font-body mt-2">Comissão: 5% • Destino: Treasury</p>
        </div>

        {/* Exchange Form */}
        <div className="card-clean p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-muted-foreground font-body">Tu envias</label>
              <span className="text-[11px] text-muted-foreground font-body">Saldo: {mineBalance.toLocaleString()} $MINE</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
              <div className="w-8 h-8 rounded-md bg-info/10 flex items-center justify-center">
                <span className="text-xs font-display font-bold text-info">M</span>
              </div>
              <input type="number" value={mineAmount} onChange={(e) => setMineAmount(e.target.value)} placeholder="0"
                className="flex-1 bg-transparent outline-none font-display font-bold text-xl placeholder:text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-body">$MINE</span>
            </div>
            <button onClick={() => setMineAmount(mineBalance.toString())} className="text-[11px] text-primary font-body font-medium mt-1.5 tap-shrink">
              Usar máximo
            </button>
          </div>

          <div className="flex justify-center">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <ArrowDown size={16} className="text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground font-body mb-2 block">Tu recebes</label>
            <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-display font-bold text-primary">W</span>
              </div>
              <span className="flex-1 font-display font-bold text-xl text-primary">{wageOut.toFixed(4)}</span>
              <span className="text-xs text-muted-foreground font-body">$WAGE</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-border">
            <div className="flex justify-between text-[11px] font-body text-muted-foreground">
              <span>Comissão (5%)</span><span>{feeAmount.toFixed(4)} $WAGE</span>
            </div>
            <div className="flex justify-between text-[11px] font-body text-muted-foreground">
              <span>Treasury Burn (1%)</span><span>{((mineNum / rate) * 0.01).toFixed(4)} $WAGE</span>
            </div>
          </div>

          <motion.button whileTap={{ scale: 0.97 }} disabled={mineNum <= 0 || mineNum > mineBalance}
            className="w-full py-3 rounded-lg font-display font-semibold text-sm disabled:opacity-30 tap-shrink bg-primary text-primary-foreground">
            Converter para $WAGE
          </motion.button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: <Landmark size={18} className="text-foreground" />, title: "Treasury", desc: "Comissão sustenta o ecossistema" },
            { icon: <Flame size={18} className="text-destructive" />, title: "Burn", desc: "Token burn cria escassez e valor" },
          ].map((item) => (
            <div key={item.title} className="card-clean p-3.5">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center mb-2">{item.icon}</div>
              <h3 className="text-xs font-display font-semibold">{item.title}</h3>
              <p className="text-[11px] text-muted-foreground font-body mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExchangePage;
