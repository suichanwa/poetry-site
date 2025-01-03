// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

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

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ONLINE_USERS') {
        setOnlineUsers(data.users);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setOnlineUsers([]);
    };

    return () => {
      socket.close();
    };
  }, [user]);

  return { ws: ws.current, onlineUsers };
}