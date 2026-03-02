import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play, MessageSquare, List, GitBranch, Clock, Users,
  Globe, RefreshCw, Image, Square, Variable, X, Plus,
  ChevronLeft, Save, Zap, Trash2, Settings, ArrowRight
} from "lucide-react";

// ---- Block Type Definitions ----
const BLOCK_TYPES = [
  { type: "inicio",       label: "Inicio",        icon: Play,         color: "#22c55e", bg: "#dcfce7" },
  { type: "mensagem",     label: "Mensagem",       icon: MessageSquare,color: "#3b82f6", bg: "#dbeafe" },
  { type: "opcoes",       label: "Opções",         icon: List,         color: "#8b5cf6", bg: "#ede9fe" },
  { type: "condicao",     label: "Condição",       icon: GitBranch,    color: "#f59e0b", bg: "#fef3c7" },
  { type: "pergunta",     label: "Pergunta",       icon: Clock,        color: "#06b6d4", bg: "#cffafe" },
  { type: "transferir",   label: "Transferir",     icon: Users,        color: "#f97316", bg: "#ffedd5" },
  { type: "http",         label: "HTTP Request",   icon: Globe,        color: "#10b981", bg: "#d1fae5" },
  { type: "loop",         label: "Loop",           icon: RefreshCw,    color: "#6366f1", bg: "#e0e7ff" },
  { type: "midia",        label: "Mídia",          icon: Image,        color: "#ec4899", bg: "#fce7f3" },
  { type: "fim",          label: "Fim",            icon: Square,       color: "#ef4444", bg: "#fee2e2" },
  { type: "variaveis",    label: "Variáveis",      icon: Variable,     color: "#64748b", bg: "#f1f5f9" },
];

const getBlockDef = (type) => BLOCK_TYPES.find(b => b.type === type) || BLOCK_TYPES[0];

// ---- Default content per block type ----
const defaultContent = (type) => {
  switch (type) {
    case "mensagem":   return { text: "Digite sua mensagem aqui..." };
    case "opcoes":     return { prompt: "Escolha uma opção:", options: ["Opção 1", "Opção 2"] };
    case "condicao":   return { variable: "", operator: "==", value: "" };
    case "pergunta":   return { question: "Qual é o seu nome?", variable: "nome_usuario" };
    case "transferir": return { queue: "Suporte", agent: "" };
    case "http":       return { method: "GET", url: "https://api.exemplo.com/endpoint" };
    case "loop":       return { times: 3, variable: "" };
    case "midia":      return { mediaType: "image", url: "" };
    case "variaveis":  return { vars: [{ key: "variavel", value: "" }] };
    default:           return {};
  }
};

let nextId = 10;

