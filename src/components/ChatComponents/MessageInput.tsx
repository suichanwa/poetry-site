import { ChangeEvent, FormEvent, useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, FilePlus, XCircle, Loader2, ImageOff } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onTyping: () => void;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  isSubmitting: boolean;
  chatId: number;
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  onTyping,
  selectedFile,
  onFileSelect,
  onFileClear,
  isSubmitting,
  chatId,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    onTyping();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }

    // Cleanup function to revoke the object URL
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [selectedFile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    onSubmit(e);

    try {
      const formData = new FormData();
      formData.append("chatId", chatId.toString());
      formData.append("content", value.trim());
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch("http://localhost:3001/api/chats/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const message = await response.json();
      console.log("Message sent:", message);

      // Clear the input and file
      onChange("");
      onFileClear();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="p-4 border-t">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSubmitting}
        >
          <FilePlus className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="pr-10"
            disabled={isSubmitting}
          />
          {isSubmitting && (
            <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
          )}
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={isSubmitting || (!value.trim() && !selectedFile)}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
      {selectedFile && (
        <div className="mt-2 p-2 bg-muted rounded-md flex items-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Selected file preview"
              className="h-10 w-10 object-cover mr-2"
            />
          ) : (
            <FilePlus className="w-4 h-4 mr-2" />
          )}
          <span className="text-sm truncate">{selectedFile.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              onFileClear();
              setImagePreview(null); // Clear the image preview
            }}
            className="ml-auto"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}