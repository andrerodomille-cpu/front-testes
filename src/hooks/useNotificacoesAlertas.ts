import { useEffect, useState } from "react";

export interface Notificacao {
  idConexao: number;
  tipo: "info" | "atencao" | "critico";
  resumo: string;
  dados?: any;
}

export default function useNotificacoesAlertas(idConexao: number | null) {
  const [mensagens, setMensagens] = useState<Notificacao[]>([]);

  useEffect(() => {
    if (idConexao === null) return;

    const baseUrl = import.meta.env.VITE_API_URL_NOTIFICACOES;
    if (!baseUrl) {
      console.error("VITE_API_URL_NOTIFICACOES não configurado no .env");
      return;
    }

    const wsUrl = baseUrl.replace(/^http/, "ws");
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ idConexao }));
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data: Notificacao = JSON.parse(event.data);
        setMensagens(prev => [data, ...prev]);
      } catch (err) {
        console.error("Erro ao parsear mensagem WS:", err);
      }
    };

    ws.onerror = (err) => console.error("Erro WS:", err);

    return () => ws.close();
  }, [idConexao]);

  return mensagens;
}