// ---- Block Component ----
const FlowBlock = ({ block, selected, onSelect, onDrag, onDelete, onConnect, connecting }) => {
  const def = getBlockDef(block.type);
  const Icon = def.icon;
  const dragStart = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest(".port") || e.target.closest(".delete-btn")) return;
    e.stopPropagation();
    dragStart.current = { mx: e.clientX, my: e.clientY, bx: block.x, by: block.y };
    onSelect(block.id);

    const move = (me) => {
      const dx = me.clientX - dragStart.current.mx;
      const dy = me.clientY - dragStart.current.my;
      onDrag(block.id, dragStart.current.bx + dx, dragStart.current.by + dy);
    };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const renderContent = () => {
    const c = block.content || {};
    switch (block.type) {
      case "inicio":     return <p className="text-xs text-gray-500">Ponto de entrada do fluxo</p>;
      case "mensagem":   return <p className="text-xs text-gray-700 line-clamp-3">{c.text}</p>;
      case "opcoes":     return (
        <div>
          <p className="text-xs text-gray-600 mb-1">{c.prompt}</p>
          {(c.options || []).map((o, i) => <p key={i} className="text-xs text-gray-700">{i+1}. {o}</p>)}
        </div>
      );
      case "condicao":   return <p className="text-xs text-gray-600">Se {c.variable} {c.operator} {c.value}</p>;
      case "pergunta":   return <p className="text-xs text-gray-700">{c.question}</p>;
      case "transferir": return <p className="text-xs text-gray-700">Fila: {c.queue}</p>;
      case "http":       return <p className="text-xs text-gray-600 font-mono">{c.method} {c.url?.substring(0,30)}...</p>;
      case "loop":       return <p className="text-xs text-gray-600">Repetir {c.times}x</p>;
      case "midia":      return <p className="text-xs text-gray-600">{c.mediaType}: {c.url || "sem URL"}</p>;
      case "fim":        return <p className="text-xs text-gray-500">Finaliza o fluxo</p>;
      case "variaveis":  return <p className="text-xs text-gray-600">{(c.vars||[]).map(v=>v.key).join(", ")}</p>;
      default: return null;
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{ left: block.x, top: block.y, position: "absolute", width: 200, cursor: "grab", zIndex: selected ? 10 : 1 }}
    >
      <div style={{
        background: "white",
        border: `2px solid ${selected ? def.color : "#e5e7eb"}`,
        borderRadius: 12,
        boxShadow: selected ? `0 0 0 3px ${def.color}33` : "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "visible",
        position: "relative"
      }}>
        {/* Header */}
        <div style={{ background: def.bg, borderBottom: `1px solid ${def.color}33`, padding: "8px 10px", borderRadius: "10px 10px 0 0", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon size={14} color={def.color} />
          <span style={{ fontSize: 12, fontWeight: 600, color: def.color }}>{def.label}</span>
          <button
            className="delete-btn"
            onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2 }}
          >
            <X size={12} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: "8px 10px", minHeight: 40 }}>
          {renderContent()}
        </div>
        {/* Output port */}
        {block.type !== "fim" && (
          <div
            className="port"
            onMouseDown={(e) => { e.stopPropagation(); onConnect(block.id, "out"); }}
            style={{
              position: "absolute", right: -8, bottom: 16, width: 16, height: 16,
              background: def.color, border: "2px solid white", borderRadius: "50%",
              cursor: "crosshair", zIndex: 20,
              boxShadow: "0 0 0 2px " + def.color + "55"
            }}
          />
        )}
        {/* Input port */}
        {block.type !== "inicio" && (
          <div
            className="port"
            style={{
              position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)",
              width: 14, height: 14, background: "#e5e7eb", border: "2px solid #9ca3af",
              borderRadius: "50%", zIndex: 20
            }}
          />
        )}
      </div>
    </div>
  );
};

