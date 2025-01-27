// src/pages/ChatPage.tsx
import { useState, useEffect } from "react";
import { ChatList } from "@/components/ChatComponents/ChatList";
import { ChatWindow } from "@/components/ChatComponents/ChatWindow";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function ChatPage() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container h-[calc(100vh-4rem)] p-0 sm:py-6">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={isMobile ? 100 : 25}
          minSize={isMobile ? 0 : 15}
          className={selectedChatId && isMobile ? "hidden" : ""}
        >
          <ChatList
            onChatSelect={setSelectedChatId}
            selectedChatId={selectedChatId}
          />
        </ResizablePanel>
        {isMobile && selectedChatId && (
          <ResizableHandle withHandle className="w-0" />
        )}
        {!isMobile && <ResizableHandle withHandle />}
        <ResizablePanel
          defaultSize={isMobile ? 0 : 75}
          minSize={isMobile ? 0 : 30}
          className={
            !selectedChatId && isMobile
              ? "hidden"
              : isMobile
              ? "w-full"
              : "w-auto flex-1"
          }
        >
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}