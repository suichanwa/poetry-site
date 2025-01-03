// src/components/ChatComponents/ChatList.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWebSocket } from '@/hooks/useWebSocket';
import { cn } from '@/lib/utils';

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
  const { user } = useAuth();
  const { onlineUsers } = useWebSocket();

  // ... existing fetch logic ...

  return (
    <Card className="h-[600px] w-80">
      <ScrollArea className="h-full p-4">
        <div className="space-y-4">
          {chats.map(chat => {
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
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}