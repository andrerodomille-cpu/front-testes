import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";


import Config from '../config/config';

export function useNotifications(
  usuarioId: number,
  onUpdate: (total: number) => void) {
  const socketRef = useRef<Socket | null>(null);

  const API_URL = Config.URL_SERVICE_ERP.slice(0, -4);
  
  useEffect(() => {
    if (!usuarioId) return;
    
    const socket = io(API_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;
    socket.emit("join", usuarioId);
    socket.on("nova_notificacao", (data) => {
      if (data?.total !== undefined) {
        onUpdate(data.total);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [usuarioId]);
}
