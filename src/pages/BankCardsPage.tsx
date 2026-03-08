import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Plus, Trash2, Building2, Shield, ArrowUpRight, ArrowDownLeft } from "lucide-react";

interface BankCard {
  id: string;
  bankName: string;
  lastFour: string;
  type: "visa" | "mastercard" | "pix";
  label: string;
  isDefault: boolean;
}

const MOCK_CARDS: BankCard[] = [
  { id: "1", bankName: "Nubank", lastFour: "4821", type: "mastercard", label: "Conta Principal", isDefault: true },
  { id: "2", bankName: "Banco do Brasil", lastFour: "7392", type: "visa", label: "Poupança", isDefault: false },
];

const BankCardsPage = () => {
  const [cards, setCards] = useState<BankCard[]>(MOCK_CARDS);
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="pb-20 lg:pb-6">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-4 lg:py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl">Cartões & Bancos</h1>
            <p className="text-xs text-muted-foreground font-body mt-0.5">Gere os teus métodos de depósito e retirada</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium tap-shrink"
          >
            <Plus size={14} />
            Adicionar
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="card-clean p-4 text-center tap-shrink hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-success/10 mx-auto flex items-center justify-center mb-2">
              <ArrowDownLeft size={20} className="text-success" />
            </div>
            <p className="text-sm font-display font-semibold">Depositar</p>
            <p className="text-[11px] text-muted-foreground font-body">Do banco → Wage</p>
          </button>
          <button className="card-clean p-4 text-center tap-shrink hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 mx-auto flex items-center justify-center mb-2">
              <ArrowUpRight size={20} className="text-primary" />
            </div>
            <p className="text-sm font-display font-semibold">Retirar</p>
            <p className="text-[11px] text-muted-foreground font-body">Wage → Banco</p>
          </button>
        </div>

        {/* Add Card Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="card-clean p-5 space-y-4"
          >
            <h3 className="font-display font-semibold text-sm">Adicionar novo método</h3>

            <div className="grid grid-cols-3 gap-2">
              {[
                { type: "pix", label: "PIX", desc: "Instantâneo" },
                { type: "visa", label: "Cartão", desc: "Visa/MC" },
                { type: "wire", label: "SEPA/Wire", desc: "Transferência" },
              ].map((m) => (
                <button key={m.type} className="card-clean p-3 text-center tap-shrink hover:border-primary/30 transition-colors">
                  <CreditCard size={20} className="text-primary mx-auto mb-1.5" />
                  <p className="text-xs font-display font-semibold">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{m.desc}</p>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-muted-foreground font-body block mb-1">Nome do banco</label>
                <input
                  type="text"
                  placeholder="Ex: Nubank, Wise, Revolut"
                  className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm font-body outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-body block mb-1">IBAN / Chave PIX / Nº Cartão</label>
                <input
                  type="text"
                  placeholder="Insere os dados da conta"
                  className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm font-body outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-body block mb-1">Nome/Label (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Conta Principal"
                  className="w-full bg-secondary rounded-lg px-3 py-2.5 text-sm font-body outline-none placeholder:text-muted-foreground"
                />
              </div>
              <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm tap-shrink">
                Guardar Método
              </button>
            </div>
          </motion.div>
        )}

        {/* Saved Cards */}
        <section>
          <h2 className="font-display font-semibold text-[15px] mb-3">Métodos guardados</h2>
          <div className="space-y-2.5">
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`card-clean p-4 ${card.isDefault ? "border-primary/30" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center">
                    <Building2 size={20} className="text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-sm">{card.bankName}</h3>
                      {card.isDefault && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-body font-semibold">
                          PADRÃO
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground font-body">
                      {card.label} •••• {card.lastFour} • {card.type.toUpperCase()}
                    </p>
                  </div>
                  <button className="tap-shrink p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                    <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security Info */}
        <div className="card-clean p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-primary" />
            <h3 className="font-display font-semibold text-sm">Segurança</h3>
          </div>
          <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
            Os teus dados bancários são encriptados e nunca armazenados nos nossos servidores.
            Todas as transações são processadas via parceiros licenciados com conformidade regulatória total.
          </p>
        </div>

        {/* Supported methods */}
        <div className="card-clean p-4">
          <h3 className="font-display font-semibold text-sm mb-3">Métodos suportados</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { method: "PIX", region: "🇧🇷 Brasil", speed: "Instantâneo" },
              { method: "SEPA", region: "🇪🇺 Europa", speed: "1-2 dias" },
              { method: "Wire", region: "🇺🇸 EUA", speed: "2-3 dias" },
            ].map((m) => (
              <div key={m.method} className="text-center p-2.5 rounded-lg bg-secondary/50">
                <p className="text-lg">{m.region.split(" ")[0]}</p>
                <p className="text-xs font-display font-semibold mt-1">{m.method}</p>
                <p className="text-[10px] text-muted-foreground font-body">{m.speed}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankCardsPage;
