// ============================================
// LUMICHAT - TIPOS DO BANCO DE DADOS
// ============================================

// ---------- ENUMS ----------
export type Funcao = 'Administrador' | 'Supervisor' | 'Agente';
export type StatusUsuario = 'Ativo' | 'Inativo';
export type StatusConversa = 'aguardando' | 'em_atendimento' | 'finalizada' | 'bot';
export type TipoCanal = 'whatsapp' | 'instagram' | 'telegram' | 'email' | 'webchat';
export type SenderType = 'contact' | 'agent' | 'bot' | 'system';
export type ContentType = 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker' | 'location';
export type Prioridade = 'alta' | 'normal' | 'baixa';
export type TipoCliente = 'residencial' | 'empresarial';

// ---------- ENTIDADES ----------

export interface Setor {
  id: string;
  nome: string;
  cor: string;
  created_at: string;
  updated_at: string;
}

export interface Fila {
  id: string;
  nome: string;
  setor_id: string | null;
  cor: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  setor?: Setor;
  // Stats calculados (não vem do banco)
  stats?: {
    waiting: number;
    active: number;
    done: number;
  };
}

export interface Usuario {
  id: string;            // uuid do auth.users
  nome: string;
  email: string;
  funcao: Funcao;        // 'Administrador' | 'Supervisor' | 'Agente'
  status: 'Ativo' | 'Inativo';
  avatar_url: string | null;
  created_at: string;
  filas?: Fila[];
}

export interface Contato {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  cpf: string | null;
  cnpj: string | null;
  cidade: string | null;
  tipo: TipoCliente | null;
  avatar_url: string | null;
  tags: string[];
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Canal {
  id: string;
  nome: string;
  tipo: TipoCanal;
  status: 'connected' | 'disconnected' | 'connecting';
  config: Record<string, any>;
  fila_id: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  fila?: Fila;
}

export interface Conversa {
  id: string;
  contato_id: string;
  canal_id: string | null;
  fila_id: string | null;
  atendente_id: string | null;
  status: StatusConversa;
  prioridade: Prioridade;
  protocolo: string;
  assunto: string | null;
  tags: string[];
  context: Record<string, any>;
  started_at: string;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  contato?: Contato;
  canal?: Canal;
  fila?: Fila;
  atendente?: Usuario;
  mensagens?: Mensagem[];
  ultima_mensagem?: Mensagem;
}

export interface Mensagem {
  id: string;
  conversa_id: string;
  sender_type: SenderType;
  sender_id: string | null;
  content: string | null;
  content_type: ContentType;
  media_url: string | null;
  metadata: Record<string, any>;
  external_id: string | null;
  created_at: string;
}

export interface Fluxo {
  id: string;
  nome: string;
  descricao: string | null;
  status: 'ativo' | 'inativo' | 'rascunho';
  trigger_type: 'keyword' | 'welcome' | 'schedule' | 'manual';
  trigger_value: string | null;
  nodes: any[];
  edges: any[];
  created_at: string;
  updated_at: string;
}

export interface RespostaRapida {
  id: string;
  atalho: string;
  titulo: string;
  conteudo: string;
  categoria: string | null;
  created_at: string;
}

// ---------- TIPOS AUXILIARES ----------

export interface FilaStats {
  fila_id: string;
  waiting: number;
  active: number;
  done: number;
}

// Para compatibilidade com código antigo
export type QueueType = string; // Agora é UUID
export type Customer = Contato;
export type Conversation = Conversa;
export type Message = Mensagem;
