// src/pages/ChatPage.tsx
import { useState } from 'react';
import { ChatList } from '@/components/ChatComponents/ChatList';
import { ChatWindow } from '@/components/ChatComponents/ChatWindow';

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  return (
    <div className="container py-6">
      <div className="flex gap-6">
        <ChatList onChatSelect={setSelectedChatId} />
        {selectedChatId ? (
          <div className="flex-1">
            <ChatWindow chatId={selectedChatId} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}