import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wifi, 
  WifiOff, 
  Plus, 
  QrCode, 
  Trash2, 
  X, 
  ChevronDown, 
  RefreshCw, 
  Instagram, 
  Facebook, 
  MessageCircle,
  Bot
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/lib/supabase";

// 1. Mapeamento de Opções para evitar erro de Constraint no Banco
const CANAL_OPTIONS = [
  { value: "whatsapp", label: "WhatsApp QR Code - Pessoal", icon: <MessageCircle className="h-5 w-5 text-[#25D366]" />, color: "#25D366" },
  { value: "whatsapp_business", label: "WhatsApp Business API - Oficial", icon: <MessageCircle className="h-5 w-5 text-[#075E54]" />, color: "#075E54" },
  { value: "instagram", label: "Instagram Direct", icon: <Instagram className="h-5 w-5 text-[#E1306C]" />, color: "#E1306C" },
  { value: "facebook", label: "Facebook Messenger", icon: <Facebook className="h-5 w-5 text-[#1877F2]" />, color: "#1877F2" },
];

interface Channel {
  id: string;
  nome: string;
  tipo: string; // Valor curto: 'whatsapp', 'instagram', etc.
  status: string;
  numero: string | null;
  session_id: string | null;
}

const ChannelsPage = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados do Formulário
  const [novoNome, setNovoNome] = useState("");
  const [novoTipo, setNovoTipo] = useState("whatsapp");

  const totalLimit = 30;

  const fetchChannels = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('canais')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setChannels(data);
    setLoading(false);
  };

  useEffect(() => { fetchChannels(); }, []);

  const handleCreateChannel = async () => {
    if (!novoNome) return alert("Digite um nome para o canal");

    // Envia o valor curto (novoTipo) para não violar a constraint do banco
    const { error } = await supabase
      .from('canais')
      .insert([{ 
        nome: novoNome, 
        tipo: novoTipo, 
        status: 'desconectado' 
      }]);

    if (error) {
      alert("Erro ao criar: " + error.message);
    } else {
      setIsModalOpen(false);
      setNovoNome("");
      fetchChannels();
    }
  };

  const deleteChannel = async (id: string) => {
    if (!confirm("Deseja realmente remover este canal?")) return;
    const { error } = await supabase.from('canais').delete().eq('id', id);
    if (!error) fetchChannels();
  };

  const currentUsage = channels.length;

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#00a884]/10 p-3 rounded-2xl">
              <Wifi className="text-[#00a884]" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Canais de Atendimento</h1>
              <p className="text-slate-500">Gerencie seus canais de comunicação</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={fetchChannels} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
              <RefreshCw size={20} className={`text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#00a884] text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Plus size={20} /> Novo Canal
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-end mb-4">
            <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Uso de Canais</p>
            <p className="text-sm font-bold text-slate-400">
              <span className="text-[#00a884]">{currentUsage}</span> / {totalLimit}
            </p>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(currentUsage / totalLimit) * 100}%` }}
              className="h-full bg-[#00a884] rounded-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", val: currentUsage, color: "text-slate-800" },
            { label: "Conectados", val: channels.filter(c => c.status === 'conectado').length, color: "text-[#00a884]" },
            { label: "Desconectados", val: channels.filter(c => c.status === 'desconectado').length, color: "text-rose-500" },
            { label: "Automatizados", val: 0, color: "text-amber-500" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-xs font-bold text-slate-400 uppercase">{stat.label}</p>
              <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => {
            const config = CANAL_OPTIONS.find(o => o.value === channel.tipo);
            return (
              <div key={channel.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      {config?.icon || <MessageCircle className="text-slate-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{channel.nome}</h3>
                      {channel.numero && <p className="text-sm text-slate-400 font-medium">{channel.numero}</p>}
                      <span className="text-[10px] bg-emerald-50 text-[#00a884] px-2 py-0.5 rounded-md font-bold uppercase mt-1 inline-block">
                        {channel.tipo}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    channel.status === 'conectado' ? 'bg-emerald-100 text-[#00a884]' : 'bg-rose-100 text-rose-500'
                  }`}>
                    {channel.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <button className={`w-full py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                    channel.status === 'conectado' ? 'text-rose-500 hover:bg-rose-50' : 'bg-[#00a884] text-white hover:bg-[#008f6f]'
                  }`}>
                    {channel.status === 'conectado' ? <><WifiOff size={18}/> Desconectar</> : <><QrCode size={18}/> Conectar</>}
                  </button>
                  <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 flex items-center justify-center gap-2">
                      <Bot size={18}/> Automação
                    </button>
                    <button onClick={() => deleteChannel(channel.id)} className="p-3 text-rose-500 bg-rose-50 rounded-2xl hover:bg-rose-100">
                      <Trash2 size={20}/>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Novo Canal</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Nome do canal</label>
                  <input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Ex: Atendimento Principal" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#00a884] mt-1" />
                </div>

                <div className="relative">
                  <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Tipo de canal</label>
                  <select value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)}
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-[#00a884] appearance-none cursor-pointer mt-1 font-medium text-slate-700"
                  >
                    {CANAL_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 bottom-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl">Cancelar</button>
                <button onClick={handleCreateChannel} className="flex-1 py-4 bg-[#00a884] text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 active:scale-95">Criar Canal</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default ChannelsPage;