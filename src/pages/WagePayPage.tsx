import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Send, QrCode, Clock, ArrowUp, ArrowDown, Copy, Share2, Download, Check } from "lucide-react";

const CONTACTS = [
  { name: "Maria S.", initials: "MS", address: "0x1a2b...3c4d", recent: true },
  { name: "João P.", initials: "JP", address: "0x5e6f...7g8h", recent: true },
  { name: "Ana R.", initials: "AR", address: "0x9i0j...1k2l", recent: false },
  { name: "Carlos M.", initials: "CM", address: "0x3m4n...5o6p", recent: false },
];

const TX_HISTORY = [
  { type: "sent", to: "Maria S.", amount: 15, date: "2026-03-04", time: "14:32", status: "confirmed" },
  { type: "received", to: "João P.", amount: 25, date: "2026-03-03", time: "09:15", status: "confirmed" },
  { type: "sent", to: "Loja QR #42", amount: 8.5, date: "2026-03-02", time: "18:47", status: "confirmed" },
  { type: "received", to: "UBI Claim", amount: 50, date: "2026-03-01", time: "00:01", status: "confirmed" },
  { type: "sent", to: "Ana R.", amount: 5, date: "2026-02-28", time: "11:23", status: "confirmed" },
];

const WagePayPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"send" | "receive" | "history">("send");
  const [sendAmount, setSendAmount] = useState("");
  const [sendTo, setSendTo] = useState("");
  const wageBalance = 42.5;

  const qrData = `wagepay://0xMyAddr?amount=${sendAmount || "0"}`;

  return (
    <div className="min-h-screen pb-20 bg-background">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-lg mx-auto flex items-center px-5 h-14">
          <button onClick={() => navigate(-1)} className="mr-3 tap-shrink">
            <ChevronLeft size={20} className="text-foreground" />
          </button>
          <h1 className="font-display font-bold text-base">WagePay</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-5">
        {/* Balance */}
        <div className="rounded-2xl bg-foreground text-background p-5 text-center">
          <p className="text-[11px] text-background/50 font-body">Saldo disponível</p>
          <p className="text-3xl font-display font-bold mt-1">{wageBalance} <span className="text-primary">$W</span></p>
          <p className="text-xs text-background/40 font-body mt-0.5">≈ ${(wageBalance * 0.85).toFixed(2)} USD</p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-secondary p-1">
          {([
            { key: "send" as const, label: "Enviar", icon: Send },
            { key: "receive" as const, label: "Receber", icon: QrCode },
            { key: "history" as const, label: "Histórico", icon: Clock },
          ]).map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-body font-medium transition-all tap-shrink ${
                  tab === t.key ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "send" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="card-clean p-4">
              <label className="text-[11px] text-muted-foreground font-body block mb-2">Montante</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-secondary rounded-xl px-3 py-3 text-xl font-display font-bold outline-none placeholder:text-muted-foreground"
                />
                <span className="text-sm text-muted-foreground font-body">$WAGE</span>
              </div>
              <div className="flex gap-2 mt-2.5">
                {[5, 10, 25, 50].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSendAmount(v.toString())}
                    className="flex-1 py-1.5 rounded-lg bg-secondary text-[11px] font-body font-medium tap-shrink hover:bg-primary/10 transition-colors"
                  >
                    {v} $W
                  </button>
                ))}
              </div>
            </div>

            <div className="card-clean p-4">
              <label className="text-[11px] text-muted-foreground font-body block mb-2">Destinatário</label>
              <input
                type="text"
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
                placeholder="Endereço ou @username"
                className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm font-body outline-none placeholder:text-muted-foreground"
              />

              <p className="text-[11px] text-muted-foreground font-body mt-3 mb-2">Contactos recentes</p>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {CONTACTS.filter(c => c.recent).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSendTo(c.address)}
                    className="flex flex-col items-center gap-1 tap-shrink min-w-[52px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-xs font-display font-semibold text-muted-foreground">{c.initials}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-body">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {parseFloat(sendAmount) > 0 && (
              <div className="rounded-xl bg-secondary p-3.5 space-y-1.5">
                <div className="flex justify-between text-[11px] font-body">
                  <span className="text-muted-foreground">Taxa de rede</span>
                  <span>0.01 $W</span>
                </div>
                <div className="flex justify-between text-[11px] font-body">
                  <span className="text-muted-foreground">Burn</span>
                  <span className="text-destructive">-{(parseFloat(sendAmount) * 0.005).toFixed(4)} $W</span>
                </div>
                <div className="flex justify-between text-xs font-body font-semibold pt-1.5 border-t border-border">
                  <span>Destinatário recebe</span>
                  <span className="text-primary">{(parseFloat(sendAmount) * 0.995 - 0.01).toFixed(4)} $W</span>
                </div>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!sendAmount || !sendTo || parseFloat(sendAmount) <= 0 || parseFloat(sendAmount) > wageBalance}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm disabled:opacity-30 tap-shrink"
            >
              Enviar $WAGE
            </motion.button>
          </motion.div>
        )}

        {tab === "receive" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="card-clean p-8 text-center">
              <div className="w-48 h-48 mx-auto bg-secondary rounded-2xl flex items-center justify-center mb-4">
                <div className="text-center">
                  <QrCode size={48} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-[10px] text-muted-foreground font-body">QR Code</p>
                  <p className="text-[9px] text-muted-foreground font-body mt-1 font-mono break-all px-2">
                    {qrData}
                  </p>
                </div>
              </div>
              <p className="text-sm font-display font-semibold">O teu QR de Pagamento</p>
              <p className="text-[11px] text-muted-foreground font-body mt-1">
                Mostra este QR para receber $WAGE instantaneamente
              </p>
            </div>

            <div className="card-clean p-4">
              <label className="text-[11px] text-muted-foreground font-body block mb-2">Pedir valor específico (opcional)</label>
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm font-display font-bold outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="card-clean p-4">
              <p className="text-[11px] text-muted-foreground font-body mb-1.5">O teu endereço WagePay</p>
              <div className="flex items-center gap-2 bg-secondary rounded-xl p-2.5">
                <p className="flex-1 text-xs font-mono text-muted-foreground truncate">0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d</p>
                <button className="tap-shrink p-1.5 rounded-lg bg-background">
                  <Copy size={14} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 card-clean font-body font-medium text-xs tap-shrink">
                <Share2 size={14} />
                Partilhar
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 card-clean font-body font-medium text-xs tap-shrink">
                <Download size={14} />
                Guardar QR
              </button>
            </div>
          </motion.div>
        )}

        {tab === "history" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {TX_HISTORY.map((tx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 card-clean p-3.5"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  tx.type === "sent" ? "bg-destructive/10" : "bg-primary/10"
                }`}>
                  {tx.type === "sent" ? (
                    <ArrowUp size={16} className="text-destructive" />
                  ) : (
                    <ArrowDown size={16} className="text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display font-semibold">{tx.to}</p>
                  <p className="text-[11px] text-muted-foreground font-body">{tx.date} • {tx.time}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-display font-bold ${tx.type === "sent" ? "text-destructive" : "text-primary"}`}>
                    {tx.type === "sent" ? "-" : "+"}{tx.amount} $W
                  </p>
                  <p className="text-[10px] text-muted-foreground font-body">{tx.status}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* WagePay Phases */}
        <div className="card-clean p-4">
          <h3 className="font-display font-semibold text-sm mb-3">Roadmap WagePay</h3>
          <div className="space-y-2.5">
            {[
              { phase: 1, label: "Carteira In-App", status: "active" },
              { phase: 2, label: "Pagamentos QR P2P", status: "active" },
              { phase: 3, label: "API para Comerciantes", status: "soon" },
              { phase: 4, label: "WageCard Virtual", status: "planned" },
              { phase: 5, label: "WageCard Físico", status: "planned" },
            ].map((p) => (
              <div key={p.phase} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                  p.status === "active" ? "bg-primary text-primary-foreground" :
                  p.status === "soon" ? "bg-primary/10 text-primary" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {p.status === "active" ? <Check size={14} /> : p.phase}
                </div>
                <p className={`text-xs font-body ${p.status === "planned" ? "text-muted-foreground" : "text-foreground"}`}>
                  {p.label}
                </p>
                {p.status === "soon" && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-body font-semibold ml-auto">
                    EM BREVE
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WagePayPage;
