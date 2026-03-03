import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("vc_logged_in") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
          <Route path="/conversas" element={<RequireAuth><ConversasPage /></RequireAuth>} />
          <Route path="/filas" element={<RequireAuth><FilasPage /></RequireAuth>} />
          <Route path="/qrcode" element={<RequireAuth><QRCodePage /></RequireAuth>} />

          {/* Placeholder pages */}
          <Route path="/historico" element={<RequireAuth><PlaceholderPage title="Histórico de Atendimentos" description="Consulte todos os atendimentos finalizados com filtros avançados." /></RequireAuth>} />
          <Route path="/contatos" element={<RequireAuth><ContatosPage /></RequireAuth>} />
          <Route path="/canais" element={<RequireAuth><ChannelsPage /></RequireAuth>} />
          <Route path="/grupos" element={<RequireAuth><PlaceholderPage title="Grupos" description="Agrupe canais com regras de roteamento e direcionamento por setor." /></RequireAuth>} />
          <Route path="/fluxos" element={<RequireAuth><FluxosPage /></RequireAuth>} />
          <Route path="/agentes-ia" element={<RequireAuth><PlaceholderPage title="Agentes IA" description="Configure bots inteligentes com personalidade e funções específicas." /></RequireAuth>} />
          <Route path="/ferramentas-ia" element={<RequireAuth><PlaceholderPage title="Ferramentas de IA" description="Classificação automática, análise de sentimento e sugestão de respostas." /></RequireAuth>} />
          <Route path="/base-conhecimento" element={<RequireAuth><PlaceholderPage title="Base de Conhecimento" description="Artigos, FAQs e documentação para treinamento da IA." /></RequireAuth>} />
          <Route path="/integracoes" element={<RequireAuth><PlaceholderPage title="Integrações" description="Conecte APIs, CRM, ERP, gateways de pagamento e webhooks." /></RequireAuth>} />
          <Route path="/equipe" element={<RequireAuth><EquipePage /></RequireAuth>} />
          <Route path="/setores" element={<RequireAuth><SetoresPage /></RequireAuth>} />
          <Route path="/configuracoes" element={<RequireAuth><PlaceholderPage title="Configurações" description="Dados da empresa, idioma, aparência e regras gerais." /></RequireAuth>} />
          <Route path="/auditoria" element={<RequireAuth><PlaceholderPage title="Auditoria" description="Logs do sistema e rastreamento de ações dos usuários." /></RequireAuth>} />
          <Route path="/documentacao" element={<RequireAuth><PlaceholderPage title="Documentação" description="Guias de uso, tutoriais e documentação da API." /></RequireAuth>} />
          <Route path="/licenca" element={<RequireAuth><PlaceholderPage title="Limites da Licença" description="Visualize limites de usuários, canais, atendimentos e consumo de IA." /></RequireAuth>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
