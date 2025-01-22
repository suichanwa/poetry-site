// src/pages/ChatPage.tsx
import { useState, useEffect } from 'react';
import { ChatList } from '@/components/ChatComponents/ChatList';
import { ChatWindow } from '@/components/ChatComponents/ChatWindow';
import { Separator } from "@/components/ui/separator"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container h-[calc(100vh-4rem)] p-0 sm:py-6">
        <ResizablePanelGroup
            direction="horizontal"
            className="h-full"
        >
            <ResizablePanel defaultSize={25} minSize={15} className={`${selectedChatId && isMobile ? 'hidden' : ''}`}>
                <ChatList
                    onChatSelect={(chatId) => {
                        setSelectedChatId(chatId);
                    }}
                    selectedChatId={selectedChatId}
                />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75} minSize={30}>
                <div className={`${!selectedChatId && isMobile ? 'hidden' : 'flex'} flex-col h-full relative`}>
                    {selectedChatId ? (
                        <ChatWindow
                            chatId={selectedChatId}
                            onBack={isMobile ? () => setSelectedChatId(null) : undefined}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                            Select a chat to start messaging
                        </div>
                    )}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  );
}