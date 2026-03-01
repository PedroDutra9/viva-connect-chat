import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "aguardando" | "em_atendimento" | "finalizado";
  className?: string;
}

const statusConfig = {
  aguardando: { label: "Aguardando", className: "bg-status-waiting/10 text-status-waiting" },
  em_atendimento: { label: "Em Atendimento", className: "bg-status-active/10 text-status-active" },
  finalizado: { label: "Finalizado", className: "bg-status-done/10 text-status-done" },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", config.className, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "aguardando" ? "bg-status-waiting animate-pulse-soft" : status === "em_atendimento" ? "bg-status-active" : "bg-status-done")} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
