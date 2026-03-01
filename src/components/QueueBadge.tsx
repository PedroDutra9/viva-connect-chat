import { cn } from "@/lib/utils";
import { QueueType, queueLabels } from "@/lib/data";

interface QueueBadgeProps {
  queue: QueueType;
  className?: string;
}

const queueStyles: Record<QueueType, string> = {
  comercial: "queue-badge-comercial",
  financeiro: "queue-badge-financeiro",
  suporte_priority: "queue-badge-suporte-priority",
  suporte_normal: "queue-badge-suporte-normal",
};

const QueueBadge = ({ queue, className }: QueueBadgeProps) => {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", queueStyles[queue], className)}>
      {queueLabels[queue]}
    </span>
  );
};

export default QueueBadge;
