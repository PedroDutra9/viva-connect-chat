import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Download, Smartphone, Wifi } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const QRCodePage = () => {
  const [phone] = useState("5511999999999");
  const whatsappUrl = `https://wa.me/${phone}`;

  const handleDownload = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 512, 512);
        ctx.drawImage(img, 0, 0, 512, 512);
        const link = document.createElement("a");
        link.download = "viva-connection-qrcode.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">QR Code WhatsApp</h1>
          <p className="text-sm text-muted-foreground mt-1">Compartilhe o QR Code para atendimento</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-2xl p-8 flex flex-col items-center"
          >
            <div className="flex items-center gap-2 mb-6">
              <Wifi className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">LumiChat</h2>
            </div>

            <div className="bg-background p-4 rounded-xl border border-border">
              <QRCodeSVG
                id="qr-code-svg"
                value={whatsappUrl}
                size={240}
                level="H"
                fgColor="hsl(217, 91%, 50%)"
                bgColor="transparent"
              />
            </div>

            <p className="mt-6 text-sm text-muted-foreground text-center max-w-[260px]">
              📱 Aponte a câmera e fale com a <span className="font-semibold text-foreground">LumiChat</span>
            </p>

            <button
              onClick={handleDownload}
              className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Download className="h-4 w-4" />
              Baixar QR Code
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6 flex-1 max-w-md"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              Fluxo de Atendimento
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                <p className="text-muted-foreground">Cliente escaneia o QR Code e inicia conversa</p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                <p className="text-muted-foreground">Bot envia menu de opções automaticamente</p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                <p className="text-muted-foreground">Sistema coleta informações e direciona para a fila correta</p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</span>
                <p className="text-muted-foreground">Atendente recebe contexto completo e inicia atendimento</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Mensagem Inicial</p>
              <p className="text-sm text-foreground">
                👋 Olá! Seja bem-vindo à LumiChat 💙<br />
                Pra te atender melhor, me diga o que você precisa:<br /><br />
                1 - Quero contratar internet<br />
                2 - Já sou cliente<br />
                3 - Financeiro<br />
                4 - Falar com atendente
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QRCodePage;
