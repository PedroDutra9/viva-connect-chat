import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // 1. Configuração de CORS para permitir que qualquer serviço (como a Evolution) chame a função
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }

  try {
    // 2. Conecta ao seu banco Supabase usando as variáveis automáticas da Edge Function
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 3. Recebe os dados da Evolution API
    const body = await req.json()
    console.log("🔔 Evento recebido:", body.event)
    console.log("📦 Dados da instância:", body.instance)

    // 4. Lógica para Salvar Mensagens (Exemplo)
    if (body.event === 'messages.upsert') {
      const payload = body.data;
      // Aqui você faria o insert na sua tabela de mensagens
      // const { error } = await supabase.from('mensagens').insert([{ ... }])
    }

    return new Response(
      JSON.stringify({ status: "success", received: body.event }),
      { headers, status: 200 }
    )

  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers, status: 400 }
    )
  }
})