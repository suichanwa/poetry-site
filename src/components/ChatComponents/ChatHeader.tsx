// src/components/ChatComponents/ChatHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  participant: {
    id: number;
    name: string;
    avatar?: string;
  };
  isTyping: boolean;
  onBack?: () => void;
}

export function ChatHeader({ participant, isTyping, onBack }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b">
      {onBack && (
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          {participant.avatar ? (
            <AvatarImage src={participant.avatar} />
          ) : (
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium">{participant.name}</p>
          {isTyping && (
            <p className="text-xs text-muted-foreground">typing...</p>
          )}
        </div>
      </div>
    </div>
  );
}