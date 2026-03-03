import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import LoginPage from "./pages/LoginPage";
import Index from "./pages/Index";
import FilasPage from "./pages/FilasPage";
import ConversasPage from "./pages/ConversasPage";
import ChannelsPage from "./pages/ChannelsPage";
import QRCodePage from "./pages/QRCodePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import FluxosPage from "./pages/FluxosPage";
import ContatosPage from "./pages/ContatosPage";
import EquipePage from "./pages/EquipePage";
import SetoresPage from "./pages/SetoresPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RequireAuth = ({ session, children }: { session: Session | null; children: React.ReactNode }) => {
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/"        element={<RequireAuth session={session}><Index /></RequireAuth>} />
            <Route path="/conversas" element={<RequireAuth session={session}><ConversasPage /></RequireAuth>} />
            <Route path="/filas"   element={<RequireAuth session={session}><FilasPage /></RequireAuth>} />
            <Route path="/qrcode"  element={<RequireAuth session={session}><QRCodePage /></RequireAuth>} />
            <Route path="/canais"  element={<RequireAuth session={session}><ChannelsPage /></RequireAuth>} />
            <Route path="/fluxos"  element={<RequireAuth session={session}><FluxosPage /></RequireAuth>} />
            <Route path="/equipe"  element={<RequireAuth session={session}><EquipePage /></RequireAuth>} />
            <Route path="/setores" element={<RequireAuth session={session}><SetoresPage /></RequireAuth>} />
            <Route path="/contatos" element={<RequireAuth session={session}><ContatosPage /></RequireAuth>} />
            <Route path="/historico" element={<RequireAuth session={session}><PlaceholderPage title="Histórico de Atendimentos" description="Consulte todos os atendimentos finalizados com filtros avançados." /></RequireAuth>} />
            <Route path="/grupos" element={<RequireAuth session={session}><PlaceholderPage title="Grupos" description="Agrupe canais com regras de roteamento e direcionamento por setor." /></RequireAuth>} />
            <Route path="/agentes-ia" element={<RequireAuth session={session}><PlaceholderPage title="Agentes IA" description="Configure bots inteligentes com personalidade e funções específicas." /></RequireAuth>} />
            <Route path="/ferramentas-ia" element={<RequireAuth session={session}><PlaceholderPage title="Ferramentas de IA" description="Classificação automática, análise de sentimento e sugestão de respostas." /></RequireAuth>} />
            <Route path="/base-conhecimento" element={<RequireAuth session={session}><PlaceholderPage title="Base de Conhecimento" description="Artigos, FAQs e documentação para treinamento da IA." /></RequireAuth>} />
            <Route path="/integracoes" element={<RequireAuth session={session}><PlaceholderPage title="Integrações" description="Conecte APIs, CRM, ERP, gateways de pagamento e webhooks." /></RequireAuth>} />
            <Route path="/configuracoes" element={<RequireAuth session={session}><PlaceholderPage title="Configurações" description="Dados da empresa, idioma, aparência e regras gerais." /></RequireAuth>} />
            <Route path="/auditoria" element={<RequireAuth session={session}><PlaceholderPage title="Auditoria" description="Logs do sistema e rastreamento de ações dos usuários." /></RequireAuth>} />
            <Route path="/documentacao" element={<RequireAuth session={session}><PlaceholderPage title="Documentação" description="Guias de uso, tutoriais e documentação da API." /></RequireAuth>} />
            <Route path="/licenca" element={<RequireAuth session={session}><PlaceholderPage title="Limites da Licença" description="Visualize limites de usuários, canais, atendimentos e consumo de IA." /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;