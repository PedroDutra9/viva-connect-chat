import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Search, UserPlus, Shield, Users } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// ---- Types ----
type Funcao = "Administrador" | "Supervisor" | "Agente";
type StatusUsuario = "Ativo" | "Inativo";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  funcao: Funcao;
  filas: string[];
  status: StatusUsuario;
}

// ---- Filas disponíveis ----
const filasDisponiveis = [
  { id: "1", nome: "Comercial" },
  { id: "2", nome: "Suporte Técnico" },
  { id: "3", nome: "Financeiro" },
  { id: "4", nome: "Comercial DIB" },
];

// ---- Funções / níveis de acesso ----
const funcoes: { value: Funcao; label: string; desc: string; color: string; bg: string }[] = [
  {
    value: "Administrador",
    label: "Administrador",
    desc: "Acesso total à plataforma",
    color: "#f97316",
    bg: "#ffedd5",
  },
  {
    value: "Supervisor",
    label: "Supervisor",
    desc: "Monitora filas e agentes",
    color: "#8b5cf6",
    bg: "#ede9fe",
  },
  {
    value: "Agente",
    label: "Agente",
    desc: "Realiza atendimentos",
    color: "#3b82f6",
    bg: "#dbeafe",
  },
];

const getFuncaoDef = (f: Funcao) => funcoes.find(x => x.value === f) || funcoes[2];

// ---- Avatar iniciais ----
const Avatar = ({ nome, size = 36 }: { nome: string; size?: number }) => {
  const parts = nome.trim().split(" ");
  const ini = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#f97316"];
  const color = colors[nome.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: "white", flexShrink: 0,
      letterSpacing: 0.5,
    }}>
      {ini.toUpperCase()}
    </div>
  );
};

// ---- Badge função ----
const FuncaoBadge = ({ funcao }: { funcao: Funcao }) => {
  const def = getFuncaoDef(funcao);
  return (
    <span style={{
      fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
      background: def.bg, color: def.color,
    }}>
      {def.label}
    </span>
  );
};

