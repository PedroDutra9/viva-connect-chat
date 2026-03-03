import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Layers, Building2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

// ---- Types ----
interface HorarioDia {
  ativo: boolean;
  inicio: string;
  fim: string;
}

interface Horario {
  segunda: HorarioDia;
  terca: HorarioDia;
  quarta: HorarioDia;
  quinta: HorarioDia;
  sexta: HorarioDia;
  sabado: HorarioDia;
  domingo: HorarioDia;
}

interface Setor {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
  filas: string[]; // ids das filas vinculadas
  horario: Horario;
}

// ---- Filas disponíveis (vindas da FilasPage) ----
const filasDisponiveis = [
  { id: "1", nome: "Comercial" },
  { id: "2", nome: "Suporte Técnico" },
  { id: "3", nome: "Financeiro" },
  { id: "4", nome: "Comercial DIB" },
];

const diasSemana = [
  { key: "segunda", label: "Segunda-feira" },
  { key: "terca",   label: "Terça-feira" },
  { key: "quarta",  label: "Quarta-feira" },
  { key: "quinta",  label: "Quinta-feira" },
  { key: "sexta",   label: "Sexta-feira" },
  { key: "sabado",  label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];

const horarioPadrao = (): Horario => ({
  segunda: { ativo: true,  inicio: "08:00", fim: "18:00" },
  terca:   { ativo: true,  inicio: "08:00", fim: "18:00" },
  quarta:  { ativo: true,  inicio: "08:00", fim: "18:00" },
  quinta:  { ativo: true,  inicio: "08:00", fim: "18:00" },
  sexta:   { ativo: true,  inicio: "08:00", fim: "18:00" },
  sabado:  { ativo: false, inicio: "08:00", fim: "12:00" },
  domingo: { ativo: false, inicio: "08:00", fim: "12:00" },
});

// ---- Modal: Horário de Funcionamento ----
const ModalHorario = ({
  setor,
  onClose,
  onSave,
}: {
  setor: Setor;
  onClose: () => void;
  onSave: (horario: Horario) => void;
}) => {
  const [horario, setHorario] = useState<Horario>({ ...setor.horario });

  const updateDia = (dia: string, field: keyof HorarioDia, value: any) => {
    setHorario(prev => ({
      ...prev,
      [dia]: { ...(prev as any)[dia], [field]: value },
    }));
  };

  const aplicarTodos = () => {
    const base = (horario as any)["segunda"];
    const novo = { ...horario };
    diasSemana.forEach(({ key }) => {
      (novo as any)[key] = { ...(novo as any)[key], inicio: base.inicio, fim: base.fim };
    });
    setHorario(novo);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold">Horário de Funcionamento</h2>
              <p className="text-xs text-muted-foreground">{setor.nome}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-2 max-h-[70vh] overflow-y-auto">
          <div className="flex justify-end mb-3">
            <button
              onClick={aplicarTodos}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Aplicar horário da Segunda para todos
            </button>
          </div>

          {diasSemana.map(({ key, label }) => {
            const dia = (horario as any)[key] as HorarioDia;
            return (
              <div
                key={key}
                className="flex items-center gap-3 p-3 rounded-xl border border-border"
                style={{ opacity: dia.ativo ? 1 : 0.5 }}
              >
                {/* Toggle */}
                <button
                  onClick={() => updateDia(key, "ativo", !dia.ativo)}
                  className="flex-shrink-0"
                >
                  <div style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: dia.ativo ? "#22c55e" : "#e5e7eb",
                    position: "relative", transition: "background 0.2s"
                  }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: "50%", background: "white",
                      position: "absolute", top: 3,
                      left: dia.ativo ? 18 : 3,
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                    }} />
                  </div>
                </button>

                {/* Dia */}
                <span className="text-sm font-medium w-32 flex-shrink-0">{label}</span>

                {/* Horários */}
                {dia.ativo ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      className="input text-sm flex-1 min-w-0"
                      value={dia.inicio}
                      onChange={e => updateDia(key, "inicio", e.target.value)}
                    />
                    <span className="text-muted-foreground text-sm flex-shrink-0">até</span>
                    <input
                      type="time"
                      className="input text-sm flex-1 min-w-0"
                      value={dia.fim}
                      onChange={e => updateDia(key, "fim", e.target.value)}
                    />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Fechado</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-sm">Cancelar</button>
          <button
            onClick={() => { onSave(horario); onClose(); }}
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-2"
          >
            <Check size={15} /> Salvar horário
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Modal: Ver / Vincular Filas ----
const ModalFilas = ({
  setor,
  onClose,
  onSave,
}: {
  setor: Setor;
  onClose: () => void;
  onSave: (filas: string[]) => void;
}) => {
  const [selecionadas, setSelecionadas] = useState<string[]>(setor.filas);

  const toggle = (id: string) => {
    setSelecionadas(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-base font-bold">Filas do Setor</h2>
            <p className="text-xs text-muted-foreground">{setor.nome}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-2">
          <p className="text-xs text-muted-foreground mb-3">Selecione as filas que pertencem a este setor:</p>
          {filasDisponiveis.map(fila => {
            const sel = selecionadas.includes(fila.id);
            return (
              <button
                key={fila.id}
                onClick={() => toggle(fila.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left"
                style={{ borderColor: sel ? "var(--primary)" : "#e5e7eb", background: sel ? "var(--primary)08" : "transparent" }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "#dcfce7" }}>
                  <Layers size={15} color="#22c55e" />
                </div>
                <span className="text-sm font-medium flex-1">{fila.nome}</span>
                {sel && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check size={11} color="white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-sm">Cancelar</button>
          <button
            onClick={() => { onSave(selecionadas); onClose(); }}
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold flex items-center gap-2"
          >
            <Check size={15} /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Modal: Criar / Editar Setor ----
const ModalSetor = ({
  setor,
  onClose,
  onSave,
}: {
  setor: Setor | null;
  onClose: () => void;
  onSave: (dados: { nome: string; descricao: string }) => void;
}) => {
  const [nome, setNome] = useState(setor?.nome || "");
  const [descricao, setDescricao] = useState(setor?.descricao || "");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-background rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{setor ? "Editar Setor" : "Novo Setor"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted"><X size={18} /></button>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Nome do setor *</label>
          <input
            className="w-full input"
            placeholder="ex: Comercial, Suporte Técnico..."
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">
            Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <textarea
            className="w-full input resize-none"
            rows={3}
            placeholder="Descreva o propósito deste setor..."
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-sm">Cancelar</button>
          <button
            onClick={() => {
              if (!nome.trim()) return alert("Nome é obrigatório");
              onSave({ nome, descricao });
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold"
          >
            {setor ? "Salvar alterações" : "Criar setor"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- Resumo de horário ----
const ResumoHorario = ({ horario }: { horario: Horario }) => {
  const diasAtivos = diasSemana.filter(d => (horario as any)[d.key]?.ativo);
  if (diasAtivos.length === 0) return <span className="text-xs text-muted-foreground">Sem horário definido</span>;
  const h = (horario as any)[diasAtivos[0].key] as HorarioDia;
  return (
    <span className="text-xs text-muted-foreground">
      {diasAtivos.length} dia{diasAtivos.length > 1 ? "s" : ""} · {h.inicio}–{h.fim}
    </span>
  );
};

// ---- Card do Setor ----
const SetorCard = ({
  setor,
  onEditar,
  onExcluir,
  onVerFilas,
  onHorario,
  onToggle,
}: {
  setor: Setor;
  onEditar: () => void;
  onExcluir: () => void;
  onVerFilas: () => void;
  onHorario: () => void;
  onToggle: () => void;
}) => {
  const filaCount = setor.filas.length;

  return (
    <div className="bg-background rounded-2xl p-5 shadow-sm border border-border space-y-4 hover:shadow-md transition-shadow">
      {/* Top */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#dcfce7" }}>
          <Building2 size={20} color="#22c55e" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base truncate">{setor.nome}</h3>
            <button
              onClick={onToggle}
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                setor.ativo
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-600 hover:bg-red-200"
              }`}
            >
              {setor.ativo ? "Ativo" : "Inativo"}
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            {filaCount} fila{filaCount !== 1 ? "s" : ""}
          </p>
          <ResumoHorario horario={setor.horario} />
        </div>
      </div>

      {/* Filas vinculadas preview */}
      {filaCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {setor.filas.slice(0, 3).map(fId => {
            const f = filasDisponiveis.find(x => x.id === fId);
            return f ? (
              <span key={fId} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">
                {f.nome}
              </span>
            ) : null;
          })}
          {filaCount > 3 && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-medium">
              +{filaCount - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onVerFilas}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
        >
          <Layers size={15} />
          Ver Filas
        </button>
        <button
          onClick={onHorario}
          className="p-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
          title="Horário de funcionamento"
        >
          <Clock size={16} />
        </button>
        <button
          onClick={onEditar}
          className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          title="Editar setor"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onExcluir}
          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
          title="Excluir setor"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// ---- Page ----
const SetoresPage = () => {
  const [setores, setSetores] = useState<Setor[]>([
    { id: 1, nome: "Comercial DIB",   descricao: "", ativo: true, filas: ["4"], horario: horarioPadrao() },
    { id: 2, nome: "Suporte Técnico", descricao: "", ativo: true, filas: ["2"], horario: horarioPadrao() },
    { id: 3, nome: "Comercial",       descricao: "", ativo: true, filas: ["1"], horario: horarioPadrao() },
    { id: 4, nome: "Financeiro",      descricao: "", ativo: true, filas: ["3"], horario: horarioPadrao() },
  ]);

  const [modalSetor,   setModalSetor]   = useState<"novo" | Setor | null>(null);
  const [modalFilas,   setModalFilas]   = useState<Setor | null>(null);
  const [modalHorario, setModalHorario] = useState<Setor | null>(null);

  const criarOuEditar = (dados: { nome: string; descricao: string }) => {
    if (modalSetor === "novo") {
      setSetores(prev => [...prev, {
        id: Date.now(), nome: dados.nome, descricao: dados.descricao,
        ativo: true, filas: [], horario: horarioPadrao(),
      }]);
    } else if (modalSetor) {
      setSetores(prev => prev.map(s =>
        s.id === (modalSetor as Setor).id ? { ...s, ...dados } : s
      ));
    }
  };

  const salvarFilas = (setorId: number, filas: string[]) => {
    setSetores(prev => prev.map(s => s.id === setorId ? { ...s, filas } : s));
  };

  const salvarHorario = (setorId: number, horario: Horario) => {
    setSetores(prev => prev.map(s => s.id === setorId ? { ...s, horario } : s));
  };

  const excluir = (id: number) => {
    if (confirm("Deseja excluir este setor?"))
      setSetores(prev => prev.filter(s => s.id !== id));
  };

  const toggle = (id: number) => {
    setSetores(prev => prev.map(s => s.id === id ? { ...s, ativo: !s.ativo } : s));
  };

  const setorParaModal = modalSetor !== "novo" ? modalSetor as Setor | null : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Setores</h1>
            <p className="text-muted-foreground text-sm">Organize seus departamentos e equipes</p>
          </div>
          <button
            onClick={() => setModalSetor("novo")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={18} /> Novo Setor
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total de Setores", value: setores.length, color: "#3b82f6" },
            { label: "Setores Ativos", value: setores.filter(s => s.ativo).length, color: "#22c55e" },
            { label: "Filas Vinculadas", value: new Set(setores.flatMap(s => s.filas)).size, color: "#f59e0b" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-background rounded-xl p-4 border border-border">
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        {setores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Building2 size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum setor criado</p>
            <p className="text-sm">Clique em "Novo Setor" para começar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {setores.map(setor => (
              <SetorCard
                key={setor.id}
                setor={setor}
                onEditar={() => setModalSetor(setor)}
                onExcluir={() => excluir(setor.id)}
                onVerFilas={() => setModalFilas(setor)}
                onHorario={() => setModalHorario(setor)}
                onToggle={() => toggle(setor.id)}
              />
            ))}
          </div>
        )}
      </div>

      {modalSetor !== null && (
        <ModalSetor
          setor={setorParaModal}
          onClose={() => setModalSetor(null)}
          onSave={criarOuEditar}
        />
      )}

      {modalFilas && (
        <ModalFilas
          setor={modalFilas}
          onClose={() => setModalFilas(null)}
          onSave={(filas) => salvarFilas(modalFilas.id, filas)}
        />
      )}

      {modalHorario && (
        <ModalHorario
          setor={modalHorario}
          onClose={() => setModalHorario(null)}
          onSave={(horario) => salvarHorario(modalHorario.id, horario)}
        />
      )}
    </DashboardLayout>
  );
};

export default SetoresPage;
