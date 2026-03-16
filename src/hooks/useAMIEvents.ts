// hooks/useAMIEvents.ts
import { useEffect, useState } from "react";
import Config from '../config/config';

export interface AMIEvent {
  evento: string;
  msg: string;
  uniqueId?: string;      // ✅ adiciona aqui
  numero?: string;
  fila?: string;
  agente?: string;
  position?: string | number;
  holdTime?: string | number;
  talkTime?: string | number;
  raw?: Record<string, any>;
  timestamp?: string;
  loja?: string;
  pdv?: string;
  supervisor?: string;
}
export function useAMIEvents(idConfig: string | null) {
  const [events, setEvents] = useState<AMIEvent[]>([]);

  useEffect(() => {
    /*
    if (!idConfig) return; // não conecta se não tiver idConfig

    // Cria conexão SSE parametrizada
    const API_URL = Config.URL_SERVICE_FiSCAL_REMOTO;
    const source = new EventSource(`${API_URL}ami?id=${idConfig}`);

    // Recebe mensagens do servidor
    source.onmessage = (event) => {
      try {
        const data: AMIEvent = JSON.parse(event.data);
        setEvents((prev) => [data, ...prev]); // adiciona no topo
      } catch (err) {
        console.error("Erro ao parsear evento SSE:", err);
      }
    };

    // Trata erros
    source.onerror = (err) => {
      console.error(`[SSE] Erro conexão idConfig=${idConfig}:`, err);
      source.close();
    };

    return () => {
      source.close();
    };
    */
  }, [idConfig]);

  return events;
}
