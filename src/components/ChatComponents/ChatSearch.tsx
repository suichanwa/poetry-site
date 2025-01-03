// src/components/ChatComponents/ChatSearch.tsx
import { Input } from "@/components/ui/input";

interface ChatSearchProps {
  onSearch: (query: string) => void;
}

export function ChatSearch({ onSearch }: ChatSearchProps) {
  return (
    <div className="p-4 border-b">
      <Input
        placeholder="Search conversations..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full"
      />
    </div>
  );
}