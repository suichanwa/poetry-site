// src/components/ChatComponents/ChatWindow.tsx
import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Image, Paperclip, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { useWebSocket } from '@/hooks/useWebSocket';
import { MessageStatus } from './MessageStatus';
import { TypingIndicator } from './TypingIndicator';

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

interface ChatWindowProps {
  chatId: number;
}

export function ChatWindow({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { user } = useAuth();
  const ws = useWebSocket();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/chats/${chatId}/messages`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data.reverse());
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'NEW_MESSAGE':
          if (data.chatId === chatId) {
            setMessages(prev => [...prev, data.message]);
            scrollToBottom();
          }
          break;
        case 'TYPING':
          if (data.chatId === chatId && data.userId !== user?.id) {
            setIsTyping(true);
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
            }
            typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
          }
          break;
        case 'READ_RECEIPT':
          if (data.chatId === chatId) {
            setMessages(prev => prev.map(msg => 
              msg.id <= data.messageId ? { ...msg, read: true } : msg
            ));
          }
          break;
      }
    };

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [ws, chatId, user?.id]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    if (!ws) return;
    
    ws.send(JSON.stringify({
      type: 'TYPING',
      chatId,
      userId: user?.id
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !ws || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('content', newMessage);
      formData.append('chatId', chatId.toString());

      const response = await fetch('http://localhost:3000/api/chats/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const message = await response.json();
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      ws.send(JSON.stringify({
        type: 'NEW_MESSAGE',
        chatId,
        message
      }));

      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === user?.id
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
                  {message.senderId === user?.id && (
                    <MessageStatus status={message.read ? 'read' : 'sent'} />
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="space-y-2">
          {selectedFile && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <Paperclip className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm truncate">{selectedFile.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
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
              onChange={handleFileSelect}
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
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button type="submit" size="icon" disabled={isSubmitting}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}