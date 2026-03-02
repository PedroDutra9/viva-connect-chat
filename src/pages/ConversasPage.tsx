import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  ArrowLeft,
  User,
  Bot,
  Headphones,
  Paperclip,
  Zap,
  Sparkles,
  MessageSquare,
  Image,
  MessageSquarePlus,
  FileText,
  Clock,
  Filter,
  Edit2,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import QueueBadge from "@/components/QueueBadge";
import StatusBadge from "@/components/StatusBadge";
import { mockConversations, Conversation, Message } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ── Sender visual config ──
const senderConfig = {
  customer: {
    icon: User,
    label: "Cliente",
    bubbleBg: "bg-muted",
    align: "items-start" as const,
    textAlign: "text-left" as const,
  },
  agent: {
    icon: Headphones,
    label: "Atendente",
    bubbleBg: "bg-primary/10",
    align: "items-end" as const,
    textAlign: "text-right" as const,
  },
  bot: {
    icon: Bot,
    label: "Bot",
    bubbleBg: "bg-accent/10",
    align: "items-end" as const,
    textAlign: "text-right" as const,
  },
};

// ── Filter tabs ──
type FilterTab = "todos" | "fila" | "ativos";

const getFilterCounts = () => {
  const todos = mockConversations.length;
  const fila = mockConversations.filter((c) => c.status === "aguardando").length;
  const ativos = mockConversations.filter((c) => c.status === "em_atendimento").length;
  return { todos, fila, ativos };
};

// ── Quick replies ──
const quickReplies = [
  "Vou verificar para você, um momento!",
  "Pode me informar seu CPF, por favor?",
  "Obrigado pelo contato! Algo mais?",
  "Estou transferindo para o setor responsável.",
];

