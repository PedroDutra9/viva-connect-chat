import { motion } from "framer-motion";
import { MessageSquare, Users, Clock, AlertTriangle, ShoppingCart, DollarSign, Wrench, Headphones } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import QueueBadge from "@/components/QueueBadge";
import StatusBadge from "@/components/StatusBadge";
import { mockConversations, getQueueStats, queueLabels, QueueType } from "@/lib/data";

const queueIcons: Record<QueueType, typeof ShoppingCart> = {
  comercial: ShoppingCart,
  financeiro: DollarSign,
  suporte_priority: AlertTriangle,
  suporte_normal: Wrench,
};

const Dashboard = () => {
  const stats = getQueueStats();
  const totalWaiting = Object.values(stats).reduce((a, b) => a + b.waiting, 0);
  const totalActive = Object.values(stats).reduce((a, b) => a + b.active, 0);
  const totalConversations = mockConversations.length;
  const priorityCount = mockConversations.filter((c) => c.priority === "alta").length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Painel de Atendimento</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral do atendimento WhatsApp</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Conversas" value={totalConversations} icon={MessageSquare} variant="primary" />
          <StatCard label="Aguardando" value={totalWaiting} icon={Clock} variant="warning" subtitle="Na fila" />
          <StatCard label="Em Atendimento" value={totalActive} icon={Headphones} variant="accent" />
          <StatCard label="Prioridade Alta" value={priorityCount} icon={AlertTriangle} variant="danger" subtitle="Sem internet" />
        </div>

        {/* Queues Overview */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Filas de Atendimento</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(stats) as QueueType[]).map((queue, i) => {
              const Icon = queueIcons[queue];
              const s = stats[queue];
              return (
                <motion.div
                  key={queue}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="glass-card rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{queueLabels[queue]}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Aguardando</span>
                      <p className="text-lg font-bold text-foreground">{s.waiting}</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div>
                      <span className="text-muted-foreground">Atendendo</span>
                      <p className="text-lg font-bold text-foreground">{s.active}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Conversations */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Conversas Recentes</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assunto</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fila</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Atendente</th>
                </tr>
              </thead>
              <tbody>
                {mockConversations.map((conv, i) => (
                  <motion.tr
                    key={conv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{conv.customer.name}</p>
                        <p className="text-xs text-muted-foreground">{conv.customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">{conv.subject}</td>
                    <td className="px-5 py-4"><QueueBadge queue={conv.queue} /></td>
                    <td className="px-5 py-4"><StatusBadge status={conv.status} /></td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{conv.assignedTo || "—"}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
