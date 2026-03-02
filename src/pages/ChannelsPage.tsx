import { motion } from "framer-motion";
import { Wifi, WifiOff, Bot, Plus, QrCode, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

type ChannelStatus = "conectado" | "desconectado" | "automatizado";

type ChannelType = "whatsapp" | "instagram" | "facebook";

interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  status: ChannelStatus;
}

const channelIcons: Record<ChannelType, JSX.Element> = {
  whatsapp: <QrCode className="h-5 w-5 text-primary" />,
  instagram: <Wifi className="h-5 w-5 text-primary" />,
  facebook: <Wifi className="h-5 w-5 text-primary" />,
};

const statusLabels: Record<ChannelStatus, string> = {
  conectado: "Conectado",
  desconectado: "Desconectado",
  automatizado: "Automatizado",
};

const statusColors: Record<ChannelStatus, string> = {
  conectado: "text-status-active bg-status-active/10",
  desconectado: "text-status-error bg-status-error/10",
  automatizado: "text-status-waiting bg-status-waiting/10",
};

const mockChannels: Channel[] = [
  {
    id: "1",
    name: "WhatsApp Suporte",
    type: "whatsapp",
    status: "desconectado",
  },
  {
    id: "2",
    name: "Instagram Oficial",
    type: "instagram",
    status: "conectado",
  },
];

const ChannelsPage = () => {
  const total = mockChannels.length;
  const connected = mockChannels.filter((c) => c.status === "conectado").length;
  const disconnected = mockChannels.filter((c) => c.status === "desconectado").length;
  const automated = mockChannels.filter((c) => c.status === "automatizado").length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Canais de Atendimento</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gerencie seus canais de comunicação
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Novo Canal
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Conectados</p>
            <p className="text-2xl font-bold text-status-active">{connected}</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Desconectados</p>
            <p className="text-2xl font-bold text-status-error">{disconnected}</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">Automatizados</p>
            <p className="text-2xl font-bold text-status-waiting">{automated}</p>
          </div>
        </div>

        {/* Channels list */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockChannels.map((channel, i) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    {channelIcons[channel.type]}
                  </div>
                  <div>
                    <p className="font-semibold">{channel.name}</p>
                    <p className="text-xs text-muted-foreground uppercase">
                      {channel.type}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[channel.status]}`}
                >
                  {statusLabels[channel.status]}
                </span>
              </div>

              <div className="flex gap-2">
                {channel.status === "desconectado" && (
                  <button className="flex-1 rounded-lg bg-primary px-3 py-2 text-white hover:bg-primary/90">
                    Conectar
                  </button>
                )}

                <button className="flex-1 rounded-lg bg-muted px-3 py-2 hover:bg-muted/70">
                  Automação
                </button>

                <button className="rounded-lg border border-border p-2 text-status-error hover:bg-status-error/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChannelsPage;