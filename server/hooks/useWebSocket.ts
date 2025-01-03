// src/hooks/useWebSocket.ts
import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const socket = new WebSocket('ws://localhost:3000');
    ws.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'AUTH',
        token: localStorage.getItem('token')
      }));
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      socket.close();
    };
  }, [user]);

  return ws.current;
}