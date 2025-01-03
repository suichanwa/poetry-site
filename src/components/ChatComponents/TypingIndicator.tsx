// src/components/ChatComponents/TypingIndicator.tsx
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-muted-foreground text-sm p-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
        <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
        <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
      </div>
      <span>Someone is typing...</span>
    </div>
  );
}