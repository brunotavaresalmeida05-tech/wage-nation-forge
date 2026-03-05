import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CONTACTS = [
  { name: "Maria S.", avatar: "👩", address: "0x1a2b...3c4d", recent: true },
  { name: "João P.", avatar: "👨", address: "0x5e6f...7g8h", recent: true },
  { name: "Ana R.", avatar: "👩‍💼", address: "0x9i0j...1k2l", recent: false },
  { name: "Carlos M.", avatar: "👨‍💻", address: "0x3m4n...5o6p", recent: false },
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
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto flex items-center px-4 h-14">
          <button onClick={() => navigate(-1)} className="mr-3 text-lg tap-shrink">←</button>
          <h1 className="font-display font-bold text-lg">💸 WagePay</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {/* Balance */}
        <div className="rounded-2xl border border-border bg-gradient-card p-5 text-center">
          <p className="text-[10px] text-muted-foreground font-body">Saldo disponível</p>
          <p className="text-3xl font-display font-bold mt-1">{wageBalance} <span className="text-primary">$W</span></p>
          <p className="text-xs text-muted-foreground font-body mt-0.5">≈ ${(wageBalance * 0.85).toFixed(2)} USD</p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-secondary p-1">
          {(["send", "receive", "history"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-display font-semibold transition-all tap-shrink ${
                tab === t ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t === "send" ? "📤 Enviar" : t === "receive" ? "📥 Receber" : "📋 Histórico"}
            </button>
          ))}
        </div>

        {tab === "send" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Amount */}
            <div className="rounded-xl border border-border bg-gradient-card p-4">
              <label className="text-[10px] text-muted-foreground font-body block mb-2">Montante</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-secondary rounded-lg px-3 py-3 text-xl font-display font-bold outline-none placeholder:text-muted-foreground"
                />
                <span className="text-sm text-muted-foreground font-body">$WAGE</span>
              </div>
              <div className="flex gap-2 mt-2">
                {[5, 10, 25, 50].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSendAmount(v.toString())}
                    className="flex-1 py-1.5 rounded-lg bg-secondary text-[10px] font-display font-semibold tap-shrink hover:bg-primary/10 transition-colors"
                  >
                    {v} $W
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient */}
            <div className="rounded-xl border border-border bg-gradient-card p-4">
              <label className="text-[10px] text-muted-foreground font-body block mb-2">Destinatário</label>
              <input
                type="text"
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
                placeholder="Endereço ou @username"
                className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm font-body outline-none placeholder:text-muted-foreground"
              />
              
              <p className="text-[10px] text-muted-foreground font-body mt-3 mb-2">Contactos recentes</p>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {CONTACTS.filter(c => c.recent).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSendTo(c.address)}
                    className="flex flex-col items-center gap-1 tap-shrink min-w-[52px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                      {c.avatar}
                    </div>
                    <span className="text-[9px] text-muted-foreground font-body">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fee */}
            {parseFloat(sendAmount) > 0 && (
              <div className="rounded-lg bg-secondary p-3 space-y-1">
                <div className="flex justify-between text-[10px] font-body">
                  <span className="text-muted-foreground">Taxa de rede</span>
                  <span>0.01 $W</span>
                </div>
                <div className="flex justify-between text-[10px] font-body">
                  <span className="text-muted-foreground">Burn</span>
                  <span className="text-destructive">-{(parseFloat(sendAmount) * 0.005).toFixed(4)} $W</span>
                </div>
                <div className="flex justify-between text-xs font-body font-semibold pt-1 border-t border-border">
                  <span>Destinatário recebe</span>
                  <span className="text-primary">{(parseFloat(sendAmount) * 0.995 - 0.01).toFixed(4)} $W</span>
                </div>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!sendAmount || !sendTo || parseFloat(sendAmount) <= 0 || parseFloat(sendAmount) > wageBalance}
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm disabled:opacity-40 tap-shrink"
            >
              Enviar $WAGE
            </motion.button>
          </motion.div>
        )}

        {tab === "receive" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* QR Code Placeholder */}
            <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
              <div className="w-48 h-48 mx-auto bg-background rounded-xl border border-border flex items-center justify-center mb-4">
                <div className="text-center">
                  <span className="text-5xl block mb-2">📱</span>
                  <p className="text-[10px] text-muted-foreground font-body">QR Code</p>
                  <p className="text-[8px] text-muted-foreground font-body mt-1 font-mono break-all px-2">
                    {qrData}
                  </p>
                </div>
              </div>
              <p className="text-sm font-display font-semibold">O teu QR de Pagamento</p>
              <p className="text-[10px] text-muted-foreground font-body mt-1">
                Mostra este QR para receber $WAGE instantaneamente
              </p>
            </div>

            {/* Set Amount */}
            <div className="rounded-xl border border-border bg-gradient-card p-4">
              <label className="text-[10px] text-muted-foreground font-body block mb-2">Pedir valor específico (opcional)</label>
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm font-display font-bold outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Address */}
            <div className="rounded-xl border border-border bg-gradient-card p-4">
              <p className="text-[10px] text-muted-foreground font-body mb-1">O teu endereço WagePay</p>
              <div className="flex items-center gap-2 bg-secondary rounded-lg p-2.5">
                <p className="flex-1 text-xs font-mono text-muted-foreground truncate">0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d</p>
                <button className="text-[10px] text-primary font-body font-semibold tap-shrink px-2 py-1 rounded bg-primary/10">
                  Copiar
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl border border-border bg-gradient-card font-display font-semibold text-xs tap-shrink">
                📤 Partilhar Link
              </button>
              <button className="flex-1 py-2.5 rounded-xl border border-border bg-gradient-card font-display font-semibold text-xs tap-shrink">
                💾 Guardar QR
              </button>
            </div>
          </motion.div>
        )}

        {tab === "history" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {TX_HISTORY.map((tx, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-gradient-card p-3"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  tx.type === "sent" ? "bg-destructive/10" : "bg-primary/10"
                }`}>
                  {tx.type === "sent" ? "↑" : "↓"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display font-semibold">{tx.to}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{tx.date} • {tx.time}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-display font-bold ${tx.type === "sent" ? "text-destructive" : "text-primary"}`}>
                    {tx.type === "sent" ? "-" : "+"}{tx.amount} $W
                  </p>
                  <p className="text-[9px] text-muted-foreground font-body">{tx.status}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* WagePay Phases */}
        <div className="rounded-xl border border-border bg-gradient-card p-4">
          <h3 className="font-display font-semibold text-sm mb-3">Roadmap WagePay</h3>
          <div className="space-y-2">
            {[
              { phase: 1, label: "Carteira In-App", status: "active" },
              { phase: 2, label: "Pagamentos QR P2P", status: "active" },
              { phase: 3, label: "API para Comerciantes", status: "soon" },
              { phase: 4, label: "WageCard Virtual", status: "planned" },
              { phase: 5, label: "WageCard Físico", status: "planned" },
            ].map((p) => (
              <div key={p.phase} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  p.status === "active" ? "bg-primary text-primary-foreground" :
                  p.status === "soon" ? "bg-primary/20 text-primary" :
                  "bg-secondary text-muted-foreground"
                }`}>
                  {p.status === "active" ? "✓" : p.phase}
                </div>
                <p className={`text-xs font-body ${p.status === "planned" ? "text-muted-foreground" : ""}`}>
                  {p.label}
                </p>
                {p.status === "soon" && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-body font-semibold ml-auto">
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
