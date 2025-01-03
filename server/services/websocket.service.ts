import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import { verifyToken } from '../middleware/auth.middleware';
import { notificationService } from './notification.service';

interface ExtendedWebSocket extends WebSocket {
  userId?: number;
  isAlive?: boolean;
}

class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<number, ExtendedWebSocket> = new Map();
  private reconnectAttempts: Map<number, number> = new Map();
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.init();
    this.setupHeartbeat();
  }

    private handleMessage(message: WebSocket.Data) {
    try {
      const data = JSON.parse(message.toString());
      
      switch (data.type) {
        case 'NEW_MESSAGE':
          this.broadcastToChat(data.chatId, data);
          break;
        case 'TYPING':
          this.broadcastToChat(data.chatId, data);
          break;
        case 'READ_RECEIPT':
          this.broadcastToChat(data.chatId, data);
          break;
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private init() {
    this.wss.on('connection', async (ws: ExtendedWebSocket, req) => {
      try {
        const token = new URL(req.url!, `ws://${req.headers.host}`).searchParams.get('token');
        if (!token) {
          ws.close(1008, 'No authentication token provided');
          return;
        }

        const decoded = await verifyToken(token);
        ws.userId = decoded.id;
        ws.isAlive = true;

        // Store client connection
        this.clients.set(decoded.id, ws);
        this.reconnectAttempts.delete(decoded.id); // Reset reconnect attempts on successful connection

        // Set up ping-pong for connection health check
        ws.on('pong', () => {
          ws.isAlive = true;
        });

        ws.on('message', this.handleMessage.bind(this));

        ws.on('close', () => {
          if (ws.userId) {
            this.clients.delete(ws.userId);
            this.handleDisconnection(ws.userId);
          }
        });

        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          this.handleDisconnection(ws.userId!);
        });

      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close(1008, 'Authentication failed');
      }
    });
  }

  private setupHeartbeat() {
    const interval = setInterval(() => {
      this.wss.clients.forEach((ws: ExtendedWebSocket) => {
        if (!ws.isAlive) {
          if (ws.userId) {
            this.handleDisconnection(ws.userId);
          }
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // 30 second interval

    this.wss.on('close', () => {
      clearInterval(interval);
    });
  }

  private handleDisconnection(userId: number) {
    const attempts = this.reconnectAttempts.get(userId) || 0;
    if (attempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts.set(userId, attempts + 1);
      // Attempt reconnection after increasing delay
      setTimeout(() => {
        this.attemptReconnect(userId);
      }, Math.pow(2, attempts) * 1000);
    }
  }

  private async attemptReconnect(userId: number) {
    try {
      const client = this.clients.get(userId);
      if (client?.readyState === WebSocket.CLOSED) {
        // Trigger reconnection logic here
        notificationService.removeConnection(userId);
      }
    } catch (error) {
      console.error('Reconnection attempt failed:', error);
    }
  }

  private handleMessage(message: WebSocket.Data) {
    try {
      const data = JSON.parse(message.toString());
      switch (data.type) {
        case 'NOTIFICATION_READ':
          this.handleNotificationRead(data);
          break;
        case 'NOTIFICATION_CLEAR':
          this.handleNotificationClear(data);
          break;
        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  private async handleNotificationRead(data: any) {
    // Handle notification read logic
  }

  private async handleNotificationClear(data: any) {
    // Handle notification clear logic
  }

  public broadcast(data: any) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  public sendToUser(userId: number, data: any) {
    const client = this.clients.get(userId);
    if (client?.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }

   private broadcastToChat(chatId: number, data: any) {
    this.clients.forEach((client, userId) => {
      if (client.readyState === WebSocket.OPEN) {
        // Check if user is part of the chat before sending
        prisma.chat.findFirst({
          where: {
            id: chatId,
            participants: {
              some: { id: userId }
            }
          }
        }).then(chat => {
          if (chat) {
            client.send(JSON.stringify(data));
          }
        });
      }
    });
  }
}

export let wsService: WebSocketService;

export const initWebSocket = (server: Server) => {
  wsService = new WebSocketService(server);
  return wsService;
};