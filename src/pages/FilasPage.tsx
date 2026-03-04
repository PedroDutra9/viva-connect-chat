import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Users, X, Check, Layers, Search, ChevronDown } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";

// ---- Interfaces ----
interface Setor {
  id: string;
  nome: string;
}

interface Agente {
  id: string;
  nome: string;
  email: string;
}

interface Fila {
  id: string;
  nome: string;
  descricao?: string;
  ativa: boolean;
  agentes: Agente[];
}

// ---- Helper: Iniciais ----
const Iniciais = ({ nome, size = 32 }: { nome: string; size?: number }) => {
  const ini = nome.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];
  const color = colors[nome.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color + "22",
      border: `2px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color, flexShrink: 0
    }}>{ini}</div>
  );
};

// ---- Componente Principal ----
export default function FilasPage() {
  const [filas, setFilas] = useState<Fila[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]); // Estado para setores
  const [loading, setLoading] = useState(true);
  const [modalFila, setModalFila] = useState<"novo" | Fila | null>(null);
  const [modalAgentes, setModalAgentes] = useState<Fila | null>(null);

  // 1. Carregar Filas, Agentes e Setores
  const carregarDados = async () => {
    setLoading(true);
    
    // Busca Setores para o Modal
    const { data: setoresData } = await supabase.from("setores").select("id, nome").eq("ativo", true);
    if (setoresData) setSetores(setoresData);

    const { data, error } = await supabase
      .from("filas")
      .select(`
        *,
        usuarios_filas (
          usuario_id,
          usuarios (*)
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formatadas = data.map((f: any) => ({
        ...f,
        agentes: f.usuarios_filas?.map((rel: any) => rel.usuarios).filter(Boolean) || []
      }));
      setFilas(formatadas);
    }
    setLoading(false);
  };

  useEffect(() => { carregarDados(); }, []);

