import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Users, QrCode, Wifi, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Painel" },
  { to: "/filas", icon: ListOrdered, label: "Filas" },
  { to: "/conversas", icon: MessageSquare, label: "Conversas" },
  { to: "/qrcode", icon: QrCode, label: "QR Code" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
          <Wifi className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold text-sidebar-foreground">Viva Connection</h1>
          <p className="text-xs text-sidebar-muted">Atendimento WhatsApp</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <link.icon className="h-4.5 w-4.5" />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground">
            VC
          </div>
          <div>
            <p className="text-xs font-medium text-sidebar-foreground">Admin</p>
            <p className="text-[10px] text-sidebar-muted">admin@vivaconnection.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
