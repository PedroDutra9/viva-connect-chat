import { useState } from "react";
import { Plus, Pencil, Trash2, Power, GitBranch } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import FlowEditorPage from "./FlowEditor";

interface Fluxo {
  id: number;
  nome: string;
  descricao?: string;
  canal?: string;
  trigger: string;
  ativo: boolean;
}

const canaisMock = ["WhatsApp", "Instagram", "Facebook"];

const FluxosPage = () => {
  const [fluxos, setFluxos] = useState<Fluxo[]>([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Fluxo | null>(null);
  const [editandoFluxo, setEditandoFluxo] = useState<Fluxo | null>(null); // abre o editor de nós

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [canal, setCanal] = useState("");

  const abrirNovo = () => {
    setEditando(null);
    setNome("");
    setDescricao("");
    setCanal("");
    setOpen(true);
  };

  const abrirEditar = (fluxo: Fluxo) => {
    setEditando(fluxo);
    setNome(fluxo.nome);
    setDescricao(fluxo.descricao || "");
    setCanal(fluxo.canal || "");
    setOpen(true);
  };

  const salvarFluxo = () => {
    if (!nome.trim()) {
      alert("Nome do fluxo é obrigatório");
      return;
    }

    if (editando) {
      setFluxos((prev) =>
        prev.map((f) =>
          f.id === editando.id ? { ...f, nome, descricao, canal } : f
        )
      );
    } else {
      const novoFluxo: Fluxo = {
        id: Date.now(),
        nome,
        descricao,
        canal,
        trigger: "Automático (início de conversa)",
        ativo: true,
      };
      setFluxos([...fluxos, novoFluxo]);
    }

    setOpen(false);
  };

  const alternarStatus = (id: number) => {
    setFluxos((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ativo: !f.ativo } : f))
    );
  };

  const excluirFluxo = (id: number) => {
    if (confirm("Deseja realmente excluir este fluxo?")) {
      setFluxos((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // Se tiver um fluxo sendo editado no canvas, renderiza o editor fullscreen
  if (editandoFluxo) {
    return (
      <FlowEditorPage
        fluxo={editandoFluxo}
        onVoltar={() => setEditandoFluxo(null)}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fluxos de Atendimento</h1>
            <p className="text-muted-foreground text-sm">
              Crie e gerencie fluxos automatizados de atendimento
            </p>
          </div>

          <button
            onClick={abrirNovo}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            Novo Fluxo
          </button>
        </div>

        {fluxos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <GitBranch size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum fluxo criado ainda</p>
            <p className="text-sm">Clique em "Novo Fluxo" para começar</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fluxos.map((f) => (
            <div key={f.id} className="glass-card rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{f.nome}</h3>
                  <p className="text-sm text-muted-foreground">
                    {f.descricao || "Sem descrição"}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    f.ativo
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {f.ativo ? "Ativo" : "Desligado"}
                </span>
              </div>

              <p className="text-xs">Canal: {f.canal || "Todos"}</p>
              <p className="text-xs">Trigger: {f.trigger}</p>

              <div className="flex justify-end gap-2 pt-2">
                {/* Botão para abrir o editor de fluxo visual */}
                <button
                  onClick={() => setEditandoFluxo(f)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium"
                  title="Editar fluxo"
                >
                  <GitBranch size={14} />
                  Editar Fluxo
                </button>

                <button
                  onClick={() => abrirEditar(f)}
                  className="p-2 rounded-lg bg-muted"
                  title="Editar informações"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => alternarStatus(f.id)}
                  className="p-2 rounded-lg bg-muted"
                  title="Ativar/Desativar"
                >
                  <Power size={16} />
                </button>

                <button
                  onClick={() => excluirFluxo(f.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-background rounded-xl w-full max-w-lg p-6 space-y-4">
              <h2 className="text-xl font-bold">
                {editando ? "Editar Fluxo" : "Novo Fluxo"}
              </h2>

              <div>
                <label className="text-sm font-medium">Nome *</label>
                <input
                  className="w-full mt-1 input"
                  placeholder="Nome do fluxo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Descrição</label>
                <textarea
                  className="w-full mt-1 input"
                  placeholder="Descrição do fluxo (opcional)"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Canal (Opcional)</label>
                <select
                  className="w-full mt-1 input"
                  value={canal}
                  onChange={(e) => setCanal(e.target.value)}
                >
                  <option value="">Selecione um canal ou deixe em branco</option>
                  {canaisMock.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Tipo de Trigger</label>
                <select className="w-full mt-1 input" disabled>
                  <option>Automático (início de conversa)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg bg-muted"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarFluxo}
                  className="px-4 py-2 rounded-lg bg-primary text-white"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FluxosPage;
