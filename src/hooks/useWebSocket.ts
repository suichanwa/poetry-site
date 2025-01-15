import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const maxRetries = 5;
  const retryCount = useRef(0);

  const sendMessage = (data: any) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }
    try {
      ws.current.send(JSON.stringify(data));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (!user) return;

    const connect = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const socket = new WebSocket(`ws://localhost:3001?token=${token}`);
        
        socket.onopen = () => {
          console.log('WebSocket connected');
          ws.current = socket;
          setIsConnected(true);
          retryCount.current = 0;
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'ONLINE_USERS') {
              setOnlineUsers(data.users);
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        socket.onclose = () => {
          console.log('WebSocket disconnected');
          ws.current = null;
          setIsConnected(false);
          
          if (retryCount.current < maxRetries) {
            retryCount.current += 1;
            const timeout = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
            reconnectTimeoutRef.current = setTimeout(connect, timeout);
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          socket.close();
        };

      } catch (error) {
        console.error('Error establishing connection:', error);
      }
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close(1000, 'Component unmounting');
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user]);

  return { ws: ws.current, onlineUsers, isConnected, sendMessage };
}