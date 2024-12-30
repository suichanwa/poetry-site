import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { verifyToken } from '../middleware/auth.middleware';

interface ExtendedWebSocket extends WebSocket {
  userId?: number;
  isAlive?: boolean;
}

class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<number, ExtendedWebSocket> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.init();
  }

  private init() {
    this.wss.on('connection', async (ws: ExtendedWebSocket, req) => {
      try {
        // Get token from query string
        const token = new URL(req.url!, `ws://${req.headers.host}`).searchParams.get('token');
        if (!token) {
          ws.close(1008, 'No authentication token provided');
          return;
        }

        // Verify token and get user ID
        const decoded = await verifyToken(token);
        ws.userId = decoded.id;
        ws.isAlive = true;

        // Store client connection
        this.clients.set(decoded.id, ws);

        // Set up ping-pong for connection health check
        ws.on('pong', () => {
          ws.isAlive = true;
        });

        ws.on('close', () => {
          if (ws.userId) {
            this.clients.delete(ws.userId);
          }
        });

      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close(1008, 'Authentication failed');
      }
    });

    // Set up connection health checks
    setInterval(() => {
      this.wss.clients.forEach((ws: ExtendedWebSocket) => {
        if (!ws.isAlive) {
          if (ws.userId) {
            this.clients.delete(ws.userId);
          }
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  sendToUser(userId: number, data: any) {
    const client = this.clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }

  broadcastToAll(data: any) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }
}

export let wsService: WebSocketService;

export const initWebSocket = (server: Server) => {
  wsService = new WebSocketService(server);
  return wsService;
};