// ── Format time helper ──
const formatTime = (timestamp: string) =>
  new Date(timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (timestamp: string) =>
  new Date(timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

// ══════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════
const ConversasPage = () => {
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("todos");
  const [messageText, setMessageText] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [editingSubject, setEditingSubject] = useState(false);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedConversations, setEditedConversations] = useState<Record<string, Conversation>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Função para obter o assunto atual (considerando edições)
  const getCurrentSubject = (conv: Conversation) => {
    return editedConversations[conv.id]?.subject || conv.subject;
  };

  // Função para iniciar edição
  const startEditing = (subject: string) => {
    setEditingSubject(true);
    setEditedSubject(subject);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  // Função para salvar edição
  const saveSubjectEdit = () => {
    if (selected && editedSubject.trim()) {
      const updatedConv = { ...selected, subject: editedSubject.trim() };
      setSelected(updatedConv);
      setEditedConversations((prev) => ({
        ...prev,
        [selected.id]: updatedConv,
      }));
    }
    setEditingSubject(false);
    setEditedSubject("");
  };

  // Função para cancelar edição
  const cancelEditing = () => {
    setEditingSubject(false);
    setEditedSubject("");
  };

  const counts = getFilterCounts();

  // Filter conversations
  const filtered = mockConversations.filter((c) => {
    const matchesSearch =
      c.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());

    if (activeFilter === "fila") return matchesSearch && c.status === "aguardando";
    if (activeFilter === "ativos") return matchesSearch && c.status === "em_atendimento";
    return matchesSearch;
  });

  // Auto‑scroll to bottom when selecting conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected]);

  const lastMessage = (conv: Conversation): Message =>
    conv.messages[conv.messages.length - 1];

  // ── Filter tab component ──
  const FilterTabButton = ({
    tab,
    label,
    count,
  }: {
    tab: FilterTab;
    label: string;
    count: number;
  }) => (
    <button
      onClick={() => setActiveFilter(tab)}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
        activeFilter === tab
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted/50"
      )}
    >
      {label}
      <span
        className={cn(
          "inline-flex items-center justify-center h-5 min-w-5 rounded-full px-1 text-[10px] font-bold",
          activeFilter === tab
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] gap-0 rounded-xl overflow-hidden border border-border/50 bg-background">
        {/* ═══════════════════════════════════
            1️⃣  LEFT COLUMN – Ticket List
        ═══════════════════════════════════ */}
        <div
          className={cn(
            "flex flex-col border-r border-border/50 bg-card",
            selected ? "hidden lg:flex lg:w-[340px]" : "w-full lg:w-[340px]"
          )}
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                Atendimentos
              </h2>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary">
                      <MessageSquarePlus className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Nova conversa</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                      <Filter className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Filtros avançados</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar atendimento..."
                className="pl-9 h-9 text-sm bg-muted/30 border-border/50"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1">
              <FilterTabButton tab="todos" label="Todos" count={counts.todos} />
              <FilterTabButton tab="fila" label="Fila" count={counts.fila} />
              <FilterTabButton tab="ativos" label="Ativos" count={counts.ativos} />
            </div>
          </div>

          {/* Ticket list */}
          <ScrollArea className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 text-center px-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sem atendimentos
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Nenhum atendimento encontrado.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {filtered.map((conv) => {
                  const last = lastMessage(conv);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelected(conv)}
                      className={cn(
                        "w-full text-left px-4 py-3 hover:bg-muted/30 transition-colors",
                        selected?.id === conv.id && "bg-muted/50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {conv.customer.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {last.content}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0 gap-1">
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(last.timestamp)}
                          </span>
                          <StatusBadge status={conv.status} className="text-[10px] px-1.5 py-0" />
                        </div>
                      </div>
                      <div className="mt-2 ml-11">
                        <QueueBadge queue={conv.queue} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* ═══════════════════════════════════
            2️⃣  CENTER – Chat Window
        ═══════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col min-w-0"
            >
              {/* Chat header */}
              <div className="px-5 py-3 border-b border-border/50 bg-card flex items-center gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="lg:hidden p-1.5 rounded-lg hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {selected.customer.name}
                    </p>
                    <QueueBadge queue={selected.queue} />
                    <StatusBadge status={selected.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {selected.customer.phone} ·
                    </p>
                    {editingSubject ? (
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <input
                          ref={editInputRef}
                          type="text"
                          value={editedSubject}
                          onChange={(e) => setEditedSubject(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              saveSubjectEdit();
                            } else if (e.key === "Escape") {
                              cancelEditing();
                            }
                          }}
                          onBlur={saveSubjectEdit}
                          className="flex-1 text-xs bg-primary/10 border border-primary rounded px-2 py-1 text-foreground"
                          placeholder="Nome do atendimento..."
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(getCurrentSubject(selected))}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                        title="Clique para editar o nome do atendimento"
                      >
                        <span className="truncate">{getCurrentSubject(selected)}</span>
                        <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </div>
                </div>

                {selected.assignedTo && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    <Headphones className="h-3 w-3 mr-1" />
                    {selected.assignedTo}
                  </Badge>
                )}
              </div>

              {/* Context bar */}
              {Object.keys(selected.context).length > 0 && (
                <div className="px-5 py-2 bg-muted/20 border-b border-border/30 flex flex-wrap gap-1.5">
                  {Object.entries(selected.context).map(([key, val]) => (
                    <span
                      key={key}
                      className="inline-flex items-center text-[11px] bg-background rounded-md px-2 py-0.5 border border-border/50"
                    >
                      <span className="font-semibold text-muted-foreground mr-1 capitalize">
                        {key}:
                      </span>
                      <span className="text-foreground">{val}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 bg-muted/10">
                <div className="p-5 space-y-4">
                  {selected.messages.map((msg, idx) => {
                    const config = senderConfig[msg.sender];
                    const showDate =
                      idx === 0 ||
                      formatDate(msg.timestamp) !==
                        formatDate(selected.messages[idx - 1].timestamp);

                    return (
                      <div key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-3">
                            <span className="text-[10px] text-muted-foreground bg-background border border-border/50 rounded-full px-3 py-0.5">
                              {formatDate(msg.timestamp)}
                            </span>
                          </div>
                        )}
                        <div className={cn("flex flex-col", config.align)}>
                          <div
                            className={cn(
                              "max-w-[70%] rounded-2xl px-4 py-2.5",
                              config.bubbleBg
                            )}
                          >
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <config.icon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {config.label}
                              </span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">
                              {msg.content}
                            </p>
                            <p
                              className={cn(
                                "text-[10px] text-muted-foreground/70 mt-1",
                                config.textAlign
                              )}
                            >
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* ═══════════════════════════════
                  3️⃣  BOTTOM – Reply Bar
              ═══════════════════════════════ */}
              <div className="border-t border-border/50 bg-card">
                {/* Quick replies */}
                <AnimatePresence>
                  {showQuickReplies && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-b border-border/30"
                    >
                      <div className="p-3 flex flex-wrap gap-2">
                        {quickReplies.map((text, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setMessageText(text);
                              setShowQuickReplies(false);
                            }}
                            className="text-xs bg-muted hover:bg-muted/80 text-foreground rounded-full px-3 py-1.5 transition-colors"
                          >
                            {text}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="px-4 py-3 flex items-end gap-2">
                  {/* Attachment */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground shrink-0">
                        <Paperclip className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Anexar arquivo</TooltipContent>
                  </Tooltip>

                  {/* Quick reply toggle */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setShowQuickReplies(!showQuickReplies)}
                        className={cn(
                          "p-2 rounded-lg hover:bg-muted shrink-0 transition-colors",
                          showQuickReplies
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        <Zap className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Respostas rápidas</TooltipContent>
                  </Tooltip>

                  {/* AI suggestion */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground shrink-0">
                        <Sparkles className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Sugestão IA</TooltipContent>
                  </Tooltip>

                  {/* Input */}
                  <div className="flex-1">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="h-10 text-sm bg-muted/30 border-border/50"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          // send logic placeholder
                        }
                      }}
                    />
                  </div>

                  {/* Send */}
                  <Button
                    size="icon"
                    className="h-10 w-10 shrink-0"
                    disabled={!messageText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── Empty state ── */
            <div className="flex-1 hidden lg:flex items-center justify-center bg-muted/5">
              <div className="text-center max-w-xs">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
                  <MessageSquare className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-base font-semibold text-foreground mb-1">
                  Selecione um atendimento
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Escolha uma conversa na lista ao lado para visualizar as
                  mensagens e interagir com o cliente.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default ConversasPage;
