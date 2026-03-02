import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, MessageSquare, QrCode, Wifi, ListOrdered, Users, Phone,
  Globe, Layers, GitBranch, Brain, Bot, Wrench, BookOpen, Plug, Building2,
  UserCog, FolderTree, Settings, FileText, Shield, Scale, LogOut,
  ChevronDown, Headphones, Mail, MessageCircle, Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarSection {
  title: string;
  items: { to: string; icon: any; label: string }[];
}

const sections: SidebarSection[] = [
  {
    title: "Visão Geral",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    title: "Atendimento",
    items: [
      { to: "/conversas", icon: MessageSquare, label: "Conversas" },
      { to: "/filas", icon: ListOrdered, label: "Filas" },
      { to: "/historico", icon: Headphones, label: "Histórico" },
    ],
  },
  {
    title: "Central",
    items: [
      { to: "/contatos", icon: Users, label: "Contatos" },
      { to: "/canais", icon: Globe, label: "Canais" },
      { to: "/grupos", icon: Layers, label: "Grupos" },
    ],
  },
  {
    title: "Fluxos",
    items: [
      { to: "/fluxos", icon: GitBranch, label: "Automações" },
    ],
  },
  {
    title: "Inteligência",
    items: [
      { to: "/agentes-ia", icon: Bot, label: "Agentes IA" },
      { to: "/ferramentas-ia", icon: Wrench, label: "Ferramentas" },
      { to: "/base-conhecimento", icon: BookOpen, label: "Base de Conhecimento" },
    ],
  },
  {
    title: "Integrações",
    items: [
      { to: "/integracoes", icon: Plug, label: "Integrações" },
    ],
  },
  {
    title: "Organização",
    items: [
      { to: "/equipe", icon: UserCog, label: "Equipe" },
      { to: "/setores", icon: Building2, label: "Setores" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { to: "/configuracoes", icon: Settings, label: "Configurações" },
      { to: "/auditoria", icon: Shield, label: "Auditoria" },
      { to: "/documentacao", icon: FileText, label: "Documentação" },
      { to: "/licenca", icon: Scale, label: "Limites da Licença" },
      { to: "/qrcode", icon: QrCode, label: "QR Code" },
    ],
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (title: string) =>
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));

  const handleLogout = () => {
    localStorage.removeItem("vc_logged_in");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary">
          <Wifi className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-foreground">LumiChat</h1>
          <p className="text-[10px] text-sidebar-muted">Plataforma Omnichannel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
        {sections.map((section) => {
          const isCollapsed = collapsed[section.title] ?? false;
          const hasActive = section.items.some((i) => location.pathname === i.to);

          return (
            <div key={section.title}>
              <button
                onClick={() => toggle(section.title)}
                className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted hover:text-sidebar-foreground/70 transition-colors"
              >
                {section.title}
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    isCollapsed && "-rotate-90"
                  )}
                />
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5 mt-0.5 mb-2">
                  {section.items.map((link) => {
                    const isActive = location.pathname === link.to;
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                        )}
                      >
                        <link.icon className="h-4 w-4 shrink-0" />
                        {link.label}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground">
              AD
            </div>
            <div>
              <p className="text-xs font-medium text-sidebar-foreground">Admin</p>
              <p className="text-[10px] text-sidebar-muted">Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sidebar-muted hover:text-destructive transition-colors"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
