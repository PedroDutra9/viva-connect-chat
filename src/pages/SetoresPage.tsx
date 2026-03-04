import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Building2, Clock, Layers, Bot, X, Check } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";

// ---- Interfaces ----
interface HorarioDia { ativo: boolean; inicio: string; fim: string; }
interface Horario { [key: string]: HorarioDia; }
interface Setor {
  id: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  horario: Horario;
  filas: string[];
}

const diasSemana = [
  { key: "segunda", label: "Segunda" },
  { key: "terca",   label: "Terça" },
  { key: "quarta",  label: "Quarta" },
  { key: "quinta",  label: "Quinta" },
  { key: "sexta",   label: "Sexta" },
  { key: "sabado",  label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];

const SetoresPage = () => {
  const [setores, setSetores] = useState<Setor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalSetor, setModalSetor] = useState<"novo" | Setor | null>(null);

  const fetchSetores = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("setores").select("*").order("nome");
    if (!error) setSetores(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchSetores(); }, []);

  // 1. FUNCIONALIDADE: EXCLUIR
  const handleExcluir = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este setor?")) return;
    const { error } = await supabase.from("setores").delete().eq("id", id);
    if (error) alert("Erro ao excluir");
    else fetchSetores();
  };

  // 2. FUNCIONALIDADE: VER FILAS (Navegação Mock)
  const handleVerFilas = (id: string) => {
    console.log("Navegando para filas do setor:", id);
    // Ex: router.push(`/setores/${id}/filas`)
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 bg-[#f8fafc] min-h-screen">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Setores</h1>
            <p className="text-slate-500">Organize seus departamentos e equipes</p>
          </div>
          <button onClick={() => setModalSetor("novo")} className="bg-[#00a884] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold hover:bg-[#008f70] transition-all shadow-sm">
            <Plus size={20} /> Novo Setor
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00a884]"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {setores.map(s => (
              <div key={s.id} className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#e6f6f3] flex items-center justify-center text-[#00a884]">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{s.nome}</h3>
                      <p className="text-xs text-slate-400">{s.filas?.length || 0} fila(s)</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${s.ativo ? 'bg-[#e6f6f3] text-[#00a884]' : 'bg-red-50 text-red-500'}`}>
                    {s.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleVerFilas(s.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-600 rounded-xl font-medium text-sm transition-colors"
                  >
                    <Layers size={16} /> Ver Filas
                  </button>
                  <button className="p-2.5 bg-[#e6f6f3] text-[#00a884] rounded-xl hover:bg-[#d1ede7] transition-colors"><Bot size={18}/></button>
                  <button onClick={() => setModalSetor(s)} className="p-2.5 bg-[#f1f5f9] text-slate-500 rounded-xl hover:bg-[#e2e8f0] transition-colors"><Pencil size={18}/></button>
                  <button onClick={() => handleExcluir(s.id)} className="p-2.5 bg-[#fff1f2] text-red-500 rounded-xl hover:bg-[#ffe4e6] transition-colors"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalSetor && (
        <ModalSetorForm 
          setor={modalSetor === "novo" ? null : modalSetor} 
          onClose={() => setModalSetor(null)} 
          onSave={fetchSetores} 
        />
      )}
    </DashboardLayout>
  );
};

// --- Modal de Formulário (Baseado na Imagem 8) ---
const ModalSetorForm = ({ setor, onClose, onSave }: any) => {
  const [nome, setNome] = useState(setor?.nome || "");
  const [desc, setDesc] = useState(setor?.descricao || "");
  const [ativo, setAtivo] = useState(setor ? setor.ativo : true);
  const [horarios, setHorarios] = useState<Horario>(setor?.horario || {
    segunda: { ativo: false, inicio: "08:00", fim: "18:00" },
    terca:   { ativo: false, inicio: "08:00", fim: "18:00" },
    quarta:  { ativo: false, inicio: "08:00", fim: "18:00" },
    quinta:  { ativo: false, inicio: "08:00", fim: "18:00" },
    sexta:   { ativo: false, inicio: "08:00", fim: "18:00" },
    sabado:  { ativo: false, inicio: "08:00", fim: "18:00" },
    domingo: { ativo: false, inicio: "08:00", fim: "18:00" },
  });

  const handleToggleDia = (dia: string) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: { ...prev[dia], ativo: !prev[dia].ativo }
    }));
  };

  const handleSalvar = async () => {
    const payload = { nome, descricao: desc, ativo, horario: horarios, filas: setor?.filas || [] };
    const { error } = setor 
      ? await supabase.from("setores").update(payload).eq("id", setor.id)
      : await supabase.from("setores").insert([payload]);

    if (error) alert("Erro ao salvar");
    else { onSave(); onClose(); }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-800">{setor ? "Editar Setor" : "Novo Setor"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <input className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#00a884] transition-all" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
            <textarea className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#00a884] transition-all h-24" placeholder="Descrição (opcional)" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div onClick={() => setAtivo(!ativo)} className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${ativo ? 'bg-[#00a884] border-[#00a884]' : 'border-slate-300'}`}>
              {ativo && <Check size={16} className="text-white" />}
            </div>
            <span className="font-medium text-slate-700">Setor ativo</span>
          </label>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#00a884] font-bold">
                <Clock size={20} /> <span>Horário de Funcionamento</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Check size={14} className="text-[#00a884]"/> Configurar horários
              </div>
            </div>

            <div className="space-y-2">
              {diasSemana.map((dia) => (
                <div key={dia.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
                  <div className="flex items-center gap-4">
                    <input 
                      type="checkbox" 
                      checked={horarios[dia.key].ativo} 
                      onChange={() => handleToggleDia(dia.key)}
                      className="w-5 h-5 accent-[#00a884] cursor-pointer"
                    />
                    <span className="font-semibold text-slate-700 w-20">{dia.label}</span>
                  </div>
                  
                  {horarios[dia.key].ativo ? (
                    <div className="flex items-center gap-2">
                      <input type="time" value={horarios[dia.key].inicio} className="bg-white px-3 py-1 rounded-lg border text-sm" onChange={e => setHorarios({...horarios, [dia.key]: {...horarios[dia.key], inicio: e.target.value}})} />
                      <span className="text-slate-400">até</span>
                      <input type="time" value={horarios[dia.key].fim} className="bg-white px-3 py-1 rounded-lg border text-sm" onChange={e => setHorarios({...horarios, [dia.key]: {...horarios[dia.key], fim: e.target.value}})} />
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 font-medium">Fechado</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex justify-end gap-3 bg-slate-50 rounded-b-[32px]">
          <button onClick={onClose} className="px-6 py-2.5 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
          <button onClick={handleSalvar} className="bg-[#00a884] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#008f70] transition-all shadow-md">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default SetoresPage;