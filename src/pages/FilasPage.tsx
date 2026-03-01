import { motion } from "framer-motion";
import { ShoppingCart, DollarSign, AlertTriangle, Wrench, ArrowRight } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import QueueBadge from "@/components/QueueBadge";
import StatusBadge from "@/components/StatusBadge";
import { mockConversations, getQueueStats, queueLabels, QueueType } from "@/lib/data";

const queueIcons: Record<QueueType, typeof ShoppingCart> = {
  comercial: ShoppingCart,
  financeiro: DollarSign,
  suporte_priority: AlertTriangle,
  suporte_normal: Wrench,
};

const queueDescriptions: Record<QueueType, string> = {
  comercial: "Novos clientes interessados em contratar planos",
  financeiro: "Boletos, negociações e vencimentos",
  suporte_priority: "Clientes sem internet — prioridade máxima",
  suporte_normal: "Internet lenta e outros problemas técnicos",
};

const FilasPage = () => {
  const stats = getQueueStats();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Filas de Atendimento</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie e monitore as filas do sistema</p>
        </div>

        <div className="space-y-6">
          {(Object.keys(stats) as QueueType[]).map((queue, i) => {
            const Icon = queueIcons[queue];
            const s = stats[queue];
            const conversations = mockConversations.filter((c) => c.queue === queue);

            return (
              <motion.div
                key={queue}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="glass-card rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{queueLabels[queue]}</h3>
                      <p className="text-xs text-muted-foreground">{queueDescriptions[queue]}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-lg font-bold text-status-waiting">{s.waiting}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Aguardando</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-status-active">{s.active}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Atendendo</p>
                    </div>
                  </div>
                </div>

                {conversations.length > 0 ? (
                  <div className="divide-y divide-border/30">
                    {conversations.map((conv, j) => (
                      <div key={conv.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {j + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{conv.customer.name}</p>
                            <p className="text-xs text-muted-foreground">{conv.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={conv.status} />
                          {conv.priority === "alta" && (
                            <span className="queue-badge-suporte-priority rounded-full px-2 py-0.5 text-[10px] font-bold uppercase">Urgente</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-sm text-muted-foreground">Nenhuma conversa nesta fila</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FilasPage;
