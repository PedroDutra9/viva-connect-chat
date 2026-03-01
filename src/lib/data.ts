import { Ticket } from "lucide-react";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  cpf?: string;
  cnpj?: string;
  city?: string;
  type?: "residencial" | "empresarial";
  createdAt: string;
}

export interface Conversation {
  id: string;
  customer: Customer;
  queue: QueueType;
  status: "aguardando" | "em_atendimento" | "finalizado";
  priority: "alta" | "normal";
  subject: string;
  messages: Message[];
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  context: Record<string, string>;
}

export interface Message {
  id: string;
  sender: "customer" | "agent" | "bot";
  content: string;
  timestamp: string;
}

export type QueueType = "comercial" | "financeiro" | "suporte_priority" | "suporte_normal";

export interface QueueInfo {
  id: QueueType;
  label: string;
  icon: string;
  count: number;
  waiting: number;
  active: number;
}

// Mock data
export const mockConversations: Conversation[] = [
  {
    id: "1",
    customer: { id: "c1", name: "Maria Silva", phone: "+5511999001122", cpf: "123.456.789-00", city: "São Paulo", createdAt: "2026-02-28T10:00:00" },
    queue: "suporte_priority",
    status: "aguardando",
    priority: "alta",
    subject: "Sem internet",
    messages: [
      { id: "m1", sender: "customer", content: "Olá, estou sem internet desde ontem", timestamp: "2026-03-01T08:30:00" },
      { id: "m2", sender: "bot", content: "👋 Olá Maria! Entendi que você está sem internet. Vou te encaminhar com prioridade para nosso suporte técnico.", timestamp: "2026-03-01T08:30:05" },
    ],
    createdAt: "2026-03-01T08:30:00",
    updatedAt: "2026-03-01T08:30:05",
    context: { problema: "Sem internet", prioridade: "Alta", cidade: "São Paulo" },
  },
  {
    id: "2",
    customer: { id: "c2", name: "João Santos", phone: "+5521988776655", cpf: "987.654.321-00", createdAt: "2026-02-27T14:00:00" },
    queue: "financeiro",
    status: "em_atendimento",
    priority: "normal",
    subject: "Segunda via de boleto",
    assignedTo: "Ana Oliveira",
    messages: [
      { id: "m3", sender: "customer", content: "Preciso da segunda via do boleto", timestamp: "2026-03-01T09:15:00" },
      { id: "m4", sender: "bot", content: "Claro, João! Vou te encaminhar para o financeiro.", timestamp: "2026-03-01T09:15:05" },
      { id: "m5", sender: "agent", content: "Olá João, já estou gerando sua segunda via. Um momento!", timestamp: "2026-03-01T09:20:00" },
    ],
    createdAt: "2026-03-01T09:15:00",
    updatedAt: "2026-03-01T09:20:00",
    context: { assunto: "Segunda via de boleto", cpf: "987.654.321-00" },
  },
  {
    id: "3",
    customer: { id: "c3", name: "Carlos Mendes", phone: "+5531977665544", city: "Belo Horizonte", type: "residencial", createdAt: "2026-03-01T07:00:00" },
    queue: "comercial",
    status: "aguardando",
    priority: "normal",
    subject: "Contratar internet",
    messages: [
      { id: "m6", sender: "customer", content: "Quero contratar um plano de internet", timestamp: "2026-03-01T10:00:00" },
      { id: "m7", sender: "bot", content: "Ótimo, Carlos! Qual sua cidade? Residencial ou empresarial?", timestamp: "2026-03-01T10:00:05" },
      { id: "m8", sender: "customer", content: "Belo Horizonte, residencial", timestamp: "2026-03-01T10:01:00" },
    ],
    createdAt: "2026-03-01T10:00:00",
    updatedAt: "2026-03-01T10:01:00",
    context: { cidade: "Belo Horizonte", tipo: "Residencial" },
  },
  {
    id: "4",
    customer: { id: "c4", name: "Ana Paula", phone: "+5541966554433", cpf: "456.789.123-00", createdAt: "2026-02-28T16:00:00" },
    queue: "suporte_normal",
    status: "em_atendimento",
    priority: "normal",
    subject: "Internet lenta",
    assignedTo: "Pedro Costa",
    messages: [
      { id: "m9", sender: "customer", content: "Minha internet está muito lenta", timestamp: "2026-03-01T07:45:00" },
      { id: "m10", sender: "agent", content: "Olá Ana Paula, vamos verificar sua conexão.", timestamp: "2026-03-01T08:00:00" },
    ],
    createdAt: "2026-03-01T07:45:00",
    updatedAt: "2026-03-01T08:00:00",
    context: { problema: "Internet lenta", cpf: "456.789.123-00" },
  },
  {
    id: "5",
    customer: { id: "c5", name: "Roberto Lima", phone: "+5551955443322", createdAt: "2026-03-01T06:00:00" },
    queue: "financeiro",
    status: "aguardando",
    priority: "normal",
    subject: "Negociação de dívida",
    messages: [
      { id: "m11", sender: "customer", content: "Quero negociar minha fatura atrasada", timestamp: "2026-03-01T10:30:00" },
      { id: "m12", sender: "bot", content: "Entendi, Roberto. Vou te encaminhar para o setor financeiro.", timestamp: "2026-03-01T10:30:05" },
    ],
    createdAt: "2026-03-01T10:30:00",
    updatedAt: "2026-03-01T10:30:05",
    context: { assunto: "Negociação", cnpj_cpf: "Não informado" },
  },
  {
    id: "6",
    customer: { id: "c6", name: "Fernanda Alves", phone: "+5561944332211", cpf: "321.654.987-00", createdAt: "2026-02-25T09:00:00" },
    queue: "suporte_priority",
    status: "aguardando",
    priority: "alta",
    subject: "Sem internet - urgente",
    messages: [
      { id: "m13", sender: "customer", content: "Estou sem internet há 2 dias! Preciso resolver urgente", timestamp: "2026-03-01T11:00:00" },
      { id: "m14", sender: "bot", content: "Fernanda, entendo a urgência! Encaminhando com prioridade máxima.", timestamp: "2026-03-01T11:00:05" },
    ],
    createdAt: "2026-03-01T11:00:00",
    updatedAt: "2026-03-01T11:00:05",
    context: { problema: "Sem internet há 2 dias", prioridade: "Alta", cpf: "321.654.987-00" },
  },
];

export const queueLabels: Record<QueueType, string> = {
  comercial: "Comercial",
  financeiro: "Financeiro",
  suporte_priority: "Suporte Prioridade",
  suporte_normal: "Suporte Normal",
};

export const getQueueStats = () => {
  const stats: Record<QueueType, { waiting: number; active: number; done: number }> = {
    comercial: { waiting: 0, active: 0, done: 0 },
    financeiro: { waiting: 0, active: 0, done: 0 },
    suporte_priority: { waiting: 0, active: 0, done: 0 },
    suporte_normal: { waiting: 0, active: 0, done: 0 },
  };
  mockConversations.forEach((c) => {
    if (c.status === "aguardando") stats[c.queue].waiting++;
    else if (c.status === "em_atendimento") stats[c.queue].active++;
    else stats[c.queue].done++;
  });
  return stats;
};
