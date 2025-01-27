import { Paperclip, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { MessageStatus } from "./MessageStatus";
import { useState } from "react";

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
    reactions?: { userId: number; reaction: string }[];
  };
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const [isLiked, setIsLiked] = useState(
    message.reactions?.some((reaction) => reaction.reaction === "heart") || false
  );

  const handleDoubleClick = async () => {
    if (isLiked) return;

    try {
      const response = await fetch(`http://localhost:3001/api/chats/messages/${message.id}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reaction: "heart" }),
      });

      if (!response.ok) {
        throw new Error("Failed to add reaction");
      }

      setIsLiked(true);
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
      onDoubleClick={handleDoubleClick}
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
            src={`http://localhost:3001${message.fileUrl}`}
            alt="Message attachment"
            className="max-w-full rounded-lg mb-2"
          />
        )}
        {message.type === 'file' && message.fileUrl && (
          <a 
            href={`http://localhost:3001${message.fileUrl}`}
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
        {isLiked && (
          <div className="flex items-center mt-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="ml-1 text-xs text-red-500">You liked this</span>
          </div>
        )}
      </div>
    </div>
  );
}