// ---- Modal criar / editar ----
const ModalUsuario = ({
  usuario,
  onClose,
  onSave,
}: {
  usuario: Usuario | null;
  onClose: () => void;
  onSave: (u: Omit<Usuario, "id" | "status">) => void;
}) => {
  const [nome, setNome] = useState(usuario?.nome || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [senha, setSenha] = useState("");
  const [funcao, setFuncao] = useState<Funcao>(usuario?.funcao || "Agente");
  const [filas, setFilas] = useState<string[]>(usuario?.filas || []);

  const toggleFila = (id: string) =>
    setFilas(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const salvar = () => {
    if (!nome.trim()) return alert("Nome é obrigatório");
    if (!email.trim()) return alert("Email é obrigatório");
    if (!usuario && !senha.trim()) return alert("Senha é obrigatória para novo usuário");
    onSave({ nome, email, senha, funcao, filas });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserPlus size={18} className="text-primary" />
            </div>
            <h2 className="text-base font-bold">{usuario ? "Editar Usuário" : "Novo Usuário"}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Dados básicos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1 text-muted-foreground uppercase tracking-wide">Nome *</label>
              <input className="w-full input text-sm" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1 text-muted-foreground uppercase tracking-wide">Email *</label>
              <input className="w-full input text-sm" type="email" placeholder="email@empresa.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1 text-muted-foreground uppercase tracking-wide">
              {usuario ? "Nova senha (deixe em branco para manter)" : "Senha *"}
            </label>
            <input
              className="w-full input text-sm"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
          </div>

          {/* Nível de acesso */}
          <div>
            <label className="text-xs font-semibold block mb-2 text-muted-foreground uppercase tracking-wide">Nível de acesso *</label>
            <div className="grid grid-cols-3 gap-2">
              {funcoes.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFuncao(f.value)}
                  className="p-3 rounded-xl border-2 text-left transition-all"
                  style={{
                    borderColor: funcao === f.value ? f.color : "#e5e7eb",
                    background: funcao === f.value ? f.bg : "transparent",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Shield size={14} color={f.color} />
                    {funcao === f.value && <Check size={13} color={f.color} />}
                  </div>
                  <p className="text-xs font-bold" style={{ color: f.color }}>{f.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Filas (só para Agente e Supervisor) */}
          {funcao !== "Administrador" && (
            <div>
              <label className="text-xs font-semibold block mb-2 text-muted-foreground uppercase tracking-wide">
                Filas de atendimento
              </label>
              <div className="space-y-1.5">
                {filasDisponiveis.map(fila => {
                  const sel = filas.includes(fila.id);
                  return (
                    <button
                      key={fila.id}
                      onClick={() => toggleFila(fila.id)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-colors"
                      style={{ borderColor: sel ? "var(--primary)" : "#e5e7eb", background: sel ? "#f0fdf4" : "transparent" }}
                    >
                      <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#dcfce7" }}>
                        <Users size={12} color="#22c55e" />
                      </div>
                      <span className="text-sm flex-1">{fila.nome}</span>
                      {sel && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check size={11} color="white" />
                        </div>
                      )}
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
            <Check size={15} /> {usuario ? "Salvar alterações" : "Criar usuário"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Page ----
const EquipePage = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nome: "Pedro", email: "pedro@msviva.com.br", funcao: "Administrador", filas: [], status: "Ativo" },
  ]);
  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState<"novo" | Usuario | null>(null);

  const usuarioParaEditar = modal !== "novo" ? modal as Usuario | null : null;

  const criarOuEditar = (dados: Omit<Usuario, "id" | "status">) => {
    if (modal === "novo") {
      setUsuarios(prev => [...prev, { ...dados, id: Date.now(), status: "Ativo" }]);
    } else if (modal) {
      setUsuarios(prev => prev.map(u => u.id === (modal as Usuario).id ? { ...u, ...dados } : u));
    }
  };

  const excluir = (id: number) => {
    if (confirm("Deseja excluir este usuário?"))
      setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const toggleStatus = (id: number) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Ativo" ? "Inativo" : "Ativo" } : u));
  };

  const filtrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Usuários</h1>
            <p className="text-muted-foreground text-sm">Gerencie os usuários da plataforma</p>
          </div>
          <button
            onClick={() => setModal("novo")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <UserPlus size={18} /> Novo Usuário
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total",        value: usuarios.length,                                        color: "#3b82f6" },
            { label: "Ativos",       value: usuarios.filter(u => u.status === "Ativo").length,      color: "#22c55e" },
            { label: "Admins",       value: usuarios.filter(u => u.funcao === "Administrador").length, color: "#f97316" },
            { label: "Agentes",      value: usuarios.filter(u => u.funcao === "Agente").length,     color: "#8b5cf6" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-background rounded-xl p-4 border border-border">
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Busca */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full input pl-9 text-sm"
            placeholder="Buscar usuários..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>

        {/* Tabela */}
        <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
          {/* Cabeçalho */}
          <div className="grid bg-muted/50 border-b border-border px-5 py-3"
            style={{ gridTemplateColumns: "2fr 2.5fr 1.5fr 1.5fr 1fr 1fr" }}>
            {["USUÁRIO", "EMAIL", "FUNÇÃO", "FILAS", "STATUS", "AÇÕES"].map(col => (
              <span key={col} className="text-xs font-bold text-muted-foreground tracking-wide">{col}</span>
            ))}
          </div>

          {/* Linhas */}
          {filtrados.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <UserPlus size={36} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium">{busca ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}</p>
              {!busca && <p className="text-sm">Clique em "Novo Usuário" para começar</p>}
            </div>
          ) : (
            filtrados.map((u, i) => {
              const filaNames = u.filas.map(fId => filasDisponiveis.find(f => f.id === fId)?.nome).filter(Boolean);
              return (
                <div
                  key={u.id}
                  className="grid px-5 py-4 items-center border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  style={{ gridTemplateColumns: "2fr 2.5fr 1.5fr 1.5fr 1fr 1fr" }}
                >
                  {/* Usuário */}
                  <div className="flex items-center gap-3">
                    <Avatar nome={u.nome} size={36} />
                    <span className="font-semibold text-sm">{u.nome}</span>
                  </div>

                  {/* Email */}
                  <span className="text-sm text-muted-foreground">{u.email}</span>

                  {/* Função */}
                  <FuncaoBadge funcao={u.funcao} />

                  {/* Filas */}
                  <div className="flex flex-wrap gap-1">
                    {filaNames.length === 0 ? (
                      <span className="text-muted-foreground text-sm">—</span>
                    ) : (
                      filaNames.slice(0, 2).map((f, idx) => (
                        <span key={idx} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                          {f}
                        </span>
                      ))
                    )}
                    {filaNames.length > 2 && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                        +{filaNames.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Status */}
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors w-fit"
                    style={{
                      borderColor: u.status === "Ativo" ? "#22c55e" : "#e5e7eb",
                      color: u.status === "Ativo" ? "#16a34a" : "#9ca3af",
                      background: u.status === "Ativo" ? "#f0fdf4" : "transparent",
                    }}
                  >
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: u.status === "Ativo" ? "#22c55e" : "#d1d5db",
                      display: "inline-block"
                    }} />
                    {u.status}
                  </button>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModal(u)}
                      className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => excluir(u.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {modal !== null && (
        <ModalUsuario
          usuario={usuarioParaEditar}
          onClose={() => setModal(null)}
          onSave={criarOuEditar}
        />
      )}
    </DashboardLayout>
  );
};

export default EquipePage;