// ---- Editor Panel ----
const EditorPanel = ({ block, onChange }) => {
  if (!block) return (
    <div style={{ padding: 24, color: "#9ca3af", textAlign: "center" }}>
      <Settings size={32} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
      <p style={{ fontSize: 13 }}>Selecione um bloco para editar</p>
    </div>
  );

  const def = getBlockDef(block.type);
  const Icon = def.icon;
  const c = block.content || {};

  const update = (field, value) => onChange({ ...block, content: { ...c, [field]: value } });

  const renderFields = () => {
    switch (block.type) {
      case "mensagem":
        return (
          <div>
            <label style={labelStyle}>Mensagem</label>
            <textarea
              style={inputStyle}
              rows={5}
              value={c.text || ""}
              onChange={e => update("text", e.target.value)}
              placeholder="Digite a mensagem do bot..."
            />
          </div>
        );
      case "opcoes":
        return (
          <div>
            <label style={labelStyle}>Texto da pergunta</label>
            <input style={inputStyle} value={c.prompt||""} onChange={e=>update("prompt",e.target.value)} />
            <label style={{...labelStyle, marginTop: 12}}>Opções</label>
            {(c.options||[]).map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input
                  style={{...inputStyle, flex: 1, marginBottom: 0}}
                  value={opt}
                  onChange={e => {
                    const opts = [...(c.options||[])];
                    opts[i] = e.target.value;
                    update("options", opts);
                  }}
                  placeholder={`Opção ${i+1}`}
                />
                <button
                  onClick={() => { const opts=[...(c.options||[])]; opts.splice(i,1); update("options",opts); }}
                  style={{ background: "#fee2e2", border:"none", borderRadius:6, padding:"0 8px", cursor:"pointer", color:"#ef4444" }}
                ><X size={12}/></button>
              </div>
            ))}
            <button
              onClick={() => update("options", [...(c.options||[]), ""])}
              style={{ ...addBtnStyle, marginTop: 4 }}
            ><Plus size={12}/> Adicionar opção</button>
          </div>
        );
      case "condicao":
        return (
          <div>
            <label style={labelStyle}>Variável</label>
            <input style={inputStyle} value={c.variable||""} onChange={e=>update("variable",e.target.value)} placeholder="ex: status" />
            <label style={{...labelStyle,marginTop:10}}>Operador</label>
            <select style={inputStyle} value={c.operator||"=="} onChange={e=>update("operator",e.target.value)}>
              {["==","!=",">","<",">=","<=","contains"].map(op=><option key={op}>{op}</option>)}
            </select>
            <label style={{...labelStyle,marginTop:10}}>Valor</label>
            <input style={inputStyle} value={c.value||""} onChange={e=>update("value",e.target.value)} placeholder="ex: ativo" />
          </div>
        );
      case "pergunta":
        return (
          <div>
            <label style={labelStyle}>Pergunta</label>
            <textarea style={inputStyle} rows={3} value={c.question||""} onChange={e=>update("question",e.target.value)} />
            <label style={{...labelStyle,marginTop:10}}>Salvar resposta em</label>
            <input style={inputStyle} value={c.variable||""} onChange={e=>update("variable",e.target.value)} placeholder="ex: nome_usuario" />
          </div>
        );
      case "transferir":
        return (
          <div>
            <label style={labelStyle}>Fila</label>
            <input style={inputStyle} value={c.queue||""} onChange={e=>update("queue",e.target.value)} placeholder="ex: Suporte Técnico" />
            <label style={{...labelStyle,marginTop:10}}>Agente específico (opcional)</label>
            <input style={inputStyle} value={c.agent||""} onChange={e=>update("agent",e.target.value)} placeholder="ex: João" />
          </div>
        );
      case "http":
        return (
          <div>
            <label style={labelStyle}>Método</label>
            <select style={inputStyle} value={c.method||"GET"} onChange={e=>update("method",e.target.value)}>
              {["GET","POST","PUT","DELETE","PATCH"].map(m=><option key={m}>{m}</option>)}
            </select>
            <label style={{...labelStyle,marginTop:10}}>URL</label>
            <input style={inputStyle} value={c.url||""} onChange={e=>update("url",e.target.value)} placeholder="https://api.exemplo.com" />
            <label style={{...labelStyle,marginTop:10}}>Body (JSON)</label>
            <textarea style={{...inputStyle,fontFamily:"monospace",fontSize:11}} rows={4} value={c.body||""} onChange={e=>update("body",e.target.value)} placeholder='{}'/>
          </div>
        );
      case "loop":
        return (
          <div>
            <label style={labelStyle}>Repetições</label>
            <input style={inputStyle} type="number" value={c.times||3} onChange={e=>update("times",parseInt(e.target.value))} />
            <label style={{...labelStyle,marginTop:10}}>Variável de controle</label>
            <input style={inputStyle} value={c.variable||""} onChange={e=>update("variable",e.target.value)} placeholder="ex: contador" />
          </div>
        );
      case "midia":
        return (
          <div>
            <label style={labelStyle}>Tipo de mídia</label>
            <select style={inputStyle} value={c.mediaType||"image"} onChange={e=>update("mediaType",e.target.value)}>
              {["image","video","audio","document"].map(t=><option key={t}>{t}</option>)}
            </select>
            <label style={{...labelStyle,marginTop:10}}>URL da mídia</label>
            <input style={inputStyle} value={c.url||""} onChange={e=>update("url",e.target.value)} placeholder="https://..." />
            <label style={{...labelStyle,marginTop:10}}>Legenda (opcional)</label>
            <input style={inputStyle} value={c.caption||""} onChange={e=>update("caption",e.target.value)} />
          </div>
        );
      case "variaveis":
        return (
          <div>
            <label style={labelStyle}>Variáveis</label>
            {(c.vars||[]).map((v,i)=>(
              <div key={i} style={{display:"flex",gap:4,marginBottom:6,alignItems:"center"}}>
                <input style={{...inputStyle,flex:1,marginBottom:0}} value={v.key} onChange={e=>{const vs=[...(c.vars||[])];vs[i]={...vs[i],key:e.target.value};update("vars",vs);}} placeholder="chave" />
                <span style={{color:"#9ca3af",fontSize:12}}>=</span>
                <input style={{...inputStyle,flex:1,marginBottom:0}} value={v.value} onChange={e=>{const vs=[...(c.vars||[])];vs[i]={...vs[i],value:e.target.value};update("vars",vs);}} placeholder="valor" />
                <button onClick={()=>{const vs=[...(c.vars||[])];vs.splice(i,1);update("vars",vs);}} style={{background:"#fee2e2",border:"none",borderRadius:6,padding:"4px 6px",cursor:"pointer",color:"#ef4444"}}><X size={11}/></button>
              </div>
            ))}
            <button onClick={()=>update("vars",[...(c.vars||[]),{key:"",value:""}])} style={{...addBtnStyle,marginTop:4}}><Plus size={12}/>Adicionar variável</button>
          </div>
        );
      default:
        return <p style={{color:"#9ca3af",fontSize:12}}>Sem configurações para este bloco.</p>;
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "10px 12px", background: def.bg, borderRadius: 8 }}>
        <Icon size={16} color={def.color} />
        <span style={{ fontWeight: 700, fontSize: 14, color: def.color }}>{def.label}</span>
      </div>
      {renderFields()}
    </div>
  );
};

