// src/components/ChatComponents/MessageBubble.tsx
import { Paperclip } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { MessageStatus } from "./MessageStatus";

interface MessageBubbleProps {
  message: {
    id: number;
    content: string;
    senderId: number;
    createdAt: string;
    read: boolean;
    type: 'text' | 'image' | 'file';
    fileUrl?: string;
    fileName?: string;
  };
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        {message.type === 'image' && message.fileUrl && (
          <img 
            src={`http://localhost:3000${message.fileUrl}`}
            alt="Message attachment"
            className="max-w-full rounded-lg mb-2"
          />
        )}
        {message.type === 'file' && message.fileUrl && (
          <a 
            href={`http://localhost:3000${message.fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mb-2 text-sm underline"
          >
            <Paperclip className="w-4 h-4" />
            {message.fileName}
          </a>
        )}
        <p>{message.content}</p>
        <div className="flex items-center justify-between text-xs opacity-70 mt-1">
          <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
          {isOwnMessage && (
            <MessageStatus status={message.read ? 'read' : 'sent'} />
          )}
        </div>
      </div>
    </div>
  );
}