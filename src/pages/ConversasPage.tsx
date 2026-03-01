import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, User, Bot, Headphones } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import QueueBadge from "@/components/QueueBadge";
import StatusBadge from "@/components/StatusBadge";
import { mockConversations, Conversation } from "@/lib/data";
import { cn } from "@/lib/utils";

const senderConfig = {
  customer: { icon: User, label: "Cliente", bg: "bg-muted", align: "justify-start" as const },
  agent: { icon: Headphones, label: "Atendente", bg: "bg-primary/10", align: "justify-end" as const },
  bot: { icon: Bot, label: "Bot", bg: "bg-accent/10", align: "justify-end" as const },
};

const ConversasPage = () => {
  const [selected, setSelected] = useState<Conversation | null>(null);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] gap-4">
        {/* List */}
        <div className={cn("flex flex-col glass-card rounded-xl overflow-hidden", selected ? "hidden lg:flex lg:w-96" : "w-full")}>
          <div className="px-5 py-4 border-b border-border/50">
            <h2 className="font-semibold text-foreground">Conversas</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{mockConversations.length} conversas</p>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border/30">
            {mockConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelected(conv)}
                className={cn(
                  "w-full text-left px-5 py-4 hover:bg-muted/30 transition-colors",
                  selected?.id === conv.id && "bg-muted/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{conv.customer.name}</p>
                  <StatusBadge status={conv.status} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.subject}</p>
                <div className="mt-2">
                  <QueueBadge queue={conv.queue} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat View */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col glass-card rounded-xl overflow-hidden"
            >
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-border/50 flex items-center gap-4">
                <button onClick={() => setSelected(null)} className="lg:hidden p-1 hover:bg-muted rounded-lg">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-foreground">{selected.customer.name}</p>
                    <QueueBadge queue={selected.queue} />
                    <StatusBadge status={selected.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">{selected.customer.phone} • {selected.subject}</p>
                </div>
              </div>

              {/* Context */}
              {Object.keys(selected.context).length > 0 && (
                <div className="px-5 py-3 bg-muted/30 border-b border-border/30 flex flex-wrap gap-2">
                  {Object.entries(selected.context).map(([key, val]) => (
                    <span key={key} className="inline-flex items-center text-[11px] bg-background rounded-md px-2 py-1 border border-border/50">
                      <span className="font-semibold text-muted-foreground mr-1">{key}:</span>
                      <span className="text-foreground">{val}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {selected.messages.map((msg) => {
                  const config = senderConfig[msg.sender];
                  return (
                    <div key={msg.id} className={cn("flex", config.align)}>
                      <div className={cn("max-w-[75%] rounded-xl px-4 py-3", config.bg)}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <config.icon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{config.label}</span>
                        </div>
                        <p className="text-sm text-foreground">{msg.content}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="px-5 py-4 border-t border-border/50">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="hidden lg:flex flex-1 items-center justify-center glass-card rounded-xl">
              <div className="text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
                  <Headphones className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Selecione uma conversa para visualizar</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default ConversasPage;
