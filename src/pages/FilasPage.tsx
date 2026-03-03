import { useState } from "react";
import { Plus, Pencil, Trash2, Users, X, UserPlus, Check, Layers } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// ---- Types ----
interface Agente {
  id: number;
  nome: string;
  email: string;
  avatar?: string;
}

interface Fila {
  id: number;
  nome: string;
  descricao?: string;
  ativa: boolean;
  agentes: Agente[];
}

// ---- Mock de agentes disponíveis na empresa ----
const agentesDisponiveis: Agente[] = [
  { id: 1, nome: "Ana Paula", email: "ana@empresa.com" },
  { id: 2, nome: "Carlos Silva", email: "carlos@empresa.com" },
  { id: 3, nome: "Fernanda Lima", email: "fernanda@empresa.com" },
  { id: 4, nome: "João Martins", email: "joao@empresa.com" },
  { id: 5, nome: "Mariana Costa", email: "mariana@empresa.com" },
  { id: 6, nome: "Roberto Alves", email: "roberto@empresa.com" },
];

// ---- Helper: initials avatar ----
const Iniciais = ({ nome, size = 32 }: { nome: string; size?: number }) => {
  const parts = nome.trim().split(" ");
  const ini = (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#f97316"];
  const color = colors[nome.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color + "22",
      border: `2px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color, flexShrink: 0
    }}>
      {ini.toUpperCase()}
    </div>
  );
};

// ---- Modal: Agentes da fila ----
const ModalAgentes = ({
  fila, onClose, onSave
}: {
  fila: Fila;
  onClose: () => void;
  onSave: (agentes: Agente[]) => void;
}) => {
  const [selecionados, setSelecionados] = useState<Agente[]>(fila.agentes);
  const [busca, setBusca] = useState("");

  const toggle = (agente: Agente) => {
    setSelecionados(prev =>
      prev.find(a => a.id === agente.id)
        ? prev.filter(a => a.id !== agente.id)
        : [...prev, agente]
    );
  };

  const filtrados = agentesDisponiveis.filter(a =>
    a.nome.toLowerCase().includes(busca.toLowerCase()) ||
    a.email.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-lg font-bold">Agentes da Fila</h2>
            <p className="text-sm text-muted-foreground">{fila.nome}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted">
            <X size={18} />
          </button>
        </div>

        {/* Agentes selecionados */}
        {selecionados.length > 0 && (
          <div className="px-5 pt-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Selecionados ({selecionados.length})
            </p>
            <div className="flex flex-wrap gap-2 mb-1">
              {selecionados.map(a => (
                <div key={a.id} className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                  <Iniciais nome={a.nome} size={18} />
                  {a.nome.split(" ")[0]}
                  <button onClick={() => toggle(a)} className="ml-1 hover:opacity-70">
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Busca */}
        <div className="px-5 pt-3 pb-2">
          <input
            className="w-full input text-sm"
            placeholder="Buscar agente..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>

        {/* Lista */}
        <div className="px-5 pb-3 max-h-64 overflow-y-auto space-y-1">
          {filtrados.map(agente => {
            const sel = !!selecionados.find(a => a.id === agente.id);
            return (
              <button
                key={agente.id}
                onClick={() => toggle(agente)}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors text-left"
                style={{ border: sel ? "1.5px solid var(--primary)" : "1.5px solid transparent" }}
              >
                <Iniciais nome={agente.nome} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{agente.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">{agente.email}</p>
                </div>
                {sel && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check size={11} color="white" />
                  </div>
                )}
              </button>
            );
          })}
          {filtrados.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum agente encontrado</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-sm">Cancelar</button>
          <button
            onClick={() => { onSave(selecionados); onClose(); }}
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-2"
          >
            <Check size={15} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Modal: Criar / Editar Fila ----
const ModalFila = ({
  fila, onClose, onSave
}: {
  fila: Fila | null;
  onClose: () => void;
  onSave: (dados: { nome: string; descricao: string }) => void;
}) => {
  const [nome, setNome] = useState(fila?.nome || "");
  const [descricao, setDescricao] = useState(fila?.descricao || "");

  const salvar = () => {
    if (!nome.trim()) return alert("Nome da fila é obrigatório");
    onSave({ nome, descricao });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{fila ? "Editar Fila" : "Nova Fila"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Nome da fila *</label>
          <input
            className="w-full input"
            placeholder="ex: Suporte Técnico, Comercial..."
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Descrição <span className="text-muted-foreground font-normal">(opcional)</span></label>
          <textarea
            className="w-full input resize-none"
            rows={3}
            placeholder="Descreva o propósito desta fila..."
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-sm">Cancelar</button>
          <button onClick={salvar} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold">
            {fila ? "Salvar alterações" : "Criar fila"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Card da Fila ----
const FilaCard = ({
  fila,
  onEditar,
  onExcluir,
  onAbrirAgentes,
  onToggleAtiva,
}: {
  fila: Fila;
  onEditar: () => void;
  onExcluir: () => void;
  onAbrirAgentes: () => void;
  onToggleAtiva: () => void;
}) => {
  return (
    <div className="bg-background rounded-2xl p-5 shadow-sm border border-border space-y-4 hover:shadow-md transition-shadow">
      {/* Top */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#dcfce7" }}>
          <Layers size={20} color="#22c55e" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base truncate">{fila.nome}</h3>
            <button
              onClick={onToggleAtiva}
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                fila.ativa
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-600 hover:bg-red-200"
              }`}
            >
              {fila.ativa ? "Ativa" : "Inativa"}
            </button>
          </div>
          <p className="text-sm text-muted-foreground truncate">{fila.descricao || fila.nome}</p>
        </div>
      </div>

      {/* Agentes preview */}
      {fila.agentes.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {fila.agentes.slice(0, 4).map(a => (
              <div key={a.id} title={a.nome}>
                <Iniciais nome={a.nome} size={28} />
              </div>
            ))}
            {fila.agentes.length > 4 && (
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#f1f5f9", border: "2px solid white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#6b7280"
              }}>
                +{fila.agentes.length - 4}
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {fila.agentes.length} agente{fila.agentes.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onAbrirAgentes}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
        >
          <Users size={15} />
          Agentes
        </button>
        <button
          onClick={onEditar}
          className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          title="Editar fila"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onExcluir}
          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
          title="Excluir fila"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// ---- Page ----
const FilasPage = () => {
  const [filas, setFilas] = useState<Fila[]>([
    { id: 1, nome: "Comercial", descricao: "Comercial", ativa: true, agentes: [] },
    { id: 2, nome: "Suporte Técnico", descricao: "Suporte Técnico", ativa: true, agentes: [] },
    { id: 3, nome: "Financeiro", descricao: "Financeiro", ativa: true, agentes: [] },
    { id: 4, nome: "Comercial DIB", descricao: "Comercial DIB", ativa: true, agentes: [] },
  ]);

  const [modalFila, setModalFila] = useState<"novo" | Fila | null>(null);
  const [modalAgentes, setModalAgentes] = useState<Fila | null>(null);

  const criarOuEditar = (dados: { nome: string; descricao: string }) => {
    if (modalFila === "novo") {
      setFilas(prev => [...prev, {
        id: Date.now(),
        nome: dados.nome,
        descricao: dados.descricao,
        ativa: true,
        agentes: [],
      }]);
    } else if (modalFila) {
      setFilas(prev => prev.map(f =>
        f.id === (modalFila as Fila).id
          ? { ...f, nome: dados.nome, descricao: dados.descricao }
          : f
      ));
    }
  };

  const excluirFila = (id: number) => {
    if (confirm("Deseja excluir esta fila?")) {
      setFilas(prev => prev.filter(f => f.id !== id));
    }
  };

  const salvarAgentes = (filaId: number, agentes: Agente[]) => {
    setFilas(prev => prev.map(f => f.id === filaId ? { ...f, agentes } : f));
  };

  const toggleAtiva = (id: number) => {
    setFilas(prev => prev.map(f => f.id === id ? { ...f, ativa: !f.ativa } : f));
  };

  const filaParaModal = modalFila !== "novo" ? modalFila as Fila | null : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Filas de Atendimento</h1>
            <p className="text-muted-foreground text-sm">
              Gerencie as filas de atendimento e seus agentes
            </p>
          </div>
          <button
            onClick={() => setModalFila("novo")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={18} />
            Nova Fila
          </button>
        </div>

        {/* Stats rápidos */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total de Filas", value: filas.length, color: "#3b82f6" },
            { label: "Filas Ativas", value: filas.filter(f => f.ativa).length, color: "#22c55e" },
            { label: "Agentes Atribuídos", value: new Set(filas.flatMap(f => f.agentes.map(a => a.id))).size, color: "#f59e0b" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-background rounded-xl p-4 border border-border">
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Grid de filas */}
        {filas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Layers size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhuma fila criada</p>
            <p className="text-sm">Clique em "Nova Fila" para começar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filas.map(fila => (
              <FilaCard
                key={fila.id}
                fila={fila}
                onEditar={() => setModalFila(fila)}
                onExcluir={() => excluirFila(fila.id)}
                onAbrirAgentes={() => setModalAgentes(fila)}
                onToggleAtiva={() => toggleAtiva(fila.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal criar/editar fila */}
      {modalFila !== null && (
        <ModalFila
          fila={filaParaModal}
          onClose={() => setModalFila(null)}
          onSave={criarOuEditar}
        />
      )}

      {/* Modal agentes */}
      {modalAgentes && (
        <ModalAgentes
          fila={modalAgentes}
          onClose={() => setModalAgentes(null)}
          onSave={(agentes) => salvarAgentes(modalAgentes.id, agentes)}
        />
      )}
    </DashboardLayout>
  );
};

export default FilasPage;
