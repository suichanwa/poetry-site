import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/hooks/useWebSocket";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, XCircle, ChevronLeft, Phone, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  read: boolean;
  type: "text" | "image" | "file";
  fileUrl?: string;
  fileName?: string;
}

interface Participant {
  id: number;
  name: string;
  avatar?: string;
}

interface ChatWindowProps {
  chatId: number;
  onBack?: () => void;
}

export function ChatWindow({ chatId, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();
  const { ws, sendMessage, isConnected } = useWebSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for the end of the messages

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredMessages = messages.filter((message) =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchMessagesAndParticipant = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/chats/${chatId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();
        setMessages(data);

        const chatResponse = await fetch(
          `http://localhost:3001/api/chats/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!chatResponse.ok) {
          throw new Error("Failed to fetch chat details");
        }

        const chatData = await chatResponse.json();
        const otherParticipant = chatData.participants.find(
          (p: any) => p.id !== user?.id
        );

        if (otherParticipant) {
          setParticipant({
            id: otherParticipant.id,
            name: otherParticipant.name,
            avatar: otherParticipant.avatar,
          });
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessagesAndParticipant();
  }, [chatId, user?.id]);

  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "NEW_MESSAGE":
          if (
            data.chatId === chatId &&
            !messages.some((msg) => msg.id === data.message.id)
          ) {
            setMessages((prev) => [...prev, data.message]);
          }
          break;
        case "TYPING":
          if (data.chatId === chatId && data.userId !== user?.id) {
            setIsTyping(true);
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
          }
          break;
        case "READ_RECEIPT":
          if (data.chatId === chatId) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id <= data.messageId ? { ...msg, read: true } : msg
              )
            );
          }
          break;
      }
    };

    ws.addEventListener("message", handleMessage);
    return () => {
      ws.removeEventListener("message", handleMessage);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [ws, chatId, user?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;
    if (!ws || !isConnected || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("chatId", chatId.toString());
      formData.append("content", newMessage.trim());
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
      setMessages((prev) => [...prev, message]);

      sendMessage({
        type: "NEW_MESSAGE",
        chatId,
        message,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setNewMessage("");
      setSelectedFile(null);
      setIsSubmitting(false);
    }
  };

  const handleTyping = () => {
    if (!ws || !isConnected || !user) return;
    sendMessage({ type: "TYPING", chatId, userId: user.id });
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleFileClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getImageUrl = (path: string) => {
    return `http://localhost:3001${path}`;
  };

  return (
    <Card className="flex flex-col h-full pb-16"> {/* Added pb-16 for padding bottom */}
      <CardHeader className="flex flex-row items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {participant && (
          <>
            <Avatar className="w-8 h-8">
              {participant.avatar ? (
                <AvatarImage
                  src={getImageUrl(participant.avatar)}
                  alt={participant.name}
                />
              ) : (
                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{participant.name}</p>
              {isTyping && (
                <Badge variant="secondary" className="w-fit text-[10px]">
                  typing...
                </Badge>
              )}
            </div>
            <div className="ml-auto flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500 hover:bg-blue-100"
              >
                <Video className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500 hover:bg-blue-100"
              >
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <MessageList
            messages={filteredMessages}
            isTyping={isTyping}
            userId={user?.id}
          />
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <Separator />
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
        onTyping={handleTyping}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onFileClear={handleFileClear}
        isSubmitting={isSubmitting}
        chatId={chatId}
      />
    </Card>
  );
}