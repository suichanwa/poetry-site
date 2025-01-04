import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWebSocket } from '@/hooks/useWebSocket';
import { formatDistanceToNow } from 'date-fns';

interface Chat {
  id: number;
  participants: {
    id: number;
    name: string;
    avatar?: string;
  }[];
  lastMessage?: {
    content: string;
    createdAt: string;
  };
}

export function ChatList({ onChatSelect }: { onChatSelect: (chatId: number) => void }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { onlineUsers } = useWebSocket();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/chats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch chats');
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000?token=${localStorage.getItem('token')}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_MESSAGE') {
        // Update chat list with new message
        setChats(prevChats => {
          const updatedChats = prevChats.map(chat => {
            if (chat.id === data.chatId) {
              return {
                ...chat,
                lastMessage: {
                  content: data.message.content,
                  createdAt: data.message.createdAt
                }
              };
            }
            return chat;
          });
          return updatedChats;
        });
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="h-[600px] w-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] w-80">
      <ScrollArea className="h-full p-4">
        <div className="space-y-4">
          {chats.length === 0 ? (
            <p className="text-center text-muted-foreground">No conversations yet</p>
          ) : (
            chats.map(chat => {
              const otherParticipant = chat.participants.find(p => p.id !== user?.id);
              if (!otherParticipant) return null;

              const isOnline = onlineUsers.includes(otherParticipant.id);

              return (
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {otherParticipant.avatar ? (
                        <img
                          src={`http://localhost:3000${otherParticipant.avatar}`}
                          alt={otherParticipant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-primary">{otherParticipant.name[0]}</span>
                      )}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{otherParticipant.name}</p>
                      {isOnline && (
                        <span className="text-xs text-muted-foreground">online</span>
                      )}
                    </div>
                    {chat.lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage.content}
                        <span className="ml-2 text-xs">
                          {formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}