// 2. Salvar Fila (Insert/Update aprimorado)
const salvarFila = async (dados: { nome: string; descricao: string; setor_id?: string; ativa: boolean }) => {
  try {
    if (modalFila === "novo") {
      // Lógica de criação (já implementada anteriormente)
      const { data: novaFila, error: filaError } = await supabase
        .from("filas")
        .insert([{ nome: dados.nome, descricao: dados.descricao, ativa: true }])
        .select().single();

      if (filaError) throw filaError;

      if (dados.setor_id) {
        await supabase.from("setores_filas").insert([{ setor_id: dados.setor_id, fila_id: novaFila.id }]);
      }
    } else if (modalFila) {
      // --- Lógica de EDIÇÃO ---
      // 1. Atualiza dados básicos e status (Ativa/Inativa)
      const { error: updateError } = await supabase
        .from("filas")
        .update({ 
          nome: dados.nome, 
          descricao: dados.descricao, 
          ativa: dados.ativa // Novo campo de status
        })
        .eq("id", (modalFila as Fila).id);

      if (updateError) throw updateError;

      // 2. Atualiza o Setor (Remove o antigo e insere o novo)
      if (dados.setor_id) {
        await supabase.from("setores_filas").delete().eq("fila_id", (modalFila as Fila).id);
        await supabase.from("setores_filas").insert([{ setor_id: dados.setor_id, fila_id: (modalFila as Fila).id }]);
      }
    }
    
    setModalFila(null);
    carregarDados();
  } catch (err: any) {
    alert("Erro ao salvar: " + err.message);
  }
};

  // 3. Salvar Relacionamento de Agentes
  const salvarAgentesFila = async (agentesSelecionados: Agente[]) => {
    if (!modalAgentes) return;
    await supabase.from("usuarios_filas").delete().eq("fila_id", modalAgentes.id);
    if (agentesSelecionados.length > 0) {
      const inserts = agentesSelecionados.map(a => ({
        fila_id: modalAgentes.id,
        usuario_id: a.id
      }));
      await supabase.from("usuarios_filas").insert(inserts);
    }
    setModalAgentes(null);
    carregarDados();
  };

  const excluirFila = async (id: string) => {
    if (confirm("Excluir esta fila?")) {
      await supabase.from("filas").delete().eq("id", id);
      carregarDados();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Filas de Atendimento</h1>
            <p className="text-slate-500">Gerencie equipes e fluxos de entrada</p>
          </div>
          <button onClick={() => setModalFila("novo")} className="flex gap-2 items-center bg-[#00a884] text-white px-4 py-2 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-100">
            <Plus size={20} /> Nova Fila
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filas.map(fila => (
            <div key={fila.id} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{fila.nome}</h3>
                    <p className="text-xs text-slate-400">{fila.agentes.length} agente(s)</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${fila.ativa ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {fila.ativa ? "ATIVA" : "INATIVA"}
                </span>
              </div>

              <div className="flex -space-x-2">
                {fila.agentes.slice(0, 5).map(a => <Iniciais key={a.id} nome={a.nome} size={28} />)}
                {fila.agentes.length > 5 && (
                  <div className="w-7 h-7 bg-slate-100 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold">+ {fila.agentes.length - 5}</div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setModalAgentes(fila)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-sm font-semibold text-slate-600 transition-all">
                  <Users size={16} /> Agentes
                </button>
                <button onClick={() => setModalFila(fila)} className="p-2 text-slate-400 hover:text-slate-600"><Pencil size={18}/></button>
                <button onClick={() => excluirFila(fila.id)} className="p-2 text-red-300 hover:text-red-500"><Trash2 size={18}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Fila com Select de Setores */}
      {modalFila && (
        <ModalFilaForm 
          fila={modalFila === "novo" ? null : modalFila} 
          setores={setores}
          onClose={() => setModalFila(null)} 
          onSave={salvarFila} 
        />
      )}

      {modalAgentes && <ModalGerenciarAgentes fila={modalAgentes} onClose={() => setModalAgentes(null)} onSave={salvarAgentesFila} />}
    </DashboardLayout>
  );
}

const ModalFilaForm = ({ fila, setores, onClose, onSave }: any) => {
  const [nome, setNome] = useState(fila?.nome || "");
  const [descricao, setDescricao] = useState(fila?.descricao || "");
  const [setorId, setSetorId] = useState(fila?.setor_id || ""); // Estado para o setor
  const [ativa, setAtiva] = useState(fila ? fila.ativa : true); // Estado para inativar

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] w-full max-w-md p-8 shadow-2xl space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">{fila ? "Editar Fila" : "Nova Fila"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
        </div>

        <div className="space-y-4">
          {/* Campo de Nome */}
          <div>
            <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Nome</label>
            <input className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#00a884]" value={nome} onChange={e => setNome(e.target.value)} />
          </div>

          {/* Campo de Setor (Aparece tanto na criação quanto na edição) */}
          <div className="relative">
            <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Setor Responsável</label>
            <select 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#00a884] appearance-none cursor-pointer"
              value={setorId}
              onChange={e => setSetorId(e.target.value)}
            >
              <option value="">Selecione um setor...</option>
              {setores.map((s: any) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 bottom-4 text-slate-400 pointer-events-none" size={20} />
          </div>

          {/* Toggle para Inativar Fila (Apenas na edição) */}
          <div className="flex items-center gap-3 p-2">
            <button 
              onClick={() => setAtiva(!ativa)}
              className={`w-12 h-6 rounded-full transition-all relative ${ativa ? 'bg-[#00a884]' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ativa ? 'right-1' : 'left-1'}`} />
            </button>
            <span className="text-sm font-bold text-slate-600">Fila {ativa ? 'Ativa' : 'Inativa'}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl">Cancelar</button>
          <button 
            onClick={() => onSave({ nome, descricao, setor_id: setorId, ativa })} 
            className="flex-1 py-4 bg-[#00a884] text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

// ... Restante do código (ModalGerenciarAgentes) se mantém igual
const ModalGerenciarAgentes = ({ fila, onClose, onSave }: any) => {
  const [usuarios, setUsuarios] = useState<Agente[]>([]);
  const [selecionados, setSelecionados] = useState<Agente[]>(fila.agentes || []);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      const { data } = await supabase.from("usuarios").select("*").ilike('nome', `%${busca}%`);
      if (data) setUsuarios(data);
    };
    fetchUsuarios();
  }, [busca]);

  const toggleAgente = (u: Agente) => {
    setSelecionados(prev => prev.find(x => x.id === u.id) ? prev.filter(x => x.id !== u.id) : [...prev, u]);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Agentes na Fila</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="p-4 border-b bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input className="w-full pl-10 pr-4 py-2 rounded-xl border-none focus:ring-2 focus:ring-[#00a884]" placeholder="Buscar agentes..." value={busca} onChange={e => setBusca(e.target.value)} />
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto p-4 space-y-2">
          {usuarios.map(u => (
            <button key={u.id} onClick={() => toggleAgente(u)} className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${selecionados.find(x => x.id === u.id) ? 'border-[#00a884] bg-emerald-50' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <Iniciais nome={u.nome} size={36} />
                <div className="text-left"><p className="font-bold text-sm text-slate-800">{u.nome}</p><p className="text-xs text-slate-400">{u.email}</p></div>
              </div>
              {selecionados.find(x => x.id === u.id) && <Check className="text-[#00a884]" size={20} />}
            </button>
          ))}
        </div>
        <div className="p-6 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-500">Cancelar</button>
          <button onClick={() => onSave(selecionados)} className="flex-1 py-3 bg-[#00a884] text-white rounded-2xl font-bold">Salvar Agentes</button>
        </div>
      </div>
    </div>
  );
};