const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 };
const inputStyle = { width: "100%", border: "1px solid #e5e7eb", borderRadius: 7, padding: "7px 10px", fontSize: 12, color: "#111827", outline: "none", background: "#fafafa", boxSizing: "border-box", marginBottom: 2 };
const addBtnStyle = { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6366f1", background: "#eef2ff", border: "none", borderRadius: 7, padding: "6px 12px", cursor: "pointer", fontWeight: 600 };

// ---- Main Editor ----
export default function FlowEditorPage({ fluxo, onVoltar }) {
  const [blocks, setBlocks] = useState([
    { id: 1, type: "inicio", x: 100, y: 100, content: {} },
    { id: 2, type: "mensagem", x: 360, y: 80, content: { text: "Olá! Seja bem-vindo(a) 👋" } },
    { id: 3, type: "opcoes", x: 360, y: 240, content: { prompt: "Como posso te ajudar?", options: ["Suporte", "Vendas", "Financeiro"] } },
  ]);
  const [connections, setConnections] = useState([
    { from: 1, to: 2 }, { from: 2, to: 3 }
  ]);
  const [selected, setSelected] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const canvasRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const panning = useRef(null);
  const [fluxoNome] = useState(fluxo?.nome || "Novo Fluxo");

  const selectedBlock = blocks.find(b => b.id === selected);

  const addBlock = (type) => {
    const id = nextId++;
    const rect = canvasRef.current?.getBoundingClientRect();
    const cx = rect ? (rect.width / 2 - offset.x) / zoom - 100 : 200;
    const cy = rect ? (rect.height / 2 - offset.y) / zoom - 60 : 200;
    setBlocks(prev => [...prev, { id, type, x: cx + Math.random()*40-20, y: cy + Math.random()*40-20, content: defaultContent(type) }]);
    setSelected(id);
  };

  const updateBlock = (updated) => setBlocks(prev => prev.map(b => b.id === updated.id ? updated : b));

  const deleteBlock = (id) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setConnections(prev => prev.filter(c => c.from !== id && c.to !== id));
    if (selected === id) setSelected(null);
  };

  const handleConnect = (id, port) => {
    if (!connecting) {
      setConnecting(id);
    } else {
      if (connecting !== id) {
        setConnections(prev => {
          const exists = prev.find(c => c.from === connecting && c.to === id);
          if (exists) return prev;
          return [...prev, { from: connecting, to: id }];
        });
      }
      setConnecting(null);
    }
  };

  // Canvas pan
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.closest(".canvas-bg")) {
      setSelected(null);
      if (connecting) setConnecting(null);
      panning.current = { mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y };
      const move = (me) => {
        setOffset({ x: panning.current.ox + me.clientX - panning.current.mx, y: panning.current.oy + me.clientY - panning.current.my });
      };
      const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); panning.current = null; };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    }
  };

  // Draw SVG connections
  const getBlockCenter = (block) => ({ x: block.x + 200, y: block.y + 60 });
  const getBlockLeft = (block) => ({ x: block.x, y: block.y + 60 });

  const svgLines = connections.map((conn, i) => {
    const from = blocks.find(b => b.id === conn.from);
    const to = blocks.find(b => b.id === conn.to);
    if (!from || !to) return null;
    const s = getBlockCenter(from);
    const e = getBlockLeft(to);
    const cx1 = s.x + (e.x - s.x) * 0.5;
    const cx2 = e.x - (e.x - s.x) * 0.5;
    return (
      <g key={i}>
        <path d={`M${s.x},${s.y} C${cx1},${s.y} ${cx2},${e.y} ${e.x},${e.y}`}
          stroke="#22c55e" strokeWidth={2} fill="none" strokeDasharray="6 3" opacity={0.7} />
        <circle cx={e.x} cy={e.y} r={4} fill="#22c55e" />
        <circle cx={s.x} cy={s.y} r={4} fill="#22c55e" />
        <path d={`M${e.x-8},${e.y-5} L${e.x},${e.y} L${e.x-8},${e.y+5}`} stroke="#22c55e" strokeWidth={2} fill="none"/>
        {/* Delete connection button */}
        <circle
          cx={(s.x+e.x)/2} cy={(s.y+e.y)/2} r={8} fill="white" stroke="#e5e7eb" strokeWidth={1}
          style={{cursor:"pointer"}}
          onClick={()=>setConnections(prev=>prev.filter((_,idx)=>idx!==i))}
        />
        <text x={(s.x+e.x)/2} y={(s.y+e.y)/2+4} textAnchor="middle" fontSize={10} fill="#9ca3af" style={{cursor:"pointer",userSelect:"none"}}
          onClick={()=>setConnections(prev=>prev.filter((_,idx)=>idx!==i))}>×</text>
      </g>
    );
  });

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc", fontFamily: "system-ui,sans-serif", overflow: "hidden" }}>
      {/* Left sidebar - block types */}
      <div style={{ width: sidebarOpen ? 200 : 0, overflow: "hidden", transition: "width 0.2s", background: "white", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 12px 8px", borderBottom: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>Blocos</p>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "8px 8px" }}>
          {BLOCK_TYPES.map(({ type, label, icon: Icon, color, bg }) => (
            <button
              key={type}
              onClick={() => addBlock(type)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                borderRadius: 8, border: "none", background: "transparent", cursor: "pointer",
                textAlign: "left", marginBottom: 2, transition: "background 0.1s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = bg}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ width: 28, height: 28, borderRadius: 7, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={14} color={color} />
              </div>
              <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ height: 56, background: "white", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, flexShrink: 0 }}>
          {onVoltar && (
            <button onClick={onVoltar} style={{ display:"flex",alignItems:"center",gap:6,background:"none",border:"1px solid #e5e7eb",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13,color:"#374151" }}>
              <ChevronLeft size={16}/> Voltar
            </button>
          )}
          <button onClick={()=>setSidebarOpen(s=>!s)} style={{ background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",display:"flex",alignItems:"center" }}>
            <List size={16} color="#6b7280"/>
          </button>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:16,fontWeight:700,color:"#111827",margin:0 }}>{fluxoNome}</p>
            <p style={{ fontSize:11,color:"#9ca3af",margin:0 }}>{blocks.length} blocos · {connecting ? <span style={{color:"#f59e0b"}}>Conectando... clique no destino</span> : "Ativo"}</p>
          </div>
          <button style={{ display:"flex",alignItems:"center",gap:6,background:"#f1f5f9",border:"none",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,color:"#374151" }}>
            <Zap size={15}/> Simular
          </button>
          <button style={{ display:"flex",alignItems:"center",gap:6,background:"#22c55e",border:"none",borderRadius:8,padding:"6px 16px",cursor:"pointer",fontSize:13,color:"white",fontWeight:600 }}>
            <Save size={15}/> Salvar
          </button>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          style={{ flex:1, position:"relative", overflow:"hidden", cursor: connecting ? "crosshair" : "default" }}
        >
          {/* Grid bg */}
          <div className="canvas-bg" style={{
            position:"absolute", inset:0, zIndex:0,
            backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            backgroundPosition: `${offset.x}px ${offset.y}px`
          }}/>

          {/* SVG connections */}
          <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", zIndex:1, pointerEvents:"all", overflow:"visible" }}
            transform={`translate(${offset.x},${offset.y}) scale(${zoom})`}>
            <g transform={`translate(${offset.x},${offset.y}) scale(${zoom})`}>
              {svgLines}
            </g>
          </svg>

          {/* Blocks */}
          <div style={{ position:"absolute", inset:0, zIndex:2, transform:`translate(${offset.x}px,${offset.y}px) scale(${zoom})`, transformOrigin:"0 0" }}>
            {blocks.map(block => (
              <FlowBlock
                key={block.id}
                block={block}
                selected={selected === block.id}
                onSelect={setSelected}
                onDrag={(id, x, y) => setBlocks(prev => prev.map(b => b.id === id ? { ...b, x, y } : b))}
                onDelete={deleteBlock}
                onConnect={handleConnect}
                connecting={connecting}
              />
            ))}
          </div>

          {/* Zoom controls */}
          <div style={{ position:"absolute", bottom:20, left:20, display:"flex", flexDirection:"column", gap:4, zIndex:10 }}>
            {[
              ["+", () => setZoom(z => Math.min(z+0.1, 2))],
              ["-", () => setZoom(z => Math.max(z-0.1, 0.3))],
              ["⊡", () => { setZoom(1); setOffset({x:0,y:0}); }]
            ].map(([label, fn]) => (
              <button key={label} onClick={fn} style={{ width:32,height:32,borderRadius:8,border:"1px solid #e5e7eb",background:"white",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(0,0,0,0.07)" }}>
                {label}
              </button>
            ))}
          </div>

          {connecting && (
            <div style={{ position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",background:"#f59e0b",color:"white",padding:"8px 20px",borderRadius:20,fontSize:13,fontWeight:600,zIndex:20,boxShadow:"0 4px 12px rgba(0,0,0,0.15)" }}>
              Clique em outro bloco para conectar · ESC para cancelar
            </div>
          )}
        </div>
      </div>

      {/* Right panel - block editor */}
      <div style={{ width: 260, background: "white", borderLeft: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>Propriedades</p>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <EditorPanel
            block={selectedBlock}
            onChange={updateBlock}
          />
        </div>
        {selectedBlock && (
          <div style={{ padding: 12, borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={() => deleteBlock(selectedBlock.id)}
              style={{ width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#fee2e2",border:"none",borderRadius:8,padding:"8px",cursor:"pointer",color:"#ef4444",fontSize:13,fontWeight:600 }}
            >
              <Trash2 size={14}/> Excluir bloco
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
