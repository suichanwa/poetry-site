// src/pages/ChatPage.tsx
import { useState } from 'react';
import { ChatList } from '@/components/ChatComponents/ChatList';
import { ChatWindow } from '@/components/ChatComponents/ChatWindow';

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isMobile] = useState(window.innerWidth < 768);

  return (
    <div className="container h-[calc(100vh-4rem)] p-0 sm:py-6">
      <div className="flex h-full gap-6">
        {/* Chat List - Hide on mobile when chat is selected */}
        <div className={`
          ${selectedChatId && isMobile ? 'hidden' : 'flex'} 
          md:flex 
          w-full md:w-80 
          h-full 
          border-r md:border-none
        `}>
          <ChatList 
            onChatSelect={(chatId) => {
              setSelectedChatId(chatId);
            }}
            selectedChatId={selectedChatId}
          />
        </div>

        {/* Chat Window */}
        <div className={`
          ${!selectedChatId && isMobile ? 'hidden' : 'flex'} 
          flex-1 
          h-full
          relative
        `}>
          {selectedChatId ? (
            <ChatWindow 
              chatId={selectedChatId} 
              onBack={isMobile ? () => setSelectedChatId(null) : undefined}
            />
          ) : (
            <div className="hidden md:flex items-center justify-center w-full h-full text-muted-foreground">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}