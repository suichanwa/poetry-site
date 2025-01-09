// src/components/ChatComponents/MessageList.tsx
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypingIndicator } from "./TypingIndicator";
import { MessageBubble } from "./MessageBubble";

interface Message {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  read: boolean;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  userId: number;
}

export function MessageList({ messages, isTyping, userId }: MessageListProps) {
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  console.log('Rendering messages:', messages); // Log messages to render

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === userId}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messageEndRef} />
      </div>
    </ScrollArea>
  );
}