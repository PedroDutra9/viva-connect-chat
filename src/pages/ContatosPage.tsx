import { useState, useRef } from "react";
import {
  UserPlus, Upload, Tag, Search, Clock, User, MessageSquare,
  TrendingUp, X, Check, Phone, Mail, Plus, Pencil, Trash2,
  ChevronDown, MessageCircle
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// ---- Types ----
interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  tags: string[];
  mensagens: number;
  atendimentos: number;
  criadoEm: Date;
  canal?: string;
}

type OrdenarPor = "recentes" | "nome" | "mensagens" | "atendimentos";

// ---- Avatar ----
const Avatar = ({ nome, size = 40 }: { nome: string; size?: number }) => {
  const parts = nome.trim().split(" ");
  const ini = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#f97316"];
  const color = colors[nome.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, color: "white", flexShrink: 0,
    }}>
      {ini.toUpperCase()}
    </div>
  );
};

// ---- Modal: Gerenciar Tags ----
const ModalTags = ({
  tags, onClose, onSave,
}: { tags: string[]; onClose: () => void; onSave: (tags: string[]) => void }) => {
  const [lista, setLista] = useState<string[]>(tags);
  const [nova, setNova] = useState("");

  const adicionar = () => {
    const t = nova.trim();
    if (t && !lista.includes(t)) setLista(prev => [...prev, t]);
    setNova("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Tag size={17} className="text-primary" />
            </div>
            <h2 className="font-bold text-base">Gerenciar Tags</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex gap-2">
            <input
              className="flex-1 input text-sm"
              placeholder="Nova tag..."
              value={nova}
              onChange={e => setNova(e.target.value)}
              onKeyDown={e => e.key === "Enter" && adicionar()}
            />
            <button onClick={adicionar} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold flex items-center gap-1">
              <Plus size={15} /> Adicionar
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[60px]">
            {lista.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma tag criada ainda.</p>}
            {lista.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                {tag}
                <button onClick={() => setLista(prev => prev.filter(t => t !== tag))} className="hover:opacity-60">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-sm">Cancelar</button>
          <button onClick={() => { onSave(lista); onClose(); }} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-2">
            <Check size={15} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Modal: Adicionar / Editar Contato ----
const ModalContato = ({
  contato, tags, onClose, onSave,
}: {
  contato: Contato | null;
  tags: string[];
  onClose: () => void;
  onSave: (dados: Partial<Contato>) => void;
}) => {
  const [nome, setNome] = useState(contato?.nome || "");
  const [telefone, setTelefone] = useState(contato?.telefone || "");
  const [email, setEmail] = useState(contato?.email || "");
  const [tagsSel, setTagsSel] = useState<string[]>(contato?.tags || []);

  const toggleTag = (t: string) =>
    setTagsSel(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const salvar = () => {
    if (!nome.trim()) return alert("Nome é obrigatório");
    if (!telefone.trim()) return alert("Telefone é obrigatório");
    onSave({ nome, telefone, email, tags: tagsSel });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserPlus size={17} className="text-primary" />
            </div>
            <h2 className="font-bold text-base">{contato ? "Editar Contato" : "Novo Contato"}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Nome *</label>
            <input className="w-full input text-sm" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Telefone *</label>
              <input className="w-full input text-sm" placeholder="+55 67 99999-9999" value={telefone} onChange={e => setTelefone(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">Email</label>
              <input className="w-full input text-sm" type="email" placeholder="email@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          {tags.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => {
                  const sel = tagsSel.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all"
                      style={{
                        borderColor: sel ? "var(--primary)" : "#e5e7eb",
                        background: sel ? "var(--primary)" : "transparent",
                        color: sel ? "white" : "#6b7280",
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-sm">Cancelar</button>
          <button onClick={salvar} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-2">
            <Check size={15} /> {contato ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Modal: Importar CSV ----
const ModalImportar = ({ onClose }: { onClose: () => void }) => {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Upload size={17} className="text-primary" />
            </div>
            <h2 className="font-bold text-base">Importar Contatos</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Upload size={28} className="mx-auto mb-3 text-muted-foreground" />
            {arquivo ? (
              <p className="text-sm font-semibold text-primary">{arquivo.name}</p>
            ) : (
              <>
                <p className="text-sm font-semibold">Clique para selecionar o arquivo</p>
                <p className="text-xs text-muted-foreground mt-1">Formato CSV com colunas: nome, telefone, email</p>
              </>
            )}
            <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={e => setArquivo(e.target.files?.[0] || null)} />
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Formato esperado do CSV:</p>
            <code className="text-xs text-primary">nome,telefone,email<br />João Silva,+5567999999999,joao@email.com</code>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-sm">Cancelar</button>
          <button
            onClick={onClose}
            disabled={!arquivo}
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-40"
          >
            <Upload size={15} /> Importar
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Linha do contato ----
const ContatoRow = ({
  contato, onEditar, onExcluir,
}: { contato: Contato; onEditar: () => void; onExcluir: () => void }) => (
  <div className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-muted/20 transition-colors group">
    <Avatar nome={contato.nome} size={40} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="font-semibold text-sm">{contato.nome}</p>
        {contato.tags.map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{tag}</span>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-0.5">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Phone size={11} /> {contato.telefone}
        </span>
        {contato.email && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail size={11} /> {contato.email}
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-5 text-center">
      <div>
        <p className="text-sm font-bold">{contato.mensagens}</p>
        <p className="text-xs text-muted-foreground">Mensagens</p>
      </div>
      <div>
        <p className="text-sm font-bold">{contato.atendimentos}</p>
        <p className="text-xs text-muted-foreground">Atendimentos</p>
      </div>
    </div>
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Iniciar conversa">
        <MessageCircle size={15} />
      </button>
      <button onClick={onEditar} className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors" title="Editar">
        <Pencil size={15} />
      </button>
      <button onClick={onExcluir} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors" title="Excluir">
        <Trash2 size={15} />
      </button>
    </div>
  </div>
);

// ---- Page ----
const ContatosPage = () => {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [tags, setTags] = useState<string[]>(["Cliente", "Lead", "VIP", "Inativo"]);
  const [busca, setBusca] = useState("");
  const [ordenar, setOrdenar] = useState<OrdenarPor>("recentes");
  const [modalContato, setModalContato] = useState<"novo" | Contato | null>(null);
  const [modalTags, setModalTags] = useState(false);
  const [modalImportar, setModalImportar] = useState(false);

  const contatoParaEditar = modalContato !== "novo" ? modalContato as Contato | null : null;

  const salvarContato = (dados: Partial<Contato>) => {
    if (modalContato === "novo") {
      setContatos(prev => [...prev, {
        id: Date.now(), mensagens: 0, atendimentos: 0,
        criadoEm: new Date(), tags: [],
        nome: "", telefone: "", ...dados,
      } as Contato]);
    } else if (modalContato) {
      setContatos(prev => prev.map(c => c.id === (modalContato as Contato).id ? { ...c, ...dados } : c));
    }
  };

  const excluir = (id: number) => {
    if (confirm("Deseja excluir este contato?"))
      setContatos(prev => prev.filter(c => c.id !== id));
  };

  const filtrados = contatos
    .filter(c =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.telefone.includes(busca)
    )
    .sort((a, b) => {
      if (ordenar === "nome") return a.nome.localeCompare(b.nome);
      if (ordenar === "mensagens") return b.mensagens - a.mensagens;
      if (ordenar === "atendimentos") return b.atendimentos - a.atendimentos;
      return b.criadoEm.getTime() - a.criadoEm.getTime();
    });

  const tabs: { key: OrdenarPor; label: string; icon: any }[] = [
    { key: "recentes",     label: "Recentes",     icon: Clock },
    { key: "nome",         label: "Nome",         icon: User },
    { key: "mensagens",    label: "Mensagens",    icon: MessageSquare },
    { key: "atendimentos", label: "Atendimentos", icon: TrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Contatos</h1>
            <p className="text-muted-foreground text-sm">Gerencie seus contatos e inicie conversas</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalContato("novo")}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <UserPlus size={17} /> Adicionar
            </button>
            <button
              onClick={() => setModalImportar(true)}
              className="flex items-center gap-2 border border-border bg-background px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
            >
              <Upload size={16} /> Importar
            </button>
            <button
              onClick={() => setModalTags(true)}
              className="flex items-center gap-2 border border-border bg-background px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
            >
              <Tag size={16} /> Gerenciar Tags
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total de Contatos",    value: contatos.length,                          icon: User,          color: "#22c55e", bg: "#dcfce7" },
            { label: "Total de Mensagens",   value: contatos.reduce((a,c) => a+c.mensagens, 0),   icon: MessageSquare, color: "#3b82f6", bg: "#dbeafe" },
            { label: "Total de Atendimentos",value: contatos.reduce((a,c) => a+c.atendimentos, 0), icon: TrendingUp,   color: "#f59e0b", bg: "#fef3c7" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-background rounded-2xl p-5 border border-border flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-3xl font-bold mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Busca + filtros */}
        <div className="bg-background rounded-2xl border border-border p-4 space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full input pl-9 text-sm"
              placeholder="Buscar por nome ou telefone..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setOrdenar(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: ordenar === key ? "var(--primary)" : "transparent",
                  color: ordenar === key ? "white" : "#6b7280",
                }}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-border">
            <p className="text-sm font-bold">{filtrados.length} contato{filtrados.length !== 1 ? "s" : ""}</p>
          </div>
          {filtrados.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <User size={40} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium">{busca ? "Nenhum contato encontrado" : "Nenhum contato cadastrado"}</p>
              {!busca && <p className="text-sm mt-1">Clique em "Adicionar" para começar</p>}
            </div>
          ) : (
            filtrados.map(c => (
              <ContatoRow
                key={c.id}
                contato={c}
                onEditar={() => setModalContato(c)}
                onExcluir={() => excluir(c.id)}
              />
            ))
          )}
        </div>
      </div>

      {modalContato !== null && (
        <ModalContato
          contato={contatoParaEditar}
          tags={tags}
          onClose={() => setModalContato(null)}
          onSave={salvarContato}
        />
      )}
      {modalTags && (
        <ModalTags tags={tags} onClose={() => setModalTags(false)} onSave={setTags} />
      )}
      {modalImportar && (
        <ModalImportar onClose={() => setModalImportar(false)} />
      )}
    </DashboardLayout>
  );
};

export default ContatosPage;
