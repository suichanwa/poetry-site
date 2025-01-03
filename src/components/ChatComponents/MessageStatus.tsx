// src/components/ChatComponents/MessageStatus.tsx
import { Check } from 'lucide-react';

interface MessageStatusProps {
  status: 'sent' | 'delivered' | 'read';
}

export function MessageStatus({ status }: MessageStatusProps) {
  return (
    <div className="flex items-center text-xs text-muted-foreground">
      {status === 'sent' && <Check className="w-3 h-3" />}
      {status === 'delivered' && (
        <div className="flex">
          <Check className="w-3 h-3" />
          <Check className="w-3 h-3 -ml-1" />
        </div>
      )}
      {status === 'read' && (
        <div className="flex text-primary">
          <Check className="w-3 h-3" />
          <Check className="w-3 h-3 -ml-1" />
        </div>
      )}
    </div>
  );
}