// src/components/ChatComponents/MessageInput.tsx
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Send, Paperclip, X } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTyping: () => void;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  isSubmitting: boolean;
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  onTyping,
  selectedFile,
  onFileSelect,
  onFileClear,
  isSubmitting
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 border-t">
      <form onSubmit={onSubmit} className="space-y-2">
        {selectedFile && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <Paperclip className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm truncate">{selectedFile.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onFileClear}
              className="ml-auto"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
          >
            <Image className="h-4 w-4" />
          </Button>
          <Input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              onTyping();
            }}
            placeholder="Type a message..."
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button type="submit" size="icon" disabled={isSubmitting || !value.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}